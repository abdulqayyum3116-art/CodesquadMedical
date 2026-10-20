'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { MOTION } from '../motion.config';
import { useGraphic, typeInto, Ex } from './gfx';

const QUESTION = 'How long does teeth whitening last?';
const PAA = ['Is whitening safe for sensitive teeth?', 'How often can I whiten my teeth?', 'Does whitening damage enamel?'];
// [text, highlighted-as-answer-N (0 = none)]
const CODE = [
  ['{', 0], [' "@type":"FAQPage",', 1], [' "mainEntity":[', 0], ['  {"@type":"Question",', 1],
  ['   "acceptedAnswer":{…}},', 1], ['  {"@type":"Question",', 2], ['   "acceptedAnswer":{…}},', 2],
  ['  {"@type":"Question",', 3], ['   "acceptedAnswer":{…}}', 3],
];

/** Item 2: the question gets typed, the clinic becomes the featured answer, schema lines light up. */
export default function AeoGraphic({ active, compact }) {
  const ref = useRef(null);
  useGraphic(ref, active, compact, ({ q, resets }) => {
    const tl = gsap.timeline();
    typeInto(tl, q('.aeo-q')[0], QUESTION, 1.3, 0, resets);
    tl.from(q('.aeo-bar b'), { scaleY: 0.2, stagger: 0.05, duration: 0.3 }, 0);
    tl.from(q('.aeo-feat'), { autoAlpha: 0, scaleY: 0.7, transformOrigin: 'top center', duration: 0.6, ease: MOTION.ease.out }, 1.5);
    tl.from(q('.aeo-hl'), { backgroundColor: 'rgba(169,184,140,0)', color: '#FFF4E8', duration: 0.6 }, 2.2);
    tl.from(q('.aeo-ln[data-a="1"]'), { backgroundColor: 'rgba(169,184,140,0)', duration: 0.4 }, 1.6);
    q('.aeo-paa-row').forEach((row, k) => {
      const at = 2.6 + k * 0.8;
      tl.from(row, { autoAlpha: 0.35, y: 6, duration: 0.4 }, at);
      tl.fromTo(row.querySelector('svg'), { rotation: 0 }, { rotation: 180, duration: 0.4, transformOrigin: '50% 50%' }, at + 0.1);
      tl.from(row.querySelector('i'), { scaleX: 0, duration: 0.5, ease: MOTION.ease.out }, at + 0.15);
      tl.from(q(`.aeo-ln[data-a="${k + 2}"]`), { backgroundColor: 'rgba(169,184,140,0)', duration: 0.4 }, at + 0.15);
    });
    tl.from(q('.aeo-code'), { autoAlpha: 0, x: 12, duration: 0.6 }, 1.2);

    const idle = gsap.timeline({ repeat: -1 });
    q('.aeo-bar b').forEach((b, k) => idle.to(b, { scaleY: 0.3 + ((k * 37) % 7) / 8, duration: 0.45 + k * 0.08, ease: MOTION.ease.soft, repeat: -1, yoyo: true }, 0));
    return [tl, idle];
  });

  return (
    <div className="gh-gfx aeo" ref={ref}>
      <div className="aeo-l">
        <div className="gh-box aeo-search">
          <span className="aeo-q">{QUESTION}</span>
          <span className="aeo-bar" aria-hidden="true"><b /><b /><b /><b /></span>
        </div>
        <div className="gh-box aeo-feat">
          <small>Featured answer</small>
          <p>Professional whitening typically lasts 6 months to 2 years, depending on diet, habits and aftercare.</p>
          <div className="aeo-src">Source: <mark className="aeo-hl">Your Clinic</mark> · yourclinic.com</div>
        </div>
        <div className="aeo-paa">
          <small>People also ask</small>
          {PAA.map((t) => (
            <div className="gh-box aeo-paa-row" key={t}>
              <span>{t}</span>
              <svg viewBox="0 0 12 12" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}><path d="m2.5 4.5 3.5 3.5 3.5-3.5" /></svg>
              <i />
            </div>
          ))}
        </div>
      </div>
      <pre className="gh-box aeo-code">
        {CODE.map(([t, a], i) => (<span key={i} className={`aeo-ln${a ? ' hl' : ''}`} data-a={a}>{t}{'\n'}</span>))}
      </pre>
      <Ex />
    </div>
  );
}
