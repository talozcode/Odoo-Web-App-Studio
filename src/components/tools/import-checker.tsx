"use client";

import { useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { AlertTriangle, CheckCircle2, FileUp, Info, RotateCcw, XCircle } from "lucide-react";
import { checkImportCsv, SAMPLE_CSV, type CheckResult, type Severity } from "@/lib/import-check";
import { cn } from "@/lib/utils";

const MAX_BYTES = 20 * 1024 * 1024;

const SEVERITY: Record<Severity, { label: [string, string]; icon: typeof XCircle; color: string }> = {
  error: { label: ["error", "errors"], icon: XCircle, color: "var(--danger)" },
  warning: { label: ["warning", "warnings"], icon: AlertTriangle, color: "var(--warning)" },
  note: { label: ["note", "notes"], icon: Info, color: "var(--odoo-teal)" },
};

const DELIMITER_NAME = { ",": "comma separated", ";": "semicolon separated", "\t": "tab separated" } as const;

type State =
  | { status: "idle" }
  | { status: "rejected"; message: string }
  | { status: "done"; fileName: string; result: CheckResult };

/**
 * Drop a CSV in, get back every reason Odoo would reject it or import it
 * wrongly. Nothing leaves the browser: the file is read with the File API
 * and checked by a pure function.
 */
export function ImportChecker() {
  const [state, setState] = useState<State>({ status: "idle" });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  function run(fileName: string, text: string, sample: boolean) {
    const result = checkImportCsv(text);
    setState({ status: "done", fileName, result });
    const count = (s: Severity) => result.findings.filter((f) => f.severity === s).length;
    track("import_checker_run", { sample, errors: count("error"), warnings: count("warning") });
    requestAnimationFrame(() => resultsRef.current?.focus());
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (/\.xlsx?$/i.test(file.name)) {
      setState({ status: "rejected", message: "This checker reads CSV. In Excel or Google Sheets, save or download the sheet as CSV (UTF-8), then drop that file here." });
      return;
    }
    if (file.size > MAX_BYTES) {
      setState({ status: "rejected", message: "That file is over 20 MB. Split it into smaller files; Odoo recommends importing large data in batches anyway." });
      return;
    }
    run(file.name, await file.text(), false);
  }

  function reset() {
    setState({ status: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-[var(--odoo-teal)] bg-[var(--odoo-teal)]/5" : "border-[var(--border)] bg-[var(--surface)]"
        )}
      >
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--odoo-teal)]/10"
        >
          <FileUp className="h-6 w-6 text-[var(--odoo-teal)]" />
        </span>
        <div>
          <p className="text-base font-semibold text-[var(--foreground)]">Drop your import file here</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            CSV only. Checked in your browser; the file is never uploaded.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <label className="inline-flex cursor-pointer items-center rounded-md bg-[var(--odoo-teal)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--odoo-teal-hover)] focus-within:ring-2 focus-within:ring-[var(--odoo-teal)] focus-within:ring-offset-2">
            Choose a file
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv,.xlsx,.xls"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
          <button
            type="button"
            onClick={() => run("sample-contacts.csv", SAMPLE_CSV, true)}
            className="rounded-md text-sm font-medium text-[var(--foreground)] underline underline-offset-4 hover:text-[var(--odoo-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)]"
          >
            Try it on a sample file
          </button>
        </div>
      </div>

      {state.status === "rejected" ? (
        <p role="alert" className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--foreground)]">
          {state.message}
        </p>
      ) : null}

      {state.status === "done" ? (
        <div ref={resultsRef} tabIndex={-1} aria-live="polite" className="flex scroll-mt-24 flex-col gap-4 focus:outline-none">
          <Summary fileName={state.fileName} result={state.result} onReset={reset} />
          {state.result.findings.length === 0 ? (
            <div className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--odoo-teal)]" />
              <div>
                <p className="font-semibold text-[var(--foreground)]">No problems found in the file</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  The structure, IDs, references and values all look importable. What this cannot
                  check is your database: records this file points at still have to exist in Odoo
                  before you import it. Use the import screen&apos;s Test button before Import either
                  way, since imports cannot be undone.
                </p>
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {state.result.findings.map((f, i) => {
                const s = SEVERITY[f.severity];
                const Icon = s.icon;
                return (
                  <li key={i} className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
                    <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" style={{ color: s.color }} />
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--foreground)]">
                        <span className="sr-only">{s.label[0]}: </span>
                        {f.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--muted-foreground)]">{f.detail}</p>
                      {f.where && f.where.length > 0 ? (
                        <ul className="mt-3 flex flex-col gap-1 font-mono text-xs text-[var(--foreground)]">
                          {f.where.map((w) => (
                            <li key={w} className="break-words">
                              {w}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

function Summary({ fileName, result, onReset }: { fileName: string; result: CheckResult; onReset: () => void }) {
  const counts = (["error", "warning", "note"] as Severity[])
    .map((s) => ({ s, n: result.findings.filter((f) => f.severity === s).length }))
    .filter((c) => c.n > 0);
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate font-mono text-sm text-[var(--foreground)]">{fileName}</p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {result.rows.toLocaleString("en-US")} {result.rows === 1 ? "row" : "rows"}, {result.columns}{" "}
          {result.columns === 1 ? "column" : "columns"}, {DELIMITER_NAME[result.delimiter]}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {counts.map(({ s, n }) => (
          <span
            key={s}
            className="rounded-full border px-2.5 py-1 text-xs font-semibold"
            style={{ color: SEVERITY[s].color, borderColor: SEVERITY[s].color }}
          >
            {n} {SEVERITY[s].label[n === 1 ? 0 : 1]}
          </span>
        ))}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-[var(--foreground)] hover:text-[var(--odoo-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--odoo-teal)]"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Check another file
        </button>
      </div>
    </div>
  );
}
