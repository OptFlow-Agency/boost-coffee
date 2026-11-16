"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { gsap, ScrollTrigger, SplitText, useGSAP, finePointer, reducedMotion } from "@/lib/gsap";
import { introReady } from "@/lib/intro";
import Image from "next/image";
import { Bean } from "@/components/svg/Coffee";
import { Logo } from "@/components/svg/Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { TransitionLink } from "@/components/ui/TransitionLink";

const BEANS = [
  { cls: "bean--1", depth: 0.9, rot: -24 },
  { cls: "bean--2", depth: 0.5, rot: 40 },
  { cls: "bean--3", depth: 1.3, rot: 12 },
  { cls: "bean--4", depth: 0.7, rot: -60 },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const letters = el.querySelectorAll(".hero__logo .logo__letter");
      const rm = reducedMotion();
      const mm = gsap.matchMedia();

      // ---- intro: masked characters, then the rest of the hero ----
      // Under reduced motion there is no intro: the preloader's short fade is the only transition.
      let split: SplitText | null = null;
      if (!rm) {
        split = SplitText.create(el.querySelector(".hero__tagline"), { type: "lines", mask: "lines", linesClass: "line", aria: "none" });
        const intro = gsap.timeline({ paused: true });
        intro
          .from(letters, { yPercent: 120, rotate: 6, duration: 1.3, stagger: 0.075, ease: "expo.out" })
          .from(split.lines, { yPercent: 110, duration: 1.1, stagger: 0.08, ease: "expo.out" }, 0.3)
          .from([el.querySelector(".hero__lede"), el.querySelector(".hero__actions")], { y: 28, opacity: 0, duration: 1, stagger: 0.08, ease: "power4.out" }, 0.5)
          .from(el.querySelector(".hero__cup"), { yPercent: 40, rotate: 10, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.35)
          .from(el.querySelectorAll(".bean-wrap"), { scale: 0, rotate: -90, duration: 1.2, stagger: 0.06, ease: "expo.out" }, 0.6)
          .from(el.querySelector(".hero__sticker"), { scale: 0, rotate: -40, duration: 1, ease: "expo.out" }, 1);
        introReady.then(() => intro.play());
      }

      // ---- scroll parallax (desktop and phone, no reduced motion) ----
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
        gsap.to(el.querySelector(".mega"), { yPercent: 18, ease: "none", scrollTrigger: st });
        gsap.to(el.querySelector(".hero__art"), { yPercent: -14, ease: "none", scrollTrigger: st });
        el.querySelectorAll<HTMLElement>(".bean").forEach((b) => {
          const d = Number(b.dataset.depth);
          gsap.to(b, { y: -220 * d, rotate: `+=${90 * d}`, ease: "none", scrollTrigger: st });
        });
      });

      // ---- pointer: beans drift by depth, letters ripple like liquid ----
      if (!finePointer() || rm) return () => {
        mm.revert();
        split?.revert();
      };

      const beans = Array.from(el.querySelectorAll<HTMLElement>(".bean-wrap"));
      const movers = beans.map((b) => ({
        d: Number(b.dataset.depth),
        x: gsap.quickTo(b, "x", { duration: 1.2, ease: "expo.out" }),
        y: gsap.quickTo(b, "y", { duration: 1.2, ease: "expo.out" }),
      }));

      const mega = el.querySelector<HTMLElement>(".mega")!;
      const disp = document.querySelector("#liquid feDisplacementMap")!;
      const turb = document.querySelector("#liquid feTurbulence")!;
      const state = { scale: 0, target: 0, t: 0 };
      let lx = 0, ly = 0, active = false;

      const tick = () => {
        state.target *= 0.9;
        state.scale += (state.target - state.scale) * 0.12;
        state.t += 0.004;
        disp.setAttribute("scale", state.scale.toFixed(2));
        turb.setAttribute("baseFrequency", `${(0.008 + Math.sin(state.t) * 0.002).toFixed(4)} ${(0.022 + Math.cos(state.t) * 0.004).toFixed(4)}`);
        if (state.scale < 0.15 && state.target < 0.15) {
          active = false;
          mega.classList.remove("is-liquid");
          gsap.ticker.remove(tick);
        }
      };

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        movers.forEach((m) => {
          m.x(nx * 60 * m.d);
          m.y(ny * 50 * m.d);
        });
        const v = Math.min(60, Math.hypot(e.clientX - lx, e.clientY - ly));
        lx = e.clientX;
        ly = e.clientY;
        const m = mega.getBoundingClientRect();
        const over = e.clientY > m.top - 80 && e.clientY < m.bottom + 80;
        if (over && v > 2) {
          state.target = Math.min(38, state.target + v * 0.6);
          if (!active) {
            active = true;
            mega.classList.add("is-liquid");
            gsap.ticker.add(tick);
          }
        }
      };
      el.addEventListener("pointermove", move);
      // stop all work while the hero is off screen
      const off = ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom top", onLeave: () => (state.target = 0) });

      return () => {
        el.removeEventListener("pointermove", move);
        gsap.ticker.remove(tick);
        off.kill();
        mm.revert();
        split?.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" data-field="paper" aria-labelledby="hero-title">
      <svg className="defs" aria-hidden="true" focusable="false">
        <filter id="liquid" x="-10%" y="-20%" width="120%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.022" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="container hero__in">
        <h1 id="hero-title" className="hero__h1">
          <span className="mega">
            <Logo className="hero__logo" />
          </span>
          <span className="visually-hidden">Boost coffee. </span>
          <span className="hero__tagline">{site.tagline}</span>
        </h1>
        <p className="hero__lede">{site.heroLine}</p>
        <div className="hero__actions">
          <Magnetic>
            <a className="btn btn--ink" href={site.directions} target="_blank" rel="noreferrer" data-cursor="Go">
              Get directions
            </a>
          </Magnetic>
          <Magnetic>
            <TransitionLink className="btn btn--line" href="/menu" data-cursor="View">
              See the menu
            </TransitionLink>
          </Magnetic>
        </div>

        <div className="hero__art" aria-hidden="true">
          <Image className="hero__cup" src="/images/hero-cup.png" alt="" width={1254} height={1254} priority sizes="(max-width: 960px) 78vw, 560px" />
          <p className="hero__sticker">
            <span>Ink on</span>
            <span>every cup</span>
          </p>
        </div>

        {BEANS.map((b) => (
          <div key={b.cls} className={`bean-wrap ${b.cls}`} data-depth={b.depth} aria-hidden="true">
            <Bean className="bean" data-depth={b.depth} style={{ rotate: `${b.rot}deg` }} />
          </div>
        ))}
      </div>
    </section>
  );
}
