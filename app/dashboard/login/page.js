import { loginAction } from '../actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard login | CodeSquad', robots: { index: false, follow: false } };

export default function LoginPage({ searchParams }) {
  const err = searchParams?.error;
  const next = searchParams?.next || '/dashboard';
  return (
    <div className="dash-login">
      <form className="dash-login__card" action={loginAction}>
        <div className="dash-login__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V7z" /><polyline points="9 12 11 14 15 10" /></svg>
        </div>
        <h1>Dashboard login</h1>
        <p>Enter the admin password to manage the site.</p>
        <input type="hidden" name="next" value={next} />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoFocus placeholder="••••••••" />
        {err ? <div className="dash-login__err">{err === 'config' ? 'The dashboard is not configured: set DASHBOARD_PASSWORD and DASHBOARD_SECRET on the server.' : 'Wrong password. Try again.'}</div> : null}
        <button type="submit" className="dash-btn dash-btn--primary">→ Log in</button>
      </form>
    </div>
  );
}
