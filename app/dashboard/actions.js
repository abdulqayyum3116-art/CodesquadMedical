'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';
import { DASH_COOKIE, DASH_TOKEN, isValidPassword, isValidToken } from '../../lib/dashboard-auth';
import { CACHE_TAG } from '../../lib/supabase';
import * as store from '../../lib/store';

// Server actions can be invoked directly (from any route, bypassing middleware),
// so every action that reads or changes data checks the session cookie itself.
const isAuthed = () => isValidToken(cookies().get(DASH_COOKIE)?.value);
const NOT_AUTHED = 'Your dashboard session has expired. Log in again.';

export async function loginAction(formData) {
  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/dashboard');
  if (!DASH_TOKEN) redirect('/dashboard/login?error=config');
  if (!isValidPassword(password)) redirect('/dashboard/login?error=1');
  cookies().set(DASH_COOKIE, DASH_TOKEN, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
  redirect(next.startsWith('/dashboard') ? next : '/dashboard');
}

export async function logoutAction() {
  cookies().delete(DASH_COOKIE);
  redirect('/dashboard/login');
}

// Returns an error message when the user may not write, else ''.
function writeBlocker() {
  if (!isAuthed()) return NOT_AUTHED;
  if (!store.canWrite()) return store.NOT_CONFIGURED_MSG;
  return '';
}

function refreshPosts(...slugs) {
  revalidateTag(CACHE_TAG);
  for (const s of new Set(slugs.filter(Boolean))) revalidatePath(`/blog/${s}`);
  revalidatePath('/blog'); revalidatePath('/'); revalidatePath('/dashboard');
}
function refreshCases(...slugs) {
  revalidateTag(CACHE_TAG);
  for (const s of new Set(slugs.filter(Boolean))) revalidatePath(`/case-studies/${s}`);
  revalidatePath('/case-studies'); revalidatePath('/'); revalidatePath('/dashboard/case-studies');
}

// ============ POSTS ============
// Used with useFormState: returns { error } on failure, redirects on success.
export async function savePostAction(_prev, formData) {
  const blocked = writeBlocker();
  if (blocked) return { error: blocked };
  const original = String(formData.get('original') || '') || null;
  const title = String(formData.get('title') || '').trim();
  const slug = store.slugify(formData.get('slug') || title);
  let saved;
  try {
    if (!title) throw new Error('Please enter a title.');
    const img = await resolveCoverImage(formData, slug);
    const raw = String(formData.get('content') || '').replace(/\r\n/g, '\n');
    const bodyHtml = store.looksLikeHtml(raw) ? raw : store.mdLiteToHtml(raw);
    const post = {
      title, slug, cat: formData.get('cat'), date: String(formData.get('date') || '').trim(),
      img, excerpt: String(formData.get('excerpt') || '').trim(),
    };
    saved = await store.savePost({ original, post, bodyHtml });
  } catch (e) {
    console.error('[dashboard] savePost failed:', e);
    return { error: e.message || 'Saving failed.' };
  }
  refreshPosts(saved, original);
  redirect(`/dashboard?saved=${encodeURIComponent(saved)}`);
}

// Priority: uploaded file > pasted image URL > YouTube thumbnail > current image
// (the hidden "img" field, which the form clears when "Remove image" is used).
async function resolveCoverImage(formData, slug) {
  const file = formData.get('coverFile');
  if (file && typeof file !== 'string' && file.size) return store.uploadImage(file, { folder: 'blog', name: slug || 'post' });
  const url = String(formData.get('imgUrl') || '').trim();
  if (url) {
    if (!/^(https?:\/\/|\/)\S+$/i.test(url)) throw new Error('The image URL must start with https:// (or / for a file on this site).');
    return url;
  }
  const yt = ytThumb(formData.get('youtube'));
  if (yt) return yt;
  if (String(formData.get('youtube') || '').trim()) throw new Error('That YouTube link was not recognised. Paste a link like https://youtu.be/VIDEO_ID.');
  return String(formData.get('img') || '').trim();
}

// Uploads one image for the article body ("Insert image"). Returns { url } or { error }.
export async function uploadImageAction(formData) {
  const blocked = writeBlocker();
  if (blocked) return { error: blocked };
  try {
    const name = store.slugify(formData.get('slug') || '') || 'post';
    const url = await store.uploadImage(formData.get('file'), { folder: 'blog', name: `${name}-inline` });
    return { url };
  } catch (e) {
    console.error('[dashboard] uploadImage failed:', e);
    return { error: e.message || 'Upload failed.' };
  }
}

export async function deletePostAction(formData) {
  const blocked = writeBlocker();
  if (blocked === NOT_AUTHED) redirect('/dashboard/login');
  const slug = String(formData.get('slug') || '');
  let error = blocked;
  if (!error) {
    try { await store.deletePost(slug); } catch (e) { console.error('[dashboard] deletePost failed:', e); error = e.message || 'Delete failed.'; }
  }
  if (error) redirect(`/dashboard?error=${encodeURIComponent(error)}`);
  refreshPosts(slug);
  redirect(`/dashboard?deleted=${encodeURIComponent(slug)}`);
}

// Copies the original posts + case studies into Supabase (missing rows only).
export async function importOriginalsAction() {
  const blocked = writeBlocker();
  if (blocked === NOT_AUTHED) redirect('/dashboard/login');
  let error = blocked;
  let counts;
  if (!error) {
    try { counts = await store.importBundledContent(); } catch (e) { console.error('[dashboard] import failed:', e); error = e.message || 'Import failed.'; }
  }
  if (error) redirect(`/dashboard?error=${encodeURIComponent(error)}`);
  refreshPosts(...store.bundledPostSlugs()); refreshCases(...store.bundledCaseSlugs());
  redirect(`/dashboard?imported=${counts.posts}-${counts.cases}`);
}

// Replaces plain-text case study bodies with the designed layouts bundled with the site.
export async function restoreCaseLayoutsAction() {
  const blocked = writeBlocker();
  if (blocked === NOT_AUTHED) redirect('/dashboard/login');
  let error = blocked;
  let restored = [];
  if (!error) {
    try { restored = await store.restoreCaseLayouts(); } catch (e) { console.error('[dashboard] restoreCaseLayouts failed:', e); error = e.message || 'Restore failed.'; }
  }
  if (error) redirect(`/dashboard/case-studies?error=${encodeURIComponent(error)}`);
  refreshCases(...restored);
  redirect(`/dashboard/case-studies?restored=${restored.length}`);
}

// ============ LEADS ============
export async function deleteLeadAction(formData) {
  const blocked = writeBlocker();
  if (blocked === NOT_AUTHED) redirect('/dashboard/login');
  const id = String(formData.get('id') || '');
  let error = blocked;
  if (!error) {
    try { await store.deleteLead(id); } catch (e) { console.error('[dashboard] deleteLead failed:', e); error = e.message || 'Delete failed.'; }
  }
  revalidatePath('/dashboard/leads');
  redirect(error ? `/dashboard/leads?error=${encodeURIComponent(error)}` : '/dashboard/leads?deleted=1');
}

// ============ CASE STUDIES ============
export async function saveCaseAction(_prev, formData) {
  const blocked = writeBlocker();
  if (blocked) return { error: blocked };
  const original = String(formData.get('original') || '') || null;
  let saved;
  try {
    const item = {
      name: formData.get('name'), slug: formData.get('slug'), cat: formData.get('cat'),
      filter: formData.get('filter'), tagline: formData.get('tagline'), img: formData.get('img') || '',
      published: formData.get('published') !== 'off',
    };
    const bodyHtml = String(formData.get('body') || '').replace(/\r\n/g, '\n');
    saved = await store.saveCase({ original, item, bodyHtml });
  } catch (e) {
    console.error('[dashboard] saveCase failed:', e);
    return { error: e.message || 'Saving failed.' };
  }
  refreshCases(saved, original);
  redirect('/dashboard/case-studies');
}

export async function deleteCaseAction(formData) {
  const blocked = writeBlocker();
  if (blocked === NOT_AUTHED) redirect('/dashboard/login');
  const slug = String(formData.get('slug') || '');
  let error = blocked;
  if (!error) {
    try { await store.deleteCase(slug); } catch (e) { console.error('[dashboard] deleteCase failed:', e); error = e.message || 'Delete failed.'; }
  }
  if (error) redirect(`/dashboard/case-studies?error=${encodeURIComponent(error)}`);
  refreshCases(slug);
  redirect('/dashboard/case-studies');
}

// ============ VIDEOS ============
const DESTINATIONS = ['tiktok', 'youtube', 'facebook'];

// Step 1: returns { path, signedUrl } for a direct browser → Supabase upload, or { error }.
export async function createVideoUploadAction({ name, type, size, topic } = {}) {
  const blocked = writeBlocker();
  if (blocked) return { error: blocked };
  try {
    return await store.createVideoUpload({ name, type, size, topic });
  } catch (e) {
    console.error('[dashboard] createVideoUpload failed:', e);
    return { error: e.message || 'Could not start the upload.' };
  }
}

// Step 2: after the browser upload finishes, sends the public link to Make.com.
// Also used by the form's "Retry webhook" button (no re-upload needed).
export async function sendVideoToWebhookAction({ path, destinations, tone } = {}) {
  const blocked = writeBlocker();
  if (blocked) return { error: blocked };
  const webhookUrl = process.env.MAKE_VIDEO_WEBHOOK_URL;
  if (!webhookUrl) {
    return { error: 'MAKE_VIDEO_WEBHOOK_URL is not configured in .env', canRetry: true };
  }
  const cleanTone = String(tone || '').trim().slice(0, 500);
  const dest = [...new Set((Array.isArray(destinations) ? destinations : []).map(String))].filter((d) => DESTINATIONS.includes(d));
  if (!dest.length) return { error: 'Choose at least one destination.' };
  if (!cleanTone) return { error: 'Please enter a tone.' };

  let video_url;
  try {
    video_url = await store.getVideoPublicUrl(path);
  } catch (e) {
    console.error('[dashboard] video check failed:', e);
    return { error: e.message || 'The uploaded video could not be found.' };
  }

  const payload = { video_url, destinations: dest, tone: cleanTone };
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`Make.com responded ${res.status}: ${(await res.text()).slice(0, 200)}`);
  } catch (e) {
    console.error('[dashboard] video webhook failed:', e);
    const reason = e.name === 'TimeoutError' ? 'Make.com did not respond within 20 seconds.' : e.message;
    return { error: `Video saved, but sending it to Make.com failed: ${reason}`, publicUrl: video_url, canRetry: true };
  }
  return { ok: true, publicUrl: video_url };
}

function ytThumb(url) {
  const u = String(url || '');
  const m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : '';
}
