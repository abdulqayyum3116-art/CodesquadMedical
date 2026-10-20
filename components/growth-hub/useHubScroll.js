'use client';
import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION } from './motion.config';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/**
 * Maps scroll progress through a tall track to an item index.
 * - onPosition(float): smoothed 0..count-1, called every frame (drives rotation / progress, no re-render)
 * - onIndex(int): the nearest item, called only when it changes
 * Returns scrollToItem(i), which scrolls the page to that item's position.
 */
export function useHubScroll({ trackRef, count, enabled, onPosition, onIndex }) {
  const stRef = useRef(null);
  const cb = useRef({ onPosition, onIndex });
  cb.current = { onPosition, onIndex };

  useEffect(() => {
    const track = trackRef.current;
    if (!enabled || !track || count < 2) return undefined;
    const root = document.documentElement;
    root.classList.add('gh-pinned-on'); // turns off CSS smooth-scroll so snapping isn't fought
    const smooth = { p: 0 };
    let last = -1;

    const st = ScrollTrigger.create({
      trigger: track,
      start: `top top+=${MOTION.headerOffset}`,
      end: 'bottom bottom',
      snap: { snapTo: 1 / (count - 1), ...MOTION.snap },
      onUpdate: (self) => {
        const target = self.progress * (count - 1);
        const idx = Math.round(target);
        if (idx !== last) { last = idx; cb.current.onIndex(idx); }
        gsap.to(smooth, { p: target, ...MOTION.smooth, overwrite: true, onUpdate: () => cb.current.onPosition(smooth.p) });
      },
    });
    stRef.current = st;
    // Content above the track can still change height after mount (font swap, images): re-measure.
    let raf = 0;
    const refresh = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => ScrollTrigger.refresh()); };
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);
    document.fonts?.ready.then(refresh);
    // initial state (the page may load mid-track)
    const t0 = st.progress * (count - 1);
    smooth.p = t0; last = Math.round(t0);
    cb.current.onIndex(last); cb.current.onPosition(t0);

    return () => {
      ro.disconnect(); cancelAnimationFrame(raf);
      gsap.killTweensOf(smooth);
      st.kill();
      stRef.current = null;
      root.classList.remove('gh-pinned-on');
    };
  }, [trackRef, count, enabled]);

  const scrollToItem = useCallback((i) => {
    const st = stRef.current;
    if (!st) return false;
    const y = st.start + (i / (count - 1)) * (st.end - st.start);
    window.scrollTo({ top: y, behavior: 'smooth' });
    return true;
  }, [count]);

  return scrollToItem;
}
