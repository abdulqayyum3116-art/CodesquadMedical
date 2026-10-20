import { getContent } from '../lib/content';
import GrowthHub from '../components/growth-hub/GrowthHub';
import './home.css';
export const dynamic = 'force-static';
export const metadata = {
  title: 'MedGrow AI Solutions | Found. Chosen. Booked. — Patient Growth for Medical Practices',
  description: 'Medical advertising, SEO, AEO and GEO, and instant patient follow-up for clinics, med spas, dentists and plastic surgeons. Get found, get chosen, get booked.'
};

// The growth hub is an interactive React section; the rest of the page is static HTML around it.
const [before, after] = getContent('home').split('<!--#growth-hub-->');

export default function Home() {
  return (
    <main id="main">
      <div dangerouslySetInnerHTML={{ __html: before }} />
      <GrowthHub />
      <div dangerouslySetInnerHTML={{ __html: after }} />
    </main>
  );
}
