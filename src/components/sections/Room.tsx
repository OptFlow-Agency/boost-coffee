"use client";

import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { HeroCup } from "@/components/svg/HeroCup";
import { Bolt } from "@/components/svg/Brand";

const TILES = [
  { key: "mural", name: "Murals", line: "Painted figures across the back wall.", tone: "khaki" },
  { key: "neon", name: "Neon", line: "Pink and blue tubes over the bar.", tone: "ink" },
  { key: "marble", name: "Marble", line: "Grey marble tops on the tables.", tone: "paper" },
  { key: "timber", name: "Timber", line: "Slatted wood along the walls.", tone: "peach" },
] as const;

function TileArt({ kind }: { kind: (typeof TILES)[number]["key"] }) {
  return (
    <svg viewBox="0 0 400 300" className="tile__art" aria-hidden="true" focusable="false" fill="none">
      {kind === "mural" && (
        <>
          <rect x="20" y="20" width="360" height="260" rx="18" className="f-paper room-line" />
          <circle className="room-line f-peach" cx="130" cy="96" r="34" />
          <path className="room-line" d="M130 130 V210 M130 150 L80 120 M130 150 L184 112 M130 210 L96 268 M130 210 L170 268" />
          <path className="room-line f-orange" d="M230 260 C230 180 250 140 290 120 C330 140 350 180 350 260 Z" />
          <circle className="room-line f-forest" cx="290" cy="92" r="26" />
          <path className="room-line" d="M40 60 q20 -20 40 0 t40 0 M250 50 l20 10 l20 -10 l20 10" />
        </>
      )}
      {kind === "neon" && (
        <>
          <path className="room-tube st-khaki" d="M70 100 H210 L196 220 Q194 236 178 236 H102 Q86 236 84 220 Z" />
          <path className="room-tube st-khaki" d="M210 128 Q250 128 248 160 Q246 190 204 188" />
          <path className="room-tube st-khaki" d="M110 80 q-12 -18 0 -36 M140 80 q-12 -18 0 -36 M170 80 q-12 -18 0 -36" />
          <path className="room-tube room-tube--blue" d="M318 60 L280 150 H320 L292 240" />
          <path className="room-line-paper" d="M40 40 H360 M40 260 H360" />
        </>
      )}
      {kind === "marble" && (
        <>
          <ellipse className="room-line f-paper-2" cx="200" cy="120" rx="170" ry="70" />
          <path className="room-vein" d="M70 110 q40 -20 70 10 t80 -6 t60 20 M120 160 q30 -30 60 -10 t70 -24 M180 70 q20 30 60 24" />
          <path className="room-line" d="M200 190 V270 M150 280 H250" />
        </>
      )}
      {kind === "timber" && (
        <>
          {Array.from({ length: 11 }, (_, i) => (
            <rect key={i} className="room-line f-crema" x={30 + i * 32} y="24" width="22" height="252" rx="6" />
          ))}
        </>
      )}
    </svg>
  );
}

/** /about: the room, one drawn piece at a time, then the cup print it all comes back to. */
export function Room() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const el = root.current!;
      const chars = el.querySelectorAll(".room-head__line > span");
      gsap.from(chars, { yPercent: 110, duration: 1.2, stagger: 0.08, ease: "expo.out", delay: 0.2 });
      gsap.utils.toArray<HTMLElement>(".tile", el).forEach((t) => {
        gsap.from(t, { y: 80, rotate: 2, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: t, start: "top 85%" } });
        gsap.from(t.querySelectorAll(".room-line, .room-tube, .room-vein, .room-line-paper"), {
          drawSVG: "0%", duration: 1.4, stagger: 0.05, ease: "power2.inOut",
          scrollTrigger: { trigger: t, start: "top 75%" },
        });
      });
      gsap.fromTo(el.querySelector(".print__cup"), { rotate: -14, yPercent: 10 }, {
        rotate: 8, yPercent: -10, ease: "none",
        scrollTrigger: { trigger: el.querySelector(".print"), start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <article ref={root}>
      <section className="room-head" data-field="paper" aria-labelledby="room-title">
        <div className="container room-head__in">
          <h1 id="room-title" className="room-head__title">
            <span className="room-head__line"><span>A room drawn</span></span>
            <span className="room-head__line"><span>in marker</span></span>
          </h1>
          <p className="room-head__lede">Four things you notice walking in, and the cup you leave with.</p>
          <Bolt className="room-head__bolt" tone="f-orange" />
        </div>
      </section>

      <section className="room-tiles" data-field="khaki" aria-label="What is in the room">
        <div className="container tiles">
          {TILES.map((t) => (
            <figure key={t.key} className={`tile tile--${t.key}`} data-tone={t.tone}>
              <TileArt kind={t.key} />
              <figcaption>
                <span className="tile__name">{t.name}</span>
                <span className="tile__line">{t.line}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="print" data-field="peach" aria-labelledby="print-title">
        <div className="container print__in">
          <div className="print__copy">
            <h2 id="print-title" className="section-head">Every cup is a doodle</h2>
            <p className="print__line">
              Piano keys, records, swirls and arrows in black marker, with the name sprayed across the front in colour.
            </p>
          </div>
          <HeroCup className="print__cup" />
        </div>
      </section>
    </article>
  );
}
