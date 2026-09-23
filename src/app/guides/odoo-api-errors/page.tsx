import Link from "next/link";
import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { CodeBlock, ComparisonTable } from "@/components/seo/code-block";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-api-errors";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

const LINK =
  "font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline";

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/guides/odoo-api-key-setup", label: "Creating, scoping and rotating Odoo API keys" },
        { href: "/guides/odoo-api-multi-company-filtering", label: "Why a call returns the wrong company's data" },
        { href: "/guides/odoo-19-json-2-api", label: "Odoo 19's JSON-2 API" },
        { href: "/odoo-api-development", label: "Odoo API development" },
      ]}
    >
      <GuideSection heading="Why does Odoo say Access Denied when the credentials are right?">
        <p>
          Because in almost every case they are not the credentials Odoo
          wants. The single most common cause of{" "}
          <code>Access Denied</code> on the RPC endpoints is a script sending
          the user&apos;s login password. Odoo&apos;s external API
          authenticates with an API key, generated per user under
          Preferences, Account Security, New API Key. A password that works
          in the browser is not interchangeable with one.
        </p>
        <p>
          This is also why integrations appear to &quot;break when we turned
          on two-factor authentication&quot;. Two-factor does not block API
          keys; keys exist precisely so that automated access survives it.
          What broke is that the script was still sending a password, and
          two-factor finally stopped accepting one.
        </p>
        <p>
          On Odoo 19 the newer JSON-2 endpoint reports the same class of
          failure much more clearly, as a real HTTP status with a named
          exception rather than a fault string:
        </p>
        <CodeBlock
          label="A rejected key on /json/2, from Odoo's own documentation"
          code={`HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{
  "name": "werkzeug.exceptions.Unauthorized",
  "message": "Invalid apikey",
  "arguments": ["Invalid apikey", 401],
  "context": {},
  "debug": "Traceback (most recent call last): ..."
}`}
        />
        <p>
          Every JSON-2 error comes back in that shape: an HTTP 4xx or 5xx,
          with <code>name</code> holding the fully qualified Python
          exception, <code>message</code> the text, and{" "}
          <code>debug</code> the traceback. The exception name is the useful
          field. It tells you which layer refused you, which is the whole
          diagnostic question.
        </p>
      </GuideSection>

      <GuideSection heading="What each Odoo API error actually means">
        <ComparisonTable
          caption="The errors worth recognising on sight"
          headers={["What you see", "What it means", "Where to look"]}
          rows={[
            [
              "Access Denied (XML-RPC or JSON-RPC fault)",
              "Authentication failed. Odoo never got as far as your model or method",
              "Password sent instead of an API key; wrong database name; login and key belonging to different users",
            ],
            [
              "401 Unauthorized, Invalid apikey",
              "The JSON-2 equivalent: the bearer key was missing, malformed, revoked or expired",
              "The Authorization header, and the key's duration in Account Security",
            ],
            [
              "AccessError",
              "Authentication succeeded. This user is not allowed to do that",
              "The integration user's groups, record rules and field access, not your code",
            ],
            [
              "403 Forbidden",
              "The action was refused outright, for example revoking a key that is not valid",
              "Whether the key was already revoked or expired",
            ],
            [
              "404 Not Found on the endpoint itself",
              "You did not reach Odoo's API at all",
              "The URL and the deployment; on self-hosted, whether the request is being routed to Odoo",
            ],
            [
              "422 Unprocessable Content",
              "A limit was hit, such as the cap on programmatically generated API keys",
              "The key count for that user; the default ceiling is ten",
            ],
            [
              "A method that works in the UI but not over the API",
              "Usually a different user with different rights, or a different company context",
              "Which user the key belongs to, and which companies they can see",
            ],
          ]}
        />
      </GuideSection>

      <GuideSection heading="How do you tell an authentication problem from a permissions problem?">
        <p>
          This is the distinction that saves the most time, because the two
          look similar from the outside and have nothing to do with each
          other. Authentication asks whether Odoo knows who you are.
          Permissions ask whether that person is allowed to do this.
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Prove the connection before the credentials.</strong> A
            version check reaches Odoo without authenticating at all. If it
            fails, the problem is the URL, the network or the deployment, and
            nothing about your key matters yet.
          </li>
          <li>
            <strong>
              If authentication returns a user id, the key is fine.
            </strong>{" "}
            Any error after that point is about rights. Changing the key,
            regenerating it, or switching transport will not help.
          </li>
          <li>
            <strong>Reproduce it as that user, in the browser.</strong> Log
            in as the integration user and try the same thing in the
            interface. An <code>AccessError</code> over the API is almost
            always reproducible there, which turns a debugging session into a
            configuration fix.
          </li>
        </ul>
        <p>
          Testing as an administrator hides exactly this class of bug. The
          API acts as a user, so an admin key makes everything work right up
          until the day it runs as the account you actually deployed.
        </p>
      </GuideSection>

      <GuideSection heading="Why does the call succeed but return the wrong records?">
        <p>
          Because nothing failed. Odoo applies the same access rights, record
          rules and field access to the external API that it applies
          everywhere else, so a query returns what that user is allowed to
          see, which is rarely the same as what you had in mind. On a
          multi-company database this is the usual surprise: records come
          back from every company the user can access unless the request
          scopes the company context explicitly. That one has{" "}
          <Link href="/guides/odoo-api-multi-company-filtering" className={LINK}>
            its own guide
          </Link>
          , because it is common and it is silent.
        </p>
        <p>
          Archived and draft records are the other half of it. They are not
          errors either; they are simply included until a domain excludes
          them. Errors announce themselves, and wrong results do not, which
          is why the second kind survives testing and reaches production.
        </p>
      </GuideSection>

      <GuideSection heading="When the error is not in your code at all">
        <p>
          Three failures look like bugs and are not. Each one is worth
          checking before reading another line of your integration:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>The plan does not include API access.</strong> On Odoo
            Online the external API is available only on the Custom pricing
            plan. It is not available on One App Free or Standard. The code
            can be perfect and nothing will work.
          </li>
          <li>
            <strong>The key quietly expired.</strong> Odoo caps API key
            lifetime at three months, so a working integration will stop on a
            schedule unless keys are rotated. An integration with no rotation
            plan has a failure date, whether or not anyone has written it
            down.
          </li>
          <li>
            <strong>The request reached the wrong database.</strong> Where one
            server hosts several databases and the host name is not enough to
            pick one, Odoo needs to be told which database explicitly.
            Otherwise you authenticate somewhere real, just not where your
            data is.
          </li>
        </ul>
      </GuideSection>

      <GuideSection heading="One error that is not an error: partial writes">
        <p>
          On JSON-2 each call runs in its own transaction, committed on
          success and discarded on failure. Calls cannot be chained inside
          one transaction. So a sequence of writes that fails halfway leaves
          the earlier ones committed, and Odoo is behaving exactly as
          documented while your data is now half updated.
        </p>
        <p>
          Odoo&apos;s own answer is to call one method that does all the
          related work, rather than several that each do part of it. The
          business methods exist for this reason. Getting that boundary wrong
          is not something an error message will tell you about, and it
          matters most in exactly the places you would least want it to:
          stock reservations, payments, anything counted.
        </p>
      </GuideSection>

      <GuideSection heading="If you are reading this while something is broken">
        <p>
          Most of what is above is configuration rather than programming:
          which user holds the key, what that user is allowed to see, which
          database answered, and which plan the database is on. That is
          usually good news, because it means the fix is quick once the cause
          is named.
        </p>
        <p>
          What it also shows is the part of integration work that never
          appears in a getting-started example. The call itself is a few
          lines. Access rights, company scoping, key rotation, transaction
          boundaries and failures that do not announce themselves are the
          actual project, and they are what we handle in{" "}
          <Link href="/work" className={LINK}>
            the apps we build
          </Link>
          . If something is failing against your Odoo and you would rather
          not spend the week on it, tell us what you are seeing and we will
          tell you what it is.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
