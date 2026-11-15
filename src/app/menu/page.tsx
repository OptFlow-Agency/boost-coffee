import type { Metadata } from "next";
import { MenuList } from "@/components/sections/MenuList";
import { Marquee } from "@/components/sections/Marquee";
import { PageHead } from "@/components/sections/PageHead";
import { MenuArt } from "@/components/svg/MenuIcons";

export const metadata: Metadata = {
  title: "Menu",
  description: "Espresso, flat whites, iced lattes, matcha and more on the bar at Boost.",
};

export default function MenuPage() {
  return (
    <main id="main" tabIndex={-1} className="page">
      <PageHead
        lines={["Everything", "on the bar"]}
        lede="Coffee first, then everything that is not coffee."
        art={
          <>
            <MenuArt icon="tall" className="phead__a phead__a--1" />
            <MenuArt icon="cup" className="phead__a phead__a--2" />
            <MenuArt icon="leaf" className="phead__a phead__a--3" />
          </>
        }
      />
      <MenuList variant="full" />
      <Marquee />
    </main>
  );
}
