'use client';
import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { submitApplicationAction } from '../app/work-with-us/actions';
import { PRACTICE_TYPES, CHALLENGES, SERVICES, BUDGETS } from '../app/work-with-us/options';
import { PHONE_PATTERN, PHONE_MAX_LENGTH, isValidPhone } from '../lib/phone';

const BOOKING_URL = 'https://calendly.com/code_squad/30min';
const ORDER = ['name', 'email', 'phone', 'practice', 'website', 'practiceType', 'location', 'consent'];

// Mirrors the server rules so most mistakes are caught before a round trip.
function validate(form) {
  const v = (n) => String(form.elements[n]?.value || '').trim();
  const e = {};
  if (!v('name')) e.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) e.email = 'Please enter a valid work email.';
  if (v('phone') && !isValidPhone(v('phone'))) e.phone = 'Please enter a valid phone number, e.g. (941) 555-0100.';
  if (!v('practice')) e.practice = 'Please enter your practice or business name.';
  if (v('website')) {
    const w = /^https?:\/\//i.test(v('website')) ? v('website') : `https://${v('website')}`;
    try { if (!new URL(w).hostname.includes('.')) throw new Error(); } catch { e.website = 'Please enter a valid website address.'; }
  }
  if (!v('practiceType')) e.practiceType = 'Please choose your practice type.';
  if (!v('location')) e.location = 'Please enter your city and state or country.';
  if (!form.elements.consent?.checked) e.consent = 'Please confirm we may contact you about your application.';
  return e;
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="ds-btn wu-submit" disabled={pending} aria-disabled={pending}>
      {pending ? <><span className="wu-spinner" aria-hidden="true" />Sending your application…</> : 'Submit application'}
    </button>
  );
}

function Field({ id, label, hint, optional, error, children }) {
  return (
    <div className={error ? 'wu-field has-error' : 'wu-field'}>
      <label className="ds-label" htmlFor={id}>{label}{optional ? <span className="wu-opt"> (optional)</span> : null}</label>
      {hint ? <p className="ds-help wu-hint" id={`${id}-hint`}>{hint}</p> : null}
      {children}
      {error ? <p className="wu-err" id={`${id}-err`}>{error}</p> : null}
    </div>
  );
}

export default function ApplicationForm({ source = '' }) {
  const [state, formAction] = useFormState(submitApplicationAction, {});
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const doneRef = useRef(null);
  const summaryRef = useRef(null);

  // Server-side field errors replace the client ones after each submission.
  useEffect(() => {
    if (state?.fields) setErrors(state.fields);
    if (state?.error) summaryRef.current?.focus();
    if (state?.ok) doneRef.current?.focus();
  }, [state]);

  const focusFirst = (errs) => {
    const first = ORDER.find((k) => errs[k]);
    if (first) formRef.current?.elements[first]?.focus?.();
  };

  const onSubmit = (ev) => {
    const errs = validate(ev.currentTarget);
    if (Object.keys(errs).length) { ev.preventDefault(); setErrors(errs); focusFirst(errs); }
    else setErrors({});
  };

  const clear = (name) => () => setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  const aria = (name, hint) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': [hint ? `${name}-hint` : '', errors[name] ? `${name}-err` : ''].filter(Boolean).join(' ') || undefined,
    onInput: clear(name),
    onChange: clear(name),
  });

  if (state?.ok) {
    return (
      <div className="wu-done" role="status">
        <span className="wu-done-mark" aria-hidden="true">✓</span>
        <h3 className="ds-h2" tabIndex={-1} ref={doneRef}>Thank you, your application is in.</h3>
        <p className="ds-lead">We'll review it and reply by email, usually within one business day. If you'd rather talk sooner, you can book a time now.</p>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-btn">Book a Consultation</a>
      </div>
    );
  }

  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <form ref={formRef} className="wu-form" action={formAction} onSubmit={onSubmit} noValidate aria-describedby="wu-required-note">
      <p id="wu-required-note" className="wu-required">All fields are required unless marked optional.</p>

      {state?.error || hasErrors ? (
        <div className="wu-summary" role="alert" tabIndex={-1} ref={summaryRef}>
          {state?.error && !state?.fields ? state.error : 'Please check the highlighted fields below.'}
        </div>
      ) : null}

      <fieldset className="wu-group">
        <legend className="wu-legend"><span>01</span>About you</legend>
        <div className="wu-row">
          <Field id="name" label="Full name" error={errors.name}>
            <input className="ds-input" id="name" name="name" type="text" autoComplete="name" maxLength={120} required {...aria('name')} />
          </Field>
          <Field id="email" label="Work email" error={errors.email}>
            <input className="ds-input" id="email" name="email" type="email" autoComplete="email" inputMode="email" maxLength={200} required {...aria('email')} />
          </Field>
        </div>
        <Field id="phone" label="Phone number" optional hint="Only if you'd like us to call you." error={errors.phone}>
          <input className="ds-input" id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={PHONE_MAX_LENGTH} pattern={PHONE_PATTERN} {...aria('phone', true)} />
        </Field>
      </fieldset>

      <fieldset className="wu-group">
        <legend className="wu-legend"><span>02</span>Your practice</legend>
        <div className="wu-row">
          <Field id="practice" label="Practice or business name" error={errors.practice}>
            <input className="ds-input" id="practice" name="practice" type="text" autoComplete="organization" maxLength={120} required {...aria('practice')} />
          </Field>
          <Field id="website" label="Website" optional error={errors.website}>
            <input className="ds-input" id="website" name="website" type="url" inputMode="url" autoComplete="url" placeholder="yourpractice.com" maxLength={300} {...aria('website')} />
          </Field>
        </div>
        <div className="wu-row">
          <Field id="practiceType" label="Practice type" error={errors.practiceType}>
            <select className="ds-select" id="practiceType" name="practiceType" defaultValue="" required {...aria('practiceType')}>
              <option value="" disabled>Select one</option>
              {PRACTICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field id="location" label="Location" hint="City and state, or country." error={errors.location}>
            <input className="ds-input" id="location" name="location" type="text" autoComplete="address-level2" maxLength={120} required {...aria('location', true)} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="wu-group">
        <legend className="wu-legend"><span>03</span>Where you are now</legend>
        <fieldset className="wu-checks">
          <legend className="ds-label">Current marketing challenges <span className="wu-opt">(optional, choose any)</span></legend>
          <div className="wu-check-grid">
            {CHALLENGES.map((c, i) => (
              <label className="wu-check" key={c}><input type="checkbox" name="challenges" value={c} id={`ch-${i}`} /><span>{c}</span></label>
            ))}
          </div>
        </fieldset>
        <Field id="challengeNotes" label="Anything else about your current marketing?" optional>
          <textarea className="ds-textarea" id="challengeNotes" name="challengeNotes" rows={3} maxLength={2000} />
        </Field>
        <fieldset className="wu-checks">
          <legend className="ds-label">Services you're interested in <span className="wu-opt">(optional, choose any)</span></legend>
          <div className="wu-check-grid">
            {SERVICES.map((s, i) => (
              <label className="wu-check" key={s}><input type="checkbox" name="services" value={s} id={`sv-${i}`} /><span>{s}</span></label>
            ))}
          </div>
        </fieldset>
        <Field id="budget" label="Monthly marketing budget" optional hint="Including ad spend. A rough range is fine.">
          <select className="ds-select" id="budget" name="budget" defaultValue="" aria-describedby="budget-hint">
            <option value="">Prefer not to say</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        <Field id="goals" label="Main goals, or anything else we should know" optional hint="Please don't include any patient information.">
          <textarea className="ds-textarea" id="goals" name="goals" rows={5} maxLength={4000} aria-describedby="goals-hint" />
        </Field>
      </fieldset>

      {source ? <input type="hidden" name="source" value={source} /> : null}
      {/* Honeypot for bots: hidden from people and screen readers */}
      <div className="wu-hp" aria-hidden="true">
        <label htmlFor="company_url">Company URL</label><input type="text" id="company_url" name="company_url" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={errors.consent ? 'wu-consent has-error' : 'wu-consent'}>
        <label className="wu-check wu-check--consent">
          <input type="checkbox" name="consent" value="yes" required {...aria('consent')} />
          <span>I agree that CodeSquad AI Solutions may contact me by email or phone about this application. My details will only be used to respond to this enquiry.</span>
        </label>
        {errors.consent ? <p className="wu-err" id="consent-err">{errors.consent}</p> : null}
      </div>

      <div className="wu-actions">
        <Submit />
        <p className="wu-alt">Prefer to talk first? <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a consultation</a></p>
      </div>
    </form>
  );
}
