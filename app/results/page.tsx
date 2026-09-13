import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Results | TerraShift',
  description: 'Verified empirical results comparing RGB and multispectral ResNet50 models on EuroSAT held-out test set.',
};

export default function ResultsPage() {
  const figures = [
    { src: '/research/multispectral_accuracy_curve.png', title: 'Multispectral Accuracy Curve', desc: 'Validation accuracy peaked at epoch 3 (87.04%) before plateauing.' },
    { src: '/research/multispectral_loss_curve.png', title: 'Multispectral Loss Curve', desc: 'Training and validation loss progression over 10 training epochs.' },
    { src: '/research/multispectral_confusion_matrix.png', title: 'Multispectral Confusion Matrix', desc: 'Per-class classification confusions across all 10 EuroSAT categories.' },
    { src: '/research/multispectral_gradcam.png', title: 'Multispectral Grad-CAM (Error Analysis)', desc: 'Error analysis artifact: Residential tile misclassified as SeaLake.' },
    { src: '/research/rgb_gradcam.png', title: 'RGB Grad-CAM Activation', desc: 'Spatial attention heatmap for RGB ResNet50 feature activations.' },
  ];

  const perClassMultispectral = [
    { name: 'AnnualCrop', precision: '85.88%', recall: '91.53%', f1: '88.62%', support: '472' },
    { name: 'Forest', precision: '88.10%', recall: '95.48%', f1: '91.64%', support: '442' },
    { name: 'HerbaceousVegetation', precision: '80.04%', recall: '79.69%', f1: '79.87%', support: '458' },
    { name: 'Highway', precision: '83.38%', recall: '76.98%', f1: '80.05%', support: '391' },
    { name: 'Industrial', precision: '88.40%', recall: '84.66%', f1: '86.49%', support: '378' },
    { name: 'Pasture', precision: '85.97%', recall: '79.93%', f1: '82.84%', support: '299' },
    { name: 'PermanentCrop', precision: '77.22%', recall: '73.35%', f1: '75.24%', support: '379' },
    { name: 'Residential', precision: '87.89%', recall: '88.67%', f1: '88.27%', support: '450' },
    { name: 'River', precision: '88.56%', recall: '86.67%', f1: '87.60%', support: '375' },
    { name: 'SeaLake', precision: '92.79%', recall: '98.28%', f1: '95.45%', support: '406' },
  ];

  return (
    <div className="container">
      {/* Results Hero */}
      <section className="page-hero">
        <div className="eyebrow">Empirical Findings / Held-Out Test Evaluation</div>
        <h1>Verified Empirical Research Results</h1>
        <p>
          Metrics and figures transcribed directly from the verified research records in <code>TerraShift_research/results/</code>.
        </p>
      </section>

      {/* Primary Benchmark Comparison Table */}
      <section className="data-card" style={{ padding: '32px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="eyebrow">HELD-OUT TEST SET EVALUATION (4,050 SAMPLES)</span>
            <h2 style={{ fontSize: '26px', margin: '6px 0 0' }}>RGB vs Multispectral Model Comparison</h2>
          </div>
          <div className="mono" style={{ background: 'var(--lime)', padding: '6px 14px', fontSize: '12px', fontWeight: 'bold' }}>
            Current Config Gap: RGB +7.55%
          </div>
        </div>

        <table className="results-table" style={{ marginTop: '24px' }}>
          <thead>
            <tr>
              <th>METRIC</th>
              <th>RGB MODEL (3-BAND)</th>
              <th>MULTISPECTRAL MODEL (13-BAND)</th>
              <th>DIFFERENCE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Test Accuracy</strong></td>
              <td className="highlight">93.48%</td>
              <td>85.93%</td>
              <td style={{ color: 'var(--moss)', fontWeight: 'bold' }}>+7.55% (RGB)</td>
            </tr>
            <tr>
              <td><strong>Weighted Precision</strong></td>
              <td className="highlight">93.47%</td>
              <td>85.82%</td>
              <td>+7.65% (RGB)</td>
            </tr>
            <tr>
              <td><strong>Weighted Recall</strong></td>
              <td className="highlight">93.48%</td>
              <td>85.93%</td>
              <td>+7.55% (RGB)</td>
            </tr>
            <tr>
              <td><strong>Weighted F1-Score</strong></td>
              <td className="highlight">93.46%</td>
              <td>85.81%</td>
              <td>+7.65% (RGB)</td>
            </tr>
            <tr>
              <td><strong>Best Validation Accuracy</strong></td>
              <td className="highlight">94.02% (Epoch 9)</td>
              <td>87.04% (Epoch 3)</td>
              <td>+6.98% (RGB)</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '24px', padding: '16px', background: 'var(--paper)', border: '1px solid var(--line)' }}>
          <span className="mono" style={{ color: 'var(--teal)', fontSize: '11px', display: 'block', marginBottom: '6px' }}>
            EXPERIMENTAL SCOPE SPECIFICATION
          </span>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6' }}>
            The measured 7.55 percentage point accuracy advantage for RGB reflects the <strong>current experimental setup</strong> (where only final linear classification layers were fine-tuned, and the 13-band input convolution was randomly initialized). This result must <em>not</em> be cited as a universal rule that RGB is superior to multispectral imagery in satellite remote sensing.
          </p>
        </div>
      </section>

      {/* Per-Class Multispectral Results Table */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div>
            <div className="eyebrow">Per-Class Breakdown</div>
            <h2 className="section-title">Multispectral Performance by Category</h2>
          </div>
          <p className="section-copy">
            Detailed precision, recall, and F1-score breakdown across all 10 EuroSAT classes (4,050 total test images).
          </p>
        </div>

        <div className="data-card" style={{ padding: '24px' }}>
          <table className="results-table">
            <thead>
              <tr>
                <th>CLASS NAME</th>
                <th>PRECISION</th>
                <th>RECALL</th>
                <th>F1-SCORE</th>
                <th>SUPPORT (SAMPLES)</th>
              </tr>
            </thead>
            <tbody>
              {perClassMultispectral.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.precision}</td>
                  <td>{row.recall}</td>
                  <td>{row.f1}</td>
                  <td>{row.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Figures & Artifacts Grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div>
            <div className="eyebrow">Visual Research Artifacts</div>
            <h2 className="section-title">Training Curves, Confusion Matrix & Grad-CAM</h2>
          </div>
          <p className="section-copy">
            Visualizations generated directly during model training and evaluation runs.
          </p>
        </div>

        <div className="figure-grid">
          {figures.map((fig) => (
            <figure className="figure" key={fig.src}>
              <Image
                src={fig.src}
                alt={fig.title}
                width={1200}
                height={700}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <figcaption>
                <strong style={{ display: 'block', color: 'var(--ink)', marginBottom: '4px' }}>{fig.title}</strong>
                {fig.desc}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Error Analysis Section */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="data-card" style={{ padding: '32px', borderLeft: '4px solid var(--coral)' }}>
          <div className="eyebrow" style={{ color: 'var(--coral)' }}>Model Interpretability & Error Analysis</div>
          <h2 style={{ fontSize: '24px', margin: '8px 0 12px' }}>Error Analysis: Residential → SeaLake Misclassification</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '16px' }}>
            In the multispectral Grad-CAM visualization, a <strong>Residential</strong> sample tile was incorrectly predicted as <strong>SeaLake</strong> by the 13-band model.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', margin: 0 }}>
            <strong>Scientific Framing:</strong> This visualization is presented specifically as an <em>error-analysis artifact</em> demonstrating spatial feature confusion in the 13-band fine-tuning process. It is not presented as a successful classification example. Audit of the activation map indicates that the uncalibrated input scaling caused roof reflectance features to trigger open-water filter channels.
          </p>
        </div>
      </section>
    </div>
  );
}
