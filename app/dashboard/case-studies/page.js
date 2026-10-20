import { getCases, restoreCaseLayouts } from '../../../lib/store';
import StoreStatus from '../../../components/dash/StoreStatus';
import { deleteCaseAction, restoreCaseLayoutsAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function CaseStudiesPage({ searchParams }) {
  let cases = [];
  let loadError = '';
  try { cases = await getCases({ strict: true }); } catch (e) { loadError = e.message; }
  let plain = [];
  if (!loadError) { try { plain = await restoreCaseLayouts({ dryRun: true }); } catch (e) { console.error('[dashboard] checking case layouts failed:', e); } }
  const restored = searchParams?.restored;
  return (
    <div className="dash-wrap">
      <div className="dash-head">
        <h1>Case studies</h1>
        <a href="/dashboard/case-studies/new" className="dash-btn dash-btn--primary">+ New case study</a>
      </div>
      <StoreStatus loadError={loadError} flash={{ error: searchParams?.error, ok: restored ? `✓ Restored the designed layout on ${restored} case ${restored === '1' ? 'study' : 'studies'}.` : '' }} />
      {plain.length ? (
        <form action={restoreCaseLayoutsAction} className="dash-note dash-note--warn dash-import">
          <span>{plain.length} case {plain.length === 1 ? 'study shows' : 'studies show'} as plain text on the live site ({plain.join(', ')}). Restore the designed page layout bundled with the site — case studies with a designed layout are not changed.</span>
          <button type="submit" className="dash-btn dash-btn--primary dash-btn--sm">Restore designed layout</button>
        </form>
      ) : null}
      <div className="dash-table">
        <div className="dash-tr dash-tr--head"><span>Client</span><span>Category</span><span>Filter</span><span>Actions</span></div>
        {cases.map((c) => (
          <div className="dash-tr" key={c.slug}>
            <span className="dash-td--title">{c.name}</span>
            <span><span className="dash-pill">{c.cat}</span></span>
            <span className="dash-muted">{c.filter}</span>
            <span className="dash-actions">
              <a href={`/dashboard/case-studies/edit/${c.slug}`}>Edit</a>
              <a href={`/case-studies/${c.slug}`} target="_blank" rel="noopener">Visit</a>
              <form action={deleteCaseAction}><input type="hidden" name="slug" value={c.slug} /><button type="submit" className="dash-del">Delete</button></form>
            </span>
          </div>
        ))}
        {cases.length === 0 && !loadError ? <div className="dash-empty">No case studies yet.</div> : null}
      </div>
    </div>
  );
}
