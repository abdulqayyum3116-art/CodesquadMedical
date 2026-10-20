import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { unstable_noStore as noStore } from 'next/cache';
import { supabaseAdmin, supabaseEnabled, T } from './supabase';
import blogData from './data/blog-posts.json';
import caseData from './data/case-studies.json';

const ROOT = process.cwd();
const BLOG_JSON = join(ROOT, 'lib', 'data', 'blog-posts.json');
const CASE_JSON = join(ROOT, 'lib', 'data', 'case-studies.json');
const LEADS_JSON = join(ROOT, 'content', 'leads.json');
const BLOG_DIR = join(ROOT, 'content', 'blog');
const CASE_DIR = join(ROOT, 'content', 'case-studies');

// Local project files are a fallback for local development only. In production
// (any host) files are read-only or reset on deploy, so writes need Supabase.
const IS_PROD = process.env.NODE_ENV === 'production';
const localWritable = () => !IS_PROD && !process.env.VERCEL;

export const isLive = () => supabaseEnabled();
export const canWrite = () => supabaseEnabled() || localWritable();
export const NOT_CONFIGURED_MSG = 'Supabase is not configured on this server, so nothing can be saved. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the host\'s environment variables and restart the app.';

const readJson = (f, fallback) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch (e) { return fallback; } };
const writeJson = (f, d) => writeFileSync(f, JSON.stringify(d, null, 2) + '\n');

export const slugify = (s) => String(s || '').toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

// Turn a Supabase/PostgREST error into a readable message with a hint for the
// usual misconfigurations, and throw it.
function fail(context, error) {
  const raw = error?.message ?? error;
  const msg = typeof raw === 'string' && raw ? raw : (JSON.stringify(raw) || 'Unknown error');
  const code = error?.code || error?.statusCode || '';
  let hint = '';
  if (code === '42P01' || code === 'PGRST205' || /relation .* does not exist|Could not find the table/i.test(msg)) hint = 'The table is missing: run supabase/setup.sql in the Supabase SQL editor.';
  else if (code === 'PGRST204' || code === '42703' || /column/i.test(msg)) hint = 'The table columns don\'t match: re-run supabase/setup.sql.';
  else if (code === '42501' || /row-level security|permission denied/i.test(msg)) hint = 'SUPABASE_SERVICE_ROLE_KEY looks like the anon/public key. Use the service_role (secret) key.';
  else if (/invalid api key|jwt|unauthorized|invalid.*signature/i.test(msg)) hint = 'SUPABASE_SERVICE_ROLE_KEY is invalid or belongs to a different project than NEXT_PUBLIC_SUPABASE_URL.';
  else if (/bucket not found/i.test(msg)) hint = 'The storage bucket is missing: run supabase/setup.sql.';
  else if (/fetch failed|ENOTFOUND|ECONNREFUSED/i.test(msg)) hint = 'The server cannot reach NEXT_PUBLIC_SUPABASE_URL.';
  const err = new Error(`${context}: ${msg}${code ? ` (${code})` : ''}${hint ? ` — ${hint}` : ''}`);
  err.cause = error;
  throw err;
}

// Public pages keep working (from the bundled JSON) if Supabase has an outage;
// the dashboard passes { strict: true } so errors are shown instead of hidden.
function onReadError(context, error, strict) {
  if (strict) fail(context, error);
  console.error(`[store] ${context} failed, serving bundled data instead:`, error?.message || error);
}

// Health check shown on the dashboard, so a broken connection is never hidden.
export async function supabaseStatus() {
  noStore();
  const sb = supabaseAdmin();
  if (!sb) return { mode: localWritable() ? 'local' : 'unconfigured' };
  const problems = [];
  // A GET (not a HEAD request) so a failure comes back with Supabase's error message.
  const posts = await sb.from(T.posts).select('slug', { count: 'exact' }).limit(1);
  if (posts.error) problems.push(catchMsg(() => fail('Reading medspa_posts', posts.error)));
  const bucket = await sb.storage.getBucket(T.bucket);
  if (bucket.error) problems.push(catchMsg(() => fail(`Storage bucket ${T.bucket}`, bucket.error)));
  else if (!bucket.data?.public) problems.push(`Storage bucket ${T.bucket} is not public, so uploaded images won't display. Make it public in Supabase → Storage.`);
  return { mode: 'supabase', ok: problems.length === 0, problems, postCount: posts.count ?? null };
}
const catchMsg = (fn) => { try { fn(); } catch (e) { return e.message; } return ''; };

// ============ POSTS ============
export async function getPosts({ strict = false } = {}) {
  if (strict) noStore(); // the dashboard always reads fresh data
  const sb = supabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from(T.posts).select('slug,cat,date,title,excerpt,img,created_at').order('created_at', { ascending: false });
    if (!error) return data || [];
    onReadError('Loading posts', error, strict);
  }
  return readJson(BLOG_JSON, blogData);
}
export async function getPost(slug, { strict = false } = {}) {
  if (strict) noStore();
  const sb = supabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from(T.posts).select('*').eq('slug', slug).maybeSingle();
    // Supabase is the source of truth: a post that isn't there (e.g. deleted) is a 404.
    if (!error) return data || null;
    onReadError(`Loading post "${slug}"`, error, strict);
  }
  const p = readJson(BLOG_JSON, blogData).find((x) => x.slug === slug);
  return p ? { ...p, body: readFileMaybe(join(BLOG_DIR, `${slug}.html`)) } : null;
}
export async function getPostBody(slug) { const p = await getPost(slug); return p?.body || ''; }

// Creates or updates a post and returns its slug. Throws a readable Error on any failure.
export async function savePost({ original, post, bodyHtml }) {
  const slug = slugify(post.slug || post.title);
  if (!slug) throw new Error('Please enter a title (or slug) for the post.');
  const row = { slug, cat: post.cat || 'AI Automation', date: post.date || todayStr(), title: post.title || '', excerpt: post.excerpt || '', img: post.img || '', body: bodyHtml || '', updated_at: new Date().toISOString() };
  const oldSlug = original ? String(original) : null;
  const sb = supabaseAdmin();
  if (sb) return saveRow(sb, T.posts, 'post', { oldSlug, row });
  if (!localWritable()) throw new Error(NOT_CONFIGURED_MSG);
  return savePostLocal({ oldSlug, row, bodyHtml });
}
export async function deletePost(slug) {
  const sb = supabaseAdmin();
  if (sb) { const { error } = await sb.from(T.posts).delete().eq('slug', slug); if (error) fail('Deleting the post', error); return; }
  if (!localWritable()) throw new Error(NOT_CONFIGURED_MSG);
  writeJson(BLOG_JSON, readJson(BLOG_JSON, []).filter((x) => x.slug !== slug));
  const f = join(BLOG_DIR, `${slug}.html`); if (existsSync(f)) unlinkSync(f);
}

// Shared insert/update/rename for posts and case studies.
async function saveRow(sb, table, label, { oldSlug, row }) {
  noStore(); // checks below must see the live table, never a cached read
  const { slug } = row;
  if (slug !== oldSlug) {
    // Creating or renaming: never silently overwrite a different existing row.
    const { data: clash, error } = await sb.from(table).select('slug').eq('slug', slug).maybeSingle();
    if (error) fail(`Checking the ${label} URL`, error);
    if (clash) throw new Error(`A ${label} with the URL slug "${slug}" already exists. Choose a different title or slug.`);
  }
  if (oldSlug && oldSlug !== slug) {
    // Renaming keeps the original position in the list.
    const { data: old, error } = await sb.from(table).select('created_at').eq('slug', oldSlug).maybeSingle();
    if (error) fail(`Loading the existing ${label}`, error);
    if (old?.created_at) row = { ...row, created_at: old.created_at };
  }
  // New rows get created_at = now() from the table default, so they sort first.
  const { data, error } = await sb.from(table).upsert(row, { onConflict: 'slug' }).select('slug').single();
  if (error) fail(`Saving the ${label}`, error);
  if (!data?.slug) throw new Error(`Saving the ${label}: Supabase did not confirm the write.`);
  if (oldSlug && oldSlug !== slug) {
    const del = await sb.from(table).delete().eq('slug', oldSlug);
    if (del.error) fail(`Removing the old URL "${oldSlug}"`, del.error);
  }
  return slug;
}

// ============ CASE STUDIES ============
export async function getCases({ strict = false } = {}) {
  if (strict) noStore();
  const sb = supabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from(T.cases).select('slug,name,cat,filter,tagline,img,published,ord').order('ord', { ascending: true }).order('created_at', { ascending: false });
    if (!error) return data || [];
    onReadError('Loading case studies', error, strict);
  }
  return readJson(CASE_JSON, caseData);
}
export async function getPublishedCases() {
  const list = await getCases();
  return list.filter((c) => c.published === undefined || c.published);
}
export async function getCase(slug, { strict = false } = {}) {
  if (strict) noStore();
  const sb = supabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from(T.cases).select('*').eq('slug', slug).maybeSingle();
    if (!error) return data || null;
    onReadError(`Loading case study "${slug}"`, error, strict);
  }
  const c = readJson(CASE_JSON, caseData).find((x) => x.slug === slug);
  return c ? { ...c, body: readFileMaybe(join(CASE_DIR, `${slug}.html`)) } : null;
}
export async function getCaseBody(slug) { const c = await getCase(slug); return c?.body || ''; }

export async function saveCase({ original, item, bodyHtml }) {
  const slug = slugify(item.slug || item.name);
  if (!slug) throw new Error('Please enter a name (or slug) for the case study.');
  const row = { slug, name: item.name || '', cat: item.cat || '', filter: item.filter || 'Healthcare & Clinics', tagline: item.tagline || '', img: item.img || '', body: bodyHtml || '', published: item.published !== false, updated_at: new Date().toISOString() };
  const oldSlug = original ? String(original) : null;
  const sb = supabaseAdmin();
  if (sb) return saveRow(sb, T.cases, 'case study', { oldSlug, row });
  if (!localWritable()) throw new Error(NOT_CONFIGURED_MSG);
  return saveCaseLocal({ oldSlug, row, bodyHtml });
}
export async function deleteCase(slug) {
  const sb = supabaseAdmin();
  if (sb) { const { error } = await sb.from(T.cases).delete().eq('slug', slug); if (error) fail('Deleting the case study', error); return; }
  if (!localWritable()) throw new Error(NOT_CONFIGURED_MSG);
  writeJson(CASE_JSON, readJson(CASE_JSON, []).filter((x) => x.slug !== slug));
  const f = join(CASE_DIR, `${slug}.html`); if (existsSync(f)) unlinkSync(f);
}

// ============ IMPORT ORIGINAL CONTENT ============
// Copies the posts/case studies bundled with the site (lib/data/*.json + content/**.html)
// into Supabase. Only adds rows that are missing — never overwrites dashboard edits.
// Same result as scripts/migrate-to-supabase.mjs, but runs on the server with its env keys.
export async function importBundledContent() {
  noStore();
  const sb = supabaseAdmin();
  if (!sb) throw new Error(NOT_CONFIGURED_MSG);
  const body = (dir, slug) => readFileMaybe(join(ROOT, 'content', dir, `${slug}.html`)).replace(/\r\n/g, '\n');
  const base = Date.now();
  const createdAt = (date, i) => { const t = Date.parse(date || ''); return new Date((Number.isNaN(t) ? base : t) - i * 1000).toISOString(); };
  const posts = blogData.map((p, i) => ({ slug: p.slug, cat: p.cat, date: p.date, title: p.title, excerpt: p.excerpt, img: p.img, body: body('blog', p.slug), created_at: createdAt(p.date, i) }));
  const cases = caseData.map((c, i) => ({ slug: c.slug, name: c.name, cat: c.cat, filter: c.filter, tagline: c.tagline, img: c.img, body: body('case-studies', c.slug), published: true, ord: i, created_at: new Date(base - i * 60000).toISOString() }));
  // Never import empty articles (they would block a later, correct import).
  const missing = [...posts.filter((p) => !p.body).map((p) => `blog/${p.slug}`), ...cases.filter((c) => !c.body).map((c) => `case-studies/${c.slug}`)];
  if (missing.length) throw new Error(`Import stopped: the article files are not available on this server (${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ', …' : ''}). Nothing was imported.`);
  const opts = { onConflict: 'slug', ignoreDuplicates: true };
  const r1 = await sb.from(T.posts).upsert(posts, opts);
  if (r1.error) fail('Importing posts', r1.error);
  const r2 = await sb.from(T.cases).upsert(cases, opts);
  if (r2.error) fail('Importing case studies', r2.error);
  const c1 = await sb.from(T.posts).select('slug', { count: 'exact' }).limit(1);
  const c2 = await sb.from(T.cases).select('slug', { count: 'exact' }).limit(1);
  if (c1.error) fail('Counting posts', c1.error);
  if (c2.error) fail('Counting case studies', c2.error);
  return { posts: c1.count, cases: c2.count };
}

// Puts the designed layout (content/case-studies/<slug>.html) back on case studies whose
// Supabase body is plain text (e.g. copied from the old case_studies table). Rows that
// already have a designed body — including dashboard edits — are never touched.
export const isDesignedCaseBody = (html) => /class="cs-study"/.test(String(html || ''));
// With { dryRun: true } it only returns the slugs that would be restored.
export async function restoreCaseLayouts({ dryRun = false } = {}) {
  noStore();
  const sb = supabaseAdmin();
  if (!sb) { if (dryRun) return []; throw new Error(NOT_CONFIGURED_MSG); }
  const { data, error } = await sb.from(T.cases).select('slug,body');
  if (error) fail('Loading case studies', error);
  const restored = [];
  for (const row of data || []) {
    if (isDesignedCaseBody(row.body)) continue;
    const file = readFileMaybe(join(CASE_DIR, `${row.slug}.html`)).replace(/\r\n/g, '\n');
    if (!isDesignedCaseBody(file)) continue; // no designed version bundled for this slug
    if (dryRun) { restored.push(row.slug); continue; }
    const { error: upErr } = await sb.from(T.cases).update({ body: file, updated_at: new Date().toISOString() }).eq('slug', row.slug);
    if (upErr) fail(`Restoring "${row.slug}"`, upErr);
    restored.push(row.slug);
  }
  return restored;
}

export const bundledPostSlugs = () => blogData.map((p) => p.slug);
export const bundledCaseSlugs = () => caseData.map((c) => c.slug);

// ============ LEADS ============
export async function getLeads() {
  noStore();
  const sb = supabaseAdmin();
  if (sb) {
    const { data, error } = await sb.from(T.leads).select('*').order('created_at', { ascending: false });
    if (error) fail('Loading leads', error);
    return (data || []).map((l) => ({ ...l, date: l.created_at ? new Date(l.created_at).toLocaleDateString('en-US') : '' }));
  }
  return readJson(LEADS_JSON, []);
}
export async function deleteLead(id) {
  const sb = supabaseAdmin();
  if (sb) { const { error } = await sb.from(T.leads).delete().eq('id', id); if (error) fail('Deleting the lead', error); return; }
  if (!localWritable()) throw new Error(NOT_CONFIGURED_MSG);
  writeJson(LEADS_JSON, readJson(LEADS_JSON, []).filter((l) => String(l.id) !== String(id)));
}
export async function addLead(lead) {
  const row = { name: lead.name || '', email: lead.email || '', source: lead.source || 'Contact', payload: lead.payload || {} };
  const sb = supabaseAdmin();
  if (sb) {
    const { error } = await sb.from(T.leads).insert(row);
    if (error) fail('Saving the lead', error);
    return;
  }
  if (!localWritable()) throw new Error(NOT_CONFIGURED_MSG);
  // local dev fallback
  const list = readJson(LEADS_JSON, []);
  list.unshift({ ...row, created_at: new Date().toISOString(), date: new Date().toLocaleDateString('en-US') });
  mkdirSync(join(ROOT, 'content'), { recursive: true });
  writeJson(LEADS_JSON, list);
}

// ============ MEDIA UPLOAD ============
export const IMAGE_TYPES = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif' };
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// Checks an uploaded File (from FormData). Returns an error message, or '' when OK.
export function checkImageFile(file) {
  if (!file || typeof file === 'string' || !file.size) return 'No image was selected.';
  if (!IMAGE_TYPES[file.type]) return `"${file.name}" is not a supported image. Use JPG, PNG, WebP or AVIF.`;
  if (file.size > MAX_IMAGE_BYTES) return `"${file.name}" is ${(file.size / 1048576).toFixed(1)} MB. The maximum is 5 MB.`;
  return '';
}

// Uploads an image File to the medspa-uploads bucket (or public/uploads in local dev)
// and returns its public URL. `name` is the file name without extension.
export async function uploadImage(file, { folder = 'blog', name } = {}) {
  const problem = checkImageFile(file);
  if (problem) throw new Error(problem);
  const base = slugify(name || String(file.name || '').replace(/\.[a-z0-9]+$/i, '')) || 'image';
  return uploadMedia({ buffer: Buffer.from(await file.arrayBuffer()), ext: IMAGE_TYPES[file.type], contentType: file.type, folder, base });
}

export async function uploadMedia({ filename, dataBase64, buffer, ext, contentType, base, folder = 'case-studies' }) {
  ext = (ext || (filename || '').match(/\.[a-z0-9]+$/i)?.[0] || '.jpg').toLowerCase();
  base = base || slugify((filename || 'image').replace(/\.[a-z0-9]+$/i, '')) || 'image';
  const fname = `${base.slice(0, 60)}-${Date.now()}${ext}`;
  const buf = buffer || Buffer.from(String(dataBase64 || '').replace(/^data:[^;]+;base64,/, ''), 'base64');
  const sb = supabaseAdmin();
  if (sb) {
    const path = `${folder}/${fname}`;
    const { error } = await sb.storage.from(T.bucket).upload(path, buf, { contentType: contentType || guessType(ext), upsert: false, cacheControl: '31536000' });
    if (error) fail('Uploading the image', error);
    const { data } = sb.storage.from(T.bucket).getPublicUrl(path);
    if (!data?.publicUrl) throw new Error('Uploading the image: Supabase returned no public URL.');
    return data.publicUrl;
  }
  if (!localWritable()) throw new Error(NOT_CONFIGURED_MSG);
  // local dev fallback
  const dir = join(ROOT, 'public', 'uploads', folder); mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, fname), buf);
  return `/uploads/${folder}/${fname}`;
}

// ============ VIDEO UPLOAD ============
// Videos are too big to pass through a server action (Vercel caps request bodies
// at 4.5 MB), so the browser uploads them straight to Supabase with a signed URL.
export const VIDEO_TYPES = { 'video/mp4': '.mp4', 'video/quicktime': '.mov', 'video/webm': '.webm', 'video/x-m4v': '.m4v' };
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
const VIDEO_PATH_RE = /^videos\/[a-z0-9-]+\.(mp4|mov|webm|m4v)$/;

// Returns an error message, or '' when OK.
export function checkVideoMeta({ name, type, size } = {}) {
  if (!name || !Number(size)) return 'No video was selected.';
  if (!VIDEO_TYPES[type]) return `"${name}" is not a supported video. Use MP4, MOV, WebM or M4V.`;
  if (Number(size) > MAX_VIDEO_BYTES) return `"${name}" is ${(size / 1048576).toFixed(0)} MB. The maximum is ${MAX_VIDEO_BYTES / 1048576} MB.`;
  return '';
}

// Creates a one-time signed upload URL. Returns { path, signedUrl }.
export async function createVideoUpload({ name, type, size, topic } = {}) {
  const problem = checkVideoMeta({ name, type, size });
  if (problem) throw new Error(problem);
  const sb = supabaseAdmin();
  if (!sb) throw new Error(NOT_CONFIGURED_MSG);
  const base = slugify(topic || String(name).replace(/\.[a-z0-9]+$/i, '')).slice(0, 60).replace(/-+$/, '') || 'video';
  const path = `videos/${base}-${Date.now()}${VIDEO_TYPES[type]}`;
  const { data, error } = await sb.storage.from(T.bucket).createSignedUploadUrl(path);
  if (error) fail('Preparing the video upload', error);
  if (!data?.signedUrl) throw new Error('Preparing the video upload: Supabase returned no upload URL.');
  return { path, signedUrl: data.signedUrl };
}

// Confirms the uploaded file exists in storage, then returns its public URL.
export async function getVideoPublicUrl(path) {
  path = String(path || '');
  if (!VIDEO_PATH_RE.test(path)) throw new Error('Invalid video path. Please upload the video again.');
  const sb = supabaseAdmin();
  if (!sb) throw new Error(NOT_CONFIGURED_MSG);
  const name = path.slice('videos/'.length);
  const { data, error } = await sb.storage.from(T.bucket).list('videos', { search: name, limit: 10 });
  if (error) fail('Checking the uploaded video', error);
  if (!data?.some((f) => f.name === name)) throw new Error('The video was not found in storage. Please upload it again.');
  const { data: pub } = sb.storage.from(T.bucket).getPublicUrl(path);
  if (!pub?.publicUrl) throw new Error('Supabase returned no public URL for the video.');
  return pub.publicUrl;
}

// ============ helpers ============
function readFileMaybe(f) { try { return existsSync(f) ? readFileSync(f, 'utf8') : ''; } catch (e) { return ''; } }
function guessType(ext) { return ({ '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.mp4': 'video/mp4' })[ext] || 'application/octet-stream'; }

function localClash(list, oldSlug, slug, label) {
  if (slug !== oldSlug && list.some((x) => x.slug === slug)) throw new Error(`A ${label} with the URL slug "${slug}" already exists. Choose a different title or slug.`);
}
function savePostLocal({ oldSlug, row, bodyHtml }) {
  const list = readJson(BLOG_JSON, []);
  localClash(list, oldSlug, row.slug, 'post');
  const clean = { slug: row.slug, cat: row.cat, date: row.date, title: row.title, excerpt: row.excerpt, img: row.img };
  const idx = list.findIndex((x) => x.slug === (oldSlug || row.slug));
  if (idx >= 0) list[idx] = clean; else list.unshift(clean);
  writeJson(BLOG_JSON, list); mkdirSync(BLOG_DIR, { recursive: true });
  if (oldSlug && oldSlug !== row.slug) { const of = join(BLOG_DIR, `${oldSlug}.html`); if (existsSync(of)) unlinkSync(of); }
  writeFileSync(join(BLOG_DIR, `${row.slug}.html`), bodyHtml || ''); return row.slug;
}
function saveCaseLocal({ oldSlug, row, bodyHtml }) {
  const list = readJson(CASE_JSON, []);
  localClash(list, oldSlug, row.slug, 'case study');
  const clean = { slug: row.slug, cat: row.cat, filter: row.filter, tagline: row.tagline, name: row.name, img: row.img };
  const idx = list.findIndex((x) => x.slug === (oldSlug || row.slug));
  if (idx >= 0) list[idx] = clean; else list.unshift(clean);
  writeJson(CASE_JSON, list); mkdirSync(CASE_DIR, { recursive: true });
  if (oldSlug && oldSlug !== row.slug) { const of = join(CASE_DIR, `${oldSlug}.html`); if (existsSync(of)) unlinkSync(of); }
  writeFileSync(join(CASE_DIR, `${row.slug}.html`), bodyHtml || ''); return row.slug;
}

export function todayStr() { return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }

// A body counts as HTML (kept exactly as-is) when it contains block-level markup.
// Plain text with an inserted <img> is still treated as plain text.
export const looksLikeHtml = (s) => /<(p|div|h[1-6]|article|section|header|ul|ol|li|table|blockquote|figure|iframe|br)\b/i.test(String(s || ''));

export function mdLiteToHtml(text) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const blocks = String(text || '').replace(/\r\n/g, '\n').split(/\n{2,}/);
  return blocks.map((b) => {
    const t = b.trim(); if (!t) return '';
    if (/^<img\b[^>]*>$/i.test(t)) return `<p>${t}</p>`; // image inserted with the dashboard button
    if (t.startsWith('### ')) return `<h3>${inline(t.slice(4))}</h3>`;
    if (t.startsWith('## ')) return `<h2>${inline(t.slice(3))}</h2>`;
    if (t.startsWith('# ')) return `<h2>${inline(t.slice(2))}</h2>`;
    return `<p>${inline(t).replace(/\n/g, '<br/>')}</p>`;
  }).filter(Boolean).join('\n');
}
