"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-navy hero-pattern overflow-hidden">
      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/40 via-transparent to-navy-dark/60 pointer-events-none" />

      <div className="relative z-10 text-center px-6">
        <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-6">
          Langbord
        </h1>
        <p className="text-earth-light text-lg sm:text-xl md:text-2xl max-w-xl mx-auto leading-relaxed">
          Nettverk. Kunnskap. Bordet som samler.
        </p>
      </div>

      {/* Scroll indicator */}
      <a
        href="#om"
        className="absolute bottom-10 z-10 text-white/60 hover:text-white/90 transition-colors bounce-down"
        aria-label="Scroll ned"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 13l5 5 5-5" />
          <path d="M7 6l5 5 5-5" />
        </svg>
      </a>
    </section>
  );
}
