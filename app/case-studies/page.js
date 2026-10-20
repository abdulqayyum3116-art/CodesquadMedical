import { getPublishedCases } from '../../lib/store';
import { CASE_SERVICES, SERVICE_FILTERS, INDUSTRY_FILTERS, DEFAULT_INDUSTRY } from '../../lib/caseServices';
import './results.css';
export const revalidate = 30;
export const metadata = {
  title: 'Results & Case Studies | MedGrow AI Solutions',
  description: 'Case studies from MedGrow AI Solutions: patient growth systems, SEO, ads and follow-up for med spas, dental practices and clinics, plus our wider automation work.'
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

export default async function Page() {
  const caseStudies = await getPublishedCases();
  const industries = INDUSTRY_FILTERS.filter((f) => f === 'All' || caseStudies.some((c) => c.filter === f));
  const services = SERVICE_FILTERS.filter((s) => caseStudies.some((c) => CASE_SERVICES[c.slug]?.tags.includes(s)));
  return (
    <main id="top">
      <section className="rz-hero" aria-labelledby="rz-title">
        <div className="ds-container ds-container--wide">
          <span className="ds-eyebrow">Results</span>
          <h1 id="rz-title" className="ds-h1 rz-title">Systems we've built, and what <span className="ds-underline">changed</span>.</h1>
          <p className="ds-lead">Case studies from the medical practices we've built for. Filter by the service you're interested in.</p>
        </div>
      </section>

      <section className="rz-body" aria-label="Case studies">
        <div className="ds-container ds-container--wide">
          <div className="rz-filters" id="rsFilters" data-default={DEFAULT_INDUSTRY}>
            <div className="rz-filter" role="group" aria-label="Filter by industry" hidden={industries.length < 3}>
              <span className="rz-filter-k">Industry</span>
              {industries.map((c) => (
                <button key={c} type="button" className="rz-chip" data-group="industry" data-value={c} aria-pressed={c === 'All'}>{c}</button>
              ))}
            </div>
            {services.length ? (
              <div className="rz-filter" role="group" aria-label="Filter by service">
                <span className="rz-filter-k">Service</span>
                <button type="button" className="rz-chip" data-group="service" data-value="All" aria-pressed="true">Any</button>
                {services.map((s) => (
                  <button key={s} type="button" className="rz-chip" data-group="service" data-value={s} aria-pressed="false">{s}</button>
                ))}
              </div>
            ) : null}
            <p className="rz-count" id="rsCount" aria-live="polite">{caseStudies.length} case studies</p>
          </div>

          <div className="rz-grid" id="rsGrid">
            {caseStudies.map((c, i) => {
              const svc = CASE_SERVICES[c.slug];
              return (
                <a className={`rz-card${i % 5 === 0 ? ' rz-card--wide' : ''}`} href={`/case-studies/${c.slug}`} key={c.slug} data-industry={c.filter || ''} data-services={(svc?.tags || []).join('|')}>
                  <figure className="ds-frame rz-thumb">{c.img ? <img src={c.img} alt="" loading="lazy" /> : null}</figure>
                  <div className="rz-card-body">
                    <span className="rz-tag">{c.cat}</span>
                    <h2 className="rz-card-t">{c.tagline}</h2>
                    <p className="rz-client">{c.name}</p>
                    {svc ? <p className="rz-svc">{svc.line}</p> : null}
                    <span className="rz-more">Read case study <Arrow /></span>
                  </div>
                </a>
              );
            })}
          </div>
          <p className="rz-empty" id="rsEmpty" hidden>No case studies match these filters yet. <button type="button" className="ds-btn--text" id="rsReset">Show all</button></p>
        </div>
      </section>

      <section className="ds-section rz-final" aria-labelledby="rz-final-t">
        <div className="ds-container">
          <div className="rz-final-card">
            <span className="ds-curve" aria-hidden="true" />
            <h2 id="rz-final-t" className="ds-h2">Want results like these for your practice?</h2>
            <p className="ds-lead">A free 30-minute consultation. We'll look at where patients are slipping away and what we'd fix first.</p>
            <div className="rz-cta">
              <a href="https://calendly.com/code_squad/30min" target="_blank" rel="noopener noreferrer" className="ds-btn">Book a Consultation</a>
              <a href="/work-with-us" className="ds-btn--secondary">Apply to work with us</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
