# BOOST

A one-page coffee bar site with three subpages, built from the BOOST cup's marker doodles and the shop's own palette and logo. There are no photographs; every picture is an SVG component.

Next.js 16 (App Router) · TypeScript · Tailwind 4 · GSAP 3.15 (ScrollTrigger, SplitText, DrawSVG, MorphSVG) · Lenis.

## Run it

```bash
cd site
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
npm run lint
```

Node 20.9 or newer.

> Dev note: Turbopack's Tailwind loader occasionally misses an edit to `globals.css`. If a style change doesn't show up, stop the dev server, delete `.next`, and start it again.

## Where to change things

| What | File |
| --- | --- |
| Brand colours, type scale, spacing, radii | `src/app/styles/tokens.css` (one `@theme` block; every colour on the site comes from here). Palette: ink `#09251C`, ink-2 `#163022`, paper `#F8EBDF`, peach `#F3D2AF`, orange `#A55704`, forest `#0A400C`, sage `#819067`, khaki `#B2AE88` |
| Logo | `src/components/svg/Logo.tsx`, generated from `boost-logo.svg` and split into letters (B, o, o, s, t, coffee) so it can animate. To swap it, replace the `d` strings and `LOGO_VIEWBOX`; the favicon is `src/app/icon.svg` |
| The same colours as hex, for the OG image and browser theme colour | `brandHex` in `src/content/site.ts` (keep in step with the tokens) |
| Tagline, hero line, description, domain | `site` in `src/content/site.ts` |
| **Address and opening hours** | `site.address` and `site.hours` in `src/content/site.ts`. While they are `null`, the page shows a dashed "to be added" blank, never an invented value |
| "Get directions" link | `site.directions` |
| Instagram and other socials | `site.socials` (currently points at instagram.com; set the real profile) |
| Menu items and notes | `menu` in `src/content/site.ts` |
| The four signature drinks (name, line, colour world, glass type, liquid level) | `drinks` |
| Marquee words | `marquee` |
| Bean-to-cup steps | `process` |
| Nav and footer links | `nav` |
| Fonts | `src/app/layout.tsx` (Clash Display + Satoshi, self-hosted from Fontshare in `src/app/fonts/`) |

## Structure

```
src/
  app/
    layout.tsx            fonts, metadata, providers, nav, footer, cursor, grain, colour fields
    page.tsx              home: preloader, hero, marquee, manifesto, drinks, process, menu, visit
    menu/ about/ contact/ subpages (route changes run the curtain transition)
    opengraph-image.tsx   OG card rendered from the brand shapes (next/og)
    icon.svg robots.ts sitemap.ts
    globals.css           all component styles (Hallmark stamp at the top)
    styles/tokens.css     design tokens   styles/base.css  base rules
  content/site.ts         every word, item, link and fact
  lib/gsap.ts             plugin registration, reduced-motion and pointer helpers
  lib/intro.ts            preloader → hero handoff
  components/
    providers/SmoothScroll.tsx  Lenis wired to GSAP (lerp 0.08, ticker, lagSmoothing(0)); stopScroll/startScroll/scrollToTarget
    providers/Transition.tsx    two-colour curtain between routes
    ui/       Nav (+ overlay menu), Preloader, Cursor, Magnetic, TransitionLink, BgFields, Grain
    sections/ Hero, Marquee, Manifesto, Drinks, Process, MenuList, Visit, Footer, Room, PageHead
    svg/      Bolt, InlineIcon, Bean, Steam, Splash, HeroCup, DrinkCup, MenuArt, StreetMap
```

## How the motion works

- **Lenis + GSAP:** `SmoothScroll.tsx`. Lenis stops during the preloader, while the overlay menu is open and during route transitions. Under `prefers-reduced-motion` Lenis isn't created at all (native scroll).
- **Colour fields:** every section with `data-field="…"` gets a fixed full-screen layer that fades in, scrubbed, as the section arrives (opacity only). Without JavaScript, or under reduced motion, sections paint their own colour.
- **Preloader:** the BOOST letters fill with liquid while a bolt charges from 0 to 100, then the screen wipes up. It appears only on the first load, shows only with JavaScript, and removes itself after 6 s whatever happens.
- **Hero:** masked character reveal; an SVG turbulence/displacement filter ripples the wordmark while the mouse moves and switches off when it stops; beans and steam move with the pointer and the scroll.
- **Marquee:** speed and direction follow `lenis.velocity`. It pauses on hover, on focus, off screen and with its visible pause button.
- **Drinks:** pinned horizontal scroll on screens 768px and wider; colour layers cross-fade between cards; each glass fills as its card enters (`containerAnimation`). Phones get a vertical stack.
- **Process:** pinned and scrubbed: DrawSVG line art per stage, with one MorphSVG shape going bean → grounds → drop → cup.
- **Menu:** on the home page, rows flood with colour and a drawing of the drink trails the cursor and leans with your movement. Touch devices show every note instead.
- **Footer:** letters rise as the footer scrolls in, and stretch and skew toward the cursor. "Back to top" uses `lenis.scrollTo`.
- **Cursor and magnetic buttons:** fine pointers only. `data-cursor="View"` on any element sets the cursor's label.

Everything animates `transform` or `opacity`, except where the brief asked otherwise: SVG stroke drawing, the morph and the hero's displacement filter.

## Checked

- `tsc`, `eslint` and `next build` all clean; no console errors at 1440px and 390px.
- Lighthouse (mobile, production build): home 93 / 96 / 100 / 100, /menu 94 / 100 / 100 / 100 (performance / accessibility / best practices / SEO).
- Hallmark sloplint (static and render tiers): 0 FAIL on all four routes. Waivers and answers are recorded at the top of `globals.css`.
