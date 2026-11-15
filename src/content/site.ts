/**
 * BOOST content. Copy, menu, drinks, address, hours and links all live here.
 * Anything set to `null` renders as a dashed "to be added" blank on the page,
 * never as an invented value. Fill it in and the blank disappears.
 */

export type Field = "orange" | "peach" | "khaki" | "forest" | "sage" | "paper" | "ink";

export const site = {
  name: "Boost",
  url: "https://boost.example.com", // TODO: your real domain (used for metadata and the OG image)
  tagline: "Coffee with the volume up.",
  heroLine: "Espresso under neon, at marble tables, in cups covered in ink.",
  description:
    "Boost is a coffee bar with ink on every cup, murals on the walls and neon over the bar.",

  /** Facts the page needs but nobody has given yet. Replace null with a string. */
  address: null as string | null, // e.g. "12 Example Street, City"
  hours: null as string | null, // e.g. "Every day, 8:00 to 23:00"
  /** Google Maps search used by every "Get directions" button. */
  directions: "https://www.google.com/maps/search/?api=1&query=Boost+coffee",

  socials: [
    // TODO: point this at the shop's real Instagram profile.
    { label: "Instagram", href: "https://www.instagram.com/" },
  ],
} as const;

/**
 * Brand colours as hex, for places CSS variables cannot reach (the generated
 * OG image, the browser theme colour). Keep in step with src/app/styles/tokens.css.
 */
export const brandHex = {
  paper: "#F8EBDF",
  ink: "#09251C",
  orange: "#A55704",
  peach: "#F3D2AF",
  khaki: "#B2AE88",
  forest: "#0A400C",
  sage: "#819067",
  logo: "#2A7C13",
  logoInk: "#0A0A0A",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "The room", href: "/about" },
  { label: "Find us", href: "/contact" },
] as const;

export const marquee = ["Espresso", "Flat white", "Iced latte", "Cortado", "Matcha latte", "Cappuccino"];

export type DrinkKind = "espresso" | "cappuccino" | "iced" | "matcha";

export const drinks: { name: string; line: string; kind: DrinkKind; field: Field; level: number }[] = [
  { name: "Espresso", line: "A short shot with a cap of crema.", kind: "espresso", field: "orange", level: 0.55 },
  { name: "Cappuccino", line: "Espresso under a deep cap of foam.", kind: "cappuccino", field: "khaki", level: 0.86 },
  { name: "Iced latte", line: "Espresso poured over ice and cold milk.", kind: "iced", field: "forest", level: 0.8 },
  { name: "Matcha latte", line: "Whisked matcha with steamed milk, no espresso.", kind: "matcha", field: "sage", level: 0.78 },
];

export type MenuIcon = "cup" | "glass" | "tall" | "mug" | "leaf" | "pot";

export const menu: { group: string; items: { name: string; line: string; icon: MenuIcon }[] }[] = [
  {
    group: "Coffee",
    items: [
      { name: "Espresso", line: "A short shot with a cap of crema.", icon: "cup" },
      { name: "Americano", line: "Espresso stretched with hot water.", icon: "mug" },
      { name: "Cortado", line: "Espresso cut with the same of warm milk.", icon: "glass" },
      { name: "Flat white", line: "Espresso under thin, silky milk.", icon: "cup" },
      { name: "Cappuccino", line: "Espresso under a deep cap of foam.", icon: "mug" },
      { name: "Iced latte", line: "Espresso over ice and cold milk.", icon: "tall" },
    ],
  },
  {
    group: "Not coffee",
    items: [
      { name: "Matcha latte", line: "Whisked matcha with steamed milk.", icon: "leaf" },
      { name: "Hot chocolate", line: "Dark chocolate melted into hot milk.", icon: "mug" },
      { name: "Tea", line: "Black, green or herbal, by the pot.", icon: "pot" },
    ],
  },
];

export const process = [
  { step: "Bean", line: "Roasted beans wait in the hopper." },
  { step: "Grind", line: "Ground fine, the way espresso wants it." },
  { step: "Pull", line: "Hot water pushed through the puck under pressure." },
  { step: "Cup", line: "Into a cup with ink all over it." },
];
