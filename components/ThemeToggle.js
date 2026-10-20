'use client';
import { useEffect, useState } from 'react';

const KEY = 'cs-theme';

// Light/dark switch. The initial theme is applied before paint by the inline script in
// app/layout.js; this button reads it, flips it and remembers the choice.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    // Follow the OS setting until the visitor makes a choice.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      let saved = null;
      try { saved = localStorage.getItem(KEY); } catch { /* ignore */ }
      if (saved) return;
      const t = e.matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = t;
      setTheme(t);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch { /* ignore */ }
    setTheme(next);
  };

  const dark = theme === 'dark';
  return (
    <button type="button" className="sh-theme" onClick={toggle} aria-pressed={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}>
      <svg className="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      <svg className="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" /></svg>
    </button>
  );
}
