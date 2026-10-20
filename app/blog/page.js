import { getPosts } from '../../lib/store';
import { topicOf, topicsInUse } from '../../lib/postTopics';
import './insights.css';
export const revalidate = 30;
export const metadata = {
  title: 'Insights — Medical SEO, AEO & GEO, Patient Follow-up | MedGrow AI Solutions',
  description: 'Articles for medical practices on SEO, AEO & GEO, paid ads and patient follow-up.'
};

const BOOKING_URL = 'https://calendly.com/code_squad/30min';

function Thumb({ post, className }) {
  return (
    <figure className={`ds-frame ${className}`}>
      {post.img ? <img src={post.img} alt="" loading="lazy" /> : <span className="bl-thumb-ph" aria-hidden="true">{topicOf(post).topic}</span>}
    </figure>
  );
}

export default async function Page() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;
  const topics = topicsInUse(posts);
  return (
    <main id="top">
      <section className="bl-hero" aria-labelledby="bl-title">
        <div className="ds-container ds-container--wide">
          <span className="ds-eyebrow">Insights</span>
          <h1 id="bl-title" className="ds-h1 bl-title">Notes on getting patients found, chosen &amp; <span className="ds-underline">booked</span>.</h1>
          <p className="ds-lead">Practical articles for medical practices on SEO, AEO &amp; GEO, advertising and patient follow-up.</p>
        </div>
      </section>

      {featured ? (
        <section className="bl-featured-wrap" aria-label="Featured article">
          <div className="ds-container ds-container--wide">
            <a className="bl-featured" href={`/blog/${featured.slug}`}>
              <Thumb post={featured} className="bl-featured-img" />
              <div className="bl-featured-body">
                <p className="bl-kicker"><span className="bl-badge">Latest</span><span>{topicOf(featured).topic}</span><span aria-hidden="true">·</span><span>{featured.date}</span></p>
                <h2 className="ds-h2 bl-featured-t">{featured.title}</h2>
                <p className="bl-ex">{featured.excerpt}</p>
                <span className="ds-btn--text">Read the article →</span>
              </div>
            </a>
          </div>
        </section>
      ) : null}

      <section className="ds-section bl-list" aria-labelledby="bl-all-t">
        <div className="ds-container ds-container--wide">
          <div className="bl-list-head">
            <h2 id="bl-all-t" className="ds-h3">All articles</h2>
            {topics.length > 1 ? (
              <div className="bl-filter" id="blFilter" role="group" aria-label="Filter articles by topic">
                <button type="button" className="bl-chip" data-topic="All" aria-pressed="true">All</button>
                {topics.map((t) => <button key={t} type="button" className="bl-chip" data-topic={t} aria-pressed="false">{t}</button>)}
              </div>
            ) : null}
          </div>
          <p className="bl-count" id="blCount" aria-live="polite">{rest.length} more {rest.length === 1 ? 'article' : 'articles'}</p>
          <div className="bl-grid" id="blGrid">
            {rest.map((p) => (
              <a className="bl-card" href={`/blog/${p.slug}`} key={p.slug} data-topic={topicOf(p).topic}>
                <Thumb post={p} className="bl-card-img" />
                <p className="bl-kicker"><span>{topicOf(p).topic}</span><span aria-hidden="true">·</span><span>{p.date}</span></p>
                <h3 className="bl-card-t">{p.title}</h3>
                <p className="bl-ex">{p.excerpt}</p>
                <span className="ds-btn--text">Read article →</span>
              </a>
            ))}
          </div>
          <p className="bl-empty" id="blEmpty" hidden>The only article on this topic so far is the featured one above.</p>
        </div>
      </section>

      <section className="ds-section bl-final" aria-labelledby="bl-final-t">
        <div className="ds-container">
          <div className="bl-final-card">
            <span className="ds-curve" aria-hidden="true" />
            <p className="bl-tagline"><span>Found.</span> <span>Chosen.</span> <span>Booked.</span></p>
            <h2 id="bl-final-t" className="ds-h2">Want this done for your practice?</h2>
            <p className="ds-lead">A free 30-minute consultation. We'll look at how patients find you and what we'd fix first.</p>
            <div className="bl-cta">
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="ds-btn">Book a Consultation</a>
              <a href="/services" className="ds-btn--secondary">Explore our services</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
