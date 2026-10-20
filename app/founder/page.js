import { getContent } from '../../lib/content';
export const dynamic = 'force-static';
export const metadata = {
  title: 'Shahzaib Hamid, Founder — MedGrow',
  description: 'Shahzaib Hamid, founder and CEO of MedGrow — PhD in Applied AI, with research in clinical gait analysis for remote patient care.'
};
export default function Page() {
  return <main dangerouslySetInnerHTML={{ __html: getContent('founder') }} />;
}
