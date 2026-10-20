'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { MOTION } from '../motion.config';

/**
 * Runs a graphic's GSAP timeline(s) while `active`, scoped to `ref`.
 * The DOM is authored in its FINAL state, so reduced-motion / inactive graphics read correctly with no JS.
 * `build({ root, q, resets })` returns a timeline/tween or an array of them.
 * Everything is reverted on deactivate/unmount; the timelines pause while off-screen.
 */
export function useGraphic(ref, active, compact, build) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !active) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const resets = [];
    let anims = [];
    const ctx = gsap.context(() => {
      anims = [].concat(build({ root, q: gsap.utils.selector(root), resets }) || []);
      if (compact) anims.forEach((a) => a.timeScale(MOTION.mobileSpeed));
    }, root);
    const io = new IntersectionObserver(([e]) => anims.forEach((a) => a.paused(!e.isIntersecting)));
    io.observe(root);
    return () => { io.disconnect(); ctx.revert(); resets.forEach((fn) => fn()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, compact]);
}

/** Types `text` into `el` over `dur`. */
export function typeInto(tl, el, text, dur, at, resets) {
  if (!el) return;
  const o = { n: 0 };
  el.textContent = '';
  resets.push(() => { el.textContent = text; });
  tl.to(o, { n: text.length, duration: dur, ease: 'none', onUpdate: () => { el.textContent = text.slice(0, Math.round(o.n)); } }, at);
}

/** Counts `el` from 0 up to `to`. */
export function countTo(tl, el, to, dur, at, resets, fmt = (v) => String(Math.round(v))) {
  if (!el) return;
  const o = { v: 0 };
  el.textContent = fmt(0);
  resets.push(() => { el.textContent = fmt(to); });
  tl.to(o, { v: to, duration: dur, ease: 'power2.out', onUpdate: () => { el.textContent = fmt(o.v); } }, at);
}

/** Draws an SVG path that has pathLength=1 (animates stroke-dashoffset only). */
export function draw(tl, el, dur, at, ease = 'power2.inOut') {
  if (!el) return;
  tl.fromTo(el, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur, ease }, at);
}

/** Small honesty label: every graphic uses illustrative numbers and names. */
export const Ex = () => <span className="gh-ex">Example</span>;
