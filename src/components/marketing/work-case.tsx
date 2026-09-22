import Image from "next/image";
import type { WorkCase } from "@/config/work";
import { cn } from "@/lib/utils";
import { WorkFlowDiagram } from "./work-flow-diagram";

type WorkCaseRowProps = {
  workCase: WorkCase;
  index: number;
  /** Render the title as an h3 (inside a section) or h2 (on the /work page). */
  headingLevel?: "h2" | "h3";
};

/**
 * One shipped app as a spec sheet: the story on one side, the facts on the
 * other. Rows alternate sides so the page has a rhythm without any cards.
 * A sanitized screenshot slots in above the facts when one exists.
 */
export function WorkCaseRow({ workCase, index, headingLevel = "h3" }: WorkCaseRowProps) {
  const Heading = headingLevel;
  const flip = index % 2 === 1;
  const image = workCase.images?.[0];

  return (
    <article
      id={workCase.slug}
      className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16"
    >
      <div className={cn(flip && "lg:order-2")}>
        <Heading className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          {workCase.title}
        </Heading>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]">
          {workCase.summary}
        </p>
      </div>

      <div
        className={cn(
          "flex flex-col gap-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6",
          flip && "lg:order-1"
        )}
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="h-auto w-full rounded-lg border border-[var(--border)]"
          />
        ) : (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
            <WorkFlowDiagram
              users={workCase.diagram.users}
              app={workCase.diagram.app}
              models={workCase.models}
              kind={workCase.diagram.kind}
            />
          </div>
        )}

        <dl className="divide-y divide-[var(--border)] border-t border-[var(--border)] text-sm">
          <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
            <dt className="text-[var(--muted-foreground)]">Used by</dt>
            <dd className="text-[var(--foreground)]">{workCase.users}</dd>
          </div>
          <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
            <dt className="text-[var(--muted-foreground)]">Replaced</dt>
            <dd className="text-[var(--foreground)]">{workCase.replaced}</dd>
          </div>
          {workCase.facts && workCase.facts.length > 0 ? (
            <div className="grid grid-cols-[7rem_1fr] gap-4 py-3">
              <dt className="text-[var(--muted-foreground)]">Also</dt>
              <dd className="text-[var(--foreground)]">
                <ul className="flex flex-col gap-1">
                  {workCase.facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </article>
  );
}
