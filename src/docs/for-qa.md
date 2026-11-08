# For QA

You decide what to test and whether a change is safe. Cortex reads the import graph backwards: what depends on a file, and which of it no test covers.

## Install

In Claude Code, install the plugin once:

{{install}}

Then turn on auto-update, as [Installation](#/install) shows, so each release reaches you.

## Start here

In a repo `/setup-repo` has indexed, `/change-impact <files>` lists the dependents of the files a change touches and the ones with no test found. With the parser add-on, `node index/cortex-impact.mjs --symbol <file>#<function>` does the same for one function's callers.

## When to reach for what

| When | Run |
|---|---|
| which tests to run for a change | `/change-impact <files>` |
| a change to judge against the repo's rules | `/review-change` |
| a failing or flaky test | `/debug-issue` |

## What your job changes

On a team, your job is recorded once in the team-brain's roster: `ai-os team member --job qa`, which `/join-team` asks for. It decides what `/setup-repo`, `/resume-work` and `/join-team` offer you first, never what you may run. With no job recorded you are a developer.

Offered first to this job:

- `/change-impact` — which files depend on the ones you are changing, and which of them no test covers
- `/review-change` — check a change against the repo's own docs, and find the docs it made wrong
- `/debug-issue` — find the cause of a hard bug with a loop that can fail on demand

Every ritual is on [Rituals](#/rituals).
