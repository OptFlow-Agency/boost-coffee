"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "@/lib/gsap";
import { isRendered } from "@/lib/dom";

/**
 * Large colour fields that change as you scroll. Each [data-field] section gets
 * a fixed full-screen layer of its colour, stacked in page order; as the section
 * arrives its layer fades in over the one before (opacity only, scrubbed).
 * Without JavaScript, sections paint their own background instead.
 */
export function BgFields() {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const host = root.current!;
      host.replaceChildren();
      // reduced motion: no colour morphing, every section paints its own field
      if (reducedMotion()) return;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-field]")).filter(isRendered);
      const rm = reducedMotion();
      sections.forEach((s, i) => {
        const layer = document.createElement("div");
        layer.className = `field field--${s.dataset.field}`;
        host.appendChild(layer);
        if (i === 0) {
          gsap.set(layer, { opacity: 1 });
          return;
        }
        gsap.fromTo(
          layer,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: rm
              ? { trigger: s, start: "top 55%", toggleActions: "play none none reverse", refreshPriority: -1 }
              : { trigger: s, start: s.dataset.fieldStart ?? "top 85%", end: s.dataset.fieldEnd ?? "top 45%", scrub: true, refreshPriority: -1 },
            duration: rm ? 0.3 : 1,
          },
        );
      });
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      document.documentElement.classList.add("has-fields");
      return () => document.documentElement.classList.remove("has-fields");
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return <div ref={root} className="fields" aria-hidden="true" />;
}
