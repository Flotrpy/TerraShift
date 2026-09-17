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
    <header className="border-b border-earth-700/60 bg-earth-950/90 backdrop-blur sticky top-0 z-50">
      <nav className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-mono text-lg tracking-tight text-earth-100">
          Terra<span className="text-earth-400">Shift</span>
        </Link>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-earth-200">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-earth-400 transition-colors">
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-earth-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
