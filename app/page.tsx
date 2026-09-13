import Link from 'next/link';

const navCards = [
  { title: 'Dataset Library', desc: 'Interactive EuroSAT 10-class dataset manifest & inspection', href: '/dataset-library' },
  { title: 'Try the Model', desc: 'RGB image upload, preview & inference status interface', href: '/upload' },
  { title: 'Model Demo', desc: 'ResNet50 architecture specs and inference pipeline details', href: '/model-demo' },
  { title: 'Research', desc: 'Research questions, Sentinel-2 specs, and change analysis scope', href: '/research' },
  { title: 'Methodology', desc: '8-step research pipeline from EuroSAT to change analysis', href: '/methodology' },
  { title: 'Results', desc: 'Verified empirical metrics, curves, confusion matrix & error analysis', href: '/results' },
] as const;

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-content">
          <div className="eyebrow">Sentinel-2 Earth Observation · Transfer Learning · ResNet50</div>
          <h1 className="display">
            Read the land.<br />
            <em>See the shift.</em>
          </h1>
          <p className="lede">
            TerraShift is a scientific research project evaluating how deep transfer learning on Sentinel-2 satellite imagery can classify land-cover types and detect potential environmental land-cover shifts over time.
          </p>

          <div className="button-row">
            <Link className="button" href="/dataset-library">
              Explore Dataset <span>↗</span>
            </Link>
            <Link className="button secondary" href="/upload">
              Try the Model <span>→</span>
            </Link>
          </div>

          <div className="hero-note">
            <span>01</span> Transparent machine learning research connecting 64x64 satellite pixels to empirical environmental evidence.
          </div>
        </div>
      </section>

      {/* Feature Grid & Research Overview */}
      <section className="section container">
        <div className="section-header">
          <div>
            <div className="eyebrow">Research Overview</div>
            <h2 className="section-title">
              From satellite sensors<br />to land-cover intelligence.
            </h2>
          </div>
          <p className="section-copy">
            TerraShift explores deep learning benchmarks across EuroSAT land-cover categories, comparing RGB and multispectral Sentinel-2 sensor configurations while establishing a baseline for temporal change analysis.
          </p>
        </div>

        <div className="home-grid">
          <div className="feature">
            <span className="feature-number">01 / DATASET</span>
            <h3>EuroSAT Library</h3>
            <p>
              Structured 10-class taxonomy covering 27,000 Sentinel-2 images, with full true-label tracking and sample manifest architecture.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link href="/dataset-library" style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--teal)' }}>
                Browse Taxonomy →
              </Link>
            </div>
          </div>

          <div className="feature">
            <span className="feature-number">02 / INFERENCE</span>
            <h3>Model Inference Boundary</h3>
            <p>
              RGB upload surface designed for real-time predictions with strict status checks and out-of-distribution warnings.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link href="/upload" style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--teal)' }}>
                Upload & Predict →
              </Link>
            </div>
          </div>

          <div className="feature">
            <span className="feature-number">03 / EMPIRICAL RESULTS</span>
            <h3>RGB vs Multispectral</h3>
            <p>
              Rigorously documented benchmark results comparing 3-channel RGB and 13-band Sentinel-2 ResNet50 architectures.
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link href="/results" style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--teal)' }}>
                View Results →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RGB vs Multispectral Overview Section */}
      <section className="band">
        <div className="section container">
          <div className="section-header">
            <div>
              <div className="eyebrow">Experimental Findings Overview</div>
              <h2 className="section-title">
                RGB leads in current<br />experimental setup.
              </h2>
            </div>
            <p className="section-copy" style={{ color: '#aebfba' }}>
              In this specific baseline configuration, RGB transfer learning achieved 93.48% test accuracy versus 85.93% for the 13-band multispectral model—a gap of 7.55 percentage points.
            </p>
          </div>

          <div className="metric-grid">
            <div className="metric">
              <div className="metric-value">93.48%</div>
              <div className="metric-label">RGB Test Accuracy</div>
            </div>
            <div className="metric">
              <div className="metric-value">85.93%</div>
              <div className="metric-label">Multispectral Test Accuracy</div>
            </div>
            <div className="metric">
              <div className="metric-value">+7.55%</div>
              <div className="metric-label">RGB Configuration Gap</div>
            </div>
          </div>

          <div style={{ marginTop: '32px', background: 'rgba(255,255,255,0.05)', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="mono" style={{ color: 'var(--lime)', fontSize: '11px', display: 'block', marginBottom: '6px' }}>
              SCIENTIFIC INTERPRETATION NOTE
            </span>
            <p style={{ margin: 0, fontSize: '13px', color: '#dce4dd', lineHeight: '1.6' }}>
              This performance difference reflects the current baseline configuration where only final classification layers were fine-tuned, and the multispectral 13-band input layer was modified without extensive pre-training. It does <em>not</em> represent a universal superiority of RGB over multispectral satellite data.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation Links */}
      <section className="section container">
        <div className="section-header">
          <div>
            <div className="eyebrow">Explore TerraShift</div>
            <h2 className="section-title">Full Project Navigation</h2>
          </div>
          <p className="section-copy">
            Navigate all core components of the TerraShift research application.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {navCards.map((nav) => (
            <Link key={nav.href} href={nav.href} className="data-card" style={{ display: 'block' }}>
              <span className="mono" style={{ color: 'var(--moss)', fontSize: '11px' }}>PAGE ROUTE</span>
              <h3 style={{ fontSize: '18px', margin: '8px 0 6px' }}>{nav.title} →</h3>
              <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>{nav.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
