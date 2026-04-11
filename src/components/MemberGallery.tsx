"use client";

import { useEffect, useRef } from "react";
import type { Member } from "@/lib/types";

function MemberCard({ member }: { member: Member }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl shadow-md border border-blue-grey p-6 sm:p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
      {/* Avatar */}
      <div className="w-24 h-24 rounded-full bg-navy flex items-center justify-center text-white text-2xl font-bold mb-5 ring-3 ring-earth/20">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="font-[family-name:var(--font-playfair)]">{initials}</span>
        )}
      </div>

      {/* Name */}
      <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-navy mb-1">
        {member.name}
      </h3>

      {/* Title & Company */}
      <p className="text-earth text-sm font-medium mb-4">
        {member.title}, {member.company}
      </p>

      {/* Bio */}
      <p className="text-charcoal text-sm leading-relaxed mb-4">
        {member.bio}
      </p>

      {/* LinkedIn */}
      {member.linkedinUrl && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy hover:text-navy-light transition-colors"
          aria-label={`${member.name} p\u00e5 LinkedIn`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      )}
    </div>
  );
}

export default function MemberGallery({ members }: { members: Member[] }) {
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
    <section id="medlemmer" ref={sectionRef} className="py-20 md:py-28 bg-sand">
      <div className="max-w-5xl mx-auto px-6">
        <div className="fade-in text-center mb-14">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-navy mb-3">
            Medlemmer
          </h2>
          <p className="text-earth text-base sm:text-lg max-w-lg mx-auto">
            Langbords styrke er mangfoldet \u2014 ulike bransjer, felles ambisjon.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {members.map((member, i) => (
            <div key={member.id} className="fade-in" style={{ transitionDelay: `${i * 100}ms` }}>
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
