export const metadata = {
  title: 'Page Not Found | CodeSquad',
  description: 'The page you’re looking for doesn’t exist or may have moved.',
  robots: { index: false, follow: true }
};

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

const links = [
  { href: '/', label: 'Home' },
  { href: '/industry', label: 'Industries' },
  { href: '/process', label: 'Process' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/blog', label: 'Blog' },
  { href: '/inquiry', label: 'Send an Inquiry' },
];

export default function NotFound() {
  return (
    <main id="top">
      <section className="sec" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="wrap" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <span className="eyebrow reveal">404 error</span>
          <h1 className="display reveal" style={{ fontSize: 'clamp(40px,7vw,80px)', margin: '14px 0 16px' }}>
            This page doesn&apos;t exist.
          </h1>
          <p className="reveal" style={{ margin: '0 auto 34px', maxWidth: 480, fontSize: 17, color: '#48473f', lineHeight: 1.6 }}>
            The link may be outdated, mistyped, or the page may have moved. Let&apos;s get you back on track.
          </p>
          <div className="hero-cta reveal" style={{ justifyContent: 'center', marginBottom: 44 }}>
            <a href="/" className="btn btn-dark">Back to Home <Arrow /></a>
            <a href="/inquiry" className="btn btn-ghost">Send an Inquiry</a>
          </div>
          <nav className="reveal" aria-label="Popular pages" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 22px' }}>
            {links.map((l) => (
              <a key={l.href} href={l.href} style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', opacity: .75 }}>{l.label}</a>
            ))}
          </nav>
        </div>
      </section>
    </main>
  );
}
