# Privacy & the firewall

## The product holds nothing of yours

The Cortex repository is **data-free**: it holds the product and nothing else, because it is
cloned, forked and read by strangers. Gitignore is a backstop, not a security boundary. A vault
lives in its own private repo.

On a team, what is shared is the **target repo's** context layer — `AGENTS.md`, `.cortex/memory/`
— committed with that code. Every memory write passes the secret gate, which refuses a credential
rather than sanitising it.

## What Cortex runs, sends and fetches

- **The indexer, findings, View and every `index/` script** read the repo on disk and write only
  under its `.cortex/` (the first index run also appends three lines to `.gitignore`, after you
  agree). They make no network calls and install nothing: Cortex has no runtime dependencies. Four
  things there are meant to be committed: `.cortex/memory/`; `.cortex/stamps.json`, the record of
  which files Cortex stamped into the repo and from which release; `.cortex/sections.json`, which
  `CLAUDE.md` sections your team edited and kept; and `.cortex/agents.json`, what you answered
  about the agents the repo already had.
- **Three scripts write outside `.cortex/`**, and `/cortex` runs each only on what you confirmed:
  - `cortex-stamps.mjs stamp` writes one file you confirmed, from a template, and records it. It
    refuses to write over a file it did not record, or one edited since, unless you said to.
  - `cortex-stamps.mjs update` rewrites only a file Cortex stamped that nobody has touched since,
    and never when `.cortex/stamps.json` names a newer Cortex than the one running. That check
    compares the record with the plugin's own version file; nothing is fetched to make it.
  - `cortex-shared-plugin.mjs --write`, on a team's repo, adds two entries to
    `.claude/settings.json`, creating the file if there is none, and leaves every other key as it
    was. It refuses a file that does not parse as JSON. `--auto-update`, a separate choice, also
    writes `"autoUpdate": true` on a `cortex` entry it adds, and never changes one already there.
  - `cortex-section.mjs --append CLAUDE.md --from <file>` adds a block to the end of a markdown
    file in the repo, in that file's own line endings, and changes nothing already in it.
  - `cortex-section.mjs --replace team` rewrites the `## Working as a team` section of `CLAUDE.md`,
    and only when it is an earlier release's text that nobody has changed. Every other line of the
    file stays as it was, and a section your team edited is never replaced.
- **Updates are Claude Code's, not Cortex's.** Cortex never checks for a newer release. With
  auto-update turned on, Claude Code fetches the marketplace itself; the manual update is the two
  `claude plugin` commands on [Installation](#/install).
- **The MCP server** runs `git` and nothing else that reaches a network, and only against a
  **team-brain** repository you set up with `/team-init` or `/team-add`. It clones that repository
  once, pulls it before a catch-up and an `inbox`, and on a team `capture`, `ask` and `answer`
  commit and push there. In a product repo the clone is `.cortex/team/<team>/`, and Cortex adds
  that directory to the repo's `.gitignore` before it clones. With no team brain connected it makes
  no network call at all. The one exception is a team that selected a tracker in `team.json`: then
  `ask`, `answer` and `inbox` also call that tracker's REST API — GitHub, the team's ServiceNow
  instance or its Jira site — with the credential from your environment, and never on the `lab`
  profile. The note passes the secret gate before it is written, and the `home` / `work` profile
  decides which captures may leave the machine.
- **On a server you run, `tools/server/cortex-cron.sh`** pulls the team brain, writes a daily
  digest or weekly audit, and pushes it. With `ANTHROPIC_API_KEY` set it also sends the day's
  changes to the Anthropic API for a summary. Both the changes and the digest pass
  `tools/cortex-scrub.mjs` first, and a finding stops the run with nothing sent or pushed. Without
  a key, or without the scrubber, it calls no API and writes a plain digest from git.
- **The rituals** are instructions Claude follows. Each says so before a step that touches the
  network — `gh` for pull requests, `git clone` of a public repo you name — so the step runs only
  when you ask for it.
- **Stamped into your repo, not run by the plugin.** `/cortex` can write GitHub Actions workflows:
  `cortex-review.yml` clones the Cortex repository, or your fork when a source is set, at a pinned
  release tag inside your CI to review each PR, and refuses to run it unless its code matches the
  digest recorded when the file was stamped, so a moved tag cannot change what runs
  ([ADR 0028](https://github.com/marinvch/Cortex/blob/master/docs/adr/0028-stamped-ci-verifies-cortex-by-content-digest.md)).
  `agent-evals.yml` installs a pinned version of Claude Code from npm in your CI to run your eval
  cases. Both are files you read and commit. On a team's repo it can also add the `cortex`
  marketplace to `.claude/settings.json`; then Claude Code, not Cortex, clones
  `github.com/marinvch/Cortex`, or your fork, on each teammate's machine once they trust the folder.
  [The agent team](#/what-lands) is instructions too: agent files and a skill your own sessions follow, running your repo's own commands. The one
  network step they name is the Project manager reading an issue with `gh issue view` when a task
  names one.
- **No telemetry.** Nothing is sent to the author or to any service Cortex runs.

## One install, one world

A **profile** declares which world an install belongs to: `home`, `work` or `lab`, set with
`CORTEX_PROFILE`. It is the one setting that decides what the rituals will accept.

- A **`home`** install holds personal projects and knowledge only — never employer or client
  names, day-job tickets, colleagues, or internal architecture. Even role-level detail counts: the
  aggregate is the leak.
- A **`work`** install is the same rule from the other side.
- A **`lab`** install refuses nothing and publishes nothing — one decision, stored as one policy,
  so the firewall cannot be switched off while still leaking.

Work knowledge a team shares belongs in the **work repo's own context layer**, which stays inside
that repo.

## Enforced, not just written

The rituals refuse the write: `/capture` and `/daily` decline material from the wrong world,
`/cortex-audit` treats a breach as a critical finding, and `/scan-projects` skips repos
under a work directory. `/cortex-profile` shows or sets which world this install serves.

**What code enforces on `home`, and what is still a floor.** Code refuses a published write —
`capture`, `remember`, `ask`, `answer`, a project file, a contract — whose text matches a line of
your **employer denylist**: a file outside every repository, `~/.cortex/employer-denylist` or the
path in `CORTEX_DENYLIST`, one `org:`, `domain:`, `owner:`, `ticket:` (a regex) or `pattern:` per
line. The refusal names the line, never the text. With no file nothing is checked, and
`cortex-preflight.mjs` says so. Code also refuses an employer-shaped link in a project file.
Anything you did not list — a client named in passing, a colleague, a work repo on a public forge —
passes the code, and only the rituals' judgment stops it.
[ADR 0026](https://github.com/marinvch/Cortex/blob/master/docs/adr/0026-the-employer-firewall-checks-the-names-you-give-it.md).

**Personal data.** The same gate looks for email addresses, phone numbers, IBANs and card numbers
in anything it publishes. By default it warns and writes (`CORTEX_PII=warn`); `CORTEX_PII=refuse`
refuses, `off` stops the scan. Committed memory is append-only, so removing personal data later
means rewriting git history and replacing every clone — [`docs/erasure.md`](https://github.com/marinvch/Cortex/blob/master/docs/erasure.md)
has the procedure — and `CORTEX_AUTHOR=<pseudonym>` keeps your real name out of memory paths.
[ADR 0027](https://github.com/marinvch/Cortex/blob/master/docs/adr/0027-personal-data-in-committed-memory-is-warned-about-and-erasable.md).
