export default function Footer() {
  return (
    <footer className="mt-24 border-t border-earth-700/60 py-10 text-sm text-earth-200/70">
      <div className="mx-auto max-w-6xl px-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>TerraShift &mdash; land-cover classification research, built on Sentinel-2 / EuroSAT.</p>
        <p>Results and figures reflect actual experiment output, not illustrative examples.</p>
      </div>
    </footer>
  );
}
