import PostForm from '../../../components/dash/PostForm';

export const dynamic = 'force-dynamic';

export default function NewPostPage() {
  return (
    <div className="dash-wrap">
      <div className="dash-head"><h1>New post</h1><a href="/dashboard" className="dash-btn dash-btn--ghost">← Back</a></div>
      <PostForm />
    </div>
  );
}
