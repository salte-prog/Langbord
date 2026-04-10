"use client";

import { useEffect, useRef } from "react";

const timeline = [
  { time: "18:00", label: "Mingling og velkomst", icon: "glass" },
  { time: "18:30", label: "Faglig innslag", icon: "mic" },
  { time: "20:00", label: "Middag og sosialt", icon: "utensils" },
];

function TimelineIcon({ type }: { type: string }) {
  switch (type) {
    case "glass":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2h8l-1 9H9L8 2z" />
          <path d="M12 11v8" />
          <path d="M8 19h8" />
        </svg>
      );
    case "mic":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="11" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <path d="M12 17v4" />
          <path d="M8 21h8" />
        </svg>
      );
    case "utensils":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
        </svg>
      );
    default:
      return null;
  }
}

export default function OmLangbord() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const el = sectionRef.current;
    if (el) {
      el.querySelectorAll(".fade-in").forEach((child) => observer.observe(child));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="om" ref={sectionRef} className="py-20 md:py-28 bg-sand">
      <div className="max-w-3xl mx-auto px-6">
        <div className="fade-in">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-navy mb-8 text-center">
            Om Langbord
          </h2>
        </div>

        <div className="fade-in space-y-5 text-charcoal text-base sm:text-lg leading-relaxed mb-16">
          <p>
            Langbord er en eksklusiv n\u00e6ringslivsklubb for unge og ambisi\u00f8se
            fagpersoner fra vidt forskjellige bransjer. Vi tror at de beste
            samtalene oppst\u00e5r n\u00e5r ulike perspektiver m\u00f8tes rundt samme bord.
          </p>
          <p>
            Klubben holder 6\u20137 m\u00f8ter i \u00e5ret. Hvert m\u00f8te kombinerer faglig
            innhold med middag og nettverksbygging \u2014 alltid hos en av
            medlemmene. M\u00f8testedene varierer fra industribedrifter og
            advokatfirmaer til restauranter og unike lokaler.
          </p>
          <p>
            Langbord er mer enn en sosial klubb. Det er et rom der kunnskap
            deles, forbindelser knyttes, og ambisjon m\u00f8ter erfaring.
          </p>
        </div>

        {/* Timeline */}
        <div className="fade-in">
          <h3 className="text-earth font-semibold text-sm uppercase tracking-widest mb-8 text-center">
            Programstruktur
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
            {timeline.map((item, i) => (
              <div key={item.time} className="flex items-center">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center text-white mb-3">
                    <TimelineIcon type={item.icon} />
                  </div>
                  <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-navy">
                    {item.time}
                  </span>
                  <span className="text-sm text-earth mt-1 max-w-[140px]">
                    {item.label}
                  </span>
                </div>
                {i < timeline.length - 1 && (
                  <div className="hidden sm:block w-16 md:w-24 h-0.5 bg-gradient-to-r from-earth to-earth-light mx-4 mt-[-24px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
