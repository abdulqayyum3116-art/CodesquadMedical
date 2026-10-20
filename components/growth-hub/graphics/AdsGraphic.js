'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { MOTION } from '../motion.config';
import { useGraphic, countTo, Ex } from './gfx';

const FUNNEL = [['Impressions', 12400, 100], ['Clicks', 780, 62], ['Enquiries', 96, 34], ['Bookings', 38, 18]];
const fmt = (v) => Math.round(v).toLocaleString('en-US');

/** Item 4: ads slide in, the funnel narrows, the ROAS needle sweeps, the budget slider drives bookings. */
export default function AdsGraphic({ active, compact }) {
  const ref = useRef(null);
  useGraphic(ref, active, compact, ({ q, resets }) => {
    const tl = gsap.timeline();
    tl.from(q('.ads-card'), { x: -40, autoAlpha: 0, stagger: 0.25, duration: 0.7, ease: MOTION.ease.out }, 0.1);
    tl.from(q('.ads-gauge'), { autoAlpha: 0, duration: 0.5 }, 0.5);
    tl.fromTo(q('.ads-needle'), { rotation: -90 }, { rotation: 48, duration: 1.6, ease: 'power3.inOut', svgOrigin: '50 50' }, 0.9);
    tl.from(q('.ads-arc-val'), { strokeDashoffset: 0.767, duration: 1.6, ease: 'power3.inOut' }, 0.9);
    countTo(tl, q('.ads-roas')[0], 4.6, 1.6, 0.9, resets, (v) => `${v.toFixed(1)}x`);
    q('.ads-bar').forEach((b, k) => {
      tl.from(b, { scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: MOTION.ease.out }, 1 + k * 0.28);
      countTo(tl, q('.ads-num')[k], FUNNEL[k][1], 0.9, 1 + k * 0.28, resets, fmt);
    });
    tl.from(q('.ads-slider'), { autoAlpha: 0, y: 8, duration: 0.5 }, 2.2);

    // idle: the budget slider drifts and bookings react
    const idle = gsap.timeline({ delay: 3 });
    const s = { t: 0 };
    const rail = q('.ads-rail')[0], book = q('.ads-book')[0], spend = q('.ads-spend')[0];
    resets.push(() => { book.textContent = '38'; spend.textContent = '$3,200'; rail.style.removeProperty('--t'); });
    idle.fromTo(s, { t: 0.5 }, { t: 1, duration: 2, ease: MOTION.ease.soft, repeat: -1, yoyo: true, onUpdate: () => {
      rail.style.setProperty('--t', s.t.toFixed(3));
      book.textContent = String(Math.round(14 + s.t * 24));
      spend.textContent = `$${(Math.round((1200 + s.t * 2000) / 100) * 100).toLocaleString('en-US')}`;
    } });
    return [tl, idle];
  });

  return (
    <div className="gh-gfx ads" ref={ref}>
      <div className="ads-top">
        <div className="ads-cards">
          <div className="gh-box ads-card"><small><b>Ad</b> yourclinic.com</small><strong>Dental implants, book this week</strong><span>Free consultation · financing available</span></div>
          <div className="gh-box ads-card ads-social"><i /><span><strong>Smile makeover</strong><small>Sponsored · Learn more</small></span></div>
        </div>
        <div className="gh-box ads-gauge">
          <svg viewBox="0 0 100 58" aria-hidden="true">
            <path className="ads-arc" pathLength="1" d="M10 50 A40 40 0 0 1 90 50" />
            <path className="ads-arc-val" pathLength="1" d="M10 50 A40 40 0 0 1 90 50" />
            <g className="ads-needle"><path d="M50 50 L50 17" /></g>
            <circle cx="50" cy="50" r="3.4" className="ads-pin" />
          </svg>
          <strong className="ads-roas">4.6x</strong><small>Return on ad spend</small>
        </div>
      </div>
      <div className="ads-bottom">
        <div className="gh-box ads-funnel">
          {FUNNEL.map(([l, v, w]) => (
            <div className="ads-row" key={l}><small>{l}</small><span className="ads-track"><i className="ads-bar" style={{ width: `${w}%` }} /></span><b className="ads-num">{fmt(v)}</b></div>
          ))}
        </div>
        <div className="gh-box ads-slider">
          <small>Monthly budget</small><strong className="ads-spend">$3,200</strong>
          <span className="ads-rail"><i className="ads-fill" /><i className="ads-thumb" /></span>
          <small>Bookings <b className="ads-book">38</b></small>
        </div>
      </div>
      <Ex />
    </div>
  );
}
