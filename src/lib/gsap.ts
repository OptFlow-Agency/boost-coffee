"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** True when the visitor asked the OS for less motion. */
export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True on a device with a mouse or trackpad (hover-capable, fine pointer). */
export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin, useGSAP };
