import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="footer-mark">TS</span>
        <span>TerraShift / Student Research Project</span>
      </div>
      <div>Sentinel-2 · EuroSAT · ResNet50 Transfer Learning</div>
      <div>
        <a
          href="https://github.com/Flotrpy/TerraShift"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'underline' }}
        >
          GitHub Repository ↗
        </a>
      </div>
    </footer>
  );
}
