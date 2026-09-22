# SEO and GEO plan, odoowebapps.com

Written 22/09/2026, revised the same day after the audits in
`docs/seo-research.md`. Search Console is verified. Done so far:
per-page metadata with social cards on every page, query-bearing titles,
real sitemap dates, founder Person entity and bylines, breadcrumb and
organisation schema, Odoo 19 API facts corrected across the site,
entity consistency fixes, internal links, llms.txt to spec plus
llms-full.txt, IndexNow key and script, contact form lead event.

## 1. Indexing (this week, owner has the console)

- Search Console: submit `https://odoowebapps.com/sitemap.xml`, request
  indexing for `/`, `/work`, `/guides` and the 7 use-case pages.
- Bing Webmaster Tools: add the site (it imports from Search Console)
  and run `node scripts/indexnow.mjs` after each content deploy.
- Create LinkedIn and GitHub profiles for Tal Oz and put the URLs in
  `FOUNDER.sameAs` (`src/config/brand.ts`).

## 2. Content that can rank (weeks 1 to 6)

Order chosen by SERP openness, commercial value and what we already
have material for. Each page: 1,500 to 2,000 words, question headings,
at least one table or code block, links to the matching use-case page
and Work case, `dateModified` set when revised.

1. NEW `odoo-json-rpc-xml-rpc-cookbook`: runnable Python, JavaScript
   and curl for authenticate, search_read with a domain, create, write,
   action_confirm, both JSON-RPC and JSON-2. Publish the same client as
   an MIT package on GitHub and npm and link it.
2. NEW `odoo-19-json-2-api`: what changed, request shape, key rotation,
   plan gate, migration table from XML-RPC and JSON-RPC, the Odoo 22
   removal date.
3. Expand `how-much-does-a-custom-odoo-app-cost`: price table from
   config by app type, hourly-rate comparison, licence vs
   implementation vs small connected app, worked example.
4. Expand `odoo-barcode-app-buy-or-build` into the Odoo Barcode vs OCA
   vs Ventor vs custom comparison, with the expiry-check case.
5. Expand `odoo-customer-self-service-portal` with the built-in vs
   custom table and the wholesale portal case.
6. Expand `odoo-customization-vs-custom-apps` into the Studio vs custom
   module vs external app decision guide.
7. NEW `odoo-api-keys-setup` for Odoo 17, 18 and 19.
8. Expand `odoo-api-multi-company-filtering` with code
   (`allowed_company_ids` context, `company_id` domains).
9. NEW `odoo-api-limits-batching-caching`.
10. NEW comparison: inSitu / Orders in Seconds vs a three-screen Odoo
    sales app.

Then one new guide every two weeks from Search Console queries.

## 3. Work case pages (weeks 3 to 5)

`/work/<slug>` for the eight cases: flow diagram, spec sheet, 400 to 600
words on the problem and the build, the real numbers, Article and
BreadcrumbList schema, links from the matching guides. Start with the
kitchen production board and the wholesale portal (open SERPs).
Screenshots slot in as they are sanitised.

## 4. Links and corroboration (ongoing, an hour a week)

- Answer the community threads listed in the research with the guide
  that honestly answers them, starting with the live Odoo forum thread
  on connecting a custom MVP app with the external API.
- The open-source client from item 2.1 with a README that links the
  cookbook.
- One guest article on an Odoo partner's blog about the small-app-next-
  to-Odoo approach, once the cookbook exists to point at.
- No paid directories, no link schemes.

## 5. GEO maintenance

- Keep question headings with the answer in the first sentence.
- Keep entity facts identical across homepage, About, llms.txt, schema.
- `llms-full.txt` regenerates on every build; check it after adding a
  page type the extractor does not know.
- Show "Updated" dates when guides are revised.

## 6. Measure

- Monthly: Search Console queries and pages; a query with impressions
  and no page gets a page or a section.
- Vercel Analytics: `contact_submitted` events per page.
- Quarterly: refresh the five core guides, bump `dateModified`.

## Not doing

- No fabricated reviews, testimonials or "trusted by" logos.
- No paid directories, link schemes or AI-spun articles.
- No keyword pages for terms we would not actually take on.
