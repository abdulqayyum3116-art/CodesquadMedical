'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import './growth-hub.css';
import './graphics/graphics.css';
import { HUB_ITEMS } from './hubItems';
import { MOTION } from './motion.config';
import { useHubScroll } from './useHubScroll';
import HubDonut from './HubDonut';
import HubPanel from './HubPanel';

const N = HUB_ITEMS.length;

/** Mobile / reduced-motion card: plays its graphic while it is in the middle band of the viewport. */
function StackCard({ item, index, mounted, reduced, onView }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !mounted) return undefined;
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting);
      if (e.isIntersecting) { setSeen(true); onView(index); }
    }, { rootMargin: '-35% 0px -35% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [mounted, index, onView]);
  const G = item.graphic;
  return (
    <article className="gh-scard" ref={ref} id={`gh-card-${item.id}`}>
      <div className="gh-stage-g" aria-hidden="true">
        {mounted && (seen || reduced) ? <G active={inView && !reduced} compact /> : null}
      </div>
      <h3 className="gh-title">{item.title}</h3>
      <p className="gh-desc">{item.description}</p>
    </article>
  );
}

export default function GrowthHub() {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState(null);       // 'pinned' | 'stacked' once mounted
  const [reduced, setReduced] = useState(false);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const stackRef = useRef(null);
  const lineRef = useRef(null);
  const pillsRef = useRef(null);

  // Keep the active pill visible in the horizontally scrolling bar.
  useEffect(() => {
    const bar = pillsRef.current;
    const pill = bar?.children[active];
    if (bar && pill && mode === 'stacked') bar.scrollTo({ left: pill.offsetLeft - bar.clientWidth / 2 + pill.offsetWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
  }, [active, mode, reduced]);

  // Which layout is live (mirrors the CSS media queries that show/hide each DOM tree).
  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 767px)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { setReduced(mqReduce.matches); setMode(mqMobile.matches || mqReduce.matches ? 'stacked' : 'pinned'); };
    sync();
    mqMobile.addEventListener('change', sync); mqReduce.addEventListener('change', sync);
    return () => { mqMobile.removeEventListener('change', sync); mqReduce.removeEventListener('change', sync); };
  }, []);

  const onPosition = useCallback((pos) => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty('--gh-pos', pos.toFixed(4));
    const p = pos / (N - 1);
    stage.style.setProperty('--gh-prog', p.toFixed(4));
    if (lineRef.current) lineRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
  }, []);

  const scrollToItem = useHubScroll({ trackRef, count: N, enabled: mode === 'pinned', onPosition, onIndex: setActive });

  const select = useCallback((i) => {
    if (mode === 'pinned') { if (!scrollToItem(i)) setActive(i); return; }
    document.getElementById(`gh-card-${HUB_ITEMS[i].id}`)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    setActive(i);
  }, [mode, scrollToItem, reduced]);

  // Arrow keys move between items within whichever list/donut has focus.
  const onKeyDown = (e) => {
    const btn = e.target.closest?.('[data-gh-btn]');
    if (!btn) return;
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const next = Math.min(N - 1, Math.max(0, Number(btn.dataset.i) + dir));
    select(next);
    const group = btn.dataset.ghBtn;
    setTimeout(() => stageRef.current?.querySelector(`[data-gh-btn="${group}"][data-i="${next}"]`)?.focus({ preventScroll: true }), 60);
  };

  // Stacked mode: sticky pill bar follows the card in view.
  const onStackView = useCallback((i) => {
    setActive(i);
    stackRef.current?.style.setProperty('--gh-prog', (i / (N - 1)).toFixed(3));
  }, []);

  return (
    <section className="ds-section ds-dark hm-plat gh" id="platform" aria-labelledby="hm-plat-title">
      <div className="ds-container">
        <div className="hm-head hm-head--center reveal">
          <h2 id="hm-plat-title" className="ds-h2">One system for SEO, AEO, GEO, ads, CRM and automation, all in a single dashboard.</h2>
          <p className="hm-plat-sub">MedGrow, <em>your growth partner</em>, takes the busywork off your plate</p>
        </div>
      </div>

      {/* Desktop + tablet: pinned scroll story */}
      <div className="gh-pinned">
        <div className="gh-track" ref={trackRef} style={{ height: `${N * MOTION.vhPerItem}vh` }}>
          <div className="gh-stage" ref={stageRef} onKeyDown={onKeyDown}>
            <div className="ds-container ds-container--wide gh-stage-in">
              <HubDonut items={HUB_ITEMS} active={active} onSelect={select} />
              {mode === 'pinned' ? <HubPanel items={HUB_ITEMS} active={active} progressRef={lineRef} onSelect={select} /> : <div className="gh-card" />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile + reduced motion: no pinning, stacked cards */}
      <div className="gh-stack" ref={stackRef}>
        <div className="gh-pillbar">
          <div className="gh-pills" ref={pillsRef} role="group" aria-label="Growth system topics">
            {HUB_ITEMS.map((it, i) => (
              <button key={it.id} type="button" className={`gh-pill${i === active ? ' is-active' : ''}`} aria-current={i === active ? 'true' : undefined} onClick={() => select(i)}>
                {it.shortLabel}
              </button>
            ))}
          </div>
          <i className="gh-pills-bar" aria-hidden="true" />
        </div>
        <div className="ds-container gh-scards">
          {HUB_ITEMS.map((it, i) => (
            <StackCard key={it.id} item={it} index={i} mounted={mode === 'stacked'} reduced={reduced} onView={onStackView} />
          ))}
        </div>
        <div className="ds-container gh-stack-cta"><a href="#services" className="ds-btn">See how it works</a></div>
      </div>

      <div className="gh-sr" aria-live="polite" role="status">{`${active + 1} of ${N}: ${HUB_ITEMS[active].title}`}</div>
    </section>
  );
}
