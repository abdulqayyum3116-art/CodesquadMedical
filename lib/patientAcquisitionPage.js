// Shared section renderer for the patient-acquisition pages (/aesthetics, /clinics).
// Each page supplies a config object (content/aesthetics.config.js, content/clinics.config.js);
// this module turns that config into the full page HTML string, the same way every other
// page in this app is a static HTML string rendered via dangerouslySetInnerHTML.
// The detailed mechanics (flow map, campaign types, nurture, CRM) are exported for /process
// (lib/processPage.js); the landing pages themselves stay short and outcome-led.

import { PHONE_PATTERN, PHONE_MAX_LENGTH, PHONE_HINT } from './phone';

const CALENDLY ='https://calendly.com/code_squad/30min';

const CAMPAIGN_TYPES = [
  {
    key: 'local',
    sampleType: 'Local',
    tag: 'Local search',
    name: 'Local search',
    goal: 'Capture "near me" and city searches',
    targeting: '10–15 mile radius, call extensions on',
    landsOn: 'Main clinic landing page'
  },
  {
    key: 'treatment',
    sampleType: 'Treatment',
    tag: 'Treatment search',
    name: 'Treatment search',
    goal: 'One campaign per treatment, own budget',
    targeting: 'Treatment + city keywords, 44+ negatives',
    landsOn: "That treatment's landing page"
  },
  {
    key: 'ranking',
    sampleType: 'Ranking',
    tag: 'Ranking (keyword)',
    name: 'Ranking (keyword)',
    goal: 'Own the top spot on high-value terms',
    targeting: '"best", "cost", "specials" keywords',
    landsOn: 'Treatment page + matching blog for organic'
  }
];

function heroSection(c) {
  const chips = c.hero.audienceChips
    .map((chip, i) => `<li class="aud-chip${i === 0 ? ' on' : ''}" data-typer-chip="${i}"><img src="${chip.img}" alt="" loading="lazy"/><span>${chip.label}</span></li>`)
    .join('');
  const rows = c.hero.guarantee.rows.map((r) => `<div class="hg-row"><span>${r.label}</span><b>${r.value}</b></div>`).join('');
  const bg = c.hero.bgVideo
    ? `<video class="hero-bg" autoplay muted loop playsinline preload="auto" aria-hidden="true"><source src="${c.hero.bgVideo}" type="video/mp4" /></video>`
    : `<img class="hero-bg" src="${c.hero.bgImage}" alt="" aria-hidden="true" loading="eager"/>`;
  // The H1 holds the headline exactly once. The typing line is decorative (aria-hidden) and sits
  // outside the H1; the audience chips below carry the same information for screen readers.
  return `
<section class="hero has-video">
  ${bg}
  <div class="hero-overlay"></div>
  <div class="wrap hero-grid">
    <div>
      <div class="tagline reveal">${c.hero.tagline}</div>
      <h1 class="hero-title hero-title--lead hero-title--outcome display reveal">${c.hero.headline} <span class="hl-teal">${c.hero.headlineAccent}</span></h1>
      <p class="hero-typer reveal" aria-hidden="true">${c.hero.typerLead} <span class="typer" data-typer='${JSON.stringify(c.hero.typerWords)}'><span class="typer-text">${c.hero.typerWords[0]}</span><span class="typer-caret"></span></span></p>
      <p class="hero-sub reveal">${c.hero.sub}</p>
      <div class="hero-cta reveal">
        <a href="${CALENDLY}" target="_blank" rel="noopener noreferrer" class="btn btn-dark">Book a Consultation →</a>
        <a href="/process#clinics" class="hero-textlink">See how it works →</a>
      </div>
      <ul class="aud-strip reveal" aria-label="Who we grow">${chips}</ul>
    </div>

    <div class="hv reveal">
      <div class="hero-guarantee">
        <span class="hg-badge">${c.hero.guaranteeBadge}</span>
        <div class="hg-main">
          <div class="hg-num">${c.hero.guarantee.leadsNum}<span>${c.hero.guarantee.leadsSuffix}</span></div>
          <div class="hg-lab">${c.hero.guarantee.leadsLabel}</div>
        </div>
        <div class="hg-rows">${rows}</div>
      </div>
    </div>
  </div>
</section>`;
}

export function processSection(c) {
  const flowGroup = c.campaigns.groups.find((g) => g.key === c.flowSampleGroupKey) || c.campaigns.groups[0];
  const firstTreatment = flowGroup.samples.find((s) => s.type === 'Treatment') || flowGroup.samples[0];
  const sample = (chip, body) => `<div class="jsample"><span class="samp-chip">${chip}</span>${body}</div>`;
  const mini = (items) => `<div class="jmini">${items.map(([cls, t]) => `<span class="jmb${cls ? ' jmb--' + cls : ''}">${t}</span>`).join('<span class="jm-arr"></span>')}</div>`;

  // One entry per stage on the flow map. `node` is the short map label; the rest is the
  // original timeline copy, shown in the detail panel when the stage is hovered, focused or tapped.
  const stages = [
    {
      key: 'web', num: '01', node: 'Website', step: 'Step 01', title: 'Treatment-Based Website',
      body: `<p>Your conversion hub — a dedicated treatment-based landing page built to turn visits into enquiries.</p>${mini([['', 'Website'], ['goal', 'Treatment-Based Landing Page']])}`,
      samples: sample('Sample landing page headline', `<p>${firstTreatment.headline}</p>`)
    },
    {
      key: 'ads', num: '02', node: 'Google Ads', step: 'Step 02', title: 'Treatment-Based Google Ad Campaign',
      body: `<p>A dedicated campaign and landing page for every treatment, targeted locally to patients ready to book. Here's one running today:</p>`,
      samples: `<div class="jcard-camp">${sampleCampaignCard(firstTreatment)}</div>`
    },
    {
      key: 'leads', num: '03', node: 'Leads', sub: 'Call · Intake form', step: 'Step 03', title: 'Leads — Two Routes In',
      body: `<p>Every enquiry is captured the moment it happens, through either route — both feed the next step:</p>${mini([['', 'Direct Call'], ['', 'Patient Intake Form']]).replace('<span class="jm-arr"></span>', '<span class="jm-or">or</span>')}`,
      samples: ''
    },
    {
      key: 'patient', num: '04', node: 'Potential Patient', sub: 'In your CRM', step: 'Step 04', title: 'Potential Patient',
      body: `<p>Both routes create a Potential Patient record straight in your CRM — qualified, tracked and attributed. From here the patient takes one of two paths:</p>${mini([['ok', 'Appointment Booked'], ['no', 'Not Booked']]).replace('<span class="jm-arr"></span>', '<span class="jm-or">or</span>')}`,
      samples: ''
    },
    {
      key: 'booked', num: 'A', node: 'Booked', sub: 'EHR → Reactivation', tone: 'ok', step: 'Route A', title: 'Appointment Booked',
      body: `<p>Booked patients flow into your records and stay in the retention loop:</p>${mini([['ok', 'Appointment Booked'], ['', 'EHR'], ['', 'Dormant Patients'], ['goal', 'Reactivation']])}`,
      samples: sample('Sample reactivation message', `<p>${c.flowSamples.reactivation}</p>`)
    },
    {
      key: 'nurture', num: 'B', node: 'Not booked', sub: '14-day nurture ↺', tone: 'no', step: 'Route B', title: 'Not Booked → Automated Nurture',
      body: `<p>Anyone who doesn't book is nurtured until they do — then it stops:</p>${mini([['no', 'Appointment Not Booked'], ['', 'SMS / Email Campaign'], ['', 'Follow-up Campaign']])}<span class="jloop-note">↺ Loops back to Potential Patient</span>`,
      samples: sample('Sample nurture SMS', `<p>Hey [First Name], {Person Name} with {Clinic Name} here. This {Month}, new clients get ${c.messaging.variants[0].featuredOffer}. Reserve: {Booking Link}</p>`)
        + sample('Sample nurture email', `<p><em>Subject:</em>[First Name], here's what your first visit at {Clinic Name} looks like</p>`)
    },
    {
      key: 'seo', num: '+', node: 'SEO engine', sub: 'Feeds new leads', step: 'Parallel Engine', title: 'Organic / SEO Engine',
      body: `<p>A second engine feeding the same funnel, compounding month after month:</p>${mini([['', 'SEO · GEO · AEO'], ['', 'Treatment / Service Content'], ['', 'Blogs'], ['', 'Social Media + GBP Posts'], ['goal', 'Potential Patients']])}`,
      samples: sample('Sample blog · SEO / AEO', `<h5>${c.flowSamples.blog.title}</h5><p>${c.flowSamples.blog.meta}</p>`)
        + sample('Sample GBP post', `<p>${c.flowSamples.gbpPost}</p>`)
    },
    {
      key: 'crm', num: 'Hub', node: 'Customized CRM', sub: 'Connects every step', step: 'The Hub', title: 'Customized CRM',
      body: `<p>The layer connecting every step above — one dashboard your whole team logs into.</p><div class="jpills"><span class="jpill">Ad Analytics</span><span class="jpill">Leads Data</span><span class="jpill">Campaign Analytics</span><span class="jpill">Business Profile</span><span class="jpill">UTM Tracking</span><span class="jpill">Automation Controller</span><span class="jpill">Team Logins</span></div>`,
      samples: ''
    }
  ];

  const nodes = stages
    .map((s) => `<button type="button" class="pf-node${s.tone ? ' pf-node--' + s.tone : ''}" style="grid-area:${s.key}" data-pf="${s.key}" aria-expanded="false" aria-controls="pf-d-${s.key}"><span class="pf-num">${s.num}</span><span class="pf-lab">${s.node}${s.sub ? `<small>${s.sub}</small>` : ''}</span></button>`)
    .join('');
  const arrows = ['a1', 'a2', 'a3', 'a4', 'a5'].map((a) => `<span class="pf-arr" style="grid-area:${a}" aria-hidden="true"></span>`).join('') + '<span class="pf-up" style="grid-area:up" aria-hidden="true"></span>';
  const details = stages
    .map((s) => `<div class="pf-detail${s.samples ? '' : ' pf-detail--solo'}" id="pf-d-${s.key}" data-pf-detail="${s.key}" hidden>
        <div class="pf-main"><span class="jstep">${s.step}</span><h4>${s.title}</h4>${s.body}</div>
        ${s.samples ? `<div class="pf-samples">${s.samples}</div>` : ''}
      </div>`)
    .join('');

  return `
<section class="sec proc" id="process">
  <div class="wrap">
    <div class="sec-head center reveal">
      <span class="eyebrow">Complete Process</span>
      <h2 class="display">The complete patient-growth process, end to end.</h2>
      <p>One connected system — from first click to booked patient, retention and reporting.</p>
    </div>

    <div class="pflow reveal" data-pflow>
      <div class="pf-map">${nodes}${arrows}</div>
      <p class="pf-hint">Hover over or tap any stage to see how it works.</p>
      <div class="pf-panel"><div class="pf-clip"><div class="jcard pf-card">${details}</div></div></div>
      <div class="pf-econ">
        <span class="jstep">The Economics</span><h4>A Predictable Lead Funnel</h4>
        <p>What the whole system produces, month after month — benchmark, varies by market:</p>
        <div class="pf-econ-row">${mini([['', '$1,000/mo ad spend'], ['', '40–50 leads / month'], ['', '25–30 potential patients'], ['goal', 'Closure by the practice']])}</div>
      </div>
    </div>
  </div>
</section>`;
}

function sampleCampaignCard(s) {
  return `<div class="camp-sample reveal">
    <span class="samp-chip">Sample campaign</span>
    <span class="camp-sample-type">${s.type}</span>
    <h4>${s.name}</h4>
    <div class="camp-sample-row"><b>Keywords</b><span>${s.keywords}</span></div>
    <div class="camp-sample-row"><b>Headline</b><span>${s.headline}</span></div>
    <div class="camp-sample-row"><b>Lands on</b><span>${s.landsOn}</span></div>
  </div>`;
}

export function campaignsSection(c) {
  const toggle = c.campaigns.toggle
    ? `<div class="camp-toggle-wrap reveal">
        <div class="camp-toggle" data-toggle-group="clinic-type">
          ${c.campaigns.toggle.map((t, i) => `<button type="button" class="camp-toggle-btn${i === 0 ? ' on' : ''}" data-toggle="${t.key}" data-clinic-option="${t.clinicOption}">${t.label}</button>`).join('')}
        </div>
      </div>`
    : '';

  // Flow map: patient search → campaign type → landing page. Hovering / focusing / tapping a type
  // opens a panel with the type's targeting and every sample campaign of that type.
  const nodes = CAMPAIGN_TYPES
    .map((t, i) => `<button type="button" class="pf-node" style="grid-area:${t.key}" data-pf="${t.key}" aria-expanded="false" aria-controls="cf-d-${t.key}"><span class="pf-num">0${i + 1}</span><span class="pf-lab">${t.name}<small>${t.goal}</small></span></button>`)
    .join('');
  const lands = CAMPAIGN_TYPES
    .map((t, i) => `<div class="pf-node pf-node--static cf-land" style="grid-area:l${i + 1}"><span class="pf-lab"><small>Lands on</small>${t.landsOn}</span></div>`)
    .join('');
  const arrows = [1, 2, 3].map((i) => `<span class="pf-arr" style="grid-area:a${i}" aria-hidden="true"></span><span class="pf-arr" style="grid-area:b${i}" aria-hidden="true"></span>`).join('');

  const details = CAMPAIGN_TYPES
    .map((t) => {
      const groups = c.campaigns.groups
        .map((g, i) => {
          const samples = g.samples.filter((s) => s.type === t.sampleType);
          return `<div class="camp-sample-grid"${g.key ? ` data-toggle-panel="${g.key}"${i === 0 ? '' : ' style="display:none"'}` : ''}>${samples.map(sampleCampaignCard).join('')}</div>`;
        })
        .join('');
      return `<div class="pf-detail pf-detail--solo" id="cf-d-${t.key}" data-pf-detail="${t.key}" hidden>
        <div class="cf-head">
          <span class="camp-type-tag">${t.tag}</span>
          <p class="camp-type-goal">${t.goal}</p>
          <div class="camp-type-meta"><span><b>Targeting</b>${t.targeting}</span><span><b>Lands on</b>${t.landsOn}</span></div>
        </div>
        ${groups}
      </div>`;
    })
    .join('');

  return `
<section class="sec creambg" id="campaigns">
  <div class="wrap">
    <div class="sec-head center reveal">
      <span class="eyebrow">Campaign Types</span>
      <h2 class="display">Three campaign types. Every clinic runs the same playbook.</h2>
      <p>Only the treatments change. Here's how we structure paid search for ${c.campaigns.audienceLabel}.</p>
    </div>
    ${c.images.campaignHero ? `<div class="camp-hero-img reveal"><img src="${c.images.campaignHero}" alt="${c.images.campaignHeroAlt}" loading="lazy"/></div>` : ''}
    ${toggle}
    <div class="pflow cflow reveal" data-pflow>
      <div class="pf-map cf-map">
        <div class="pf-node pf-node--static cf-src" style="grid-area:src"><span class="pf-lab">Patient searches on Google<small>"near me", treatment or "best" terms</small></span></div>
        ${arrows}${nodes}${lands}
      </div>
      <p class="pf-hint">Hover over or tap a campaign type to see sample campaigns.</p>
      <div class="pf-panel"><div class="pf-clip"><div class="jcard pf-card">${details}</div></div></div>
    </div>
  </div>
</section>`;
}

export function messagingSection(c) {
  const hasToggle = c.messaging.variants.length > 1;

  const panels = c.messaging.variants
    .map((v, i) => {
      const steps = `
        <div class="msg-step"><span class="msg-day">Day 1</span><span class="msg-channel">SMS</span><p>Hey [First Name], {Person Name} with {Clinic Name} here. Wanted to make sure all your questions were answered. This {Month}, new clients get ${v.featuredOffer}. Reserve: {Booking Link}</p></div>
        <div class="msg-step"><span class="msg-day">Day 3</span><span class="msg-channel">Email</span><p><em>Subject:</em>[First Name], here's what your first visit at {Clinic Name} looks like</p></div>
        <div class="msg-step"><span class="msg-day">Day 5</span><span class="msg-channel">SMS</span><p>Any questions I can answer? Our {Month} offer is still open, plus specials on ${v.day5Extra}. {Booking Link}</p></div>
        <div class="msg-step"><span class="msg-day">Day 8</span><span class="msg-channel">Email</span><p><em>Subject:</em>${v.day8Subject}</p></div>
        <div class="msg-step"><span class="msg-day">Day 12</span><span class="msg-channel">SMS</span><p>I don't want to keep bugging you, so this is my last message — our {Month} offers wrap up soon. Book whenever it suits you: {Booking Link}</p></div>`;

      return `<div class="msg-panel"${hasToggle ? ` data-toggle-panel="${v.key}"${i === 0 ? '' : ' style="display:none"'}` : ''}>
        <div class="msg-grid">
          <div class="phone reveal">
            <div class="phone-notch"></div>
            <div class="phone-bubble">Hi [First Name], thanks for contacting {Clinic Name}! Our team will reach out to you soon. Reserve your visit: {Booking Link} This month's offers: {Specials Link} Reply STOP to unsubscribe.</div>
            <span class="phone-caption">Instant SMS reply — sent within 60 seconds</span>
          </div>
          <div class="email-card reveal">
            <div class="email-card-head"><span class="email-dot"></span><span class="email-dot"></span><span class="email-dot"></span></div>
            <div class="email-subject">Thanks for reaching out to {Clinic Name}, [First Name]!</div>
            <p>Hi [First Name], we've received your inquiry and appreciate you thinking of {Clinic Name}. Someone from our team will reach out very soon. Want to skip the wait? Reserve your visit online: {Booking Link}. See what's on offer this month: {Specials Link}. Talk soon! — {Person Name}, {Clinic Name}</p>
            <span class="email-caption">Instant email reply — sent within 60 seconds</span>
          </div>
        </div>
        <div class="msg-timeline reveal">
          <span class="samp-chip">Sample messaging</span>
          <h4>14-day re-engagement sequence</h4>
          <p class="msg-timeline-note">Stops the moment a lead books or replies.</p>
          <div class="msg-steps">${steps}</div>
        </div>
        <div class="msg-screenshot reveal"><img src="/images/patient-growth/nurture-14-day.png" alt="The 14-day nurture campaign view inside the CRM" loading="lazy"/></div>
      </div>`;
    })
    .join('');

  return `
<section class="sec dark" id="messaging">
  <div class="wrap">
    <div class="sec-head center reveal">
      <span class="eyebrow">Sample Messaging</span>
      <h2 class="display">Every enquiry gets an instant reply, then a 14-day nurture.</h2>
      <p>Templates shown with placeholders — {Clinic Name}, {Booking Link} — swapped for the real thing when it's live.</p>
    </div>
    ${panels}
  </div>
</section>`;
}

function servicesSection(c) {
  return `
<section class="sec creambg pkg" id="services">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">The Package</span>
      <h2 class="display">The Patient Growth System</h2>
    </div>
    <div class="svc-grid svc-grid--compact">
      <div class="svc reveal">
        <div class="svc-media"><span class="num">SERVICE 01</span><img src="${c.images.service01}" alt="${c.images.service01Alt}" loading="lazy"/></div>
        <div class="svc-body">
          <h3>Ads → CRM → Booking</h3>
          <p>Treatment-based campaigns, landing pages, lead capture, instant follow-up, 14-day nurture and booking — end to end.</p>
          <ul>
            <li>Treatment-based Google Ads campaigns</li>
            <li>Predictable, qualified lead generation</li>
            <li>Automated email &amp; SMS follow-up campaigns</li>
            <li>Management across every paid ads platform</li>
          </ul>
          <span class="svc-links"><a class="svc-link" href="/process#campaigns">See the campaign types →</a><a class="svc-link" href="/process#messaging">See the follow-up flow →</a></span>
        </div>
      </div>
      <div class="svc reveal">
        <div class="svc-media"><span class="num">SERVICE 02</span><img src="${c.images.service02}" alt="${c.images.service02Alt}" loading="lazy"/></div>
        <div class="svc-body">
          <h3>Blog &amp; Content — SEO · AEO · GEO</h3>
          <p>Paid traffic is rented. Content is owned, and it compounds. Articles written, optimized and published from inside the CRM.</p>
          <ul>
            <li>Ongoing blog &amp; SEO content production</li>
            <li>SEO, AEO &amp; GEO for Google and AI search</li>
          </ul>
        </div>
      </div>
      <div class="svc reveal">
        <div class="svc-media"><span class="num">SERVICE 03</span><img src="/images/patient-growth/crm-dashboard.png" alt="The Growth Command Center CRM dashboard" loading="lazy"/></div>
        <div class="svc-body">
          <h3>CRM &amp; Website Development</h3>
          <p>A custom dashboard and a custom website, both built for your clinic and both maintained continuously.</p>
          <ul>
            <li>High-converting website &amp; treatment landing pages</li>
            <li>Custom CRM built around your clinic's workflow</li>
            <li>End-to-end workflow automation</li>
            <li>Reactivation of dormant &amp; past patients</li>
          </ul>
          <a class="svc-link" href="/process#crm">See the CRM →</a>
        </div>
      </div>
      <div class="svc reveal">
        <div class="svc-media"><span class="num">SERVICE 04</span><!-- TODO: no Google Business Profile screenshot yet — replace this Unsplash image when one exists --><img src="https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=800&q=72&auto=format&fit=crop" alt="Google Maps local profile on a phone" loading="lazy"/></div>
        <div class="svc-body">
          <h3>Google Business Profile &amp; Social Media</h3>
          <p>Often the first thing a patient sees. Managed as part of the same system, not left to chance.</p>
          <ul>
            <li>Google Business Profile &amp; reputation management</li>
            <li>Full social media account management</li>
          </ul>
          <a class="svc-link" href="/process#gbp">See how we manage it →</a>
        </div>
      </div>
    </div>
    <div class="pkg-foot">
    <div class="pkg-phases reveal">
      <div class="pkg-phase"><span class="jstep">Phase 1 · One-time</span><h4>Build</h4><p>Audit, strategy, CRM &amp; stack setup, landing pages, automations, campaign launch and team training.</p></div>
      <div class="pkg-phase pkg-phase--grow"><span class="jstep">Phase 2 · Monthly</span><h4>Grow</h4><p>Ad management, optimization, content &amp; SEO, nurture campaigns, reporting and ongoing support.</p></div>
      <a class="svc-link pkg-phases-link" href="/process#phases">See both phases in detail →</a>
    </div>
    <div class="svc-cta reveal">
      <a href="${CALENDLY}" target="_blank" rel="noopener noreferrer" class="btn btn-dark">Book a Consultation →</a>
      <p class="plan-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8.01"/><line x1="11" y1="12" x2="12" y2="12"/><line x1="12" y1="12" x2="12" y2="16"/></svg><span>Third-party tools &amp; subscriptions (ad spend, CRM licences, SMS/email credits) are billed separately — not included in this package.</span></p>
      <p class="plan-foot">One-time build fee (audit, setup, launch) · then monthly growth retainer · no long-term lock-in</p>
    </div>
    </div>
  </div>
</section>`;
}

export function crmSection(c) {
  return `
<section class="sec creambg" id="crm">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Your CRM</span>
      <h2 class="display">One CRM, built around your clinic.</h2>
      <p>Every lead, message, campaign and booking in a single dashboard your front desk actually uses — ${c.wording.customBuiltLine}, not a generic tool bent to fit. This is the system that runs the whole patient journey.</p>
    </div>
    <div class="crm-shots reveal">
      <div class="crm-shot"><img src="/images/patient-growth/crm-dashboard.png" alt="Growth Command Center CRM dashboard overview" loading="lazy"/></div>
      <div class="crm-shot"><img src="/images/patient-growth/crm-leads.png" alt="Lead list inside the CRM, tracking source and campaign for every enquiry" loading="lazy"/></div>
    </div>
    <div class="outcomes">
      <div class="out reveal"><div class="i"><svg class="svgic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16v12H5.2L4 17.2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="12.5" x2="13" y2="12.5"/></svg></div><h4>Unified lead inbox</h4><p>Every enquiry from Google Ads, forms, calls and chat lands in one place, automatically tagged by source.</p></div>
      <div class="out reveal"><div class="i"><svg class="svgic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/></svg></div><h4>Full patient timeline</h4><p>Every call, SMS, email and status change logged against each patient record — the whole history at a glance.</p></div>
      <div class="out reveal"><div class="i"><svg class="svgic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="8" cy="18" r="2" fill="currentColor" stroke="none"/></svg></div><h4>Visual booking pipeline</h4><p>Move leads through clear stages — new, contacted, booked, treated — so no patient ever stalls or goes cold.</p></div>
      <div class="out reveal"><div class="i"><svg class="svgic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="17 2 21 6 17 10"/><path d="M3 12V10a4 4 0 0 1 4-4h14"/><polyline points="7 22 3 18 7 14"/><path d="M21 12v2a4 4 0 0 1-4 4H3"/></svg></div><h4>Automated follow-up tracking</h4><p>See exactly where each lead sits in the 14-day nurture — and it stops automatically the moment they book.</p></div>
      <div class="out reveal"><div class="i"><svg class="svgic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="21" x2="4" y2="11"/><line x1="10" y1="21" x2="10" y2="4"/><line x1="16" y1="21" x2="16" y2="14"/><line x1="2.5" y1="21" x2="21.5" y2="21"/></svg></div><h4>Campaign attribution built in</h4><p>Every booked patient traced back to the exact campaign, ad and keyword that produced them — ROI you can see.</p></div>
      <div class="out reveal"><div class="i"><svg class="svgic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><polyline points="9 12 11 14 15 10"/></svg></div><h4>Role-based access &amp; audit</h4><p>Staff logins with the right permissions, plus a full audit log of every change — secure and accountable.</p></div>
    </div>
  </div>
</section>`;
}

function founderStrip() {
  return `
<section class="sec sec--tight" id="founder">
  <div class="wrap">
    <div class="fstrip reveal">
      <img class="fstrip-photo" src="/founder.jpeg" alt="Shahzaib Hamid, Founder of CodeSquad" loading="lazy"/>
      <div class="fstrip-body">
        <strong>Shahzaib Hamid, Founder</strong>
        <p>PhD in HealthTech. Runs a family health &amp; dental clinic, so we build around how clinics actually run.</p>
      </div>
      <a class="fstrip-link" href="/founder">Read the full profile →</a>
    </div>
  </div>
</section>`;
}

function whyUsSection(c) {
  const w = c.whyUs;
  const points = w.points
    .map((p) => `<div class="a reveal"><div class="ai">${p.icon}</div><h3>${p.title}</h3><p>${p.text}</p></div>`)
    .join('');
  return `
<section class="sec creambg" id="why">
  <div class="wrap">
    <div class="sec-head center reveal">
      <span class="eyebrow">Why CodeSquad</span>
      <h2 class="display">${w.title}</h2>
      <p>${w.intro}</p>
    </div>
    <div class="adapt">${points}</div>
  </div>
</section>`;
}

function proofSection(c) {
  const cs = c.caseStudy;
  const stats = cs.stats.map((s) => `<div class="metric reveal"><div class="m-val">${s.val}</div><div class="m-lab">${s.lab}</div></div>`).join('');
  const points = cs.points.map((p) => `<li>${p}</li>`).join('');
  const quotes = c.proofQuotes
    .map((q) => `<div class="quote reveal"><div class="stars">★★★★★</div><p>"${q.text}"</p><div class="who"><span class="av">${q.initials}</span><span><span class="n">${q.name}</span><span class="r">${q.role}</span></span></div></div>`)
    .join('');
  return `
<section class="sec" id="case">
  <div class="wrap case">
    <div class="reveal">
      <span class="case-badge">★ Client Case Study</span>
      <div class="num-grid num-grid--3" style="margin:0 0 26px">${stats}</div>
      <h2 class="display">${cs.headline}</h2>
      <p>${cs.intro}</p>
      <ul class="case-points">${points}</ul>
      <blockquote class="case-quote">"${cs.quote.text}"<span>— ${cs.quote.attribution}</span></blockquote>
      <a class="proof-link" href="/case-studies/harmony-medspa-patient-growth-automation">Read the full case study →</a>
    </div>
    <div class="case-visual reveal" style="aspect-ratio:16/11">
      <img src="${cs.image}" alt="${cs.imageAlt}" loading="lazy"/>
    </div>
  </div>
  <div class="wrap proof-quotes${c.proofQuotes.length > 1 ? ' proof-quotes--2' : ''}">${quotes}</div>
</section>`;
}

function faqSection(c) {
  const items = c.faqs
    .map((f) => `<div class="faq"><button><span>${f.q}</span><span class="ico">+</span></button><div class="ans"><p>${f.a}</p></div></div>`)
    .join('\n      ');
  return `
<!-- FAQ -->
<section class="sec" id="faq">
  <div class="wrap">
    <div class="sec-head center reveal" style="margin-bottom:48px"><span class="eyebrow">FAQ</span><h2 class="display">Questions, answered.</h2></div>
    <div class="faq-list reveal">
      ${items}
    </div>
  </div>
</section>`;
}

function contactSection(c) {
  const clinicOptions = ['Med spa / aesthetics', 'Medical clinic', 'Dental practice', 'Dermatology', 'Plastic surgery', 'Weight-loss clinic', 'Other medical practice']
    .map((opt) => `<option${opt === c.contactDefault ? ' selected' : ''}>${opt}</option>`)
    .join('');

  return `
<!-- CONTACT -->
<section class="sec dark" id="contact">
  <div class="wrap contact-grid">
    <div class="reveal">
      <span class="eyebrow">Get Started</span>
      <h2 class="display">Let's grow your clinic.</h2>
      <p class="lead">Book a free consultation call. We'll map your funnel, show you the live dashboard, and tell you honestly whether we're the right fit.</p>
      <ul class="contact-pts">
        <li><span class="ci">✓</span><span><strong>No rip-and-replace</strong>We connect to the tools you already use.</span></li>
        <li><span class="ci">✓</span><span><strong>See real work</strong>Actual dashboards, ads and content — not slides.</span></li>
        <li><span class="ci">✓</span><span><strong>Honest fit check</strong>If we're not right for you, we'll say so.</span></li>
      </ul>
      <div style="margin-top:28px;display:flex;flex-direction:column;gap:8px;color:#CFCDC4;font-size:15px">
        <span>Prefer to talk now? <a href="tel:+13073964945" style="color:var(--accent);font-weight:700">+1 (307) 396-4945</a></span>
        <span>Email <a href="mailto:info@codesquad.ai" style="color:var(--accent);font-weight:700">info@codesquad.ai</a> · or <a href="${CALENDLY}" target="_blank" rel="noopener" style="color:var(--accent);font-weight:700">book on Calendly →</a></span>
      </div>
      <div style="margin-top:22px;display:flex;gap:28px;flex-wrap:wrap;color:#96938a;font-size:13.5px;border-top:1px solid var(--line-dark);padding-top:18px">
        <span>Serving clients across the US, Canada, UK &amp; UAE · Team in Lahore, Pakistan</span>
      </div>
    </div>
    <form class="lead-form reveal" id="leadForm" method="POST">
      <div id="formFields">
        <div class="field"><label for="name">Full name</label><input type="text" id="name" name="name" placeholder="Jane Smith" required maxlength="120" /></div>
        <div class="field"><label for="email">Email</label><input type="email" id="email" name="email" placeholder="jane@yourclinic.com" required maxlength="200" /></div>
        <div class="field"><label for="phone">Phone</label><input type="tel" id="phone" name="phone" placeholder="(941) 555-0100" maxlength="${PHONE_MAX_LENGTH}" autocomplete="tel" inputmode="tel" pattern="${PHONE_PATTERN}" title="${PHONE_HINT}" /></div>
        <div class="field"><label for="clinic">Clinic type</label>
          <select id="clinic" name="business">${clinicOptions}</select>
        </div>
        <div class="field"><label for="message">What would you like to grow?</label><textarea id="message" name="message" placeholder="Tell us a little about your goals…" maxlength="4000"></textarea></div>
        <!-- Honeypot for bots — hidden from people and screen readers -->
        <div aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden">
          <label for="lead-website">Website</label><input type="text" id="lead-website" name="website" tabindex="-1" autocomplete="off" />
        </div>
        <p class="inq-err" id="formErr" role="alert" hidden></p>
        <button type="submit" class="btn btn-dark">Book a Consultation →</button>
        <p class="form-note">We reply within one business day. No spam, ever.</p>
      </div>
      <div class="form-ok" id="formOk">✓ Thanks — your request is in. We'll be in touch within one business day.</div>
    </form>
  </div>
</section>`;
}

export function renderPatientAcquisitionPage(config) {
  return [
    heroSection(config),
    proofSection(config),
    servicesSection(config),
    founderStrip(),
    whyUsSection(config),
    faqSection(config),
    contactSection(config)
  ].join('\n');
}
