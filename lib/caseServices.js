// Service tags for the Results filter, taken from each published case study's own
// "Services" line. Case studies added later from the dashboard simply have no tags
// (they still appear under "All").
export const SERVICE_FILTERS = ['SEO', 'Paid ads', 'Follow-up & CRM', 'Content', 'Automation & AI'];

export const CASE_SERVICES = {
  'harmony-medspa-patient-growth-automation': { line: 'Automation · SEO', tags: ['SEO', 'Follow-up & CRM', 'Automation & AI'] },
  'careinn-dental-clinic': { line: 'Automation · SEO · Patient Growth', tags: ['SEO', 'Follow-up & CRM', 'Automation & AI'] },
  'rtm-kinetics': { line: 'Patient CRM · Remote Monitoring · Automation', tags: ['Follow-up & CRM', 'Automation & AI'] },
};

// Industry filter order: healthcare first, since that's the focus of the site.
export const INDUSTRY_FILTERS = ['All', 'Healthcare & Clinics'];
export const DEFAULT_INDUSTRY = 'Healthcare & Clinics';
