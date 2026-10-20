// Phone rule shared by every inquiry form and the server, so the browser and
// the server accept exactly the same numbers: an optional leading +, then
// 7–15 digits (15 is the E.164 maximum) with spaces ( ) . - allowed between them.
// Written for the HTML `pattern` attribute, which browsers compile with the
// `v` flag — that's why the punctuation inside [ ] is escaped.
export const PHONE_PATTERN = String.raw`\+?[ \(\)\.\-]*(?:[0-9][ \(\)\.\-]*){7,15}`;
export const PHONE_MAX_LENGTH = 25;
export const PHONE_HINT = 'Enter a valid phone number, e.g. (941) 555-0100 or +44 20 7946 0958';

// 'u' rather than 'v' so this also loads in older browsers (Safari < 17); the
// pattern means the same under both flags.
const PHONE_RE = new RegExp(`^(?:${PHONE_PATTERN})$`, 'u');

export const isValidPhone = (v) => v.length <= PHONE_MAX_LENGTH && PHONE_RE.test(v);
