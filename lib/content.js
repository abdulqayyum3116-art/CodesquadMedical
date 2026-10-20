import { readFileSync } from 'fs';
import { join } from 'path';

// `<!--#include partials/name-->` pulls in content/partials/name.html, so a section can be
// shared between pages without copy-paste drift.
export function getContent(name) {
  const html = readFileSync(join(process.cwd(), 'content', `${name}.html`), 'utf8');
  return html.replace(/<!--#include ([\w\-/]+)-->/g, (_, inc) => getContent(inc).trimEnd());
}
