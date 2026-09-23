#!/usr/bin/env node
/**
 * Generates public/llms-full.txt: the full text of every guide and use-case
 * page, in reading order, for answer engines that read one file instead of
 * crawling. Runs before `next build` (see package.json "prebuild") so the
 * file ships with the static assets.
 *
 * The pages are JSX, so this extracts prose from the source rather than
 * rendering React: section headings, paragraphs, list items, FAQ pairs.
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = "https://odoowebapps.com";

const ENTITIES = { "&apos;": "'", "&quot;": '"', "&amp;": "&", "&lt;": "<", "&gt;": ">", "&nbsp;": " " };

const money = (n) => `$${n.toLocaleString("en-US")}`;

/**
 * pricing.ts builds the entry price from ENTRY_PRICE rather than repeating
 * the number, so resolve that template literal to a plain quoted string
 * before any of the price regexes below read the file.
 */
async function readPricingSource() {
  const src = await readFile(path.join(root, "src/config/pricing.ts"), "utf8");
  const entry = money(Number(src.match(/ENTRY_PRICE\s*=\s*(\d+)/)[1]));
  return src.replace(/`From \$\{ENTRY_PRICE_LABEL\}`/g, `"From ${entry}"`);
}

// The cost guides print prices from config through JSX expressions. Resolve
// the ones they use from the same config files so the text stays accurate.
async function priceExpressions() {
  const examples = await readFile(path.join(root, "src/config/examples.ts"), "utf8");
  const priceOf = (id) => Number(examples.match(new RegExp(`id:\\s*"${id}"[\\s\\S]*?priceFrom:\\s*(\\d+)`))[1]);
  const pricing = await readPricingSource();
  const tinyPrice = pricing.match(/id:\s*"tiny"[\s\S]*?price:\s*"([^"]+)"/)[1];
  const tinyName = pricing.match(/id:\s*"tiny"[\s\S]*?name:\s*"([^"]+)"/)[1];
  const tinyExamples = pricing.match(/id:\s*"tiny"[\s\S]*?examples:\s*\[([^\]]*)\]/)[1]
    .split(",").map((x) => x.trim().replace(/^"|"$/g, "").toLowerCase()).filter(Boolean).join(", ");
  const appIds = ["warehouse-picking", "sales-app", "management-dashboard", "customer-ordering-portal", "supplier-portal"];
  const appPrices = appIds.map(priceOf);
  const appRange = `${money(Math.min(...appPrices))}-${money(Math.max(...appPrices))}`;
  return {
    "{tinyTier.price.toLowerCase()}": tinyPrice.toLowerCase(),
    "{tinyTier.price}": tinyPrice,
    "{tinyTier.name}": tinyName,
    '{tinyTier.examples.join(", ").toLowerCase()}': tinyExamples,
    "{appTier.price}": appRange,
    "{warehousePrice}": money(priceOf("warehouse-picking")),
    "{portalPrice}": money(priceOf("customer-ordering-portal")),
    "{workflowPrice}": money(priceOf("custom-workflow")),
    "{salesPrice}": money(priceOf("sales-app")),
    "{dashboardPrice}": money(priceOf("management-dashboard")),
    "{supplierPrice}": money(priceOf("supplier-portal")),
  };
}
const PRICES = await priceExpressions();

function clean(jsx) {
  for (const [expr, value] of Object.entries(PRICES)) jsx = jsx.split(expr).join(value);
  return jsx
    .replace(/\{"\s*"\}/g, " ")
    .replace(/\{`([^`]*)`\}/g, "$1")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<code>([^<]*)<\/code>/g, "`$1`")
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, (m) => ENTITIES[m] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

// String literal or template literal value for a JS/JSX attribute or key.
function literal(src, key) {
  const m = src.match(new RegExp(`${key}\\s*[:=]\\s*(?:"([^"]*)"|'([^']*)'|\`([^\`]*)\`)`));
  return m ? (m[1] ?? m[2] ?? m[3]) : "";
}

// Split JSX children into blocks: <p>, <li>, <h3>, and headings passed as props.
function blocks(jsx) {
  const out = [];
  const re = /<(p|li|h2|h3|h4|pre)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(jsx))) {
    if (m[1] === "pre") {
      const code = m[2].replace(/^\{`/, "").replace(/`\}$/, "").replace(/&[a-z]+;/g, (e) => ENTITIES[e] ?? e).trim();
      if (code) out.push("```", code, "```");
      continue;
    }
    const text = clean(m[2]);
    if (!text) continue;
    if (m[1] === "li") out.push(`- ${text}`);
    else if (m[1].startsWith("h")) out.push(`### ${text}`);
    else out.push(text);
  }
  return out;
}

function guideSections(src) {
  const out = [];
  const re = /<GuideSection\s+heading=(?:"([^"]*)"|\{`([^`]*)`\})\s*>([\s\S]*?)<\/GuideSection>/g;
  let m;
  while ((m = re.exec(src))) {
    out.push(`## ${clean(m[1] ?? m[2])}`, ...blocks(m[3]));
  }
  return out;
}

function landingPageSections(src) {
  const out = [];
  const re = /heading:\s*"([^"]*)",\s*body:\s*\(([\s\S]*?)\),?\s*\}/g;
  let m;
  while ((m = re.exec(src))) {
    out.push(`## ${m[1]}`, ...blocks(m[2]));
  }
  return out;
}

function faqs(src) {
  const out = [];
  const re = /question:\s*"([^"]*)",\s*answer:\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(src))) out.push(`**${m[1]}** ${m[2]}`);
  return out;
}

async function guideMetas() {
  const src = await readFile(path.join(root, "src/config/guides.ts"), "utf8");
  const re = /slug:\s*"([^"]+)",(?:\s*topic:\s*"[^"]+",)?\s*title:\s*"([^"]+)",(?:\s*seoTitle:\s*"[^"]+",)?\s*description:\s*"([^"]+)",\s*datePublished:\s*"([^"]+)",?(?:\s*dateModified:\s*"([^"]+)")?/g;
  const out = [];
  let m;
  while ((m = re.exec(src))) out.push({ slug: m[1], title: m[2], description: m[3], date: m[4], updated: m[5] });
  return out;
}

async function landingPageSlugs() {
  const src = await readFile(path.join(root, "src/config/use-case-pages.ts"), "utf8");
  const re = /slug:\s*"([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(src))) out.push(m[1]);
  return out;
}

const lines = [
  "# OdooWebApps, full text",
  "",
  `> Every guide and use-case page on ${SITE_URL}, in full, for answer engines. The short index is at ${SITE_URL}/llms.txt. OdooWebApps builds small web apps connected to a customer's existing Odoo through its external API (JSON-2 on Odoo 19; JSON-RPC and XML-RPC on earlier versions); it does not replace Odoo and is not an implementation partner. Written by Tal Oz.`,
  "",
];

// Work cases, FAQ and pricing come straight from config: the only original
// data on the site, so they go first.
{
  const work = await readFile(path.join(root, "src/config/work.ts"), "utf8");
  const context = work.match(/WORK_CONTEXT =\s*"([^"]+)"/)?.[1] ?? "";
  lines.push("# Work: apps in production (anonymised)", "", `URL: ${SITE_URL}/work`, "", context, "");
  const caseRe = /slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*users:\s*"([^"]+)",\s*replaced:\s*"([^"]+)",\s*models:\s*\[([^\]]*)\],\s*summary:\s*"([^"]+)",(?:\s*facts:\s*\[([^\]]*)\],)?/g;
  let m;
  while ((m = caseRe.exec(work))) {
    const quoted = (list) => [...list.matchAll(/"([^"]*)"/g)].map((q) => q[1]);
    const models = quoted(m[5]).join(", ");
    const facts = quoted(m[7] ?? "");
    lines.push(`## ${m[2]}`, `URL: ${SITE_URL}/work#${m[1]}`, "", m[6], "", `- Used by: ${m[3]}`, `- Replaced: ${m[4]}`, `- Odoo models: ${models}`, ...facts.map((f) => `- ${f}`), "");
  }

  const pricing = await readPricingSource();
  lines.push("# Pricing", "", `URL: ${SITE_URL}/#pricing`, "");
  const tierRe = /name:\s*"([^"]+)",\s*price:\s*([^,]+),(?:\s*priceQualifier:\s*"([^"]+)",)?\s*description:\s*(?:\n\s*)?"([^"]+)"/g;
  while ((m = tierRe.exec(pricing))) {
    const price = m[2].replace(/"/g, "").trim() === "APP_TIER_PRICE_RANGE" ? PRICES["{appTier.price}"] : m[2].replace(/"/g, "").trim();
    lines.push(`- ${m[1]}: ${m[3] ? m[3].toLowerCase() + " " : ""}${price}. ${m[4]}`);
  }
  const examples = await readFile(path.join(root, "src/config/examples.ts"), "utf8");
  const exRe = /name:\s*"([^"]+)",\s*description:\s*(?:\n\s*)?"([^"]+)",\s*models:\s*\[([^\]]*)\],\s*priceFrom:\s*(\d+)/g;
  while ((m = exRe.exec(examples))) {
    lines.push(`- ${m[1]}: from $${Number(m[4]).toLocaleString("en-US")}. ${m[2]}`);
  }
  lines.push("");

  const faq = await readFile(path.join(root, "src/config/faq.ts"), "utf8");
  lines.push("# Frequently asked questions", "", `URL: ${SITE_URL}/#faq`, "");
  const faqRe = /question:\s*"([^"]+)",\s*answer:\s*(?:\n\s*)?(?:"([^"]+)"|`([^`]+)`)/g;
  while ((m = faqRe.exec(faq))) {
    let answer = m[2] ?? m[3];
    answer = answer.replace(/\$\{TINY\.price\.toLowerCase\(\)\}/g, PRICES["{tinyTier.price.toLowerCase()}"]).replace(/\$\{APP\.price\}/g, PRICES["{appTier.price}"]);
    lines.push(`**${m[1]}** ${answer}`);
  }
  lines.push("");
}

lines.push("# Use-case pages", "");
for (const slug of await landingPageSlugs()) {
  const src = await readFile(path.join(root, "src/app", slug, "page.tsx"), "utf8");
  const h1 = literal(src, "h1");
  const intro = literal(src, "intro");
  lines.push(`## ${h1}`, `URL: ${SITE_URL}/${slug}`, "", intro, "", ...landingPageSections(src).map((l) => l.replace(/^## /, "### ")));
  const faq = faqs(src);
  if (faq.length) lines.push("", "### Questions about this use case", ...faq);
  lines.push("");
}

lines.push("# Guides", "");
const guidesDir = path.join(root, "src/app/guides");
const metas = await guideMetas();
for (const meta of metas) {
  const file = path.join(guidesDir, meta.slug, "page.tsx");
  let src;
  try {
    src = await readFile(file, "utf8");
  } catch {
    continue;
  }
  lines.push(`## ${meta.title}`, `URL: ${SITE_URL}/guides/${meta.slug}`, `Published: ${meta.date}${meta.updated ? `, updated ${meta.updated}` : ""}`, "", meta.description, "", ...guideSections(src).map((l) => l.replace(/^## /, "### ")), "");
}

const known = new Set(metas.map((m) => m.slug));
for (const entry of await readdir(guidesDir, { withFileTypes: true })) {
  if (entry.isDirectory() && !known.has(entry.name)) {
    console.warn(`llms-full: guide directory ${entry.name} has no entry in src/config/guides.ts`);
  }
}

const out = path.join(root, "public/llms-full.txt");
await writeFile(out, lines.join("\n") + "\n");
console.log(`wrote ${out} (${lines.length} lines)`);

// public/llms.txt is hand written apart from its Guides list, which is just
// GUIDES restated and had already drifted once. Regenerate that one block
// from the same config so it cannot drift again.
{
  const file = path.join(root, "public/llms.txt");
  const src = await readFile(file, "utf8");
  const block = metas
    .map((m) => `- [${m.title}](${SITE_URL}/guides/${m.slug}): ${m.description}`)
    .join("\n");
  const re = /(^## Guides\n\n)[\s\S]*?(?=\n## )/m;
  if (!re.test(src)) {
    console.warn("llms.txt: no '## Guides' section found, left untouched");
  } else {
    const next = src.replace(re, (_, heading) => `${heading}${block}\n`);
    if (next !== src) {
      await writeFile(file, next);
      console.log(`synced ${file} guides list (${metas.length} guides)`);
    }
  }
}
