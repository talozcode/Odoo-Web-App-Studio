import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { CONTACT_SECTION_ID } from "@/config/site";
import { BRAND_TAGLINE } from "@/config/brand";
import { OdooCluster } from "./odoo-cluster";
import { ApiConnector } from "./api-connector";
import { TodaysPicksCard } from "@/components/demo-apps/todays-picks-card";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-[var(--border)]">
      <Image
        src="/images/hero-network.webp"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="pointer-events-none select-none object-cover object-right"
      />
      {/* Soft scrim so headline/copy text stays at full contrast over the
          busy part of the background image, without washing out the color
          behind the demo-app cards further down/right. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 18%, var(--background) 0%, var(--background) 45%, transparent 80%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base font-medium text-[var(--muted-foreground)]">
            {BRAND_TAGLINE}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            Odoo doesn&apos;t have to feel like Odoo.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--muted-foreground)]">
            We build fast, beautiful web apps connected to your existing
            Odoo. Give your team, customers and suppliers exactly what they
            need, and nothing they don&apos;t.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={`#${CONTACT_SECTION_ID}`}>
              Tell us what you want to simplify
            </ButtonLink>
            <ButtonLink href="#examples" variant="secondary">
              See examples
            </ButtonLink>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
          <div className="flex justify-center lg:justify-end">
            <OdooCluster />
          </div>

          <ApiConnector className="hidden w-32 lg:flex" />
          <ApiConnector
            orientation="vertical"
            className="mx-auto flex h-16 lg:hidden"
          />

          <div className="flex justify-center lg:justify-start">
            <TodaysPicksCard />
          </div>
        </div>
      </div>
    </section>
  );
}
