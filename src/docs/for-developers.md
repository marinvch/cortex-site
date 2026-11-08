# For developers

You work in the repo, in Claude Code. Cortex gives your agent the repo's own rules before it touches anything, and checks the change against them before you commit.

## Install

In Claude Code, install the plugin once:

{{install}}

Then turn on auto-update, as [Installation](#/install) shows, so each release reaches you.

## Start here

Run `/setup-repo` inside the repo. It indexes, reports, and asks once before it writes anything. On a team's repo, `/join-team` connects it to the team's brain.

## When to reach for what

| When | Run |
|---|---|
| before touching files | `/change-impact <files>` |
| chasing a bug you cannot explain | `/debug-issue` |
| before committing | `/review-change` |
| work is finished | `/merge-work` |
| lost, or back on work in flight | `/resume-work` |

## What your job changes

On a team, your job is recorded once in the team-brain's roster: `ai-os team member --job developer`, which `/join-team` asks for. It decides what `/setup-repo`, `/resume-work` and `/join-team` offer you first, never what you may run. With no job recorded you are a developer.

Offered first to this job:

- `/setup-repo` — set the repo up in one pass: index, findings, the context layer and the loop, after one confirmation
- `/review-change` — check a change against the repo's own docs, and find the docs it made wrong
- `/change-impact` — which files depend on the ones you are changing, and which of them no test covers
- `/debug-issue` — find the cause of a hard bug with a loop that can fail on demand
- `/resume-work` — pick up work in flight: committed, uncommitted, diverged, then what is left
- `/merge-work` — get finished work onto main, one pull request at a time, in an order that strands nothing
- `/repo-map` — the repo as one offline HTML page: overview, import graph, files, areas, gaps
- `/handover-notes` — in-flight state for the next agent, written to the OS temp dir
- `/end-of-day-summary` — the day's changes and lessons, into the repo's committed `.cortex/memory/`

Every ritual is on [Rituals](#/rituals).
