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
**refuses** anything carrying a credential rather than sanitising it, because silently rewriting
someone's note is a worse failure than declining it with a reason.

## The rituals that move context across a gap

They are **not** interchangeable. The cut is in-flight state versus durable knowledge:

| Ritual | Writes | For |
|---|---|---|
| `/dream` | a dated digest into the committed `.cortex/memory/` | a future reader of the codebase — tomorrow's agents and the rest of the team |
| `/handoff` | a compact handoff to the OS temp dir, deliberately ephemeral | the next agent, right now, picking up work mid-flight |
| `/catch-me-up` | nothing — it reads | you, after time away: notes plus git history over a date range |
| `/resume` | nothing — it reads the repo first | starting on work already in flight: committed, uncommitted, diverged, then what is left |

Running `/handoff` alone on a day that taught you something parks the work and loses the lesson.

## A shared team brain

For knowledge that spans several repositories, a team lead runs `/team-init` once to create a
shared private **team-brain** repository. Each developer runs `/team-add` inside a product repo to
connect it: the team-brain is cloned locally, the repo's **project file** is written there, and a
generic connector — the team, the project and the team-brain's URL, nothing else — is dropped into
the product repo, so notes captured there reach the whole team.

A project file is `projects/<slug>.md` at the top of the team-brain: the project's title and its
repo, and optionally a tracker, a design file, a docs site and the projects it relates to. It is
committed and pushed when `/team-add` writes it. The team's **workspace** is the set of those files
and nothing more — adding a project is adding a file, and removing one is deleting it.

- **Its links are shown and never fetched.**
- **A credential in a link or in the repo's address is refused, not stripped.**
- **An existing file is left exactly as it is** unless you pass a flag for one of its fields; the
  prose under its frontmatter is yours.
- **On a `home` profile an employer-shaped link is refused, whole** — a private-network host, or a
  tenant of a hosted work tool. The check is a floor: a file that passed it is not cleared.
- **Removing a project** deletes its file, commits and pushes. The project's notes folder is never
  deleted, and other project files that still name it are reported, not edited.

In a connected repo, `/catch-me-up` pulls the team-brain first (fast-forward only) and returns
what every repo of the team captured since the date, alongside the local notes. If the pull fails
it says so, rather than reporting a quiet week from a stale clone. A memory entry is attributed to
its author only when its file names one; an older day file's entries are attributed to nobody.

## Recall from any agent

With the plugin installed, the Cortex MCP server gives MCP-speaking agents live tools over this
memory — see [MCP brain](#/mcp).
