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
  once, pulls it before a catch-up, and on a team capture commits the note and pushes it there. With
  no team brain connected it makes no network call at all. The note passes the secret gate before
  it is written, and the `home` / `work` profile decides which captures may leave the machine.
- **The rituals** are instructions Claude follows. Each says so before a step that touches the
  network — `gh` for pull requests, `git clone` of a public repo you name — so the step runs only
  when you ask for it.
- **Stamped into your repo, not run by the plugin.** `/cortex` can write GitHub Actions workflows:
  `cortex-review.yml` clones the Cortex repository at a pinned release tag inside your CI to review
  each PR, and `agent-evals.yml` installs Claude Code in your CI to run your eval cases. Both are
  files you read and commit. On a team's repo it can also add the `cortex` marketplace to
  `.claude/settings.json`; then Claude Code, not Cortex, clones `github.com/marinvch/Cortex` on each
  teammate's machine once they trust the folder. [The agent team](#/what-lands) is instructions
  too: agent files and a skill your own sessions follow, running your repo's own commands. The one
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
`/audit` and `/cortex-audit` treat a breach as a critical finding, and `/scan-projects` skips repos
under a work directory. `/cortex-profile` shows or sets which world this install serves.
