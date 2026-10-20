'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { submitInquiryAction } from '../app/inquiry/actions';
import { PHONE_PATTERN, PHONE_MAX_LENGTH, PHONE_HINT } from '../lib/phone';

const BUSINESS_TYPES = ['Med spa / aesthetics', 'Medical clinic', 'Dental practice', 'Dermatology', 'Plastic surgery', 'Weight-loss clinic', 'Other medical practice'];

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" className="btn btn-dark" disabled={pending}>{pending ? 'Sending…' : 'Book a Consultation →'}</button>;
}

export default function InquiryForm() {
  const [state, formAction] = useFormState(submitInquiryAction, {});
  if (state?.ok) {
    return (
      <div className="lead-form">
        <div className="form-ok" style={{ display: 'block' }}>✓ Thanks — your inquiry is in. We&apos;ll be in touch within one business day.</div>
      </div>
    );
  }
  return (
    <form className="lead-form" action={formAction}>
      <div className="field"><label htmlFor="inq-name">Full name</label><input type="text" id="inq-name" name="name" placeholder="Jane Smith" required maxLength={120} /></div>
      <div className="field"><label htmlFor="inq-email">Email</label><input type="email" id="inq-email" name="email" placeholder="jane@yourcompany.com" required maxLength={200} /></div>
      <div className="field"><label htmlFor="inq-phone">Phone</label><input type="tel" id="inq-phone" name="phone" placeholder="(941) 555-0100" maxLength={PHONE_MAX_LENGTH} autoComplete="tel" inputMode="tel" pattern={PHONE_PATTERN} title={PHONE_HINT} /></div>
      <div className="field"><label htmlFor="inq-business">Business type</label>
        <select id="inq-business" name="business" defaultValue="">
          <option value="" disabled>Select your business type</option>
          {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="field"><label htmlFor="inq-message">What would you like to grow?</label><textarea id="inq-message" name="message" placeholder="Tell us a little about your goals…" maxLength={4000} /></div>
      {/* Honeypot for bots — hidden from people and screen readers */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="inq-website">Website</label><input type="text" id="inq-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {state?.error ? <p className="inq-err" role="alert">{state.error}</p> : null}
      <SubmitButton />
      <p className="form-note">We reply within one business day. No spam, ever.</p>
    </form>
  );
}
