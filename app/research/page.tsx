export default function ResearchPage() {
  return (
    <div className="max-w-3xl space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Research</h1>
        <p className="text-earth-200/80">
          TerraShift studies whether transfer learning on Sentinel-2 imagery can classify land cover
          well enough to support change detection, and whether multispectral input helps.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-earth-100">Research questions</h2>
        <ul className="list-disc pl-5 space-y-2 text-earth-200/80">
          <li>
            Main: How effectively can transfer learning using Sentinel-2 satellite imagery classify
            land-cover types, and can these classifications identify potential land-cover changes?
          </li>
          <li>
            Secondary: Does multispectral Sentinel-2 imagery improve land-cover classification
            performance compared with RGB imagery?
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-earth-100">Dataset</h2>
        <p className="text-earth-200/80">
          EuroSAT: 27,000 labeled Sentinel-2 patches across 10 land-cover classes, available in both
          RGB (3-channel) and multispectral (13-band) form. EuroSAT is already organized into labeled
          classes and based on real Sentinel-2 data, which makes it a controlled starting point
          before moving toward temporal change-detection analysis.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium text-earth-100">Beyond classification: change detection</h2>
        <p className="text-earth-200/80">
          EuroSAT is a single-snapshot classification dataset, not a change-detection dataset. The
          planned change-detection stage classifies year-1 and year-2 imagery of the same area
          separately, then compares the results &mdash; while accounting for cloud cover, seasonal
          differences, geographic alignment, and model uncertainty. A classification difference is a
          candidate transition to investigate, never an automatic &ldquo;confirmed&rdquo; environmental change.
        </p>
      </section>
    </div>
  );
}
