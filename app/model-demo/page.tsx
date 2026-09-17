const STEPS = [
  { title: "Input image", body: "A Sentinel-2 patch (Dataset Library) or your own JPG/PNG upload." },
  { title: "Preprocessing", body: "Resize to 224×224, convert to tensor, ImageNet normalization." },
  { title: "TerraShift ResNet50", body: "Pretrained backbone + fine-tuned 10-class head runs inference." },
  { title: "Prediction", body: "Class label, confidence, and probabilities across all 10 classes." },
  { title: "Grad-CAM (optional)", body: "Highlights which regions of the image drove the prediction." },
];

export default function ModelDemoPage() {
  return (
    <div className="max-w-2xl space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Model Demo</h1>
        <p className="text-earth-200/80">How an image becomes a prediction, step by step.</p>
      </div>
      <ol className="space-y-6">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="font-mono text-earth-400">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="font-medium">{s.title}</h2>
              <p className="text-sm text-earth-200/70">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="text-sm text-earth-200/60">
        Try it live in the <a href="/dataset-library" className="text-earth-400 underline">Dataset Library</a> or{" "}
        <a href="/upload-predict" className="text-earth-400 underline">Upload & Predict</a>.
      </p>
    </div>
  );
}
