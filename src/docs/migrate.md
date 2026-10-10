# Moving off the old engine

Before Cortex 2, this site documented **AI OS** — an engine that wrote its state into `.ai-os/`
and `.github/ai-os/`. That engine is retired. Its configuration, profiles, dry-run
mode and JSON output pages are gone because the features are gone.

## If a repo still has `.ai-os/`

Install Cortex, then run this first, inside that repo:

```
/migrate-engine
```

It **harvests first and deletes second**: the old engine's memory is read and folded into the
repo's `AGENTS.md` before anything is removed, so no knowledge is lost across the change.

It looks in three places the old setup hides, and each of those checks is read-only:

- **A folder that is not a repo.** Run from a home directory, it asks which repo is meant and
  offers the ones one level down, rather than scanning where it stands and reporting "no engine
  found".
- **Other branches.** The engine's files, its memory among them, can sit on a branch that is not
  checked out. It lists the hits per local and remote-tracking branch and harvests from them
  without checking them out. Removing files from another branch is left to you, and the final
  check lists them as still there, never as cleaned.
- **MCP servers registered outside the repo.** A user-scope registration shows in no file of the
  repo. Each is listed with the root it reads; one whose root is being deleted is repointed or
  removed, on your yes.

**A Cortex server registered as `ai-os` is not the old engine.** The engine's MCP entry is told by
where it points — into `.ai-os/` — not by its name. Cortex's own server went by `ai-os` until
2.41.47, and such a registration is listed as kept and left alone.

Then continue with [the sequence](#/sequence) — `/cortex` from the top.
