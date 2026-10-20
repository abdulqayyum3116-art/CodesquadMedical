import { renderPatientAcquisitionPage } from '../../lib/patientAcquisitionPage';
import aestheticsConfig from '../../content/aesthetics.config';
export const dynamic = 'force-static';
export const metadata = {
  title: 'Med Spa & Aesthetic Clinic Patient Acquisition | MedGrow',
  description: 'Google Ads, 60-second follow-up, 14-day nurture, SEO and booking in one dashboard — one med spa client got 60+ leads and 6–7 new patients in 2 months.'
};
export default function Page() {
  return <main dangerouslySetInnerHTML={{ __html: renderPatientAcquisitionPage(aestheticsConfig) }} />;
}
