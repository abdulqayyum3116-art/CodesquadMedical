import InquiryForm from '../../components/InquiryForm';

export const metadata = {
  title: 'Send an Inquiry | CodeSquad',
  description: 'Tell us about your business and goals. CodeSquad replies within one business day with a free consultation call.'
};

export default function InquiryPage() {
  return (
    <main id="top">
      <section className="sec dark inq-sec" id="contact">
        <div className="wrap contact-grid">
          <div>
            <span className="eyebrow">Get Started</span>
            <h1 className="display">Let&apos;s grow your business.</h1>
            <p className="lead">Book a free consultation call. We&apos;ll map your funnel, show you a live dashboard, and tell you honestly whether we&apos;re the right fit.</p>
            <div className="inq-photo">
              <img src="/founder.jpeg" alt="Shahzaib Hamid, Founder and CEO of CodeSquad AI Solutions" loading="eager" />
            </div>
            <ul className="contact-pts">
              <li><span className="ci">✓</span><span><strong>No rip-and-replace</strong>We connect to the tools you already use.</span></li>
              <li><span className="ci">✓</span><span><strong>See real work</strong>Actual dashboards, ads and content — not slides.</span></li>
              <li><span className="ci">✓</span><span><strong>Honest fit check</strong>If we&apos;re not right for you, we&apos;ll say so.</span></li>
            </ul>
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 8, color: '#CFCDC4', fontSize: 15 }}>
              <span>Prefer to talk now? <a href="tel:+13073964945" style={{ color: 'var(--accent)', fontWeight: 700 }}>+1 (307) 396-4945</a></span>
              <span>Email <a href="mailto:info@codesquad.ai" style={{ color: 'var(--accent)', fontWeight: 700 }}>info@codesquad.ai</a> · or <a href="https://calendly.com/code_squad/30min" target="_blank" rel="noopener" style={{ color: 'var(--accent)', fontWeight: 700 }}>book on Calendly →</a></span>
            </div>
          </div>
          <InquiryForm />
        </div>
      </section>
    </main>
  );
}
