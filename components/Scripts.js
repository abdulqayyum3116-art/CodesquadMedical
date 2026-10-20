'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { submitInquiryAction } from '../app/inquiry/actions';

export default function Scripts() {
  const pathname = usePathname();
  useEffect(() => {
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
    const cleanups = [];
    const on = (t, ev, fn, opt) => { t.addEventListener(ev, fn, opt); cleanups.push(() => t.removeEventListener(ev, fn, opt)); };

    document.documentElement.classList.add('js');

    /* active nav (page-level) */
    const path = (location.pathname.replace(/\/+$/, '') || '/');
    document.querySelectorAll('.nav-links a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href.indexOf('#') > -1) return;
      const hp = href.replace(/\/+$/, '') || '/';
      if (hp === path) a.classList.add('active');
    });
    if (['/industry', '/aesthetics', '/clinics', '/dental', '/plastic-surgery'].indexOf(path) > -1) {
      const t = document.querySelector('.nav-drop-toggle'); if (t) t.classList.add('active');
    }

    /* header shrink */
    const header = document.getElementById('header');
    const onScrollHeader = () => header && header.classList.toggle('scrolled', window.scrollY > 20);
    on(window, 'scroll', onScrollHeader); onScrollHeader();
    // white nav text over dark heros (home, aesthetics, case-study detail) until scrolled
    const darkPaths = ['/', '/aesthetics', '/clinics', '/industry', '/process', '/blog', '/case-studies', '/inquiry'];
    const darkHero = darkPaths.indexOf(path) > -1 || path.startsWith('/case-studies/');
    if (header) header.classList.toggle('header-on-dark', darkHero);

    /* mobile menu + dropdown */
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    if (menuBtn && navLinks) {
      on(menuBtn, 'click', () => navLinks.classList.toggle('open'));
      navLinks.querySelectorAll('a:not(.nav-drop-toggle)').forEach((a) => on(a, 'click', () => navLinks.classList.remove('open')));
    }
    document.querySelectorAll('.nav-drop-toggle').forEach((t) => on(t, 'click', (e) => { e.preventDefault(); t.parentElement.classList.toggle('open'); }));
    on(document, 'click', (e) => { if (!e.target.closest('.nav-drop')) document.querySelectorAll('.nav-drop.open').forEach((d) => d.classList.remove('open')); });

    /* reveal: auto-tag common blocks in <main> so every page animates the same way (see app/motion.css) */
    const AUTO = [
      'main h1', 'main h2', 'main .ds-lead', 'main .lead',
      'main .ds-frame', 'main figure', 'main .sec-head',
      'main :is(.svc,.cap,.jcard,.plan,.co-case,.bpost,.cs-study-card,.cs-study-icons__item,.metric,.cs-faq__item,.rs-card)',
      'main :is(.hm-fcb-row,.hm-case-sm,.hm-steps li,.fc-stage-word,.fc-stage-body,.fc-plan,.fc-case,.fc-post,.fc-g-card,.in-ch-body > *,.wu-fit-list li,.wu-form-card,.in-system-row,.cs-compare-table)',
    ].join(',');
    document.querySelectorAll(AUTO).forEach((el) => {
      if (el.closest('.reveal') || el.closest('#header,.cs-footer,.dash')) return;
      el.classList.add('reveal');
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    // Stagger siblings that enter together; reset the counter per parent so long pages don't build up delays.
    const seen = new Map();
    document.querySelectorAll('.reveal').forEach((el) => {
      const n = seen.get(el.parentElement) || 0; seen.set(el.parentElement, n + 1);
      el.style.transitionDelay = (Math.min(n, 5) * 80) + 'ms';
      io.observe(el);
    });
    // Curves outside a reveal block draw when they scroll into view.
    document.querySelectorAll('.ds-curve').forEach((el) => { if (!el.closest('.reveal')) io.observe(el); });
    cleanups.push(() => io.disconnect());

    /* vertical scroll timeline: beam follows scroll, cards activate as it passes */
    document.querySelectorAll('.jtimeline').forEach((tl) => {
      const beam = tl.querySelector('.jbeam');
      const fill = tl.querySelector('.jfill');
      const rows = Array.from(tl.querySelectorAll('.jrow'));
      let tlTick = false;
      const updTl = () => {
        tlTick = false;
        const rect = tl.getBoundingClientRect();
        const p = Math.max(0, Math.min(rect.height, window.innerHeight * 0.5 - rect.top));
        if (beam) beam.style.top = p + 'px';
        if (fill) fill.style.height = p + 'px';
        rows.forEach((row) => {
          const n = row.querySelector('.jnode').getBoundingClientRect();
          const nodeY = (n.top + n.height / 2) - rect.top;
          const lit = reduce || nodeY <= p + 6;
          row.classList.toggle('in', lit);
        });
      };
      const onTl = () => { if (!tlTick) { tlTick = true; requestAnimationFrame(updTl); } };
      on(window, 'scroll', onTl, { passive: true });
      on(window, 'resize', onTl, { passive: true });
      updTl();
    });

    /* faq */
    document.querySelectorAll('.faq button').forEach((btn) => on(btn, 'click', () => {
      const item = btn.parentElement, ans = item.querySelector('.ans'), open = item.classList.contains('open');
      document.querySelectorAll('.faq.open').forEach((f) => { f.classList.remove('open'); f.querySelector('.ans').style.maxHeight = null; });
      if (!open) { item.classList.add('open'); ans.style.maxHeight = ans.scrollHeight + 'px'; }
    }));

    /* lead form */
    const form = document.getElementById('leadForm');
    // Saved through the same server action as /inquiry, so these leads show up in the dashboard.
    if (form) on(form, 'submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]'), err = document.getElementById('formErr');
      const label = btn.textContent;
      const showError = (msg) => { err.textContent = msg; err.hidden = false; };
      btn.disabled = true; btn.textContent = 'Sending…'; err.hidden = true;
      const data = new FormData(form);
      data.set('page', path);
      try {
        const res = await submitInquiryAction({}, data);
        if (res?.ok) { document.getElementById('formFields').style.display = 'none'; document.getElementById('formOk').style.display = 'block'; }
        else showError(res?.error || 'Sorry, your request could not be sent right now. Please email info@codesquad.ai.');
      } catch (_) { showError('Sorry, your request could not be sent right now. Please email info@codesquad.ai or call +1 (307) 396-4945.'); }
      btn.disabled = false; btn.textContent = label;
    });

    /* count-up numbers */
    function countUp(el) {
      let rawHTML = el.getAttribute('data-rawhtml');
      if (rawHTML === null) { rawHTML = el.innerHTML; el.setAttribute('data-rawhtml', rawHTML); }
      const text = el.textContent.trim();
      if (text.indexOf('/') > -1) { el.innerHTML = rawHTML; return; }
      const m = text.match(/^(\D*?)([\d][\d,]*(?:\.\d+)?)(.*)$/);
      if (!m) { el.innerHTML = rawHTML; return; }
      const pre = m[1], numStr = m[2], suf = m[3];
      const hasComma = numStr.indexOf(',') > -1;
      const decimals = (numStr.split('.')[1] || '').length;
      const target = parseFloat(numStr.replace(/,/g, ''));
      if (reduce || !isFinite(target)) { el.innerHTML = rawHTML; return; }
      const fmt = (v) => { let s = decimals ? v.toFixed(decimals) : Math.round(v).toString(); if (hasComma) s = Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); return pre + s + suf; };
      let t0 = null; const dur = 1200; el.textContent = fmt(0);
      const step = (ts) => { if (!t0) t0 = ts; const p = Math.min((ts - t0) / dur, 1); el.textContent = fmt(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); else el.innerHTML = rawHTML; };
      requestAnimationFrame(step);
    }
    const stats = document.querySelectorAll('.m-val,.cs-item .v,.hero-meta b,.fc-stats .v,.cv-legend .v,.ve-mini .v');
    if (stats.length) {
      const so = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { countUp(e.target); so.unobserve(e.target); } }), { threshold: 0.4 });
      stats.forEach((el) => so.observe(el));
      cleanups.push(() => so.disconnect());
    }

    /* growing bars */
    const bars = document.querySelectorAll('.cv-bars .b');
    if (bars.length && !reduce) {
      const bo = new IntersectionObserver((en) => en.forEach((e) => {
        if (!e.isIntersecting) return; const b = e.target, h = b.style.height || '0%';
        b.style.height = '0%'; b.style.transition = 'none';
        requestAnimationFrame(() => { b.style.transition = 'height 1.1s cubic-bezier(.16,1,.3,1)'; requestAnimationFrame(() => { b.style.height = h; }); });
        bo.unobserve(b);
      }), { threshold: 0.3 });
      bars.forEach((b) => bo.observe(b));
      cleanups.push(() => bo.disconnect());
    }

    /* click a chart bar to cycle its colour */
    const palette = [
      'linear-gradient(180deg,#2fd3c1,#0FAE9B)',
      'linear-gradient(180deg,#ffd66b,#F5B301)',
      'linear-gradient(180deg,#ff9a8b,#FF6B6B)',
      'linear-gradient(180deg,#c79bff,#9b5de5)',
      'linear-gradient(180deg,#7db9ff,#2F6BFF)',
      'linear-gradient(180deg,#8fe3a0,#2ecc71)'
    ];
    bars.forEach((b) => {
      b.style.cursor = 'pointer';
      on(b, 'click', () => {
        const i = ((parseInt(b.dataset.ci || '0', 10)) + 1) % palette.length;
        b.dataset.ci = i;
        b.style.background = palette[i];
      });
    });

    /* hero rank bars */
    const seo = document.querySelector('.c-seo');
    if (seo && !reduce) {
      seo.querySelectorAll('.rank .bar').forEach((b) => { b.setAttribute('data-w', b.style.width || getComputedStyle(b).width); b.style.width = '0'; b.style.transition = 'width 1s cubic-bezier(.16,1,.3,1)'; });
      const ro = new IntersectionObserver((en) => en.forEach((e) => { if (!e.isIntersecting) return; e.target.querySelectorAll('.rank .bar').forEach((b, i) => setTimeout(() => { b.style.width = b.getAttribute('data-w'); }, 130 * i)); ro.unobserve(e.target); }), { threshold: 0.25 });
      ro.observe(seo); cleanups.push(() => ro.disconnect());
    }

    /* scroll-spy (home anchors) */
    const ids = ['work', 'founder', 'process', 'contact', 'system', 'services', 'results', 'case'];
    const links = {};
    document.querySelectorAll('.nav-links a').forEach((a) => { const h = a.getAttribute('href') || ''; const hi = h.indexOf('#'); if (hi > -1) links[h.slice(hi + 1)] = a; });
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (sections.length) {
      let ticking = false;
      const update = () => { ticking = false; const line = window.innerHeight * 0.32; let current = null; sections.forEach((s) => { if (s.getBoundingClientRect().top <= line) current = s.id; }); ids.forEach((id) => { if (links[id]) links[id].classList.toggle('active', id === current); }); };
      const onScrollSpy = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
      on(window, 'scroll', onScrollSpy, { passive: true }); on(window, 'resize', onScrollSpy, { passive: true }); update();
    }

    // case-studies category filter
    // Insights page: topic filter over the article cards (the featured article always stays).
    const blFilter = document.getElementById('blFilter');
    const blGrid = document.getElementById('blGrid');
    if (blFilter && blGrid) {
      const cards = Array.from(blGrid.querySelectorAll('.bl-card'));
      const chips = Array.from(blFilter.querySelectorAll('.bl-chip'));
      const count = document.getElementById('blCount');
      const empty = document.getElementById('blEmpty');
      const applyTopic = (topic) => {
        let shown = 0;
        cards.forEach((card) => { const show = topic === 'All' || card.dataset.topic === topic; card.hidden = !show; if (show) { shown += 1; card.classList.add('in'); } });
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.topic === topic)));
        if (count) count.textContent = `${shown} ${topic === 'All' ? 'more ' : ''}${shown === 1 ? 'article' : 'articles'}`;
        if (empty) empty.hidden = shown > 0;
      };
      chips.forEach((c) => on(c, 'click', () => applyTopic(c.dataset.topic)));
    }

    // Results page: two filter groups (industry + service). Defaults to the healthcare industry,
    // and ?industry=… / ?service=… preselect a filter so other pages can deep-link.
    const rsFilters = document.getElementById('rsFilters');
    const rsGrid = document.getElementById('rsGrid');
    if (rsFilters && rsGrid) {
      const cards = Array.from(rsGrid.querySelectorAll('.rz-card'));
      const count = document.getElementById('rsCount');
      const empty = document.getElementById('rsEmpty');
      const chips = Array.from(rsFilters.querySelectorAll('.rz-chip'));
      const state = { industry: 'All', service: 'All' };
      const has = (group, v) => chips.some((c) => c.dataset.group === group && c.dataset.value === v);
      const qs = new URLSearchParams(location.search);
      const want = qs.get('industry') || rsFilters.dataset.default;
      if (want && has('industry', want)) state.industry = want;
      if (qs.get('service') && has('service', qs.get('service'))) state.service = qs.get('service');
      const apply = () => {
        let shown = 0;
        cards.forEach((card) => {
          const okI = state.industry === 'All' || card.dataset.industry === state.industry;
          const okS = state.service === 'All' || (card.dataset.services || '').split('|').includes(state.service);
          const show = okI && okS;
          card.hidden = !show;
          if (show) { shown += 1; card.classList.add('in'); }
        });
        chips.forEach((c) => c.setAttribute('aria-pressed', String(state[c.dataset.group] === c.dataset.value)));
        if (count) count.textContent = `${shown} case ${shown === 1 ? 'study' : 'studies'}`;
        if (empty) empty.hidden = shown > 0;
      };
      chips.forEach((c) => on(c, 'click', () => { state[c.dataset.group] = c.dataset.value; apply(); }));
      const reset = document.getElementById('rsReset');
      if (reset) on(reset, 'click', () => { state.industry = 'All'; state.service = 'All'; apply(); });
      apply();
    }

    // generic clinic-type toggle (campaign samples, sample messaging, contact-form default —
    // all keyed off the same data-toggle-group value so one toggle drives every panel on the page)
    document.querySelectorAll('[data-toggle-group]').forEach((group) => {
      const groupName = group.getAttribute('data-toggle-group');
      group.querySelectorAll('[data-toggle]').forEach((btn) => on(btn, 'click', () => {
        const val = btn.getAttribute('data-toggle');
        document.querySelectorAll(`[data-toggle-group="${groupName}"] [data-toggle]`).forEach((b) => b.classList.toggle('on', b.getAttribute('data-toggle') === val));
        document.querySelectorAll('[data-toggle-panel]').forEach((p) => { p.style.display = p.getAttribute('data-toggle-panel') === val ? '' : 'none'; });
        const clinicOpt = btn.getAttribute('data-clinic-option');
        const sel = document.getElementById('clinic');
        if (clinicOpt && sel) sel.value = clinicOpt;
      }));
    });

    // industry tabs (/process): WAI-ARIA tabs with arrow/Home/End keys; the URL hash (#clinics,
    // #ecommerce) selects a tab on load and on hashchange, and clicking a tab updates the hash
    document.querySelectorAll('[data-tabs]').forEach((list) => {
      const tabs = Array.from(list.querySelectorAll('[role="tab"]'));
      const panelFor = (t) => document.getElementById(t.getAttribute('aria-controls'));
      const select = (tab, focus) => {
        tabs.forEach((t) => {
          const isOn = t === tab;
          t.classList.toggle('on', isOn);
          t.setAttribute('aria-selected', String(isOn));
          t.tabIndex = isOn ? 0 : -1;
          const panel = panelFor(t);
          if (panel) { panel.classList.toggle('is-active', isOn); panel.hidden = !isOn; }
        });
        if (focus) tab.focus();
      };
      // a hash can name a tab panel (#ecommerce) or any section inside one (#crm, #campaigns):
      // open the owning tab, then jump to the tab list or to that section
      const fromHash = (scroll) => {
        const id = decodeURIComponent(location.hash.slice(1));
        if (!id) return;
        let tab = tabs.find((t) => t.getAttribute('aria-controls') === id);
        let target = list;
        if (!tab) {
          const el = document.getElementById(id);
          const panel = el && el.closest('[role="tabpanel"]');
          tab = panel && tabs.find((t) => t.getAttribute('aria-controls') === panel.id);
          if (!tab) return;
          target = el;
        }
        select(tab);
        if (scroll) setTimeout(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }), 0);
      };
      tabs.forEach((t, i) => {
        on(t, 'click', () => { select(t); history.replaceState(null, '', '#' + t.getAttribute('aria-controls')); });
        on(t, 'keydown', (e) => {
          let j = null;
          if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') j = 0;
          else if (e.key === 'End') j = tabs.length - 1;
          if (j === null) return;
          e.preventDefault();
          select(tabs[j], true);
          history.replaceState(null, '', '#' + tabs[j].getAttribute('aria-controls'));
        });
      });
      select(tabs.find((t) => t.classList.contains('on')) || tabs[0]);
      fromHash(true);
      on(window, 'hashchange', () => fromHash(true));
    });

    // process flow map: hovering (mouse), focusing (keyboard) or tapping a stage opens its detail panel
    document.querySelectorAll('[data-pflow]').forEach((flow) => {
      const nodes = Array.from(flow.querySelectorAll('[data-pf]'));
      const panel = flow.querySelector('.pf-panel');
      const hoverable = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
      let timer;
      const show = (key, scroll) => {
        nodes.forEach((n) => { const isOn = n.getAttribute('data-pf') === key; n.classList.toggle('on', isOn); n.setAttribute('aria-expanded', String(isOn)); });
        flow.querySelectorAll('[data-pf-detail]').forEach((d) => { d.hidden = d.getAttribute('data-pf-detail') !== key; });
        flow.classList.add('pf-open');
        if (scroll && panel) setTimeout(() => { if (panel.getBoundingClientRect().bottom > window.innerHeight) panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); }, 380);
      };
      nodes.forEach((n) => {
        const key = n.getAttribute('data-pf');
        if (hoverable) {
          // short delay so sweeping the mouse across the map doesn't flicker through every stage
          on(n, 'mouseenter', () => { clearTimeout(timer); timer = setTimeout(() => show(key), 140); });
          on(n, 'mouseleave', () => clearTimeout(timer));
        }
        on(n, 'focus', () => show(key));
        on(n, 'click', () => show(key, !hoverable));
      });
      cleanups.push(() => clearTimeout(timer));
    });

    // scroll-driven stacked reviews (cards change as you scroll through the section)
    const stack = document.getElementById('reviewStack');
    const scrollEl = document.getElementById('rsScroll');
    if (stack && scrollEl) {
      const cards = Array.from(stack.querySelectorAll('.rs-card'));
      const n = cards.length;
      const dotsWrap = document.getElementById('rsDots');
      const dots = [];
      if (dotsWrap) {
        cards.forEach(() => { const d = document.createElement('span'); dotsWrap.appendChild(d); dots.push(d); });
      }
      let active = -1;
      const sizeStack = () => {
        let h = 0;
        cards.forEach((c) => { h = Math.max(h, c.offsetHeight); });
        if (h) stack.style.minHeight = (h + 40) + 'px';
      };
      const render = (idx) => {
        if (idx === active) return;
        active = idx;
        cards.forEach((c, i) => {
          const d = i - idx;
          let pos;
          if (d < 0) pos = 'out';
          else if (d === 0) pos = '0';
          else if (d <= 3) pos = String(d);
          else pos = 'hide';
          c.setAttribute('data-pos', pos);
        });
        dots.forEach((dd, i) => dd.classList.toggle('on', i === idx));
      };
      let ticking = false;
      const update = () => {
        ticking = false;
        const total = scrollEl.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-scrollEl.getBoundingClientRect().top, 0), Math.max(total, 1));
        const progress = total > 0 ? scrolled / total : 0;
        render(Math.min(n - 1, Math.max(0, Math.round(progress * (n - 1)))));
      };
      const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
      sizeStack();
      update();
      on(window, 'scroll', onScroll, { passive: true });
      on(window, 'resize', () => { sizeStack(); update(); });
    }

    // hero typing headline: types each word, pauses, deletes, loops; syncs the audience chips
    document.querySelectorAll('[data-typer]').forEach((typer) => {
      const textEl = typer.querySelector('.typer-text');
      let words = [];
      try { words = JSON.parse(typer.getAttribute('data-typer')); } catch (e) { /* ignore */ }
      if (!textEl || words.length < 2) return;
      const chips = Array.from(document.querySelectorAll('[data-typer-chip]'));
      const setChip = (wi) => chips.forEach((c) => c.classList.toggle('on', c.getAttribute('data-typer-chip') === String(wi)));
      let wi = 0, ci = words[0].length, deleting = false, timer = null;
      const tick = () => {
        const w = words[wi];
        if (!deleting) {
          ci++;
          textEl.textContent = w.slice(0, ci);
          if (ci >= w.length) { deleting = true; timer = setTimeout(tick, 1900); return; }
          timer = setTimeout(tick, 85);
        } else {
          ci--;
          textEl.textContent = w.slice(0, ci);
          if (ci <= 0) { deleting = false; wi = (wi + 1) % words.length; setChip(wi); timer = setTimeout(tick, 280); return; }
          timer = setTimeout(tick, 42);
        }
      };
      if (reduce) {
        // no typing — just swap the word every few seconds
        const iv = setInterval(() => { wi = (wi + 1) % words.length; textEl.textContent = words[wi]; setChip(wi); }, 2600);
        cleanups.push(() => clearInterval(iv));
      } else {
        deleting = true;
        timer = setTimeout(tick, 2200);
        cleanups.push(() => clearTimeout(timer));
      }
    });

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
