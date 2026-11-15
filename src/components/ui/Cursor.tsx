"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, finePointer, reducedMotion } from "@/lib/gsap";

/**
 * A small ink dot that trails the pointer. Over anything with data-cursor="Label"
 * it grows into a disc carrying that label ("View", "Order", "Go").
 * Mouse and trackpad only; touch and reduced motion keep the system cursor.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!finePointer() || reducedMotion()) return;
    const el = dot.current!;
    el.hidden = false;
    document.documentElement.classList.add("has-cursor");
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "expo.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "expo.out" });
    let current: Element | null = null;

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const t = (e.target as Element | null)?.closest?.("[data-cursor], a, button, [role='button'], input, textarea, select");
      if (t === current) return;
      current = t ?? null;
      const text = t?.getAttribute("data-cursor") ?? "";
      setLabel(text);
      el.dataset.state = text ? "label" : t ? "hover" : "idle";
    };
    const out = () => (el.dataset.state = "hidden");
    const down = () => gsap.to(el.querySelector(".cursor__disc"), { scale: 0.85, duration: 0.2, ease: "power3.out" });
    const up = () => gsap.to(el.querySelector(".cursor__disc"), { scale: 1, duration: 0.6, ease: "expo.out" });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", out);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", out);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div ref={dot} className="cursor" data-state="hidden" aria-hidden="true" hidden>
      <div className="cursor__disc">
        <span className="cursor__label">{label}</span>
      </div>
    </div>
  );
}
