'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './growth-hub.css';
import './graphics/graphics.css';
import { HUB_ITEMS } from './hubItems';
import { MOTION } from './motion.config';
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
  const [mode, setMode] = useState(null);       // 'desktop' | 'stacked' once mounted
  const [reduced, setReduced] = useState(false);
  const stageRef = useRef(null);
  const stackRef = useRef(null);
  const lineRef = useRef(null);
  const pillsRef = useRef(null);

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const posRef = useRef(0);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  // Keep the active pill visible in the horizontally scrolling bar (mobile).
  useEffect(() => {
    const bar = pillsRef.current;
    const pill = bar?.children[active];
    if (bar && pill && mode === 'stacked') bar.scrollTo({ left: pill.offsetLeft - bar.clientWidth / 2 + pill.offsetWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
  }, [active, mode, reduced]);

  // Which layout is live (mirrors CSS media queries).
  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 767px)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      const red = mqReduce.matches;
      setReduced(red);
      setMode(mqMobile.matches || red ? 'stacked' : 'desktop');
    };
    sync();
    mqMobile.addEventListener('change', sync);
    mqReduce.addEventListener('change', sync);
    return () => {
      mqMobile.removeEventListener('change', sync);
      mqReduce.removeEventListener('change', sync);
    };
  }, []);

  const applyPosition = useCallback((pos, targetIndex) => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty('--gh-pos', pos.toFixed(4));
    const p = targetIndex / (N - 1);
    stage.style.setProperty('--gh-prog', p.toFixed(4));
    if (lineRef.current) lineRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
  }, []);

  const goToIndex = useCallback((targetIndex) => {
    const currentPos = posRef.current;
    const currentNorm = ((currentPos % N) + N) % N;
    let diff = targetIndex - currentNorm;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;

    const targetPos = currentPos + diff;

    gsap.killTweensOf(posRef);
    gsap.to(posRef, {
      current: targetPos,
      duration: MOTION.rotationDuration,
      ease: MOTION.ease.out,
      onUpdate: () => {
        applyPosition(posRef.current, targetIndex);
      },
      onComplete: () => {
        posRef.current = targetPos;
        applyPosition(targetPos, targetIndex);
      }
    });

    setActive(targetIndex);
  }, [applyPosition]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (pausedRef.current || mode === 'stacked' || reduced) return;

    timerRef.current = setTimeout(() => {
      if (!pausedRef.current && mode !== 'stacked' && !reduced) {
        const next = (activeRef.current + 1) % N;
        goToIndex(next);
        resetTimer();
      }
    }, MOTION.autoPlayInterval);
  }, [goToIndex, mode, reduced]);

  // Start auto-play timer once mounted and layout is desktop
  useEffect(() => {
    if (mode === 'desktop' && !reduced) {
      applyPosition(0, 0);
      resetTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      gsap.killTweensOf(posRef);
    };
  }, [mode, reduced, resetTimer, applyPosition]);

  const select = useCallback((i) => {
    if (mode === 'stacked') {
      document.getElementById(`gh-card-${HUB_ITEMS[i].id}`)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      setActive(i);
      return;
    }
    goToIndex(i);
    resetTimer();
  }, [mode, reduced, goToIndex, resetTimer]);

  const onMouseEnter = () => {
    pausedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const onMouseLeave = () => {
    pausedRef.current = false;
    resetTimer();
  };

  // Arrow keys move between items within whichever list/donut has focus.
  const onKeyDown = (e) => {
    const btn = e.target.closest?.('[data-gh-btn]');
    if (!btn) return;
    const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const next = (Number(btn.dataset.i) + dir + N) % N;
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

      {/* Desktop + tablet: auto-advancing wheel story */}
      <div className="gh-pinned">
        <div className="gh-track">
          <div
            className="gh-stage"
            ref={stageRef}
            onKeyDown={onKeyDown}
          >
            <div className="ds-container ds-container--wide gh-stage-in">
              <HubDonut
                items={HUB_ITEMS}
                active={active}
                onSelect={select}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              />
              {mode !== 'stacked' ? <HubPanel items={HUB_ITEMS} active={active} progressRef={lineRef} onSelect={select} /> : <div className="gh-card" />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile + reduced motion: stacked cards */}
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
        <div className="ds-container gh-stack-cta"><a href="/fcb" className="ds-btn">See how it works</a></div>
      </div>

      <div className="gh-sr" aria-live="polite" role="status">{`${active + 1} of ${N}: ${HUB_ITEMS[active].title}`}</div>
    </section>
  );
}
