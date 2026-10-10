# Installation

Cortex installs as a **Claude plugin**. Install it once, then run it in any repository — a working
project or an empty one.

{{install}}

The first two lines add the marketplace and install the plugin. The third, `/cortex`, runs
**inside the repo you want it to serve**.

Then turn on auto-update once — Claude Code leaves it off for third-party marketplaces like this
one, so without it no release reaches you. **Keeping it current**, below, has the clicks.

## What `/cortex` does on first run

It indexes the codebase, writes **one findings report** — issues, gaps and recommendations,
ranked — works out which parts of the development loop the repo is missing (a verification block
in `CLAUDE.md`, a verifier subagent, `REVIEW.md`, a PR review workflow, hooks, an `intent/` home,
evals, control bands, [an agent team](#/what-lands)), and then **stops and asks once**.

Nothing in your repo is modified until you pick what to act on. Indexing and reporting are
read-only by construction: a different skill applies changes.

The question covers what the repo is missing and, for the optional plugin tiers, only what this
machine lacks: `/cortex` reads Claude Code's plugin registry first, writing nothing, and a tier
that is already installed is not offered again. A row that changes more than its files says so
under its paths, so the one yes covers what you were told.

## Requirements

| Needs | Why |
|---|---|
| Claude Code with plugin support | Cortex ships as a plugin: skills, two subagents and an MCP server |
| Node `{{node}}` | the indexer, the findings report, Cortex View and the MCP server are plain Node |
| git | the index asks git which files belong to the repo, and reads history for hot spots |

**No `npm install`, no build step, no lockfile.** A plugin install clones the repository and runs
what is there, so Cortex has no runtime dependencies at all — every script runs on a stock machine.

## Keeping it current

Claude Code does not update Cortex unless you turn that on. Its
[plugin docs](https://code.claude.com/docs/en/plugins/install.md) list auto-update as off by default
for third-party marketplaces, and Cortex's is one of those. Turn it on once:
**`/plugin` → Marketplaces → select `cortex` → Enable auto-update**.

To update by hand, run both, in this order. The first refreshes the marketplace's copy, the second
installs from it — the first alone leaves the old version installed.

```
claude plugin marketplace update cortex
claude plugin update cortex@cortex
```

A session already running keeps the version it loaded and says *Run /reload-plugins to apply* — run
`/reload-plugins` or start a new session. `claude plugin list` shows which version is active; the
current release is **v{{version}}**.

### On a team

Here updating is not housekeeping. The files `/cortex` stamps are shared through the committed
`.cortex/stamps.json`, but the plugin is per machine. When that record was written by a newer Cortex
than yours, `/cortex`, `/cortex-next` and `cortex-stamps.mjs` say so and give you the two commands
above — and your older plugin refuses to rewrite any file a newer one stamped, because it would put
its own older template back. It does not list those files either, not even as a preview of what
the update will offer: a file that reads out of date against the older templates may be current
against the newer ones. Asking it to just update everything gets the same answer — updating the
plugin is how everything gets updated.

On a team's repo — your profile is `work`, or `/team-add` connected it to a team brain — `/cortex`
also offers to add Cortex to the repo's committed `.claude/settings.json`: the `cortex` marketplace
under `extraKnownMarketplaces` and `cortex@cortex` under `enabledPlugins`. It merges those two
entries in and changes nothing else. Once a teammate trusts the folder, Claude Code registers the
marketplace for them, but it does not install the plugin: **each teammate still runs
`claude plugin install cortex@cortex --scope project` once.**

Auto-update for the whole team is a separate yes/no in the same confirmation, unticked unless you
pick it. It writes `"autoUpdate": true` on the committed `cortex` entry, so every teammate's Claude
Code refreshes the marketplace and updates Cortex in the background after startup. A committed value
comes before each teammate's own `/plugin` toggle, so Cortex writes the key only on a `cortex` entry
it is adding — an entry already in the file keeps its `autoUpdate`, whether `true`, `false` or unset.

## Other agents

Cortex's output is plain markdown. `CLAUDE.md` and `GEMINI.md` are one-line shims pointing at the
same root `AGENTS.md`, and the rituals are plain `SKILL.md` files — name one to any AI tool and it
can follow it.

## Next

- [The sequence](#/sequence) — what to run after `/cortex`, and how Cortex tells you.
- [What lands in your repo](#/what-lands) — every file it can write, and which are committed.
