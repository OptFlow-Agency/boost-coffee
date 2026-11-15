"use client";

import { useRef } from "react";
import { menu } from "@/content/site";
import { gsap, useGSAP, finePointer, reducedMotion } from "@/lib/gsap";
import { MenuArt } from "@/components/svg/MenuIcons";
import { TransitionLink } from "@/components/ui/TransitionLink";

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
const TONES = ["orange", "peach", "khaki", "forest", "sage"] as const;

/**
 * The board. On the home page each row is a link to the full menu: hover it and
 * the row floods with colour, its note slides in, and a drawing of the drink
 * trails the cursor, leaning into the direction you move.
 * variant="full" is the /menu page: every note visible, a drawing on each row.
 */
export function MenuList({ variant = "home" }: { variant?: "home" | "full" }) {
  const root = useRef<HTMLElement>(null);
  const all = menu.flatMap((g) => g.items.map((it) => ({ ...it, group: g.group })));

  useGSAP(
    () => {
      const el = root.current!;
      const rows = gsap.utils.toArray<HTMLElement>(".mrow", el);

      if (!reducedMotion()) {
        gsap.from(rows, {
          yPercent: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.05,
          ease: "expo.out",
          scrollTrigger: { trigger: el.querySelector(".mlist"), start: "top 80%" },
        });
      }

      if (variant !== "home" || !finePointer() || reducedMotion()) return;
      const follower = el.querySelector<HTMLElement>(".mfollow")!;
      const arts = gsap.utils.toArray<HTMLElement>(".mfollow__art", el);
      const x = gsap.quickTo(follower, "x", { duration: 0.7, ease: "expo.out" });
      const y = gsap.quickTo(follower, "y", { duration: 0.7, ease: "expo.out" });
      const r = gsap.quickTo(follower, "rotation", { duration: 0.9, ease: "expo.out" });
      let lastX = 0;
      let current = -1;

      const move = (e: PointerEvent) => {
        x(e.clientX);
        y(e.clientY);
        r(gsap.utils.clamp(-22, 22, (e.clientX - lastX) * 1.2));
        lastX = e.clientX;
      };
      const show = (i: number) => {
        if (i === current) return;
        if (current >= 0) gsap.to(arts[current], { scale: 0.2, opacity: 0, yPercent: -30, duration: 0.35, ease: "power3.in", overwrite: true });
        gsap.fromTo(arts[i], { scale: 0.2, opacity: 0, yPercent: 30 }, { scale: 1, opacity: 1, yPercent: 0, duration: 0.7, ease: "expo.out", overwrite: true });
        current = i;
      };
      const list = el.querySelector<HTMLElement>(".mlist")!;
      const enter = (e: PointerEvent) => {
        lastX = e.clientX;
        gsap.set(follower, { x: e.clientX, y: e.clientY });
        gsap.to(follower, { autoAlpha: 1, duration: 0.3 });
      };
      const leave = () => {
        gsap.to(follower, { autoAlpha: 0, duration: 0.3 });
        if (current >= 0) gsap.to(arts[current], { scale: 0.2, opacity: 0, duration: 0.3 });
        current = -1;
      };
      const handlers = rows.map((row, i) => {
        const h = () => show(i);
        row.addEventListener("pointerenter", h);
        return () => row.removeEventListener("pointerenter", h);
      });
      list.addEventListener("pointerenter", enter);
      list.addEventListener("pointerleave", leave);
      window.addEventListener("pointermove", move, { passive: true });
      return () => {
        handlers.forEach((off) => off());
        list.removeEventListener("pointerenter", enter);
        list.removeEventListener("pointerleave", leave);
        window.removeEventListener("pointermove", move);
      };
    },
    { scope: root },
  );

  const home = variant === "home";

  return (
    <section ref={root} id="menu" className={`menu-sec menu-sec--${variant}`} data-field="paper" aria-labelledby="menu-title">
      <div className="container">
        <div className="menu-sec__head">
          <h2 id="menu-title" className="section-head">{home ? "Everything on the bar" : "The board"}</h2>
          {home && (
            <TransitionLink href="/menu" className="btn btn--line" data-cursor="View">
              Open the full menu
            </TransitionLink>
          )}
        </div>

        <div className="mlist">
          {menu.map((g) => (
            <div key={g.group} className="mgroup">
              <h3 className="mgroup__name">{g.group}</h3>
              <ul className="mgroup__rows">
                {g.items.map((it) => {
                  const i = all.findIndex((a) => a.name === it.name);
                  const tone = TONES[i % TONES.length];
                  const body = (
                    <>
                      <span className="mrow__name">{it.name}</span>
                      <span className="mrow__line">{it.line}</span>
                      {!home && <MenuArt icon={it.icon} className="mrow__art" />}
                    </>
                  );
                  return (
                    <li key={it.name} className={`mrow mrow--${tone}`} id={home ? undefined : slug(it.name)}>
                      {home ? (
                        <TransitionLink href={`/menu#${slug(it.name)}`} className="mrow__link" data-cursor="View">
                          {body}
                        </TransitionLink>
                      ) : (
                        <div className="mrow__link">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {home && (
        <div className="mfollow" aria-hidden="true">
          {all.map((it) => (
            <div key={it.name} className="mfollow__art">
              <MenuArt icon={it.icon} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
