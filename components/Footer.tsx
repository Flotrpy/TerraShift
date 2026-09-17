export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 py-10 text-sm text-ink/60">
      <div className="mx-auto max-w-6xl px-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>TerraShift &mdash; land-cover classification research, built on Sentinel-2 / EuroSAT.</p>
        <p>Results and figures reflect actual experiment output, not illustrative examples.</p>
      </div>
    </footer>
  );
}
