import './fcb.css';

export const metadata = {
  title: 'Found. Chosen. Booked. — The Patient Growth System | MedGrow AI Solutions',
  description: 'How MedGrow AI Solutions finds and fixes the leaks between a patient search and a booked appointment, for clinics, med spas, dental and plastic surgery practices. Backed by the Clinic Transformation Guarantee.',
};

const BOOKING_URL = 'https://calendly.com/code_squad/30min';

// Guarantee wording. Confirm the exact terms (window, baseline, conditions) before publishing.
const GUARANTEE_DAYS = 90;

const STAGES = [
  {
    id: 'found', n: '01', word: 'Found',
    q: 'When a patient searches for your treatment, do they see you?',
    body: 'Patients search Google, scroll Maps, and now ask ChatGPT and Gemini which clinic to visit. If you\'re missing from those answers, the best care in town goes unseen.',
    leak: 'An outdated Google Business Profile, thin treatment pages, and ads pointing to a generic homepage.',
    fix: ['Google Business Profile & local SEO', 'Treatment-based Google & Meta ads', 'AEO & GEO for AI search answers'],
    links: [['/services/seo', 'Medical SEO'], ['/services/paid-ads', 'Paid ads'], ['/services/aeo-geo', 'AEO & GEO']],
  },
  {
    id: 'chosen', n: '02', word: 'Chosen',
    q: 'Once they find you, do they trust you over the clinic down the road?',
    body: 'Patients compare a few practices before they reach out. Clear information about the treatment, the team and what to expect is what earns the enquiry.',
    leak: 'Stock photos, vague pages, missing credentials, and no clear next step.',
    fix: ['One landing page per treatment', 'Real team, credentials and reviews up front', 'Clear booking options on every page'],
    links: [['/services/website-design', 'Website design']],
  },
  {
    id: 'booked', n: '03', word: 'Booked',
    q: 'When someone reaches out, how fast do they hear back?',
    body: 'Enquiries cool quickly, and many patients contact more than one practice. The clinic that replies first, and keeps following up, usually gets the appointment.',
    leak: 'Replies that take hours, missed after-hours enquiries, and no follow-up for people who don\'t book straight away.',
    fix: ['Instant text & email reply with a booking link', '14-day follow-up and past-patient reactivation', 'CRM and one live dashboard'],
    links: [['/services/follow-up-crm', 'Follow-up & CRM']],
  },
];

const CASES = [
  { href: '/case-studies/harmony-medspa-patient-growth-automation', tag: 'Med spa · Sarasota, FL', name: 'Harmony MedSpa', img: '/uploads/case-studies/harmony-medspa-cover.jpg', text: 'A 24/7 patient growth system that replies to new leads in about 60 seconds, follows up with non-bookers and reactivates past patients.', facts: ['~60 sec response', '20+ hrs/week saved', '5-touch follow-up'] },
  { href: '/case-studies/careinn-dental-clinic', tag: 'Dental clinic', name: 'CareInn Dental Clinic', img: 'https://qqxqwcnkyafwflxipmyn.supabase.co/storage/v1/object/public/case-study-media/1788170923372-fe725d11-6876-459d-83c9-05b87a4fb17b.webp', text: 'A patient growth system live before the clinic\'s first patient, answering every enquiry within 60 seconds and following up over 14 days.', facts: ['Live from day one', 'Under 60 sec response', '14-day follow-up'] },
  { href: '/case-studies/rtm-kinetics', tag: 'Remote patient monitoring', name: 'RTM Kinetics', img: 'https://qqxqwcnkyafwflxipmyn.supabase.co/storage/v1/object/public/case-study-media/1788189485854-81e06d6e-e27a-4213-914a-1e5ac83cd98a.jpg', text: 'One patient CRM from first enquiry to recovery, with automated reconnect campaigns for patients who had gone quiet.', facts: ['1 patient CRM', 'Automated reconnect'] },
];

const POSTS = [
  { href: '/blog/microneedling-seo-med-spas', cat: 'Found · Medical SEO', title: 'From "Microneedling Near Me" to Booked: The SEO Strategy for Med Spas', img: 'https://qqxqwcnkyafwflxipmyn.supabase.co/storage/v1/object/public/case-study-media/1790081842932-3deaf036-ad0d-4398-94f9-cc3ef2f55262.jpg' },
  { href: '/blog/seo-aeo-geo-ai-search-guide-2', cat: 'Found · AEO & GEO', title: 'SEO Is No Longer Enough: A Beginner\'s Guide to AEO and GEO in the Age of AI Search', img: 'https://qqxqwcnkyafwflxipmyn.supabase.co/storage/v1/object/public/case-study-media/1786370132859-8d078414-b23d-4bf7-90fb-5cd419e0b9fa.png' },
  { href: '/blog/how-businesses-lose-money-slow-lead-response', cat: 'Booked · Follow-up', title: 'The Hidden Cost of Slow Lead Response' },
  { href: '/blog/the-fully-booked-business', cat: 'Booked · Bookings', title: 'The Fully-Booked Business: a guide and self-assessment' },
];

export default function FcbPage() {
  return (
    <main id="top">
      {/* HERO */}
      <section className="fc-hero" aria-labelledby="fc-title">
        <div className="ds-container ds-container--wide">
          <p className="fc-kicker"><span>Found.</span> <span>Chosen.</span> <span>Booked.</span></p>
          <h1 id="fc-title" className="ds-h1 fc-title">Most clinics don't need more traffic. They need fewer <span className="ds-underline">leaks</span>.</h1>
          <div className="fc-hero-row">
            <p className="ds-lead">Every booked appointment passes through three moments: a patient finds you, chooses you, and books. We check each one, fix what's losing you patients, and connect it all in one system.</p>
            <div className="fc-hero-cta">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-btn">Book a Consultation</a>
              <a href="#guarantee" className="ds-btn--text">See our guarantee →</a>
            </div>
          </div>
          <ol className="fc-strip" aria-label="The three stages">
            {STAGES.map((s) => (
              <li key={s.id}><a href={`#${s.id}`}><span>{s.n}</span>{s.word}</a></li>
            ))}
          </ol>
        </div>
      </section>

      {/* THE THREE STAGES */}
      {STAGES.map((s, i) => (
        <section key={s.id} id={s.id} className={`fc-stage${i % 2 ? ' fc-stage--alt' : ''}`} aria-labelledby={`fc-${s.id}-t`}>
          <div className="ds-container ds-container--wide fc-stage-grid">
            <div className="fc-stage-word" aria-hidden="true"><span className="fc-stage-n">{s.n}</span><span className="fc-stage-big">{s.word}.</span></div>
            <div className="fc-stage-body">
              <h2 id={`fc-${s.id}-t`} className="ds-h2">{s.q}</h2>
              <p className="fc-stage-text">{s.body}</p>
              <div className="fc-stage-cols">
                <div className="fc-leak">
                  <h3 className="fc-sub">The usual leak</h3>
                  <p>{s.leak}</p>
                </div>
                <div>
                  <h3 className="fc-sub">What we fix</h3>
                  <ul className="fc-fix">{s.fix.map((f) => <li key={f}>{f}</li>)}</ul>
                  <p className="fc-svc-links">{s.links.map(([href, label]) => <a key={href} href={href} className="ds-btn--text">{label} →</a>)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* GUARANTEE */}
      <section className="ds-section fc-guarantee" id="guarantee" aria-labelledby="fc-g-title">
        <div className="ds-container">
          <div className="fc-g-card">
            <span className="ds-curve" aria-hidden="true" />
            <div className="fc-g-seal" aria-hidden="true"><span>{GUARANTEE_DAYS}</span>day<br />guarantee</div>
            <div className="fc-g-body">
              <span className="ds-eyebrow">Clinic Transformation Guarantee</span>
              <h2 id="fc-g-title" className="ds-h2">More patient enquiries, or we keep working for free.</h2>
              <p className="ds-lead">If your practice isn't receiving more patient enquiries within {GUARANTEE_DAYS} days of launch, we keep working on your system at no extra cost until it is.</p>
              <p className="fc-g-fine">Enquiries are measured against your baseline before launch, using the tracking we set up. We guarantee enquiries, not treatment outcomes or a set number of booked patients. Full terms are confirmed in your agreement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="ds-section ds-section--alt fc-plans" aria-labelledby="fc-plans-title">
        <div className="ds-container">
          <div className="fc-head">
            <span className="ds-eyebrow">How we work</span>
            <h2 id="fc-plans-title" className="ds-h2">Build it once. Keep it growing.</h2>
          </div>
          <div className="fc-plan-grid">
            <article className="fc-plan">
              <p className="fc-plan-k">Step one</p>
              <h3 className="fc-plan-t">The Build</h3>
              <p>We install the full Found → Chosen → Booked system inside the tools you already use. Usually live in 2–3 weeks.</p>
              <ul className="fc-fix">
                <li>Leak audit across search, ads, website and front desk</li>
                <li>Google Business Profile and local SEO</li>
                <li>Treatment landing pages and campaigns</li>
                <li>Instant reply, follow-up, CRM and dashboard</li>
              </ul>
            </article>
            <article className="fc-plan fc-plan--dark">
              <p className="fc-plan-k">Then, every month</p>
              <h3 className="fc-plan-t">Growth Retainer</h3>
              <p>Ongoing work so the system keeps improving, with clear reporting on what turned into bookings.</p>
              <ul className="fc-fix">
                <li>SEO, AEO and GEO content</li>
                <li>Ad and landing-page testing</li>
                <li>Follow-up and reactivation tuning</li>
                <li>Monthly report on enquiries and bookings</li>
              </ul>
            </article>
          </div>
          <p className="fc-more"><a href="/process" className="ds-btn--text">See the detailed process →</a></p>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="ds-section fc-cases" id="case-studies" aria-labelledby="fc-cases-title">
        <div className="ds-container">
          <div className="fc-head fc-head--split">
            <div>
              <span className="ds-eyebrow">Case studies</span>
              <h2 id="fc-cases-title" className="ds-h2">The system, in real practices.</h2>
            </div>
            <a href="/case-studies" className="ds-btn--text">All case studies →</a>
          </div>
          <div className="fc-case-grid">
            {CASES.map((c, i) => (
              <a key={c.href} href={c.href} className={`fc-case${i === 0 ? ' fc-case--lead' : ''}`}>
                <figure className={`ds-frame${i === 1 ? ' ds-frame--alt' : ''}`}><img src={c.img} alt="" loading="lazy" /></figure>
                <div className="fc-case-body">
                  <p className="fc-case-tag">{c.tag}</p>
                  <h3 className="ds-h3">{c.name}</h3>
                  <p>{c.text}</p>
                  <ul className="fc-facts">{c.facts.map((f) => <li key={f}>{f}</li>)}</ul>
                  <span className="ds-btn--text">Read the case study →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* BLOGS */}
      <section className="ds-section ds-section--alt fc-blogs" id="blogs" aria-labelledby="fc-blogs-title">
        <div className="ds-container">
          <div className="fc-head fc-head--split">
            <div>
              <span className="ds-eyebrow">From the blog</span>
              <h2 id="fc-blogs-title" className="ds-h2">Go deeper on each stage.</h2>
            </div>
            <a href="/blog" className="ds-btn--text">All articles →</a>
          </div>
          <div className="fc-blog-grid">
            {POSTS.filter((p) => p.img).map((p) => (
              <a key={p.href} href={p.href} className="fc-post fc-post--img">
                <figure className="ds-frame ds-frame--round"><img src={p.img} alt="" loading="lazy" /></figure>
                <span className="fc-post-cat">{p.cat}</span>
                <span className="fc-post-t">{p.title}</span>
              </a>
            ))}
            <ul className="fc-post-list">
              {POSTS.filter((p) => !p.img).map((p) => (
                <li key={p.href}><a href={p.href} className="fc-post"><span className="fc-post-cat">{p.cat}</span><span className="fc-post-t">{p.title}</span></a></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ds-section fc-final" aria-labelledby="fc-final-title">
        <div className="ds-container fc-final-inner">
          <p className="fc-kicker"><span>Found.</span> <span>Chosen.</span> <span>Booked.</span></p>
          <h2 id="fc-final-title" className="ds-h2">Let's find your leak.</h2>
          <p className="ds-lead">A free 30-minute consultation. We'll show you where patients are slipping away, and what we'd fix first.</p>
          <div className="fc-hero-cta fc-final-cta">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-btn">Book a Consultation</a>
            <a href="/work-with-us" className="ds-btn--secondary">Apply to work with us</a>
          </div>
        </div>
      </section>
    </main>
  );
}
