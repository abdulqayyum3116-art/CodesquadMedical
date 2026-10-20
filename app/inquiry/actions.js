'use server';

import { addLead } from '../../lib/store';
import { isValidPhone } from '../../lib/phone';

const clip = (v, n) => String(v || '').trim().slice(0, n);

// Which page a lead came from, shown as its Source in the dashboard. Only known
// pages get their own label, so a forged value can't put arbitrary text there.
const SOURCES = { '/aesthetics': 'Aesthetics page', '/clinics': 'Clinics page' };

// Public form: no login, so validate everything and keep it small.
// Returns { ok: true } or { error }.
export async function submitInquiryAction(_prev, formData) {
  // Honeypot: real visitors never see or fill the "website" field.
  if (clip(formData.get('website'), 200)) return { ok: true };

  const name = clip(formData.get('name'), 120);
  const email = clip(formData.get('email'), 200);
  // Not clipped: an over-long number should fail validation, not be silently cut.
  const phone = String(formData.get('phone') || '').trim();
  const business = clip(formData.get('business'), 80);
  const message = clip(formData.get('message'), 4000);

  if (!name) return { error: 'Please enter your name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Please enter a valid email address.' };
  if (phone && !isValidPhone(phone)) return { error: 'Please enter a valid phone number, e.g. (941) 555-0100.' };

  try {
    const source = SOURCES[clip(formData.get('page'), 40)] || 'Inquiry page';
    await addLead({ name, email, source, payload: { phone, business, message } });
  } catch (e) {
    console.error('[inquiry] saving lead failed:', e);
    return { error: 'Sorry, your inquiry could not be sent right now. Please email info@codesquad.ai or call +1 (307) 396-4945.' };
  }
  return { ok: true };
}
