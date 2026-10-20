import { notFound } from 'next/navigation';
import { getPosts, getPost } from '../../../lib/store';
import { topicOf, readingTime } from '../../../lib/postTopics';
import '../insights.css';

export const revalidate = 30;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const p = await getPost(params.slug);
  if (!p) return { title: 'Article | CodeSquad AI Solutions' };
  return { title: `${p.title} | CodeSquad AI Solutions`, description: p.excerpt };
}

const BOOKING_URL = 'https://calendly.com/code_squad/30min';
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Older articles have the title/category/date baked into their header HTML. Show the
// current values from the dashboard there, without changing the stored body.
function syncHeader(html, post) {
  return html.replace(/<header class="cs-single__header">[\s\S]*?<\/header>/, (hdr) => {
    if (post.title) hdr = hdr.replace(/(<h1[^>]*>)[\s\S]*?(<\/h1>)/, (_, a, b) => a + esc(post.title) + b);
    if (post.cat) hdr = hdr.replace(/(<span class="cs-post__cat">)[\s\S]*?(<\/span>)/, (_, a, b) => a + esc(post.cat) + b);
    if (post.date) hdr = hdr.replace(/(<span class="cs-post__date">)[\s\S]*?(<\/span>)/, (_, a, b) => a + esc(post.date) + b);
    return hdr;
  });
}

// Plain bodies often open with their own <h1> (the title), sometimes after a short kicker.
// The page renders the title itself, so drop an h1 near the top and demote any other h1
// to h2, keeping a single h1 on the page without losing content.
function stripLeadingH1(html) {
  const m = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/);
  let out = m && m.index < 600 ? html.slice(0, m.index) + html.slice(m.index + m[0].length) : html;
  return out.replace(/<h1(\s[^>]*)?>/g, '<h2$1>').replace(/<\/h1>/g, '</h2>');
}

function About({ post }) {
  const { service } = topicOf(post);
  return (
      <aside className="bl-about" aria-label="About the publisher">
        <img src="/founder.jpeg" alt="" width="72" height="72" />
        <div>
          <p className="bl-about-k">About CodeSquad AI Solutions</p>
          <p>We help medical clinics, med spas, dental practices and plastic surgeons get found, chosen and booked. Founded by <a href="/founder">Dr. Shahzaib Hamid</a>, PhD in Applied AI.</p>
          {service ? <p className="bl-about-svc">Related service: <a href={`/services/${service.slug}`}>{service.name} →</a></p> : null}
        </div>
      </aside>
  );
}

function After({ related }) {
  return (
    <>
      {related.length ? (
        <section className="ds-section bl-related" aria-labelledby="bl-rel-t">
          <div className="ds-container ds-container--wide">
            <div className="bl-list-head"><h2 id="bl-rel-t" className="ds-h2">Keep reading</h2><a href="/blog" className="ds-btn--text">All articles →</a></div>
            <div className="bl-grid">
              {related.map((p) => (
                <a className="bl-card" href={`/blog/${p.slug}`} key={p.slug}>
                  <figure className="ds-frame bl-card-img">{p.img ? <img src={p.img} alt="" loading="lazy" /> : <span className="bl-thumb-ph" aria-hidden="true">{topicOf(p).topic}</span>}</figure>
                  <p className="bl-kicker"><span>{topicOf(p).topic}</span><span aria-hidden="true">·</span><span>{p.date}</span></p>
                  <h3 className="bl-card-t">{p.title}</h3>
                  <span className="ds-btn--text">Read article →</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="ds-section bl-final" aria-labelledby="bl-final-t">
        <div className="ds-container">
          <div className="bl-final-card">
            <span className="ds-curve" aria-hidden="true" />
            <p className="bl-tagline"><span>Found.</span> <span>Chosen.</span> <span>Booked.</span></p>
            <h2 id="bl-final-t" className="ds-h2">Want help putting this into practice?</h2>
            <p className="ds-lead">A free 30-minute consultation. We'll look at what you have today and what we'd fix first.</p>
            <div className="bl-cta">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-btn">Book a Consultation</a>
              <a href="/work-with-us" className="ds-btn--secondary">Apply to work with us</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function Page({ params }) {
  const post = await getPost(params.slug);
  const raw = post?.body || '';
  if (!raw) notFound();

  // Related: same topic first, then the newest others.
  const { topic } = topicOf(post);
  const others = (await getPosts()).filter((p) => p.slug !== post.slug);
  const related = [...others.filter((p) => topicOf(p).topic === topic), ...others.filter((p) => topicOf(p).topic !== topic)].slice(0, 3);

  // Older articles store their full layout (<article class="cs-single">…); keep rendering those as-is.
  if (/class="cs-single"/.test(raw)) {
    return (
      <main id="top" className="cs-body cs-reader">
        <div className="wrap cs-reader-top"><a href="/blog" className="cs-back-link">← All articles</a></div>
        <div dangerouslySetInnerHTML={{ __html: syncHeader(raw, post) }} />
        <div className="bl-narrow"><About post={post} /></div>
        <After related={related} />
      </main>
    );
  }

  const html = stripLeadingH1(raw);
  return (
    <main id="top">
      <article className="bl-article">
        <header className="bl-article-head">
          <div className="bl-narrow">
            <nav className="bl-crumbs" aria-label="Breadcrumb"><a href="/blog">Insights</a><span aria-hidden="true">/</span><span>{topic}</span></nav>
            <h1 className="ds-h1 bl-article-t">{post.title}</h1>
            {post.excerpt ? <p className="ds-lead bl-article-lead">{post.excerpt}</p> : null}
            <p className="bl-meta"><span>{post.date}</span><span aria-hidden="true">·</span><span>{readingTime(raw)} min read</span></p>
          </div>
          {post.img ? <figure className="ds-frame bl-article-img"><img src={post.img} alt="" /></figure> : null}
        </header>
        <div className="bl-narrow bl-prose" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="bl-narrow"><About post={post} /></div>
      </article>
      <After related={related} />
    </main>
  );
}
