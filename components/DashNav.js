'use client';
import { usePathname } from 'next/navigation';
import { logoutAction } from '../app/dashboard/actions';

const links = [
  { href: '/dashboard', label: 'Posts' },
  { href: '/dashboard/new', label: 'New post' },
  { href: '/dashboard/case-studies', label: 'Case studies' },
  { href: '/dashboard/leads', label: 'Leads' },
  { href: '/dashboard/videos', label: 'Videos' },
];

export default function DashNav() {
  const path = usePathname() || '';
  if (path === '/dashboard/login') return null;
  const active = (href) => (href === '/dashboard' ? path === '/dashboard' : path.startsWith(href));
  return (
    <header className="dash-nav">
      <div className="dash-nav__inner">
        <a className="dash-brand" href="/dashboard">
          <img src="/logo.png" alt="CodeSquad" width="150" height="34" />
          <span>Dashboard</span>
        </a>
        <nav className="dash-links">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={active(l.href) ? 'on' : ''}>{l.label}</a>
          ))}
          <a href="/" target="_blank" rel="noopener" className="dash-view">View site ↗</a>
          <form action={logoutAction}><button type="submit" className="dash-logout">Log out</button></form>
        </nav>
      </div>
    </header>
  );
}
