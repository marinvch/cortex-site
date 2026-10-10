# The personal vault

Cortex began as a personal second brain, and that half still works: a set of rituals manage a
markdown vault of your own notes, projects and daily logs.

The vault is **optional** and lives in **its own private repository** — never inside the Cortex
checkout, and never inside a product repo. It is being extracted so that Cortex itself stays purely
the shippable context manager.

The vault rituals ship in the same plugin as the codebase ones. Their descriptions cost a
codebase-only user about 720 tokens a session.
[ADR 0020](https://github.com/marinvch/Cortex/blob/master/docs/adr/0020-the-vault-rituals-stay-in-the-one-plugin.md)
records why they stay rather than becoming a second plugin.

> One rule: capture first, organize later. Nothing lives only in your head.

## Quick start

**1. Get the vault** — its own folder:

```bash
git clone https://github.com/marinvch/Cortex.git
mkdir ~/cortex-brain
cp -r Cortex/templates/vault/. ~/cortex-brain/       # the empty skeleton
cp Cortex/templates/home.md ~/cortex-brain/home.md   # your personal map
```

The rituals come from the plugin, so they are available in the vault folder without copying
anything else in.

**2. Teach the brain who you are** — from the vault folder, run `/onboard`. It interviews you and
fills `context/`, `connections.md` and `references/voice.md`.

**3. Use it daily**

```
/capture        # drop any thought into the inbox (anytime)
/daily          # start today's note; priorities + what's due (each morning)
/weekly-review  # empty the inbox, update projects, archive stale (weekly)
```

**4. See your whole brain** — `bash tools/cortex.sh` builds `cortex.html`: a force graph of your
notes, rendered markdown with clickable links, your registered codebases, and the gaps to fix.

## Connect it as a live brain

The vault can be served by the same MCP server in **vault mode**, so `recall` and `capture` become
real tools in every project on your machine. `/connect-brain` registers it for you, as a server
named `cortex` with `CORTEX_ROOT` set to your vault's path — the only configuration there is.

A server already registered as `ai-os`, with `AI_OS_ROOT`, keeps working and needs no change: that
variable is still read, with no warning and no removal date. To move to the new name, remove the
old registration first. Do not keep both — they are two servers over one vault, and every tool
appears twice.

## Keep worlds apart

One vault holds **exactly one world** — see [Privacy & firewall](#/privacy).
