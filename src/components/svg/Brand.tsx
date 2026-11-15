import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { tone?: string };

/** The BOOST mark: a lightning bolt with a hard ink extrusion, like the cup print. */
export function Bolt({ tone = "f-peach", className, ...rest }: P) {
  const d = "M40 4 L8 56 H31 L22 96 L60 38 H36 L47 4 Z";
  return (
    <svg viewBox="0 0 70 104" className={className} aria-hidden="true" focusable="false" {...rest}>
      <path d={d} className="f-ink" transform="translate(5 5)" />
      <path d={d} className={`${tone} st`} strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  );
}

/** Inline-sized icons for running text (manifesto). 1em square. */
export function InlineIcon({ kind }: { kind: "cup" | "bolt" | "bean" | "note" }) {
  return (
    <span className={`inline-icon inline-icon--${kind}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" focusable="false">
        {kind === "cup" && (
          <>
            <path d="M10 14 H38 L34 42 H14 Z" className="f-paper st" strokeWidth="3" strokeLinejoin="round" />
            <path d="M8 8 H40 V14 H8 Z" className="f-ink" />
            <path d="M16 24 h16 M17 31 h14" className="st" strokeWidth="3" strokeLinecap="round" />
          </>
        )}
        {kind === "bolt" && (
          <path d="M27 3 L9 27 H22 L17 45 L39 19 H26 L32 3 Z" className="f-orange st" strokeWidth="3" strokeLinejoin="round" />
        )}
        {kind === "bean" && (
          <>
            <ellipse cx="24" cy="24" rx="14" ry="19" transform="rotate(28 24 24)" className="f-espresso st" strokeWidth="3" />
            <path d="M29 8 C18 18 31 29 19 40" className="st-paper" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        )}
        {kind === "note" && (
          <>
            <path d="M18 34 V8 L40 4 V30" className="st" strokeWidth="3.5" fill="none" strokeLinejoin="round" />
            <ellipse cx="13" cy="36" rx="7" ry="5.5" className="f-khaki st" strokeWidth="3" />
            <ellipse cx="35" cy="32" rx="7" ry="5.5" className="f-forest st" strokeWidth="3" />
          </>
        )}
      </svg>
    </span>
  );
}
