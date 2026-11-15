"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { nav, site } from "@/content/site";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { startScroll, stopScroll, getLenis } from "@/components/providers/SmoothScroll";
import { TransitionLink } from "./TransitionLink";
import { visibleMain } from "@/lib/dom";
import { Logo } from "@/components/svg/Logo";
import { Magnetic } from "./Magnetic";

/**
 * The bar: wordmark on the left, two stickers on the right ("Find us" and the
 * menu button). It slides away while you scroll down and returns on the way up.
 * The button opens a full-screen overlay whose links rise in on a stagger.
 */
export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // hide on scroll down, show on scroll up
  useEffect(() => {
    if (reducedMotion()) return;
    let last = 0;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      const down = y > last && y > 160;
      if (down !== hidden) {
        hidden = down;
        gsap.to(bar.current, { yPercent: down ? -130 : 0, duration: 0.7, ease: down ? "power3.in" : "expo.out", overwrite: true });
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(() => {
    const el = overlay.current!;
    const links = el.querySelectorAll(".overlay__link-inner");
    const meta = el.querySelectorAll(".overlay__meta > *");
    const rm = reducedMotion();
    tl.current = gsap
      .timeline({ paused: true })
      .set(el, { visibility: "visible" })
      .fromTo(el, { yPercent: rm ? 0 : -100, opacity: rm ? 0 : 1 }, { yPercent: 0, opacity: 1, duration: rm ? 0.2 : 0.9, ease: "expo.inOut" })
      .fromTo(links, { yPercent: rm ? 0 : 110, opacity: rm ? 0 : 1 }, { yPercent: 0, opacity: 1, duration: rm ? 0.2 : 1.1, stagger: 0.07, ease: "expo.out" }, rm ? 0 : 0.35)
      .fromTo(meta, { opacity: 0, y: rm ? 0 : 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "expo.out" }, rm ? 0 : 0.6);
  });

  useEffect(() => {
    const main = visibleMain();
    const footer = document.getElementById("site-footer");
    if (open) {
      stopScroll();
      tl.current?.timeScale(1).play();
      main?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
      overlay.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
      const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", esc);
      return () => window.removeEventListener("keydown", esc);
    }
    main?.removeAttribute("inert");
    footer?.removeAttribute("inert");
    if (tl.current && tl.current.progress() > 0) {
      tl.current.timeScale(1.6).reverse();
      startScroll();
      toggle.current?.focus({ preventScroll: true });
    }
  }, [open]);

  // close when the route changes (adjusting state during render, not in an effect)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const findUs = pathname === "/" ? "/#visit" : "/contact";

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header ref={bar} className="bar">
        <div className="bar__in">
          <TransitionLink href="/" className="wordmark" aria-label="Boost coffee, home" data-cursor="Home">
            <Logo />
          </TransitionLink>
          <div className="bar__end">
            <Magnetic>
              <TransitionLink
                href={findUs}
                className="sticker sticker--paper bar__find"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    const l = getLenis();
                    if (l) l.scrollTo("#visit", { duration: 1.6 });
                    else document.getElementById("visit")?.scrollIntoView();
                  }
                }}
              >
                Find us
              </TransitionLink>
            </Magnetic>
            <Magnetic>
              <button
                ref={toggle}
                type="button"
                className="sticker sticker--ink menu-toggle"
                aria-expanded={open}
                aria-controls="site-overlay"
                onClick={() => setOpen((o) => !o)}
                data-open={open}
              >
                <span className="menu-toggle__lines" aria-hidden="true">
                  <span />
                  <span />
                </span>
                {open ? "Close" : "Menu"}
              </button>
            </Magnetic>
          </div>
        </div>
      </header>

      <div
        ref={overlay}
        id="site-overlay"
        className="overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        data-lenis-prevent
      >
        <nav className="overlay__in" aria-label="Main">
          <ul className="overlay__list">
            {nav.map((l, i) => (
              <li key={l.href} className="overlay__item" style={{ ["--i" as string]: i }}>
                <TransitionLink
                  href={l.href}
                  className="overlay__link"
                  aria-current={pathname === l.href ? "page" : undefined}
                  onBeforeNavigate={() => {
                    if (pathname === l.href) setOpen(false);
                  }}
                  data-cursor="Go"
                >
                  <span className="overlay__link-inner">{l.label}</span>
                </TransitionLink>
              </li>
            ))}
          </ul>
          <div className="overlay__meta">
            <p>{site.tagline}</p>
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
            <a href={site.directions} target="_blank" rel="noreferrer">
              Get directions
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
