# Omneky Cursor plugins

Public Cursor Marketplace listing for Omneky. Installing the **Omneky** plugin points Cursor at the hosted MCP (`https://mcp.omneky.com/mcp`) and uses OAuth to link your workspace.

This repository follows the [Cursor plugin template](https://github.com/cursor/plugin-template) multi-plugin layout. It does not contain MCP server source.

## Plugins

| Plugin | Folder | What it does |
| --- | --- | --- |
| [Omneky](plugins/omneky/) | `plugins/omneky` | Generate creatives, manage products, launch ads across Meta, Google, LinkedIn, Reddit, and TikTok, and report performance. |

## Use in Cursor

1. Install **Omneky** from the [Cursor Marketplace](https://cursor.com/marketplace) after this repo is published, or load the plugin locally (below).
2. Sign in when Cursor opens the Omneky OAuth prompt.
3. Ask Cursor to work with brands, creatives, catalogue items, or campaigns. New ad launches stay paused unless you ask to go live.

You need an [Omneky](https://www.omneky.com) account. Support: support@omneky.com.

## Repository layout

```text
.cursor-plugin/marketplace.json   # Marketplace manifest (lists plugins)
plugins/omneky/                   # The Omneky Cursor plugin
  .cursor-plugin/plugin.json      # Plugin identity and mcp.json pin
  mcp.json                        # Hosted HTTP MCP: https://mcp.omneky.com/mcp
  assets/logo.svg
  README.md
docs/add-a-plugin.md              # How to add another plugin later
scripts/validate-template.mjs     # Template packaging checks
```

The plugin folder is the installable unit. Cursor discovers MCP from `plugins/omneky/mcp.json` (also pinned as `mcpServers` in the plugin manifest). Auth stays OAuth DCR — no client id or API key is stored here.

## Local testing

Copy **the plugin folder**, not the whole marketplace repo:

```bash
mkdir -p ~/.cursor/plugins/local
cp -R plugins/omneky ~/.cursor/plugins/local/omneky
```

Reload the Cursor window, then confirm the Omneky MCP server appears in Customize. For the official steps, see [Test plugins locally](https://cursor.com/docs/plugins.md#test-plugins-locally).

## Validate

```bash
node scripts/validate-template.mjs
```

To add another plugin under `plugins/`, see [`docs/add-a-plugin.md`](docs/add-a-plugin.md).

## Publish

Submit this repository at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). This listing is separate from any xAI Grok Build catalog entry.

## Links

- [Website](https://www.omneky.com)
- [Privacy policy](https://www.omneky.com/privacy-policy)
- [Terms](https://www.omneky.com/terms)
