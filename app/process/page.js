import { renderProcessPage } from '../../lib/processPage';
export const dynamic = 'force-static';
export const metadata = {
  title: 'How Our Growth System Works — Build & Grow Process | MedGrow',
  description: 'How MedGrow AI Solutions builds and runs patient growth systems for clinics, med spas and dental practices: a one-time build (audit, CRM, landing pages, automations, launch) then a monthly growth retainer.'
};
export default function Page() {
  return <main id="top" dangerouslySetInnerHTML={{ __html: renderProcessPage() }} />;
}
