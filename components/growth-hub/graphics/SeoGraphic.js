'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { MOTION } from '../motion.config';
import { useGraphic, typeInto, countTo, draw, Ex } from './gfx';

const OTHERS = ['BrightCare Dental', 'Metro Dental Group', 'City Implant Centre', 'Family Dental Clinic', 'Oak Street Dentistry'];
const CHIPS = ['implants', 'invisalign', 'emergency dentist'];

/** Item 1: the clinic's result climbs from #8 to #1 while traffic grows. */
export default function SeoGraphic({ active, compact }) {
  const ref = useRef(null);
  useGraphic(ref, active, compact, ({ q, resets }) => {
    const tl = gsap.timeline();
    const me = q('.seo-me')[0];
    const others = q('.seo-other');
    const rank = (el, v) => { el.textContent = `#${Math.round(v)}`; };

    typeInto(tl, q('.seo-type')[0], 'dental implants near me', 1, 0, resets);
    tl.from(q('.seo-row'), { autoAlpha: 0, y: 8, stagger: 0.06, duration: 0.4 }, 0.9);
    tl.from(q('.seo-chart-box'), { autoAlpha: 0, y: 10, duration: 0.5 }, 0.9);

    // the climb: the clinic row rises 5 slots, everything it passes slides down one
    const climb = 1.7, at = 1.5;
    const p = { t: 0 };
    me.querySelector('.seo-rank').textContent = '#8';
    others.forEach((el, k) => { el.querySelector('.seo-rank').textContent = `#${k + 1}`; });
    resets.push(() => { me.querySelector('.seo-rank').textContent = '#1'; others.forEach((el, k) => { el.querySelector('.seo-rank').textContent = `#${k + 2}`; }); });
    tl.from(me, { yPercent: 500, duration: climb, ease: MOTION.ease.inOut }, at);
    tl.from(others, { yPercent: -100, duration: climb, ease: MOTION.ease.inOut }, at);
    tl.from(me, { backgroundColor: 'rgba(255,244,232,0)', duration: climb, ease: 'none' }, at);
    tl.to(p, { t: 1, duration: climb, ease: MOTION.ease.inOut, onUpdate: () => {
      rank(me.querySelector('.seo-rank'), 8 - 7 * p.t);
      others.forEach((el, k) => rank(el.querySelector('.seo-rank'), k + p.t));
    } }, at);

    draw(tl, q('.seo-line')[0], 1.6, 1.4);
    tl.from(q('.seo-area'), { autoAlpha: 0, duration: 0.8 }, 2.4);
    countTo(tl, q('.seo-pct')[0], 212, 1.8, 1.4, resets, (v) => `+${Math.round(v)}%`);
    tl.from(q('.seo-chip'), { scale: 0.6, autoAlpha: 0, stagger: 0.25, duration: 0.45, ease: MOTION.ease.pop }, 2.2);
    tl.from(q('.seo-tick'), { scale: 0, autoAlpha: 0, stagger: 0.25, duration: 0.3, ease: MOTION.ease.pop, transformOrigin: '50% 50%' }, 2.7);

    const idle = gsap.timeline({ repeat: -1, delay: 3.4 });
    idle.fromTo(q('.seo-dot'), { scale: 1, autoAlpha: 0.9, transformOrigin: '50% 50%' }, { scale: 2.6, autoAlpha: 0, duration: 1.6, ease: 'power1.out' }, 0);
    idle.fromTo(me, { boxShadow: '0 0 0 0 rgba(255,180,138,.55)' }, { boxShadow: '0 0 0 1.2cqw rgba(255,180,138,0)', duration: 1.8, ease: 'power1.out' }, 0);
    return [tl, idle];
  });

  return (
    <div className="gh-gfx seo" ref={ref}>
      <div className="seo-l">
        <div className="gh-box seo-bar"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></svg><span className="seo-type">dental implants near me</span><i className="gh-caret" /></div>
        <div className="seo-list">
          <div className="seo-row seo-me"><b className="seo-rank">#1</b><span><strong>Your Clinic</strong><small>Dental implants · book online</small></span></div>
          {OTHERS.map((n, k) => (
            <div className="seo-row seo-other" key={n}><b className="seo-rank">#{k + 2}</b><span><strong>{n}</strong><small>Implants &amp; restorations</small></span></div>
          ))}
        </div>
      </div>
      <div className="seo-r">
        <div className="gh-box seo-chart-box">
          <small>Organic visits</small>
          <strong className="seo-pct">+212%</strong>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
            <path className="seo-area" d="M0 36 C15 34 25 30 38 26 S60 16 72 12 S90 5 100 3 V40 H0Z" />
            <path className="seo-line" pathLength="1" d="M0 36 C15 34 25 30 38 26 S60 16 72 12 S90 5 100 3" />
            <circle className="seo-dot" cx="99" cy="3" r="2" />
            <circle cx="99" cy="3" r="1.6" className="seo-dot-core" />
          </svg>
        </div>
        <div className="seo-chips">
          {CHIPS.map((c) => (
            <span className="gh-chip seo-chip" key={c}><svg className="seo-tick" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.4 5 8.9l4.6-5" /></svg>{c}</span>
          ))}
        </div>
      </div>
      <Ex />
    </div>
  );
}
