import Link from 'next/link';

export const metadata = {
  title: 'Model Demo | TerraShift',
  description: 'Technical explanation of ResNet50 transfer learning, RGB satellite classification, and inference API contract.',
};

export default function ModelDemoPage() {
  return (
    <div className="container">
      <section className="page-hero">
        <div className="eyebrow">Model Demo / ResNet50 Architecture</div>
        <h1>ResNet50 Transfer Learning Pipeline</h1>
        <p>
          TerraShift uses a modified ResNet50 convolutional neural network architecture pre-trained on ImageNet, adapted for 10-class EuroSAT satellite land-cover classification.
        </p>
      </section>

      {/* Demo Status Banner */}
      <div className="empty-state" style={{ marginBottom: '40px' }}>
        <div className="empty-symbol">TS</div>
        <div>
          <h2>Model Inference Boundary Specification</h2>
          <p>
            The frontend application maintains a clean interface separation from the backend PyTorch inference service. The endpoint <code>POST /api/predict</code> is reserved for RGB image inference and returns HTTP 501 until the standalone PyTorch container is connected.
          </p>
          <div className="button-row" style={{ marginTop: '16px' }}>
            <Link className="button" href="/upload">
              Open Upload Interface <span>→</span>
            </Link>
            <Link className="button secondary" href="/results">
              View Empirical Results <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div>
            <div className="eyebrow">Architecture Specs</div>
            <h2 className="section-title">Deep learning pipeline.</h2>
          </div>
          <p className="section-copy">
            Detailed breakdown of model selection, transfer learning approach, and classification mechanics.
          </p>
        </div>

        <div className="feature-grid">
          <div className="data-card">
            <span className="mono">01 / BACKBONE</span>
            <h3>ResNet50 Residual Network</h3>
            <p>
              Leverages deep residual connections to prevent vanishing gradients during feature extraction across 50 neural network layers.
            </p>
          </div>

          <div className="data-card">
            <span className="mono">02 / HEAD</span>
            <h3>10-Class Transfer Head</h3>
            <p>
              Replaces original 1000-class ImageNet fully connected layer with a custom 10-output classification head tuned for EuroSAT categories.
            </p>
          </div>

          <div className="data-card">
            <span className="mono">03 / INPUT SENSOR</span>
            <h3>RGB 3-Channel Normalization</h3>
            <p>
              Input images are normalized using ImageNet channel means ([0.485, 0.456, 0.406]) and standard deviations ([0.229, 0.224, 0.225]).
            </p>
          </div>

          <div className="data-card">
            <span className="mono">04 / OUTPUT LOGITS</span>
            <h3>Softmax Probabilities</h3>
            <p>
              Raw output logits pass through a Softmax activation function to yield normalized confidence scores across all 10 land-cover classes.
            </p>
          </div>

          <div className="data-card">
            <span className="mono">05 / EXPLAINABILITY</span>
            <h3>Grad-CAM Activations</h3>
            <p>
              Gradient-weighted Class Activation Mapping calculates feature maps from the final convolutional layer (layer4) to visualize decision regions.
            </p>
          </div>

          <div className="data-card">
            <span className="mono">06 / MULTISPECTRAL VARIANT</span>
            <h3>13-Band Adaptation</h3>
            <p>
              In the multispectral experiment, the first conv layer (conv1) was expanded to accept 13 Sentinel-2 spectral channels.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Diagram */}
      <section className="section">
        <div className="section-header">
          <div>
            <div className="eyebrow">Execution Pipeline</div>
            <h2 className="section-title">End-to-End Prediction Workflow</h2>
          </div>
          <p className="section-copy">
            Step-by-step execution path when processing a satellite tile.
          </p>
        </div>

        <div className="pipeline">
          {[
            { step: '01', name: 'Image Input', desc: 'JPG/PNG Upload' },
            { step: '02', name: 'Client Check', desc: 'Format & Size Validated' },
            { step: '03', name: 'API Dispatch', desc: 'POST /api/predict' },
            { step: '04', name: 'PyTorch Engine', desc: 'ResNet50 Forward Pass' },
            { step: '05', name: 'Softmax Logits', desc: '10 Probabilities' },
            { step: '06', name: 'Grad-CAM', desc: 'Feature Map Extracted' },
            { step: '07', name: 'UI Render', desc: 'Class & Confidence Display' },
          ].map((item) => (
            <div className="pipeline-step" key={item.step}>
              <span>{item.step}</span>
              <strong style={{ fontSize: '13px', marginTop: '14px', display: 'block' }}>{item.name}</strong>
              <span style={{ fontSize: '10px', opacity: 0.8, display: 'block', marginTop: '4px' }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
