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
        { href: "/guides/odoo-api-key-setup", label: "Odoo API keys, step by step" },
        { href: "/odoo-api-development", label: "Odoo API development" },
      ]}
    >
      <GuideSection heading="Which endpoint should these examples use?">
        <p>
          It depends on your Odoo version, and the difference is only the
          transport. Odoo 19 has JSON-2, a plain HTTP JSON API at{" "}
          <code>/json/2/&lt;model&gt;/&lt;method&gt;</code>. Odoo 16, 17 and 18
          have XML-RPC (<code>/xmlrpc/2/object</code>) and JSON-RPC (
          <code>/jsonrpc</code>), both of which call the same ORM methods
          through one dispatcher called <code>execute_kw</code>. Odoo has
          scheduled the XML-RPC and JSON-RPC endpoints for removal in Odoo 22
          (fall 2028), so new code on Odoo 19 should use JSON-2.
        </p>
        <ComparisonTable
          caption="The same call, three transports"
          headers={["", "JSON-2 (Odoo 19+)", "JSON-RPC (16 to 21)", "XML-RPC (16 to 21)"]}
          rows={[
            ["URL", "/json/2/<model>/<method>", "/jsonrpc", "/xmlrpc/2/object"],
            ["Auth", "Authorization: bearer <api key>", "db, uid, api key in the body", "db, uid, api key as arguments"],
            ["Login step", "None", "common.authenticate for the uid", "common.authenticate for the uid"],
            ["Arguments", "Named JSON fields", "Positional list plus kwargs dict", "Positional list plus kwargs dict"],
            ["Status", "Supported", "Deprecated, removed in Odoo 22", "Deprecated, removed in Odoo 22"],
          ]}
        />
        <p>
          Everything below calls the same three things so you can compare
          them directly: read open sales orders, create one, then confirm it.
          Replace <code>https://example.odoo.com</code>, the database name and
          the key with your own; see{" "}
          <Link href="/guides/odoo-api-key-setup" className={LINK}>
            how to create an Odoo API key
          </Link>
          .
        </p>
      </GuideSection>

      <GuideSection heading="Python, XML-RPC (Odoo 16 to 21)">
        <p>
          The standard library has everything you need. The{" "}
          <code>common</code> endpoint gives you a user id; the{" "}
          <code>object</code> endpoint runs model methods as that user, under
          that user&apos;s access rights.
        </p>
        <CodeBlock
          label="Python, standard library only"
          code={`import xmlrpc.client

URL = "https://example.odoo.com"
DB = "example"
LOGIN = "api@example.com"
API_KEY = "..."  # an API key, used in place of the password

common = xmlrpc.client.ServerProxy(f"{URL}/xmlrpc/2/common")
print(common.version())               # check the URL before authenticating
uid = common.authenticate(DB, LOGIN, API_KEY, {})
if not uid:
    raise SystemExit("authentication failed")

models = xmlrpc.client.ServerProxy(f"{URL}/xmlrpc/2/object")

def call(model, method, args, kwargs=None):
    return models.execute_kw(DB, uid, API_KEY, model, method, args, kwargs or {})

# Read: confirmed orders, newest first
orders = call(
    "sale.order",
    "search_read",
    [[["state", "=", "sale"]]],
    {"fields": ["name", "partner_id", "amount_total"], "limit": 5, "order": "date_order desc"},
)
for order in orders:
    print(order["name"], order["partner_id"][1], order["amount_total"])

# Create: a draft order with one line
order_id = call("sale.order", "create", [{
    "partner_id": 14,
    "order_line": [(0, 0, {"product_id": 23, "product_uom_qty": 2})],
}])

# Confirm: call the same business method the button calls
call("sale.order", "action_confirm", [[order_id]])
print(call("sale.order", "read", [[order_id], ["name", "state"]]))`}
        />
        <p>
          Two details that trip people up. The positional arguments go inside
          a list, so a domain is a list inside a list (
          <code>[[[&quot;state&quot;, &quot;=&quot;, &quot;sale&quot;]]]</code>
          ), and the keyword arguments (<code>fields</code>,{" "}
          <code>limit</code>, <code>order</code>, <code>context</code>) go in
          the separate dict. Many2one fields come back as{" "}
          <code>[id, &quot;display name&quot;]</code>, not as a plain id.
        </p>
      </GuideSection>

      <GuideSection heading="Python, JSON-RPC (Odoo 16 to 21)">
        <p>
          Same calls, same arguments, JSON instead of XML. This is usually
          the easier one to debug, because you can reproduce any request with{" "}
          <code>curl</code> and read the payload.
        </p>
        <CodeBlock
          label="Python with requests"
          code={`import requests

URL, DB, LOGIN, API_KEY = "https://example.odoo.com", "example", "api@example.com", "..."

def rpc(service, method, args):
    response = requests.post(
        f"{URL}/jsonrpc",
        json={"jsonrpc": "2.0", "method": "call",
              "params": {"service": service, "method": method, "args": args}},
        timeout=20,
    )
    payload = response.json()
    if "error" in payload:                       # Odoo returns HTTP 200 on errors
        raise RuntimeError(payload["error"]["data"]["message"])
    return payload["result"]

uid = rpc("common", "authenticate", [DB, LOGIN, API_KEY, {}])

def call(model, method, args, kwargs=None):
    return rpc("object", "execute_kw", [DB, uid, API_KEY, model, method, args, kwargs or {}])

orders = call("sale.order", "search_read", [[["state", "=", "sale"]]],
              {"fields": ["name", "amount_total"], "limit": 5})`}
        />
        <p>
          Note the error handling: a JSON-RPC fault comes back with HTTP 200
          and an <code>error</code> key, so code that only checks the status
          code will treat a failed write as a success.
        </p>
      </GuideSection>

      <GuideSection heading="JavaScript and Node, JSON-RPC and JSON-2">
        <p>
          No library needed on either side; <code>fetch</code> is enough.
          Keep these calls on your server, never in browser code: the API key
          is a credential with that user&apos;s full access rights.
        </p>
        <CodeBlock
          label="Node 18+, JSON-RPC (Odoo 16 to 21)"
          code={`const URL = "https://example.odoo.com";
const DB = "example";
const LOGIN = "api@example.com";
const API_KEY = process.env.ODOO_API_KEY;

async function rpc(service, method, args) {
  const res = await fetch(\`\${URL}/jsonrpc\`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { service, method, args } }),
  });
  const payload = await res.json();
  if (payload.error) throw new Error(payload.error.data?.message ?? payload.error.message);
  return payload.result;
}

const uid = await rpc("common", "authenticate", [DB, LOGIN, API_KEY, {}]);
const call = (model, method, args, kwargs = {}) =>
  rpc("object", "execute_kw", [DB, uid, API_KEY, model, method, args, kwargs]);

const pickings = await call(
  "stock.picking",
  "search_read",
  [[["state", "=", "assigned"], ["picking_type_code", "=", "outgoing"]]],
  { fields: ["name", "partner_id"], limit: 10 },
);`}
        />
        <CodeBlock
          label="Node 18+, JSON-2 (Odoo 19+)"
          code={`const call = async (model, method, body) => {
  const res = await fetch(\`\${URL}/json/2/\${model}/\${method}\`, {
    method: "POST",
    headers: {
      "Authorization": \`bearer \${API_KEY}\`,
      "Content-Type": "application/json",
      "X-Odoo-Database": DB,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(JSON.stringify(await res.json()));  // real status codes
  return res.json();
};

const orders = await call("sale.order", "search_read", {
  domain: [["state", "=", "sale"]],
  fields: ["name", "amount_total"],
  limit: 5,
});

const id = await call("sale.order", "create", {
  vals_list: [{ partner_id: 14, order_line: [[0, 0, { product_id: 23, product_uom_qty: 2 }]] }],
});

await call("sale.order", "action_confirm", { ids: [id] });`}
        />
      </GuideSection>

      <GuideSection heading="curl, for checking a connection quickly">
        <p>
          Before writing any integration code, prove the credentials work.
          These two commands are the fastest way to find out whether a
          problem is the URL, the database name, the key or your code.
        </p>
        <CodeBlock
          label="Shell"
          code={`# Odoo 19+ (JSON-2): does the key work?
curl https://example.odoo.com/json/2/res.users/context_get \\
  -H "Authorization: bearer $ODOO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{}'

# Any version: what version is this server?
curl https://example.odoo.com/jsonrpc \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"call",
       "params":{"service":"common","method":"version","args":[]}}'

# Odoo 16 to 21 (JSON-RPC): authenticate, then read
curl https://example.odoo.com/jsonrpc \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"call","params":{"service":"object","method":"execute_kw",
       "args":["example",2,"'"$ODOO_API_KEY"'","res.partner","search_read",
               [[["is_company","=",true]]],{"fields":["name"],"limit":3}]}}'`}
        />
        <p>
          On JSON-2 a bad key gives a real <code>401</code>. On JSON-RPC the
          same failure is an HTTP 200 with an error object, which is why the
          examples above check for <code>error</code> explicitly.
        </p>
      </GuideSection>

      <GuideSection heading="Which ORM methods do you actually need?">
        <p>
          Most integrations use six, plus the business methods behind
          Odoo&apos;s own buttons.
        </p>
        <ComparisonTable
          caption="The methods behind almost every Odoo integration"
          headers={["Method", "What it does", "Typical call"]}
          rows={[
            ["search_read", "Search and read in one transaction", "domain, fields, limit, order"],
            ["read", "Read known ids", "ids, fields"],
            ["search_count", "Count without fetching", "domain"],
            ["read_group", "Aggregate (sums, counts, by day)", "domain, fields, groupby"],
            ["create", "Create a record, returns the id", "values dict"],
            ["write", "Update records", "ids, values dict"],
            ["action_confirm, button_validate", "Run the real business logic behind a button", "ids"],
          ]}
        />
        <p>
          Prefer <code>search_read</code> over <code>search</code> then{" "}
          <code>read</code>: it is one transaction, so a record removed
          between the two calls cannot break it. Prefer{" "}
          <code>read_group</code> over fetching rows and summing them in your
          app: the database does the work and you transfer far less. And
          prefer calling the real method (<code>action_confirm</code>,{" "}
          <code>button_validate</code>) over writing a state field directly,
          which skips every side effect Odoo would normally run.
        </p>
      </GuideSection>

      <GuideSection heading="How do domains work?">
        <p>
          A domain is a list of conditions in the form{" "}
          <code>[field, operator, value]</code>. Conditions in a flat list are
          combined with AND. For OR and NOT, add the prefix operators{" "}
          <code>&quot;|&quot;</code> and <code>&quot;!&quot;</code> before the
          conditions they apply to.
        </p>
        <CodeBlock
          label="Domain examples"
          code={`# AND: confirmed orders over 1000
[["state", "=", "sale"], ["amount_total", ">", 1000]]

# OR: draft or sent
["|", ["state", "=", "draft"], ["state", "=", "sent"]]

# Same thing, shorter
[["state", "in", ["draft", "sent"]]]

# Dotted paths follow relations: orders whose customer is a company
[["partner_id.is_company", "=", True]]

# Date ranges use plain strings, server time zone is UTC
[["date_order", ">=", "2026-09-01 00:00:00"]]

# Useful operators: =, !=, >, >=, <, <=, in, not in, like, ilike, child_of`}
        />
      </GuideSection>

      <GuideSection heading="What breaks in production, and how to avoid it">
        <p>
          A short list from apps we run against real Odoo databases every
          day.
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Multi-company data.</strong> A user with access to several
            companies returns records from all of them unless you pass{" "}
            <code>allowed_company_ids</code> in the context. See{" "}
            <Link href="/guides/odoo-api-multi-company-filtering" className={LINK}>
              the multi-company guide
            </Link>
            .
          </li>
          <li>
            <strong>Silent JSON-RPC errors.</strong> HTTP 200 with an{" "}
            <code>error</code> key, as above. Check it on every call.
          </li>
          <li>
            <strong>Unbounded reads.</strong> Always pass <code>limit</code>{" "}
            and <code>fields</code>. Fetching every field of every record is
            the usual cause of a slow integration.
          </li>
          <li>
            <strong>Chatty loops.</strong> One call per record will crawl.
            Batch: <code>write</code> accepts many ids, <code>create</code>{" "}
            accepts a list of value dicts, and domains accept{" "}
            <code>in</code>.
          </li>
          <li>
            <strong>Access rights.</strong> The API runs as the user, so an
            integration user needs the right groups; test as that user, never
            as an administrator, or you will discover the rules in
            production.
          </li>
          <li>
            <strong>Transactions.</strong> Each JSON-2 call is its own
            transaction and cannot be chained, so a create and a confirm are
            two separate commits. When both must happen together, call one
            method that does both.
          </li>
        </ul>
      </GuideSection>

      <GuideSection heading="Where does this code belong?">
        <p>
          On a server you control: your app&apos;s backend, a scheduled job, a
          small service. Never in a browser or mobile client, because the API
          key would ship with it. In the apps we build the pattern is always
          the same: the Odoo calls live in one module, the screens call that
          module, and swapping JSON-RPC for JSON-2 later touches one file. If
          you want that built for a specific workflow rather than assembled
          from scratch, that is{" "}
          <Link href="/odoo-api-development" className={LINK}>
            the work we do
          </Link>
          .
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
