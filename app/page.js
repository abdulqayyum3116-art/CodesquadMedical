import { getContent } from '../lib/content';
import './home.css';
export const dynamic = 'force-static';
export const metadata = {
  title: 'MedGrow AI Solutions | Found. Chosen. Booked. — Patient Growth for Medical Practices',
  description: 'Medical advertising, SEO, AEO and GEO, and instant patient follow-up for clinics, med spas, dentists and plastic surgeons. Get found, get chosen, get booked.'
};
export default function Home() {
  return <main id="main" dangerouslySetInnerHTML={{ __html: getContent('home') }} />;
}
