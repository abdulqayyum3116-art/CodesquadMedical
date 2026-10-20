// Service pages (/services/[slug]). Content only describes services CodeSquad already offers;
// proof uses figures that already appear in the published case studies. No new statistics.

export const CASES = {
  harmony: { href: '/case-studies/harmony-medspa-patient-growth-automation', tag: 'Med spa', name: 'Harmony MedSpa', line: 'Replies to new leads in about 60 seconds, follows up with non-bookers and reactivates past patients.', facts: ['~60 sec response', '20+ hrs/week saved', '5-touch follow-up'] },
  careinn: { href: '/case-studies/careinn-dental-clinic', tag: 'Dental clinic', name: 'CareInn Dental Clinic', line: 'A patient growth system live before the first patient, with every enquiry answered within 60 seconds.', facts: ['Live from day one', 'Under 60 sec response', '14-day follow-up'] },
  rtm: { href: '/case-studies/rtm-kinetics', tag: 'Remote patient monitoring', name: 'RTM Kinetics', line: 'One patient CRM from first enquiry to recovery, with automated reconnect campaigns.', facts: ['1 patient CRM', 'Automated reconnect'] },
};

export const POSTS = {
  microneedling: { href: '/blog/microneedling-seo-med-spas', cat: 'Medical SEO', title: 'From "Microneedling Near Me" to Booked: The SEO Strategy for Med Spas' },
  aeogeo: { href: '/blog/seo-aeo-geo-ai-search-guide-2', cat: 'AEO & GEO', title: 'SEO Is No Longer Enough: A Beginner\'s Guide to AEO and GEO in the Age of AI Search' },
  slow: { href: '/blog/how-businesses-lose-money-slow-lead-response', cat: 'Follow-up', title: 'The Hidden Cost of Slow Lead Response' },
  booked: { href: '/blog/the-fully-booked-business', cat: 'Bookings', title: 'The Fully-Booked Business: a guide and self-assessment' },
};

export const SERVICES = [
  {
    slug: 'seo', stage: 'Found', short: 'Medical SEO',
    title: 'SEO for medical practices',
    h1: 'Show up when patients search for your treatments.',
    lead: 'Local SEO, treatment pages and content that match what patients actually type, so your practice appears in Google Search and Maps for the care you want to be known for.',
    img: '/images/patient-growth/blog-editorial.png', imgAlt: 'CodeSquad content workspace used to plan and publish SEO articles',
    who: ['Med spas promoting specific treatments', 'Dental practices growing new-patient exams and high-value care', 'Medical clinics competing in local search', 'Plastic surgery practices with long research journeys'],
    included: [
      ['Google Business Profile & local SEO', 'A complete, active profile and consistent local listings so you appear in Maps and the local pack.'],
      ['Treatment & service pages', 'One focused page per treatment, written around real patient searches and questions.'],
      ['Content that answers patient questions', 'Articles built from the questions patients ask before they book.'],
      ['Technical health', 'Speed, structure and indexing fixes so search engines can read every page.'],
      ['Reporting tied to enquiries', 'Rankings and traffic reported next to the enquiries they produced.'],
    ],
    approach: 'SEO on its own fills the top of the funnel. We connect it to landing pages, instant follow-up and one dashboard, so you can see which searches turned into booked appointments.',
    cases: ['harmony', 'careinn'], posts: ['microneedling', 'booked', 'aeogeo'],
  },
  {
    slug: 'aeo-geo', stage: 'Found', short: 'AEO & GEO',
    title: 'AEO & GEO: visibility in AI search',
    h1: 'Be the practice AI assistants recommend.',
    lead: 'Patients now ask ChatGPT, Gemini and Google\'s AI Overviews which clinic to choose. Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) structure your content so these systems can find it, trust it and cite it.',
    img: '/images/patient-growth/blog-editorial.png', imgAlt: 'CodeSquad editorial workspace with AI search scoring',
    who: ['Practices already doing SEO that want to appear in AI answers', 'Specialties where patients research for weeks or months', 'Clinics with strong expertise that isn\'t showing up online'],
    included: [
      ['Answer-ready content', 'Clear, structured answers to the questions patients ask about treatments, costs and recovery.'],
      ['Entity & credential signals', 'Consistent information about your practice, team and specialties across the web.'],
      ['Structured data', 'Schema markup that helps search and AI systems understand your services and locations.'],
      ['Search & AI readiness checks', 'Each article is checked for search and AI readiness before it goes live.'],
      ['AI visibility checks', 'Regular reviews of how AI assistants describe and recommend your practice.'],
    ],
    approach: 'AEO and GEO build on good SEO rather than replacing it. We treat them as one content system, measured against the enquiries it brings in.',
    cases: [], posts: ['aeogeo', 'microneedling'],
  },
  {
    slug: 'paid-ads', stage: 'Found', short: 'Paid ads',
    title: 'Paid advertising for medical practices',
    h1: 'Ads that point to the treatment, not the homepage.',
    lead: 'Treatment-based Google and Meta campaigns, each paired with its own landing page and instant follow-up, so ad spend goes towards patients who are ready to book.',
    img: '/images/patient-growth/google-ads-workspace.png', imgAlt: 'CodeSquad Google Ads workspace showing campaigns, ad groups and approval status',
    who: ['Practices launching or promoting a specific treatment', 'Clinics that need enquiries while SEO builds', 'Teams that can\'t see which ads produce appointments'],
    included: [
      ['Google Search campaigns', 'Built around treatment and location searches with clear intent.'],
      ['Meta (Facebook & Instagram) ads', 'Campaigns for treatments where visuals and offers matter.'],
      ['Landing page per campaign', 'Every ad leads to a page about the exact treatment it promotes.'],
      ['Policy-aware setup', 'Campaigns built with healthcare advertising policies in mind, with approval status tracked.'],
      ['Spend linked to enquiries', 'Each lead traced back to the campaign, ad and keyword that produced it.'],
    ],
    approach: 'Clicks are only the start. Every campaign is connected to instant follow-up, so enquiries from ads are answered quickly and tracked through to the booking.',
    cases: ['harmony'], posts: ['microneedling', 'slow', 'booked'],
  },
  {
    slug: 'website-design', stage: 'Chosen', short: 'Website design',
    title: 'Website & landing page design',
    h1: 'A website that earns the enquiry.',
    lead: 'Clear, credible pages for each treatment, with the answers, people and booking options a patient looks for before they reach out. Built to load fast and connect to your follow-up.',
    img: '/images/patient-growth/landing-page-weight-loss.png', imgAlt: 'Example treatment landing page built by CodeSquad',
    who: ['Practices with an outdated or generic website', 'Clinics running ads to a homepage', 'New practices that need to look established from day one'],
    included: [
      ['Treatment landing pages', 'One page per treatment or procedure, designed around a single next step.'],
      ['Trust built in', 'Your real team, credentials and reviews placed where patients decide.'],
      ['Clear booking paths', 'Booking links and enquiry forms on every page, connected to your CRM.'],
      ['Speed & mobile', 'Fast, accessible pages that work on the phone in a patient\'s hand.'],
      ['Built for search', 'Page structure and content ready for SEO, AEO and GEO.'],
    ],
    approach: 'We design pages as part of the system: the ad or search that brings the patient in, the page that earns their trust, and the follow-up that books them.',
    cases: ['careinn', 'harmony'], posts: ['booked', 'microneedling'],
  },
  {
    slug: 'follow-up-crm', stage: 'Booked', short: 'Follow-up & CRM',
    title: 'Instant follow-up, nurture & CRM',
    h1: 'Answer every enquiry in seconds, and keep following up.',
    lead: 'Every new enquiry gets a text and email with a booking link right away, then a structured follow-up sequence. Leads, conversations and bookings sit in one CRM and one live dashboard.',
    img: '/images/patient-growth/crm-dashboard.png', imgAlt: 'CodeSquad patient growth dashboard showing leads, follow-up and delivery health',
    who: ['Practices that miss after-hours enquiries', 'Front desks too busy to follow up consistently', 'Owners who want one view of leads and bookings'],
    included: [
      ['Instant text & email reply', 'A reply with a booking link the moment someone enquires, day or night.'],
      ['14-day nurture sequence', 'Structured follow-up for people who don\'t book straight away.'],
      ['Past-patient reactivation', 'Reminders based on treatment cycles to bring patients back.'],
      ['CRM pipeline', 'Every lead, message and booking in one place, inside the tools you already use.'],
      ['One live dashboard', 'Leads, follow-up, delivery health and bookings in a single view.'],
    ],
    approach: 'No rip-and-replace. We connect to your existing booking software and tools, then add the speed and consistency that turns enquiries into appointments.',
    cases: ['harmony', 'careinn', 'rtm'], posts: ['slow', 'booked', 'aeogeo'],
  },
];

export const getService = (slug) => SERVICES.find((s) => s.slug === slug);
