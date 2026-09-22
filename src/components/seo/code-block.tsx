import { cn } from "@/lib/utils";

type CodeBlockProps = {
  /** Language or file label shown above the code, e.g. "Python" or "HTTP". */
  label?: string;
  code: string;
  className?: string;
};

/**
 * A plain, copyable code sample. No syntax highlighting library: the code is
 * the content, it is server-rendered as text so crawlers and answer engines
 * read it, and it costs no JavaScript.
 */
export function CodeBlock({ label, code, className }: CodeBlockProps) {
  return (
    <figure className={cn("my-5", className)}>
      {label ? (
        <figcaption className="mb-1.5 font-mono text-[11px] text-[var(--muted-foreground)]">
          {label}
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
        <code className="font-mono text-[13px] leading-6 text-[var(--foreground)]">
          {code}
        </code>
      </pre>
    </figure>
  );
}

type ComparisonTableProps = {
  caption?: string;
  headers: string[];
  rows: string[][];
};

/**
 * A comparison table. Answer engines quote tables readily and Google uses
 * them for snippets, so the guides that compare options use this instead of
 * prose lists.
 */
export function ComparisonTable({ caption, headers, rows }: ComparisonTableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        {caption ? (
          <caption className="mb-2 text-left text-sm text-[var(--muted-foreground)]">
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr className="border-b border-[var(--border)]">
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="py-2.5 pr-4 align-bottom font-semibold text-[var(--foreground)]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-[var(--border)] align-top">
              {row.map((cell, index) => (
                <td
                  key={index}
                  className={cn(
                    "py-2.5 pr-4 leading-6",
                    index === 0
                      ? "font-medium text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)]"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
