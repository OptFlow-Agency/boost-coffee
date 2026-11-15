"use client";

import { useRef, useState } from "react";
import { marquee } from "@/content/site";
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "@/lib/gsap";
import { getLenis } from "@/components/providers/SmoothScroll";

function Row({ outline = false }: { outline?: boolean }) {
  // one group; rendered twice so the loop wraps seamlessly
  return (
    <div className="ticker__group">
      {marquee.map((w) => (
        <span key={w} className="ticker__item">
          <span className={outline ? "ticker__word ticker__word--outline" : "ticker__word"}>{w}</span>
          <svg viewBox="0 0 70 104" className="ticker__bolt" aria-hidden="true" focusable="false">
            <path d="M40 4 L8 56 H31 L22 96 L60 38 H36 L47 4 Z" className={outline ? "f-orange st" : "f-peach st"} strokeWidth="4" strokeLinejoin="round" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/**
 * The drinks, running past at a speed and in a direction set by your scroll:
 * scroll down and it runs left, scroll up and it turns around, scroll hard and
 * it races and leans. Pauses on hover, on focus, off screen and on request.
 */
export function Marquee() {
  const root = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const el = root.current!;
      const rows = Array.from(el.querySelectorAll<HTMLElement>(".ticker__track"));
      const state = rows.map((r, i) => ({ el: r, x: 0, w: 0, sign: i === 0 ? -1 : 1 }));
      const measure = () => state.forEach((s) => (s.w = (s.el.firstElementChild as HTMLElement).offsetWidth));
      measure();
      let dir = 1;
      let hover = false;
      let skew = 0;
      const setSkew = rows.map((r) => gsap.quickSetter(r, "skewX", "deg"));

      const tick = (_t: number, dt: number) => {
        const lenis = getLenis();
        const v = lenis ? lenis.velocity : 0;
        if (lenis && Math.abs(v) > 0.3) dir = v > 0 ? 1 : -1;
        const hold = pausedRef.current || hover;
        const speed = hold ? 0 : 0.06 + Math.min(Math.abs(v) * 0.05, 1.6);
        skew += ((hold ? 0 : gsap.utils.clamp(-9, 9, -v * 0.35)) - skew) * 0.12;
        state.forEach((s, i) => {
          s.x += s.sign * dir * speed * dt;
          s.x = gsap.utils.wrap(-s.w, 0, s.x);
          s.el.style.transform = `translate3d(${s.x}px,0,0)`;
          setSkew[i](skew * s.sign * -1);
        });
      };

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
      });
      if (st.isActive) gsap.ticker.add(tick);

      const enter = () => (hover = true);
      const leave = () => (hover = false);
      const tracks = el.querySelector(".ticker__rows")!;
      tracks.addEventListener("pointerenter", enter);
      tracks.addEventListener("pointerleave", leave);
      el.addEventListener("focusin", enter);
      el.addEventListener("focusout", leave);
      window.addEventListener("resize", measure);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        tracks.removeEventListener("pointerenter", enter);
        tracks.removeEventListener("pointerleave", leave);
        el.removeEventListener("focusin", enter);
        el.removeEventListener("focusout", leave);
        window.removeEventListener("resize", measure);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="ticker" data-field="ink" aria-label="Drinks on the bar">
      <p className="visually-hidden">{marquee.join(", ")}</p>
      <div className="ticker__rows" aria-hidden="true">
        <div className="ticker__track">
          <Row />
          <Row />
        </div>
        <div className="ticker__track ticker__track--b">
          <Row outline />
          <Row outline />
        </div>
      </div>
      <div className="container ticker__foot">
        <button type="button" className="ticker__pause" aria-pressed={paused} onClick={() => {
            pausedRef.current = !pausedRef.current;
            setPaused(pausedRef.current);
          }}>
          {paused ? "Play the ticker" : "Pause the ticker"}
        </button>
      </div>
    </section>
  );
}
