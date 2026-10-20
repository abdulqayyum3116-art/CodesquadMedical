/* CodeSquad local admin panel — zero dependencies.
   Run:  npm run admin   then open http://localhost:4000
   It writes into the project files (lib/data/*.json, content/**, public/uploads/**).
   LOCAL ONLY. Never deploy this file/route to Vercel. */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const PORT = 4000;

// ---- password ----
const PW_FILE = path.join(__dirname, 'password.txt');
if (!fs.existsSync(PW_FILE)) fs.writeFileSync(PW_FILE, 'codesquad2026\n');
const getPassword = () => fs.readFileSync(PW_FILE, 'utf8').trim();

const tokens = new Set();

// ---- paths ----
const BLOG_JSON = path.join(ROOT, 'lib', 'data', 'blog-posts.json');
const CASE_JSON = path.join(ROOT, 'lib', 'data', 'case-studies.json');
const BLOG_DIR = path.join(ROOT, 'content', 'blog');
const CASE_DIR = path.join(ROOT, 'content', 'case-studies');
const UPLOAD_DIR = path.join(ROOT, 'public', 'uploads');

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const writeJson = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
const slugify = (s) => String(s).toLowerCase().trim()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

function send(res, code, body, type = 'application/json') {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => { size += c.length; if (size > 60 * 1024 * 1024) { reject(new Error('too large')); req.destroy(); } chunks.push(c); });
    req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}
const auth = (req) => tokens.has(req.headers['x-token']);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;

  try {
    // --- UI ---
    if (req.method === 'GET' && p === '/') return send(res, 200, PAGE, 'text/html; charset=utf-8');

    // --- login ---
    if (req.method === 'POST' && p === '/api/login') {
      const b = await readBody(req);
      if (b.password === getPassword()) { const t = crypto.randomBytes(24).toString('hex'); tokens.add(t); return send(res, 200, { token: t }); }
      return send(res, 401, { error: 'Wrong password' });
    }

    // everything below requires a valid token
    if (p.startsWith('/api/') && !auth(req)) return send(res, 401, { error: 'Not authorized' });

    if (req.method === 'GET' && p === '/api/data') {
      return send(res, 200, { blogPosts: readJson(BLOG_JSON), caseStudies: readJson(CASE_JSON) });
    }

    if (req.method === 'GET' && p === '/api/content') {
      const type = url.searchParams.get('type'); const slug = url.searchParams.get('slug');
      const dir = type === 'blog' ? BLOG_DIR : CASE_DIR;
      const f = path.join(dir, `${slugify(slug)}.html`);
      return send(res, 200, { body: fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '' });
    }

    if (req.method === 'POST' && p === '/api/upload') {
      const b = await readBody(req);
      const folder = b.folder === 'blog' ? 'blog' : 'case-studies';
      const dir = path.join(UPLOAD_DIR, folder);
      fs.mkdirSync(dir, { recursive: true });
      const ext = (path.extname(b.filename || '') || '.jpg').toLowerCase().replace(/[^.a-z0-9]/g, '');
      const base = slugify(path.basename(b.filename || 'image', path.extname(b.filename || ''))) || 'image';
      const name = `${base}-${Date.now()}${ext}`;
      const data = String(b.dataBase64 || '').replace(/^data:[^;]+;base64,/, '');
      fs.writeFileSync(path.join(dir, name), Buffer.from(data, 'base64'));
      return send(res, 200, { path: `/uploads/${folder}/${name}` });
    }

    if (req.method === 'POST' && (p === '/api/blog/save' || p === '/api/case/save')) {
      const isBlog = p.includes('blog');
      const b = await readBody(req);
      const post = b.post || {};
      const slug = slugify(post.slug || post.title || post.name);
      if (!slug) return send(res, 400, { error: 'A title/slug is required' });
      post.slug = slug;
      const jsonFile = isBlog ? BLOG_JSON : CASE_JSON;
      const dir = isBlog ? BLOG_DIR : CASE_DIR;
      const list = readJson(jsonFile);
      const oldSlug = b.original ? slugify(b.original) : null;

      // clean object with only the fields for that type, in order
      const clean = isBlog
        ? { slug, cat: post.cat || 'AI Automation', date: post.date || '', title: post.title || '', excerpt: post.excerpt || '', img: post.img || '' }
        : { slug, cat: post.cat || '', filter: post.filter || 'Healthcare & Clinics', tagline: post.tagline || '', name: post.name || '', img: post.img || '' };

      const idx = list.findIndex(x => x.slug === (oldSlug || slug));
      if (idx >= 0) list[idx] = clean; else list.unshift(clean);
      writeJson(jsonFile, list);

      fs.mkdirSync(dir, { recursive: true });
      if (oldSlug && oldSlug !== slug) { const of = path.join(dir, `${oldSlug}.html`); if (fs.existsSync(of)) fs.unlinkSync(of); }
      fs.writeFileSync(path.join(dir, `${slug}.html`), b.body || '');
      return send(res, 200, { ok: true, slug });
    }

    if (req.method === 'POST' && (p === '/api/blog/delete' || p === '/api/case/delete')) {
      const isBlog = p.includes('blog');
      const b = await readBody(req);
      const slug = slugify(b.slug);
      const jsonFile = isBlog ? BLOG_JSON : CASE_JSON;
      const dir = isBlog ? BLOG_DIR : CASE_DIR;
      writeJson(jsonFile, readJson(jsonFile).filter(x => x.slug !== slug));
      const f = path.join(dir, `${slug}.html`); if (fs.existsSync(f)) fs.unlinkSync(f);
      return send(res, 200, { ok: true });
    }

    return send(res, 404, { error: 'Not found' });
  } catch (e) {
    return send(res, 500, { error: String(e && e.message || e) });
  }
});

server.listen(PORT, () => {
  console.log('\n  CodeSquad admin panel running:  http://localhost:' + PORT);
  console.log('  Password (edit admin/password.txt to change):  ' + getPassword());
  console.log('  After saving changes, deploy with:  vercel deploy --prod --yes\n');
});

const PAGE = require('./page.js');
