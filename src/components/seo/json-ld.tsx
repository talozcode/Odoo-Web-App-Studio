/**
 * Renders a single JSON-LD <script> tag from a plain data object.
 *
 * Centralizing this in one place means every structured-data block on the
 * site goes through the same (safe) serialization path instead of each page
 * hand-rolling its own dangerouslySetInnerHTML call.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // `<` is escaped so a literal "</script>" (or "<!--") inside a string
  // value can never prematurely close the script tag or break the HTML
  // parser. JSON.stringify already produces valid, correctly escaped JSON;
  // this only affects how that JSON is embedded in the surrounding HTML.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
