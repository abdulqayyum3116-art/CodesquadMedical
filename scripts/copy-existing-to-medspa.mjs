// One-time migration: copy the existing `posts` / `case_studies` tables into the
// `medspa_posts` / `medspa_case_studies` tables this app reads from, mapping the
// differing column names and assembling a single HTML body for case studies.
// Run: node scripts/copy-existing-to-medspa.mjs
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// --- load .env.local ---
const env = {};
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const SB_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!SB_URL || !SB_KEY) { console.error('Missing Supabase env vars'); process.exit(1); }
const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const isHtml = (s) => /<(p|div|h[1-6]|ul|ol|li|table|blockquote|figure|br)\b/i.test(String(s || ''));
// plain text -> paragraphs (blank line splits paragraphs, single newline -> <br>)
const paras = (t) => {
  const s = String(t || '').replace(/\r\n/g, '\n').trim();
  if (!s) return '';
  if (isHtml(s)) return s;
  return s.split(/\n{2,}/).map((b) => `<p>${esc(b.trim()).replace(/\n/g, '<br/>')}</p>`).join('\n');
};
const section = (title, t) => (t && String(t).trim() && String(t) !== 'None') ? `<h2>${title}</h2>\n${paras(t)}\n` : '';

function metricsHtml(m) {
  if (!m) return '';
  let arr = m;
  if (typeof m === 'string') { try { arr = JSON.parse(m); } catch { return ''; } }
  if (!Array.isArray(arr) || !arr.length) return '';
  const items = arr.map((x) => {
    if (x && typeof x === 'object') {
      const label = x.label ?? x.name ?? x.key ?? '';
      const value = x.value ?? x.metric ?? x.number ?? '';
      return `<li><strong>${esc(value)}</strong> ${esc(label)}</li>`;
    }
    return `<li>${esc(x)}</li>`;
  }).join('');
  return `<h2>Results at a glance</h2>\n<ul>${items}</ul>\n`;
}

function caseBody(c) {
  let html = '';
  if (c.description) html += paras(c.description) + '\n';
  html += section('The Challenge', c.challenge);
  html += section('Our Solution', c.solution);
  html += section('Implementation', c.implementation);
  html += section('Results', c.results);
  html += metricsHtml(c.metrics);
  html += section('Conclusion', c.conclusion);
  if (c.testimonial && String(c.testimonial) !== 'None') {
    html += `<blockquote>${esc(c.testimonial)}${c.testimonial_author ? `<span>— ${esc(c.testimonial_author)}</span>` : ''}</blockquote>\n`;
  }
  return html.trim();
}

async function run() {
  // ---- POSTS ----
  const { data: posts, error: pe } = await sb.from('posts').select('*');
  if (pe) throw pe;
  const postRows = posts.map((p) => ({
    slug: p.slug, cat: p.category || 'AI Automation', date: p.date || '', title: p.title || '',
    excerpt: p.excerpt || '', img: p.image || '', body: p.content || '',
    created_at: p.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
  const r1 = await sb.from('medspa_posts').upsert(postRows, { onConflict: 'slug' }).select('slug');
  if (r1.error) throw r1.error;
  console.log(`posts -> medspa_posts: ${r1.data.length} rows`);

  // ---- CASE STUDIES ----
  const { data: cases, error: ce } = await sb.from('case_studies').select('*');
  if (ce) throw ce;
  const caseRows = cases.map((c, i) => ({
    slug: c.slug, name: c.name || '', cat: c.category || '',
    filter: c.vertical || c.category || 'Healthcare & Clinics',
    tagline: c.headline || c.description || '', img: c.cover_image || '',
    body: caseBody(c), published: c.published !== false,
    ord: c.sort_order ?? i,
    created_at: c.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
  const r2 = await sb.from('medspa_case_studies').upsert(caseRows, { onConflict: 'slug' }).select('slug');
  if (r2.error) throw r2.error;
  console.log(`case_studies -> medspa_case_studies: ${r2.data.length} rows`);

  // verify counts
  const pc = await sb.from('medspa_posts').select('slug', { count: 'exact', head: true });
  const cc = await sb.from('medspa_case_studies').select('slug', { count: 'exact', head: true });
  console.log(`Final: medspa_posts=${pc.count}, medspa_case_studies=${cc.count}`);
}
run().catch((e) => { console.error('MIGRATION FAILED:', e.message || e); process.exit(1); });
