// Industry landing pages (/dental, /plastic-surgery). Challenges are described in general terms;
// proof only uses published case studies. No industry statistics.

export const INDUSTRIES = {
  dental: {
    slug: 'dental',
    eyebrow: 'Dental practices',
    title: 'Dental Practice Marketing | CodeSquad AI Solutions',
    description: 'SEO, AEO & GEO, treatment-based ads, websites and instant follow-up for dental practices, from new-patient exams to implants and aligners.',
    h1: 'More new patients in the chair, from the first enquiry.',
    lead: 'Dental patients range from routine check-ups to considered treatments like implants and aligners. We help your practice show up for each one, earn trust online, and answer every enquiry before it goes cold.',
    hero: { img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=75&auto=format&fit=crop', alt: 'A modern dental treatment room' },
    sticker: 'New-patient exams · implants · aligners',
    why: {
      h: 'Why dental marketing needs its own approach.',
      p: 'A cleaning and a full-arch implant case are completely different decisions. Patients search differently, compare differently and need a different follow-up pace, so one generic message rarely works for both.',
      points: ['Treatment-specific pages and campaigns, not one "services" page', 'Fast replies for routine bookings, longer nurture for high-value treatment', 'Local visibility in Google Maps, search and AI answers'],
    },
    challenges: ['One generic message for every treatment', 'Phone-first booking that misses evening and weekend enquiries', 'New practices with no patient base and no room for dropped leads'],
    services: ['seo', 'paid-ads', 'website-design', 'follow-up-crm', 'aeo-geo'],
    cases: ['careinn'],
    posts: ['booked', 'slow', 'aeogeo'],
  },
  'plastic-surgery': {
    slug: 'plastic-surgery',
    eyebrow: 'Plastic surgery practices',
    title: 'Plastic Surgery Marketing | CodeSquad AI Solutions',
    description: 'AEO & GEO, SEO, procedure-focused ads, websites and long-cycle nurture for plastic surgery practices whose patients research for months.',
    h1: 'Be recommended, and remembered, through a long decision.',
    lead: 'Surgical patients research carefully, compare surgeons and increasingly ask AI assistants for recommendations. We help your practice be visible, credible and in touch for the whole journey, from first search to consultation.',
    hero: null,
    sticker: 'Months of research before one consultation',
    why: {
      h: 'A long journey needs a different system.',
      p: 'Plastic surgery patients rarely book on their first visit. They read, compare credentials, look for results and come back, sometimes months later. The practice that stays visible and helpful through that time is the one they call.',
      points: ['Answer-ready content that AI assistants and search engines can cite', 'Procedure-focused advertising that informs rather than overpromises', 'Long-cycle nurture that keeps you present until the patient is ready'],
    },
    challenges: ['Expertise that doesn\'t come through in search results or AI answers', 'High-value consultation enquiries that get one reply, then silence', 'Advertising that has to respect stricter rules for medical procedures'],
    services: ['aeo-geo', 'seo', 'paid-ads', 'website-design', 'follow-up-crm'],
    cases: [],
    posts: ['aeogeo', 'slow', 'booked'],
  },
};
