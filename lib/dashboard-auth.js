// Dashboard auth config (password gate).
// Real values come from env vars (DASHBOARD_PASSWORD, DASHBOARD_SECRET) — set on
// the host for production and in .env.local for local dev. The fallbacks below are
// non-secret dev placeholders only; they are refused in production.
// Imported by middleware (edge runtime), so keep this free of Node-only APIs.
const IS_PROD = process.env.NODE_ENV === 'production';

export const DASH_COOKIE = 'cs_dash';
export const DASH_PASSWORD = process.env.DASHBOARD_PASSWORD || (IS_PROD ? '' : 'change-me-set-DASHBOARD_PASSWORD');
// Value stored in the cookie once the correct password is entered.
export const DASH_TOKEN = process.env.DASHBOARD_SECRET || (IS_PROD ? '' : 'dev-only-set-DASHBOARD_SECRET');

// Constant-time string comparison (works in both the edge and Node runtimes).
export function safeEqual(a, b) {
  a = String(a ?? ''); b = String(b ?? '');
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

// True when the cookie value is a valid session. Always false when no secret is configured.
export const isValidToken = (token) => Boolean(DASH_TOKEN) && safeEqual(token, DASH_TOKEN);
export const isValidPassword = (pw) => Boolean(DASH_PASSWORD) && safeEqual(pw, DASH_PASSWORD);
