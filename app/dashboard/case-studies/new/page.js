import CaseForm from '../../../../components/dash/CaseForm';

export const dynamic = 'force-dynamic';

export default function NewCasePage() {
  return (
    <div className="dash-wrap">
      <div className="dash-head"><h1>New case study</h1><a href="/dashboard/case-studies" className="dash-btn dash-btn--ghost">← Back</a></div>
      <CaseForm />
    </div>
  );
}
