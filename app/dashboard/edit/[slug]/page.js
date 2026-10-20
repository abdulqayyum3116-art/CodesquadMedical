import { notFound } from 'next/navigation';
import PostForm from '../../../../components/dash/PostForm';
import { getPost } from '../../../../lib/store';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }) {
  let post;
  try { post = await getPost(params.slug, { strict: true }); } catch (e) {
    return (
      <div className="dash-wrap">
        <div className="dash-head"><h1>Edit post</h1><a href="/dashboard" className="dash-btn dash-btn--ghost">← Back</a></div>
        <div className="dash-note dash-note--err" role="alert">{e.message}</div>
      </div>
    );
  }
  if (!post) notFound();
  const body = post.body || '';
  return (
    <div className="dash-wrap">
      <div className="dash-head"><h1>Edit post</h1><a href="/dashboard" className="dash-btn dash-btn--ghost">← Back</a></div>
      <PostForm post={post} body={body} original={post.slug} />
    </div>
  );
}
