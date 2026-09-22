import Link from "next/link";
import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { CodeBlock, ComparisonTable } from "@/components/seo/code-block";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-19-json-2-api";
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
        { href: "/guides/odoo-rest-api-explained", label: "Odoo REST API: what exists in Odoo 19" },
        { href: "/guides/what-happens-when-odoo-upgrades", label: "What happens to a custom app when Odoo upgrades" },
        { href: "/odoo-api-development", label: "Odoo API development" },
      ]}
    >
      <GuideSection heading="What is the JSON-2 API?">
        <p>
          It is the HTTP API Odoo introduced in version 19. You{" "}
          <code>POST</code> a JSON object to{" "}
          <code>/json/2/&lt;model&gt;/&lt;method&gt;</code> with an{" "}
          <code>Authorization: bearer &lt;api key&gt;</code> header, and you
          get the method&apos;s return value back as JSON with a normal HTTP
          status code. It replaces the pattern every Odoo integration used
          before it: authenticate to get a user id, then push everything
          through one generic <code>execute_kw</code> dispatcher over XML-RPC
          or JSON-RPC.
        </p>
        <p>
          It is not REST in the resource sense. The URL names a model and a
          method, not a resource and a verb: there is no{" "}
          <code>GET /api/sale.order/42</code>, you call{" "}
          <code>/json/2/sale.order/read</code> with a list of ids. What you
          gain over the RPC protocols is a normal HTTP surface: real status
          codes, bearer auth, one request per call, and a{" "}
          <code>/doc</code> page on your own database listing the models,
          fields and methods that database actually exposes.
        </p>
      </GuideSection>

      <GuideSection heading="What does a JSON-2 request look like?">
        <p>
          The URL carries the model and method. The body carries the
          arguments as named fields, plus <code>ids</code> for the records to
          act on (omitted for model-level methods such as{" "}
          <code>search_read</code>) and an optional <code>context</code>.
        </p>
        <CodeBlock
          label="HTTP"
          code={`POST /json/2/res.partner/search_read HTTP/1.1
Host: mycompany.example.com
Authorization: bearer 6578616d706c65206a736f6e20617069206b6579
Content-Type: application/json; charset=utf-8
X-Odoo-Database: mycompany
User-Agent: mysoftware python-requests/2.25.1

{
  "context": {"lang": "en_US"},
  "domain": [["name", "ilike", "%deco%"], ["is_company", "=", true]],
  "fields": ["name"]
}

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id": 25, "name": "Deco Addict"}]`}
        />
        <p>
          Errors come back with a 4xx or 5xx status and a JSON object naming
          the Python exception, its message and arguments, the context used,
          and a traceback for debugging. That is a real improvement over
          JSON-RPC, where a failure is an HTTP 200 with an{" "}
          <code>error</code> key that naive clients read as success.
        </p>
        <CodeBlock
          label="Python"
          code={`import requests

URL = "https://mycompany.example.com"
API_KEY = "..."          # from a secure location, never in source control

def call(model, method, **body):
    res = requests.post(
        f"{URL}/json/2/{model}/{method}",
        headers={"Authorization": f"bearer {API_KEY}", "Content-Type": "application/json"},
        json=body,
        timeout=20,
    )
    res.raise_for_status()   # real status codes: 401 for a bad key, 4xx for bad input
    return res.json()

orders = call("sale.order", "search_read",
              domain=[["state", "=", "sale"]],
              fields=["name", "amount_total"],
              limit=5)

uid = call("res.users", "context_get")   # who am I? (no ids needed)`}
        />
      </GuideSection>

      <GuideSection heading="Who can use it? The plan and edition gate">
        <p>
          On Odoo Online, access to the external API, JSON-2 included, is
          only available on the Custom pricing plan. It is not available on
          the One App Free or Standard plans. Self-hosted databases and
          Odoo.sh are not limited that way. This catches people out: the code
          is correct, the key looks fine, and the calls still fail because
          the subscription plan does not include external API access.
        </p>
      </GuideSection>

      <GuideSection heading="How do API keys work in Odoo 19?">
        <p>
          A key is created per user under Preferences, Account Security, New
          API Key, with a description and a duration. Odoo 19 will not create
          a key that lasts more than three months, so any production
          integration needs a rotation routine rather than a key pasted once
          into a config file. The key value is shown once at creation and
          cannot be retrieved later.
        </p>
        <p>
          Keys can also be rotated programmatically. Generation is restricted
          to users with Settings access unless you set the system parameter{" "}
          <code>base.enable_programmatic_api_keys</code> to{" "}
          <code>True</code>, and a user can hold up to 10 programmatically
          generated keys by default (
          <code>base.programmatic_api_keys_limit</code>).
        </p>
        <CodeBlock
          label="Python, rotating a key before it expires"
          code={`new_key = call(
    "res.users.apikeys", "generate",
    key=API_KEY,              # the current, still-valid key
    scope="rpc",              # rpc is the scope for bearer API access
    name="orders sync",
    expiration_date="2026-12-19",   # ISO 8601, at most three months out
)
# store new_key securely, then start using it; the old key stays valid until it expires`}
        />
      </GuideSection>

      <GuideSection heading="One call, one transaction: the rule that changes how you write code">
        <p>
          Every JSON-2 call runs in its own SQL transaction, committed on
          success and discarded on error. You cannot chain several calls
          inside one transaction. So a sequence like create an order, then
          confirm it, is two commits: if the second fails you are left with a
          draft order, not with nothing.
        </p>
        <p>
          The fix is to call a single method that does the whole job.{" "}
          <code>search_read</code> is the everyday example (a{" "}
          <code>search</code> and a <code>read</code> in one transaction, so
          a record deleted between them cannot break it), and business
          methods prefixed <code>action_</code>, such as{" "}
          <code>sale.order.action_confirm</code>, are the same idea for
          writes. When no such method exists for your sequence, the clean
          answer is a small module that adds one. This matters most for
          reservations, payments and stock moves, where a half-finished
          sequence has real consequences.
        </p>
      </GuideSection>

      <GuideSection heading="What happens to XML-RPC and JSON-RPC?">
        <p>
          Both still work on Odoo 19, and both are deprecated. Odoo has
          scheduled the <code>/xmlrpc</code>, <code>/xmlrpc/2</code> and{" "}
          <code>/jsonrpc</code> endpoints for removal in Odoo 22 (fall 2028),
          along with the three services they expose: common, db and object.
          Controllers declared with{" "}
          <code>@route(type=&apos;jsonrpc&apos;)</code>, which were called{" "}
          <code>type=&apos;json&apos;</code> until Odoo 18, are not part of
          that deprecation.
        </p>
        <ComparisonTable
          caption="Migrating the calls you actually use"
          headers={["Old RPC call", "JSON-2 equivalent"]}
          rows={[
            ["common.version()", "GET /web/version"],
            ["common.authenticate(db, login, password, {})", "No login step; send the key as a bearer token. For your own uid, call res.users/context_get with no ids"],
            ["object.execute_kw(db, uid, key, model, method, args, kwargs)", "POST /json/2/<model>/<method> with named JSON fields"],
            ["db.list(), db.create_database(), db.dump()", "The /web/database controllers, with the master password"],
            ["db.server_version()", "GET /web/version"],
          ]}
        />
        <p>
          The practical migration is smaller than it looks, because the model
          names, method names and domains do not change. If your integration
          keeps its transport in one module, as ours do, the change is one
          file plus the credential handling. If RPC calls are scattered
          through the codebase, this is the moment to centralise them.
        </p>
      </GuideSection>

      <GuideSection heading="Should you move now?">
        <p>
          If you are on Odoo 19 and writing something new: yes, use JSON-2.
          If you are on Odoo 16, 17 or 18: you cannot, JSON-2 does not exist
          there, so use JSON-RPC and keep it isolated. If you have a working
          RPC integration on Odoo 19: there is no urgency, but treat the
          transport swap as part of the upgrade plan for Odoo 22 rather than
          as a surprise in 2028. See{" "}
          <Link href="/guides/what-happens-when-odoo-upgrades" className={LINK}>
            what happens to a custom app when Odoo upgrades
          </Link>{" "}
          for the rest of that checklist.
        </p>
      </GuideSection>

      <GuideSection heading="Sources">
        <p>
          The endpoint shape, the header names, the three-month key limit,
          the Custom-plan restriction, the one-call-one-transaction rule and
          the Odoo 22 removal date are all from Odoo&apos;s own reference,{" "}
          <a
            href="https://www.odoo.com/documentation/19.0/developer/reference/external_api.html"
            className={LINK}
            rel="noopener"
          >
            External JSON-2 API
          </a>
          , read on 22 September 2026. Where Odoo&apos;s documentation and a
          third-party blog post disagree about this API, the documentation is
          the one to trust: this area changed recently and a lot of what is
          written about it predates Odoo 19.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
