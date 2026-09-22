import { JsonLd } from "@/components/seo/json-ld";
import { websiteSchema, faqPageSchema } from "@/lib/schema";
import { FAQ_ITEMS } from "@/config/faq";
import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { CredibilityStrip } from "@/components/marketing/credibility-strip";
import { ProblemSection } from "@/components/marketing/problem-section";
import { ExamplesSection } from "@/components/marketing/examples-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { BeforeAfterSection } from "@/components/marketing/before-after-section";
import { ContactSection } from "@/components/marketing/contact-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { PhilosophySection } from "@/components/marketing/philosophy-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function Home() {
  return (
    <>
      <JsonLd data={websiteSchema()} />
      <JsonLd data={faqPageSchema(FAQ_ITEMS)} />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <CredibilityStrip />
        <ProblemSection />
        <HowItWorks />
        <ExamplesSection />
        <BeforeAfterSection />
        <PhilosophySection />
        <PricingSection />
        <FaqSection />
        <ContactSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
