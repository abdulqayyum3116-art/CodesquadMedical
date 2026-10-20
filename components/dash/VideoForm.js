'use client';
import { useEffect, useRef, useState } from 'react';
import { createVideoUploadAction, sendVideoToWebhookAction } from '../../app/dashboard/actions';

const VIDEO_ACCEPT = 'video/mp4,video/quicktime,video/webm,video/x-m4v,.mp4,.mov,.webm,.m4v';
const EXT_TYPES = { mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', m4v: 'video/x-m4v' };
const TYPES = Object.values(EXT_TYPES);
const MAX_BYTES = 500 * 1024 * 1024; // keep in sync with MAX_VIDEO_BYTES in lib/store.js
const DESTINATIONS = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
];
const TONES = ['energetic', 'professional', 'friendly', 'inspirational', 'humorous'];

// Some browsers/OSes leave file.type empty (e.g. .mov on Windows), so fall back to the extension.
const videoType = (f) => (TYPES.includes(f?.type) ? f.type : EXT_TYPES[String(f?.name || '').split('.').pop().toLowerCase()] || f?.type || '');
const fmtMB = (b) => `${(b / 1048576).toFixed(1)} MB`;
const checkFile = (f) => {
  if (!f) return 'Choose a video to upload.';
  if (!TYPES.includes(videoType(f))) return `"${f.name}" is not a supported video. Use MP4, MOV, WebM or M4V.`;
  if (f.size > MAX_BYTES) return `"${f.name}" is ${fmtMB(f.size)}. The maximum is ${MAX_BYTES / 1048576} MB.`;
  return '';
};

// XHR (not fetch) so we get upload progress events.
function putWithProgress(url, file, type, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', type);
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.setRequestHeader('cache-control', 'max-age=31536000');
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let msg = xhr.responseText;
      try { const j = JSON.parse(xhr.responseText); msg = j.message || j.error || msg; } catch (e) { /* not JSON */ }
      if (xhr.status === 413 || /maximum allowed size|too large/i.test(msg)) msg = `${msg} — raise the upload file size limit in Supabase → Storage → Settings.`;
      reject(new Error(`Supabase rejected the upload (${xhr.status}): ${String(msg).slice(0, 300)}`));
    };
    xhr.onerror = () => reject(new Error('Network error while uploading. Check your connection and try again.'));
    xhr.onabort = () => reject(new Error('Upload cancelled.'));
    xhr.send(file);
  });
}

export default function VideoForm({ disabled = false }) {
  const formRef = useRef(null);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [fileError, setFileError] = useState('');
  const [dest, setDest] = useState([]);
  const [phase, setPhase] = useState('idle'); // idle | uploading | sending | done | error
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { publicUrl }
  const [retry, setRetry] = useState(null); // payload for "Retry webhook"
  const [copied, setCopied] = useState(false);
  const busy = phase === 'uploading' || phase === 'sending';

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => {
    if (!busy) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [busy]);

  function onFile(e) {
    const f = e.target.files?.[0] || null;
    const problem = f ? checkFile(f) : '';
    setFileError(problem);
    if (problem || !f) { e.target.value = ''; setFile(null); setPreview(''); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  const toggleDest = (v) => setDest((d) => (d.includes(v) ? d.filter((x) => x !== v) : [...d, v]));

  async function send(payload) {
    setPhase('sending'); setError('');
    const res = await sendVideoToWebhookAction(payload);
    if (res?.ok) {
      setResult({ publicUrl: res.publicUrl }); setRetry(null); setPhase('done');
      formRef.current?.reset(); setDest([]); setFile(null); setPreview(''); setProgress(0);
      return;
    }
    setError(res?.error || 'Sending to Make.com failed.');
    setRetry(res?.canRetry ? payload : null);
    if (res?.publicUrl) setResult({ publicUrl: res.publicUrl });
    setPhase('error');
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;
    setError(''); setResult(null); setRetry(null); setCopied(false);
    const els = formRef.current.elements;
    const tone = els.tone?.value?.trim() || '';
    const problem = checkFile(file)
      || (!dest.length && 'Choose at least one destination.')
      || (!tone && 'Please enter a tone.');
    if (problem) { setError(problem); setPhase('error'); return; }

    try {
      const type = videoType(file);
      setPhase('uploading'); setProgress(0);
      const up = await createVideoUploadAction({ name: file.name, type, size: file.size });
      if (up?.error) throw new Error(up.error);
      await putWithProgress(up.signedUrl, file, type, setProgress);
      setProgress(100);
      await send({ path: up.path, destinations: dest, tone });
    } catch (err) {
      setError(err.message || String(err));
      setPhase('error');
    }
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(result.publicUrl); setCopied(true); } catch (e) { setCopied(false); }
  }

  return (
    <form ref={formRef} className="dash-form" onSubmit={onSubmit} noValidate>
      {phase === 'done' && result ? (
        <div className="dash-note dash-note--ok" role="status">
          <b>✓ Sent to Make.com.</b> The video is saved in Supabase:{' '}
          <a href={result.publicUrl} target="_blank" rel="noopener">{result.publicUrl}</a>{' '}
          <button type="button" className="dash-btn dash-btn--ghost dash-btn--sm" onClick={copyLink}>{copied ? 'Copied ✓' : 'Copy link'}</button>
        </div>
      ) : null}
      {phase === 'error' && error ? (
        <div className="dash-note dash-note--err" role="alert">
          {error}
          {result?.publicUrl ? <div className="dash-video-link">Video link: <a href={result.publicUrl} target="_blank" rel="noopener">{result.publicUrl}</a></div> : null}
          {retry ? (
            <div><button type="button" className="dash-btn dash-btn--ghost dash-btn--sm dash-retry" onClick={() => send(retry)}>Retry webhook</button></div>
          ) : null}
        </div>
      ) : null}

      <fieldset className="dash-fieldset" disabled={busy || disabled}>
        <label htmlFor="vf-file">Video (MP4, MOV, WebM, M4V · max {MAX_BYTES / 1048576} MB)</label>
        <input id="vf-file" ref={fileRef} type="file" name="video" accept={VIDEO_ACCEPT} onChange={onFile} />
        {fileError ? <div className="dash-err">{fileError}</div> : null}
        {preview ? (
          <div className="dash-video-preview">
            <video src={preview} controls muted playsInline preload="metadata" />
            <div className="dash-muted">{file?.name} · {fmtMB(file?.size || 0)}</div>
          </div>
        ) : null}

        <label>Destinations</label>
        <div className="dash-checks">
          {DESTINATIONS.map((d) => (
            <label key={d.value} className="dash-check">
              <input type="checkbox" name="destinations" value={d.value} checked={dest.includes(d.value)} onChange={() => toggleDest(d.value)} />
              {d.label}
            </label>
          ))}
        </div>

        <label htmlFor="vf-tone">Tone</label>
        <input id="vf-tone" name="tone" list="vf-tones" placeholder="energetic" maxLength={500} />
        <datalist id="vf-tones">{TONES.map((t) => <option key={t} value={t} />)}</datalist>
      </fieldset>

      {busy ? (
        <div className="dash-progress" role="status" aria-live="polite">
          <div className="dash-progress__bar"><span style={{ width: `${phase === 'sending' ? 100 : progress}%` }} /></div>
          <div className="dash-muted">{phase === 'uploading' ? `Uploading to Supabase… ${progress}%` : 'Sending to Make.com…'}</div>
        </div>
      ) : null}

      <button type="submit" className="dash-btn dash-btn--primary" disabled={busy || disabled}>
        {phase === 'uploading' ? `Uploading… ${progress}%` : phase === 'sending' ? 'Sending…' : 'Upload & send to Make.com'}
      </button>
    </form>
  );
}
