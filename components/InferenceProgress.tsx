"use client";

import { useEffect, useState } from "react";

/** Elapsed-time-aware status line + progress bar for a prediction request.
 * Render's free tier cold-starts in 30-60s, so this tells the user what's
 * actually happening instead of leaving a bare spinner. */
export default function InferenceProgress({ startedAt }: { startedAt: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 200);
    return () => clearInterval(id);
  }, [startedAt]);

  const message =
    elapsed < 4
      ? "Sending image to the model..."
      : elapsed < 60
      ? "Waking up the model server (free-tier cold start can take up to a minute)..."
      : "Still waiting -- this is taking longer than usual...";

  // Fake-but-honest progress: fast to ~40% while sending, then eases toward ~95%
  // over the typical cold-start window without ever claiming to be done early.
  const pct = Math.min(95, elapsed < 4 ? elapsed * 10 : 40 + (elapsed - 4) * 1.1);

  return (
    <div className="space-y-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-brand-600 transition-[width] duration-300 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm text-ink/60">{message}</p>
    </div>
  );
}
