'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { MOTION } from '../motion.config';
import { useGraphic, countTo, draw, Ex } from './gfx';

const KPIS = [
  { l: 'Organic visits', v: 4820, f: (n) => Math.round(n).toLocaleString('en-US') },
  { l: 'AI mentions', v: 128, f: (n) => String(Math.round(n)) },
  { l: 'Ad ROAS', v: 4.6, f: (n) => `${n.toFixed(1)}x` },
  { l: 'Enquiries', v: 312, f: (n) => String(Math.round(n)) },
  { l: 'Response time', v: 4, f: (n) => `${Math.round(n)}s` },
  { l: 'Bookings', v: 96, f: (n) => String(Math.round(n)) },
  { l: 'Revenue', v: 48.2, f: (n) => `$${n.toFixed(1)}k` },
];
// where each mini-graphic "flies in from" (relative to its grid slot, in cqw), echoing the six earlier scenes
const FLY = [[-34, -18, -5], [-8, -30, 4], [30, -26, -3], [-36, 8, 5], [-4, 34, -4], [32, 22, 6]];
const MINIS = ['SEO', 'AEO', 'GEO', 'Ads', 'Follow-up', 'CRM'];

function Mini({ k }) {
  switch (k) {
    case 'SEO': return <svg viewBox="0 0 40 24" aria-hidden="true"><rect x="3" y="15" width="6" height="7" /><rect x="13" y="10" width="6" height="12" /><rect x="23" y="5" width="6" height="17" className="hi" /><path d="M5 12 16 8l10-5" className="ln" /></svg>;
    case 'AEO': return <svg viewBox="0 0 40 24" aria-hidden="true"><rect x="3" y="3" width="34" height="9" rx="2" className="hi" /><rect x="3" y="15" width="22" height="2.6" rx="1.3" /><rect x="3" y="20" width="16" height="2.6" rx="1.3" /></svg>;
    case 'GEO': return <svg viewBox="0 0 40 24" aria-hidden="true"><path d="M6 5 20 12M34 5 20 12M6 20 20 12M34 20 20 12" className="ln" /><circle cx="20" cy="12" r="5" className="hi" /><circle cx="6" cy="5" r="2.4" /><circle cx="34" cy="5" r="2.4" /><circle cx="6" cy="20" r="2.4" /><circle cx="34" cy="20" r="2.4" /></svg>;
    case 'Ads': return <svg viewBox="0 0 40 24" aria-hidden="true"><rect x="3" y="3" width="34" height="4.5" rx="2" /><rect x="8" y="10" width="24" height="4.5" rx="2" /><rect x="13" y="17" width="14" height="4.5" rx="2" className="hi" /></svg>;
    case 'Follow-up': return <svg viewBox="0 0 40 24" aria-hidden="true"><path d="M5 12h30" className="ln" /><circle cx="5" cy="12" r="3" className="hi" /><circle cx="14" cy="12" r="3" className="hi" /><circle cx="24" cy="12" r="3" className="hi" /><circle cx="35" cy="12" r="3" /></svg>;
    default: return <svg viewBox="0 0 40 24" aria-hidden="true"><rect x="2" y="3" width="8" height="18" rx="2" /><rect x="12" y="3" width="8" height="12" rx="2" /><rect x="22" y="3" width="8" height="15" rx="2" className="hi" /><rect x="32" y="3" width="6" height="8" rx="2" /></svg>;
  }
}

/** Item 7: the six earlier scenes snap into one dashboard; KPIs count up, the chart draws, "Live" pulses. */
export default function DashboardGraphic({ active, compact }) {
  const ref = useRef(null);
  useGraphic(ref, active, compact, ({ q, root, resets }) => {
    const tl = gsap.timeline();
    const cq = root.clientWidth / 100; // 1cqw in px
    tl.from(q('.db-main'), { autoAlpha: 0, y: 12, duration: 0.6 }, 0);
    draw(tl, q('.db-line')[0], 1.8, 0.6);
    tl.from(q('.db-area'), { autoAlpha: 0, duration: 0.8 }, 1.6);
    q('.db-mini').forEach((m, i) => {
      const [x, y, r] = FLY[i];
      tl.from(m, { x: x * cq, y: y * cq, rotation: r, scale: 1.7, autoAlpha: 0, duration: 1.0, ease: 'power3.out' }, 0.2 + i * 0.16);
      tl.from(m, { boxShadow: '0 0 0 0.8cqw rgba(169,184,140,.5)', duration: 0.5 }, 1.1 + i * 0.16);
    });
    q('.db-kpi').forEach((k, i) => {
      tl.from(k, { autoAlpha: 0, y: 8, duration: 0.4 }, 1.2 + i * 0.1);
      const el = k.querySelector('b');
      const o = { v: 0 };
      el.textContent = KPIS[i].f(0);
      resets.push(() => { el.textContent = KPIS[i].f(KPIS[i].v); });
      tl.to(o, { v: KPIS[i].v, duration: 1.4, ease: 'power2.out', onUpdate: () => { el.textContent = KPIS[i].f(o.v); } }, 1.2 + i * 0.1);
    });
    tl.from(q('.db-live'), { autoAlpha: 0, duration: 0.4 }, 2.2);

    const idle = gsap.timeline({ repeat: -1, delay: 3 });
    idle.fromTo(q('.db-ping'), { scale: 1, autoAlpha: 0.9, transformOrigin: '50% 50%' }, { scale: 2.8, autoAlpha: 0, duration: 1.5, ease: 'power1.out' }, 0);
    idle.fromTo(q('.db-end'), { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.5, duration: 0.75, yoyo: true, repeat: 1, ease: MOTION.ease.soft }, 0);
    return [tl, idle];
  });

  return (
    <div className="gh-gfx db" ref={ref}>
      <div className="db-l">
        <div className="gh-box db-main">
          <header><small>Revenue · last 90 days</small><span className="db-live"><svg viewBox="0 0 8 8" aria-hidden="true"><circle className="db-ping" cx="4" cy="4" r="3" /><circle cx="4" cy="4" r="2.4" /></svg>Live</span></header>
          <svg viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true">
            <path className="db-area" d="M0 30 C12 28 18 22 30 21 S48 24 58 15 S80 8 100 3 V34 H0Z" />
            <path className="db-line" pathLength="1" d="M0 30 C12 28 18 22 30 21 S48 24 58 15 S80 8 100 3" />
            <circle className="db-end" cx="99" cy="3" r="1.8" />
          </svg>
        </div>
        <div className="db-kpis">
          {KPIS.map((k) => (<div className="gh-box db-kpi" key={k.l}><small>{k.l}</small><b>{k.f(k.v)}</b></div>))}
        </div>
      </div>
      <div className="db-r">
        {MINIS.map((m) => (<div className="gh-box db-mini" key={m}><Mini k={m} /><small>{m}</small></div>))}
      </div>
      <Ex />
    </div>
  );
}
