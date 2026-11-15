/**
 * The BOOST takeaway cup: black lid, white body covered in marker doodles
 * (piano keys, records, swirls, arrows) and a bolt badge in graffiti colours.
 */
export function HeroCup({ className }: { className?: string }) {
  const body = "M54 120 H286 L254 452 Q252 470 234 470 H106 Q88 470 86 452 Z";
  return (
    <svg viewBox="0 0 340 500" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="cup-body">
          <path d={body} />
        </clipPath>
      </defs>
      {/* extrusion */}
      <path d={body} className="f-ink" transform="translate(10 10)" />
      <path d="M36 78 H304 L296 120 H44 Z" className="f-ink" transform="translate(10 10)" />

      {/* body */}
      <path d={body} className="f-paper" />
      <g clipPath="url(#cup-body)" className="cup-doodles" fill="none">
        {/* piano keys band */}
        <path d="M40 150 H300 V214 H40 Z" className="f-paper st" strokeWidth="3" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`k${i}`} d={`M${62 + i * 22} 150 V214`} className="st" strokeWidth="2.5" />
        ))}
        {[0, 1, 3, 4, 5, 7, 8, 10].map((i) => (
          <path key={`b${i}`} d={`M${55 + i * 22} 150 h14 v36 h-14 Z`} className="f-ink" />
        ))}
        {/* record */}
        <circle cx="98" cy="300" r="58" className="f-ink" />
        <circle cx="98" cy="300" r="44" className="st-paper" strokeWidth="2" />
        <circle cx="98" cy="300" r="32" className="st-paper" strokeWidth="2" />
        <circle cx="98" cy="300" r="14" className="f-khaki" />
        {/* swirls */}
        <path d="M180 410 c0-30 40-30 40 0 s-28 22-28 0 s14-12 14 0" className="st" strokeWidth="3" />
        <path d="M250 260 c20 0 30 20 14 32 s-30 0-18-14" className="st" strokeWidth="3" />
        <path d="M60 400 q20 -26 40 0 t40 0 t40 0" className="st" strokeWidth="3" />
        <path d="M200 236 l40 -12 m-8 -10 l8 10 l-10 8" className="st" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="270" cy="350" r="9" className="st" strokeWidth="3" />
        <circle cx="150" cy="450" r="12" className="st" strokeWidth="3" />
        {/* badge */}
        <circle cx="196" cy="318" r="64" className="f-ink" transform="translate(7 7)" />
        <circle cx="196" cy="318" r="64" className="f-orange st" strokeWidth="4" />
        <path d="M206 262 L170 324 H196 L186 374 L228 306 H202 L214 262 Z" className="f-peach st" strokeWidth="4" strokeLinejoin="round" />
      </g>
      <path d={body} className="st" strokeWidth="5" strokeLinejoin="round" fill="none" />

      {/* lid */}
      <path d="M36 78 H304 L296 120 H44 Z" className="f-ink" />
      <path d="M74 40 H266 L282 78 H58 Z" className="f-ink-2 st" strokeWidth="4" strokeLinejoin="round" />
      <path d="M124 52 H216" className="st-paper" strokeWidth="5" strokeLinecap="round" />
      <path d="M48 96 H292" className="st-paper" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}
