# The sequence

A list of commands is a menu, not an answer. **`/resume-work` reads the repo you are standing in
and tells you the one command to run now** — every ✓ traced to a file on disk, never to something
a model thinks it did last session.

```
  ✓ Index the codebase              .cortex/index/index.json is present
  ✓ Read the ranked findings        .cortex/findings/2026-08-23.md
  · See the repo as a graph         (optional)
  → Write the context layer         root AGENTS.md, the shims, CONTEXT.md, docs/adr/
                                    /write-context-docs
    Give critical areas a brief     /write-area-brief <dir>
    Add skills that fit this stack  /suggest-skills
```

Every Cortex CLI prints the same `Next →` line when it finishes, so the sequence is never something
you have to come back here to look up.

## The full order

| # | Command | Does | Skip it when |
|---|---|---|---|
| 0 | `/migrate-legacy-engine` | harvest a retired `.ai-os/` engine's memory first | there is no `.ai-os/` |
| 1 | `/setup-repo` | index → findings → the loop → one confirmation → everything below, in one pass | never — this is the entry point |
| 2 | `/repo-map` | the repo as one offline HTML page: overview, map, structure, files, areas, gaps | you would rather read the report |
| 3 | `/trim-agent-docs` | slim the `AGENTS.md` / `CLAUDE.md` / `.cursorrules` that were already here | the repo had none |
| 4 | `/write-context-docs` | write the context layer you picked | — |
| 5 | `/write-area-brief <dir>` | a scoped `AGENTS.md` leaf per area that earns one | no area holds real invariants |
| 6 | `/suggest-skills` | skills proposed from what the index detected | — |
| 7 | `/summarize-files` | semantic summaries on top of the index (costs tokens) | you already know the repo |
| — | `/setup-repo`, report only | step 1 without the writing: index, report, offer the context layer | you want the whole pass |
| 8 | `/end-of-day-summary` | end-of-day digest into the repo's committed `.cortex/memory/` | — |

**Step 3 goes before step 4, not after.** `/write-context-docs` is brownfield-safe and will not
clobber a curated `AGENTS.md` — which means you would end up with your file *plus* an
`AGENTS.generated.md` and a merge to do by hand. Slimming first leaves one file.

Once the context layer exists, step 3 no longer names `AGENTS.md`. One case keeps it, as an
optional row: a `.github/copilot-instructions.md` that still holds rules of its own, where Cortex
writes a one-line pointer at `AGENTS.md`. Copilot reads that second copy and nobody keeps it true.
It is an offer, never the first question, and a no is a full answer — a team may keep rules for one
tool on purpose.

## Per change

Not a sequence — a lookup:

| When | Run |
|---|---|
| starting a risky feature | `/design-spec` |
| before touching files | `/change-impact <files>` |
| one agent or the team? | `/change-impact <files> --size` |
| another session is editing the same repo | `/change-impact --against <their change set>` |
| before committing | `/review-change` |
| chasing a bug you cannot explain | `/debug-issue` |
| back after time away | `/whats-changed` |
| picking up work already in flight | `/resume-work` |
| the work is finished | `/merge-work` |

When you do not know which ritual you want, that is `/resume-work` — the whole reason it exists.
