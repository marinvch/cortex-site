# Index & findings

Cortex understands a repository in two layers: a **deterministic index** anyone can reproduce, and
an optional **enrichment** a model writes on top of it. From the index it writes **one ranked
findings report**.

## The index

The structural map of a repository: files, languages, resolved imports, layers, test flags, git
hot spots, and the HTTP routes the code calls and serves. Built with **no LLM and no network**, so
the same tree always produces the same output — two runs agree byte for byte. That is what makes it safe in CI and cheap on every install.

It lives at `.cortex/index/index.json` and is the source of truth for structure. It asks **git**
which files belong to the repo, rather than guessing from ignore files.

**Imports are resolved by pattern, not by a parser.** A plugin install runs no build, so the import
graph needs no parser. The consequence is stated rather than hidden: dynamic imports are invisible, so
every "who depends on this" number is a **floor**, never a total, and an orphan is stated as a
question, never as a delete list.

Pattern-based is not path-only. A monorepo's own packages resolve by name — `@scope/pkg` reaches
the package's source through the workspace that declares it — and a Java class reaches the classes
of its own package that it names without an import.

**Clusters.** The index groups files that import each other more than they import the rest of the
repo, found by the Leiden method, and names each **cluster** by its **hub**, the member with the
most import links. A cluster is a feature read off the imports, not a folder: it can span several
areas or split one. `node index/cortex-graph.mjs .` prints the graph report — the ten best-linked
files, the **bridges** between clusters that look least expected, one shortest loop per import
cycle, and the clusters with no test found — and writes nothing. A bridge is worth a look, never a
defect.

**The route map.** The index also records the HTTP calls a front end makes and the handlers a back
end declares. `node index/cortex-routes.mjs <dir> --workspace` joins them across a directory of
checkouts — front-end call → gateway route → handler, each as `repo/file:line` — and writes
nothing. An endpoint no call reaches is worth checking, never safe to delete: a URL built at
runtime is counted as unread, not guessed.

Handlers are read from Spring, Express-style routers, NestJS (with a literal global prefix), and
FastAPI and Flask decorators; calls from front-end code and from Python's `requests`, `httpx` or a
client object. A router mounted under a prefix in another file (`app.use("/api", router)`) is not
followed, so its paths lack the prefix — a floor, stated.

**The contract.** `node index/cortex-contract.mjs .` writes what a repo publishes to a team-brain:
the endpoints it `serves` — from an OpenAPI or Swagger file when there is one, else from the route
map's handlers — the `calls` it makes, the `events` it publishes or consumes, and what it could not
read, in `unread`. It reads the route map and never detects routes itself, so the two cannot
disagree. It holds no code, no line numbers and no query strings, so an unrelated edit is not a
contract change, and it never writes into a team-brain itself: the `ai-os` command publishes it.

## Findings

The single ranked markdown report at `.cortex/findings/<date>.md` — issues, gaps and
opportunities, ranked by severity. **Proposals only.** The module that produces findings has no
authority to modify a repository; nothing outside `.cortex/` is written until you choose.

The ranking is not decoration: it is the order `/setup-repo` walks when it asks you what to act on.
Offers collapse by action, so one "add a brief" question can cover several findings — and a merged
question inherits the severity of its most serious member, so merging never buries a critical one.

The report also judges the repo's Claude setup against Anthropic's own documentation — `CLAUDE.md`
size and emphasis, skill and subagent frontmatter, hook scripts, permission rules in a settings
file, direct Messages API calls. Each
`claude-setup/*` finding cites the documented rule it rests on, or says it is Cortex's own
threshold, and none ranks above medium: it is advice about your repo, not a failure.

A skill is held to two bars, and the finding says which. A rule from the Claude Code skills page is
about what Claude Code does with the file. A rule from the platform's skill authoring page — the
shape of a name, the length of a description, a table of contents at the top of a long reference
file — is a limit of the Agent Skills format that the API and a claude.ai upload read. Those three
findings are low, and each says that Claude Code still loads the skill.

A plugin whose `hooks/hooks.json` has a `modules` key is a Claude Code mod, and the report says so.
It is judged by its files, never by its code: whether `modules` is an array of one path, whether
that path names a file, and its extension. Which events the module handles and which calls it makes
is what `claude plugin validate` prints.

When the repo has a root `CLAUDE.md` and scoped briefs, the report's glance and `/resume-work` say
that those briefs load through the routing table only, because under a root `CLAUDE.md` Claude Code
does not read a subdirectory's `AGENTS.md` on its own. It is stated as a fact, not a finding: no
edit to the repo changes it.

## Which function calls which (optional add-on)

The import graph says which files depend on each other. To see which functions call which, install
the parser add-on once per machine:

```bash
node tools/cortex-parsers.mjs install   # downloads about 8.3 MB from registry.npmjs.org
node tools/cortex-parsers.mjs status    # what is installed, against index/parsers.lock.json
node tools/cortex-parsers.mjs remove    # deletes it again
```

Nothing installs it for you. It fetches seven MIT-licensed npm packages pinned in
`index/parsers.lock.json`: the WebAssembly build of the tree-sitter parser and its grammars for
JavaScript, TypeScript and TSX, Python, Go, Java and Rust. Each tarball's sha512 is checked against
the lock before anything is unpacked, and the files go to `~/.cortex/parsers/`, never into the
plugin or a repo. No install script runs. On a `work` profile the registry must be an
[approved destination](#/privacy), and `--registry <url>` fetches from your company's mirror instead.

With the add-on, the index also holds **symbols** — the functions, classes and methods each file
defines (`src/cart.ts#total`, `src/cart.ts#Cart.add`) — and the calls between them. Each call
carries a **confidence**: **extracted** when the code states it (the same file, or a name an import
binds), **inferred** when one candidate was found by name, **ambiguous** when several were, all
kept. Go and Java files see their own package without an import, and a call on a parameter or local
resolves through its declared type. Without the add-on the index is exactly what it was.

```bash
node index/cortex-impact.mjs --symbol src/cart.ts#total   # who calls it, and which callers no test covers
node mcp/ai-os.js graph callers src/cart.ts#total         # the same, through the graph tool
node mcp/ai-os.js graph callees src/cart.ts#Cart.add      # what it calls
node mcp/ai-os.js graph defines src/cart.ts               # what a file defines
```

The count of callers is a floor of **extracted** calls; inferred and ambiguous ones are listed apart.
Without the add-on these refuse and print the install command, rather than answering "no callers".

## Enrichment

The optional prose layer — a summary, role and tags per file — produced by a model with
`/summarize-files`. It lives beside the index in `enriched.json` and is **strictly additive**: it
never edits `index.json`, adds files or removes them, and its absence degrades Cortex to
deterministic behaviour rather than breaking it.

Enrichment made against an older tree is declined, not shown: a summary about a file as it was
last month is worse than no summary.

## Run it yourself

From a clone of the Cortex repository — inside a skill these run through the plugin's own path:

```bash
node index/cortex-next.mjs .        # where this repo is; writes nothing at all
node index/cortex-index.mjs .       # writes .cortex/index/index.json
node index/cortex-findings.mjs .    # writes .cortex/findings/<date>.md
node index/cortex-view.mjs .        # writes .cortex/view/repo.html and opens it
node index/cortex-graph.mjs .       # hubs, bridges, cycles, untested clusters; writes nothing
node index/cortex-enrich.mjs plan . # optional: plan the semantic enrichment pass
```
