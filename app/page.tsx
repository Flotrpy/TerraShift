import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-20">
      <section className="space-y-6">
        <p className="font-mono text-sm uppercase tracking-widest text-earth-400">
          Sentinel-2 &middot; EuroSAT &middot; Transfer learning
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-earth-100">
          Classifying land cover from satellite imagery &mdash; and putting the real model in your hands.
        </h1>
        <p className="max-w-2xl text-earth-200/80 leading-relaxed">
          TerraShift trains ResNet50 classifiers on Sentinel-2 imagery to identify 10 land-cover
          types, compares RGB against 13-band multispectral input, and uses Grad-CAM to examine
          what the model is actually looking at. This site is a live interface onto that research,
          not a static writeup.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href="/dataset-library"
            className="rounded-md bg-earth-400 px-5 py-3 text-sm font-medium text-earth-950 hover:bg-earth-200 transition-colors"
          >
            Explore the Dataset Library
          </Link>
          <Link
            href="/upload-predict"
            className="rounded-md border border-earth-600 px-5 py-3 text-sm font-medium text-earth-100 hover:border-earth-400 transition-colors"
          >
            Upload your own image
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-earth-700/60 p-6 space-y-2">
          <h2 className="font-mono text-sm text-earth-400 uppercase tracking-wide">Main question</h2>
          <p className="text-earth-100/90 leading-relaxed">
            How effectively can transfer learning using Sentinel-2 satellite imagery classify
            land-cover types, and can these classifications identify potential land-cover changes?
          </p>
        </div>
        <div className="rounded-lg border border-earth-700/60 p-6 space-y-2">
          <h2 className="font-mono text-sm text-earth-400 uppercase tracking-wide">Secondary question</h2>
          <p className="text-earth-100/90 leading-relaxed">
            Does multispectral Sentinel-2 imagery improve land-cover classification performance
            compared with RGB imagery?
          </p>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {[
          {
            title: "Dataset Library",
            body: "Browse the 10 EuroSAT classes and run real inference on any image.",
            href: "/dataset-library",
          },
          {
            title: "Upload & Predict",
            body: "Upload your own satellite/aerial image for an experimental prediction.",
            href: "/upload-predict",
          },
          {
            title: "Results",
            body: "Metrics, confusion matrices, and RGB vs. multispectral comparisons.",
            href: "/results",
          },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-lg border border-earth-700/60 p-6 hover:border-earth-400 transition-colors space-y-2"
          >
            <h3 className="font-medium text-earth-100">{c.title}</h3>
            <p className="text-sm text-earth-200/70">{c.body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
