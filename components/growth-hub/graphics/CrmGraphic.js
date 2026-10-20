'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { MOTION } from '../motion.config';
import { useGraphic, Ex } from './gfx';

const COLS = ['New', 'Contacted', 'Booked', 'Treated'];
// final column, fixed row. `path` = columns the card visits on its way to `col`.
const CARDS = [
  { id: 'A', name: 'Patient A', tag: 'Whitening', col: 2, row: 0, from: 0 },
  { id: 'B', name: 'Patient B', tag: 'Implants', col: 1, row: 1, from: 0 },
  { id: 'C', name: 'Patient C', tag: 'Consult', col: 3, row: 2, from: 1 },
  { id: 'D', name: 'Patient D', tag: 'Invisalign', col: 0, row: 2, from: 0 },
];
// each step: [card index, column it moves to]; counts are recomputed after every step
const STEPS = [[[1, 1]], [[0, 1], [2, 2]], [[0, 2], [2, 3]]];

/** Item 6: leads move across the pipeline, counters update, a contact card shows the detail. */
export default function CrmGraphic({ active, compact }) {
  const ref = useRef(null);
  useGraphic(ref, active, compact, ({ q, root, resets }) => {
    const tl = gsap.timeline();
    const cards = q('.crm-card');
    const counts = q('.crm-n');
    const colW = root.querySelector('.crm-board').clientWidth / COLS.length;
    const pos = CARDS.map((c) => c.from);
    const paint = () => COLS.forEach((_, i) => { counts[i].textContent = String(pos.filter((p) => p === i).length); });
    resets.push(() => { CARDS.forEach((c, i) => { pos[i] = c.col; }); paint(); });

    cards.forEach((el, i) => tl.set(el, { x: (CARDS[i].from - CARDS[i].col) * colW }, 0));
    tl.call(paint, null, 0);
    tl.from(q('.crm-col'), { autoAlpha: 0, y: 10, stagger: 0.08, duration: 0.5 }, 0);
    tl.from(cards, { autoAlpha: 0, y: 8, stagger: 0.1, duration: 0.4 }, 0.5);

    STEPS.forEach((moves, s) => {
      const at = 1.4 + s * 1.1;
      moves.forEach(([ci, col]) => {
        tl.to(cards[ci], { x: (col - CARDS[ci].col) * colW, duration: 0.8, ease: MOTION.ease.inOut }, at);
        tl.call(() => { pos[ci] = col; paint(); }, null, at + 0.8);
      });
      tl.fromTo(q('.crm-auto'), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.25 }, at + 0.2);
      tl.to(q('.crm-auto'), { autoAlpha: 0.35, duration: 0.5 }, at + 0.9);
    });
    tl.to(q('.crm-auto'), { autoAlpha: 1, duration: 0.3 }, 4.9);
    tl.from(q('.crm-detail'), { yPercent: 40, autoAlpha: 0, duration: 0.7, ease: MOTION.ease.out }, 3.2);
    tl.from(q('.crm-tag'), { scale: 0.6, autoAlpha: 0, stagger: 0.15, duration: 0.4, ease: MOTION.ease.pop }, 3.8);

    const idle = gsap.timeline({ repeat: -1, delay: 5 });
    idle.fromTo(q('.crm-auto'), { autoAlpha: 1 }, { autoAlpha: 0.45, duration: 0.9, yoyo: true, repeat: 1, ease: MOTION.ease.soft }, 0);
    idle.fromTo(q('.crm-live'), { scale: 1, autoAlpha: 0.9, transformOrigin: '50% 50%' }, { scale: 2.4, autoAlpha: 0, duration: 1.4, ease: 'power1.out' }, 0);
    return [tl, idle];
  });

  return (
    <div className="gh-gfx crm" ref={ref}>
      <div className="crm-board">
        {COLS.map((c, i) => (
          <div className="crm-col" key={c}><header>{c}<b className="crm-n">{CARDS.filter((k) => k.col === i).length}</b></header></div>
        ))}
        {CARDS.map((c) => (
          <div className="gh-box crm-card" key={c.id} style={{ '--col': c.col, '--row': c.row }}>
            <i>{c.id}</i><span><strong>{c.name}</strong><small>{c.tag}</small></span>
          </div>
        ))}
      </div>
      <div className="gh-box crm-detail">
        <i className="crm-av">D</i>
        <div className="crm-d-body">
          <strong>Patient D</strong>
          <div className="crm-tags"><span className="gh-chip crm-tag">Implants</span><span className="gh-chip crm-tag">High intent</span></div>
          <small>“Can I book a consult for Friday?”</small>
          <small className="crm-task">Next task · call back today 2:00pm</small>
        </div>
        <span className="crm-auto"><svg className="crm-live" viewBox="0 0 8 8" aria-hidden="true"><circle cx="4" cy="4" r="3" /></svg>Auto-assigned to front desk</span>
      </div>
      <Ex />
    </div>
  );
}
