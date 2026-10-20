// /process — the shared "how it works" page. Universal build/grow phases and the 5-step process
// on top, then the detailed clinic mechanics moved here from /aesthetics and /clinics
// (rendered by the same functions).

import { processSection, campaignsSection, messagingSection, crmSection } from './patientAcquisitionPage';
import aesthetics from '../content/aesthetics.config';
import clinics from '../content/clinics.config';

const CALENDLY = 'https://calendly.com/code_squad/30min';

// One config covering med spas, medical clinics and dental: the campaign-type toggle switches the
// sample campaigns and the sample messaging together.
const clinicsTab = {
  flowSampleGroupKey: 'aesthetics',
  flowSamples: aesthetics.flowSamples,
  images: aesthetics.images,
  campaigns: {
    audienceLabel: 'med spas, medical clinics and dental practices',
    toggle: [{ key: 'aesthetics', label: 'Med spas', clinicOption: 'Med spa / aesthetics' }, ...clinics.campaigns.toggle],
    groups: [{ ...aesthetics.campaigns.groups[0], key: 'aesthetics' }, ...clinics.campaigns.groups]
  },
  messaging: { variants: [...aesthetics.messaging.variants, ...clinics.messaging.variants] },
  wording: { customBuiltLine: 'custom-built for your clinic' }
};

const check = (items) => `<ul class="case-points">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

function hero() {
  return `
<section class="ind-hero ind-hero--solo">
  <div class="wrap">
    <div>
      <span class="eyebrow reveal">The Process</span>
      <h1 class="reveal">How our growth system works</h1>
      <p class="lead reveal">A one-time build that sets everything up, then a monthly retainer that keeps it growing. The same system for every industry, configured for yours.</p>
      <div class="hero-cta reveal">
        <a href="${CALENDLY}" target="_blank" rel="noopener noreferrer" class="btn btn-dark">Book a Consultation →</a>
        <a href="#industries" class="btn btn-ghost">Jump to your industry</a>
      </div>
    </div>
  </div>
</section>`;
}

function phases() {
  return `
<section class="sec" id="phases">
  <div class="wrap">
    <div class="sec-head center reveal">
      <span class="eyebrow">Two Phases</span>
      <h2 class="display">Build once. Grow every month.</h2>
      <p>Everything is set up properly in a one-time build, then run and improved for you month after month.</p>
    </div>
    <div class="phase-grid">
      <div class="phase reveal">
        <span class="jstep">Phase 1 · One-time</span>
        <h3>Build</h3>
        <p>We audit what you have, design the system and launch it, with your team trained to use it.</p>
        ${check(['Discovery call', 'Audit &amp; opportunity assessment', 'Growth strategy', 'CRM &amp; stack setup', 'Website &amp; landing pages', 'Automations &amp; follow-up flows', 'Campaign launch', 'Team training'])}
      </div>
      <div class="phase phase--grow reveal">
        <span class="jstep">Phase 2 · Monthly</span>
        <h3>Grow</h3>
        <p>We run the system, optimize it every month and show you exactly what it's producing.</p>
        ${check(['Ad management', 'Ongoing optimization', 'Content &amp; SEO · AEO · GEO', 'Nurture &amp; retention campaigns', 'Reporting dashboard', 'Ongoing support'])}
      </div>
    </div>
    <p class="plan-note phase-note reveal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8.01"/><line x1="11" y1="12" x2="12" y2="12"/><line x1="12" y1="12" x2="12" y2="16"/></svg><span><strong>Pricing:</strong> a one-time build fee, then a monthly growth retainer with no long-term lock-in. Third-party tools (ad spend, CRM licences, SMS/email credits) are billed separately.</span></p>
  </div>
</section>`;
}

// Same five steps as the homepage "Our Process" timeline.
function steps() {
  return `
<section class="sec creambg" id="steps">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Our Process</span>
      <h2 class="display">How we work, end to end.</h2>
      <p>A transparent path from the first call to a growth system your team runs — every step captured, connected and handed over.</p>
    </div>
    <div class="jtimeline">
      <div class="jspine"><div class="jfill"></div><div class="jbeam"></div></div>
      <div class="jrow left"><div class="jnode"></div><div class="jcard"><span class="jstep">Step 01</span><h4>Discovery Call</h4><p>We learn about your business, workflows, goals and bottlenecks — where growth is leaking and why.</p></div></div>
      <div class="jrow right"><div class="jnode"></div><div class="jcard"><span class="jstep">Step 02</span><h4>Opportunity Assessment</h4><p>We map the highest-impact automation and AI opportunities, ranked by business value and ROI.</p></div></div>
      <div class="jrow left"><div class="jnode"></div><div class="jcard"><span class="jstep">Step 03</span><h4>Build &amp; Deploy</h4><p>We implement the systems, AI agents and workflows directly into the stack you already use.</p></div></div>
      <div class="jrow right"><div class="jnode"></div><div class="jcard"><span class="jstep">Step 04</span><h4>Launch &amp; Train</h4><p>Everything goes live, documented and connected — with your team trained to run it confidently.</p></div></div>
      <div class="jrow left"><div class="jnode"></div><div class="jcard"><span class="jstep">Step 05</span><h4>Optimize &amp; Scale</h4><p>We keep improving and expanding the system as your business grows — your ongoing AI partner.</p></div></div>
    </div>
  </div>
</section>`;
}

function gbpSection(c) {
  const icon = (d) => `<svg class="svgic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  return `
<section class="sec" id="gbp">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Google Business Profile &amp; Social</span>
      <h2 class="display">Often the first thing a patient sees.</h2>
      <p>Your Google Business Profile and social accounts are managed as part of the same system, not left to chance.</p>
    </div>
    <div class="outcomes">
      <div class="out reveal"><div class="i">${icon('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>')}</div><h4>Profile posts &amp; offers</h4><p>Regular GBP posts with offers and updates, so your listing looks active when patients compare clinics nearby.</p><div class="jsample"><span class="samp-chip">Sample GBP post</span><p>${c.flowSamples.gbpPost}</p></div></div>
      <div class="out reveal"><div class="i">${icon('<polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/>')}</div><h4>Reviews &amp; reputation</h4><p>Review requests after visits and managed replies, so your rating keeps working for you in local search.</p></div>
      <div class="out reveal"><div class="i">${icon('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.51"/>')}</div><h4>Social media management</h4><p>Full account management with treatment and service content that feeds the same funnel as your ads.</p></div>
    </div>
  </div>
</section>`;
}

// Medical-only site: the clinic flows are shown directly (the former e-commerce tab was removed).
function industryTabs() {
  return `
<section class="sec sec--tabs" id="industries">
  <div class="wrap">
    <div class="sec-head center reveal">
      <span class="eyebrow">For medical practices</span>
      <h2 class="display">The system, configured for your practice.</h2>
      <p>The flows, campaigns and reporting we build for clinics, med spas and dental practices.</p>
    </div>
  </div>
</section>
<div id="clinics">
${processSection(clinicsTab)}
${campaignsSection(clinicsTab)}
${messagingSection(clinicsTab)}
${crmSection(clinicsTab)}
${gbpSection(clinicsTab)}
  <div class="wrap ptab-more reveal"><a class="hero-textlink hero-textlink--dark" href="/aesthetics">Med spas: see the package →</a><a class="hero-textlink hero-textlink--dark" href="/clinics">Clinics &amp; dental: see the package →</a></div>
</div>`;
}

function faq() {
  const items = [
    { q: 'How long does the build take?', a: "It depends on scope: how many campaigns, pages and integrations you need. We give you a timeline after the opportunity assessment, before any build work starts, and campaigns only launch once tracking and follow-up are tested end to end." },
    { q: 'Is there a long-term contract?', a: 'No. The build is a one-time fee. After launch you move onto a monthly growth retainer with no long-term lock-in.' },
    { q: "What's included, and what isn't?", a: 'The build covers the audit, strategy, CRM and stack setup, website and landing pages, automations, campaign launch and team training. The retainer covers ad management, optimization, content and SEO/AEO/GEO, nurture and retention campaigns, reporting and support. Third-party tools (ad spend, CRM licences, SMS/email credits) are billed separately.' },
    { q: 'Do I have to switch the software I already use?', a: 'No. We build into your existing stack — booking system, practice software or CRM — and connect what already works.' }
  ]
    .map((f) => `<div class="faq"><button><span>${f.q}</span><span class="ico">+</span></button><div class="ans"><p>${f.a}</p></div></div>`)
    .join('\n      ');
  return `
<section class="sec" id="faq">
  <div class="wrap">
    <div class="sec-head center reveal" style="margin-bottom:48px"><span class="eyebrow">FAQ</span><h2 class="display">Timelines, contracts &amp; what's included.</h2></div>
    <div class="faq-list reveal">
      ${items}
    </div>
  </div>
</section>`;
}

function cta() {
  return `
<section class="cs-ready" id="contact">
  <div class="cs-container cs-ready__inner reveal">
    <h2>Ready to see it on your numbers?</h2>
    <p>Book a free consultation. We'll map your funnel, show you the live dashboard, and tell you honestly whether we're the right fit.</p>
    <div class="cs-ready__actions">
      <a class="cs-btn cs-btn--primary" href="${CALENDLY}" target="_blank" rel="noopener noreferrer">Book a Consultation</a>
      <a class="cs-btn cs-btn--ghost" href="/case-studies">View case studies</a>
    </div>
  </div>
</section>`;
}

export function renderProcessPage() {
  return [hero(), phases(), steps(), industryTabs(), faq(), cta()].join('\n');
}
