import { getContent } from '../../lib/content';
import './industry.css';
export const dynamic = 'force-static';
export const metadata = {
  title: 'Industries — Clinics, Med Spas, Dental & Plastic Surgery | CodeSquad AI Solutions',
  description: 'How CodeSquad AI Solutions helps medical clinics, med spas, dental practices and plastic surgeons get found in search and AI answers, chosen by the right patients, and booked.'
};
export default function Page() {
  return <main dangerouslySetInnerHTML={{ __html: getContent('industry') }} />;
}
