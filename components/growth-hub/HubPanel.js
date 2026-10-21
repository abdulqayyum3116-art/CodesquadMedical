'use client';
import { useEffect, useRef, useState } from 'react';
import { MOTION } from './motion.config';

/** Graphic stage: keeps the outgoing graphic mounted briefly so it can fade out while the new one plays in. */
function GraphicStage({ items, active }) {
  const [leaving, setLeaving] = useState([]);
  const prev = useRef(active);
  useEffect(() => {
    if (prev.current === active) return undefined;
    const gone = prev.current;
    prev.current = active;
    setLeaving((l) => [...l.filter((x) => x !== active), gone]);
    const t = setTimeout(() => setLeaving((l) => l.filter((x) => x !== gone)), MOTION.graphic.out * 1000);
    return () => clearTimeout(t);
  }, [active]);

  const shown = [...new Set([...leaving, active])];
  return (
    <div className="gh-stage-g" aria-hidden="true">
      {shown.map((i) => {
        const G = items[i].graphic;
        const out = i !== active;
        return (
          <div key={items[i].id} className={`gh-g${out ? ' is-out' : ''}`} style={{ '--gh-out': `${MOTION.graphic.out}s` }}>
            <G active={!out} />
          </div>
        );
      })}
    </div>
  );
}

export default function HubPanel({ items, active, progressRef, onSelect }) {
  const item = items[active];
  const last = active === items.length - 1;
  return (
    <div className="gh-card">
      <nav className="gh-nav" aria-label="Growth system topics">
        <span className="gh-nav-line" aria-hidden="true"><i ref={progressRef} /></span>
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            className={`gh-nav-btn${i === active ? ' is-active' : ''}`}
            data-gh-btn="nav"
            data-i={i}
            tabIndex={i === active ? 0 : -1}
            aria-current={i === active ? 'true' : undefined}
            onClick={() => onSelect(i)}
          >
            <span className="gh-nav-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            {it.title}
          </button>
        ))}
      </nav>
      <div className="gh-main">
        <GraphicStage items={items} active={active} />
        <div className="gh-text" key={item.id}>
          <h3 className="gh-title">{item.title}</h3>
          <p className="gh-desc">{item.description}</p>
        </div>
        <a href="/fcb" className={`ds-btn gh-cta${last ? ' is-attn' : ''}`}>See how it works</a>
      </div>
    </div>
  );
}
