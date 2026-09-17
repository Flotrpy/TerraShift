export type PredictionResponse = {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
  model: string;
  note?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_INFERENCE_API_URL ?? "";

/** Throws when the API isn't configured or reachable yet -- callers should show
 * "Model inference coming soon" rather than fabricating a prediction. */
export async function predictImage(file: File | Blob): Promise<PredictionResponse> {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_INFERENCE_API_URL is not configured");
  }
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/predict`, { method: "POST", body: form });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Prediction failed (${res.status})`);
  }
  return res.json();
}

export async function checkHealth(): Promise<{ status: string; model_loaded: boolean }> {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_INFERENCE_API_URL is not configured");
  const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Health check failed (${res.status})`);
  return res.json();
}
