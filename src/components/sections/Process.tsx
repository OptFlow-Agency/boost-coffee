"use client";

import { useRef } from "react";
import { process as steps } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";

// one shape that becomes each stage: bean, grounds, drop, the drink in the cup
const BLOB = {
  bean: "M300 150 C380 150 420 240 410 320 C400 410 340 460 290 455 C220 450 180 380 185 300 C190 220 230 150 300 150 Z",
  mound: "M150 440 C190 380 240 300 300 290 C360 300 410 380 450 440 C400 452 200 452 150 440 Z",
  drop: "M300 250 C325 300 375 345 375 395 C375 440 342 470 300 470 C258 470 225 440 225 395 C225 345 275 300 300 250 Z",
  cup: "M206 316 C260 306 340 306 394 316 C390 370 384 430 368 466 C330 472 270 472 232 466 C216 430 210 370 206 316 Z",
};

/**
 * Bean, grind, pull, cup. The section pins and the scroll scrubs one sequence:
 * each stage's line drawing draws itself, and a yellow shape morphs from a bean
 * into grounds, a drop and finally the drink in the cup.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const stages = gsap.utils.toArray<SVGGElement>(".proc__stage", el);
        const items = gsap.utils.toArray<HTMLElement>(".proc__step", el);
        const blob = el.querySelector(".proc__blob")!;
        const shapes = [BLOB.bean, BLOB.mound, BLOB.drop, BLOB.cup];
        const lines = stages.map((s) => s.querySelectorAll(".proc__line"));
        const grounds = el.querySelectorAll(".proc__grain");
        const fill = el.querySelector(".proc__progress-fill");

        gsap.set(stages, { opacity: 1 });
        gsap.set(lines.flatMap((l) => Array.from(l)), { drawSVG: "0%" });
        gsap.set(blob, { morphSVG: BLOB.bean });
        gsap.set(items, { opacity: 0.5 });
        gsap.set(items[0], { opacity: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: el.querySelector(".proc__pin"),
            pin: true,
            scrub: 0.8,
            start: "top top",
            end: () => `+=${window.innerHeight * 3.2}`,
            invalidateOnRefresh: true,
          },
        });
        tl.from(blob, { scale: 0.4, rotate: -40, transformOrigin: "50% 50%", duration: 0.6, ease: "expo.out" }, 0)
          .to(lines[0], { drawSVG: "100%", duration: 0.8, stagger: 0.1 }, 0)
          .to(fill, { scaleX: 0.25, duration: 1, ease: "none" }, 0);

        for (let i = 1; i < 4; i++) {
          const at = i * 1.2;
          tl.to(lines[i - 1], { drawSVG: "100% 100%", duration: 0.5, stagger: 0.04 }, at)
            .to(blob, { morphSVG: shapes[i], duration: 0.8 }, at + 0.1)
            .to(lines[i], { drawSVG: "100%", duration: 0.8, stagger: 0.08 }, at + 0.3)
            .to(items[i - 1], { opacity: 0.5, duration: 0.3 }, at)
            .to(items[i], { opacity: 1, duration: 0.3 }, at + 0.15)
            .to(fill, { scaleX: (i + 1) / 4, duration: 1.2, ease: "none" }, at);
          if (i === 1) tl.fromTo(grounds, { y: -60, opacity: 0 }, { y: 70, opacity: 1, duration: 0.9, stagger: 0.05 }, at + 0.2).to(grounds, { opacity: 0, duration: 0.3 }, at + 1.1);
        }
        tl.to({}, { duration: 0.4 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="proc" data-field="ink" aria-labelledby="proc-title">
      <div className="proc__pin">
        <div className="container proc__in">
          <div className="proc__copy">
            <h2 id="proc-title" className="section-head">
              Bean to cup in four moves
            </h2>
            <ol className="proc__steps">
              {steps.map((s) => (
                <li key={s.step} className="proc__step">
                  <span className="proc__step-name">{s.step}</span>
                  <span className="proc__step-line">{s.line}</span>
                </li>
              ))}
            </ol>
            <div className="proc__progress" aria-hidden="true">
              <span className="proc__progress-fill" />
            </div>
          </div>

          <svg className="proc__art" viewBox="0 0 600 600" aria-hidden="true" focusable="false">
            <path className="proc__blob f-peach" d={BLOB.cup} />
            <g className="proc__stage proc__stage--bean" fill="none">
              <path className="proc__line" d="M180 60 H420 L340 140 H260 Z" />
              <path className="proc__line" d="M300 165 C270 240 330 300 295 445" />
              <path className="proc__line" d="M300 140 V150" />
            </g>
            <g className="proc__stage proc__stage--grind" fill="none">
              <path className="proc__line" d="M230 50 H370 L350 120 H250 Z" />
              <path className="proc__line" d="M240 120 H360 V240 H240 Z" />
              <path className="proc__line" d="M360 170 H440 V130 H470" />
              <circle className="proc__line" cx="300" cy="180" r="34" />
              <path className="proc__line" d="M300 146 V214 M266 180 H334" />
              {[270, 290, 310, 330, 285, 315].map((x, i) => (
                <circle key={i} className="proc__grain f-paper" cx={x} cy={260 + (i % 3) * 14} r="5" />
              ))}
            </g>
            <g className="proc__stage proc__stage--pull" fill="none">
              <path className="proc__line" d="M190 60 H410 V130 H190 Z" />
              <path className="proc__line" d="M215 150 H385 Q382 205 300 210 Q218 205 215 150 Z" />
              <path className="proc__line" d="M385 166 H540" />
              <path className="proc__line" d="M286 214 V246 M314 214 V246" />
            </g>
            <g className="proc__stage proc__stage--cup" fill="none">
              <path className="proc__line" d="M190 290 H410 L392 470 Q388 490 368 490 H232 Q212 490 208 470 Z" />
              <path className="proc__line" d="M408 324 Q474 322 466 380 Q458 430 398 428" />
              <path className="proc__line" d="M140 510 H460" />
              <path className="proc__line" d="M258 260 q-22 -30 0 -60 t0 -60" />
              <path className="proc__line" d="M300 250 q-22 -30 0 -60 t0 -60" />
              <path className="proc__line" d="M342 260 q-22 -30 0 -60 t0 -60" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
