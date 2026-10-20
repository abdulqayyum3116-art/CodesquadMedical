// Topic + related service for each article, used by the Insights list and article pages.
// Works automatically for posts added from the dashboard: their category is used when it is
// one of these topics, older category names are mapped, and anything else is inferred from
// the title and excerpt. No code change is needed when a new article is published.
export const TOPICS = ['Medical SEO', 'AEO & GEO', 'Paid ads', 'Website design', 'Follow-up & bookings'];

const SERVICE_BY_TOPIC = {
  'Medical SEO': { slug: 'seo', name: 'Medical SEO' },
  'AEO & GEO': { slug: 'aeo-geo', name: 'AEO & GEO' },
  'Paid ads': { slug: 'paid-ads', name: 'Paid ads' },
  'Website design': { slug: 'website-design', name: 'Website design' },
  'Follow-up & bookings': { slug: 'follow-up-crm', name: 'Follow-up & CRM' },
};

// Hand-picked topics for the original articles (their stored categories were generic).
const BY_SLUG = {
  'microneedling-seo-med-spas': 'Medical SEO',
  'seo-aeo-geo-ai-search-guide-2': 'AEO & GEO',
  'seo-aeo-geo-ai-search-guide': 'AEO & GEO',
  'the-fully-booked-business': 'Follow-up & bookings',
  'how-businesses-lose-money-slow-lead-response': 'Follow-up & bookings',
};

// Category names used before the medical redesign.
const LEGACY_CAT = { 'AEO / SEO': 'AEO & GEO', 'Lead Generation': 'Follow-up & bookings' };

// Keyword rules, checked in order against the title + excerpt.
const RULES = [
  ['AEO & GEO', /\b(aeo|geo|answer engine|generative engine|ai search|ai overview|chatgpt|gemini|llm)\b/i],
  ['Paid ads', /\b(google ads|meta ads|facebook ads|instagram ads|ppc|paid ads?|advertis\w*|campaigns?)\b/i],
  ['Website design', /\b(websites?|web design|landing pages?|conversion rate|ux)\b/i],
  ['Follow-up & bookings', /\b(follow[- ]?ups?|lead response|nurtur\w*|bookings?|booked|crm|reactivat\w*|no[- ]shows?|appointments?)\b/i],
  ['Medical SEO', /\b(seo|search|google maps|local search|ranking|keywords?)\b/i],
];

export function topicOf(post) {
  let topic = BY_SLUG[post.slug];
  if (!topic && TOPICS.includes(post.cat)) topic = post.cat;
  if (!topic && LEGACY_CAT[post.cat]) topic = LEGACY_CAT[post.cat];
  if (!topic) {
    const text = `${post.title || ''} ${post.excerpt || ''}`;
    topic = RULES.find(([, re]) => re.test(text))?.[0];
  }
  topic = topic || 'Insights';
  return { topic, service: SERVICE_BY_TOPIC[topic] || null };
}

// Filter buttons: the known topics in a fixed order, then any other topic in use.
export function topicsInUse(posts) {
  const used = new Set(posts.map((p) => topicOf(p).topic));
  return [...TOPICS.filter((t) => used.has(t)), ...[...used].filter((t) => !TOPICS.includes(t))];
}

// Approximate reading time from the article HTML (about 220 words a minute).
export function readingTime(html) {
  const words = String(html || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
