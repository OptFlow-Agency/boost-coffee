"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { visibleMain } from "@/lib/dom";
import { getLenis, scrollToTarget, startScroll, stopScroll } from "./SmoothScroll";

type Navigate = (href: string) => void;
const TransitionContext = createContext<Navigate>(() => {});
export const useTransitionNavigate = () => useContext(TransitionContext);

/**
 * Route changes behind a two-colour curtain: peach then orange rise over the page,
 * the route swaps underneath, and both leave upward. Reduced motion: a short fade.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const covering = useRef(false);
  const first = useRef(true);

  const navigate = useCallback<Navigate>(
    (href) => {
      const target = new URL(href, window.location.href);
      if (target.pathname === window.location.pathname) {
        if (target.hash) scrollToTarget(target.hash);
        else scrollToTarget(0);
        return;
      }
      if (covering.current) return;
      covering.current = true;
      stopScroll();
      const el = curtain.current!;
      const panels = el.querySelectorAll(".curtain__panel");
      gsap.killTweensOf(panels);
      el.dataset.active = "true";
      if (reducedMotion()) {
        gsap.fromTo(panels, { y: 0, yPercent: 0, opacity: 0 }, { opacity: 1, duration: 0.25, ease: "none", onComplete: () => router.push(href) });
        return;
      }
      gsap.fromTo(
        panels,
        { y: 0, yPercent: 100, opacity: 1 },
        { yPercent: 0, duration: 0.8, stagger: 0.09, ease: "expo.inOut", onComplete: () => router.push(href) },
      );
    },
    [router],
  );

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    // new route is in the DOM: reset scroll, rebuild triggers, lift the curtain
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    if (!covering.current) return;
    const el = curtain.current!;
    const panels = Array.from(el.querySelectorAll(".curtain__panel")).reverse();
    const done = () => {
      covering.current = false;
      el.dataset.active = "false";
      startScroll();
      const main = visibleMain();
      main?.focus({ preventScroll: true });
    };
    if (reducedMotion()) {
      gsap.to(panels, { opacity: 0, duration: 0.25, ease: "none", delay: 0.05, onComplete: done });
      return;
    }
    gsap.to(panels, { yPercent: -100, duration: 0.9, stagger: 0.08, ease: "expo.inOut", delay: 0.12, onComplete: done });
  }, [pathname]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div ref={curtain} className="curtain" data-active="false" aria-hidden="true">
        <div className="curtain__panel curtain__panel--a" />
        <div className="curtain__panel curtain__panel--b">
          <svg viewBox="0 0 70 104" className="curtain__bolt" focusable="false">
            <path d="M40 4 L8 56 H31 L22 96 L60 38 H36 L47 4 Z" className="f-peach st" strokeWidth="3.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
