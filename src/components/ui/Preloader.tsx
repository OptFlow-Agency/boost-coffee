"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { finishIntro, introDone } from "@/lib/intro";
import { startScroll, stopScroll } from "@/components/providers/SmoothScroll";
import { LOGO_LETTERS, LOGO_VIEWBOX } from "@/components/svg/Logo";

/**
 * First visit only: the logo fills with liquid as a bolt charges
 * from 0 to 100, then the screen wipes upward to the hero.
 * Hidden without JavaScript (it only shows under html.js) and it removes itself
 * after six seconds even if a script fails, so the page can never get stuck.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(() => introDone());

  useEffect(() => {
    const el = root.current;
    if (!el || introDone()) return;
    stopScroll();

    const count = el.querySelector<HTMLElement>(".preloader__count")!;
    const fill = el.querySelector(".preloader__fill")!;
    const wave = el.querySelector(".preloader__wave")!;
    const bolt = el.querySelector(".preloader__bolt-fill")!;
    const counter = { v: 0 };

    const ready = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => (document.readyState === "complete" ? r(null) : window.addEventListener("load", () => r(null), { once: true }))),
    ]);

    if (reducedMotion()) {
      ready.then(() => {
        gsap.to(el, {
          opacity: 0,
          duration: 0.4,
          ease: "none",
          onStart: () => {
            startScroll();
            finishIntro();
          },
          onComplete: () => setGone(true),
        });
      });
      return;
    }

    const waveLoop = gsap.fromTo(wave, { x: 0 }, { x: -4, duration: 0.9, ease: "none", repeat: -1 });
    const charge = gsap.timeline();
    charge
      .to(counter, {
        v: 86,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => (count.textContent = String(Math.round(counter.v))),
      })
      .fromTo(fill, { y: 17 }, { y: 4, duration: 1.5, ease: "power2.inOut" }, 0)
      .fromTo(bolt, { scaleY: 0 }, { scaleY: 0.86, duration: 1.5, ease: "power2.inOut", transformOrigin: "50% 100%" }, 0);

    let cancelled = false;
    Promise.all([ready, new Promise((r) => charge.eventCallback("onComplete", () => r(null)))]).then(() => {
      if (cancelled) return;
      gsap
        .timeline({ onComplete: () => setGone(true) })
        .to(counter, { v: 100, duration: 0.5, ease: "power3.out", onUpdate: () => (count.textContent = String(Math.round(counter.v))) })
        .to(fill, { y: -1.5, duration: 0.5, ease: "power3.out" }, "<")
        .to(bolt, { scaleY: 1, duration: 0.5, ease: "power3.out" }, "<")
        .to(el.querySelector(".preloader__stage"), { yPercent: -30, opacity: 0, duration: 0.7, ease: "power3.in" }, "+=0.15")
        .add(() => {
          waveLoop.kill();
          startScroll();
          finishIntro();
        }, "-=0.1")
        .to(el, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.25");
    });

    return () => {
      cancelled = true;
      waveLoop.kill();
      charge.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="preloader keep-motion" aria-hidden="true">
      <div className="preloader__stage">
        <svg className="preloader__word" viewBox={LOGO_VIEWBOX} focusable="false">
          <defs>
            <clipPath id="pl-logo">
              {LOGO_LETTERS.map((l) => (
                <path key={l.key} d={l.d} />
              ))}
            </clipPath>
          </defs>
          <g clipPath="url(#pl-logo)">
            <g className="preloader__fill">
              <path className="preloader__wave f-peach" d="M-10 1 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 q1 -0.9 2 0 t2 0 V 30 H -10 Z" />
            </g>
          </g>
          <g className="preloader__outline">
            {LOGO_LETTERS.map((l) => (
              <path key={l.key} d={l.d} />
            ))}
          </g>
        </svg>
        <div className="preloader__meter">
          <svg viewBox="0 0 70 104" className="preloader__bolt" focusable="false">
            <defs>
              <clipPath id="pl-bolt">
                <path d="M40 4 L8 56 H31 L22 96 L60 38 H36 L47 4 Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#pl-bolt)">
              <rect className="preloader__bolt-fill f-peach" x="0" y="0" width="70" height="104" />
            </g>
            <path d="M40 4 L8 56 H31 L22 96 L60 38 H36 L47 4 Z" className="st-paper" strokeWidth="3.5" fill="none" strokeLinejoin="round" />
          </svg>
          <span className="preloader__count">0</span>
        </div>
      </div>
    </div>
  );
}
