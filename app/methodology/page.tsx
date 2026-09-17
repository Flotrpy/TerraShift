export default function MethodologyPage() {
  return (
    <div className="max-w-3xl space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Methodology</h1>
        <p className="text-earth-200/80">
          Exact preprocessing, split, and training configuration used for both baselines.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-earth-100">Data split</h2>
        <p className="text-earth-200/80">
          70% train / 15% validation / 15% test, seed 42 &mdash; 18,900 / 4,050 / 4,050 images. The same
          split is reused for both the RGB and multispectral datasets.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-earth-100">RGB model</h2>
        <ul className="list-disc pl-5 space-y-1 text-earth-200/80 text-sm">
          <li>Pretrained ImageNet ResNet50, backbone frozen, final FC layer replaced (10-class head)</li>
          <li>Resize 224&times;224 &rarr; tensor &rarr; ImageNet normalization (mean [0.485, 0.456, 0.406], std [0.229, 0.224, 0.225])</li>
          <li>CrossEntropyLoss, Adam, lr = 0.001, batch size 32, 10 epochs</li>
          <li>23,528,522 total parameters / 20,490 trainable</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-earth-100">Multispectral model</h2>
        <ul className="list-disc pl-5 space-y-1 text-earth-200/80 text-sm">
          <li>ResNet50 first convolution expanded to 13 channels</li>
          <li>Channels 0&ndash;2 initialized from pretrained RGB conv weights; channels 3&ndash;12 from their average</li>
          <li>Input scaled by /10000; same split, same training hyperparameters as the RGB model</li>
          <li>Only the final classification layer (plus the necessarily-retrained first conv) trained</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-earth-100">Evaluation</h2>
        <p className="text-earth-200/80">
          Accuracy, weighted precision/recall/F1, confusion matrix, per-class performance, training/
          validation loss and accuracy curves, and misclassified-example inspection &mdash; run
          identically for both models. Grad-CAM is applied to both correct predictions and interesting
          misclassifications for interpretation, not as proof of causation.
        </p>
      </section>

      <p className="text-sm text-earth-200/50">
        Full training and evaluation code: <code>research/experiments/</code> in the repository.
      </p>
    </div>
  );
}
