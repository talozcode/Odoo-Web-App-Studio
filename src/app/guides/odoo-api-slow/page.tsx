import Link from "next/link";
import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { ComparisonTable } from "@/components/seo/code-block";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-api-slow";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

const LINK =
  "font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline";

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/guides/why-is-my-odoo-dashboard-slow", label: "Why your Odoo dashboard is slow" },
        { href: "/guides/odoo-api-errors", label: "What each Odoo API error means" },
        { href: "/odoo-dashboard", label: "Odoo management dashboard" },
        { href: "/odoo-api-development", label: "Odoo API development" },
      ]}
    >
      <GuideSection heading="It is usually one call per row">
        <p>
          When an Odoo integration is slow, the cause is rarely Odoo. It is
          almost always the shape of the conversation with it. The pattern
          that does the damage is simple enough to write by accident: fetch a
          list, then loop over it asking Odoo something about each item.
        </p>
        <p>
          Fifty orders becomes fifty-one requests. Each one pays for the
          network round trip, the authentication, the ORM and the query. None
          of them is slow on its own, which is exactly why this survives
          testing against ten records and falls over against a thousand.
        </p>
        <p>
          The fix is to ask once for everything. Odoo&apos;s search and read
          operations accept a set of ids, so the loop that made a call per
          row becomes one call that returns every row. The same applies to
          writing: accumulate the values and create the batch, rather than
          creating records one after another. Odoo&apos;s own performance
          guidance says exactly this on the server side, and it matters more
          over HTTP, not less, because every iteration now costs a round trip
          as well.
        </p>
      </GuideSection>

      <GuideSection heading="Let the database do the arithmetic">
        <p>
          The second big one is pulling rows across the network in order to
          add them up. If a dashboard needs sales by month, fetching every
          order line and summing them in your own code moves an enormous
          amount of data to compute a handful of numbers.
        </p>
        <p>
          Odoo can group and aggregate for you and return only the totals.
          That turns a payload of thousands of rows into one of a few, and it
          moves the work to the database, which is built for it. Any screen
          that shows counts, sums or averages should be asking for counts,
          sums and averages.
        </p>
        <ComparisonTable
          caption="The same screen, two conversation shapes"
          headers={["What the screen needs", "The slow shape", "The fast shape"]}
          rows={[
            [
              "A list with a detail per row",
              "One call for the list, then one per row",
              "One call for the list, one call for all the details at once",
            ],
            [
              "Totals or counts",
              "Fetch every row, add them up locally",
              "Ask Odoo to group and aggregate, return the totals",
            ],
            [
              "A long table",
              "Fetch everything, render everything",
              "Fetch a page at a time, with an explicit limit and order",
            ],
            [
              "A few values per record",
              "Read the record and take what you need",
              "Name the fields you want, so the rest is never sent",
            ],
          ]}
        />
      </GuideSection>

      <GuideSection heading="Ask for fewer fields and fewer records">
        <p>
          Two habits cost more than people expect. The first is not naming
          fields, which makes Odoo compute and serialise everything a model
          has, including computed fields that run their own queries. Naming
          the four fields the screen displays can change the cost of a call
          by an order of magnitude, and it costs nothing to do.
        </p>
        <p>
          The second is the absent limit. A query with no limit returns
          whatever exists, which is fine in a fresh database and ruinous
          after two years of orders. Every list an app shows should have a
          page size and an order, both because it is faster and because a
          screen showing nine thousand rows was never useful anyway.
        </p>
      </GuideSection>

      <GuideSection heading="Why it was fine and then got slow">
        <p>
          Integrations rarely start slow. They degrade, and usually for one
          of three reasons:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Volume met a missing index.</strong> Filtering on a field
            the database has no index for is cheap over a small table and
            expensive over a large one. Odoo can index a field, with the
            caveat from its own documentation that indexing everything is its
            own problem, since indexes cost space and slow down writes.
          </li>
          <li>
            <strong>A loop that was small became large.</strong> The call per
            row was always there. It only became visible when the row count
            did.
          </li>
          <li>
            <strong>
              Work that grows faster than the data.
            </strong>{" "}
            Matching two lists by scanning one inside a loop over the other
            gets quadratically worse. Building a lookup once, then reading
            from it, keeps it linear. This is ordinary programming rather than
            anything specific to Odoo, but it is where a report that took
            seconds starts taking minutes.
          </li>
        </ul>
      </GuideSection>

      <GuideSection heading="You probably cannot profile it">
        <p>
          Odoo ships a real profiler. Enabled from developer mode, it records
          queries and stack traces and renders a flamegraph, and it is the
          right tool for finding which part of a request is expensive.
        </p>
        <p>
          There is a significant catch, stated plainly in Odoo&apos;s
          documentation: Odoo Online databases cannot be profiled. If you are
          hosted there, the tool that would answer the question is not
          available, and diagnosis falls back to measuring from the outside:
          timing each call, counting how many your integration makes, and
          looking at the size of what comes back. That is usually enough,
          because the common causes above are visible in call counts and
          payload sizes without any server-side view at all.
        </p>
        <p>
          It is worth knowing before you go looking for the profiler and
          conclude something is broken.
        </p>
      </GuideSection>

      <GuideSection heading="Timeouts are the symptom, not the problem">
        <p>
          A timeout means something took longer than someone was willing to
          wait. Raising the limit is occasionally right and usually a way of
          hiding the cause for a few more months, because the work still grows
          with the data.
        </p>
        <p>
          It also interacts badly with writes. On Odoo 19&apos;s JSON-2 API
          each call is its own transaction, so a sequence of writes
          interrupted partway leaves the earlier ones committed. A timeout in
          the middle of a multi-step write is not just slow, it can leave
          records half updated, which is covered alongside the other failures
          that do not announce themselves in{" "}
          <Link href="/guides/odoo-api-errors" className={LINK}>
            what each Odoo API error means
          </Link>
          .
        </p>
        <p>
          For anything long running, the answer is usually not a longer
          timeout but a different shape: do the work in batches, or have Odoo
          do it in one call rather than several.
        </p>
      </GuideSection>

      <GuideSection heading="Where this usually ends up">
        <p>
          Almost everything above is about asking better questions rather
          than about Odoo being slow, which is good news: the fixes are in
          your integration and do not require touching the database or
          changing hosting.
        </p>
        <p>
          It is also why a screen that feels instant is a build decision
          rather than an infrastructure one. The{" "}
          <Link href="/odoo-dashboard" className={LINK}>
            dashboards
          </Link>{" "}
          and picking screens we build are fast because they ask Odoo for
          aggregates and pages instead of rows and everything, not because
          they run anywhere special. If something you rely on has become slow
          enough to be annoying, tell us what it does and roughly how much
          data it covers, and we will tell you which of these it is.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
