# Contributing

Cortex is source code with contributors, tests, CI and releases. Before editing anything in the
repository, read [`docs/changing-cortex.md`](https://github.com/marinvch/Cortex/blob/master/docs/changing-cortex.md)
— the invariants that apply to every package. Several of them exist because the mistake they
prevent has already been made once.

## The rules that bite first

- **Never hand-edit a version.** `node tools/cortex-version.mjs --set <x.y.z>` stamps every site at
  once and refuses without a changelog entry.
- **Stamping a version on `master` is releasing it.** A workflow tags the merge commit and
  publishes that version's changelog section minutes after a merge that raises `VERSION`. Nothing
  sits between the merge and the release, so stamp only what is ready to be public, and never lower
  `VERSION`. What the workflow does is decided by `tools/cortex-release-plan.mjs` and tested on
  scratch repos; change the rule there, not in the workflow's shell.
  [ADR 0022](https://github.com/marinvch/Cortex/blob/master/docs/adr/0022-stamping-a-version-on-master-releases-it.md)
  says how to undo a release.
- **The root has two names, and one function per language orders them.** `CORTEX_ROOT` is the name;
  `AI_OS_ROOT` is what an older install carries, and it stays read with no warning. Code that needs
  the root calls that function and never reads either variable itself, docs and examples use
  `CORTEX_ROOT`, and a test that starts the server or the CLI sets or clears **both**, because a
  contributor's shell may carry either.
- **Every ritual declares a capability floor** — `mechanical`, `judgment` or `strong`, under its
  frontmatter's `metadata:` map — so a model too weak for a ritual is told, not trusted. Its
  `effort:` is read off that floor, not chosen again: `low` for `mechanical`, `high` for `strong`.
- **Cortex follows the Claude Code rules it reports on.** A test runs the `claude-setup/` findings
  over the Cortex repository itself and fails on any. Fix the repo, never the checker: loosening a
  check loosens it for every user.
- **The plugin ships no mod and no hooks, and `/cortex-scaffold` keeps the `CLAUDE.md` shim.** A
  mod runs unsandboxed in every user's session and does not load under the policy a work machine is
  likeliest to have. The shim is what sessions that cannot read `AGENTS.md` directly depend on.
- **A ritual a model may invoke has trigger prompts** — what a person would type to reach it, and
  one prompt that belongs to another ritual. `node evals/run.mjs --check` fails without the file,
  and when an edit to a description drops the words those prompts use. It counts shared words and
  is not the router.
- **Every ritual is reachable** from another, or says what reaches it. A ritual nothing points at is
  unreachable except by someone who already knows it exists.
- **A destructive shell tool routes its target through the root guard.** A string-prefix check is
  not a guard: a symlink out of the root passes any prefix comparison.
- **A template that says something is refused ships the thing that refuses it.** A lock that prose
  promised and no template provided was removed once. The Tester's fence is the model: its agent
  file may say an edit outside test files is refused only because the hook and its script ship with
  it, and a test fails if either goes.
- **Assert the property, not the symptom you thought of.** A test naming one symptom passes for
  every other way of failing.
- **Edit the body of a skill that has an eval baseline and you re-measure it.** CI fails once a
  skill listed in `evals/skills.mjs` no longer matches its recorded baseline;
  `node evals/run.mjs <skill> --record` re-measures it, and refuses a real drop in score unless you
  give the reason. Frontmatter edits are exempt.
- **A ritual's description is paid for in every session, so it stays short and owns its
  triggers.** Claude Code drops descriptions once the listing of every installed plugin passes its
  budget, and a ritual listed by name alone cannot be reached from a request. A test caps each
  description and their total, and fails when two rituals claim the same trigger phrase.

## Running the tests

```bash
node --test core/test/*.test.js
node --test index/test/*.test.mjs
(cd mcp && npm test)
bash tools/test/run.sh          # the shell half: real git repos in temp dirs
node evals/run.mjs --check      # needs no model: has an evaled skill changed since its baseline,
                                #   and does each description still hold its trigger prompts
```

`tools/test/run.sh` is the only way to run a shell test fragment — each one expects the temp
directory the runner prepares, and run on its own it would act on the repository you are standing
in.

## Where to look

Read the root `AGENTS.md`, match your work to a row of its routing table, then open **one** leaf —
`core/`, `index/`, `mcp/`, `tools/` or `evals/` each carry their own brief. Domain terms are defined once in
`CONTEXT.md`; decisions and their rejected alternatives are in `docs/adr/`.

Issues and pull requests: [github.com/marinvch/Cortex](https://github.com/marinvch/Cortex).
