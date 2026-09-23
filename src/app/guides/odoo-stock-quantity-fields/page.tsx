import Link from "next/link";
import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { ComparisonTable } from "@/components/seo/code-block";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-stock-quantity-fields";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

const LINK =
  "font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline";

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/odoo-warehouse-app", label: "Odoo warehouse app" },
        { href: "/guides/odoo-api-multi-company-filtering", label: "Why a call returns the wrong company's data" },
        { href: "/guides/odoo-api-errors", label: "What each Odoo API error means" },
        { href: "/odoo-dashboard", label: "Odoo management dashboard" },
      ]}
    >
      <GuideSection heading="Three fields that all look like the stock level">
        <p>
          Ask Odoo how much of a product you have and there is no single
          answer, because Odoo tracks several quantities that are all
          legitimate and all different. Reading the wrong one is the most
          common reason a dashboard or a portal disagrees with the warehouse.
          These are the field descriptions from Odoo&apos;s own source:
        </p>
        <ComparisonTable
          caption="What each quantity field actually measures"
          headers={["Field", "What Odoo computes", "What it answers"]}
          rows={[
            [
              "qty_available",
              "Current quantity of products, physically in stock",
              "What is on the shelf right now",
            ],
            [
              "free_qty",
              "Quantity on hand minus reserved quantity",
              "What is on the shelf and not already promised to someone",
            ],
            [
              "virtual_available",
              "Quantity on hand, minus outgoing, plus incoming",
              "What you expect to have once planned moves complete",
            ],
            [
              "incoming_qty",
              "Quantity of planned incoming products",
              "What is on its way in",
            ],
            [
              "outgoing_qty",
              "Quantity of planned outgoing products",
              "What is committed to go out",
            ],
          ]}
        />
        <p>
          The one people reach for first is usually the one they want least.{" "}
          <code>qty_available</code> is a physical count, so it happily
          reports stock that is entirely reserved for orders shipping this
          afternoon. A screen built on it will cheerfully show items as
          available that nobody can actually sell.
        </p>
      </GuideSection>

      <GuideSection heading="So which one should the app show?">
        <p>
          It depends on the question the person in front of the screen is
          asking, which is usually one of three:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Can I sell this right now?</strong> Free quantity. It is
            on hand minus what is already reserved, which is the closest
            thing Odoo has to &quot;genuinely available&quot;. This is almost
            always the right field for a customer-facing portal.
          </li>
          <li>
            <strong>Will I be able to fulfil this?</strong> Forecasted. It
            accounts for incoming purchases and manufacturing as well as
            outgoing commitments, which is what a planner or a buyer needs.
          </li>
          <li>
            <strong>What is physically in the building?</strong> On hand.
            This is the right answer for a stock count or a picker standing
            in front of a shelf, and the wrong answer for nearly everything
            else.
          </li>
        </ul>
        <p>
          Showing forecasted quantity to a customer is a particularly
          expensive mistake, because it can exceed what exists. A portal that
          promises stock arriving next Tuesday, without saying so, sells
          something the warehouse cannot ship today.
        </p>
      </GuideSection>

      <GuideSection heading="Why the same field returns a different number for different callers">
        <p>
          This is the part that turns a reporting discrepancy into a long
          afternoon. These quantities are not stored values on the product.
          They are computed per request, and the computation reads the
          context of the call. In Odoo 19 the fields depend on, among others,
          the lot, the owner, the package, a date range, the location, the
          warehouse and the set of allowed companies.
        </p>
        <p>
          The consequence is worth stating plainly: the stock level is not a
          property of the product. It is a property of the product{" "}
          <em>as seen from somewhere</em>. Two correct calls for the same
          product can return different numbers and neither is a bug. If a
          report and a screen disagree, compare the context each one passed
          before you go looking at the data.
        </p>
        <p>
          It also means a number can be scoped deliberately. Asking for a
          single warehouse, or a location and its children, gives that
          warehouse&apos;s figure rather than a company-wide total, which is
          usually what a picking screen or a branch dashboard should show.
        </p>
      </GuideSection>

      <GuideSection heading="The multi-company trap">
        <p>
          The allowed companies are part of that context, and this catches
          people in production rather than in testing. On a database with
          several companies, a quantity read by a user who can see every
          company is the total across all of them. The same read by a user
          scoped to one company returns that company&apos;s figure.
        </p>
        <p>
          Nothing errors. The integration returns a larger number than the
          warehouse recognises, and because it is plausible rather than
          absurd, it can survive a long time before anyone questions it. The
          general form of this problem, where a call quietly returns records
          from every company a user can reach, has{" "}
          <Link href="/guides/odoo-api-multi-company-filtering" className={LINK}>
            its own guide
          </Link>
          ; stock quantities are simply its most expensive instance, because
          the wrong number here becomes a promise to a customer.
        </p>
        <p>
          If an integration user was given broad company access to make
          something work, every quantity it reads is now a cross-company
          total. That is worth checking before anything else.
        </p>
      </GuideSection>

      <GuideSection heading="When the number is right and the shelf still disagrees">
        <p>
          Once the field and the context are correct, a remaining gap is
          usually not a software problem:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Reserved stock is still physically present.</strong> On
            hand includes it, free quantity does not. A picker sees boxes
            that the portal has correctly stopped offering.
          </li>
          <li>
            <strong>Moves that were done in the building, not in Odoo.</strong>{" "}
            A transfer completed on paper and confirmed later is real stock
            that Odoo does not know has moved yet.
          </li>
          <li>
            <strong>Lots and locations narrow the answer.</strong> A quantity
            read in the context of one lot or one location is answering a
            narrower question than the one being asked at the shelf.
          </li>
        </ul>
        <p>
          That last category is exactly why we build picking apps that write
          back as the work happens rather than after it. When the record is
          made at the shelf, the gap between Odoo and the building stops
          accumulating in the first place, which is the point of{" "}
          <Link href="/odoo-warehouse-app" className={LINK}>
            a warehouse app
          </Link>{" "}
          rather than a paper round followed by data entry.
        </p>
      </GuideSection>

      <GuideSection heading="A short checklist when a quantity looks wrong">
        <ol className="ml-5 list-decimal space-y-2">
          <li>
            Check which field is being read. On hand, free and forecasted
            answer three different questions and only one of them is yours.
          </li>
          <li>
            Check the companies in context. A cross-company total is the most
            common cause of a number that is too high.
          </li>
          <li>
            Check the warehouse or location scope. No scope means every
            location the caller can see.
          </li>
          <li>
            Compare against the same product in the Odoo interface as the
            same user, not as an administrator. Different users can correctly
            see different numbers.
          </li>
        </ol>
        <p>
          If you are reconciling stock figures between Odoo and something
          else and would rather have it built correctly than keep
          investigating, tell us what the screen is meant to answer. Which
          field it should read usually follows directly from that.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
