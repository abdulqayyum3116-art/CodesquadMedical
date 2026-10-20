'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { MOTION } from '../motion.config';
import { useGraphic, draw, Ex } from './gfx';

const ANSWER = 'For physiotherapy near you, Riverside Physio is highly rated for sports injuries and offers same-week appointments.'.split(' ');
const CITES = ['Website', 'Reviews', 'Local listing'];
// content sources feeding the AI node (viewBox 0 0 120 150)
const SRC = [{ l: 'Blog post', x: 22, y: 20 }, { l: 'Reviews', x: 98, y: 20 }, { l: 'FAQs', x: 22, y: 130 }, { l: 'Listings', x: 98, y: 130 }];
const HUB = { x: 60, y: 75 };

/** Item 3: an AI assistant recommends the clinic; content sources flow into the AI node. */
export default function GeoGraphic({ active, compact }) {
  const ref = useRef(null);
  useGraphic(ref, active, compact, ({ q }) => {
    const tl = gsap.timeline();
    tl.from(q('.geo-user'), { autoAlpha: 0, y: 10, duration: 0.5 }, 0.2);
    tl.from(q('.geo-bot'), { autoAlpha: 0, y: 10, duration: 0.4 }, 1.5);
    tl.from(q('.geo-w'), { autoAlpha: 0, stagger: 0.09, duration: 0.2, ease: 'none' }, 1.8);
    tl.from(q('.geo-cite'), { autoAlpha: 0, y: 8, scale: 0.8, stagger: 0.18, duration: 0.4, ease: MOTION.ease.pop }, 3.1);

    tl.from(q('.geo-node'), { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%', stagger: 0.1, duration: 0.5, ease: MOTION.ease.pop }, 0.3);
    q('.geo-link').forEach((l) => draw(tl, l, 0.8, 0.8));
    SRC.forEach((s, k) => {
      const dot = q('.geo-dot')[k];
      tl.fromTo(dot, { attr: { cx: s.x, cy: s.y }, autoAlpha: 1 }, { attr: { cx: HUB.x, cy: HUB.y }, duration: 1, ease: MOTION.ease.inOut }, 1.4 + k * 0.35);
      tl.to(dot, { autoAlpha: 0, duration: 0.15 }, 2.4 + k * 0.35);
    });
    tl.fromTo(q('.geo-pulse'), { scale: 1, autoAlpha: 0.8, transformOrigin: '50% 50%' }, { scale: 2.4, autoAlpha: 0, duration: 1.1, ease: 'power1.out' }, 2.5);

    // idle: sources keep feeding the AI node
    const idle = gsap.timeline({ repeat: -1, delay: 3.8 });
    SRC.forEach((s, k) => {
      idle.fromTo(q('.geo-dot')[k], { attr: { cx: s.x, cy: s.y }, autoAlpha: 1 }, { attr: { cx: HUB.x, cy: HUB.y }, duration: 1.2, ease: MOTION.ease.soft }, k * 0.5);
      idle.to(q('.geo-dot')[k], { autoAlpha: 0, duration: 0.15 }, 1.2 + k * 0.5);
    });
    idle.fromTo(q('.geo-pulse'), { scale: 1, autoAlpha: 0.7, transformOrigin: '50% 50%' }, { scale: 2.2, autoAlpha: 0, duration: 1.2, ease: 'power1.out' }, 1.6);
    return [tl, idle];
  });

  return (
    <div className="gh-gfx geo" ref={ref}>
      <div className="gh-box geo-chat">
        <div className="geo-head"><i /> AI assistant</div>
        <p className="geo-user">Who’s the best physiotherapist in my area?</p>
        <p className="geo-bot">{ANSWER.map((w, i) => (<span className={`geo-w${w === 'Riverside' || w === 'Physio' ? ' me' : ''}`} key={i}>{w} </span>))}</p>
        <div className="geo-cites">{CITES.map((c) => (<span className="gh-chip geo-cite" key={c}>{c}</span>))}</div>
      </div>
      <svg className="geo-net" viewBox="0 0 120 150" aria-hidden="true">
        {SRC.map((s) => (<path key={s.l} className="geo-link" pathLength="1" d={`M${s.x} ${s.y}L${HUB.x} ${HUB.y}`} />))}
        <circle className="geo-pulse" cx={HUB.x} cy={HUB.y} r="13" />
        <g className="geo-node"><circle className="geo-ai" cx={HUB.x} cy={HUB.y} r="13" /><text className="geo-ait" x={HUB.x} y={HUB.y + 2.6} textAnchor="middle">AI</text></g>
        {SRC.map((s) => (
          <g className="geo-node" key={s.l}><rect x={s.x - 17} y={s.y - 7} width="34" height="14" rx="7" /><text x={s.x} y={s.y + 2.6} textAnchor="middle">{s.l}</text></g>
        ))}
        {SRC.map((s) => (<circle key={`d${s.l}`} className="geo-dot" cx={HUB.x} cy={HUB.y} r="2.4" style={{ opacity: 0 }} />))}
      </svg>
      <Ex />
    </div>
  );
}
