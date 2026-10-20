import IndustryPage from '../../components/IndustryPage';
import { INDUSTRIES } from '../../content/industries.config';

const d = INDUSTRIES['plastic-surgery'];
export const metadata = { title: d.title, description: d.description };

export default function Page() {
  return <IndustryPage data={d} />;
}
