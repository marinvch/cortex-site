# MCP brain

An optional MCP server over stdio that turns Cortex's memory into live tools for any agent that
speaks MCP. It ships inside the plugin and, like the rest of Cortex, has **no dependencies** — the
transport is about a hundred lines of plain Node.

## Two modes, decided by the root

The server serves one of two worlds, and it **detects** which from the root it is given — it is
never configured:

- **Repo mode** — the root is a repo's `.cortex/` directory. Tools: {{repoTools}}.
- **Vault mode** — the root is a personal vault. Tools: {{vaultTools}}.

The plugin starts it in repo mode, pointed at the project you opened. Vault tools are **hidden
*and* refused** in repo mode, so an agent can never be invited to write a personal inbox into
someone's product repository.

The root is named by one environment variable, `CORTEX_ROOT`, and the plugin sets it for you.
`AI_OS_ROOT`, the name a registration made before 2.41.47 carries, is still read, with no warning
and no removal date. When both are set `CORTEX_ROOT` wins, and two different paths are reported in
one line on stderr. A root that is not set is a hard exit, not a default: guessing a path would
write someone's notes into the wrong place. A root that does not exist is a hard exit too, with one
line naming the path, where the server once started and failed in the first tool an agent called.
Every line it writes to stderr starts with `cortex:`.

## Memory, in both layouts

Memory is read from a day file, `<date>.md`, and from one author's file of a day,
`<date>/<author>.md`; every file of a day comes back together, each as its own row with its author
or none. A write passes no author — Cortex finds it from `CORTEX_AUTHOR`, then git `user.name` —
and the result says which layout the entry landed in. When no name was usable the entry goes to
the shared day file and the result carries a notice, which is how the model learns to tell you.

## The `ai-os` command

The server's second adapter is a command line — from a clone of the Cortex repository,
`node mcp/ai-os.js <command>`. It kept its old name, because it is typed in commands and stored in
configs people already have.

| Command | Does | Needs |
|---|---|---|
| `ai-os setup-plugins` | install the Cortex Core plugin bundle | nothing |
| `ai-os setup-plugins --status` | per tier, which plugins are installed; `--json`, `--tier`, `--plugins-dir`. Read-only | nothing |
| `ai-os team init` | seed and push a team-brain | a vault |
| `ai-os team add` | write this repo's project file into the team-brain, then the connector | a vault |
| `ai-os team member` | add or update one member (`--handle`, `--roles`, `--projects`) in the brain's `team.json`; commit, push | a root, a team |
| `ai-os ask` | send `--to <role\|project> --title --body` as `asks/<id>.md`; commit, push | a root, a team |
| `ai-os inbox` | pull, then the open asks for you and the answers to yours; `--json` | a root, a team |
| `ai-os answer` | append `--body` to ask `--id`, set `--status`; commit, push | a root, a team |
| `ai-os contract publish` | write `--file <contract.json>` as `projects/<slug>/contract.json` + `.md`; commit, push when changed | a root, a team |
| `ai-os contract show` | one project's contract (`--project`, `--path`); `--json` | a root, a team |
| `ai-os contract who-calls` | which projects call `--path "[METHOD] /p"`, and which serve it; `--json` | a root, a team |
| `ai-os contract list` | the projects that have published a contract | a root, a team |
| `ai-os integrations list\|add\|remove\|workflow` | the trackers in `team.json`; `workflow --write` commits the scheduled sync | a root, a team |
| `ai-os sync` | asks ↔ trackers, one commit per run; `--dry-run`, `--status`, `--clone <checkout>` | a root, a team |
| `ai-os project list` | every project the brain knows, as JSON | a vault |
| `ai-os project check` | validate the team's project files; exit 1 on an error or a withheld file | a vault, a team |
| `ai-os project remove` | delete one project file with `git rm`, commit, push | a vault, a team |
| `ai-os digest` | append a git digest to a file | nothing |
| `ai-os catch-up` | notes and history since a date | a repo or a vault |

`setup-plugins --status` reads Claude Code's plugin registry and reports each tier as `installed`,
`partial`, `missing` or `unknown`. It installs nothing and starts no `claude`. The three `project`
commands are refused in repo mode, because the team-brain's clone lives under the vault. On a `lab`
profile a project file is committed in the local clone and not pushed. `ai-os help` lists every team
command.

## Asks and contracts, on a team

`ask`, `inbox`, `answer` and `contract` work in repo and vault mode alike, and need a brain joined
to a team; on a solo brain they refuse and name `/team-add`. An ask is one file per thread,
`asks/<id>.md`, in the team-brain. Its `to` must be a role some member holds or a project the brain
knows, or it is refused with both lists. Your handle is your memory author name, and a caller not
in the roster still sees the asks for the repo they are in. In a product repo the team-brain is
cloned on first use to `.cortex/team/<team>/`, after that directory is added to the repo's
`.gitignore`. `inbox` and `contract` pull first, and a failed pull comes back in `pull` beside the
local result. On `lab`, asks and answers are committed and not pushed.

On a team, the server's `initialize` result carries `instructions`: how many asks are open for you,
and to call `inbox` at the start of a task. It reads the local clone, never pulls, and leaves the
count out when it cannot read it.

A contract is `projects/<slug>/contract.json` plus `contract.md`. Publishing re-serialises it, so
an unchanged republish makes no commit. `contract` answers two questions: with `project`, what that
project serves, calls and emits; with `calls`, who calls an endpoint and who serves it. Every answer
is a floor and says so. `catch_me_up` reports each project's contract drift since the date.

A team that selected GitHub, ServiceNow or Jira in `team.json` has its asks synced there:
`ask`, `answer` and `inbox` sync the asks they touch, and `ai-os sync` syncs all of them. Sync is
idempotent — the link is written before an item is created, and the tracker is searched for the
ask's marker first — so a retry makes no duplicate. The primary tracker wins on status, the brain on
the text. No MCP tool configures a tracker.

## Safety that belongs to the tool, not the caller

- **A tool that returns someone else's text says so.** Recalled memory was written outside the
  conversation, so every such tool's description tells the model to treat the result as data, not
  instructions — the standard prompt-injection path through a retrieval tool.
- **A tool that publishes is gated.** Anything that commits or pushes content goes through the same
  gate as memory: the credential scan, the employer denylist on `home`, and personal data under
  `CORTEX_PII`. A personal-data warning that does not refuse rides back on the tool result. An
  ask's title and links are scanned with its text. A project file passes three gates before it is
  written, in one order: valid, allowed by the profile, free of secrets. The first refusal leaves
  both repositories as they were.
- **A tracker is reached only when the team selected one, and never on `lab`.** Every text sent to
  a tracker and every comment pulled back passes the gate; a comment carrying a credential is
  withheld, and the brain records only that it was. `team.json` refuses a credential — the
  adapters read it from the environment only.
- **Results are capped.** Every tool result is held to a size an agent can read in full; an
  oversized result comes back marked `truncated` with a hint to ask for less, instead of being cut
  silently.

## All {{mcpToolCount}} tools
