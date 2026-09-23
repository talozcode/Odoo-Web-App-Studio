import Link from "next/link";
import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { CodeBlock, ComparisonTable } from "@/components/seo/code-block";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-api-examples-python-javascript";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

const LINK =
  "font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline";

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/guides/odoo-api-integration-explained", label: "How Odoo's API actually works" },
        { href: "/guides/odoo-19-json-2-api", label: "Odoo 19's JSON-2 API" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs write-back integrations" },
        { href: "/guides/odoo-api-slow", label: "Why Odoo API calls are slow" },
        { href: "/odoo-api-development", label: "Odoo API development" },
      ]}
    >
      <GuideSection heading="What does an Odoo API call actually look like?">
        <p>
          Short, in every language. That is the part people expect to be
          hard, and it is not. Odoo exposes its models over HTTP, you name a
          model and a method, and you get JSON back. Below is the same read
          in each of the three transports Odoo supports, so you can see the
          shape before deciding which one your version needs.
        </p>
        <CodeBlock
          label="The same read, three transports"
          code={`# Odoo 19+ (JSON-2): a POST per method call
POST /json/2/sale.order/search_read
Authorization: bearer <api key>
{"domain": [["state", "=", "sale"]], "fields": ["name", "amount_total"], "limit": 5}

# Odoo 16 to 21 (JSON-RPC): everything through execute_kw
POST /jsonrpc
{"jsonrpc": "2.0", "method": "call", "params": {"service": "object", "method": "execute_kw",
 "args": [db, uid, key, "sale.order", "search_read",
          [[["state", "=", "sale"]]], {"fields": ["name", "amount_total"], "limit": 5}]}}

# Odoo 16 to 21 (XML-RPC), from Python's standard library
models = xmlrpc.client.ServerProxy(f"{url}/xmlrpc/2/object")
models.execute_kw(db, uid, key, "sale.order", "search_read",
                  [[["state", "=", "sale"]]], {"fields": ["name"], "limit": 5})`}
        />
        <p>
          In JavaScript it is a <code>fetch</code> to the same endpoints; no
          client library is required on either side. The one rule that is not
          negotiable: these calls belong on a server you control, never in
          browser or mobile code, because the API key carries that
          user&apos;s full access rights.
        </p>
      </GuideSection>

      <GuideSection heading="Which transport does your version need?">
        <ComparisonTable
          caption="Pick by Odoo version, not by preference"
          headers={["", "JSON-2 (Odoo 19+)", "JSON-RPC (16 to 21)", "XML-RPC (16 to 21)"]}
          rows={[
            ["URL", "/json/2/<model>/<method>", "/jsonrpc", "/xmlrpc/2/object"],
            ["Auth", "Bearer API key in a header", "Login step, then db, uid and key on every call", "Login step, then db, uid and key on every call"],
            ["Errors", "Real HTTP status codes", "HTTP 200 with an error object", "XML fault"],
            ["Status", "Supported", "Deprecated, scheduled for removal in Odoo 22", "Deprecated, scheduled for removal in Odoo 22"],
          ]}
        />
        <p>
          New work on Odoo 19 should use JSON-2. On Odoo 16 to 18 it does not
          exist yet, so JSON-RPC is the practical choice. The model names,
          method names and search domains are identical across all three, so
          the transport is the only thing that changes; see{" "}
          <Link href="/guides/odoo-19-json-2-api" className={LINK}>
            the JSON-2 guide
          </Link>{" "}
          for the migration detail.
        </p>
      </GuideSection>

      <GuideSection heading="So if the calls are simple, what takes the time?">
        <p>
          Everything around them. A demo script that reads five orders is an
          afternoon. An app that a warehouse uses every day, against a real
          database, is a different piece of work, and the gap between the two
          is where integration projects actually run aground:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Getting the right records back.</strong> Multi-company
            databases return more than you expect, archived and draft records
            sneak into results, and the correct domain for &quot;the orders
            this user should see&quot; is rarely the obvious one.
          </li>
          <li>
            <strong>Writing without breaking Odoo&apos;s own logic.</strong>{" "}
            Setting a field directly and calling the method behind the button
            are not the same thing: one skips every side effect Odoo would
            normally run. Knowing which method to call, and what it does
            downstream, is the job.
          </li>
          <li>
            <strong>Failures that do not look like failures.</strong> One
            transport reports errors with a 200 status. Writes can partly
            apply. Two people can act on the same record at once. Code that
            assumes the happy path looks fine in testing and quietly corrupts
            data in production.
          </li>
          <li>
            <strong>Access rights.</strong> The API acts as a user, so the
            integration user&apos;s groups decide what works. Testing as an
            administrator hides exactly the errors your users will hit.
          </li>
          <li>
            <strong>Speed.</strong> The naive version makes one call per row
            and crawls. Making it fast is about asking Odoo for aggregates
            and batches instead of looping.
          </li>
          <li>
            <strong>Staying working.</strong> Field renames, new required
            fields, expiring API keys, and the scheduled removal of the RPC
            endpoints in Odoo 22 all land on the integration, not on Odoo.
          </li>
        </ul>
        <p>
          None of that is exotic, and none of it shows up in a
          getting-started example. It is simply the difference between code
          that calls Odoo and an app people can rely on.
        </p>
      </GuideSection>

      <GuideSection heading="Do you need an app, or a script?">
        <p>
          If the goal is to pull a few records into a spreadsheet once, a
          script is right and the snippets above are a fine start. If people
          are going to use it daily, on a phone, in a warehouse, with real
          money attached to the records it writes, the API call is the small
          part: the screens, the validation, the error handling and the
          maintenance are the project. That is what we build, as{" "}
          <Link href="/work" className={LINK}>
            the apps on our work page
          </Link>{" "}
          show, usually in a couple of weeks and for a fixed price.
        </p>
        <p>
          Tell us the workflow you want simplified and we will tell you
          honestly which of the two it is, and what it would take.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
