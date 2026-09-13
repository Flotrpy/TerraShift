import Link from 'next/link';

export const metadata = {
  title: 'Methodology | TerraShift',
  description: 'Visually clear 8-step research pipeline from EuroSAT preprocessing to RGB vs multispectral comparison and potential change analysis.',
};

export default function MethodologyPage() {
  const steps = [
    { num: '01', title: 'EuroSAT Dataset', detail: '27,000 Sentinel-2 images across 10 classes' },
    { num: '02', title: 'Preprocessing', detail: 'Resize 64x64 px, normalization, tensor mapping' },
    { num: '03', title: 'Train / Val / Test Split', detail: '18,900 train, 4,050 val, 4,050 test (Seed 42)' },
    { num: '04', title: 'ResNet50 Transfer Learning', detail: 'ImageNet backbone, fine-tuned classification head' },
    { num: '05', title: 'Classification', detail: 'Softmax 10-class probability distribution' },
    { num: '06', title: 'Evaluation', detail: 'Precision, recall, F1-score & accuracy calculation' },
    { num: '07', title: 'RGB vs Multispectral Comparison', detail: 'Performance benchmark across spectral channels' },
    { num: '08', title: 'Potential Change Analysis', detail: 'Multi-temporal prediction comparison framing' },
  ];

  return (
    <div className="container">
      <section className="page-hero">
        <div className="eyebrow">Methodology / Research Pipeline</div>
        <h1>From raw satellite pixels to empirical evidence.</h1>
        <p>
          The TerraShift methodology establishes a rigorous, reproducible pipeline for land-cover classification and sensor comparison.
        </p>
      </section>

      {/* Visual Pipeline Diagram */}
      <section style={{ marginBottom: '60px' }}>
        <div className="section-header">
          <div>
            <div className="eyebrow">8-Stage Execution Pipeline</div>
            <h2 className="section-title">Research Pipeline Flow</h2>
          </div>
          <p className="section-copy">
            Hover or inspect each sequential stage of the experimental workflow.
          </p>
        </div>

        <div className="pipeline">
          {steps.map((step) => (
            <div className="pipeline-step" key={step.num}>
              <span>{step.num}</span>
              <strong style={{ fontSize: '13px', marginTop: '12px', display: 'block' }}>{step.title}</strong>
              <span style={{ fontSize: '10px', opacity: 0.85, display: 'block', marginTop: '6px' }}>{step.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Methodology Steps Breakdown */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div>
            <div className="eyebrow">Methodology Details</div>
            <h2 className="section-title">Experimental Configuration</h2>
          </div>
          <p className="section-copy">
            Specific hyperparameter choices, split methodology, and architectural adjustments.
          </p>
        </div>

        <div className="feature-grid">
          <div className="data-card">
            <span className="mono">STEP 01 - 03</span>
            <h3>Data Partitioning & Hygiene</h3>
            <p>
              The 27,000 EuroSAT images were split 70/15/15 into 18,900 training, 4,050 validation, and 4,050 test samples. Seed 42 was fixed to ensure deterministic data splits.
            </p>
          </div>

          <div className="data-card">
            <span className="mono">STEP 04 - 05</span>
            <h3>Model Training Strategy</h3>
            <p>
              Trained for 10 epochs using Adam optimizer (learning rate 0.001) and CrossEntropyLoss. Pre-trained weights were frozen, training only the linear classification head.
            </p>
          </div>

          <div className="data-card">
            <span className="mono">STEP 06 - 07</span>
            <h3>Multispectral Adaptation</h3>
            <p>
              For the 13-band Sentinel-2 model, the first convolutional layer was modified to accept 13 channels with simple input scaling.
            </p>
          </div>

          <div className="data-card">
            <span className="mono">STEP 08</span>
            <h3>Change Analysis Protocol</h3>
            <p>
              Land-cover shift detection applies the trained classifier to Sentinel-2 imagery of identical geographic coordinates acquired at different temporal checkpoints.
            </p>
          </div>
        </div>
      </section>

      {/* CTA to Results */}
      <section className="note-box" style={{ marginBottom: '60px' }}>
        <div className="eyebrow">Methodology Implemented</div>
        <h2>Ready to review the empirical findings?</h2>
        <p style={{ marginBottom: '20px' }}>
          Explore full performance metrics, training curves, confusion matrices, and Grad-CAM visualizations.
        </p>
        <Link className="button" href="/results">
          View Research Results <span>→</span>
        </Link>
      </section>
    </div>
  );
}
