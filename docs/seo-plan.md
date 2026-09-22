# SEO plan, odoowebapps.com

Written 22/09/2026. Search Console is verified; sitemap has 29 URLs;
16 guides and 7 use-case pages exist; JSON-LD, llms.txt, robots and
canonicals are in place. This is what comes next, in order of leverage.

## 1. Fix the signals we already send (week 1)

- Sitemap `lastModified`: every non-guide URL currently reports "now" on
  each build, which tells Google nothing. Use a real per-page date from a
  small `updated` field in the page configs.
- Add `dateModified` to guide schema when a guide is genuinely revised.
- Author entity: add a real byline ("Tal Oz") with a `Person` in the
  Organization schema (`founder`) and `sameAs` links once the LinkedIn and
  GitHub profiles exist. This is the E-E-A-T signal the site lacks.
- Submit the sitemap in Search Console; request indexing for `/`, `/work`,
  `/guides` and the 7 use-case pages.
- Check Core Web Vitals in Search Console after two weeks; the hero
  animation is CSS only and should not register, but confirm.

## 2. Make the guides worth ranking (weeks 2 to 6)

The guides are 550 to 700 words each. That is thin for the terms they
target. Expand the five with the most search intent to 1,500 to 2,000
words with code and tables, in this order:

1. `odoo-api-integration-explained`: real JSON-RPC and XML-RPC examples in
   Python and JavaScript (authenticate, search_read with a domain, create,
   write, calling a button method), API key setup in Odoo 18, common
   errors. Target: "odoo json-rpc example", "odoo xml-rpc python",
   "odoo api key".
2. `odoo-rest-api-explained`: same treatment plus a short section on
   putting a thin REST layer in front. Target: "odoo rest api".
3. `how-much-does-a-custom-odoo-app-cost`: a table by app type with the
   real price points from config, what moves the price, worked example.
   Target: "odoo custom app cost", "odoo development cost".
4. `odoo-barcode-app-buy-or-build`: feature comparison table against
   Odoo Barcode, and the expiry-safety case from the Work page.
   Target: "odoo barcode app", "odoo warehouse scanner app".
5. `odoo-customer-self-service-portal`: portal vs custom comparison table,
   the B2B ordering portal case. Target: "odoo b2b portal", "odoo customer
   portal customisation".

Then new guides, one every two weeks, from queries Search Console starts
showing plus these known gaps:
- Odoo API authentication and API keys in Odoo 18 (step by step)
- Odoo multi-company through the API (we have the scars; strong page)
- Odoo external API limits: rate, batching, what to cache
- Odoo 18 API changes that break integrations
- Building a supplier portal on Odoo Purchase
- Odoo production board for a kitchen or small factory (from the Work page)

## 3. Give each Work case its own URL (weeks 3 to 5)

`/work/<slug>` pages for the eight cases, each with the flow diagram, the
spec sheet, 400 to 600 words on the problem and the build, and `Article`
plus `BreadcrumbList` schema. These target long-tail terms nobody else
covers ("odoo container planning app", "odoo kitchen production board",
"odoo haccp forms") and give the guides something concrete to link to.
Screenshots slot in as they are sanitised.

## 4. Earn links (ongoing, an hour a week)

- Publish the JSON-RPC client from `src/lib/odoo` as a small MIT package
  on GitHub and npm with a README that links the API guide. Odoo devs
  search for exactly this.
- Answer questions on the Odoo forum, r/Odoo and Stack Overflow where a
  guide is the honest answer; link the guide, not the homepage.
- One listing each on the Odoo community and integration directories that
  accept independent studios; skip pay-to-list directories.
- A guest article on an Odoo partner's blog about the "small app next to
  Odoo" approach, once the expanded API guide exists to point at.

## 5. AI search (week 2, then maintain)

- Add `llms-full.txt` with the full text of every guide and use-case page
  so answer engines can quote the site without crawling.
- Keep every guide section as a question heading followed by a direct
  answer in the first sentence; this is already the pattern, keep it.
- Keep entity facts identical everywhere (name, what we do, who we are
  not, prices): homepage, About, llms.txt, schema.

## 6. Measure

- Monthly: Search Console queries and pages; any query with impressions
  and no page gets a page or a section.
- Vercel Analytics: track contact form submissions as a custom event so
  pages can be judged by leads, not visits.
- Quarterly: refresh the five core guides, bump `dateModified`.

## Not doing

- No fabricated reviews, testimonials or "trusted by" logos.
- No paid directories, link schemes or AI-spun articles.
- No keyword pages for terms we would not actually take on.
