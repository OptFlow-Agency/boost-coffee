import type { DrinkKind } from "@/content/site";

/**
 * A glass drink with a visible liquid level. The `.liquid` group starts at its
 * final level; the Drinks section tweens it up from below the glass, and the
 * `.wave` path slides sideways so the surface moves. Everything is transform.
 */

type Shape = {
  glass: string; // outline of the vessel
  inner: string; // clip for the liquid
  top: number; // y of the inside rim
  bottom: number; // y of the inside floor
  extra?: React.ReactNode; // saucer, handle, straw, ice
  layers: (y: number, h: number) => React.ReactNode; // liquid bands, y = surface
};

const wave = (y: number, cls: string) => (
  <path
    className={`wave ${cls}`}
    d={`M-200 ${y} q25 -12 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V 460 H -200 Z`}
  />
);

const shapes: Record<DrinkKind, Shape> = {
  espresso: {
    glass: "M128 168 L146 318 Q148 334 164 334 H236 Q252 334 254 318 L272 168 Z",
    inner: "M134 176 L150 314 Q152 326 166 326 H234 Q248 326 250 314 L266 176 Z",
    top: 176,
    bottom: 326,
    extra: (
      <>
        <ellipse cx="200" cy="350" rx="140" ry="22" className="f-ink" transform="translate(8 8)" />
        <ellipse cx="200" cy="350" rx="140" ry="22" className="f-paper st" strokeWidth="5" />
        <ellipse cx="200" cy="346" rx="70" ry="9" className="st" strokeWidth="3" fill="none" />
      </>
    ),
    layers: (y) => (
      <>
        {wave(y, "f-crema")}
        <rect x="-200" y={y + 22} width="800" height="300" className="f-espresso" />
      </>
    ),
  },
  cappuccino: {
    glass: "M92 150 H308 L292 300 Q284 338 248 338 H152 Q116 338 108 300 Z",
    inner: "M100 158 H300 L285 298 Q278 330 247 330 H153 Q122 330 115 298 Z",
    top: 158,
    bottom: 330,
    extra: (
      <>
        <path d="M304 186 Q366 182 362 236 Q358 286 296 280" className="st" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d="M304 186 Q366 182 362 236 Q358 286 296 280" className="st-paper" strokeWidth="5" fill="none" strokeLinecap="round" />
        <ellipse cx="200" cy="352" rx="150" ry="20" className="f-ink" />
      </>
    ),
    layers: (y) => (
      <>
        {wave(y, "f-milk")}
        <circle cx="160" cy={y + 18} r="6" className="st" strokeWidth="2.5" fill="none" />
        <circle cx="230" cy={y + 26} r="4" className="st" strokeWidth="2.5" fill="none" />
        <circle cx="262" cy={y + 14} r="5" className="st" strokeWidth="2.5" fill="none" />
        <rect x="-200" y={y + 52} width="800" height="60" className="f-crema" />
        <rect x="-200" y={y + 112} width="800" height="300" className="f-espresso" />
      </>
    ),
  },
  iced: {
    glass: "M112 52 H288 L266 352 Q264 368 248 368 H152 Q136 368 134 352 Z",
    inner: "M120 60 H280 L259 346 Q257 360 245 360 H155 Q143 360 141 346 Z",
    top: 60,
    bottom: 360,
    extra: (
      <>
        <path d="M232 18 L214 300" className="st" strokeWidth="18" strokeLinecap="round" />
        <path d="M232 18 L214 300" className="st-orange" strokeWidth="10" strokeLinecap="round" />
      </>
    ),
    layers: (y) => (
      <>
        {wave(y, "f-milk")}
        <rect x="-200" y={y + 70} width="800" height="34" className="f-crema" />
        <rect x="-200" y={y + 104} width="800" height="400" className="f-espresso" />
      </>
    ),
  },
  matcha: {
    glass: "M110 110 H290 L274 344 Q272 360 256 360 H144 Q128 360 126 344 Z",
    inner: "M118 118 H282 L267 338 Q265 352 253 352 H147 Q135 352 133 338 Z",
    top: 118,
    bottom: 352,
    extra: (
      <>
        <path d="M262 92 L238 300" className="st" strokeWidth="18" strokeLinecap="round" />
        <path d="M262 92 L238 300" className="st-sage" strokeWidth="10" strokeLinecap="round" />
      </>
    ),
    layers: (y) => (
      <>
        {wave(y, "f-milk")}
        <rect x="-200" y={y + 46} width="800" height="400" className="f-matcha" />
      </>
    ),
  },
};

export function DrinkCup({ kind, level, className, id }: { kind: DrinkKind; level: number; className?: string; id: string }) {
  const s = shapes[kind];
  const y = s.bottom - level * (s.bottom - s.top);
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`glass-${id}`}>
          <path d={s.inner} />
        </clipPath>
      </defs>
      <path d={s.glass} className="f-ink" transform="translate(10 10)" />
      <path d={s.glass} className="f-ice" />
      <g clipPath={`url(#glass-${id})`}>
        <g className="liquid" data-drop={s.bottom - y + 40}>
          {s.layers(y, s.bottom - y)}
        </g>
        {kind === "iced" && (
          <g className="ice">
            <rect x="150" y={y - 30} width="56" height="56" rx="10" transform={`rotate(-14 178 ${y})`} className="f-ice st" strokeWidth="4" opacity="0.9" />
            <rect x="200" y={y + 20} width="52" height="52" rx="10" transform={`rotate(18 226 ${y + 46})`} className="f-ice st" strokeWidth="4" opacity="0.9" />
            <rect x="152" y={y + 70} width="48" height="48" rx="10" transform={`rotate(8 176 ${y + 94})`} className="f-ice st" strokeWidth="4" opacity="0.9" />
          </g>
        )}
      </g>
      {/* glass shine */}
      <path d={`M${kind === "cappuccino" ? 128 : 146} ${s.top + 20} L${kind === "cappuccino" ? 138 : 156} ${s.top + 110}`} className="st-paper" strokeWidth="8" strokeLinecap="round" />
      <path d={s.glass} className="st" strokeWidth="6" strokeLinejoin="round" fill="none" />
      {s.extra}
    </svg>
  );
}
