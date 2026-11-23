# For product owners

You decide what gets built and why, and you do not run Claude Code. Cortex shows where each epic stands against the code, and makes what you decide visible to the whole team.

## Install

Download `cortex-pack-po-<version>.zip` from the
[latest release](https://github.com/marinvch/Cortex/releases/latest) and unzip it.

1. **The skills.** Upload each zip under `zips/` in claude.ai or Claude Desktop (Settings, then
   Capabilities, then Skills), or copy a folder from `skills/` to wherever your assistant reads
   skills from.
2. **The team's brain.** `mcp/claude-desktop.json` is the Cortex MCP entry for Claude Desktop:
   merge its `mcpServers` into `claude_desktop_config.json`, and set `CORTEX_TEAM` and
   `CORTEX_TEAM_REPO` to your team. The pack's README names the files for Copilot, Gemini CLI and
   Codex.

The server runs from a Cortex checkout with Node. The pack holds no credential: a tracker token
stays in your own environment.

## Start here

Ask `/story-map` for the status of an epic. It lists what the team already decided about it, what waits on an open ask, and where the risk is. It never estimates. The team's tracker must have its stories turned on (`cortex integrations add <kind> --stories`), which a developer or lead does once.

## When to reach for what

| When | Run |
|---|---|
| the status of an epic, or what is blocked | `/story-map` |
| an idea to question until nothing in it is assumed | `/challenge-plan` |
| two people using one word for different things | `/define-terms` |

Once you confirm a plan, `/challenge-plan` offers to draft it as an intent, from your own answers. What you left open stays under "Not yet decided", and it writes only after you say yes.

## Your decisions

When you answer an ask with the status `decided`, the decision reaches the whole team: `/story-map` and `/whats-changed` list what was decided, by whom and when, across every repo. Your handle must be on the team's roster to record one. That catches a wrong name and is not authentication, so who can write to the team-brain is set by the access rules of the repository that hosts it.

## What your job changes

On a team, your job is recorded once in the team-brain's roster: `cortex team member --job po`, which `/join-team` asks for. It decides what `/setup-repo` and `/join-team` offer you first, never what you may run. With no job recorded you are a developer.

Offered first to this job:

- `/story-map` — each epic traced to the code its stories touched, what waits on an open ask, where the risk is; never estimates
- `/challenge-plan` — question a plan in rounds until no decision is left open
- `/define-terms` — sharpen the team's words, in its glossary and decision records
- `/whats-changed` — what changed while you were away, from notes and git history

`/whats-changed` runs a script, so it works only in Claude Code. In the pack, `/story-map` covers the same catch-up through the team-brain's tools.

Every ritual is on [Rituals](#/rituals).
