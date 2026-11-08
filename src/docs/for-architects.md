# For architects

You decide how the code is shaped and what its words mean. Cortex writes those decisions where every agent reads them: the context layer, the glossary and the ADRs.

## Install

In Claude Code, install the plugin once:

{{install}}

Then turn on auto-update, as [Installation](#/install) shows, so each release reaches you.

Away from Claude Code, the `architect` role pack carries the skills that work without it. The rest are listed in its README with the reason.

## Start here

In a repo that `/setup-repo` has indexed, `/repo-map` shows its clusters and the graph report, and `/architecture-review` reports where the structure could be deeper.

## When to reach for what

| When | Run |
|---|---|
| a fuzzy term, or a decision to record | `/define-terms` |
| a risky change, before code | `/design-spec` |
| an area with its own invariants | `/write-area-brief <dir>` |
| a plan to stress-test | `/challenge-plan` |

## What your job changes

On a team, your job is recorded once in the team-brain's roster: `ai-os team member --job architect`, which `/join-team` asks for. It decides what `/setup-repo`, `/resume-work` and `/join-team` offer you first, never what you may run. With no job recorded you are a developer.

Offered first to this job:

- `/define-terms` — settle the repo's terms in `CONTEXT.md`, and record decisions as ADRs
- `/design-spec` — brainstorm, then a design spec and a plan for a risky change; no code
- `/architecture-review` — places where the code's structure could be deeper, reported, then one worked
- `/write-area-brief` — a scoped `AGENTS.md` for one critical directory
- `/write-context-docs` — the root `AGENTS.md`, its shims, `CONTEXT.md` and `docs/adr/`
- `/challenge-plan` — question a plan in rounds until no decision is left open
- `/repo-map` — the repo as one offline HTML page: overview, import graph, files, areas, gaps

Every ritual is on [Rituals](#/rituals).
