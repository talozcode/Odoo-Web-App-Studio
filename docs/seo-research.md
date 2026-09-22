# SEO and GEO research, 22/09/2026

Condensed from three audits (technical SEO, keyword and competitor
research with 17 live SERP checks, GEO for answer engines). Facts about
Odoo 19 verified against odoo.com/documentation/19.0 on the same day.

## Two findings that change the plan

1. Odoo 19 ships a new HTTP API, JSON-2 (`POST /json/2/<model>/<method>`,
   `Authorization: bearer <api key>`, keys capped at three months). The
   older `/xmlrpc`, `/xmlrpc/2` and `/jsonrpc` endpoints are deprecated,
   removal scheduled for Odoo 22 (fall 2028). On Odoo Online the external
   API is only on the Custom plan. Nobody small owns "odoo json-2 api"
   yet. Our API guides were corrected on 22/09; a dedicated JSON-2 guide
   and a cookbook are the biggest open opportunity.
2. Price transparency is the wedge. Every cost SERP says "$1,500 to
   $10,000+ per module", "$25 to $200 per hour" or "contact us". A page
   with a real price table is unique in the result set.

## Keyword map (owner page in brackets, NEW = page to create)

API and integration: odoo api integration, odoo external api
[api-integration-explained]; odoo rest api, does odoo have a rest api
[rest-api-explained]; odoo json-rpc example, odoo xml-rpc python
example, odoo api javascript, execute_kw search_read example [NEW
cookbook]; odoo json-2 api, odoo 19 api changes [NEW JSON-2 guide]; odoo
api key setup, generate api key odoo 18, odoo api authentication [NEW
API keys guide]; odoo api rate limit [NEW limits guide]; odoo api multi
company [api-multi-company-filtering]; odoo headless react
[custom-odoo-web-app].

Cost: odoo custom app cost, odoo development cost, odoo custom module
cost, odoo developer hourly rate, odoo integration cost
[how-much-does-a-custom-odoo-app-cost]; odoo implementation cost
[implementation-partner-cost]; odoo customization cost
[customization-vs-custom-apps].

Barcode and warehouse: odoo barcode app, odoo barcode app community
edition [barcode-app-buy-or-build]; odoo warehouse app, odoo picking
app, odoo mobile inventory app [/odoo-warehouse-app]; ventor vs odoo
barcode, odoo barcode app alternatives [NEW comparison]; odoo expiry
date scanning app [/work barcode case].

Portals: odoo customer portal, odoo customer portal customization
[customer-self-service-portal]; odoo b2b portal, odoo b2b ordering
portal, odoo b2b order form [/odoo-customer-portal]; odoo supplier
portal, odoo vendor portal [/odoo-supplier-portal].

Dashboards: odoo custom dashboard, odoo management dashboard
[/odoo-dashboard]; odoo dashboard slow [why-is-my-odoo-dashboard-slow];
odoo production board, shop floor display [NEW /work case page].

Pain: odoo is hard to use, odoo user adoption
[signs-your-team-needs-a-simpler-odoo-interface]; sales reps won't use
odoo mobile [why-sales-reps-dont-use-odoo-mobile]; odoo purchase
approval on phone [odoo-purchase-approval-mobile-app].

Comparisons: odoo studio limitations [odoo-studio-limitations]; odoo
studio vs custom module [NEW three-way decision guide]; odoo upgrade
breaks custom modules [what-happens-when-odoo-upgrades]; odoo mobile
order taking app [/odoo-sales-app plus NEW comparison].

Hiring: hire odoo developer (head term, do not chase), odoo freelance
developer small project, odoo developer vs partner
[odoo-developer-vs-web-app-studio]; odoo integration developer
[/odoo-api-development].

## SERP picture

Odoo.com docs and apps.odoo.com hold the API head terms; Cybrosys and
Webkul hold the how-to and module terms; forums and Reddit hold the
pain and "does it exist" questions; small studios (Zeabyte, Fanatics,
Magendoo) already rank for "odoo b2b ordering portal", which shows the
portal SERP is open. Cost SERPs are partner blogs with wide ranges.

Competitors and the gap we exploit: Cybrosys and Webkul (module-shaped
answers, no prices); Cudio and Knit (long partner or iPaaS guides, no
runnable code, no UI angle); OEC.sh (good code, hosting CTA); Wavect
(best technical essay on API limits); Ventor (one packaged picking app);
Octura (in-Odoo only); inSitu and Orders in Seconds (SaaS order taking).

Community threads where a guide is the honest answer: r/Odoo
"External-facing API + React apps", "Any plans for a REST API",
"Custom Module Cost", "mobile or web app for handheld barcode", "Why did
Odoo abandon its mobile apps"; Odoo forum "JSON RPC and API KEY", "JSON
RPC documentation", "B2B e-commerce order form", "Studio or custom
module", "Slow dashboards"; Stack Overflow "and operators in XML-RPC
search_read", "not allowed to modify on a read operation".

## Content gaps, ranked

1. JSON-RPC and XML-RPC cookbook (Python, JavaScript, curl), 2,000 words.
2. Odoo 19 JSON-2 API: what changed, migration table, key rotation.
3. API keys step by step for Odoo 17, 18, 19, including the plan gate.
4. Ventor vs Odoo Barcode vs custom picking app, three columns.
5. Odoo Studio vs custom module vs external web app, decision table.
6. Price list as a page: pick the app type, see the fixed price.
7. /work/kitchen-production-board (Shop Floor is Enterprise-only).
8. Odoo API limits: batching, caching, what to store locally.
9. B2B ordering portal built-in vs custom, plus /work/wholesale case.
10. inSitu / Orders in Seconds vs a three-screen Odoo sales app.

## GEO findings

- Retrieval: guide structure (question headings, direct answers) is
  right; density is low. Highest-value additions are tables (cost,
  barcode, portal, customization vs app, developer vs studio) and code
  (API, multi-company, write-back). Scores 2 to 4 out of 5 per guide.
- Entity consistency fixed on 22/09: one wording for what goes inside
  Odoo, founder named on About with an anchor, prices in the FAQ, Odoo 19
  mentioned. Still open: `FOUNDER.sameAs` (needs LinkedIn and GitHub
  profiles), a proper contact address on the domain.
- Trust: open-source the JSON-RPC/JSON-2 client (npm, MIT); publish the
  /work numbers on their own URLs; answer community threads.
- Test results: for five representative questions, no engine cited the
  site (not yet indexed); citations went to Odoo docs, Knit, Apideck,
  Ecosire, Cleverence, Ventor, OCA, Odoo forum. The pages that would
  earn the citation are the cookbook, the corrected REST guide, the cost
  table, the barcode comparison and the portal comparison.
