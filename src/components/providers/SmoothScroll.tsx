"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

let instance: Lenis | null = null;
/** The live Lenis instance, or null under reduced motion (native scrolling). */
export const getLenis = () => instance;

export function stopScroll() {
  instance?.stop();
  document.documentElement.classList.add("is-locked");
}
export function startScroll() {
  instance?.start();
  document.documentElement.classList.remove("is-locked");
}

/** Scroll to a target with Lenis when it runs, natively otherwise. */
export function scrollToTarget(target: number | string | HTMLElement, immediate = false) {
  if (instance) {
    instance.scrollTo(target, { immediate, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  const top = typeof el === "number" ? el : el ? el.getBoundingClientRect().top + window.scrollY : 0;
  window.scrollTo({ top, behavior: immediate || reducedMotion() ? "auto" : "smooth" });
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (reducedMotion()) return; // native scroll, no smoothing

    const l = new Lenis({ lerp: 0.08, smoothWheel: true });
    instance = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // the preloader starts the page locked; it calls startScroll() when it leaves
    if (document.documentElement.classList.contains("is-locked")) l.stop();

    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      instance = null;
    };
  }, []);

  // keep ScrollTrigger honest after fonts land and on resize
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    document.fonts?.ready.then(refresh);
    window.addEventListener("resize", refresh);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  return <>{children}</>;
}
