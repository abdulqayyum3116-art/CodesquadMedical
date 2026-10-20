import { supabaseStatus, NOT_CONFIGURED_MSG } from '../../lib/store';

// Real connection check (not just "are the env vars set"), shown on the dashboard
// so a broken Supabase setup is visible instead of silently falling back.
export default async function StoreStatus({ loadError, flash }) {
  const s = await supabaseStatus();
  return (
    <>
      {flash?.error ? <div className="dash-note dash-note--err" role="alert"><b>Action failed.</b> {flash.error}</div> : null}
      {flash?.ok ? <div className="dash-note dash-note--ok" role="status">{flash.ok}</div> : null}
      {s.mode === 'unconfigured' ? (
        <div className="dash-note dash-note--err">{NOT_CONFIGURED_MSG}</div>
      ) : s.mode === 'local' ? (
        <div className="dash-note">Local development mode — saving to your project files. Production needs Supabase.</div>
      ) : s.ok && !loadError ? (
        <div className="dash-note">✓ Connected to Supabase — create, edit and delete save live to your site.</div>
      ) : (
        <div className="dash-note dash-note--err">
          <b>Supabase is configured but not working</b> — changes cannot be saved until this is fixed:
          <ul>{[...(s.problems || []), loadError].filter(Boolean).map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      )}
    </>
  );
}
