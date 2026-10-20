// Seeds the original posts + case studies (lib/data/*.json + content/**.html) into Supabase.
// Run:  node scripts/migrate-to-supabase.mjs            (adds rows that are missing — safe to re-run)
//       node scripts/migrate-to-supabase.mjs --force    (also OVERWRITES existing rows with the file
//                                                        versions, undoing edits made in the dashboard)
//       node scripts/migrate-to-supabase.mjs --restore-case-layouts
//                                                       (only puts the designed case-study layout back on
//                                                        rows whose body is plain text; nothing else changes)
// Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from the environment or .env.local.
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FORCE = process.argv.includes('--force');
const RESTORE_CASES = process.argv.includes('--restore-case-layouts');

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

// LF line endings, matching what the dashboard's textarea saves (Windows checkouts may have CRLF).
const readBody = (dir, slug) => { const f = join(ROOT, 'content', dir, `${slug}.html`); return existsSync(f) ? readFileSync(f, 'utf8').replace(/\r\n/g, '\n') : ''; };
const posts = JSON.parse(readFileSync(join(ROOT, 'lib', 'data', 'blog-posts.json'), 'utf8'));
const cases = JSON.parse(readFileSync(join(ROOT, 'lib', 'data', 'case-studies.json'), 'utf8'));

// Same as the dashboard's "Restore designed layout" (restoreCaseLayouts in lib/store.js).
if (RESTORE_CASES) {
  const designed = (html) => /class="cs-study"/.test(String(html || ''));
  const { data, error } = await sb.from('medspa_case_studies').select('slug,body');
  if (error) { console.error('cases error:', error.message, error.code || ''); process.exit(1); }
  const restored = [];
  for (const row of data || []) {
    if (designed(row.body)) continue;
    const file = readBody('case-studies', row.slug);
    if (!designed(file)) continue;
    const up = await sb.from('medspa_case_studies').update({ body: file, updated_at: new Date().toISOString() }).eq('slug', row.slug);
    if (up.error) { console.error(`restore "${row.slug}" error:`, up.error.message); process.exit(1); }
    restored.push(row.slug);
  }
  console.log(`✓ restored designed layout on ${restored.length} case studies${restored.length ? ': ' + restored.join(', ') : ''}`);
  process.exit(0);
}

// Order old posts by their publish date so they sort sensibly next to new ones.
const base = Date.now();
const createdAt = (date, i) => {
  const t = Date.parse(date || '');
  return new Date((Number.isNaN(t) ? base : t) - i * 1000).toISOString();
};
const postRows = posts.map((p, i) => ({
  slug: p.slug, cat: p.cat, date: p.date, title: p.title, excerpt: p.excerpt, img: p.img,
  body: readBody('blog', p.slug), created_at: createdAt(p.date, i),
}));
const caseRows = cases.map((c, i) => ({
  slug: c.slug, name: c.name, cat: c.cat, filter: c.filter, tagline: c.tagline, img: c.img,
  body: readBody('case-studies', c.slug), published: true, ord: i,
  created_at: new Date(base - i * 60000).toISOString(),
}));

const opts = { onConflict: 'slug', ignoreDuplicates: !FORCE };
const r1 = await sb.from('medspa_posts').upsert(postRows, opts);
if (r1.error) { console.error('posts error:', r1.error.message, r1.error.code || ''); process.exit(1); }
const r2 = await sb.from('medspa_case_studies').upsert(caseRows, opts);
if (r2.error) { console.error('cases error:', r2.error.message, r2.error.code || ''); process.exit(1); }

const c1 = await sb.from('medspa_posts').select('slug', { count: 'exact', head: true });
const c2 = await sb.from('medspa_case_studies').select('slug', { count: 'exact', head: true });
if (c1.error || c2.error) { console.error('count error:', (c1.error || c2.error).message); process.exit(1); }
const bucket = await sb.storage.getBucket('medspa-uploads');
console.log(`✓ migrated (${FORCE ? 'overwrite' : 'missing rows only'})  posts in table: ${c1.count}  case studies in table: ${c2.count}`);
console.log(bucket.error ? `✗ storage bucket medspa-uploads: ${bucket.error.message} — run supabase/setup.sql` : `✓ storage bucket medspa-uploads (public: ${bucket.data.public})`);
