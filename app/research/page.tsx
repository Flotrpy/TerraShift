import Link from 'next/link';

export const metadata = {
  title: 'Research | TerraShift',
  description: 'Research questions, Sentinel-2 spectral analysis, EuroSAT dataset specifications, and change detection scope.',
};

export default function ResearchPage() {
  return (
    <div className="container">
      {/* Research Hero */}
      <section className="page-hero">
        <div className="eyebrow">Scientific Research Scope & Questions</div>
        <h1>Classification first.<br />Change analysis with empirical care.</h1>
        <p>
          TerraShift investigates the application of deep learning transfer learning to Sentinel-2 satellite imagery for land-cover classification and potential change detection.
        </p>
      </section>

      {/* Primary & Secondary Research Questions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="data-card" style={{ padding: '28px', borderLeft: '4px solid var(--moss)' }}>
          <span className="mono" style={{ color: 'var(--moss)', fontSize: '11px' }}>PRIMARY RESEARCH QUESTION</span>
          <h2 style={{ fontSize: '20px', margin: '12px 0 10px', lineHeight: '1.4' }}>
            &ldquo;How effectively can transfer learning using Sentinel-2 satellite imagery classify land-cover types, and can these classifications be used to identify potential land-cover changes?&rdquo;
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: '1.6' }}>
            Evaluates whether pre-trained convolutional representations can accurately discriminate among ten heterogeneous land-cover classes and establish reliable baselines for multi-temporal change detection.
          </p>
        </div>

        <div className="data-card" style={{ padding: '28px', borderLeft: '4px solid var(--teal)' }}>
          <span className="mono" style={{ color: 'var(--teal)', fontSize: '11px' }}>SECONDARY RESEARCH QUESTION</span>
          <h2 style={{ fontSize: '20px', margin: '12px 0 10px', lineHeight: '1.4' }}>
            &ldquo;Does multispectral Sentinel-2 imagery improve land-cover classification performance compared with RGB imagery?&rdquo;
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: '1.6' }}>
            Compares 3-channel visual spectrum (RGB) against full 13-band Sentinel-2 multispectral sensors (including Red Edge, NIR, and SWIR channels) under identical training constraints.
          </p>
        </div>
      </div>

      {/* Research Foundations Grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div>
            <div className="eyebrow">Experimental Foundations</div>
            <h2 className="section-title">Core Research Pillars</h2>
          </div>
          <p className="section-copy">
            Essential technical and data components forming the foundation of TerraShift research.
          </p>
        </div>

        <div className="feature-grid">
          <div className="data-card">
            <span className="mono">01 / DATASET</span>
            <h3>EuroSAT Benchmark</h3>
            <p>
              Consists of 27,000 Sentinel-2 image patches across 10 land-cover categories. The experiment uses a split of 18,900 training, 4,050 validation, and 4,050 test images (seed 42).
            </p>
          </div>

          <div className="data-card">
            <span className="mono">02 / SENSORS</span>
            <h3>RGB vs 13-Band Multispectral</h3>
            <p>
              RGB imagery uses 3 visible spectral bands (B4, B3, B2). Multispectral incorporates all 13 Sentinel-2 bands, including coastal aerosol, water vapor, and short-wave infrared channels.
            </p>
          </div>

          <div className="data-card">
            <span className="mono">03 / ARCHITECTURE</span>
            <h3>ResNet50 Transfer Learning</h3>
            <p>
              A 50-layer Residual Network pre-trained on ImageNet. The final classification layer is replaced with a 10-class Softmax layer, fine-tuned using Adam optimizer and CrossEntropyLoss.
            </p>
          </div>

          <div className="data-card">
            <span className="mono">04 / METRICS</span>
            <h3>Held-Out Test Metrics</h3>
            <p>
              Evaluated using overall accuracy, macro-averaged and weighted precision, recall, and F1-score on a strictly isolated 4,050-image test set.
            </p>
          </div>

          <div className="data-card">
            <span className="mono">05 / EXPLAINABILITY</span>
            <h3>Grad-CAM Interpretability</h3>
            <p>
              Gradient-weighted Class Activation Mapping visualizes spatial attention regions in the final convolutional layer to audit true vs misclassified features.
            </p>
          </div>

          <div className="data-card">
            <span className="mono">06 / CHANGE FRAMING</span>
            <h3>Temporal Classification Shifts</h3>
            <p>
              Hypothesizes that land-cover changes can be detected by comparing model classification outputs across satellite images taken at different points in time.
            </p>
          </div>
        </div>
      </section>

      {/* Framing & Scientific Context */}
      <section className="band" style={{ marginBottom: '60px' }}>
        <div className="section container">
          <div className="section-header">
            <div>
              <div className="eyebrow">Critical Research Distinction</div>
              <h2 className="section-title">
                Classification shifts<br />vs ground-truth change.
              </h2>
            </div>
            <p className="section-copy" style={{ color: '#aebfba' }}>
              EuroSAT is a single-timestamp land-cover dataset, not a change detection dataset. Potential land-cover changes inferred from model predictions must be carefully contextualized.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.06)', padding: '28px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <h3 style={{ color: 'var(--lime)', margin: '0 0 12px', fontSize: '18px' }}>
              Framing & Caveats for Change Analysis
            </h3>
            <p style={{ color: '#dce4dd', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px' }}>
              When comparing predictions across satellite images captured in different years, changes in predicted labels reflect <strong>potential land-cover shifts</strong>. They do not constitute automatically verified environmental transitions without independent spatial or ground-truth validation (e.g., ground surveys or higher-resolution orthophotos).
            </p>
            <div className="button-row" style={{ marginTop: '20px' }}>
              <Link className="button" href="/methodology">
                Explore Research Pipeline <span>→</span>
              </Link>
              <Link className="button secondary" href="/results" style={{ color: 'white', borderColor: 'white' }}>
                See Experimental Results <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
