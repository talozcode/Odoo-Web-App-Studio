import Link from "next/link";
import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { CodeBlock, ComparisonTable } from "@/components/seo/code-block";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-import-errors";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

const LINK =
  "font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline";

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/tools/odoo-import-checker", label: "Odoo CSV import checker (free tool)" },
        { href: "/guides/odoo-api-errors", label: "What each Odoo API error means" },
        { href: "/guides/odoo-write-back-vs-read-only-integrations", label: "Read-only vs write-back integrations" },
        { href: "/custom-odoo-web-app", label: "Custom Odoo web apps" },
        { href: "/guides/odoo-api-slow", label: "Why Odoo API calls are slow" },
      ]}
    >
      <GuideSection heading="No matching record found for external ID">
        <p>
          This is the most common import failure, and it means something
          precise: a row points at a record that does not exist in the
          database yet. There are only two reasons for that, and they are
          easy to tell apart. If you have the file to hand,{" "}
          <Link href="/tools/odoo-import-checker" className={LINK}>
            the import checker
          </Link>{" "}
          finds both, and everything else on this page, before you import.
        </p>
        <p>
          The first is order. Odoo has to recreate the links between records,
          so the thing being pointed at must already be there. Import the
          companies, then the people. Import the product categories, then the
          products. A file that references a parent which arrives later in
          the same run, or in a later run, fails on every row that needs it.
        </p>
        <p>
          The second is the column header. To match on an external ID the
          column has to say so, by ending in the ID suffix. A plain column
          means something different: it matches on the name. Get this wrong
          and Odoo dutifully goes looking for a record whose <em>name</em> is{" "}
          <code>company_1</code>, finds nothing, and tells you so.
        </p>
        <CodeBlock
          label="Two files, imported in this order"
          code={`# 1. companies first
External ID,Name,Is a Company
company_1,Bigees,True
company_2,Organi,True

# 2. then people, pointing at them by external ID
External ID,Name,Is a Company,Related Company/External ID
person_1,Fabien,False,company_1
person_2,Laurence,False,company_1`}
        />
        <p>
          Note the prefixes. An external ID has to be unique across every
          record of every model, not just within one file, so Odoo&apos;s own
          guidance is to prefix with the table name. Two source tables that
          both start their ids at 1 will otherwise collide, and{" "}
          <code>person_1</code> and <code>company_1</code> exist precisely so
          that they do not.
        </p>
      </GuideSection>

      <GuideSection heading="Three ways to point at a related record, and you must pick one">
        <p>
          Odoo offers three mechanisms for the same job, and the
          documentation is explicit that only one should be used per field.
          Mixing them in one column is a reliable way to produce an import
          that half works:
        </p>
        <ComparisonTable
          caption="Referencing a contact's country, three ways"
          headers={["Column", "Value", "When to use it"]}
          rows={[
            [
              "Country",
              "Belgium",
              "Hand-made spreadsheets. Easiest, but breaks when two records share a name",
            ],
            [
              "Country/Database ID",
              "21",
              "Rarely. Mostly developers, since it can never be ambiguous",
            ],
            [
              "Country/External ID",
              "base.be",
              "Data coming from another system. The right choice for a migration",
            ],
          ]}
        />
        <p>
          The name column is the one that quietly misbehaves. If two product
          categories share a child name, Odoo halts validation, and if the
          import proceeds anyway every row is linked to the first match it
          found. Nothing errors afterwards. The data is simply attached to
          the wrong parent, which is the kind of mistake that is discovered
          months later by someone running a report.
        </p>
      </GuideSection>

      <GuideSection heading="Why the second import created duplicates">
        <p>
          Because the external ID was missing or changed. This is worth
          understanding properly, because it is also the feature that makes
          imports repeatable.
        </p>
        <p>
          When an imported file carries an external ID or database ID column,
          Odoo updates the records that already exist instead of creating
          them again. That is what lets you export, edit in a spreadsheet and
          re-import without making a mess, and it is why the export dialog
          has an option to produce an import-compatible file that includes
          the ID for you.
        </p>
        <p>
          The corollary is the trap. The ID is how Odoo recognises the
          record, so if it is altered or dropped between two imports, the
          system has no way to know the row refers to something that already
          exists, and it creates a second one. Deleting the ID column to
          &quot;clean up&quot; a file before re-importing is the usual way
          this happens.
        </p>
      </GuideSection>

      <GuideSection heading="The failures that never raise an error">
        <p>
          These are the expensive ones, because the import reports success:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>A blank cell is not the same as a missing column.</strong>{" "}
            If a field is absent from the file, Odoo applies the default
            value. If the column is present but the cell is empty, Odoo sets
            it empty. Same visible spreadsheet, two different outcomes, and
            it is how a required default silently becomes blank across
            thousands of records.
          </li>
          <li>
            <strong>Ambiguous dates.</strong> Odoo guesses the format from
            common ones, and a value like 01-03-2016 is genuinely ambiguous.
            Guessed wrong, every date in the file is off by a predictable
            amount and looks perfectly valid. Writing dates as YYYY-MM-DD
            removes the question.
          </li>
          <li>
            <strong>Numbers that stop being numbers.</strong> Odoo handles
            most formats, including parentheses for negatives, but the
            currency symbol has to sit inside the parentheses for a negative
            value to be read as one. A stray prefix on the number is not
            recognised at all.
          </li>
          <li>
            <strong>Field type guessed from the first ten lines.</strong>{" "}
            Odoo infers each column&apos;s type from the start of the file.
            A column that looks numeric for ten rows and turns textual on row
            four hundred was mapped on the basis of the first ten.
          </li>
          <li>
            <strong>Order lines need their own rows.</strong> For a
            one-to-many, the first line shares the parent&apos;s row and each
            additional line gets a row of its own with the parent fields left
            blank. Filling the parent fields again on every line creates a
            separate order per line.
          </li>
        </ul>
      </GuideSection>

      <GuideSection heading="Imports cannot be undone">
        <p>
          Odoo states this plainly, and it deserves repeating because people
          assume otherwise: an import is permanent. There is no rollback
          button. What you get instead is the ability to filter by created on
          or last modified to find what a run touched, which is a recovery
          tool rather than an undo.
        </p>
        <p>
          The practical consequences are to test on a copy rather than
          production, to use the import tool&apos;s own test step before
          committing, and to work in smaller batches. Smaller batches also
          avoid the timeout that large files hit, which is Odoo&apos;s
          documented advice for both imports and exports.
        </p>
      </GuideSection>

      <GuideSection heading="If you are importing the same file every week">
        <p>
          Everything above describes a migration, which is a one-off worth
          doing carefully. A recurring import is a different situation
          wearing the same clothes.
        </p>
        <p>
          When someone exports from one system, reshapes a spreadsheet and
          imports it into Odoo on a schedule, the spreadsheet has quietly
          become production software with no tests, no validation and no undo,
          maintained by whoever is in the office. The failure modes above are
          not hypothetical there; they are a recurring tax, and the ones that
          fail silently are being paid without anyone noticing.
        </p>
        <p>
          That is a good candidate for{" "}
          <Link href="/custom-odoo-web-app" className={LINK}>
            a small app
          </Link>
          . Reading the source, validating before anything is written, and
          writing through the API gives you the thing a manual import cannot:
          a process that refuses bad data instead of importing it, and that
          does the same thing every week whoever is running it. If that
          sounds like a file you already maintain, tell us what it does and
          we will tell you what replacing it looks like.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
