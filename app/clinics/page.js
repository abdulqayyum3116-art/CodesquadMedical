import { renderPatientAcquisitionPage } from '../../lib/patientAcquisitionPage';
import clinicsConfig from '../../content/clinics.config';
export const dynamic = 'force-static';
export const metadata = {
  title: 'Patient Acquisition System for Clinics & Dental Practices — MedGrow',
  description: 'Treatment-based Google Ads, 60-second follow-up, 14-day nurture, SEO content and booking, in one dashboard — for small medical clinics and dental practices.'
};
export default function Page() {
  return <main dangerouslySetInnerHTML={{ __html: renderPatientAcquisitionPage(clinicsConfig) }} />;
}
