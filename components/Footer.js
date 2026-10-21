const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .6 3 .7a2 2 0 0 1 1.7 2z" /></svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 5h18v14H3zM3 7l9 6 9-6" /></svg>
);
// Five-point star polygon centred on (cx, cy), for the Pakistan flag.
const star = (cx, cy, R, r) => Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5, d = i % 2 ? r : R;
  return `${(cx + d * Math.cos(a)).toFixed(2)},${(cy + d * Math.sin(a)).toFixed(2)}`;
}).join(' ');

// Inline SVG flags (emoji flags don't render on Windows).
const flags = {
  US: (
    <svg viewBox="0 0 19 10" preserveAspectRatio="none">
      <rect width="19" height="10" fill="#B22234" />
      {[1, 3, 5, 7, 9, 11].map((i) => <rect key={i} y={(i * 10) / 13} width="19" height={10 / 13} fill="#fff" />)}
      <rect width="7.6" height={70 / 13} fill="#3C3B6E" />
    </svg>
  ),
  CA: (
    <svg viewBox="0 0 40 20" preserveAspectRatio="none">
      <rect width="40" height="20" fill="#D52B1E" />
      <rect x="10" width="20" height="20" fill="#fff" />
      <polygon fill="#D52B1E" points="20,3 21.3,6 23,5.3 22.4,9 24.5,7.5 25.2,9 27,8.6 26.3,11 27.2,11.6 23.2,14.2 23.6,15.4 20.4,15 20.4,17.5 19.6,17.5 19.6,15 16.4,15.4 16.8,14.2 12.8,11.6 13.7,11 13,8.6 14.8,9 15.5,7.5 17.6,9 17,5.3 18.7,6" />
    </svg>
  ),
  UK: (
    <svg viewBox="0 0 60 30" preserveAspectRatio="none">
      <clipPath id="cs-flag-uk"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z" /></clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0L60,30M60,0L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0L60,30M60,0L0,30" clipPath="url(#cs-flag-uk)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0v30M0,15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0v30M0,15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
  UAE: (
    <svg viewBox="0 0 12 6" preserveAspectRatio="none">
      <rect width="12" height="2" fill="#00732F" />
      <rect y="2" width="12" height="2" fill="#fff" />
      <rect y="4" width="12" height="2" fill="#000" />
      <rect width="3" height="6" fill="#FF0000" />
    </svg>
  ),
  PK: (
    <svg viewBox="0 0 30 20" preserveAspectRatio="none">
      <rect width="30" height="20" fill="#01411C" />
      <rect width="7.5" height="20" fill="#fff" />
      <circle cx="18.5" cy="10" r="5.8" fill="#fff" />
      <circle cx="20.1" cy="8.6" r="5" fill="#01411C" />
      <polygon fill="#fff" points={star(21.6, 7, 1.7, 0.7)} />
    </svg>
  ),
};

// Social profiles. An empty url renders a non-clickable "coming soon" placeholder instead of a dead link.
const SOCIAL_ICONS = {
  LinkedIn: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.1c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4z" /></svg>,
  Instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>,
  YouTube: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2C1.5 10.100 1.5 12 1.5 12s0 1.9.5 3.800a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-3.800.5-3.800s0-1.9-.5-3.800zM10 15V9l5.200 3z" /></svg>,
};

const SOCIAL = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/shahzaibhamid/' },
  { name: 'Instagram', url: 'https://www.instagram.com/drshah.growth/' },
  { name: 'YouTube', url: 'https://www.youtube.com/@drshahzaibhamid' },
];

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'UAE', name: 'United Arab Emirates' },
  { code: 'PK', name: 'Pakistan' },
];

export default function Footer() {
  return (
    <footer className="cs-footer">
      <div className="cs-container">
       <div className="cs-footer__card">
        <div className="cs-footer__grid">
          <div className="cs-footer__about">
            <a className="cs-brand" href="/">
              <img className="cs-logo" src="/logo-updated.png" alt="MedGrow by CodeSquad" width="215" height="48" />
            </a>
            <p>MedGrow AI Solutions helps medical clinics, med spas, dental practices and plastic surgeons get found, chosen and booked.</p>
            <div className="cs-footer__follow">
            <ul className="cs-social" aria-label="Social media">
              {SOCIAL.map((s) => (
                <li key={s.name}>
                  {s.url
                    ? <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name} title={s.name}>{SOCIAL_ICONS[s.name]}</a>
                    : <span className="cs-social--soon" title={`${s.name} coming soon`}>{SOCIAL_ICONS[s.name]}</span>}
                </li>
              ))}
            </ul>
            </div>
          </div>
          <div>
            <h4>Pages</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/fcb">Found. Chosen. Booked.</a></li>
              <li><a href="/industry">Industries</a></li>
              <li><a href="/case-studies">Case Studies</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/work-with-us">Work With Us</a></li>
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li><a href="/services/seo">Medical SEO</a></li>
              <li><a href="/services/aeo-geo">AEO &amp; GEO</a></li>
              <li><a href="/services/paid-ads">Paid Ads</a></li>
              <li><a href="/services/website-design">Website Design</a></li>
              <li><a href="/services/follow-up-crm">Follow-up &amp; CRM</a></li>
              <li><a href="/services">All services</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+13073964945"><PhoneIcon />+1 (307) 396-4945</a></li>
              <li><a href="mailto:info@codesquad.ai"><MailIcon />info@codesquad.ai</a></li>
            </ul>
          </div>
          <div>
            <h4>Where we work</h4>
            <ul className="cs-footer__countries">
              {countries.map((c) => (
                <li key={c.code}><span className="cs-country__flag" aria-hidden="true">{flags[c.code]}</span>{c.name}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="cs-footer__bottom">
          <span>© 2026 MedGrow AI Solutions. All rights reserved.</span>
          <span className="cs-footer__tag">Found. Chosen. Booked.</span>
        </div>
       </div>
      </div>
    </footer>
  );
}
