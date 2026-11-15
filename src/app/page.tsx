import { Preloader } from "@/components/ui/Preloader";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Manifesto } from "@/components/sections/Manifesto";
import { Drinks } from "@/components/sections/Drinks";
import { Process } from "@/components/sections/Process";
import { MenuList } from "@/components/sections/MenuList";
import { Visit } from "@/components/sections/Visit";

export default function Home() {
  return (
    <>
      <Preloader />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquee />
        <Manifesto />
        <Drinks />
        <Process />
        <MenuList />
        <Visit />
      </main>
    </>
  );
}
