# The sequence

A list of commands is a menu, not an answer. **`/cortex-next` reads the repo you are standing in
and tells you the one command to run now** — every ✓ traced to a file on disk, never to something
a model thinks it did last session.

```
  ✓ Index the codebase              .cortex/index/index.json is present
  ✓ Read the ranked findings        .cortex/findings/2026-08-23.md
  · See the repo as a graph         (optional)
  → Write the context layer         root AGENTS.md, the shims, CONTEXT.md, docs/adr/
                                    /cortex-scaffold
    Give critical areas a brief     /cortex-brief <dir>
    Add skills that fit this stack  /cortex-skills
```

Every Cortex CLI prints the same `Next →` line when it finishes, so the sequence is never something
you have to come back here to look up.

## The full order

| # | Command | Does | Skip it when |
|---|---|---|---|
| 0 | `/migrate-engine` | harvest a retired `.ai-os/` engine's memory first | there is no `.ai-os/` |
| 1 | `/cortex` | index → findings → the loop → one confirmation → everything below, in one pass | never — this is the entry point |
| 2 | `/cortex-view` | the repo as one offline HTML page: overview, map, structure, files, areas, gaps | you would rather read the report |
| 3 | `/optimize-context` | slim the `AGENTS.md` / `CLAUDE.md` / `.cursorrules` that were already here | the repo had none |
| 4 | `/cortex-scaffold` | write the context layer you picked | — |
| 5 | `/cortex-brief <dir>` | a scoped `AGENTS.md` leaf per area that earns one | no area holds real invariants |
| 6 | `/cortex-skills` | skills proposed from what the index detected | — |
| 7 | `/cortex-enrich` | semantic summaries on top of the index (costs tokens) | you already know the repo |
| — | `/cortex-install` | the read half of step 1 alone: index, report, offer the context layer | you want the whole pass |
| 8 | `/dream` | end-of-day digest into the repo's committed `.cortex/memory/` | — |

**Step 3 goes before step 4, not after.** `/cortex-scaffold` is brownfield-safe and will not
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
| starting a risky feature | `/analyze-spec` |
| before touching files | `/cortex-impact <files>` |
| one agent or the team? | `/cortex-impact <files> --size` |
| another session is editing the same repo | `/cortex-impact --against <their change set>` |
| before committing | `/cortex-review` |
| chasing a bug you cannot explain | `/diagnosing-bugs` |
| back after time away | `/catch-me-up` |
| picking up work already in flight | `/resume` |
| the work is finished | `/ship` |

When you do not know which ritual you want, that is `/cortex-next` — the whole reason it exists.
