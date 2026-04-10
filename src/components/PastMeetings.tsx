"use client";

import { useEffect, useRef } from "react";
import type { PastMeeting } from "@/lib/types";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PastMeetings({ meetings }: { meetings: PastMeeting[] }) {
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

  if (meetings.length === 0) return null;

  return (
    <section id="arkiv" ref={sectionRef} className="py-20 md:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="fade-in text-center mb-14">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-navy mb-3">
            Tidligere m\u00f8ter
          </h2>
          <p className="text-earth text-base sm:text-lg">
            Et tilbakeblikk p\u00e5 klubbens samlinger.
          </p>
        </div>

        <div className="space-y-4">
          {meetings.map((meeting, i) => (
            <div
              key={meeting.id}
              className="fade-in bg-sand rounded-xl border border-blue-grey p-5 sm:p-6 hover:shadow-md transition-shadow"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                <div className="sm:w-40 shrink-0">
                  <time className="text-sm font-medium text-navy block">
                    {formatDate(meeting.date)}
                  </time>
                  <span className="text-xs text-earth">{meeting.industry}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-navy text-base mb-1">
                    {meeting.hostName} \u2014 {meeting.hostCompany}
                  </h3>
                  <p className="text-charcoal text-sm leading-relaxed">
                    {meeting.summary}
                  </p>
                  <p className="text-earth text-xs mt-2">{meeting.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
