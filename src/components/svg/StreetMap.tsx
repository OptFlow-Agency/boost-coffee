/**
 * An abstract street map, not to scale: city blocks, one avenue, a river,
 * a park, and a route that draws itself to the bolt pin.
 */
export function StreetMap({ className }: { className?: string }) {
  const blocks: [number, number, number, number][] = [
    [30, 30, 120, 90], [170, 30, 150, 90], [340, 30, 90, 90], [450, 30, 120, 150],
    [30, 140, 120, 120], [170, 140, 70, 120], [260, 140, 170, 60], [450, 200, 120, 100],
    [30, 280, 210, 70], [260, 220, 170, 130], [30, 370, 120, 200], [170, 370, 130, 90],
    [320, 370, 110, 90], [450, 320, 120, 140], [170, 480, 260, 90], [450, 480, 120, 90],
  ];
  return (
    <svg viewBox="0 0 600 600" className={className} role="img" aria-label="Illustrated map of the streets around Boost, not to scale">
      <rect x="0" y="0" width="600" height="600" rx="32" className="f-ink" transform="translate(10 10)" />
      <rect x="0" y="0" width="600" height="600" rx="32" className="f-paper st" strokeWidth="5" />
      <g className="map-blocks">
        {blocks.map(([x, y, w, h], i) => (
          <rect key={i} className={`map-block ${i === 9 ? "f-peach" : "f-paper-2"} st`} strokeWidth="3" x={x} y={y} width={w} height={h} rx="10" />
        ))}
      </g>
      <path className="map-river f-ice st" strokeWidth="3" d="M-10 470 C80 430 120 520 210 470 S 330 400 420 470 S 560 520 620 460 V 520 C 560 580 480 520 420 530 S 300 470 210 530 S 80 500 -10 540 Z" opacity="0.95" />
      <path className="map-park f-sage st" strokeWidth="3" d="M40 160 h100 v90 h-100 Z" />
      <circle cx="70" cy="190" r="12" className="f-ink" />
      <circle cx="105" cy="215" r="9" className="f-ink" />
      <path className="map-avenue st" strokeWidth="18" d="M0 600 L600 0" opacity="0.12" />
      <path className="map-route st-orange" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" d="M40 585 V 362 H 248 V 210 H 345" />
      <g className="map-pin">
        <circle cx="345" cy="210" r="40" className="f-ink" transform="translate(6 6)" />
        <circle cx="345" cy="210" r="40" className="f-orange st" strokeWidth="5" />
        <path d="M352 182 L330 216 H346 L340 242 L364 206 H348 L356 182 Z" className="f-peach st" strokeWidth="3.5" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
