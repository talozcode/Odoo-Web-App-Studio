#!/usr/bin/env node
/**
 * Submit every sitemap URL to IndexNow (Bing, Yandex, Naver, Seznam, and the
 * answer engines that read Bing's index). Run after a deploy that changes
 * content:  node scripts/indexnow.mjs
 * The key file lives at public/<key>.txt so the host can verify ownership.
 */
const HOST = "odoowebapps.com";
const KEY = "9cd9b046565c384ebde318bcd90b2e33";

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) throw new Error("no URLs found in sitemap");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${res.status} for ${urls.length} URLs`);
if (!res.ok) console.log(await res.text());
