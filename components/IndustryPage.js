import ApplicationForm from './ApplicationForm';
import { SERVICES, CASES, POSTS } from '../content/services.config';
import '../app/work-with-us/work-with-us.css';
import './industry-page.css';

const BOOKING_URL = 'https://calendly.com/code_squad/30min';

// Shared layout for industry landing pages (see content/industries.config.js).
export default function IndustryPage({ data: d }) {
  const services = d.services.map((slug) => SERVICES.find((s) => s.slug === slug)).filter(Boolean);
  return (
    <main id="top">
      {/* HERO */}
      <section className="ip-hero" aria-labelledby="ip-title">
        <div className="ds-container ds-container--wide ip-hero-grid">
          <div>
            <nav className="ip-crumbs" aria-label="Breadcrumb"><a href="/industry">Industries</a><span aria-hidden="true">/</span><span aria-current="page">{d.eyebrow}</span></nav>
            <h1 id="ip-title" className="ds-h1 ip-title">{d.h1}</h1>
            <p className="ds-lead">{d.lead}</p>
            <div className="ip-cta">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-btn">Book a Consultation</a>
              <a href="#results" className="ds-btn--text">See results →</a>
            </div>
          </div>
          <div className="ip-hero-media">
            {d.hero ? (
              <figure className="ds-frame ip-hero-img"><img src={d.hero.img} alt={d.hero.alt} /></figure>
            ) : (
              <div className="ip-journey" aria-hidden="true">
                <span className="ds-curve" />
                <ol>
                  <li><span>Months before</span>"Who is the best surgeon for this near me?"</li>
                  <li><span>Weeks before</span>Reviews, results, credentials</li>
                  <li><span>Consultation</span>Booked with the practice that stayed in touch</li>
                </ol>
              </div>
            )}
            <span className="ds-sticker ip-sticker" style={{ '--ds-rot': '-3deg' }}>{d.sticker}</span>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="ds-section ip-why" aria-labelledby="ip-why-t">
        <div className="ds-container ip-split">
          <div>
            <span className="ds-eyebrow">Why it's different</span>
            <h2 id="ip-why-t" className="ds-h2">{d.why.h}</h2>
          </div>
          <div>
            <p className="ip-why-p">{d.why.p}</p>
            <ul className="ip-ticks">{d.why.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* CHALLENGES */}
      <section className="ds-section ds-dark ip-chal" aria-labelledby="ip-chal-t">
        <div className="ds-container">
          <span className="ds-eyebrow">What usually gets in the way</span>
          <h2 id="ip-chal-t" className="ds-h2 ip-chal-h">The leaks we see most often.</h2>
          <ol className="ip-chal-list">{d.challenges.map((c, i) => <li key={c}><span>{String(i + 1).padStart(2, '0')}</span>{c}</li>)}</ol>
        </div>
      </section>

      {/* RESULTS */}
      <section className="ds-section ip-results" id="results" aria-labelledby="ip-res-t">
        <div className="ds-container">
          <div className="ip-head ip-head--split">
            <div><span className="ds-eyebrow">Results</span><h2 id="ip-res-t" className="ds-h2">Proof from real practices.</h2></div>
            <a href="/case-studies" className="ds-btn--text">All case studies →</a>
          </div>
          {d.cases.length ? (
            <div className="ip-cases">
              {d.cases.map((k) => { const c = CASES[k]; return (
                <a key={k} href={c.href} className="ip-case">
                  <span className="ip-case-tag">{c.tag}</span>
                  <h3 className="ds-h2 ip-case-name">{c.name}</h3>
                  <p>{c.line}</p>
                  <ul className="ip-facts">{c.facts.map((f) => <li key={f}>{f}</li>)}</ul>
                  <span className="ds-btn--text">Read the case study →</span>
                </a>
              ); })}
            </div>
          ) : (
            <div className="ip-nocase">
              <p>We haven't published a case study in this specialty yet. The same system powers our medical work, for example at <a href="/case-studies/harmony-medspa-patient-growth-automation">Harmony MedSpa</a> and <a href="/case-studies/careinn-dental-clinic">CareInn Dental Clinic</a>.</p>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section className="ds-section ds-section--alt ip-services" aria-labelledby="ip-svc-t">
        <div className="ds-container">
          <div className="ip-head"><span className="ds-eyebrow">How we help</span><h2 id="ip-svc-t" className="ds-h2">The services that matter for {d.eyebrow.toLowerCase()}.</h2></div>
          <ul className="ip-svc-list">
            {services.map((s) => (
              <li key={s.slug}><a href={`/services/${s.slug}`}>
                <span className="ip-svc-stage">{s.stage}</span>
                <span className="ip-svc-t">{s.title}</span>
                <span className="ip-svc-p">{s.lead}</span>
                <span className="ds-btn--text">Learn more →</span>
              </a></li>
            ))}
          </ul>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="ds-section ip-res" aria-labelledby="ip-res2-t">
        <div className="ds-container ip-split">
          <div><span className="ds-eyebrow">Resources</span><h2 id="ip-res2-t" className="ds-h2">Read before you decide.</h2></div>
          <ul className="ip-posts">{d.posts.map((k) => { const p = POSTS[k]; return <li key={k}><a href={p.href}><span>{p.cat}</span>{p.title}</a></li>; })}</ul>
        </div>
      </section>

      {/* APPLY */}
      <section className="ds-section ds-section--alt ip-apply" id="apply" aria-labelledby="ip-apply-t">
        <div className="ds-container ds-container--wide ip-apply-grid">
          <div className="ip-apply-side">
            <span className="ds-eyebrow">Get started</span>
            <h2 id="ip-apply-t" className="ds-h2">Tell us about your practice.</h2>
            <p className="ds-lead">We'll review it and reply by email, usually within one business day. Prefer to talk first? <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a consultation</a>.</p>
            <p className="ds-hand">no patient details, please</p>
          </div>
          <div className="ip-form-card"><ApplicationForm source={d.slug} /></div>
        </div>
      </section>
    </main>
  );
}
