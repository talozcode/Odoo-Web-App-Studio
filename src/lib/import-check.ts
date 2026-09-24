/**
 * Checks a CSV file against the ways an Odoo import goes wrong, before it
 * is imported. Pure and synchronous so it runs entirely in the visitor's
 * browser: the file is never uploaded anywhere.
 *
 * Every rule here traces to Odoo's own export/import documentation. Where
 * that documentation is silent, the finding is a note, not an error.
 */

export type Severity = "error" | "warning" | "note";

export type Finding = {
  severity: Severity;
  title: string;
  detail: string;
  /** Up to a handful of concrete locations, e.g. "Row 7, Country". */
  where?: string[];
};

export type CheckResult = {
  rows: number;
  columns: number;
  delimiter: "," | ";" | "\t";
  findings: Finding[];
};

const MAX_EXAMPLES = 5;

// ---------------------------------------------------------------- parsing

function detectDelimiter(text: string): "," | ";" | "\t" {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
  const counts = { ",": 0, ";": 0, "\t": 0 } as Record<"," | ";" | "\t", number>;
  let quoted = false;
  for (const ch of firstLine) {
    if (ch === '"') quoted = !quoted;
    else if (!quoted && ch in counts) counts[ch as "," | ";" | "\t"]++;
  }
  const best = (Object.keys(counts) as ("," | ";" | "\t")[]).sort((a, b) => counts[b] - counts[a])[0];
  return counts[best] > 0 ? best : ",";
}

/** RFC 4180: quoted fields, doubled quotes, newlines inside quotes. */
export function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"' && field === "") quoted = true;
    else if (ch === delimiter) {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  // A trailing newline leaves one empty row behind; so do blank lines.
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

// ---------------------------------------------------------------- helpers

type ColumnKind =
  | { kind: "externalId" }
  | { kind: "databaseId" }
  | { kind: "ref"; mech: "external" | "database"; base: string }
  | { kind: "plain"; base: string };

function classify(header: string): ColumnKind {
  const h = header.trim();
  const lower = h.toLowerCase();
  if (lower === "id" || lower === "external id") return { kind: "externalId" };
  if (lower === ".id" || lower === "database id") return { kind: "databaseId" };
  const slash = h.lastIndexOf("/");
  if (slash > 0) {
    const base = h.slice(0, slash).trim().toLowerCase();
    const suffix = h.slice(slash + 1).trim().toLowerCase();
    if (suffix === "id" || suffix === "external id") return { kind: "ref", mech: "external", base };
    if (suffix === ".id" || suffix === "database id") return { kind: "ref", mech: "database", base };
  }
  return { kind: "plain", base: lower };
}

const isBlank = (v: string | undefined) => v === undefined || v.trim() === "";
const loc = (rowIndex: number, header: string) => `Row ${rowIndex + 2}, ${header}`;

// Numbers Odoo documents as readable: separators either way round, a minus,
// parentheses for negatives, and a currency sign next to the digits.
const NUMBER = /^\s*[-+]?\(?\s*[^\d\s(),.\-A-Za-z]?\s*[\d][\d.,\s]*\s*[^\d\s(),.A-Za-z]?\s*\)?\s*$/;
const looksNumeric = (v: string) => NUMBER.test(v) && /\d/.test(v);

// Dates written with separators; the time part, if any, is ignored.
const DATE = /^\s*(\d{1,4})([-/.])(\d{1,2})\2(\d{1,4})(?:[ T].*)?\s*$/;

// ---------------------------------------------------------------- checks

export function checkImportCsv(raw: string): CheckResult {
  const findings: Finding[] = [];
  const add = (f: Finding) => findings.push({ ...f, where: f.where?.slice(0, MAX_EXAMPLES) });

  const text = raw.replace(/^\uFEFF/, "");
  const delimiter = detectDelimiter(text);
  const table = parseCsv(text, delimiter);

  if (table.length === 0) {
    return { rows: 0, columns: 0, delimiter, findings: [{ severity: "error", title: "The file is empty", detail: "There is nothing to import." }] };
  }

  const headers = table[0].map((h) => h.trim());
  const rows = table.slice(1);
  const width = headers.length;

  // --- file-level
  if (delimiter === "\t") {
    add({
      severity: "error",
      title: "Tab-separated file",
      detail: "Odoo does not detect tabs as a separator. Re-save the file as comma-separated CSV from your spreadsheet application.",
    });
  } else if (delimiter === ";") {
    add({
      severity: "note",
      title: "Semicolon-separated file",
      detail: "Odoo assumes commas. Set the separator to semicolon in the import screen's formatting options, or re-save the file with commas.",
    });
  }

  if (raw.includes("\uFFFD")) {
    add({
      severity: "warning",
      title: "The file is not valid UTF-8",
      detail: "Some characters could not be read, which usually means the file was saved in a regional encoding. Accented names will import garbled. Re-save as CSV UTF-8.",
    });
  }

  if (rows.length === 0) {
    add({ severity: "error", title: "Header row only", detail: "The file has column names but no records under them." });
  }

  if (rows.length > 1000) {
    add({
      severity: "note",
      title: `${rows.length.toLocaleString("en-US")} rows in one file`,
      detail: "Large imports can time out. Odoo's own advice is to import in smaller batches.",
    });
  }

  const seenHeaders = new Map<string, number>();
  headers.forEach((h, i) => {
    const key = h.toLowerCase();
    if (seenHeaders.has(key)) {
      add({ severity: "error", title: `Column "${h}" appears twice`, detail: "Two columns with the same name map to the same field; one silently wins.", where: [`Columns ${seenHeaders.get(key)! + 1} and ${i + 1}`] });
    } else seenHeaders.set(key, i);
    if (h === "") add({ severity: "warning", title: "A column has no name", detail: "Odoo cannot map an unnamed column to a field, so its data will be skipped.", where: [`Column ${i + 1}`] });
  });

  const ragged = rows.map((r, i) => (r.length !== width ? i : -1)).filter((i) => i >= 0);
  if (ragged.length > 0) {
    add({
      severity: "error",
      title: `${ragged.length} ${ragged.length === 1 ? "row has" : "rows have"} the wrong number of columns`,
      detail: `The header has ${width} columns. Usually an unquoted separator inside a value, such as a comma in an address.`,
      where: ragged.map((i) => `Row ${i + 2}: ${rows[i].length} columns`),
    });
  }

  const kinds = headers.map(classify);
  const col = (i: number) => rows.map((r) => r[i] ?? "");

  // --- external IDs
  const idIndex = kinds.findIndex((k) => k.kind === "externalId");
  const definedIds = new Set<string>();
  if (idIndex === -1) {
    if (kinds.every((k) => k.kind !== "databaseId")) {
      add({
        severity: "warning",
        title: "No external ID column",
        detail: "Without an ID column every import creates new records. Importing the same file twice, or a corrected copy, produces duplicates instead of updates. Add a column named \"id\" with a unique value per record.",
      });
    }
  } else {
    const values = col(idIndex);
    const firstRow = new Map<string, number>();
    const dupes: string[] = [];
    const spaced: string[] = [];
    const numeric: string[] = [];
    values.forEach((v, i) => {
      if (isBlank(v)) return;
      if (v !== v.trim()) spaced.push(loc(i, headers[idIndex]));
      const id = v.trim();
      definedIds.add(id);
      if (/^\d+$/.test(id)) numeric.push(loc(i, headers[idIndex]));
      if (firstRow.has(id)) dupes.push(`"${id}" on rows ${firstRow.get(id)! + 2} and ${i + 2}`);
      else firstRow.set(id, i);
    });
    if (dupes.length > 0) {
      add({ severity: "error", title: `${dupes.length} duplicate external ${dupes.length === 1 ? "ID" : "IDs"}`, detail: "An external ID identifies one record. Two rows with the same ID update the same record, and the later row wins.", where: dupes });
    }
    if (numeric.length > 0) {
      add({
        severity: "warning",
        title: "External IDs are plain numbers",
        detail: "External IDs must be unique across every model in the database, not just this file. Odoo recommends prefixing them with the table name, such as customer_1 rather than 1, so they cannot collide with IDs from another file.",
        where: numeric,
      });
    }
    if (spaced.length > 0) {
      add({ severity: "warning", title: "External IDs with leading or trailing spaces", detail: "The space is part of the ID, so a later file referring to it without the space will not find it.", where: spaced });
    }
  }

  // --- relation columns: one mechanism per field, and the right header
  const byBase = new Map<string, { header: string; mech: string }[]>();
  kinds.forEach((k, i) => {
    if (k.kind === "ref" || k.kind === "plain") {
      const mech = k.kind === "ref" ? k.mech : "name";
      const list = byBase.get(k.base) ?? [];
      list.push({ header: headers[i], mech });
      byBase.set(k.base, list);
    }
  });
  for (const list of byBase.values()) {
    const mechs = new Set(list.map((c) => c.mech));
    if (list.length > 1 && mechs.size > 1) {
      add({
        severity: "error",
        title: "One field referenced more than one way",
        detail: `Odoo supports referencing a related record by name, by database ID or by external ID, but only one mechanism per field. These columns fill the same field: ${list.map((c) => `"${c.header}"`).join(", ")}. Keep one.`,
      });
    }
  }

  const undefinedRefs = new Map<string, number>();
  kinds.forEach((k, i) => {
    if (k.kind !== "ref" || k.mech !== "external") return;
    const spaced: string[] = [];
    const commaSpace: string[] = [];
    col(i).forEach((v, r) => {
      if (isBlank(v)) return;
      if (/,\s+\S/.test(v)) commaSpace.push(loc(r, headers[i]));
      for (const part of v.split(",")) {
        if (part !== part.trim() && !/,\s/.test(v)) spaced.push(loc(r, headers[i]));
        const ref = part.trim();
        if (ref && !ref.includes(".") && !definedIds.has(ref) && !undefinedRefs.has(ref)) {
          undefinedRefs.set(ref, r + 2);
        }
      }
    });
    if (commaSpace.length > 0) {
      add({
        severity: "warning",
        title: `Spaces after commas in "${headers[i]}"`,
        detail: "For a field holding several records, such as tags, Odoo expects the values separated by commas with no spaces. The space becomes part of the next ID.",
        where: commaSpace,
      });
    }
    if (spaced.length > 0) {
      add({ severity: "warning", title: `References with stray spaces in "${headers[i]}"`, detail: "The space is part of the reference, so it will not match the external ID it was meant to.", where: spaced });
    }
  });
  if (undefinedRefs.size > 0) {
    add({
      severity: "note",
      title: `${undefinedRefs.size} referenced ${undefinedRefs.size === 1 ? "record is" : "records are"} not defined in this file`,
      detail: "These external IDs must already exist in the database when this file is imported, or every row pointing at them fails with \"no matching record found for external ID\". Import the file that creates them first.",
      where: [...undefinedRefs.entries()].map(([ref, row]) => `"${ref}", first used on row ${row}`),
    });
  }

  // Name columns holding what look like external IDs: the header is missing /id.
  kinds.forEach((k, i) => {
    if (k.kind !== "plain") return;
    const values = col(i).filter((v) => !isBlank(v)).map((v) => v.trim());
    if (values.length < 2) return;
    const xmlIdLike = values.filter((v) => /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(v) || (definedIds.size > 0 && definedIds.has(v)));
    if (xmlIdLike.length / values.length >= 0.8 && idIndex !== i) {
      add({
        severity: "error",
        title: `"${headers[i]}" holds external IDs but is matched by name`,
        detail: `A plain column is matched against record names, so Odoo will look for a record called "${xmlIdLike[0]}" and find nothing. To match by external ID the header must end in /id, as in "${headers[i]}/id".`,
      });
    }
  });

  // --- per-column value checks
  kinds.forEach((k, i) => {
    if (k.kind === "externalId" || k.kind === "databaseId" || k.kind === "ref") return;
    const header = headers[i];
    const values = col(i);
    const filled = values.map((v, r) => ({ v: v.trim(), r })).filter((x) => x.v !== "");

    // Present but entirely empty: overwrites defaults with blanks.
    if (rows.length > 0 && filled.length === 0 && header !== "") {
      add({
        severity: "warning",
        title: `"${header}" is present but empty in every row`,
        detail: "A column that is missing gets Odoo's default value. A column that is present with empty cells sets the field to empty, overriding the default for every record. If you meant to leave it alone, delete the column.",
      });
      return;
    }
    if (filled.length === 0) return;

    // Dates
    const dates = filled.map((x) => ({ ...x, m: DATE.exec(x.v) })).filter((x) => x.m);
    if (dates.length >= Math.max(2, filled.length * 0.8)) {
      const nonIso = dates.filter((d) => d.m![1].length !== 4);
      if (nonIso.length > 0) {
        const firstGt12 = nonIso.some((d) => Number(d.m![1]) > 12);
        const secondGt12 = nonIso.some((d) => Number(d.m![3]) > 12);
        const ambiguous = !firstGt12 && !secondGt12;
        add({
          severity: ambiguous ? "warning" : "note",
          title: ambiguous ? `Dates in "${header}" are ambiguous` : `Dates in "${header}" are not in ISO format`,
          detail: ambiguous
            ? "No value in this column settles whether it is day first or month first, so Odoo has to guess, and a wrong guess imports every date shifted while looking perfectly valid. Use YYYY-MM-DD."
            : "Odoo can usually work these out, but it is guessing. Writing dates as YYYY-MM-DD removes the guess entirely.",
          where: nonIso.slice(0, 3).map((d) => `${loc(d.r, header)}: ${d.v}`),
        });
      }
      return;
    }

    // Numbers
    const rejected = filled.filter(
      (x) =>
        /^[^\d\s(]+\s*\(\s*[\d.,]+\s*\)$/.test(x.v) || // $ (32.000,00): sign outside the parentheses
        /^[A-Za-z]{2,}\s*[\d][\d.,]*$/.test(x.v) // ABC 32.000,00: unknown prefix
    );
    // Malformed numbers still count towards "this is a number column".
    const numeric = filled.filter((x) => looksNumeric(x.v));
    if (numeric.length >= 1 && numeric.length + rejected.length >= Math.max(2, filled.length * 0.6)) {
      if (rejected.length > 0) {
        add({
          severity: "error",
          title: `Numbers Odoo will not read in "${header}"`,
          detail: "Odoo accepts parentheses for negatives and a currency sign next to the number, but the sign has to sit inside the parentheses, and an unrecognised prefix stops the value being a number at all.",
          where: rejected.map((x) => `${loc(x.r, header)}: ${x.v}`),
        });
      }
      // Type decided from the first ten lines, contradicted later.
      const firstTen = values.slice(0, 10).filter((v) => !isBlank(v));
      const laterText = filled.filter((x) => x.r >= 10 && !looksNumeric(x.v) && !rejected.includes(x));
      if (firstTen.length >= 3 && firstTen.every((v) => looksNumeric(v.trim())) && laterText.length > 0) {
        add({
          severity: "warning",
          title: `"${header}" turns from numbers to text after row 11`,
          detail: "Odoo guesses each column's type from the first ten lines of the file. This column looks numeric there, so it may only be offered numeric fields when you map it.",
          where: laterText.map((x) => `${loc(x.r, header)}: ${x.v}`),
        });
      }
    }
  });

  // --- one-to-many continuation rows
  const hasSubfields = headers.some((h) => h.includes("/") && classify(h).kind === "plain");
  if (hasSubfields) {
    const topLevel = kinds.map((k, i) => (k.kind === "plain" && !headers[i].includes("/")) || k.kind === "externalId");
    const continuation = rows.filter((r) => topLevel.every((isTop, i) => !isTop || isBlank(r[i]))).length;
    if (continuation > 0) {
      add({
        severity: "note",
        title: `${continuation} ${continuation === 1 ? "row is an extra line" : "rows are extra lines"} of the record above`,
        detail: "Rows with the parent fields left blank are read as extra lines of the previous record, which is how Odoo imports order lines. That is correct if intended. Repeating the parent fields on each line instead creates a separate record per line.",
      });
    }
  }

  const order: Record<Severity, number> = { error: 0, warning: 1, note: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity]);
  return { rows: rows.length, columns: width, delimiter, findings };
}

/** A deliberately flawed file, so a visitor can see the checker work. */
export const SAMPLE_CSV = `id,name,Country,Country/External ID,Related Company/id,category_id/id,date,credit_limit,comment
1,Bigees,Belgium,base.be,,"cat_retail, cat_wholesale",03/04/2026,32000.00,
2,Organi,France,base.fr,company_1,cat_retail,05/06/2026,"$ (1.500,00)",
2,Boum,Spain,base.es,company_1,cat_wholesale,07/08/2026,ABC 900,
customer_4,Deco Addict,Belgium,base.be,company_9,cat_retail,09/10/2026,4500,
`;
