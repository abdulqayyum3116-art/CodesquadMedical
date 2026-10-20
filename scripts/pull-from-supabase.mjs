// Pulls the live content back OUT of Supabase into the repo's bundled fallback files
// (lib/data/*.json + content/**.html), so the local/offline fallback stays accurate.
// This is the read-only counterpart to migrate-to-supabase.mjs (which pushes local -> Supabase).
// Nothing in Supabase is ever modified by this script.
//
// Run:  node scripts/pull-from-supabase.mjs             (dry run — prints a diff, writes nothing)
//       node scripts/pull-from-supabase.mjs --write      (writes the files to disk)
// Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from the environment or .env.local.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.includes('--write');

const env = { ...process.env };
const envFile = join(ROOT, '.env.local');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (set them in the environment or .env.local).');
  process.exit(1);
}
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const BLOG_JSON = join(ROOT, 'lib', 'data', 'blog-posts.json');
const CASE_JSON = join(ROOT, 'lib', 'data', 'case-studies.json');
const BLOG_DIR = join(ROOT, 'content', 'blog');
const CASE_DIR = join(ROOT, 'content', 'case-studies');

const readJson = (f) => { try { return JSON.parse(readFileSync(f, 'utf8')); } catch { return []; } };
const readFileMaybe = (f) => { try { return existsSync(f) ? readFileSync(f, 'utf8') : ''; } catch { return ''; } };
const norm = (s) => String(s || '').replace(/\r\n/g, '\n');

function diffList(label, localList, remoteList, keyOf) {
  const localKeys = new Set(localList.map(keyOf));
  const remoteKeys = new Set(remoteList.map(keyOf));
  const added = remoteList.filter((r) => !localKeys.has(keyOf(r)));
  const removed = localList.filter((l) => !remoteKeys.has(keyOf(l)));
  if (added.length) console.log(`  + ${added.length} new in Supabase: ${added.map(keyOf).join(', ')}`);
  if (removed.length) console.log(`  - ${removed.length} only in local bundle (not in Supabase): ${removed.map(keyOf).join(', ')}`);
  if (!added.length && !removed.length) console.log(`  (same ${label} present in both)`);
}

async function run() {
  const { data: posts, error: pe } = await sb.from('medspa_posts').select('slug,cat,date,title,excerpt,img,body').order('created_at', { ascending: false });
  if (pe) { console.error('Reading medspa_posts:', pe.message); process.exit(1); }
  const { data: cases, error: ce } = await sb.from('medspa_case_studies').select('slug,name,cat,filter,tagline,img,body,published,ord').order('ord', { ascending: true });
  if (ce) { console.error('Reading medspa_case_studies:', ce.message); process.exit(1); }

  const localPosts = readJson(BLOG_JSON);
  const localCases = readJson(CASE_JSON);

  console.log(`Supabase: ${posts.length} posts, ${cases.length} case studies`);
  console.log(`Local bundle: ${localPosts.length} posts, ${localCases.length} case studies\n`);

  console.log('Posts:');
  diffList('posts', localPosts, posts, (p) => p.slug);
  console.log('Case studies:');
  diffList('case studies', localCases, cases, (c) => c.slug);

  // Content-level diff (title/excerpt/body changes on slugs that exist in both).
  let changedBodies = 0;
  for (const r of posts) {
    const l = localPosts.find((p) => p.slug === r.slug);
    const localBody = norm(readFileMaybe(join(BLOG_DIR, `${r.slug}.html`)));
    if (l && (l.title !== r.title || l.excerpt !== r.excerpt || localBody !== norm(r.body))) changedBodies++;
  }
  for (const r of cases) {
    const l = localCases.find((c) => c.slug === r.slug);
    const localBody = norm(readFileMaybe(join(CASE_DIR, `${r.slug}.html`)));
    if (l && (l.name !== r.name || l.tagline !== r.tagline || localBody !== norm(r.body))) changedBodies++;
  }
  if (changedBodies) console.log(`\n~ ${changedBodies} existing slug(s) have edited content in Supabase vs. the local bundle.`);

  if (!WRITE) {
    console.log('\nDry run only — nothing written. Re-run with --write to update the local files.');
    return;
  }

  const postRows = posts.map((p) => ({ slug: p.slug, cat: p.cat, date: p.date, title: p.title, excerpt: p.excerpt, img: p.img }));
  const caseRows = cases.map((c) => ({ slug: c.slug, name: c.name, cat: c.cat, filter: c.filter, tagline: c.tagline, img: c.img }));
  mkdirSync(BLOG_DIR, { recursive: true });
  mkdirSync(CASE_DIR, { recursive: true });
  writeFileSync(BLOG_JSON, JSON.stringify(postRows, null, 2) + '\n');
  writeFileSync(CASE_JSON, JSON.stringify(caseRows, null, 2) + '\n');
  for (const p of posts) writeFileSync(join(BLOG_DIR, `${p.slug}.html`), norm(p.body));
  for (const c of cases) writeFileSync(join(CASE_DIR, `${c.slug}.html`), norm(c.body));

  console.log(`\n✓ wrote ${postRows.length} posts and ${caseRows.length} case studies to lib/data/ and content/.`);
}
run();
