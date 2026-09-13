'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dataset Library', href: '/dataset-library' },
  { label: 'Try the Model', href: '/upload' },
  { label: 'Model Demo', href: '/model-demo' },
  { label: 'Research', href: '/research' },
  { label: 'Methodology', href: '/methodology' },
  { label: 'Results', href: '/results' },
] as const;

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="TerraShift home">
        <span className="brand-mark">TS</span>
        <span>TerraShift</span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={isActive ? 'active-nav-link' : undefined}
              style={isActive ? { color: 'var(--moss)', fontWeight: 800 } : undefined}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <a
        className="github-link"
        href="https://github.com/Flotrpy/TerraShift"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub Repository (opens in new tab)"
      >
        GitHub <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
