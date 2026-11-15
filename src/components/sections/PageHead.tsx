"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";

/** A one-screen page opener for the subpages: masked title lines and a drawing that drifts with scroll. */
export function PageHead({ lines, lede, art, field = "paper" }: { lines: string[]; lede: string; art: ReactNode; field?: string }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const el = root.current!;
      gsap.from(el.querySelectorAll(".phead__line > span"), { yPercent: 110, duration: 1.2, stagger: 0.08, ease: "expo.out", delay: 0.2 });
      gsap.from(el.querySelector(".phead__lede"), { y: 24, opacity: 0, duration: 1, ease: "power4.out", delay: 0.5 });
      gsap.from(el.querySelectorAll(".phead__art > *"), { scale: 0, rotate: -30, duration: 1.2, stagger: 0.08, ease: "expo.out", delay: 0.4 });
      gsap.to(el.querySelectorAll(".phead__art > *"), {
        y: (i) => -80 - i * 60, rotate: (i) => (i % 2 ? 18 : -14), ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );
  return (
    <section ref={root} className="phead" data-field={field} aria-labelledby="page-title">
      <div className="container phead__in">
        <h1 id="page-title" className="phead__title">
          {lines.map((l) => (
            <span key={l} className="phead__line">
              <span>{l}</span>
            </span>
          ))}
        </h1>
        <p className="phead__lede">{lede}</p>
        <div className="phead__art" aria-hidden="true">{art}</div>
      </div>
    </section>
  );
}
