"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { StreetMap } from "@/components/svg/StreetMap";
import { Magnetic } from "@/components/ui/Magnetic";

/** A fact nobody has supplied yet: shown as a dashed blank to fill, never invented. */
function Fact({ value, blank }: { value: string | null; blank: string }) {
  return value ? <>{value}</> : <span className="fill">{blank}</span>;
}

/**
 * Where to find it: the address, the hours and a big directions button beside
 * an illustrated street map whose route draws itself to the bolt pin.
 */
export function Visit({ as = "h2" }: { as?: "h1" | "h2" }) {
  const root = useRef<HTMLElement>(null);
  const H = as;

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const el = root.current!;
      const tl = gsap.timeline({ scrollTrigger: { trigger: el.querySelector(".visit__map"), start: "top 75%" } });
      tl.from(el.querySelectorAll(".map-block"), { scale: 0, transformOrigin: "50% 50%", duration: 0.9, stagger: { each: 0.03, from: "random" }, ease: "expo.out" })
        .from(el.querySelector(".map-river"), { opacity: 0, duration: 0.8, ease: "power2.out" }, 0.1)
        .from(el.querySelector(".map-park"), { scale: 0, transformOrigin: "50% 50%", duration: 0.8 }, 0.2)
        .from(el.querySelector(".map-route"), { drawSVG: "0%", duration: 1.4, ease: "power2.inOut" }, 0.5)
        .from(el.querySelector(".map-pin"), { y: -120, opacity: 0, duration: 1, ease: "expo.out" }, 1.4);
      gsap.from(el.querySelectorAll(".visit__copy > *"), {
        y: 40, opacity: 0, duration: 1.1, stagger: 0.08, ease: "power4.out",
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="visit" className="visit" data-field="forest" aria-labelledby="visit-title">
      <div className="container visit__in">
        <div className="visit__copy">
          <H id="visit-title" className={`section-head${as === "h1" ? " section-head--page" : ""}`}>
            Find the neon
          </H>
          <dl className="visit__facts">
            <div>
              <dt>Address</dt>
              <dd>
                <Fact value={site.address} blank="Address to be added" />
              </dd>
            </div>
            <div>
              <dt>Open</dt>
              <dd>
                <Fact value={site.hours} blank="Hours to be added" />
              </dd>
            </div>
          </dl>
          <Magnetic strength={0.25}>
            <a className="btn btn--paper btn--big" href={site.directions} target="_blank" rel="noreferrer" data-cursor="Go">
              Get directions
            </a>
          </Magnetic>
        </div>
        <div className="visit__map">
          <StreetMap className="visit__svg" />
        </div>
      </div>
    </section>
  );
}
