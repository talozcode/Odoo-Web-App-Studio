import Link from "next/link";
import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { CodeBlock, ComparisonTable } from "@/components/seo/code-block";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-api-key-setup";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

const LINK =
  "font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline";

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/guides/odoo-api-examples-python-javascript", label: "Odoo API examples in Python and JavaScript" },
        { href: "/guides/odoo-19-json-2-api", label: "Odoo 19's JSON-2 API" },
        { href: "/guides/odoo-api-multi-company-filtering", label: "Odoo API multi-company filtering" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs write-back integrations" },
        { href: "/guides/odoo-api-errors", label: "What each Odoo API error means" },
      ]}
    >
      <GuideSection heading="How do you create an Odoo API key?">
        <p>
          Log in as the user the integration should act as, then open
          Preferences (the menu under your avatar, also called My Profile),
          go to the Account Security tab and click New API Key. Odoo asks for
          a description and, on recent versions, a duration. Click Generate
          Key and copy the value immediately: it is shown once and cannot be
          retrieved afterwards. If you lose it, delete the key and make a new
          one.
        </p>
        <p>
          The description is not decoration. It is the only thing that tells
          you later which system a key belongs to, so write &quot;warehouse
          picking app, production&quot; rather than &quot;test&quot;.
        </p>
      </GuideSection>

      <GuideSection heading="Where does the key go in the call?">
        <p>
          That depends on the API. On Odoo 19&apos;s JSON-2 the key is a
          bearer token in the <code>Authorization</code> header and there is
          no login step. On XML-RPC and JSON-RPC the key simply replaces the
          password: you still call <code>authenticate</code> with the
          database, the login and the key, and you still pass the key on
          every later call.
        </p>
        <CodeBlock
          label="The same key, two APIs"
          code={`# Odoo 19+, JSON-2: header, no login step
curl https://example.odoo.com/json/2/res.users/context_get \\
  -H "Authorization: bearer $ODOO_API_KEY" \\
  -H "Content-Type: application/json" -d '{}'

# Odoo 16 to 21, XML-RPC: the key is used in place of the password
uid = common.authenticate(DB, "api@example.com", ODOO_API_KEY, {})
models.execute_kw(DB, uid, ODOO_API_KEY, "res.partner", "search_read", [[]], {"limit": 1})`}
        />
        <p>
          The login stays in use with the RPC protocols: a key is not a
          replacement for the user, it is a replacement for that
          user&apos;s password. It gives the same access to the account, so
          store it exactly as carefully, but it cannot be used to log in
          through the web interface.
        </p>
      </GuideSection>

      <GuideSection heading="How long does a key last?">
        <p>
          On Odoo 19, at most three months. Odoo will not create a longer
          key, so every production integration needs a rotation routine.
          Shorter is recommended for interactive or externally exposed use,
          typically a day. Earlier versions did not enforce a maximum, which
          is why many older integrations hold keys that never expire; those
          keep working until the database moves to 19.
        </p>
        <p>
          Keys can be rotated programmatically too, which is how a
          long-running integration stays alive without someone diarising it.
          The part worth planning is not the code: it is deciding who owns
          the rotation, where the new key is stored, and how you find out
          that a key is about to expire rather than when the app stops.
        </p>
      </GuideSection>

      <GuideSection heading="Which user should hold the key?">
        <p>
          A dedicated integration user, never a person and never an
          administrator. Every API call runs with that user&apos;s access
          rights and record rules, so a key on an admin account turns a
          small bug into an unbounded one, and a key on a real employee
          breaks the day they leave and their account is archived.
        </p>
        <ComparisonTable
          caption="A sane integration user"
          headers={["Setting", "What to do", "Why"]}
          rows={[
            ["Type", "Internal user (or portal, if the app only serves customers)", "External API access needs an internal user for most models"],
            ["Groups", "Only the apps the integration touches, at User level", "A picking app needs Inventory, not Accounting"],
            ["Read-only where possible", "Accounting: read access rather than full rights", "Most dashboards only read"],
            ["Companies", "Only the companies it should see", "Prevents cross-company data leaking into results"],
            ["Name", "Something recognisable, like API picking app", "It shows in the chatter of every record it touches"],
          ]}
        />
        <p>
          A useful side effect of a named integration user: every record it
          creates or updates shows that name in Odoo&apos;s tracking, so an
          accountant can see at a glance which changes came from the app and
          which from a person.
        </p>
      </GuideSection>

      <GuideSection heading="Why is my API key not working?">
        <p>
          In rough order of how often we see each one. The first two are
          configuration, not code, and account for most cases. If you have an
          error message in front of you right now,{" "}
          <Link href="/guides/odoo-api-errors" className={LINK}>
            what each Odoo API error actually means
          </Link>{" "}
          works back from the message instead:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>The plan does not include API access.</strong> On Odoo
            Online the external API is only on the Custom plan, not One App
            Free or Standard. The code is fine; the subscription is the
            blocker.
          </li>
          <li>
            <strong>Wrong database name.</strong> On Odoo Online it is
            usually the subdomain, but not always. A quick{" "}
            <code>common.version()</code> or <code>GET /web/version</code>{" "}
            proves the URL before you debug the credentials.
          </li>
          <li>
            <strong>The key expired.</strong> Three months maximum on Odoo
            19. Check the Account Security tab for the key&apos;s duration.
          </li>
          <li>
            <strong>Login and key belong to different users.</strong> With
            the RPC protocols both must match; a key generated for one user
            will not authenticate another&apos;s login.
          </li>
          <li>
            <strong>Access rights, not authentication.</strong> If{" "}
            <code>authenticate</code> returns a uid but a call raises an
            access error, the key is fine and the user&apos;s groups are the
            problem. Test as that user in the web interface to see the same
            error.
          </li>
          <li>
            <strong>Two-factor authentication.</strong> It does not block API
            keys; that is exactly what keys are for. If a script broke when
            2FA was enabled, it is still sending the password.
          </li>
        </ul>
      </GuideSection>

      <GuideSection heading="How should the key be stored?">
        <p>
          As a secret, in the environment or a secrets manager, never in
          source control and never in anything that reaches a browser or a
          mobile app. An Odoo API key carries the full access of its user, so
          a key shipped in client-side code is the same as publishing that
          user&apos;s password. In the apps we build, Odoo calls only ever
          run on the server, and the key exists as one environment variable
          on the host.
        </p>
        <p>
          Rotate deliberately: create the new key, deploy it, confirm traffic
          is using it, then delete the old one. Because Odoo shows a key
          value only once, the rotation should be a documented routine rather
          than a scramble when a key silently expires. If you want that,
          plus the integration itself, built and maintained for a specific
          workflow, that is{" "}
          <Link href="/odoo-api-development" className={LINK}>
            what we do
          </Link>
          .
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
