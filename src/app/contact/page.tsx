import type { Metadata } from "next";
import { Visit } from "@/components/sections/Visit";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Find us",
  description: "Directions to Boost, the coffee bar with ink on every cup.",
};

export default function ContactPage() {
  return (
    <main id="main" tabIndex={-1} className="page">
      <Visit as="h1" />
      <section className="say" data-field="peach" aria-labelledby="say-title">
        <div className="container say__in">
          <h2 id="say-title" className="section-head">Say hi on Instagram</h2>
          <p className="say__line">New drinks and new doodles go up there first.</p>
          {site.socials.map((s) => (
            <a key={s.label} className="btn btn--ink btn--big" href={s.href} target="_blank" rel="noreferrer" data-cursor="Go">
              Open {s.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
