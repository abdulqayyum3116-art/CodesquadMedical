'use client';
import { MOTION } from './motion.config';

const C = 220;          // viewBox centre
const R_OUT = 190;
const R_IN = 100;
const R_PROG = 206;

const pt = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.sin(a), C - r * Math.cos(a)];
};

/** Arc segment centred on 12 o'clock, spanning `span` degrees. The caller rotates it into place. */
export function arcPath(span, rOut = R_OUT, rIn = R_IN) {
  const h = span / 2;
  const [x1, y1] = pt(rOut, -h);
  const [x2, y2] = pt(rOut, h);
  const [x3, y3] = pt(rIn, h);
  const [x4, y4] = pt(rIn, -h);
  const large = span > 180 ? 1 : 0;
  return `M${x1} ${y1}A${rOut} ${rOut} 0 ${large} 1 ${x2} ${y2}L${x3} ${y3}A${rIn} ${rIn} 0 ${large} 0 ${x4} ${y4}Z`;
}

/**
 * Donut with one equal segment per item. The whole ring rotates (CSS var --gh-pos, set by GrowthHub)
 * so the active segment always sits at the focal point (9 o'clock); labels counter-rotate to stay upright.
 */
export default function HubDonut({ items, active, onSelect, onMouseEnter, onMouseLeave }) {
  const n = items.length;
  const seg = 360 / n;
  const d = arcPath(seg - MOTION.donut.gapDeg);
  return (
    <div
      className="gh-donut"
      style={{ '--gh-n': n, '--gh-seg': `${seg}deg`, '--gh-focal': `${MOTION.donut.focalDeg}deg`, '--gh-pop': `${MOTION.donut.popPx}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="gh-glow" aria-hidden="true" />
      <div className="gh-ring-rot" aria-hidden="true">
        <svg viewBox="0 0 440 440" focusable="false">
          {items.map((it, i) => (
            <g key={it.id} transform={`rotate(${i * seg} ${C} ${C})`}>
              <path className={`gh-seg${i === active ? ' is-active' : ''}`} d={d} onClick={() => onSelect(i)} />
            </g>
          ))}
        </svg>
      </div>
      <svg className="gh-prog" viewBox="0 0 440 440" aria-hidden="true" focusable="false">
        <circle cx={C} cy={C} r={R_PROG} pathLength="1" className="gh-prog-track" />
        <circle cx={C} cy={C} r={R_PROG} pathLength="1" className="gh-prog-arc" />
      </svg>
      {items.map((it, i) => (
        <button
          key={it.id}
          type="button"
          className={`gh-seg-label${i === active ? ' is-active' : ''}`}
          style={{ '--gh-c': `${i * seg}deg` }}
          data-gh-btn="donut"
          data-i={i}
          tabIndex={i === active ? 0 : -1}
          aria-current={i === active ? 'true' : undefined}
          aria-label={it.title}
          onClick={() => onSelect(i)}
        >
          <span>{it.shortLabel}</span>
        </button>
      ))}
      <div className="gh-hub" aria-hidden="true">
        <small>Your growth partner</small>
        <strong>MedGrow</strong>
        <span className="gh-hub-sub" key={active}>{items[active].shortLabel}</span>
        <span className="gh-hub-count">{String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
