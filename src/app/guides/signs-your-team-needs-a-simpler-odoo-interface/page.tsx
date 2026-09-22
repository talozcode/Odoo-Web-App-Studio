import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "signs-your-team-needs-a-simpler-odoo-interface";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/odoo-warehouse-app", label: "Odoo warehouse app" },
        { href: "/odoo-sales-app", label: "Odoo sales app" },
        { href: "/custom-odoo-web-app", label: "Custom Odoo web apps" },
      ]}
    >
      <GuideSection heading="What does 'needing a simpler interface' actually look like day to day?">
        <p>
          Usually not a dramatic failure. More often a quiet workaround.
          Staff keep a parallel spreadsheet, a whiteboard, or a paper log
          alongside Odoo because it&apos;s genuinely faster for their specific,
          repetitive task than the Odoo screen meant to handle it. Or a
          manager finds themselves walking over to explain the same short
          sequence of clicks to the same person every week, months after
          they were first trained.
        </p>
      </GuideSection>

      <GuideSection heading="Why does this happen even though Odoo can technically do the job?">
        <p>
          Because Odoo&apos;s backend interface is a general-purpose tool built
          to be configured for many different roles (accountants,
          warehouse staff, sales managers, admins) from the same underlying
          form and list views. That flexibility is exactly what makes Odoo
          powerful as an ERP, but it also means any single repetitive task
          carries some navigation and cognitive overhead that a
          purpose-built screen for that one task wouldn&apos;t have.
        </p>
      </GuideSection>

      <GuideSection heading="What are the concrete signals worth watching for?">
        <p>
          A few recurring patterns are worth treating as real signals rather
          than one-off complaints: new hires take noticeably longer than
          expected to work independently on one specific Odoo screen; the
          same data-entry mistake keeps happening (wrong location, wrong
          product, wrong quantity) despite training; a workflow only
          reliably works because one specific person has memorized an exact
          sequence of clicks that isn&apos;t written down anywhere; staff using
          phones or handhelds visibly struggle with a view that was really
          designed for a desktop screen and a mouse; or external people
          (drivers, suppliers, customers) are being asked to use Odoo
          directly and finding it confusing or intimidating.
        </p>
      </GuideSection>

      <GuideSection heading="How do you tell 'needs more training' from 'needs a simpler interface'?">
        <p>
          If the same friction shows up across multiple different people who
          were all trained reasonably well, the honest read is usually that
          the interface doesn&apos;t match the task, not that everyone
          individually failed to learn it. Training fixes a knowledge gap;
          it doesn&apos;t fix a screen that requires ten fields of attention for
          a task that&apos;s conceptually one decision.
        </p>
      </GuideSection>

      <GuideSection heading="What's a lightweight way to test this before committing to a build?">
        <p>
          Ask the person actually doing the task to narrate, in plain
          language, exactly what they need to see and exactly what they need
          to do, nothing more. Then compare that against how many Odoo
          screens, filters, and clicks it currently takes to get there. A
          small gap probably isn&apos;t worth a new app. A large, consistent gap
          (where the real task is one clear action buried inside a much
          bigger interface) is usually a sign that a focused screen would
          pay for itself quickly.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
