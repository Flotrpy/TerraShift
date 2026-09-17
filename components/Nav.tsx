import Link from "next/link";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/dataset-library", label: "Dataset Library" },
  { href: "/upload-predict", label: "Upload & Predict" },
  { href: "/model-demo", label: "Model Demo" },
  { href: "/research", label: "Research" },
  { href: "/methodology", label: "Methodology" },
  { href: "/results", label: "Results" },
];

export default function Nav() {
  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur sticky top-0 z-50">
      <nav className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-[11px] font-mono font-semibold text-paper">
            TS
          </span>
          <span className="font-semibold text-ink tracking-tight">TerraShift</span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink/70">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand-600 transition-colors">
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/Flotrpy/TerraShift"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 border-b border-ink/40 pb-0.5 text-ink hover:text-brand-600 hover:border-brand-600 transition-colors"
          >
            GitHub <span aria-hidden>&#8599;</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
