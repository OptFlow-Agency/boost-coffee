import type { MenuIcon } from "@/content/site";

/** Small drinks for the menu's floating cursor follower and the touch list. */
export function MenuArt({ icon, className }: { icon: MenuIcon; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      {icon === "cup" && (
        <>
          <ellipse cx="100" cy="160" rx="80" ry="14" className="f-ink" />
          <path d="M44 72 H156 Q154 150 100 150 Q46 150 44 72 Z" className="f-orange st" strokeWidth="5" strokeLinejoin="round" />
          <path d="M154 86 Q186 86 182 110 Q178 132 146 128" className="st" strokeWidth="7" fill="none" strokeLinecap="round" />
          <ellipse cx="100" cy="72" rx="56" ry="10" className="f-crema st" strokeWidth="5" />
        </>
      )}
      {icon === "mug" && (
        <>
          <path d="M50 54 H142 V156 Q142 170 128 170 H64 Q50 170 50 156 Z" className="f-ink" transform="translate(7 7)" />
          <path d="M50 54 H142 V156 Q142 170 128 170 H64 Q50 170 50 156 Z" className="f-peach st" strokeWidth="5" strokeLinejoin="round" />
          <path d="M142 80 Q178 80 176 110 Q174 140 142 138" className="st" strokeWidth="8" fill="none" />
          <path d="M70 34 q-10 -14 0 -26 M96 34 q-10 -14 0 -26 M122 34 q-10 -14 0 -26" className="st" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M70 100 l18 -18 l18 18 l18 -18" className="st" strokeWidth="5" fill="none" strokeLinejoin="round" />
        </>
      )}
      {icon === "glass" && (
        <>
          <path d="M58 52 H142 L132 166 H68 Z" className="f-ice st" strokeWidth="5" strokeLinejoin="round" />
          <path d="M63 96 H137 L132 160 H68 Z" className="f-espresso" />
          <path d="M62 86 H138 L137 100 H63 Z" className="f-milk" />
          <path d="M58 52 H142 L132 166 H68 Z" className="st" strokeWidth="5" strokeLinejoin="round" fill="none" />
        </>
      )}
      {icon === "tall" && (
        <>
          <path d="M60 30 H140 L128 180 H72 Z" className="f-ice st" strokeWidth="5" strokeLinejoin="round" />
          <path d="M64 70 H136 L128 176 H72 Z" className="f-milk" />
          <path d="M66 110 H134 L128 176 H72 Z" className="f-espresso" />
          <rect x="80" y="60" width="30" height="30" rx="6" transform="rotate(-12 95 75)" className="f-ice st" strokeWidth="4" />
          <path d="M118 8 L106 150" className="st-khaki" strokeWidth="9" strokeLinecap="round" />
          <path d="M60 30 H140 L128 180 H72 Z" className="st" strokeWidth="5" strokeLinejoin="round" fill="none" />
        </>
      )}
      {icon === "leaf" && (
        <>
          <path d="M100 176 C40 150 30 80 100 24 C170 80 160 150 100 176 Z" className="f-ink" transform="translate(7 7)" />
          <path d="M100 176 C40 150 30 80 100 24 C170 80 160 150 100 176 Z" className="f-sage st" strokeWidth="5" />
          <path d="M100 40 V170 M100 84 l-26 -18 M100 116 l30 -20 M100 140 l-22 -14" className="st" strokeWidth="5" fill="none" strokeLinecap="round" />
        </>
      )}
      {icon === "pot" && (
        <>
          <path d="M40 90 Q40 170 100 170 Q160 170 160 90 Z" className="f-ink" transform="translate(7 7)" />
          <path d="M40 90 Q40 170 100 170 Q160 170 160 90 Z" className="f-forest st" strokeWidth="5" />
          <path d="M34 90 H166" className="st" strokeWidth="6" strokeLinecap="round" />
          <path d="M160 104 Q190 96 196 70" className="st" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M82 76 Q100 50 118 76" className="st" strokeWidth="7" fill="none" />
          <circle cx="100" cy="128" r="14" className="f-peach st" strokeWidth="4" />
        </>
      )}
    </svg>
  );
}
