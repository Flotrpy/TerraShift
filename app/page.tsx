import Link from "next/link";
import EarthGlobe from "@/components/EarthGlobe";

export default function HomePage() {
  return (
    <div className="space-y-24">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-600">
            Sentinel-2 Earth Observation &middot; Transfer Learning &middot; ResNet50
          </p>
          <h1 className="text-4xl sm:text-6xl font-semibold leading-[1.05] text-ink tracking-tight">
            Classify the land.
            <br />
            <span className="text-brand-600">See the shift.</span>
          </h1>
          <p className="max-w-xl text-ink/70 leading-relaxed text-lg">
            TerraShift trains ResNet50 classifiers on Sentinel-2 imagery to identify 10 land-cover
            types, compares RGB against 13-band multispectral input, and uses Grad-CAM to examine
            what the model is actually looking at &mdash; a live interface onto real research, not a
            static writeup.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/dataset-library"
              className="rounded-md bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-brand-600 transition-colors"
            >
              Explore the Dataset Library
            </Link>
            <Link
              href="/results"
              className="rounded-md border border-ink/30 px-5 py-3 text-sm font-medium text-ink hover:border-brand-600 hover:text-brand-600 transition-colors"
            >
              See the results &rarr;
            </Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <EarthGlobe />
        </div>
      </section>

      <div className="border-l-2 border-clay pl-4 flex gap-3 text-sm text-ink/70">
        <span className="font-mono text-clay">01</span>
        <p>
          Transparent machine learning research connecting Sentinel-2 satellite pixels to
          empirical land-cover evidence.
        </p>
      </div>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-ink/10 bg-white/40 p-6 space-y-2">
          <h2 className="font-mono text-xs text-brand-600 uppercase tracking-wide">Main question</h2>
          <p className="text-ink/90 leading-relaxed">
            How effectively can transfer learning using Sentinel-2 satellite imagery classify
            land-cover types, and can these classifications identify potential land-cover changes?
          </p>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white/40 p-6 space-y-2">
          <h2 className="font-mono text-xs text-brand-600 uppercase tracking-wide">Secondary question</h2>
          <p className="text-ink/90 leading-relaxed">
            Does multispectral Sentinel-2 imagery improve land-cover classification performance
            compared with RGB imagery?
          </p>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        {[
          {
            tag: "01 / DATASET",
            title: "Dataset Library",
            body: "Browse the 10 EuroSAT classes and run real inference on any image.",
            href: "/dataset-library",
          },
          {
            tag: "02 / EMPIRICAL RESULTS",
            title: "Results",
            body: "Metrics, confusion matrices, and RGB vs. multispectral comparisons.",
            href: "/results",
          },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-lg border border-ink/10 bg-white/40 p-6 hover:border-brand-600 transition-colors space-y-3"
          >
            <p className="font-mono text-[11px] text-clay tracking-wide">{c.tag}</p>
            <h3 className="text-xl font-semibold text-ink">{c.title}</h3>
            <p className="text-sm text-ink/60">{c.body}</p>
            <p className="text-sm font-medium text-brand-600">Open &rarr;</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
