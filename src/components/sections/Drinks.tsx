"use client";

import { useRef } from "react";
import { drinks } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { DrinkCup } from "@/components/svg/DrinkCup";
import { Bean } from "@/components/svg/Coffee";

/**
 * Four drinks, each in its own colour world. On wide screens the section pins
 * and the cards slide sideways as you scroll; the background morphs from one
 * card's colour to the next and each glass fills as its card arrives.
 * On phones and under reduced motion the cards simply stack.
 */
export function Drinks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const mm = gsap.matchMedia();

      // ---- wide screens: pinned horizontal scroll ----
      mm.add("(min-width: 48rem) and (prefers-reduced-motion: no-preference)", () => {
        const track = el.querySelector<HTMLElement>(".drinks__track")!;
        const cards = gsap.utils.toArray<HTMLElement>(".drink", el);
        const layers = gsap.utils.toArray<HTMLElement>(".drinks__layer", el);
        const distance = () => track.scrollWidth - window.innerWidth;

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el.querySelector(".drinks__pin"),
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${distance()}`,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, i) => {
          const liquid = card.querySelector<SVGGElement>(".liquid")!;
          const waves = card.querySelectorAll(".wave");
          const drop = Number(liquid.dataset.drop);
          // colour world: this card's layer fades over the last one
          if (layers[i] && i > 0) {
            gsap.fromTo(layers[i], { opacity: 0 }, {
              opacity: 1, ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: slide, start: "left 85%", end: "left 35%", scrub: true },
            });
          }
          // the pour
          gsap.fromTo(liquid, { y: drop }, {
            y: 0, duration: 1.4, ease: "expo.out",
            scrollTrigger: { trigger: card, containerAnimation: slide, start: "left 55%", toggleActions: "play none none reverse" },
          });
          // the surface moves with the scroll
          gsap.fromTo(waves, { x: 0 }, {
            x: 100, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
          });
          // name and cup drift at different speeds (parallax inside the track)
          gsap.fromTo(card.querySelector(".drink__art"), { xPercent: 18, rotate: 8 }, {
            xPercent: -10, rotate: -4, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
          });
          gsap.fromTo(card.querySelector(".drink__name"), { xPercent: -6 }, {
            xPercent: 6, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
          });
        });
      });

      // ---- phones: cards stack; each glass fills as it scrolls in ----
      mm.add("(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".drink", el).forEach((card) => {
          const liquid = card.querySelector<SVGGElement>(".liquid")!;
          gsap.fromTo(liquid, { y: Number(liquid.dataset.drop) }, {
            y: 0, duration: 1.4, ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 70%", toggleActions: "play none none reverse" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="drinks" data-field="orange" aria-labelledby="drinks-title">
      <div className="drinks__pin">
        <div className="drinks__layers" aria-hidden="true">
          {drinks.map((d) => (
            <div key={d.name} className={`drinks__layer field--${d.field}`} />
          ))}
        </div>
        <div className="drinks__track">
          <div className="drinks__intro">
            <h2 id="drinks-title" className="section-head">
              Four to start with
            </h2>
            <p className="drinks__hint">Keep scrolling. Each one gets its own colour.</p>
            <Bean className="drinks__bean" />
          </div>
          {drinks.map((d, i) => (
            <article key={d.name} className={`drink drink--${d.field}`} data-tone={d.field} aria-labelledby={`drink-${i}`}>
              <div className="drink__copy">
                <h3 id={`drink-${i}`} className="drink__name">
                  {d.name}
                </h3>
                <p className="drink__line">{d.line}</p>
              </div>
              <div className="drink__art">
                <DrinkCup kind={d.kind} level={d.level} id={`d${i}`} className="drink__cup" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
