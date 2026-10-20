import { notFound } from 'next/navigation';
import { getCases, getCase, getPublishedCases } from '../../../lib/store';
import { CASE_SERVICES } from '../../../lib/caseServices';
import '../results.css';

export const revalidate = 30;
export const dynamicParams = true;

export async function generateStaticParams() {
  const cases = await getCases();
  return cases.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const p = await getCase(params.slug);
  if (!p) return { title: 'Case Study | MedGrow AI Solutions' };
  return { title: `${p.name} — Case Study | MedGrow AI Solutions`, description: p.tagline };
}

const CallArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
);

// Older case study bodies (also stored in Supabase) end with a generic CTA; swap in the brand copy
// at render time so every copy of the body is updated without editing the database.
const refreshCta = (html) => html
  .replace('<p>Have an idea worth building?</p>', '<p>Found. Chosen. Booked.</p>')
  .replace(/<h2>Let[’']s turn your workflow into a system that scales\.<\/h2>/, '<h2>Want a system like this for your practice?</h2>')
  .replace('href="/inquiry">Send an inquiry</a>', 'href="/work-with-us">Apply to work with us</a>')
  .replace(/>Book a call </g, '>Book a Consultation <');

const CTA_MARK = '<section class="cs-study-cta">';

function Related({ items }) {
  if (!items.length) return null;
  return (
    <section className="ds-section rz-related" aria-labelledby="rz-rel-t">
      <div className="ds-container ds-container--wide">
        <div className="rz-related-head">
          <div><span className="ds-eyebrow">More results</span><h2 id="rz-rel-t" className="ds-h2">Related case studies</h2></div>
          <a href="/case-studies" className="ds-btn--text">All case studies →</a>
        </div>
        <div className="rz-grid">
          {items.map((c) => (
            <a className="rz-card" href={`/case-studies/${c.slug}`} key={c.slug}>
              <figure className="ds-frame rz-thumb">{c.img ? <img src={c.img} alt="" loading="lazy" /> : null}</figure>
              <div className="rz-card-body">
                <span className="rz-tag">{c.cat}</span>
                <h3 className="rz-card-t">{c.tagline}</h3>
                <p className="rz-client">{c.name}</p>
                {CASE_SERVICES[c.slug] ? <p className="rz-svc">{CASE_SERVICES[c.slug].line}</p> : null}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Page({ params }) {
  const item = await getCase(params.slug);
  const html = refreshCta(item?.body || '');
  if (!html) notFound();

  // Up to three related studies: same industry first, then healthcare, then anything else.
  const all = (await getPublishedCases()).filter((c) => c.slug !== item.slug);
  const rank = (c) => (c.filter === item.filter ? 0 : c.filter === 'Healthcare & Clinics' ? 1 : 2);
  const related = all.map((c, i) => ({ c, i })).sort((a, b) => rank(a.c) - rank(b.c) || a.i - b.i).slice(0, 3).map((x) => x.c);

  // Designed case studies store their full layout (<article class="cs-study">…). Bodies
  // copied from the old case_studies table are plain text sections, so wrap those in the
  // same hero + CTA layout instead of dropping them under the fixed header unstyled.
  const isDesigned = /class="cs-study"/.test(html);
  if (isDesigned) {
    const at = html.indexOf(CTA_MARK);
    const before = at > -1 ? html.slice(0, at) : html;
    const after = at > -1 ? html.slice(at) : '';
    return (
      <main id="top" className="cs-body cs-reader cs-reader--study">
        <div dangerouslySetInnerHTML={{ __html: before }} />
        <Related items={related} />
        {after ? <div dangerouslySetInnerHTML={{ __html: after }} /> : null}
      </main>
    );
  }
  return (
    <main id="top" className="cs-body cs-reader cs-reader--study">
      <div>
        <article className="cs-study">
          <header className="cs-study-hero cs-study-hero--cover cs-study-hero--dark">
            {item.img ? <img className="cs-study-hero__image" src={item.img} alt={`${item.name} case study cover`} /> : null}
            <div className="cs-study-hero__contrast" />
            <div className="cs-container">
              <a className="cs-study-back" href="/case-studies">← All case studies</a>
              <p className="cs-study-label">{item.cat ? `${item.cat} · Case study` : 'Case study'}</p>
              <h1>{item.name}</h1>
              {item.tagline ? <p className="cs-study-kicker">{item.tagline}</p> : null}
            </div>
          </header>
          <section className="cs-study-section">
            <div className="cs-container">
              <div className="cs-article" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </section>
        </article>
      </div>
      <Related items={related} />
      <section className="cs-study-cta">
        <div className="cs-container">
          <p>Found. Chosen. Booked.</p>
          <h2>Want a system like this for your practice?</h2>
          <div className="cs-study-cta__actions">
            <a className="cs-btn cs-btn--primary" href="https://calendly.com/code_squad/30min" target="_blank" rel="noopener">Book a Consultation <CallArrow /></a>
            <a className="cs-btn cs-btn--ghost" href="/work-with-us">Apply to work with us</a>
          </div>
        </div>
      </section>
    </main>
  );
}
