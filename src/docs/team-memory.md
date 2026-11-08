# Team memory

What a team and its agents know about a codebase, travelling with the code.

## Memory

`<repo>/.cortex/memory/` — **committed**, append-only, one file per author per day
(`<date>/<author>.md`), synced by git and nothing else. Several developers who write on the same day
each write their own file, so their branches merge with no conflict.

An **author** is a slug (`a-z`, `0-9`, `-`) of `CORTEX_AUTHOR`, or of git `user.name` when that is
not set — never an email address. Memory is committed, so the name is in every checkout: set
`CORTEX_AUTHOR` to a short handle such as `dev-a` to choose the one that is published.

A **day file**, `<date>.md`, holds every author's entries for a day and names none of them. It is
what Cortex wrote before 2.41.48, and what it still writes — saying so each time — when there is no
usable name. Two branches that each write a day file on the same day conflict when they merge. Both
layouts are read, a day file is never moved or rewritten, and one date can hold both.

Memory is **authored, not derived** — it is never regenerated, and it is not a cache.

## The gate

Every write to memory, and every tool that publishes, goes through **the gate**: a check that
**refuses** rather than sanitises, because silently rewriting someone's note is a worse failure
than declining it with a reason. It makes three checks in one call: a credential, always; a match
against your **employer denylist** on a `home` profile; and **personal data**, refused or only
warned about as `CORTEX_PII` says — see [Privacy](#/privacy).

## The rituals that move context across a gap

They are **not** interchangeable. The cut is in-flight state versus durable knowledge:

| Ritual | Writes | For |
|---|---|---|
| `/end-of-day-summary` | a dated digest into the committed `.cortex/memory/` | a future reader of the codebase — tomorrow's agents and the rest of the team |
| `/handover-notes` | a compact handoff to the OS temp dir, deliberately ephemeral | the next agent, right now, picking up work mid-flight |
| `/whats-changed` | nothing — it reads | you, after time away: notes plus git history over a date range |
| `/resume-work` | nothing — it reads the repo first | starting on work already in flight: committed, uncommitted, diverged, then what is left |

Running `/handover-notes` alone on a day that taught you something parks the work and loses the lesson.

## A shared team brain

For knowledge that spans several repositories, a team lead runs `/create-team` once to create a
shared private **team-brain** repository. Each developer runs `/join-team` inside a product repo to
connect it: the team-brain is cloned locally, the repo's **project file** is written there, and a
generic connector — the team, the project and the team-brain's URL, plus the team's Cortex fork
when the brain names one, nothing else — is dropped into the product repo, so notes captured there
reach the whole team. If your organisation runs Cortex from its own fork, `/create-team --source`
records it once and every `/join-team` passes it on.

A project file is `projects/<slug>.md` at the top of the team-brain: the project's title and its
repo, and optionally a tracker, a design file, a docs site and the projects it relates to. It is
committed and pushed when `/join-team` writes it. The team's **workspace** is the set of those files
and nothing more — adding a project is adding a file, and removing one is deleting it.

- **Its links are shown and never fetched.**
- **A credential in a link or in the repo's address is refused, not stripped.**
- **An existing file is left exactly as it is** unless you pass a flag for one of its fields; the
  prose under its frontmatter is yours.
- **On a `home` profile an employer-shaped link is refused, whole** — a private-network host, or a
  tenant of a hosted work tool. The check is a floor: a file that passed it is not cleared.
- **Removing a project** deletes its file, commits and pushes. The project's notes folder is never
  deleted, and other project files that still name it are reported, not edited.

In a connected repo, `/whats-changed` pulls the team-brain first (fast-forward only) and returns
what every repo of the team captured since the date, and which contracts changed, alongside the
local notes. If the pull fails it says so, rather than reporting a quiet week from a stale clone. A
memory entry is attributed to its author only when its file names one; an older day file's entries
are attributed to nobody.

### Roles, asks and contracts

The team-brain carries work between people, not just notes.

- **Roles.** `/join-team` asks each member which roles they hold — `frontend`, `backend`,
  `architect`, whatever the team uses — and which projects they own, and writes them to the
  brain's `team.json`. A member's handle is their memory author name. Without this step, asks sent
  to their role never reach them.
- **Jobs.** Each member also records one job — `developer`, `architect`, `lead`, `pm` or `qa`. It
  changes what `/setup-repo`, `/resume-work` and `/join-team` offer that person first, never what
  they may run, and a member with no job is a developer. The pages under *By role* say what each
  job installs, from the plugin to a [role pack](#/for-project-managers) for people outside
  Claude Code.
- **Asks.** The `ask`, `inbox` and `answer` tools carry a question to a role or a project in another
  repo, and the answer back. An agent calls `inbox` at the start of a task.
- **Contracts.** `/join-team` offers to publish the repo's contract — what it serves, calls and
  emits — so another repo can ask who calls an endpoint without cloning this one. Run it again
  after the API changes. The `contract` tool answers who serves and who calls an endpoint.
- **Trackers.** `/create-team` asks which trackers the team plans in — GitHub issues, ServiceNow
  Agile, Jira, or none — and asks are then synced there both ways. A credential never goes in a
  flag or in `team.json`: each tracker reads its own from the environment. The scheduled sync
  workflow is printed, and committed only once you have read it and said yes.
- **Stories.** A tracker turned on with `--stories` has its epics and stories mirrored into the
  brain on each full sync, never with their descriptions. Each repo publishes which code each
  ticket key touched, and `/story-map` traces an epic to that code: what it touched, what waits on
  an open ask, and which of it no test covers. It never estimates.

How each works is on [MCP brain](#/mcp).

## Recall from any agent

With the plugin installed, the Cortex MCP server gives MCP-speaking agents live tools over this
memory — see [MCP brain](#/mcp).
