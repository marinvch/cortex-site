# For team leads

You run the team's shared brain and keep its setup lean. Cortex keeps one committed context layer per repo and one team-brain the whole team reads.

## Install

In Claude Code, install the plugin once:

{{install}}

Then turn on auto-update, as [Installation](#/install) shows, so each release reaches you.

## Start here

Run `/create-team` once to create the team-brain. Each member then runs `/join-team` in a product repo and records their roles and their job. On a work laptop, `/set-profile` sets the machine to `work`, and IT's list of [approved destinations](#/privacy) decides where anything may go.

## When to reach for what

| When | Run |
|---|---|
| back after time away | `/whats-changed` |
| a change to judge against the docs | `/review-change` |
| the repo needs skills for its stack | `/suggest-skills` |
| the agent docs have grown | `/trim-agent-docs` |

## What your job changes

On a team, your job is recorded once in the team-brain's roster: `ai-os team member --job lead`, which `/join-team` asks for. It decides what `/setup-repo`, `/resume-work` and `/join-team` offer you first, never what you may run. With no job recorded you are a developer.

Offered first to this job:

- `/create-team` — create and seed the team's shared brain repository
- `/join-team` — connect a product repo to the team's brain
- `/whats-changed` — what changed while you were away, from notes and git history
- `/review-change` — check a change against the repo's own docs, and find the docs it made wrong
- `/suggest-skills` — propose and write skills that fit the repo's detected stack
- `/trim-agent-docs` — measure and slim agent context files, and judge the skill collection by use
- `/set-profile` — show or set whether this machine serves home, work or lab

Every ritual is on [Rituals](#/rituals).
