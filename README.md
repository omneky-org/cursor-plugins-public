# Omneky agent plugins

Public listings for Omneky on **Cursor Marketplace** and **Claude Code**. Neither package contains MCP server source.

- **Cursor**: installing the Omneky plugin points Cursor at the full hosted MCP (`https://mcp.omneky.com/mcp`) and uses OAuth to link your workspace.
- **Claude Code**: the sibling plugin points at the Directory-safe MCP (`https://mcp.omneky.com/mcp-claude`) — launch, catalogue, and analytics skills, with creative generation referred via `get_creative_generation_help`. The [Connectors Directory](https://claude.ai/directory/omneky) listing is separate and already live.

The Cursor side follows the [Cursor plugin template](https://github.com/cursor/plugin-template) multi-plugin layout.

## Plugins

| Plugin | Folder | Host | What it does |
| --- | --- | --- | --- |
| [Omneky (Cursor)](plugins/omneky/) | `plugins/omneky` | Cursor | Full paid-media MCP — Meta, Google, TikTok, LinkedIn, Reddit; launch, creatives, catalogue, ROAS/CTR |
| [Omneky (Claude Code)](claude-code/omneky/) | `claude-code/omneky` | Claude Code | Directory-safe MCP — same launch/catalogue/analytics skills; creative-referral only |

## Use in Cursor

1. Install **Omneky** from the [Cursor Marketplace](https://cursor.com/marketplace) after this repo is published, or load the plugin locally (below).
2. Sign in when Cursor opens the Omneky OAuth prompt.
3. Ask Cursor to work with brands, creatives, catalogue items, or campaigns. New ad launches stay paused unless you ask to go live.

You need an [Omneky](https://www.omneky.com) account. Support: support@omneky.com.

## Repository layout

```text
.cursor-plugin/marketplace.json   # Cursor Marketplace manifest
plugins/omneky/                   # Cursor plugin (full MCP)
  .cursor-plugin/plugin.json
  mcp.json                        # https://mcp.omneky.com/mcp
  skills/*/SKILL.md
  assets/logo.svg
  README.md
claude-code/omneky/               # Claude Code plugin (Directory-safe MCP)
  .claude-plugin/plugin.json
  .mcp.json                       # https://mcp.omneky.com/mcp-claude
  skills/*/SKILL.md
  README.md
docs/add-a-plugin.md              # How to add another Cursor plugin later
scripts/validate-template.mjs     # Cursor template packaging checks
```

Each host's plugin folder is the installable unit. Cursor discovers MCP from `plugins/omneky/mcp.json`; Claude Code discovers MCP from `claude-code/omneky/.mcp.json`. Auth stays OAuth DCR — no client id or API key is stored here.

## Local testing

Copy **the plugin folder**, not the whole marketplace repo:

```bash
mkdir -p ~/.cursor/plugins/local
cp -R plugins/omneky ~/.cursor/plugins/local/omneky
```

Reload the Cursor window, then confirm the Omneky MCP server appears in Customize. For the official steps, see [Test plugins locally](https://cursor.com/docs/plugins.md#test-plugins-locally).

## Claude Code

Local test (this is the skills plugin, not the Connectors Directory listing):

```bash
claude --plugin-dir ./claude-code/omneky
```

Public distribution: submit via [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit) or the claude.ai Team/Enterprise plugin form. Approved plugins appear in `claude-community`. See [`claude-code/omneky/README.md`](claude-code/omneky/README.md).

## Validate

```bash
node scripts/validate-template.mjs
```

Cursor-only. To add another plugin under `plugins/`, see [`docs/add-a-plugin.md`](docs/add-a-plugin.md). For the Claude Code package, run `claude plugin validate ./claude-code/omneky` when the Claude CLI is available.

## Publish

- **Cursor**: submit this repository at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). After merge, ask marketplace-publishing@cursor.com to re-index.
- **Claude Code**: submit `claude-code/omneky` at [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit) (or the claude.ai Team/Enterprise form). This is separate from the Connectors Directory listing.

## Links

- [Website](https://www.omneky.com)
- [Privacy policy](https://www.omneky.com/privacy-policy)
- [Terms](https://www.omneky.com/terms)
