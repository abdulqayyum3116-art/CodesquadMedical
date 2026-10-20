import IndustryPage from '../../components/IndustryPage';
import { INDUSTRIES } from '../../content/industries.config';

const d = INDUSTRIES.dental;
export const metadata = { title: d.title, description: d.description };

export default function Page() {
  return <IndustryPage data={d} />;
}
