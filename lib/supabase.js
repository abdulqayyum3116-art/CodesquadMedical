import 'server-only';
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Supabase is "on" only when both the URL and the server key are present.
export const supabaseEnabled = () => Boolean(URL && SERVICE_KEY);

// Every Supabase read is tagged so a dashboard save can purge Next's data cache
// with revalidateTag(CACHE_TAG) on any Node host (not only on Vercel).
export const CACHE_TAG = 'medspa-content';
const taggedFetch = (input, init = {}) => fetch(input, { ...init, next: { ...(init.next || {}), tags: [CACHE_TAG] } });

// Server-only admin client (service role — bypasses RLS). Never import into a
// client component. Returns null when Supabase isn't configured yet.
let _admin = null;
export function supabaseAdmin() {
  if (!supabaseEnabled()) return null;
  if (!_admin) _admin = createClient(URL, SERVICE_KEY, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: taggedFetch } });
  return _admin;
}

// Table + bucket names (separate from the main site's tables).
export const T = {
  posts: 'medspa_posts',
  cases: 'medspa_case_studies',
  leads: 'medspa_leads',
  bucket: 'medspa-uploads',
};
