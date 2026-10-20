import { notFound } from 'next/navigation';
import { SERVICES, CASES, POSTS, getService } from '../../../content/services.config';
import '../services.css';

const BOOKING_URL = 'https://calendly.com/code_squad/30min';

export const dynamicParams = false;
export function generateStaticParams() { return SERVICES.map((s) => ({ slug: s.slug })); }
export function generateMetadata({ params }) {
  const s = getService(params.slug);
  if (!s) return {};
  return { title: `${s.title} | MedGrow AI Solutions`, description: s.lead };
}

export default function ServicePage({ params }) {
  const s = getService(params.slug);
  if (!s) notFound();
  const others = SERVICES.filter((o) => o.slug !== s.slug);
  return (
    <main id="top">
      {/* HERO */}
      <section className="sv-hero" aria-labelledby="sv-title">
        <div className="ds-container ds-container--wide sv-hero-grid">
          <div>
            <nav className="sv-crumbs" aria-label="Breadcrumb"><a href="/services">Services</a><span aria-hidden="true">/</span><span aria-current="page">{s.short}</span></nav>
            <p className="sv-stage"><span>{s.stage}.</span> Part of the <a href="/fcb">Found. Chosen. Booked.</a> system</p>
            <h1 id="sv-title" className="ds-h1 sv-title">{s.h1}</h1>
            <p className="ds-lead">{s.lead}</p>
            <div className="sv-cta">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-btn">Book a Consultation</a>
              <a href="#results" className="ds-btn--text">See results →</a>
            </div>
          </div>
          <figure className="ds-frame sv-hero-img"><img src={s.img} alt={s.imgAlt} width="1600" height="800" /></figure>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="ds-section sv-who" aria-labelledby="sv-who-t">
        <div className="ds-container sv-split">
          <div>
            <span className="ds-eyebrow">Who it's for</span>
            <h2 id="sv-who-t" className="ds-h2">Built for appointment-based practices.</h2>
          </div>
          <ul className="sv-who-list">{s.who.map((w) => <li key={w}>{w}</li>)}</ul>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="ds-section ds-section--alt sv-inc" aria-labelledby="sv-inc-t">
        <div className="ds-container">
          <div className="sv-head">
            <span className="ds-eyebrow">What's included</span>
            <h2 id="sv-inc-t" className="ds-h2">{s.title}, done properly.</h2>
          </div>
          <ol className="sv-inc-list">
            {s.included.map(([t, d], i) => (
              <li key={t}><span className="sv-n">{String(i + 1).padStart(2, '0')}</span><h3 className="ds-h3">{t}</h3><p>{d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      {/* APPROACH */}
      <section className="ds-section ds-dark sv-approach" aria-labelledby="sv-ap-t">
        <span className="ds-curve" aria-hidden="true" />
        <div className="ds-container sv-approach-inner">
          <span className="ds-eyebrow">Our approach</span>
          <h2 id="sv-ap-t" className="ds-h2">Part of one connected system.</h2>
          <p className="sv-approach-text">{s.approach}</p>
          <a href="/fcb" className="ds-btn--text">How Found. Chosen. Booked. works →</a>
        </div>
      </section>

      {/* RESULTS */}
      <section className="ds-section sv-results" id="results" aria-labelledby="sv-res-t">
        <div className="ds-container">
          <div className="sv-head sv-head--split">
            <div><span className="ds-eyebrow">Results</span><h2 id="sv-res-t" className="ds-h2">Where we've built this.</h2></div>
            <a href="/case-studies" className="ds-btn--text">All case studies →</a>
          </div>
          {s.cases.length ? null : (
            <p className="sv-nocase">We haven't published a case study for this service yet. It runs inside the same system as our medical work, for example at <a href="/case-studies/harmony-medspa-patient-growth-automation">Harmony MedSpa</a> and <a href="/case-studies/careinn-dental-clinic">CareInn Dental Clinic</a>.</p>
          )}
          <div className="sv-cases">
            {s.cases.map((k) => { const c = CASES[k]; return (
              <a key={k} href={c.href} className="sv-case">
                <span className="sv-case-tag">{c.tag}</span>
                <h3 className="ds-h3">{c.name}</h3>
                <p>{c.line}</p>
                <ul className="sv-facts">{c.facts.map((f) => <li key={f}>{f}</li>)}</ul>
                <span className="ds-btn--text">Read the case study →</span>
              </a>
            ); })}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="ds-section ds-section--alt sv-how" aria-labelledby="sv-how-t">
        <div className="ds-container sv-split">
          <div>
            <span className="ds-eyebrow">How we work</span>
            <h2 id="sv-how-t" className="ds-h2">Build it once. Keep it growing.</h2>
            <p className="ds-lead">A one-time build to set everything up inside your existing tools, usually live in 2–3 weeks, then a monthly growth retainer with clear reporting.</p>
            <p className="sv-more"><a href="/process" className="ds-btn--text">See the full process →</a></p>
          </div>
          <ol className="sv-steps">
            <li><span>1</span><div><h3 className="ds-h3">Consultation</h3><p>A free 30-minute call about your practice and where enquiries are lost.</p></div></li>
            <li><span>2</span><div><h3 className="ds-h3">Audit & plan</h3><p>We review search, ads, website and follow-up, then prioritise the fixes.</p></div></li>
            <li><span>3</span><div><h3 className="ds-h3">Build & launch</h3><p>Everything connected and live, with your team trained to use it.</p></div></li>
            <li><span>4</span><div><h3 className="ds-h3">Grow monthly</h3><p>Ongoing optimisation and reporting on enquiries and bookings.</p></div></li>
          </ol>
        </div>
      </section>

      {/* OTHER SERVICES + RESOURCES */}
      <section className="ds-section sv-next" aria-labelledby="sv-next-t">
        <div className="ds-container sv-next-grid">
          <div>
            <span className="ds-eyebrow">Other services</span>
            <h2 id="sv-next-t" className="ds-h3 sv-next-h">Works best together</h2>
            <ul className="sv-links">
              {others.map((o) => <li key={o.slug}><a href={`/services/${o.slug}`}><span className="sv-links-stage">{o.stage}</span>{o.title}</a></li>)}
            </ul>
          </div>
          <div>
            <span className="ds-eyebrow">Resources</span>
            <h2 className="ds-h3 sv-next-h">Read more</h2>
            <ul className="sv-links">
              {s.posts.map((k) => { const p = POSTS[k]; return <li key={k}><a href={p.href}><span className="sv-links-stage">{p.cat}</span>{p.title}</a></li>; })}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ds-section sv-final" aria-labelledby="sv-final-t">
        <div className="ds-container">
          <div className="sv-final-card">
            <span className="ds-curve" aria-hidden="true" />
            <p className="sv-kicker"><span>Found.</span> <span>Chosen.</span> <span>Booked.</span></p>
            <h2 id="sv-final-t" className="ds-h2">Talk to us about {s.short.toLowerCase()} for your practice.</h2>
            <p className="ds-lead">A free 30-minute consultation. We'll look at what you have today and what we'd change first.</p>
            <div className="sv-cta sv-cta--center">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-btn">Book a Consultation</a>
              <a href="/work-with-us" className="ds-btn--secondary">Apply to work with us</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
