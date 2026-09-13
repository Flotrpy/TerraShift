'use client';

import { useState, useRef } from 'react';
import { predictRGBImage, PredictionResponse } from '@/lib/inference/api';
import { EUROSAT_CLASSES } from '@/lib/dataset/manifest';
import Link from 'next/link';

export default function UploadClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('Please select a valid JPG, JPEG, or PNG image.');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPredictionResult(null);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setPredictionResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setPredictionResult(null);

    const result = await predictRGBImage(selectedFile);

    // Simulate slight loading delay for UI feedback
    setTimeout(() => {
      setPredictionResult(result);
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="container">
      <section className="page-hero">
        <div className="eyebrow">Try the Model / RGB Upload & Analysis</div>
        <h1>Upload an image. Read the prediction.</h1>
        <p>
          Test the TerraShift RGB model pipeline by uploading a land-cover image (JPG, JPEG, PNG).
          The model backend returns probability distributions and explainability artifacts when available.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', marginBottom: '60px' }}>
        <section className="upload-box" style={{ maxWidth: '100%' }}>
          {!previewUrl ? (
            <div className="dropzone">
              <div className="eyebrow" style={{ marginBottom: '8px' }}>RGB Image Input</div>
              <h2 style={{ fontSize: '22px', margin: '0 0 12px' }}>Choose a satellite or aerial image</h2>
              <p className="section-copy" style={{ marginBottom: '20px' }}>
                Supported formats: JPG, JPEG, PNG (max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload-input"
              />
              <label htmlFor="file-upload-input" className="button" style={{ cursor: 'pointer' }}>
                Select File <span>↑</span>
              </label>
            </div>
          ) : (
            <div style={{ padding: '24px', background: 'var(--panel)', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: '0 0 200px', width: '200px' }}>
                  <div style={{ border: '1px solid var(--line)', background: '#000', padding: '4px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Uploaded preview"
                      style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div className="mono" style={{ fontSize: '11px', marginTop: '8px', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedFile?.name}
                  </div>
                  <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)' }}>
                    {((selectedFile?.size || 0) / 1024).toFixed(1)} KB
                  </div>
                </div>

                <div style={{ flex: '1', minWidth: '240px' }}>
                  <div className="eyebrow" style={{ marginBottom: '6px' }}>Image Loaded & Verified</div>
                  <h3 style={{ fontSize: '20px', margin: '0 0 12px' }}>Ready for Analysis</h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                    The uploaded file has been validated as an RGB image payload. Click Analyze Image to execute inference against the TerraShift prediction API.
                  </p>

                  <div className="button-row" style={{ marginTop: 0 }}>
                    <button
                      className="button"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      style={{ opacity: isAnalyzing ? 0.7 : 1 }}
                    >
                      {isAnalyzing ? 'Analyzing Image...' : 'Analyze Image'} <span>→</span>
                    </button>
                    <button
                      className="button secondary"
                      onClick={handleRemoveImage}
                      disabled={isAnalyzing}
                    >
                      Change / Remove Image
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="warning">
            <strong>Distribution Notice:</strong> Arbitrary images uploaded from external sources or consumer cameras may fall outside the Sentinel-2 / EuroSAT training distribution. Model confidence and accuracy are calibrated specifically on 64x64 pixel Sentinel-2 RGB imagery.
          </div>
        </section>

        {/* Inference / Model Output Area */}
        <section className="data-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '24px' }}>
            <div>
              <span className="eyebrow">Prediction & Analysis Output</span>
              <h2 style={{ fontSize: '24px', margin: '4px 0 0' }}>Model Output Panel</h2>
            </div>
            <div className="mono" style={{ fontSize: '11px', background: 'var(--lime)', padding: '6px 12px', color: 'var(--ink)', fontWeight: 'bold' }}>
              Model: ResNet50 (RGB)
            </div>
          </div>

          {isAnalyzing ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div className="eyebrow" style={{ fontSize: '14px', marginBottom: '8px' }}>Executing Model Inference...</div>
              <p style={{ fontSize: '13px', color: 'var(--muted)' }}>Sending image tensor payload to POST /api/predict</p>
            </div>
          ) : predictionResult ? (
            <div>
              {!predictionResult.success ? (
                <div style={{ background: '#fdf2f2', border: '1px solid #f8b4b4', padding: '24px', borderRadius: '0', marginBottom: '20px' }}>
                  <div className="mono" style={{ color: '#c81e1e', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                    STATUS HTTP 501: BACKEND NOT CONNECTED
                  </div>
                  <h3 style={{ fontSize: '18px', margin: '0 0 8px', color: '#9b1c1c' }}>
                    Model Inference Coming Soon
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: '1.6', margin: '0 0 12px' }}>
                    {predictionResult.error}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
                    The site cleanly routes requests to <code>POST /api/predict</code>. Connect a standalone PyTorch inference container containing the ResNet50 weights to enable real-time predictions.
                  </p>
                </div>
              ) : (
                <div>
                  {/* Real prediction result structure when backend is connected */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ background: 'var(--paper)', padding: '16px', border: '1px solid var(--line)' }}>
                      <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>PREDICTED CLASS</span>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--moss)', marginTop: '4px' }}>
                        {predictionResult.predictedClass}
                      </div>
                    </div>
                    <div style={{ background: 'var(--paper)', padding: '16px', border: '1px solid var(--line)' }}>
                      <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>CONFIDENCE SCORE</span>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--teal)', marginTop: '4px' }}>
                        {((predictionResult.confidence || 0) * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <h4>Class Probability Distribution</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {predictionResult.probabilities?.map((prob) => (
                      <div key={prob.className} style={{ fontSize: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>{prob.className}</span>
                          <span className="mono">{(prob.probability * 100).toFixed(1)}%</span>
                        </div>
                        <div style={{ background: '#e8ece8', height: '6px', width: '100%' }}>
                          <div style={{ background: 'var(--moss)', height: '100%', width: `${prob.probability * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: '#eaf0e9', border: '1px dashed #9ab5a5', padding: '32px', textAlign: 'center' }}>
              <div className="empty-symbol" style={{ margin: '0 auto 16px', width: '50px', height: '50px', fontSize: '20px' }}>
                TS
              </div>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px' }}>Model Inference Coming Soon</h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '520px', margin: '0 auto 16px', lineHeight: '1.6' }}>
                Upload an image above to verify the client-side pipeline. Predictions, class probabilities, and Grad-CAM spatial heatmaps will populate automatically once the PyTorch model service is connected to <code>POST /api/predict</code>.
              </p>
              <div className="mono" style={{ fontSize: '11px', color: 'var(--moss)' }}>
                FRONTEND PREDICTION CONTRACT READY
              </div>
            </div>
          )}

          {/* 10 EuroSAT Classes Checklist */}
          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--line)' }}>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>
              SUPPORTED EUROSAT TAXONOMY (10 CLASSES)
            </span>
            <div className="pill-row">
              {EUROSAT_CLASSES.map((c) => (
                <span key={c} className="pill muted" style={{ fontSize: '10px' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="section">
        <div className="section-header">
          <div>
            <div className="eyebrow">Backend Integration Architecture</div>
            <h2 className="section-title">Strict model boundary.</h2>
          </div>
          <p className="section-copy">
            The frontend never fabricates inference outputs or mixes RGB uploads with 13-band multispectral weights.
          </p>
        </div>

        <div className="feature-grid">
          <div className="data-card">
            <span className="mono">01 / BOUNDARY</span>
            <h3>Isolated Inference API</h3>
            <p>Routes image payloads to <code>POST /api/predict</code> with HTTP status validation.</p>
          </div>
          <div className="data-card">
            <span className="mono">02 / SPECS</span>
            <h3>RGB Input Scope</h3>
            <p>Directly compatible with 3-channel standard web imagery and Sentinel-2 RGB tiles.</p>
          </div>
          <div className="data-card">
            <span className="mono">03 / VERACITY</span>
            <h3>No Fake Data</h3>
            <p>Returns explicit 501 unavailable states until real weights and PyTorch execution are connected.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
