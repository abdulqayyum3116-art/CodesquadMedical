// One-off: builds docs/seo-meta-audit.csv — every page's meta title + description,
// pulled from the actual metadata exports/generateMetadata functions, with character
// counts flagged against Google's practical truncation limits (~60 title / ~160 desc).
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const posts = JSON.parse(readFileSync(join(ROOT, 'lib', 'data', 'blog-posts.json'), 'utf8'));
const cases = JSON.parse(readFileSync(join(ROOT, 'lib', 'data', 'case-studies.json'), 'utf8'));
const SITE = 'https://www.codesquad.ai';

// Static pages — titles/descriptions copied verbatim from each app/**/page.js
// `export const metadata` (confirmed by reading every file directly).
const staticPages = [
  { url: '/', title: 'AI Automation & Software Development Agency | CodeSquad', description: "CodeSquad builds growth systems for clinics, med spas and e-commerce brands — ads, instant follow-up, CRM dashboards and SEO/AEO/GEO, built into your stack." },
  { url: '/aesthetics', title: 'Med Spa & Aesthetic Clinic Patient Acquisition | CodeSquad', description: 'Google Ads, 3-second follow-up, 14-day nurture, SEO and booking in one dashboard — one med spa client got 60+ leads and 6–7 new patients in 2 months.' },
  { url: '/clinics', title: 'Patient Acquisition System for Clinics & Dental Practices — CodeSquad', description: 'Treatment-based Google Ads, 3-second follow-up, 14-day nurture, SEO content and booking, in one dashboard — for small medical clinics and dental practices.' },
  { url: '/founder', title: 'Shahzaib Hamid, Founder — CodeSquad', description: 'Shahzaib Hamid, founder and CEO of CodeSquad — PhD in Applied AI, with research in clinical gait analysis for remote patient care.' },
  { url: '/industry', title: 'Industry Solutions — CodeSquad', description: 'One connected growth system, configured for your industry — Aesthetics, E-commerce and IT & Engineering. Web, CRM, AI, automation, ads, follow-up and content, in one dashboard.' },
  { url: '/process', title: 'How Our Growth System Works — Build & Grow Process | CodeSquad', description: 'How CodeSquad builds and runs growth systems for clinics, med spas and e-commerce: a one-time build (audit, CRM, landing pages, automations, launch) then a monthly growth retainer.' },
  { url: '/blog', title: 'CodeSquad Blog | AI Automation, SMEs & Business Growth', description: 'Practical, technical perspectives on AI automation, SMEs, AEO/SEO, lead generation, software development and scaling operations.' },
  { url: '/case-studies', title: 'Case Studies | CodeSquad', description: 'Production systems built for healthcare, physical appointment-based businesses, and e-commerce teams — designed around their needs.' },
  { url: '/inquiry', title: 'Send an Inquiry | CodeSquad', description: "Tell us about your business and goals. CodeSquad replies within one business day with a free consultation call." },
];

// Dynamic pages: title/description are generated at request time by
// generateMetadata() in app/blog/[slug]/page.js and app/case-studies/[slug]/page.js.
const blogPages = posts.map((p) => ({
  url: `/blog/${p.slug}`,
  title: `${p.title} | CodeSquad`,
  description: p.excerpt.replace(/\s+/g, ' ').trim(),
}));
const casePages = cases.map((c) => ({
  url: `/case-studies/${c.slug}`,
  title: `${c.name} — Case Study | CodeSquad`,
  description: c.tagline,
}));

// Noindex pages (robots: {index:false}) — included for completeness, flagged separately.
const noindexPages = [
  { url: '/dashboard (+ all /dashboard/* except /dashboard/login)', title: 'Dashboard | CodeSquad', description: '(none set — inherited from root layout; irrelevant, page is noindex)' },
  { url: '/dashboard/login', title: 'Dashboard login | CodeSquad', description: '(none set)' },
  { url: '404 / not-found', title: 'Page Not Found | CodeSquad', description: 'The page you’re looking for doesn’t exist or may have moved.' },
];

const flag = (len, max) => (len > max ? `OVER by ${len - max}` : max - len <= 10 ? 'near limit' : 'OK');

function row(p, indexed) {
  const t = p.title, d = p.description;
  return {
    url: SITE + (p.url.startsWith('/') ? p.url : `/${p.url}`),
    title: t,
    titleLen: t.length,
    titleFlag: flag(t.length, 60),
    description: d,
    descLen: d.length,
    descFlag: flag(d.length, 160),
    indexed,
  };
}

const rows = [
  ...staticPages.map((p) => row(p, 'yes')),
  ...blogPages.map((p) => row(p, 'yes')),
  ...casePages.map((p) => row(p, 'yes')),
  ...noindexPages.map((p) => ({ url: p.url, title: p.title, titleLen: p.title.length, titleFlag: flag(p.title.length, 60), description: p.description, descLen: p.description.length, descFlag: '—', indexed: 'no (robots: noindex)' })),
];

const csvEsc = (s) => `"${String(s).replace(/"/g, '""')}"`;
const header = ['URL', 'Meta Title', 'Title Length', 'Title Status', 'Meta Description', 'Description Length', 'Description Status', 'Indexable'];
const lines = [header.join(',')];
for (const r of rows) {
  lines.push([r.url, r.title, r.titleLen, r.titleFlag, r.description, r.descLen, r.descFlag, r.indexed].map(csvEsc).join(','));
}

mkdirSync(join(ROOT, 'docs'), { recursive: true });
const outPath = join(ROOT, 'docs', 'seo-meta-audit.csv');
writeFileSync(outPath, lines.join('\n') + '\n');
console.log(`✓ wrote ${rows.length} rows to docs/seo-meta-audit.csv`);

const overTitle = rows.filter((r) => r.titleFlag.startsWith('OVER'));
const overDesc = rows.filter((r) => r.descFlag.startsWith('OVER'));
console.log(`  ${overTitle.length} titles over ~60 chars, ${overDesc.length} descriptions over ~160 chars`);
