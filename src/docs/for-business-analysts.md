# For business analysts

You pin down what a requirement means, and you do not run Claude Code. Cortex keeps the team's words in one glossary, questions an idea until nothing in it is assumed, and shows which code a story reaches.

## Install

Download `cortex-pack-ba-<version>.zip` from the
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

Run `/define-terms` on a word the team uses in more than one way. It challenges the fuzzy ones and records what each means. A repo's glossary lives in its `CONTEXT.md`, so writing it there needs access to that repo.

## When to reach for what

| When | Run |
|---|---|
| two people using one word for different things | `/define-terms` |
| an idea to question until nothing in it is assumed | `/challenge-plan` |
| the status of an epic, what is decided and what is blocked | `/story-map` |
| a risky change to design before anyone builds it | `/design-spec` |

Once a plan is confirmed, `/challenge-plan` offers to draft it as an intent, from the answers given. What was left open stays under "Not yet decided", and it writes only after a yes.

## What your job changes

On a team, your job is recorded once in the team-brain's roster: `cortex team member --job ba`, which `/join-team` asks for. It decides what `/setup-repo` and `/join-team` offer you first, never what you may run. With no job recorded you are a developer.

Offered first to this job:

- `/define-terms` — sharpen the team's words, in its glossary and decision records
- `/challenge-plan` — question a plan in rounds until no decision is left open
- `/story-map` — each epic traced to the code its stories touched, what waits on an open ask, where the risk is; never estimates
- `/design-spec` — design before code: a brainstorm, then a spec and a plan

Every ritual is on [Rituals](#/rituals).
