'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import MobileCta from './MobileCta';
import Scripts from './Scripts';

export default function SiteChrome({ children }) {
  const path = usePathname() || '';
  if (path.startsWith('/dashboard')) return <>{children}</>;
  return (
    <>
      <Header />
      {children}
      <Footer />
      <MobileCta />
      <Scripts />
    </>
  );
}
