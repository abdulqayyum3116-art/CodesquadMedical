import VideoForm from '../../../components/dash/VideoForm';
import { isLive } from '../../../lib/store';

export const dynamic = 'force-dynamic';

export default function VideosPage() {
  const live = isLive();
  return (
    <div className="dash-wrap">
      <div className="dash-head"><h1>Upload video</h1></div>
      {live ? (
        <div className="dash-note">
          The video is saved to Supabase Storage and its public link, with the details below, is sent to the Make.com workflow.
        </div>
      ) : (
        <div className="dash-note dash-note--warn" role="alert">
          Supabase is not configured on this server, so videos can&apos;t be uploaded. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> and restart the app.
        </div>
      )}
      <VideoForm disabled={!live} />
    </div>
  );
}
