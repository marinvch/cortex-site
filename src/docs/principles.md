# Design principles

Each principle below is a decision record in the Cortex repository, with the alternatives it
rejected. They are the reasons Cortex behaves the way it does.

## The user decides, not the AI

Indexing and reporting cannot modify your repository. **The findings report is a proposal**, and
applying it is a separate, explicitly invoked step. `/cortex` may start the install sequence on its
own, but what protects your repo is a **consent gate on the first write**, not a flag that stops
the sequence from starting. *(ADR 0005)*

## The report is the script

The findings report is ranked by severity, and that ranking is the order you are asked what to act
on — propose everything, then one yes. A repo whose worst problem is a leaked secret is not asked
the same questions, in the same order, as one missing an `AGENTS.md`. *(ADR 0006)*

## No runtime dependencies

A plugin install clones the repository — it does not run `npm install`, honour a lockfile or build.
Whatever is in the tree is what runs. So Cortex has **no runtime dependencies**: its MCP transport
is about a hundred lines of Node, and a test fails the build if an import creeps back in.
*(ADR 0004)*

## One door onto a root

Every path a Cortex tool reads or writes goes through a single guard that resolves it and refuses
anything that escapes the root — including through a symlink. Safety that five modules each have to
remember is a disclosure bug waiting to happen. *(ADR 0007, and its shell counterpart ADR 0010)*

## A guarantee belongs to the act

A promise such as "the generated directories are gitignored" is kept by the code that performs the
write, not by whichever skill happens to mention it. Where a promise needs judgment it stays in the
skill — and a test asserts the sentence is there. *(ADR 0016)*

## The code layers

```
      core/          shared kernel — depends on nothing else
     /     \         paths (the root guard) · scrub (the secret gate) · memory · date
 index/    mcp/      leaves — depend on core, never on each other
```

A test fails if `core/` reaches upward, or if either leaf imports the other. Shared code goes in
`core/`; convenience imports across leaves are how two packages get welded into one.

## Official practice, checked

Cortex follows Anthropic's own Claude Code documentation, and vendors those rules as data — each
with its source page, the exact sentence it rests on, and the date it was checked. A maintainer
tool re-verifies them daily, so a rule that changes upstream is noticed rather than trusted. The
same run reports any page of the docs or the blog that Cortex has not seen, because a feature
documented on a page no rule cites would otherwise go unnoticed. A new page creates no rule: a
maintainer reads it first. *(ADR 0017)*

## A skill is measured, not self-reported

A skill's quality is its score on scored tasks, recorded for each version of its text. CI checks,
with no model, that the recorded score belongs to the text that ships, so an edit to a measured
skill cannot merge until someone re-measures it. Cortex ships no hook for this: a hook fires when a
skill loads, before any outcome exists, so it would be the model grading its own work, and its log
would land in your repo. Only skills whose outcome can be checked exactly are covered, and no score
is faked for the rest. *(ADR 0018)*

## The agent team is yours, and your session runs it

The team is written into your repo as project agents, not shipped inside the plugin. A plugin agent
ignores hooks, so the Tester's fence would silently not exist, and one plugin file cannot be
grounded in one repo's commands and briefs. Your own session runs the team from a section of
`CLAUDE.md`, which keeps Claude Code's system prompt intact and keeps you in the loop, both at the
one-agent-or-team choice and at every open disagreement. Debate is bounded and evidence-only: every
objection cites a `path:line`, an ADR or a test, and after two rounds what is still open comes to
you. Two is the default, and a team can set the limit from one to five. Agreement between models is
not evidence. Claude Code's experimental agent teams can run the
same agents, and Cortex never turns them on. *(ADR 0019)*
