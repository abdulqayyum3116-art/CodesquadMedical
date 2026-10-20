import { getPosts, isLive, bundledPostSlugs } from '../../lib/store';
import { deletePostAction, importOriginalsAction } from './actions';
import StoreStatus from '../../components/dash/StoreStatus';

export const dynamic = 'force-dynamic';

export default async function PostsPage({ searchParams }) {
  let posts = [];
  let loadError = '';
  try { posts = await getPosts({ strict: true }); } catch (e) { loadError = e.message; }
  const flash = {
    error: searchParams?.error,
    ok: searchParams?.imported ? `✓ Import finished — Supabase now has ${String(searchParams.imported).replace('-', ' posts and ')} case studies.` : searchParams?.saved ? `✓ Saved “${searchParams.saved}”. It is live on /blog now.` : searchParams?.deleted ? `✓ Deleted “${searchParams.deleted}”.` : '',
  };
  const missing = isLive() && !loadError ? bundledPostSlugs().filter((s) => !posts.some((p) => p.slug === s)).length : 0;
  return (
    <div className="dash-wrap">
      <div className="dash-head">
        <h1>Blog posts</h1>
        <a href="/dashboard/new" className="dash-btn dash-btn--primary">+ New post</a>
      </div>
      <StoreStatus loadError={loadError} flash={flash} />
      {missing ? (
        <form action={importOriginalsAction} className="dash-note dash-note--warn dash-import">
          <span>{missing} of the site&apos;s original posts are not in Supabase yet, so they are missing from /blog.</span>
          <button type="submit" className="dash-btn dash-btn--primary dash-btn--sm">Import original posts</button>
        </form>
      ) : null}
      <div className="dash-table">
        <div className="dash-tr dash-tr--head"><span>Title</span><span>Category</span><span>Date</span><span>Actions</span></div>
        {posts.map((p) => (
          <div className="dash-tr" key={p.slug}>
            <span className="dash-td--title">{p.title}</span>
            <span><span className="dash-pill">{p.cat}</span></span>
            <span className="dash-muted">{p.date}</span>
            <span className="dash-actions">
              <a href={`/dashboard/edit/${p.slug}`}>Edit</a>
              <a href={`/blog/${p.slug}`} target="_blank" rel="noopener">View</a>
              <form action={deletePostAction}><input type="hidden" name="slug" value={p.slug} /><button type="submit" className="dash-del">Delete</button></form>
            </span>
          </div>
        ))}
        {posts.length === 0 && !loadError ? <div className="dash-empty">No posts yet.</div> : null}
      </div>
    </div>
  );
}
