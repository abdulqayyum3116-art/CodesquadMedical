'use server';

import { addLead } from '../../lib/store';
import { isValidPhone } from '../../lib/phone';
import { PRACTICE_TYPES, SERVICES, CHALLENGES, BUDGETS } from './options';

const clip = (v, n) => String(v || '').trim().slice(0, n);
// Pages that embed this form; only these labels can appear as a lead's Source in the dashboard.
const SOURCES = { dental: 'Dental page application', 'plastic-surgery': 'Plastic surgery page application' };
// Only accept values from the known option lists, so the dashboard never shows arbitrary text there.
const pick = (v, list) => (list.includes(v) ? v : '');
const pickAll = (vals, list) => vals.map(String).filter((v) => list.includes(v));

// Public application form: no login, so validate everything server-side too.
// Returns { ok: true } or { error, fields } where `fields` maps field name -> message.
export async function submitApplicationAction(_prev, formData) {
  // Honeypot: real visitors never see or fill this field.
  if (clip(formData.get('company_url'), 200)) return { ok: true };

  const name = clip(formData.get('name'), 120);
  const email = clip(formData.get('email'), 200);
  const phone = String(formData.get('phone') || '').trim();
  const practice = clip(formData.get('practice'), 120);
  const websiteRaw = clip(formData.get('website'), 300);
  const practiceType = pick(String(formData.get('practiceType') || ''), PRACTICE_TYPES);
  const location = clip(formData.get('location'), 120);
  const challenges = pickAll(formData.getAll('challenges'), CHALLENGES);
  const challengeNotes = clip(formData.get('challengeNotes'), 2000);
  const services = pickAll(formData.getAll('services'), SERVICES);
  const budget = pick(String(formData.get('budget') || ''), BUDGETS);
  const goals = clip(formData.get('goals'), 4000);
  const consent = formData.get('consent') === 'yes';

  const website = websiteRaw && !/^https?:\/\//i.test(websiteRaw) ? `https://${websiteRaw}` : websiteRaw;

  const fields = {};
  if (!name) fields.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = 'Please enter a valid work email.';
  if (phone && !isValidPhone(phone)) fields.phone = 'Please enter a valid phone number, e.g. (941) 555-0100.';
  if (!practice) fields.practice = 'Please enter your practice or business name.';
  if (website) { try { new URL(website); } catch { fields.website = 'Please enter a valid website address.'; } }
  if (!practiceType) fields.practiceType = 'Please choose your practice type.';
  if (!location) fields.location = 'Please enter your city and state or country.';
  if (!consent) fields.consent = 'Please confirm we may contact you about your application.';
  if (Object.keys(fields).length) return { error: 'Please check the highlighted fields.', fields };

  try {
    await addLead({
      name,
      email,
      source: SOURCES[clip(formData.get('source'), 40)] || 'Work With Us application',
      payload: { phone, business: practiceType, practice, website, location, challenges, challengeNotes, services, budget, message: goals, consent: true },
    });
  } catch (e) {
    console.error('[work-with-us] saving application failed:', e);
    return { error: 'Sorry, your application could not be sent right now. Please email info@codesquad.ai or call +1 (307) 396-4945.' };
  }
  return { ok: true };
}
