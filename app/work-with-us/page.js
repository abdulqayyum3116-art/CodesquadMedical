import ApplicationForm from '../../components/ApplicationForm';
import './work-with-us.css';

export const metadata = {
  title: 'Work With Us — Apply | CodeSquad AI Solutions',
  description: 'Apply to work with CodeSquad AI Solutions. We work with medical clinics, med spas, dental practices and plastic surgery practices that want to be found, chosen and booked.',
};

const FITS = [
  { n: '01', t: 'Medical clinics', d: 'Local practices that want patients to find the right service quickly and book without phone tag.' },
  { n: '02', t: 'Med spas & aesthetic clinics', d: 'Treatment-led businesses where speed of reply and a clear offer decide who gets the booking.' },
  { n: '03', t: 'Dental practices', d: 'From new-patient exams to implants and aligners, practices that want every enquiry followed up.' },
  { n: '04', t: 'Plastic surgery practices', d: 'Practices with long, considered patient journeys that need to stay visible and in touch.' },
];

export default function WorkWithUsPage() {
  return (
    <main id="top">
      {/* INTRO */}
      <section className="wu-hero" aria-labelledby="wu-title">
        <div className="ds-container ds-container--wide wu-hero-grid">
          <div className="wu-hero-copy">
            <span className="ds-eyebrow">Work with us</span>
            <h1 id="wu-title" className="ds-h1 wu-title">We work with medical practices that want to be found, chosen and <span className="ds-underline">booked</span>.</h1>
            <p className="ds-lead">CodeSquad AI Solutions builds one connected patient growth system (advertising, SEO, AEO and GEO, landing pages and instant follow-up) inside the tools your practice already uses. We take on a small number of practices at a time, so we ask a few questions first to make sure we're the right fit.</p>
            <div className="wu-hero-cta">
              <a href="#apply" className="ds-btn">Start your application</a>
              <a href="https://calendly.com/code_squad/30min" target="_blank" rel="noopener noreferrer" className="ds-btn--text">Or book a consultation →</a>
            </div>
          </div>

          <figure className="wu-portrait">
            <span className="ds-curve wu-portrait-curve" aria-hidden="true" />
            <div className="ds-frame wu-portrait-frame">
              <img src="/founder.jpeg" alt="Shahzaib Hamid, Founder and CEO of CodeSquad AI Solutions" width="800" height="800" fetchpriority="high" />
            </div>
            <figcaption className="wu-portrait-cap">
              <span className="wu-cap-name">Shahzaib Hamid</span>
              <span className="wu-cap-role">Founder &amp; CEO · PhD, Applied AI</span>
            </figcaption>
            <blockquote className="wu-portrait-quote">
              <p>"Healthcare isn't just a client vertical for us. It's where my research started."</p>
              <a href="/founder" className="ds-btn--text">Read the founder profile →</a>
            </blockquote>
          </figure>
        </div>
      </section>

      {/* WHO SHOULD APPLY */}
      <section className="ds-section ds-section--alt wu-fit" aria-labelledby="wu-fit-title">
        <div className="ds-container">
          <div className="wu-head">
            <span className="ds-eyebrow">Who should apply</span>
            <h2 id="wu-fit-title" className="ds-h2">Built for appointment-based medicine.</h2>
          </div>
          <ol className="wu-fit-list">
            {FITS.map((f) => (
              <li key={f.n}><span className="wu-fit-n">{f.n}</span><h3 className="ds-h3">{f.t}</h3><p>{f.d}</p></li>
            ))}
          </ol>

          <div className="wu-fit-cols">
            <div>
              <h3 className="wu-sub">You're likely a good fit if</h3>
              <ul className="wu-ticks">
                <li>You can take on new patients and want a steadier flow of enquiries.</li>
                <li>You want to know which marketing actually produces appointments.</li>
                <li>You'd rather improve the tools you use than replace them all.</li>
                <li>Someone on your team can work with us on approvals and feedback.</li>
              </ul>
            </div>
            <div>
              <h3 className="wu-sub">We may not be the right fit if</h3>
              <ul className="wu-ticks wu-ticks--no">
                <li>You're looking for guaranteed patient numbers or overnight results.</li>
                <li>Your business isn't appointment-based healthcare.</li>
              </ul>
              <p className="wu-honest">If we're not the right fit, we'll tell you, and point you somewhere better if we can.</p>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION */}
      <section className="ds-section wu-apply" id="apply" aria-labelledby="wu-apply-title">
        <div className="ds-container ds-container--wide wu-apply-grid">
          <aside className="wu-apply-side">
            <span className="ds-eyebrow">Application</span>
            <h2 id="wu-apply-title" className="ds-h2">Tell us about your practice.</h2>
            <p className="ds-lead">It takes about five minutes. The more you share, the more useful our first conversation will be.</p>
            <ol className="wu-next">
              <li><span>1</span>We review your application.</li>
              <li><span>2</span>We reply by email, usually within one business day.</li>
              <li><span>3</span>If it looks like a fit, we book a free 30-minute consultation.</li>
            </ol>
            <p className="ds-hand wu-side-note">no patient details, please</p>
            <p className="wu-contact">Questions? <a href="mailto:info@codesquad.ai">info@codesquad.ai</a> · <a href="tel:+13073964945">+1 (307) 396-4945</a></p>
          </aside>
          <div className="wu-form-card">
            <ApplicationForm />
          </div>
        </div>
      </section>
    </main>
  );
}
