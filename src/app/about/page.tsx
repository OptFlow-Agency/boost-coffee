import type { Metadata } from "next";
import { Room } from "@/components/sections/Room";

export const metadata: Metadata = {
  title: "The room",
  description: "Murals, neon, marble tables, timber slats and a cup covered in doodles.",
};

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1} className="page">
      <Room />
    </main>
  );
}
