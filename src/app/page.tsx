import { JsonLd } from "@/components/seo/json-ld";
import { websiteSchema, faqPageSchema } from "@/lib/schema";
import { FAQ_ITEMS } from "@/config/faq";
import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { WorkSection } from "@/components/marketing/work-section";
import { LiveDemosSection } from "@/components/marketing/live-demos-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PricingSection } from "@/components/marketing/pricing-section";
import { GuidesSection } from "@/components/marketing/guides-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { ContactSection } from "@/components/marketing/contact-section";
import { SiteFooter } from "@/components/marketing/site-footer";

// The demos read from the demo Odoo; re-fetch at most every 45 seconds.
export const revalidate = 45;

export default function Home() {
  return (
    <>
      <JsonLd data={websiteSchema()} />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <WorkSection />
        <LiveDemosSection />
        <HowItWorks />
        <PricingSection />
        <GuidesSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
