export default function Footer() {
  return (
    <footer className="bg-navy text-white/70 py-10">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white mb-2">
          Langbord
        </p>
        <p className="text-sm mb-4">
          N\u00e6ringslivsklubb \u2014 stiftet 2025
        </p>
        <div className="text-xs text-white/40">
          &copy; {new Date().getFullYear()} Langbord. Alle rettigheter reservert.
        </div>
      </div>
    </footer>
  );
}
