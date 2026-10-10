# CLI reference

The rituals are the interface — `/cortex`, `/cortex-next` and the rest. Underneath, every step is a
plain Node or shell script you can run yourself from a clone of the Cortex repository. Inside a
skill the same scripts run through the plugin's own path.

## The codebase half — `index/`

```bash
node index/cortex-next.mjs .        # where this repo is; writes nothing at all
node index/cortex-index.mjs .       # writes .cortex/index/index.json
node index/cortex-findings.mjs .    # writes .cortex/findings/<date>.md
node index/cortex-view.mjs .        # writes .cortex/view/repo.html and opens it
node index/cortex-enrich.mjs plan . # optional: plan the semantic enrichment pass
node index/cortex-routes.mjs . --workspace  # which back-end handler serves each front-end call
node index/cortex-stamps.mjs .     # which files /cortex stamped are out of date; writes nothing
node index/cortex-section.mjs .    # whether CLAUDE.md's team section is an older release's text; writes nothing
node index/cortex-loop.mjs . --team architect,tester  # the team files, values and roster for those picks; writes nothing
node index/cortex-impact.mjs src/a.ts --size  # one agent or the team for a task on these files, and why
node index/cortex-shared-plugin.mjs .  # on a team repo: what --write would add to .claude/settings.json
```

Every command prints a `Next →` line when it finishes, and refuses an unknown or misspelled flag
with a message naming it — a typo is never reinterpreted as a path.

The `ai-os` command — plugin tiers, a team-brain and its project files — is listed on
[MCP brain](#/mcp), beside the server it shares its code with.

## Tools — `tools/`

Every script here runs on a stock machine — no `npm install`, no lockfile, no runtime dependency.

**What is listed:** every script in `tools/` that a person, a ritual or cron runs directly. A file
that is only sourced by other scripts is a library, not a tool, and its name starts with `_`.
`_cortex-lib.sh` holds the slug rule, the clock, `knowledge_files()` and the root guard for
`cortex.sh`, `cortex-rm.sh`, `cortex-scan-projects.sh` and `cortex-sync-skills.sh`. `tools/test/` is
the test harness, run through `bash tools/test/run.sh`.

This table is the Cortex README's, copied row for row. In the Cortex repository,
`tools/test/tools-table.test.sh` fails when a script is missing from that table or a row names none.

| Script | Does |
|---|---|
| `cortex-init.sh` | Install a codebase brain into any repo, with no Node and no clone needed |
| `cortex.sh` | Build/open `cortex.html` — the vault viewer |
| `cortex-rm.sh` | Remove a note safely (archive + de-link + refresh) |
| `cortex-scan-projects.sh` | Register your local git repos into the vault's `projects/`, metadata only |
| `cortex-sync-skills.sh` | Mirror `skills/` into `.claude/skills/`; `--check` reports drift |
| `cortex-vault-extract.sh` | Lift the personal-vault half out into its own repo; a dry run unless `--apply` |
| `cortex-capability.mjs` | What each ritual needs from the setup running it |
| `cortex-frontmatter.mjs` | Is every ritual's frontmatter readable by a router; `--check` fails on the first bad line, strictly |
| `cortex-version.mjs` | `--set X.Y.Z` — stamp the version at all seven sites, refuse without a changelog entry |
| `cortex-release-notes.mjs` | `X.Y.Z` — that version's section of the changelog, for a release's notes; exit 1 if the section cannot be bounded exactly |
| `cortex-release-plan.mjs` | `--before <sha>` — what one push to master releases: nothing, a tag that already exists, or a new release and whether it takes Latest. The release workflow acts on it; it creates nothing itself |
| `cortex-preflight.mjs` | Root, profile and index freshness — what every ritual asks before it writes |
| `cortex-plugin-check.mjs` | Which Cortex this session is actually running, and whether it is the one you edited |
| `cortex-skill-graph.mjs` | Which ritual reaches which; `--check` fails on one stranded in both directions |
| `cortex-skill-links.mjs` | Whether every link from a ritual to a file or a heading resolves; `--check` fails on a dead one |
| `cortex-skill-usage.mjs` | Which rituals your sessions have actually reached |
| `cortex-placeholders.mjs` | Did a file Cortex stamped keep a placeholder from its template; exit 1 if so |
| `cortex-claude-docs.mjs` | Are the Claude Code rules Cortex ships still stated on Anthropic's pages, and has Anthropic published a page Cortex has not seen (the Claude Code docs, the blog, and three sections of the platform docs); `--check` exits 1 on a stale rule, 3 on a new page |
| `cortex-site-facts.mjs` | The facts the public site states, read from source; `--check` names each one that drifted |
| `cortex-site-demo.mjs` | What a `/cortex` run prints on a new repo, a working project and a team's repo, captured for the site's walkthrough |
| `server/server-setup.sh` | Set up a team brain: the bare repo on a server, a clone on each machine, the cron lines |
| `server/cortex-cron.sh` | Run by cron on the server: pull the team brain, write a daily digest or weekly audit, push it |
