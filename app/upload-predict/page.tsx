"use client";

import { useState } from "react";
import { predictImage, type PredictionResponse } from "@/lib/api";

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png"];

export default function UploadPredictPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setResult(null);
    setError(null);
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setError("Please upload a JPG, JPEG, or PNG image.");
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const prediction = await predictImage(file);
      setResult(prediction);
    } catch {
      setError("Model inference coming soon.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Upload & Predict</h1>
        <p className="text-ink/75">
          Upload your own RGB satellite or aerial image (JPG/JPEG/PNG) and get a prediction from the
          TerraShift RGB ResNet50 model.
        </p>
        <p className="text-sm text-ink/55">
          Images outside the EuroSAT training distribution &mdash; different resolution, angle, or
          scene type &mdash; will still get a prediction, but treat the result as experimental.
        </p>
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={onFileChange}
        className="block text-sm text-ink/65 file:mr-4 file:rounded-md file:border-0 file:bg-ink/15 file:px-4 file:py-2 file:text-ink"
      />

      {previewUrl && (
        <div className="space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Preview" className="max-h-80 rounded-lg border border-ink/15" />
          <button
            onClick={analyze}
            disabled={loading}
            className="rounded-md bg-brand-600 px-5 py-3 text-sm font-medium text-paper disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      )}

      {error && <p className="text-ink/65 text-sm">{error}</p>}

      {result && (
        <div className="rounded-lg border border-ink/15 p-6 space-y-3">
          <p>
            Prediction: <span className="font-mono text-brand-600">{result.prediction}</span> (
            {(result.confidence * 100).toFixed(1)}% confidence)
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-ink/65">
            {Object.entries(result.probabilities).map(([cls, p]) => (
              <li key={cls} className="flex justify-between">
                <span>{cls}</span>
                <span>{(p * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
          {result.note && <p className="text-xs text-ink/20">{result.note}</p>}
        </div>
      )}
    </div>
  );
}
