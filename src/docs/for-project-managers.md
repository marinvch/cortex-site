# For project managers

You plan in a tracker and do not run Claude Code. Cortex traces each epic to the code its stories touched, and says where the risk is. It never estimates.

## Install

Download `cortex-pack-pm-<version>.zip` from the
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

Ask `/story-map` for the status of an epic. It reads the team-brain through the MCP tools: the stories the tracker sync mirrored, and the code each repo published for them. The team's tracker must have its stories turned on (`ai-os integrations add <kind> --stories`), which a developer or lead does once.

## When to reach for what

| When | Run |
|---|---|
| the status of an epic, or what is blocked | `/story-map` |
| a plan to stress-test before it is committed to | `/challenge-plan` |

## What your job changes

On a team, your job is recorded once in the team-brain's roster: `ai-os team member --job pm`, which `/join-team` asks for. It decides what `/setup-repo`, `/resume-work` and `/join-team` offer you first, never what you may run. With no job recorded you are a developer.

Offered first to this job:

- `/whats-changed` — what changed while you were away, from notes and git history
- `/challenge-plan` — question a plan in rounds until no decision is left open
- `/story-map` — each epic traced to the code its stories touched, what waits on an open ask, where the risk is; never estimates

`/whats-changed` runs a script, so it works only in Claude Code. In the pack, `/story-map` covers the same catch-up through the team-brain's tools.

Every ritual is on [Rituals](#/rituals).
