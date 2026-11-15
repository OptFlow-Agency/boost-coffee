"use client";

import { Fragment, useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { InlineIcon } from "@/components/svg/Brand";

type Bit = string | { icon: "cup" | "bolt" | "bean" | "note" };

// The statement, with small drawings set inline among the words.
const TEXT: Bit[] = [
  "Ink on every cup.", { icon: "cup" },
  "Murals on the walls. Neon over the bar", { icon: "bolt" },
  "and marble under your elbows. Boost is a coffee break", { icon: "bean" },
  "with the volume up: a shot pulled, a cup handed over, and a doodle to read while it cools.", { icon: "note" },
];

/** Words light up one by one as the paragraph scrolls through the screen. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const bits = el.querySelectorAll(".mf__w, .inline-icon");
      if (reducedMotion()) return;
      gsap.fromTo(
        bits,
        { opacity: 0.3 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: el.querySelector(".mf__text"), start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        el.querySelectorAll(".inline-icon svg"),
        { scale: 0.3, rotate: -40 },
        {
          scale: 1,
          rotate: 0,
          stagger: 0.25,
          ease: "back.out(2)",
          scrollTrigger: { trigger: el.querySelector(".mf__text"), start: "top 75%", end: "bottom 50%", scrub: 0.6 },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="mf" data-field="peach" aria-labelledby="mf-title">
      <div className="container">
        <h2 id="mf-title" className="visually-hidden">What Boost is</h2>
        <p className="mf__text">
          {TEXT.map((b, i) =>
            typeof b === "string" ? (
              <Fragment key={i}>
                {b.split(" ").map((w, j) => (
                  <Fragment key={j}>
                    <span className="mf__w">{w}</span>{" "}
                  </Fragment>
                ))}
              </Fragment>
            ) : (
              <Fragment key={i}>
                <InlineIcon kind={b.icon} />{" "}
              </Fragment>
            ),
          )}
        </p>
      </div>
    </section>
  );
}
