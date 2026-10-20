// Copy + data for /aesthetics. No markup here — see lib/patientAcquisitionPage.js for rendering.
export default {
  hero: {
    bgVideo: '/hero.mp4',
    bgImage: null,
    tagline: 'The Growth System for Med Spas · Aesthetic Clinics · Cosmetic Derm',
    typerWords: ['med spas', 'aesthetic clinics', 'laser clinics', 'cosmetic derm'],
    headline: 'Every enquiry answered in 60 seconds.',
    headlineAccent: 'More booked patients.',
    typerLead: 'Built for',
    sub: 'Treatment-based Google Ads, instant follow-up and booking in one system for med spas and aesthetic clinics, built into the booking software you already use.',
    guaranteeBadge: 'Real results from a live client',
    audienceChips: [
      { img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=120&q=70&auto=format&fit=crop', label: 'Med Spas' },
      { img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=120&q=70&auto=format&fit=crop', label: 'Aesthetic Clinics' },
      { img: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=120&q=70&auto=format&fit=crop', label: 'Laser & Skin Clinics' }
    ],
    guarantee: {
      leadsNum: '60',
      leadsSuffix: '+',
      leadsLabel: 'Leads generated (2 months)',
      rows: [
        { label: 'Cost per lead', value: '~$50' },
        { label: 'New patients (2 months)', value: '6–7' },
        { label: 'Lead response time', value: '~60s' },
        { label: 'Automated nurture', value: '14-day' }
      ]
    }
  },


  flowSamples: {
    reactivation: "Hi [First Name], it's been a few months since your last visit to {Clinic Name} — we'd love to see you again. This {Month}, returning clients get 15% off any treatment. Book your spot: {Booking Link}",
    blog: {
      title: 'Botox vs. Dermal Fillers: Which Is Right for You?',
      meta: "A quick, no-pressure guide to the two most-asked-about treatments — what each does, how long results last, and how to decide."
    },
    gbpPost: "This month only: 20% off your first Signature Glow Facial + a free skin consultation. Book online — same-week appointments available."
  },

  images: {
    campaignHero: '/images/patient-growth/landing-page-weight-loss.png',
    campaignHeroAlt: 'A treatment-specific landing page with an enquiry form, one of the pages each campaign sends traffic to',
    service01: '/images/patient-growth/google-ads-workspace.png',
    service01Alt: 'Google Ads workspace inside the CRM, showing live aesthetics campaign performance',
    service02: '/images/patient-growth/blog-editorial.png',
    service02Alt: 'Blog editorial desk producing aesthetics SEO, AEO and GEO content'
  },

  campaigns: {
    audienceLabel: 'med spas and aesthetic clinics',
    toggle: null,
    groups: [
      {
        key: null,
        samples: [
          { type: 'Local', name: 'Med Spa Near Me – [City]', keywords: 'med spa near me, med spa [city], aesthetic clinic [city]', headline: 'Top-Rated Med Spa in [City] / Free Consultation', landsOn: 'Main landing page' },
          { type: 'Local', name: 'Aesthetic Clinic – [Neighborhood]', keywords: 'aesthetic clinic [neighborhood], med spa near [landmark], botox near me', headline: 'Your Neighborhood Med Spa / Book Online Today', landsOn: 'Main landing page' },
          { type: 'Local', name: 'Med Spa Open Weekends – [City]', keywords: 'med spa open saturday, same-week botox [city], med spa open late', headline: 'Evening & Weekend Appointments / Book Online', landsOn: 'Main landing page' },
          { type: 'Treatment', name: 'Medical Weight Loss', keywords: 'semaglutide [city], weight loss injections near me, GLP-1 clinic', headline: 'Doctor-Led Weight Loss / Start This Week', landsOn: 'Weight-loss page' },
          { type: 'Treatment', name: 'Botox & Fillers', keywords: 'botox [city], lip filler near me, wrinkle injections', headline: 'Natural-Looking Botox / Licensed Injectors', landsOn: 'Injectables page' },
          { type: 'Treatment', name: 'Laser Hair Removal', keywords: 'laser hair removal [city], LHR packages', headline: 'Smooth Skin for Good / Package Pricing', landsOn: 'Laser page' },
          { type: 'Treatment', name: 'Facials & Microneedling', keywords: 'microneedling [city], hydrafacial near me', headline: 'Glowing Skin Starts Here / New-Client Offer', landsOn: 'Skin page' },
          { type: 'Treatment', name: 'IV Vitamin Therapy', keywords: 'iv therapy [city], vitamin drip near me, nad+ therapy', headline: 'Feel Better Fast / IV Drips From $X', landsOn: 'IV Therapy page' },
          { type: 'Treatment', name: 'Skin Tightening & Body Contouring', keywords: 'skin tightening [city], body contouring near me, radiofrequency treatment', headline: 'Sculpt Without Surgery / Free Consultation', landsOn: 'Body Contouring page' },
          { type: 'Ranking', name: 'Own "Best Botox [City]"', keywords: 'best botox [city], botox cost [city], botox specials', headline: "Botox from $X/Unit / [City]'s Trusted Injectors", landsOn: 'Injectables page + blog' },
          { type: 'Ranking', name: 'Own "Best Lip Filler [City]"', keywords: 'best lip filler [city], lip filler cost [city], lip filler specials', headline: 'Soft, Natural-Looking Lips / Free Consultation', landsOn: 'Injectables page + blog' },
          { type: 'Ranking', name: 'Own "Best Med Spa [City]"', keywords: 'best med spa [city], med spa reviews [city], top rated med spa [city]', headline: "[City]'s Top-Rated Med Spa / Book Your Visit", landsOn: 'Main page + blog' }
        ]
      }
    ]
  },

  messaging: {
    variants: [
      { key: 'aesthetics', featuredOffer: '20% off their first Signature Glow Facial plus a free skin consultation', day5Extra: 'Microneedling and Laser Hair Removal', day8Subject: "First time at a med spa? Here's how it works." }
    ]
  },

  wording: {
    teamLine: 'one team that lives in aesthetics',
    customBuiltLine: 'custom-built for aesthetics'
  },

  whyUs: {
    title: "Tired of agencies that don't understand your practice?",
    intro: 'Most agencies have never run a clinic. We have, so we measure what you measure: booked patients.',
    points: [
      { icon: '<svg class="svgic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>', title: 'Booked patients, not clicks', text: 'Every booking is traced to the exact ad and keyword behind it, so you see real appointments, not likes.' },
      { icon: '<svg class="svgic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="17 2 21 6 17 10"/><path d="M3 12V10a4 4 0 0 1 4-4h14"/><polyline points="7 22 3 18 7 14"/><path d="M21 12v2a4 4 0 0 1-4 4H3"/></svg>', title: 'No switching software', text: 'We build into the booking system and tools you already use. No migration, no retraining your front desk.' },
      { icon: '<svg class="svgic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><polyline points="9 12 11 14 15 10"/></svg>', title: 'Built for aesthetics', text: 'Three years with healthcare brands. Treatment-based campaigns and health-ad compliance are the default, not an add-on.' }
    ]
  },
  faqs: [
    { q: 'Do I have to switch my booking system or software?', a: 'No. We connect to what already works. Harmony kept PatientNow; we built around it.' },
    { q: 'How fast do new enquiries get a response?', a: "Within seconds, day or night, by SMS and email. Anyone who doesn't book gets a 14-day nurture that stops the instant they do." },
    { q: 'How is it priced?', a: "A one-time build fee covers the audit, setup and launch. After that it's a monthly growth retainer with no long-term lock-in. Third-party tools (ad spend, CRM licences, SMS/email credits) are billed separately. <a href=\"/process\" style=\"color:var(--accent-deep);font-weight:700\">See what each phase includes</a>." },
    { q: 'Is this compliant with health-advertising rules?', a: "Yes. Campaigns follow Google's restricted-health advertising rules, and conversions only count confirmed leads." },
    { q: 'What kinds of practices is this for?', a: 'Med spas, aesthetic and laser clinics, cosmetic dermatology, weight-loss and wellness studios. Run a medical or dental clinic? <a href="/clinics" style="color:var(--accent-deep);font-weight:700">See Clinics &amp; Dental</a>.' }
  ],
  proofQuotes: [
    {
      text: 'CodeSquad connected our ads, CRM and follow-up into one system. Every enquiry now gets an instant reply, and I can see the exact ad behind each booking — nothing slips through.',
      initials: 'HM',
      name: 'Harmony Med Spa',
      role: 'Sarasota, FL · Aesthetics'
    }
  ],

  caseStudy: {
    headline: 'Harmony Med Spa, Sarasota, Florida — a full patient growth system, live today.',
    stats: [
      { val: '60<em>+</em>', lab: 'Leads (2 months)' },
      { val: '<em>~$</em>50', lab: 'Cost per lead' },
      { val: '6–7', lab: 'New patients booked' }
    ],
    intro: "We connected Google Ads, treatment landing pages, a custom CRM, automated follow-up and their existing PatientNow booking into one system.",
    decision: "we did not replace Harmony's booking system. A growth system should connect what already works, not force a migration that disrupts the clinic for months.",
    points: [
      'Treatment-specific Google Ads &amp; matching landing pages',
      '60-second automated SMS &amp; email follow-up, day or night',
      '14-day nurture that stops the moment a patient books'
    ],
    quote: { text: 'CodeSquad transitioned us from fragmented, manual follow-up to a fully automated system — every lead answered and tracked.', attribution: 'Hayden, Harmony Med Spa' },
    image: '/uploads/case-studies/harmony-medspa-lobby.jpg',
    imageAlt: 'Harmony Med Spa reception and waiting lounge'
  },

  contactDefault: 'Med spa / aesthetics'
};
