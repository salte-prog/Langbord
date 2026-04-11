"use client";

import { useState, useEffect, useRef } from "react";
import type { NextMeeting } from "@/lib/types";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function RiddleCard({ meeting }: { meeting: NextMeeting | null }) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
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

  if (!meeting) {
    return (
      <section id="neste" ref={sectionRef} className="py-20 md:py-28 bg-blue-grey">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="fade-in">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-navy mb-6">
              Neste m\u00f8te
            </h2>
            <p className="text-earth text-lg">
              Neste m\u00f8te er ikke annonsert enn\u00e5. F\u00f8lg med!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="neste" ref={sectionRef} className="py-20 md:py-28 bg-blue-grey">
      <div className="max-w-2xl mx-auto px-6">
        <div className="fade-in">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-navy mb-4 text-center">
            Neste m\u00f8te
          </h2>
          <p className="text-earth text-center mb-10 text-base sm:text-lg">
            {formatDate(meeting.date)} kl. {meeting.time}
            <span className="block mt-1 text-navy font-medium">
              Vert: {meeting.hostName} / {meeting.hostCompany}
            </span>
          </p>
        </div>

        {/* Riddle card */}
        <div className="fade-in">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-grey">
            {/* Step 0: Teaser */}
            {step === 0 && (
              <div className="p-8 sm:p-10 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-navy/10 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C4A6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <circle cx="12" cy="17" r="0.5" fill="#2C4A6E" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-navy mb-3">
                  Hvor m\u00f8tes vi denne gangen?
                </h3>
                <p className="text-earth mb-8 max-w-md mx-auto">
                  En g\u00e5te venter. Klarer du \u00e5 gjette m\u00f8testedet f\u00f8r svaret avsl\u00f8res?
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 bg-navy text-white px-8 py-3 rounded-lg font-medium hover:bg-navy-light transition-colors cursor-pointer"
                >
                  Jeg er klar til \u00e5 gjette
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Step 1: Riddle shown */}
            {step === 1 && (
              <div className="p-8 sm:p-10">
                <div className="mb-8">
                  <p className="text-sm uppercase tracking-widest text-earth font-semibold mb-4 text-center">
                    G\u00e5ten
                  </p>
                  <blockquote className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl text-navy leading-relaxed text-center italic">
                    &ldquo;{meeting.riddle}&rdquo;
                  </blockquote>
                </div>
                <div className="text-center">
                  <p className="text-earth text-sm mb-4">
                    Har du en gjetning? Trykk for \u00e5 se svaret.
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 bg-earth text-white px-8 py-3 rounded-lg font-medium hover:bg-earth-light transition-colors cursor-pointer"
                  >
                    Avsl\u00f8re svaret
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Answer revealed */}
            {step === 2 && (
              <div className="p-8 sm:p-10">
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-widest text-earth font-semibold mb-4 text-center">
                    G\u00e5ten
                  </p>
                  <blockquote className="font-[family-name:var(--font-playfair)] text-lg sm:text-xl text-navy/60 leading-relaxed text-center italic mb-6">
                    &ldquo;{meeting.riddle}&rdquo;
                  </blockquote>
                </div>

                <div className="border-t border-blue-grey pt-6">
                  <p className="text-sm uppercase tracking-widest text-earth font-semibold mb-3 text-center">
                    Svaret
                  </p>
                  <div className="text-center">
                    <p className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold text-navy mb-2">
                      {meeting.hostCompany}
                    </p>
                    <p className="text-charcoal text-base mb-1">
                      {meeting.address}
                    </p>
                    <p className="text-earth text-sm">
                      {meeting.locationDescription}
                    </p>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <button
                    onClick={() => setStep(0)}
                    className="text-sm text-earth hover:text-navy transition-colors underline underline-offset-4 cursor-pointer"
                  >
                    Tilbakestill
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
