'use client';

import { useState } from 'react';
import { EuroSATClass, EUROSAT_CLASSES, CLASS_DESCRIPTIONS, DatasetItem } from '@/lib/dataset/manifest';
import Link from 'next/link';

interface DatasetLibraryClientProps {
  initialClasses?: EuroSATClass[];
}

export default function DatasetLibraryClient({ initialClasses = EUROSAT_CLASSES }: DatasetLibraryClientProps) {
  const [selectedClass, setSelectedClass] = useState<string>('All classes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<DatasetItem | null>(null);

  const filteredClasses = initialClasses.filter((cls) => {
    const matchesCategory = selectedClass === 'All classes' || selectedClass === cls;
    const matchesSearch = cls.toLowerCase().includes(searchQuery.toLowerCase()) ||
      CLASS_DESCRIPTIONS[cls].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container">
      <section className="page-hero">
        <div className="eyebrow">Dataset Library / EuroSAT Taxonomy</div>
        <h1>Browse the land-cover vocabulary.</h1>
        <p>
          The EuroSAT dataset comprises 27,000 Sentinel-2 satellite images categorized into 10 distinct land-cover classes.
          This library interface provides structured filtering, search, detail analysis panels, and true-label verification.
        </p>
      </section>

      {/* Search & Filter Controls */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search classes or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '10px 14px',
              border: '1px solid var(--line)',
              background: 'white',
              borderRadius: '0',
              fontSize: '13px',
              minWidth: '280px',
              flex: '1',
              maxWidth: '400px'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="filter"
              style={{ padding: '10px 12px' }}
            >
              Clear search
            </button>
          )}
        </div>

        <div className="filters">
          <button
            className={`filter ${selectedClass === 'All classes' ? 'active' : ''}`}
            onClick={() => setSelectedClass('All classes')}
          >
            All classes (10)
          </button>
          {initialClasses.map((cls) => (
            <button
              key={cls}
              className={`filter ${selectedClass === cls ? 'active' : ''}`}
              onClick={() => setSelectedClass(cls)}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="home-grid" style={{ marginBottom: '40px' }}>
        {filteredClasses.map((cls) => (
          <div key={cls} className="feature" style={{ background: 'var(--panel)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="feature-number" style={{ textTransform: 'uppercase' }}>EuroSAT / Class</span>
              <h3 style={{ marginTop: '12px', marginBottom: '8px', fontSize: '20px' }}>{cls}</h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5' }}>
                {CLASS_DESCRIPTIONS[cls]}
              </p>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--moss)' }}>True Class Verified</span>
              <button
                className="filter"
                style={{ fontSize: '10px', padding: '6px 10px' }}
                onClick={() => setSelectedItem({ id: cls.toLowerCase(), filename: `${cls}_sample_01.jpg`, trueClass: cls })}
              >
                Inspect Class
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty / Unconnected Dataset State */}
      <section className="empty-state">
        <div className="empty-symbol">+</div>
        <div>
          <h2>
            {selectedClass === 'All classes'
              ? 'Dataset Image Manifest Pending'
              : `${selectedClass} sample tiles not connected`}
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Because the 27,000 raw EuroSAT image files (approx. 2 GB) are not committed directly into the repository to maintain lightweight Vercel deployment standards, image tiles are connected dynamically via a storage manifest.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
            When sample images are linked, this panel will display high-resolution true-color tiles, true class verification, 10-class prediction distributions, confidence scoring, correct/incorrect status indicators, and Grad-CAM visual heatmaps.
          </p>
          <div className="button-row" style={{ marginTop: '20px' }}>
            <Link className="button" href="/upload">
              Test custom RGB upload <span>→</span>
            </Link>
            <Link className="button secondary" href="/model-demo">
              View model architecture <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Inspection Modal */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(23, 35, 35, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="data-card"
            style={{
              maxWidth: '600px',
              width: '100%',
              background: 'var(--paper)',
              padding: '32px',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="eyebrow">Class Inspection Panel</span>
                <h2 style={{ fontSize: '28px', margin: '6px 0 0' }}>{selectedItem.trueClass}</h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'var(--ink)',
                }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              {CLASS_DESCRIPTIONS[selectedItem.trueClass]}
            </p>

            <div style={{ background: 'white', padding: '16px', border: '1px solid var(--line)', marginBottom: '20px' }}>
              <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '6px' }}>SAMPLE MANIFEST RECORD</div>
              <div style={{ fontSize: '13px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px' }}>
                <strong>True Label:</strong> <span>{selectedItem.trueClass}</span>
                <strong>Format:</strong> <span>Sentinel-2 (64x64 px)</span>
                <strong>Status:</strong> <span style={{ color: 'var(--teal)' }}>Awaiting image store connection</span>
              </div>
            </div>

            <div style={{ background: '#eaf0e9', padding: '16px', border: '1px dashed #9ab5a5', marginBottom: '20px' }}>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--moss)', fontWeight: 'bold' }}>ANALYZE WITH TERRASHIFT</span>
              <p style={{ fontSize: '12px', margin: '6px 0 0', color: 'var(--muted)' }}>
                Predictive analysis, probability breakdown across all 10 EuroSAT classes, true-class comparison, and Grad-CAM spatial heatmaps will populate here once the backend inference API is online.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="button secondary" onClick={() => setSelectedItem(null)}>
                Close
              </button>
              <Link className="button" href="/upload">
                Analyze Image ↗
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Architectural Specs */}
      <section className="section">
        <div className="section-header">
          <div>
            <div className="eyebrow">Architecture & Specifications</div>
            <h2 className="section-title">Designed for real evaluation.</h2>
          </div>
          <p className="section-copy">
            The dataset layout ensures fair evaluation without risking data leakage or label confusion.
          </p>
        </div>

        <div className="feature-grid">
          <div className="data-card">
            <span className="mono">01 / TRUTH DISPLAY</span>
            <h3>Explicit ground truth</h3>
            <p>Every sample preserves verified ground-truth annotations from EuroSAT metadata.</p>
          </div>
          <div className="data-card">
            <span className="mono">02 / PREDICTION PANEL</span>
            <h3>10-Class probabilities</h3>
            <p>Calculated via softmax over ResNet50 logits for full confidence transparency.</p>
          </div>
          <div className="data-card">
            <span className="mono">03 / GRAD-CAM AREA</span>
            <h3>Spatial explainability</h3>
            <p>Visualizes activation maps highlighting feature regions driving classification.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
