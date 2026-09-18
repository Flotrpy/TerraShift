"use client";

import { useState } from "react";
import { EUROSAT_CLASSES } from "@/lib/classes";
import { predictImage, ApiError, type PredictionResponse } from "@/lib/api";
import InferenceProgress from "@/components/InferenceProgress";

/**
 * Dataset Library. Image thumbnails come from a small bundled EuroSAT sample set (added under
 * public/dataset-sample once curated -- not the full 27,000-image dataset). "Analyze with
 * TerraShift" always calls the real inference API; if it isn't reachable yet, the UI says so
 * instead of showing a fabricated prediction.
 */
export default function DatasetLibraryPage() {
  const [activeClass, setActiveClass] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ src: string; trueClass: string } | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const loading = startedAt !== null;

  async function analyze() {
    if (!selectedImage) return;
    setStartedAt(Date.now());
    setError(null);
    setResult(null);
    try {
      const blob = await fetch(selectedImage.src).then((r) => r.blob());
      const prediction = await predictImage(blob);
      setResult(prediction);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setStartedAt(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Dataset Library</h1>
        <p className="text-ink/75 max-w-2xl">
          Browse sample EuroSAT patches by class, then send one to the real TerraShift model and
          compare its prediction against the true label.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveClass(null)}
          className={`rounded-full px-3 py-1 text-sm border ${
            activeClass === null ? "border-brand-600 text-brand-600" : "border-ink/15 text-ink/65"
          }`}
        >
          All classes
        </button>
        {EUROSAT_CLASSES.map((c) => (
          <button
            key={c}
            onClick={() => setActiveClass(c)}
            className={`rounded-full px-3 py-1 text-sm border ${
              activeClass === c ? "border-brand-600 text-brand-600" : "border-ink/15 text-ink/65"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-ink/15 p-8 text-center text-ink/55">
        Sample image tiles go here once a curated EuroSAT subset is added to{" "}
        <code className="text-ink/60">public/dataset-sample/</code>. Clicking a tile will open it,
        show its true class, and offer &ldquo;Analyze with TerraShift&rdquo;.
      </div>

      {selectedImage && (
        <div className="rounded-lg border border-ink/15 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p>
              True class: <span className="font-mono text-brand-600">{selectedImage.trueClass}</span>
            </p>
            <button
              onClick={analyze}
              disabled={loading}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-paper disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze with TerraShift"}
            </button>
          </div>
          {loading && startedAt && <InferenceProgress startedAt={startedAt} />}
          {error && <p className="text-ink/65 text-sm">{error}</p>}
          {result && (
            <div className="space-y-2 text-sm">
              <p>
                Prediction: <span className="font-mono text-brand-600">{result.prediction}</span> (
                {(result.confidence * 100).toFixed(1)}% confidence)
              </p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-ink/65">
                {Object.entries(result.probabilities).map(([cls, p]) => (
                  <li key={cls} className="flex justify-between">
                    <span>{cls}</span>
                    <span>{(p * 100).toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
