'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const BOOKING_URL = 'https://calendly.com/code_squad/30min';
const PHONE = { href: 'tel:+13073964945', label: '+1 (307) 396-4945' };

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .6 3 .7a2 2 0 0 1 1.7 2z" /></svg>
);

// `match` decides the active state; sub-pages (e.g. /blog/[slug]) light up their parent.
// `menu` adds a dropdown: groups of { heading, items: [{ href, label, note }] }.
const NAV = [
  { href: '/', label: 'Home', match: (p) => p === '/' },
  { href: '/fcb', label: 'FCB', title: 'Found. Chosen. Booked. — how the system works', match: (p) => p === '/fcb' },
  {
    href: '/services', label: 'Services', match: (p) => p.startsWith('/services'),
    menu: [
      { heading: 'Get found', items: [
        { href: '/services/seo', label: 'Medical SEO', note: 'Local search, treatment pages, content' },
        { href: '/services/aeo-geo', label: 'AEO & GEO', note: 'Visibility in AI search and answers' },
        { href: '/services/paid-ads', label: 'Paid ads', note: 'Google & Meta, per treatment' },
      ] },
      { heading: 'Get chosen & booked', items: [
        { href: '/services/website-design', label: 'Website design', note: 'Pages that earn the enquiry' },
        { href: '/services/follow-up-crm', label: 'Follow-up & CRM', note: 'Instant replies, nurture, dashboard' },
        { href: '/services', label: 'All services', note: 'See how they work together' },
      ] },
    ],
  },
  {
    href: '/case-studies', label: 'Case Studies', match: (p) => p.startsWith('/case-studies'),
    menu: [
      { heading: 'By specialty', items: [
        { href: '/case-studies/harmony-medspa-patient-growth-automation', label: 'Med spa', note: 'Harmony MedSpa' },
        { href: '/case-studies/careinn-dental-clinic', label: 'Dental clinic', note: 'CareInn Dental Clinic' },
        { href: '/case-studies/rtm-kinetics', label: 'Patient monitoring', note: 'RTM Kinetics' },
      ] },
      { heading: 'By service', items: [
        { href: '/case-studies?service=SEO', label: 'SEO results' },
        { href: '/case-studies?service=Follow-up%20%26%20CRM', label: 'Follow-up & CRM results' },
        { href: '/case-studies', label: 'All case studies' },
      ] },
    ],
  },
  { href: '/blog', label: 'Blogs', match: (p) => p.startsWith('/blog') },
  { href: '/work-with-us', label: 'Work With Us', match: (p) => p === '/work-with-us' },
];

export default function Header() {
  const path = (usePathname() || '/').replace(/\/+$/, '') || '/';
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  // Close on navigation.
  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    panel?.querySelector('a')?.focus();
    document.body.classList.add('sh-lock');

    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); return; }
      if (e.key !== 'Tab' || !panel) return;
      // Keep focus inside the menu + toggle while it is open.
      const items = [btnRef.current, ...panel.querySelectorAll('a')].filter(Boolean);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    const onResize = () => { if (window.innerWidth > 1080) setOpen(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.classList.remove('sh-lock');
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  // Desktop dropdown: which menu is open (by label). Closes on outside click, Escape and navigation.
  const [menu, setMenu] = useState(null);
  const navRef = useRef(null);
  useEffect(() => { setMenu(null); }, [path]);
  useEffect(() => {
    if (!menu) return undefined;
    const onDoc = (e) => { if (!navRef.current?.contains(e.target)) setMenu(null); };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      const btn = navRef.current?.querySelector(`[data-menu="${menu}"]`);
      setMenu(null); btn?.focus();
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [menu]);

  const linkEl = (n, active) => (
    <a href={n.href} title={n.title} className={active ? 'sh-link is-active' : 'sh-link'} aria-current={active ? 'page' : undefined}>{n.label}</a>
  );

  const desktopLinks = NAV.map((n) => {
    const active = n.match(path);
    if (!n.menu) return <li key={n.href}>{linkEl(n, active)}</li>;
    const isOpen = menu === n.label;
    const id = `sh-menu-${n.label.replace(/\s+/g, '-').toLowerCase()}`;
    return (
      <li key={n.href} className={isOpen ? 'sh-has-menu is-open' : 'sh-has-menu'}
        onMouseEnter={() => setMenu(n.label)} onMouseLeave={() => setMenu((m) => (m === n.label ? null : m))}>
        {linkEl(n, active)}
        <button type="button" className="sh-caret" data-menu={n.label} aria-expanded={isOpen} aria-controls={id}
          aria-label={`${n.label} menu`} onClick={() => setMenu(isOpen ? null : n.label)}>
          <svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <div id={id} className="sh-menu" hidden={!isOpen}>
          {n.menu.map((g) => (
            <div className="sh-menu__group" key={g.heading}>
              <p className="sh-menu__h">{g.heading}</p>
              <ul>
                {g.items.map((it) => (
                  <li key={it.href}>
                    <a href={it.href} className="sh-menu__a">
                      <span className="sh-menu__l">{it.label}</span>
                      {it.note ? <span className="sh-menu__n">{it.note}</span> : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </li>
    );
  });

  // Mobile panel: sub-links listed under their parent.
  const mobileLinks = NAV.map((n) => {
    const active = n.match(path);
    return (
      <li key={n.href}>
        {linkEl(n, active)}
        {n.menu ? (
          <ul className="sh-panel__sub">
            {n.menu.flatMap((g) => g.items).filter((it) => it.href !== n.href).map((it) => (
              <li key={it.href}><a href={it.href}>{it.label}</a></li>
            ))}
          </ul>
        ) : null}
      </li>
    );
  });

  return (
    <header id="header" className={open ? 'sh is-open' : 'sh'}>
      <div className="sh-bar">
        <a href="/" className="sh-logo" aria-label="MedGrow AI Solutions — home">
          <img src="/logo-updated.png" alt="MedGrow by CodeSquad" width="169" height="38" />
        </a>

        <nav className="sh-nav" aria-label="Main" ref={navRef}>
          <ul className="sh-list">{desktopLinks}</ul>
        </nav>

        <div className="sh-actions">
          <a href={PHONE.href} className="sh-phone" aria-label={`Call us: ${PHONE.label}`}>
            <PhoneIcon /><span className="sh-phone__n">{PHONE.label}</span>
          </a>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-btn ds-btn--sm sh-cta">Book a Consultation</a>
          <button
            ref={btnRef}
            type="button"
            className="sh-toggle"
            aria-expanded={open}
            aria-controls="sh-panel"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sh-toggle__bars" aria-hidden="true"><span /><span /><span /></span>
          </button>
        </div>
      </div>

      <div id="sh-panel" ref={panelRef} className="sh-panel" hidden={!open}>
        <nav aria-label="Mobile">
          <ul className="sh-panel__list">{mobileLinks}</ul>
        </nav>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-btn sh-panel__cta">Book a Consultation →</a>
        <a href={PHONE.href} className="sh-panel__phone"><PhoneIcon />Call {PHONE.label}</a>
        <p className="sh-panel__note">Free 30-minute call · or <a href="/work-with-us">work with us</a></p>
      </div>
      {open ? <div className="sh-scrim" aria-hidden="true" onClick={() => setOpen(false)} /> : null}
    </header>
  );
}
