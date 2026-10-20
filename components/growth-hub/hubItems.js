import SeoGraphic from './graphics/SeoGraphic';
import AeoGraphic from './graphics/AeoGraphic';
import GeoGraphic from './graphics/GeoGraphic';
import AdsGraphic from './graphics/AdsGraphic';
import FollowUpGraphic from './graphics/FollowUpGraphic';
import CrmGraphic from './graphics/CrmGraphic';
import DashboardGraphic from './graphics/DashboardGraphic';

/**
 * @typedef {Object} HubItem
 * @property {string} id
 * @property {string} shortLabel   label on the donut segment
 * @property {string} title
 * @property {string} description
 * @property {(props: {active: boolean, compact?: boolean}) => JSX.Element} graphic
 * @property {{label: string, value: string}[]} [stats]
 */

/** @type {HubItem[]} */
export const HUB_ITEMS = [
  { id: 'seo', shortLabel: 'SEO', title: 'Search Engine Optimisation',
    description: 'Rank on page one for the treatments patients actually search for, in your area. Technical fixes, local SEO and content that converts.',
    graphic: SeoGraphic },
  { id: 'aeo', shortLabel: 'AEO', title: 'Answer Engine Optimisation',
    description: 'Become the answer in featured snippets, “People also ask” boxes and voice search, using structured FAQs and schema.',
    graphic: AeoGraphic },
  { id: 'geo', shortLabel: 'GEO', title: 'Generative Engine Optimisation',
    description: 'Get your clinic recommended and cited when patients ask AI assistants for the best provider near them.',
    graphic: GeoGraphic },
  { id: 'ads', shortLabel: 'Ads', title: 'Paid Ads',
    description: 'Search and social campaigns tuned for booked appointments, not clicks, with every dollar tracked to revenue.',
    graphic: AdsGraphic },
  { id: 'follow-up', shortLabel: 'Follow-up', title: 'Patient Follow-up',
    description: 'Every enquiry gets a text and email within seconds, then a structured 14-day follow-up, so no patient is left waiting.',
    graphic: FollowUpGraphic },
  { id: 'crm', shortLabel: 'CRM', title: 'CRM Management',
    description: 'Every lead, conversation and booking in one pipeline, with automatic tagging, reminders and hand-offs for your front desk.',
    graphic: CrmGraphic },
  { id: 'dashboard', shortLabel: 'Dashboard', title: 'Single Dashboard',
    description: 'SEO, ads, enquiries and revenue in one live view. One login, one source of truth.',
    graphic: DashboardGraphic },
];
