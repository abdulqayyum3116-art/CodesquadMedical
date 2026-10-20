import { SERVICES } from '../../content/services.config';
import './services.css';

export const metadata = {
  title: 'Services — SEO, AEO & GEO, Paid Ads, Websites, Follow-up | CodeSquad AI Solutions',
  description: 'Healthcare marketing services from CodeSquad AI Solutions: medical SEO, AEO & GEO for AI search, paid advertising, website design and instant follow-up with CRM.',
};

const STAGES = [
  { word: 'Found', text: 'Be visible when patients search, scroll and ask AI.' },
  { word: 'Chosen', text: 'Earn their trust before they reach out.' },
  { word: 'Booked', text: 'Answer fast and keep following up until they book.' },
];

export default function ServicesPage() {
  return (
    <main id="top">
      <section className="sv-hero sv-hero--hub" aria-labelledby="sv-title">
        <div className="ds-container ds-container--wide">
          <span className="ds-eyebrow">Services</span>
          <h1 id="sv-title" className="ds-h1 sv-title sv-title--hub">Healthcare marketing, connected from search to <span className="ds-underline">booking</span>.</h1>
          <p className="ds-lead">Each service works on its own, and works better together. Here's what we do at every stage of the patient journey.</p>
        </div>
      </section>

      {STAGES.map((st, i) => (
        <section key={st.word} className={`ds-section sv-stage-block${i % 2 ? ' ds-section--alt' : ''}`} aria-labelledby={`sv-st-${st.word}`}>
          <div className="ds-container sv-stage-grid">
            <div className="sv-stage-word">
              <span className="sv-n">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`sv-st-${st.word}`} className="sv-stage-big">{st.word}.</h2>
              <p>{st.text}</p>
            </div>
            <ul className="sv-hub-list">
              {SERVICES.filter((s) => s.stage === st.word).map((s) => (
                <li key={s.slug}>
                  <a href={`/services/${s.slug}`}>
                    <h3 className="ds-h3">{s.title}</h3>
                    <p>{s.lead}</p>
                    <span className="ds-btn--text">Explore {s.short} →</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="ds-section sv-final" aria-labelledby="sv-final-t">
        <div className="ds-container">
          <div className="sv-final-card">
            <span className="ds-curve" aria-hidden="true" />
            <h2 id="sv-final-t" className="ds-h2">Not sure which service you need?</h2>
            <p className="ds-lead">Most practices need a mix. In a free 30-minute consultation we'll tell you what we'd fix first.</p>
            <div className="sv-cta sv-cta--center">
              <a href="https://calendly.com/code_squad/30min" target="_blank" rel="noopener noreferrer" className="ds-btn">Book a Consultation</a>
              <a href="/fcb" className="ds-btn--secondary">See the full system</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
