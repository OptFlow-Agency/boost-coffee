import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brandHex as c, site } from "@/content/site";
import { LOGO_LETTERS, LOGO_VIEWBOX } from "@/components/svg/Logo";

export const alt = "The Boost coffee logo on cream, with the line Coffee with the volume up";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The OG card: the supplied logo, large, on the cream paper with the palette as a band of fields. */
export default async function Image() {
  const clash = await readFile(join(process.cwd(), "src/app/fonts/ClashDisplay-700.ttf"));
  const bands = [c.orange, c.peach, c.khaki, c.sage, c.forest];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: c.paper, fontFamily: "Clash" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", gap: 36 }}>
          <svg width="820" height="243" viewBox={LOGO_VIEWBOX} aria-hidden="true">
            {LOGO_LETTERS.map((l) => (
              <path key={l.key} d={l.d} fill={l.part === "word" ? c.logoInk : c.logo} />
            ))}
          </svg>
          <div style={{ fontSize: 52, color: c.ink, letterSpacing: -1 }}>{site.tagline}</div>
        </div>
        <div style={{ display: "flex", height: 56 }}>
          {bands.map((b) => (
            <div key={b} style={{ flex: 1, background: b }} />
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Clash", data: clash, weight: 700, style: "normal" }] },
  );
}
