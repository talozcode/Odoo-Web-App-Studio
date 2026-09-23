import Link from "next/link";
import type { Metadata } from "next";
import { GuidePageTemplate, GuideSection } from "@/components/seo/guide-page";
import { CodeBlock, ComparisonTable } from "@/components/seo/code-block";
import { guideBySlug } from "@/config/guides";
import { guideMetadata } from "@/lib/seo";

const SLUG = "odoo-access-rights-error";
const meta = guideBySlug(SLUG)!;

export const metadata: Metadata = guideMetadata(meta);

const LINK =
  "font-medium text-[var(--odoo-teal)] underline underline-offset-4 hover:no-underline";

export default function Guide() {
  return (
    <GuidePageTemplate
      meta={meta}
      relatedLinks={[
        { href: "/guides/odoo-api-errors", label: "What each Odoo API error means" },
        { href: "/guides/odoo-api-multi-company-filtering", label: "Why a call returns the wrong company's data" },
        { href: "/guides/signs-your-team-needs-a-simpler-odoo-interface", label: "Signs your team needs a simpler interface" },
        { href: "/custom-odoo-web-app", label: "Custom Odoo web apps" },
      ]}
    >
      <GuideSection heading="What the error is actually telling you">
        <p>
          Odoo&apos;s access error is more useful than it looks, because it
          names every part of what went wrong. A typical one reads like this:
        </p>
        <CodeBlock
          label="The shape of an Odoo access error"
          code={`Due to security restrictions, you are not allowed to access
'Contact' (res.partner) records.

No group currently allows this operation.
(Operation: read, User: 42)`}
        />
        <p>
          Four facts are in there: the model (<code>res.partner</code>), the
          operation (<code>read</code>), the user, and a strong hint about
          which layer refused. &quot;No group currently allows this
          operation&quot; means the refusal came from access rights, not from
          a record rule. That distinction decides where you go looking, and
          getting it wrong is how an afternoon disappears.
        </p>
      </GuideSection>

      <GuideSection heading="The two layers, and which one refused you">
        <p>
          Odoo checks two independent mechanisms, in order. Both are attached
          to users through groups, and they work on opposite defaults, which
          is the source of most of the confusion:
        </p>
        <ComparisonTable
          caption="Access rights and record rules are not variations of one idea"
          headers={["", "Access rights", "Record rules"]}
          rows={[
            ["Model", "ir.model.access", "ir.rule"],
            ["Question it answers", "May this user touch this model at all?", "May this user touch this particular record?"],
            ["Granularity", "The whole model", "Evaluated record by record"],
            ["Default", "Deny. No matching entry means no access", "Allow. If no rule applies, access is granted"],
            ["How several combine", "Additive: a user gets the union of every group's grants", "Depends on whether the rule is global or group based"],
            ["What the message looks like", "\"No group currently allows this operation\"", "A record simply is not there, or is refused individually"],
          ]}
        />
        <p>
          So the order of diagnosis is fixed. If the model is off limits
          entirely, no record rule will ever rescue it, because rules are
          only consulted after access rights have already said yes. And if
          the user can open some records of that model but not others, access
          rights are fine by definition and you are looking at a rule.
        </p>
      </GuideSection>

      <GuideSection heading="Why adding a record rule made it worse">
        <p>
          This is the one that catches people, and it is not intuitive.
          Record rules combine in two completely different ways depending on
          whether they name any groups:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Global rules intersect.</strong> A rule with no group is
            global. If two global rules apply, <em>both</em> must be
            satisfied. Adding a global rule can only ever narrow access.
          </li>
          <li>
            <strong>Group rules unify.</strong> If two group rules apply,{" "}
            <em>either</em> being satisfied is enough. Adding a group rule can
            widen access, though never past what the global rules already
            allow.
          </li>
          <li>
            <strong>
              The two sets then intersect with each other.
            </strong>{" "}
            Which produces the genuinely surprising result: adding the very
            first group rule to a model that already has a global rule{" "}
            <em>restricts</em> access rather than granting it.
          </li>
        </ul>
        <p>
          Odoo&apos;s own documentation carries a danger notice about this:
          several global rules can be written that do not overlap, and the
          intersection of non-overlapping conditions is nothing at all. The
          result is a model nobody can see, assembled entirely from rules
          that each looked reasonable on their own.
        </p>
        <p>
          There is a second trap in the same screen. On access rights, the
          read, write, create and delete checkboxes <em>grant</em> those
          operations. On a record rule the same four checkboxes mean
          something else entirely: they say which operations the rule is{" "}
          <em>checked for</em>. Unticking one does not forbid it, it makes the
          rule invisible to it, as though the rule did not exist. Same
          widgets, opposite meanings.
        </p>
      </GuideSection>

      <GuideSection heading="Why is a field missing instead of throwing an error?">
        <p>
          Because field level access does not fail loudly. A field can be
          restricted to groups, and for anyone outside them Odoo removes it
          from the views they are served and from the model&apos;s own field
          listing. It does not appear and is not refused; it is simply not
          there.
        </p>
        <p>
          Reading or writing it explicitly does raise an access error, which
          is why this surfaces as an integration failing on a field that a
          colleague can plainly see on screen. Nothing is broken. The two
          users are being shown different models.
        </p>
      </GuideSection>

      <GuideSection heading="The multi-company version of the same error">
        <p>
          On a database with several companies, most access complaints are
          really company scope. Record rules can test the user&apos;s current
          company or the full set of companies they are allowed, and a user
          who has not been granted a company sees records from it as though
          they did not exist.
        </p>
        <p>
          The usual fix is a checkbox on the user, not a rule at all. The
          reverse problem, where an integration quietly returns records from
          every company a user can reach rather than the one you meant, has{" "}
          <Link href="/guides/odoo-api-multi-company-filtering" className={LINK}>
            its own guide
          </Link>
          , because it produces wrong data instead of an error and therefore
          survives testing.
        </p>
      </GuideSection>

      <GuideSection heading="A practical order of checks">
        <ol className="ml-5 list-decimal space-y-2">
          <li>
            Read the message. The model, the operation and the user are all
            in it, and &quot;no group allows this&quot; points at access
            rights rather than rules.
          </li>
          <li>
            Ask whether the user can reach <em>any</em> record of that model.
            All or nothing is access rights. Some but not others is a rule.
          </li>
          <li>
            For a rule, check whether it is global or group based before
            changing it, because that determines whether your edit widens or
            narrows access.
          </li>
          <li>
            On multi-company, check the user&apos;s allowed companies before
            touching security at all.
          </li>
          <li>
            Reproduce it by logging in as that user. Testing as an
            administrator hides this entire class of problem, since an admin
            passes every check you are trying to examine.
          </li>
        </ol>
      </GuideSection>

      <GuideSection heading="When locking down the backend is the wrong fix">
        <p>
          Plenty of access work is legitimate: an integration user should
          hold the narrowest rights that do the job, and finance data should
          not be readable by everyone. But a recognisable pattern turns up
          when the real goal was never security.
        </p>
        <p>
          It looks like this. Someone needs staff to use Odoo for one task,
          so the backend gets progressively restricted until the screens are
          safe for them. Each restriction is a rule or a group. They compose
          in the ways described above, the combinations stop being
          predictable, and the team ends up maintaining a security model
          whose actual purpose was to hide the ninety percent of Odoo that
          those people never needed.
        </p>
        <p>
          When that is the real goal, a separate app is usually the cheaper
          answer. It reaches Odoo through the API as one properly scoped
          user, shows exactly the one workflow, and leaves Odoo&apos;s
          security model doing the job it is good at rather than acting as a
          user interface design tool. That is the distinction we write about
          in{" "}
          <Link href="/guides/signs-your-team-needs-a-simpler-odoo-interface" className={LINK}>
            signs your team needs a simpler interface
          </Link>
          , and it is most of what we build.
        </p>
        <p>
          If you are untangling a security model right now and are no longer
          sure why any of it is there, tell us what the people involved
          actually need to do. That question is usually easier to answer than
          the rules are to debug.
        </p>
      </GuideSection>
    </GuidePageTemplate>
  );
}
