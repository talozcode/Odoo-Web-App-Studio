import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-studio-limitations";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/guides/odoo-customization-vs-custom-apps", label: "Odoo customization vs. custom apps" },
        { href: "/custom-odoo-web-app", label: "Custom Odoo web apps" },
        { href: "/guides/how-much-does-a-custom-odoo-app-cost", label: "How much does a custom Odoo app cost?" },
      ]}
    >
      <GuideSection heading="What is Odoo Studio actually good at?">
        <p>
          Genuinely a lot, and it deserves credit for it. Studio is Odoo&apos;s
          built-in no-code customization tool: it lets someone with no
          development background add fields to a form, rearrange a view,
          create a new report layout, add a simple automated action, or spin
          up a basic new model with its own list and form views, all from
          inside the Odoo UI, without writing a module. For the kind of
          tweak most businesses actually need day to day (&quot;we need one
          more field on this form,&quot; &quot;change this report&apos;s layout,&quot; &quot;add a
          simple approval step&quot;), Studio is fast, safe compared to editing
          code directly, and doesn&apos;t require hiring anyone.
        </p>
      </GuideSection>

      <GuideSection heading="Where does Studio start to struggle?">
        <p>
          With coordination across multiple models. Studio is built around
          editing one model&apos;s view or fields at a time, so a workflow that
          needs data to move between several models in a specific sequence,
          with conditional logic at each step, tends to outgrow what Studio&apos;s
          point-and-click tools were designed for. It also has limited reach
          into advanced security and permission configuration: fine-grained,
          conditional access rules (who can see or edit exactly what, under
          exactly which conditions) generally need real record rules and
          group configuration, which sits closer to Odoo development than
          to Studio&apos;s drag-and-drop scope.
        </p>
      </GuideSection>

      <GuideSection heading="Does Studio hold up at production scale, for complex logic?">
        <p>
          Not as well as hand-written code does. Studio-built automations
          and computed fields are convenient for straightforward rules, but
          once the logic gets genuinely complex (several branching
          conditions, calculations that depend on multiple related records,
          performance-sensitive computation over a lot of data) it becomes
          harder to build, harder to debug when something looks wrong, and
          harder for anyone else to understand later, compared to the same
          logic written directly in a custom module.
        </p>
      </GuideSection>

      <GuideSection heading="What happens to Studio customizations across an Odoo upgrade?">
        <p>
          They generally carry forward, but not with a guarantee of zero
          rework. Because Studio changes are still stored as real
          configuration inside Odoo (fields, views, rules), a major version
          upgrade or migration can require some of that configuration to be
          reviewed or redone, particularly for anything that leaned on a
          specific view layout or interaction that changed between versions.
          It&apos;s not unique to Studio (in-Odoo customization of any kind has
          this exposure), but it&apos;s worth planning for rather than assuming
          Studio work is upgrade-proof.
        </p>
      </GuideSection>

      <GuideSection heading="So where's the actual wall?">
        <p>
          The wall isn&apos;t &quot;Studio is bad,&quot; it&apos;s that Studio is a tool for
          changing Odoo&apos;s own screens, and some workflows need something
          that isn&apos;t an Odoo screen at all: a different kind of interface
          for a different kind of user, running outside Odoo&apos;s own UI and
          view framework entirely. A supplier who shouldn&apos;t see any Odoo
          menu, a warehouse handheld running one giant scan button, a
          customer-facing order form that looks nothing like a form view;
          none of that is a Studio limitation to work around, it&apos;s a
          different problem than the one Studio was built to solve.
        </p>
      </GuideSection>

      <GuideSection heading="Is a standalone app a 'better Studio,' then?">
        <p>
          No, and it&apos;s worth being precise about that: a small standalone
          app connected to Odoo through its API isn&apos;t a replacement for
          Studio, and it doesn&apos;t compete with what Studio does well. For an
          internal field tweak or a report layout change, Studio remains the
          right, cheapest tool. A standalone app becomes the better tool
          specifically at the point where the requirement is a genuinely
          different interface for a different audience, not a more
          powerful way to edit an Odoo form. See the broader customization
          vs. custom apps guide, linked below, for that fuller comparison.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
