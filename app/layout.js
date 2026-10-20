import './globals.css';
import './design-system.css';
import './legacy-theme.css';
import './motion.css';
import './dark.css';
import SiteChrome from '../components/SiteChrome';

// Favicon comes from the file-based convention (app/favicon.ico, app/icon.png,
// app/apple-icon.png) so it's served from a stable, crawlable URL — Google's
// favicon indexing doesn't pick up data: URIs, which this used to be.
export const metadata = {
  metadataBase: new URL('https://www.codesquad.ai'),
  title: 'CodeSquad AI Solutions — Found. Chosen. Booked.',
  description: 'CodeSquad builds one connected growth system — ads, landing pages, CRM, 60-second follow-up, booking, SEO content and reporting — built into your existing stack. No rip-and-replace.'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFBF5' },
    { media: '(prefers-color-scheme: dark)', color: '#14142A' },
  ],
};

// Runs before first paint so the page never flashes the wrong theme:
// a saved choice (components/ThemeToggle.js) wins, otherwise the OS setting.
const THEME_SCRIPT = "(function(){try{var t=localStorage.getItem('cs-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})()";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KSFML7Q3');`
          }}
        />
        {/* End Google Tag Manager */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Caveat:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KSFML7Q3"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
