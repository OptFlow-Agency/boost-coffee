"use client";

import { useRef } from "react";
import { nav, site } from "@/content/site";
import { gsap, useGSAP, finePointer, reducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/components/providers/SmoothScroll";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { Logo } from "@/components/svg/Logo";


/**
 * A peach field under the logo set giant. They rise out of the floor as the
 * footer scrolls in, and on a mouse each letter stretches toward the cursor
 * and turns over to an outline as you pass it.
 */
export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const letters = gsap.utils.toArray<SVGGElement>(".foot__logo .logo__letter", el);
      if (reducedMotion()) return;

      gsap.from(letters, {
        yPercent: 100,
        ease: "none",
        stagger: 0.06,
        scrollTrigger: { trigger: el.querySelector(".foot__word"), start: "top bottom", end: "bottom bottom", scrub: 0.6 },
      });

      if (!finePointer()) return;
      const word = el.querySelector<HTMLElement>(".foot__word")!;
      const setters = letters.map((l) => ({
        s: gsap.quickTo(l, "scaleY", { duration: 0.8, ease: "expo.out" }),
        sk: gsap.quickTo(l, "skewX", { duration: 0.8, ease: "expo.out" }),
      }));
      const move = (e: PointerEvent) => {
        letters.forEach((l, i) => {
          const r = l.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const near = Math.max(0, 1 - Math.abs(dx) / 1.6);
          setters[i].s(1 + near * 0.22);
          setters[i].sk(gsap.utils.clamp(-12, 12, -dx * 10 * near));
        });
      };
      const leave = () => setters.forEach((s) => (s.s(1), s.sk(0)));
      word.addEventListener("pointermove", move);
      word.addEventListener("pointerleave", leave);
      return () => {
        word.removeEventListener("pointermove", move);
        word.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root },
  );

  return (
    <footer ref={root} id="site-footer" className="foot" data-field="peach" data-field-start="top 55%" data-field-end="top 25%">
      <div className="container foot__in">
        <div className="foot__top">
          <p className="foot__tag">{site.tagline}</p>
          <nav className="foot__nav" aria-label="Footer">
            <ul>
              {nav.map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href}>{l.label}</TransitionLink>
                </li>
              ))}
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Magnetic>
            <button type="button" className="sticker sticker--ink foot__top-btn" onClick={() => scrollToTarget(0)} data-cursor="Up">
              Back to top
            </button>
          </Magnetic>
        </div>

        <div className="foot__word" aria-hidden="true">
          <Logo tone="mono" className="foot__logo" />
        </div>
        <p className="foot__small">© Boost coffee. Drawn in code, poured in person.</p>
      </div>
    </footer>
  );
}
