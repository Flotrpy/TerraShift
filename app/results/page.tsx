import Image from "next/image";

const CLASSES = [
  "AnnualCrop", "Forest", "HerbaceousVegetation", "Highway", "Industrial",
  "Pasture", "PermanentCrop", "Residential", "River", "SeaLake",
] as const;

// Source: research/results/rgb_test_metrics.json, multispectral_test_metrics.json
// (Colab T4 run, 2026-09-17). Supersedes the 2026-09-16 run for reporting purposes;
// both are kept in research/research_log.md.
const RUN = {
  rgb: {
    testAcc: 0.9496, precision: 0.9498, recall: 0.9496, f1: 0.9495, bestVal: 0.9427,
    f1ByClass: [0.9505, 0.9724, 0.9349, 0.9077, 0.9697, 0.9223, 0.9354, 0.9812, 0.9138, 0.9919],
  },
  ms: {
    testAcc: 0.8812, precision: 0.8811, recall: 0.8812, f1: 0.8787, bestVal: 0.88,
    f1ByClass: [0.8776, 0.9121, 0.8337, 0.8122, 0.9117, 0.8544, 0.7489, 0.9014, 0.9249, 0.9862],
  },
};

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

export default function ResultsPage() {
  return (
    <div className="max-w-4xl space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Results</h1>
        <p className="text-earth-200/80">
          Under the current experimental configuration, the RGB baseline outperformed the
          multispectral baseline: {pct(RUN.rgb.testAcc)} vs. {pct(RUN.ms.testAcc)} test accuracy on
          the same 4,050-image test set.
        </p>
        <p className="text-sm text-earth-200/60">
          Training run on a Colab T4 GPU, September 17, 2026. Split 70/15/15, seed 42.
          Numbers may shift slightly between runs; an earlier September 16 run is kept in the
          research log for comparison.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-medium text-earth-100">Overall test performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-earth-200/60 border-b border-earth-700">
              <tr>
                <th className="py-2 pr-4 font-medium">Model</th>
                <th className="py-2 pr-4 font-medium">Test accuracy</th>
                <th className="py-2 pr-4 font-medium">Weighted precision</th>
                <th className="py-2 pr-4 font-medium">Weighted recall</th>
                <th className="py-2 pr-4 font-medium">Weighted F1</th>
                <th className="py-2 font-medium">Best val accuracy</th>
              </tr>
            </thead>
            <tbody className="text-earth-100/90">
              {[["RGB ResNet50 (3 bands)", RUN.rgb], ["Multispectral ResNet50 (13 bands)", RUN.ms]].map(([name, m]) => {
                const r = m as typeof RUN.rgb;
                return (
                  <tr key={name as string} className="border-b border-earth-700/50">
                    <td className="py-2 pr-4">{name as string}</td>
                    <td className="py-2 pr-4 font-mono">{pct(r.testAcc)}</td>
                    <td className="py-2 pr-4 font-mono">{pct(r.precision)}</td>
                    <td className="py-2 pr-4 font-mono">{pct(r.recall)}</td>
                    <td className="py-2 pr-4 font-mono">{pct(r.f1)}</td>
                    <td className="py-2 font-mono">{pct(r.bestVal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium text-earth-100">Training curves</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Image src="/figures/rgb_curves.png" alt="RGB training/validation loss and accuracy curves" width={800} height={500} className="rounded border border-earth-700 w-full" />
            <p className="text-xs text-earth-200/60">RGB ResNet50 — loss and accuracy over 10 epochs.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium text-earth-100">Confusion matrices</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Image src="/figures/rgb_confusion_matrix.png" alt="RGB model confusion matrix" width={800} height={800} className="rounded border border-earth-700 w-full" />
            <p className="text-xs text-earth-200/60">RGB ResNet50 test-set confusion matrix.</p>
          </div>
          <div className="space-y-2">
            <Image src="/figures/multispectral_confusion_matrix.png" alt="Multispectral model confusion matrix" width={800} height={800} className="rounded border border-earth-700 w-full" />
            <p className="text-xs text-earth-200/60">Multispectral ResNet50 test-set confusion matrix.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium text-earth-100">Per-class F1</h2>
        <p className="text-sm text-earth-200/70">
          Measured on this run&apos;s test set. Harder classes here reflect this data and setup, not
          fixed properties of those land-cover types.
        </p>
        <div className="space-y-3">
          {CLASSES.map((c, i) => (
            <div key={c} className="grid grid-cols-[10rem_1fr] sm:grid-cols-[12rem_1fr] items-center gap-3 text-sm">
              <span className="text-earth-200/80">{c}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded bg-earth-400" style={{ width: `${RUN.rgb.f1ByClass[i] * 100}%` }} />
                  <span className="font-mono text-xs text-earth-100">{RUN.rgb.f1ByClass[i].toFixed(3)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded bg-earth-200/50" style={{ width: `${RUN.ms.f1ByClass[i] * 100}%` }} />
                  <span className="font-mono text-xs text-earth-200/70">{RUN.ms.f1ByClass[i].toFixed(3)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-6 text-xs text-earth-200/70">
          <span className="flex items-center gap-2"><span className="inline-block h-2 w-6 rounded bg-earth-400" />RGB</span>
          <span className="flex items-center gap-2"><span className="inline-block h-2 w-6 rounded bg-earth-200/50" />Multispectral</span>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-earth-100">Error analysis (Grad-CAM)</h2>
        <p className="text-earth-200/80 text-sm">
          Grad-CAM on the multispectral model surfaced an overconfident mistake: a Residential patch
          predicted as SeaLake at roughly 95% confidence. It is kept as an error-analysis example, not
          a success case. Grad-CAM shows where the model focused; it does not prove why it was wrong.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Image src="/figures/gradcam_rgb_example.png" alt="Grad-CAM example on a correctly classified RGB image" width={800} height={400} className="rounded border border-earth-700 w-full" />
            <p className="text-xs text-earth-200/60">Grad-CAM on a correctly classified RGB example.</p>
          </div>
          <div className="space-y-2">
            <Image src="/figures/gradcam_multispectral_error_residential.png" alt="Grad-CAM on the overconfident Residential to SeaLake misclassification" width={800} height={400} className="rounded border border-earth-700 w-full" />
            <p className="text-xs text-earth-200/60">Grad-CAM on the Residential → SeaLake error case.</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-earth-100">Coming next</h2>
        <p className="text-earth-200/80 text-sm">
          Live inference in the Dataset Library and Upload &amp; Predict needs the trained RGB
          checkpoint wired up behind the FastAPI inference backend.
        </p>
      </section>
    </div>
  );
}
