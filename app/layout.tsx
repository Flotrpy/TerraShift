import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'TerraShift | Land cover, read clearly',
  description: 'A student research project comparing RGB and multispectral Sentinel-2 land-cover classification.'
};

const navItems = [
  ['Dataset Library', '/dataset-library'],
  ['Try the Model', '/upload'],
  ['Research', '/research'],
  ['Methodology', '/methodology'],
  ['Results', '/results']
] as const;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="TerraShift home">
            <span className="brand-mark">TS</span>
            <span>TerraShift</span>
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            {navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <a className="github-link" href="https://github.com/Flotrpy/TerraShift" target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <span className="footer-mark">TS</span>
          <span>TerraShift / student research project</span>
          <span>Sentinel-2 · EuroSAT · ResNet50</span>
        </footer>
      </body>
    </html>
  );
}