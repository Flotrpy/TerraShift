export type PredictionResponse = {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
  model: string;
  note?: string;
};

export type ApiErrorCode = "NOT_CONFIGURED" | "TIMEOUT" | "NETWORK" | "HTTP";

export class ApiError extends Error {
  code: ApiErrorCode;
  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

const API_BASE = process.env.NEXT_PUBLIC_INFERENCE_API_URL ?? "";

// Render's free tier spins the container down after inactivity; the first request
// after that can take 30-60s to cold-start. Give it real room before giving up.
const REQUEST_TIMEOUT_MS = 75_000;

async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fn(controller.signal);
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new ApiError(
        "TIMEOUT",
        "The model server didn't respond in time. It may still be waking up on the free tier -- try again in a few seconds."
      );
    }
    throw new ApiError("NETWORK", "Couldn't reach the model server. Check your connection and try again.");
  } finally {
    clearTimeout(timer);
  }
}

/** Throws ApiError -- callers should branch on `.code` rather than fabricate a prediction. */
export async function predictImage(file: File | Blob): Promise<PredictionResponse> {
  if (!API_BASE) {
    throw new ApiError("NOT_CONFIGURED", "Model inference coming soon.");
  }
  const form = new FormData();
  form.append("file", file);
  return withTimeout(async (signal) => {
    const res = await fetch(`${API_BASE}/predict`, { method: "POST", body: form, signal });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new ApiError("HTTP", detail || `Prediction failed (${res.status})`);
    }
    return res.json();
  });
}

export async function checkHealth(): Promise<{ status: string; model_loaded: boolean }> {
  if (!API_BASE) throw new ApiError("NOT_CONFIGURED", "Model inference coming soon.");
  return withTimeout(async (signal) => {
    const res = await fetch(`${API_BASE}/health`, { cache: "no-store", signal });
    if (!res.ok) throw new ApiError("HTTP", `Health check failed (${res.status})`);
    return res.json();
  });
}
