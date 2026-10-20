'use client';
import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { savePostAction, uploadImageAction } from '../../app/dashboard/actions';

import { TOPICS as CATS } from '../../lib/postTopics';
// Categories are the Insights topics, so a new post lands in the right filter on /blog automatically.
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/avif';
const MAX_BYTES = 5 * 1024 * 1024;

const ytThumb = (url) => {
  const m = String(url || '').match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : '';
};
const isImageUrl = (u) => /^(https?:\/\/|\/)\S+$/i.test(String(u || '').trim());
const checkFile = (f) => {
  if (!f) return '';
  if (!IMAGE_ACCEPT.split(',').includes(f.type)) return `"${f.name}" is not a supported image. Use JPG, PNG, WebP or AVIF.`;
  if (f.size > MAX_BYTES) return `"${f.name}" is ${(f.size / 1048576).toFixed(1)} MB. The maximum is 5 MB.`;
  return '';
};
const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function SubmitButton({ label }) {
  const { pending } = useFormStatus();
  return <button type="submit" className="dash-btn dash-btn--primary" disabled={pending}>{pending ? 'Saving…' : label}</button>;
}

export default function PostForm({ post = {}, body = '', original = '' }) {
  const [state, formAction] = useFormState(savePostAction, {});
  const formRef = useRef(null);
  const errRef = useRef(null);
  const fileRef = useRef(null);
  const inlineFileRef = useRef(null);
  const contentRef = useRef(null);

  // Cover image
  const [current, setCurrent] = useState(post.img || '');
  const [filePreview, setFilePreview] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [youtube, setYoutube] = useState('');
  const [imgError, setImgError] = useState('');
  const preview = filePreview || (isImageUrl(imgUrl) ? imgUrl.trim() : '') || ytThumb(youtube) || current;
  const source = filePreview ? 'New upload (saved when you click save)' : isImageUrl(imgUrl) ? 'Image URL' : ytThumb(youtube) ? 'YouTube thumbnail' : current ? 'Current image' : '';

  // Inline image upload
  const [inlineBusy, setInlineBusy] = useState(false);
  const [inlineMsg, setInlineMsg] = useState('');

  useEffect(() => { if (state?.error && errRef.current) errRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, [state]);
  useEffect(() => () => { if (filePreview) URL.revokeObjectURL(filePreview); }, [filePreview]);

  function onCoverFile(e) {
    const f = e.target.files?.[0];
    const problem = checkFile(f);
    setImgError(problem);
    if (problem) { e.target.value = ''; setFilePreview(''); return; }
    setFilePreview(f ? URL.createObjectURL(f) : '');
  }
  function removeImage() {
    if (fileRef.current) fileRef.current.value = '';
    setFilePreview(''); setImgUrl(''); setYoutube(''); setCurrent(''); setImgError('');
  }

  async function onInlineFile(e) {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const problem = checkFile(f);
    if (problem) { setInlineMsg(problem); return; }
    const alt = window.prompt('Short description of the image (alt text):', f.name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' '));
    if (alt === null) return;
    const els = formRef.current.elements;
    const fd = new FormData();
    fd.append('file', f);
    fd.append('slug', els.slug.value || els.title.value || 'post');
    setInlineBusy(true); setInlineMsg('Uploading…');
    try {
      const res = await uploadImageAction(fd);
      if (res?.error) { setInlineMsg(res.error); return; }
      const ta = contentRef.current;
      const tag = `\n\n<img src="${escAttr(res.url)}" alt="${escAttr(alt)}" />\n\n`;
      const start = ta.selectionStart ?? ta.value.length;
      ta.setRangeText(tag, start, ta.selectionEnd ?? start, 'end');
      ta.focus();
      setInlineMsg('Image inserted at the cursor.');
    } catch (err) {
      setInlineMsg(`Upload failed: ${err.message || err}`);
    } finally {
      setInlineBusy(false);
    }
  }

  return (
    <form ref={formRef} className="dash-form" action={formAction}>
      {state?.error ? <div ref={errRef} className="dash-note dash-note--err" role="alert"><b>Not saved.</b> {state.error}</div> : null}
      {original ? <input type="hidden" name="original" value={original} /> : null}
      <label>Title</label>
      <input name="title" defaultValue={post.title || ''} placeholder="Post title" required />

      <label>Slug (optional — auto-generated from title)</label>
      <input name="slug" defaultValue={post.slug || ''} placeholder="my-post-url" />

      <div className="dash-form__row">
        <div>
          <label>Category</label>
          <select name="cat" defaultValue={post.cat || CATS[0]}>
            {/* Older posts may use a category from before the redesign: keep it selectable so saving doesn't change it. */}
            {post.cat && !CATS.includes(post.cat) ? <option value={post.cat}>{post.cat} (old category)</option> : null}
            {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label>Date (optional — defaults to today)</label>
          <input name="date" defaultValue={post.date || ''} placeholder="July 8, 2026" />
        </div>
      </div>

      <label>Cover image</label>
      <div className="dash-cover">
        <div className="dash-cover__preview">
          {preview ? <img src={preview} alt="Cover preview" /> : <span>No image</span>}
        </div>
        <div className="dash-cover__opts">
          {source ? <div className="dash-muted">Showing: {source}</div> : null}
          <span className="dash-cover__lbl">Upload from your computer (JPG, PNG, WebP, AVIF · max 5 MB)</span>
          <input ref={fileRef} type="file" name="coverFile" accept={IMAGE_ACCEPT} onChange={onCoverFile} />
          <span className="dash-cover__lbl">…or paste an image URL</span>
          <input name="imgUrl" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} placeholder="https://…/image.jpg" />
          <span className="dash-cover__lbl">…or paste a YouTube link (uses the video thumbnail)</span>
          <input name="youtube" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="https://youtu.be/…" />
          {imgError ? <div className="dash-err">{imgError}</div> : null}
          {preview ? <button type="button" className="dash-del" onClick={removeImage}>Remove image</button> : null}
        </div>
      </div>
      <input type="hidden" name="img" value={current} />

      <label>Excerpt</label>
      <textarea name="excerpt" defaultValue={post.excerpt || ''} rows={3} placeholder="Short summary shown on the blog list." />

      <div className="dash-label-row">
        <label>Content</label>
        <button type="button" className="dash-btn dash-btn--ghost dash-btn--sm" onClick={() => inlineFileRef.current?.click()} disabled={inlineBusy}>
          {inlineBusy ? 'Uploading…' : '+ Insert image'}
        </button>
        <input ref={inlineFileRef} type="file" accept={IMAGE_ACCEPT} onChange={onInlineFile} hidden />
      </div>
      {inlineMsg ? <div className="dash-muted" role="status">{inlineMsg}</div> : null}
      <div className="dash-help">
        <b>How to format your post:</b> just paste your text — no HTML needed.<br />
        • Leave a blank line between paragraphs. • Start a line with <code>#</code>, <code>##</code> or <code>###</code> for headings. • Wrap text in <code>**double asterisks**</code> for bold. • Click <b>Insert image</b> to add a photo at the cursor. <em>(Existing HTML articles are preserved as-is.)</em>
      </div>
      <textarea ref={contentRef} name="content" defaultValue={body} rows={16} placeholder="Paste or type the post text here…" className="dash-mono" />

      <SubmitButton label={original ? 'Save changes' : 'Create post'} />
    </form>
  );
}
