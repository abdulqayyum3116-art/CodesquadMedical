import { notFound } from 'next/navigation';
import CaseForm from '../../../../../components/dash/CaseForm';
import { getCase } from '../../../../../lib/store';

export const dynamic = 'force-dynamic';

export default async function EditCasePage({ params }) {
  const item = await getCase(params.slug);
  if (!item) notFound();
  const body = item.body || '';
  return (
    <div className="dash-wrap">
      <div className="dash-head"><h1>Edit case study</h1><a href="/dashboard/case-studies" className="dash-btn dash-btn--ghost">← Back</a></div>
      <CaseForm item={item} body={body} original={item.slug} />
    </div>
  );
}
