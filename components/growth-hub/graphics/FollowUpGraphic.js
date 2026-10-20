'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { MOTION } from '../motion.config';
import { useGraphic, Ex } from './gfx';

const DAYS = [['Day 0', 'sms'], ['Day 1', 'mail'], ['Day 3', 'sms'], ['Day 7', 'call'], ['Day 14', 'mail']];
const ICONS = {
  sms: <path d="M2 3h10v7H6l-3 2.5V10H2z" />,
  mail: <path d="M1.5 3.5h11v7h-11zM1.5 4l5.5 3.8L12.5 4" />,
  call: <path d="M3 2.5h2.5l1 2.8-1.4 1a6.5 6.5 0 0 0 3.6 3.6l1-1.4 2.8 1v2.5A1.5 1.5 0 0 1 11 13 9.5 9.5 0 0 1 2 4a1.5 1.5 0 0 1 1-1.5z" />,
};

/** Item 5: instant reply, then a 14-day sequence ending in a booking. */
export default function FollowUpGraphic({ active, compact }) {
  const ref = useRef(null);
  useGraphic(ref, active, compact, ({ q, resets }) => {
    const tl = gsap.timeline();
    const watch = q('.fu-time')[0];
    tl.from(q('.fu-notif'), { yPercent: -160, autoAlpha: 0, duration: 0.7, ease: MOTION.ease.pop }, 0.1);
    const t = { s: 0 };
    watch.textContent = '00:00';
    resets.push(() => { watch.textContent = '00:04'; });
    tl.to(t, { s: 4, duration: 1.4, ease: 'power1.in', onUpdate: () => { watch.textContent = `00:0${Math.floor(t.s)}`; } }, 0.6);
    tl.from(q('.fu-watch'), { scale: 0.7, autoAlpha: 0, duration: 0.4, ease: MOTION.ease.pop }, 0.4);

    tl.from(q('.fu-phone'), { y: 24, autoAlpha: 0, duration: 0.6, ease: MOTION.ease.out }, 1.4);
    tl.from(q('.fu-sms'), { scale: 0.6, autoAlpha: 0, transformOrigin: 'left bottom', duration: 0.5, ease: MOTION.ease.pop }, 2);
    tl.from(q('.fu-inbox'), { autoAlpha: 0, duration: 0.4 }, 2.2);
    tl.from(q('.fu-env'), { xPercent: -260, yPercent: -140, scale: 0.5, autoAlpha: 0, duration: 0.9, ease: MOTION.ease.inOut }, 2.4);
    tl.from(q('.fu-badge-in'), { scale: 0, autoAlpha: 0, duration: 0.4, ease: MOTION.ease.pop }, 3.3);

    tl.from(q('.fu-rail-fill'), { scaleX: 0, transformOrigin: 'left center', duration: 2.4, ease: 'none' }, 3);
    q('.fu-node').forEach((n, k) => {
      tl.from(n, { autoAlpha: 0.25, scale: 0.7, duration: 0.4, ease: MOTION.ease.pop }, 3 + k * 0.6);
      tl.from(n.querySelector('.fu-dot'), { backgroundColor: 'rgba(255,244,232,.2)', duration: 0.3 }, 3 + k * 0.6);
    });
    tl.from(q('.fu-booked'), { scale: 0, autoAlpha: 0, transformOrigin: 'center bottom', duration: 0.5, ease: MOTION.ease.pop }, 5.5);

    const idle = gsap.timeline({ repeat: -1, delay: 6.2 });
    idle.fromTo(q('.fu-booked'), { scale: 1 }, { scale: 1.08, duration: 0.7, yoyo: true, repeat: 1, ease: MOTION.ease.soft }, 0);
    idle.fromTo(q('.fu-sms'), { y: 0 }, { y: -2, duration: 0.9, yoyo: true, repeat: 1, ease: MOTION.ease.soft }, 0);
    return [tl, idle];
  });

  return (
    <div className="gh-gfx fu" ref={ref}>
      <div className="fu-top">
        <div className="gh-box fu-notif"><i /><span><strong>New enquiry</strong><small>Dental implants · just now</small></span></div>
        <div className="gh-box fu-watch"><small>First reply</small><b className="fu-time">00:04</b></div>
      </div>
      <div className="fu-mid">
        <div className="fu-phone">
          <i className="fu-notch" />
          <p className="fu-sms">Hi Sam, thanks for getting in touch! We have a slot Thursday at 10am. Reply YES to confirm.</p>
        </div>
        <div className="gh-box fu-mail">
          <svg className="fu-inbox" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 13l2.5-7h13L21 13v6H3zM3 13h5l1 2.5h6l1-2.5h5" /></svg>
          <svg className="fu-env" viewBox="0 0 14 14" aria-hidden="true"><path d="M1.5 3.5h11v7h-11zM1.5 4l5.5 3.8L12.5 4" /></svg>
          <small>Email delivered</small>
          <b className="fu-badge-in">✓</b>
        </div>
      </div>
      <div className="fu-timeline">
        <span className="fu-rail"><i className="fu-rail-fill" /></span>
        {DAYS.map(([d, ch], k) => (
          <div className="fu-node" key={d}>
            {k === DAYS.length - 1 ? <span className="fu-booked">Booked ✓</span> : null}
            <i className="fu-dot" />
            <svg viewBox="0 0 14 14" aria-hidden="true">{ICONS[ch]}</svg>
            <small>{d}</small>
          </div>
        ))}
      </div>
      <Ex />
    </div>
  );
}
