import { getLeads, isLive } from '../../../lib/store';
import { deleteLeadAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function LeadsPage({ searchParams }) {
  let leads = [];
  let loadError = '';
  try { leads = await getLeads(); } catch (e) { loadError = e.message; }
  const flashError = searchParams?.error;
  const flashOk = searchParams?.deleted ? '✓ Lead deleted.' : '';
  return (
    <div className="dash-wrap">
      <div className="dash-head"><h1>Leads</h1></div>
      {flashError ? <div className="dash-note dash-note--err" role="alert">{flashError}</div> : null}
      {flashOk ? <div className="dash-note dash-note--ok" role="status">{flashOk}</div> : null}
      {loadError ? (
        <div className="dash-note dash-note--err" role="alert">{loadError}</div>
      ) : (
        <div className="dash-note">Inquiries from the <a href="/inquiry" target="_blank" rel="noopener">/inquiry</a>, <a href="/aesthetics" target="_blank" rel="noopener">/aesthetics</a> <a href="/clinics" target="_blank" rel="noopener">/clinics</a> and <a href="/work-with-us" target="_blank" rel="noopener">/work-with-us</a> pages. {isLive() ? 'Saved in Supabase.' : 'Local development: saved to content/leads.json.'}</div>
      )}
      <div className="dash-table">
        <div className="dash-tr dash-tr--head dash-tr--leads"><span>Name</span><span>Email</span><span>Source</span><span>Date</span><span>Actions</span></div>
        {leads.map((l, i) => {
          const p = l.payload || {};
          return (
            <div key={l.id || i}>
              <div className="dash-tr dash-tr--leads">
                <span className="dash-td--title">{l.name || '—'}</span>
                <span className="dash-muted">{l.email ? <a href={`mailto:${l.email}`}>{l.email}</a> : '—'}</span>
                <span><span className="dash-pill">{l.source || '—'}</span></span>
                <span className="dash-muted">{l.date || '—'}</span>
                <span className="dash-actions">
                  <form action={deleteLeadAction}><input type="hidden" name="id" value={l.id ?? ''} /><button type="submit" className="dash-del">Delete</button></form>
                </span>
              </div>
              {p.phone || p.business || p.message || p.practice ? (
                <div className="dash-lead-detail">
                  {p.phone ? <span><b>Phone:</b> {p.phone}</span> : null}
                  {p.business ? <span><b>Business:</b> {p.business}</span> : null}
                  {/* Extra fields sent by the /work-with-us application form */}
                  {p.practice ? <span><b>Practice:</b> {p.practice}</span> : null}
                  {p.website ? <span><b>Website:</b> {p.website}</span> : null}
                  {p.location ? <span><b>Location:</b> {p.location}</span> : null}
                  {p.budget ? <span><b>Budget:</b> {p.budget}</span> : null}
                  {p.challenges?.length ? <span><b>Challenges:</b> {p.challenges.join(', ')}</span> : null}
                  {p.services?.length ? <span><b>Services:</b> {p.services.join(', ')}</span> : null}
                  {p.challengeNotes ? <p><b>Marketing notes:</b> {p.challengeNotes}</p> : null}
                  {p.message ? <p>{p.message}</p> : null}
                </div>
              ) : null}
            </div>
          );
        })}
        {leads.length === 0 && !loadError ? <div className="dash-empty">No leads yet.</div> : null}
      </div>
    </div>
  );
}
