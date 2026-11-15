import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/** A roasted coffee bean, flat fill, ink outline, paper crease. */
export function Bean({ className, ...rest }: P) {
  return (
    <svg viewBox="0 0 80 104" className={className} aria-hidden="true" focusable="false" {...rest}>
      <ellipse cx="44" cy="56" rx="30" ry="43" transform="rotate(18 44 56)" className="f-ink" />
      <ellipse cx="38" cy="50" rx="30" ry="43" transform="rotate(18 38 50)" className="f-espresso st" strokeWidth="4" />
      <path d="M50 10 C28 34 56 58 26 92" className="st-paper" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Three curls of steam, drawn as ink lines. Each path carries .steam-line for animation. */
export function Steam({ className, ...rest }: P) {
  return (
    <svg viewBox="0 0 160 200" className={className} aria-hidden="true" focusable="false" fill="none" {...rest}>
      <path className="steam-line st" strokeWidth="6" strokeLinecap="round" d="M40 190 C10 150 70 130 40 90 C10 50 60 30 44 6" />
      <path className="steam-line st" strokeWidth="6" strokeLinecap="round" d="M84 186 C56 150 112 128 84 88 C58 52 104 30 88 4" />
      <path className="steam-line st" strokeWidth="6" strokeLinecap="round" d="M126 190 C100 156 150 134 126 96 C104 62 144 42 130 14" />
    </svg>
  );
}

/** A graffiti splat: the colour field behind the hero cup. */
export function Splash({ className, tone = "f-orange", ...rest }: P & { tone?: string }) {
  const d =
    "M262 40 C300 36 318 88 352 92 C392 96 420 52 452 74 C486 98 446 150 470 182 C494 214 556 214 556 258 C556 302 494 300 484 338 C474 378 522 420 494 452 C466 484 418 446 382 462 C344 480 340 540 298 542 C254 544 252 486 214 474 C176 462 130 506 100 476 C70 446 112 402 98 366 C84 330 22 330 20 288 C18 246 76 238 86 200 C96 162 54 120 84 92 C114 64 158 104 194 92 C230 80 226 44 262 40 Z";
  return (
    <svg viewBox="0 0 580 580" className={className} aria-hidden="true" focusable="false" {...rest}>
      <path d={d} className="f-ink" transform="translate(12 12)" />
      <path d={d} className={`${tone} st`} strokeWidth="5" strokeLinejoin="round" />
      <circle cx="530" cy="96" r="16" className={`${tone} st`} strokeWidth="4" />
      <circle cx="48" cy="520" r="22" className={`${tone} st`} strokeWidth="4" />
      <circle cx="560" cy="400" r="9" className={`${tone} st`} strokeWidth="3" />
    </svg>
  );
}
