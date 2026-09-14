# Omneky for Claude Code

Omneky connects Claude Code to paid media: analyze ROAS/CTR/spend by creative, campaign, or channel; manage your brand product catalogue; and launch or pause campaigns on Meta/Facebook, Google, LinkedIn, Reddit, and TikTok — from one conversation. New launches stay paused unless you ask to go live.

This plugin points Claude Code at the **Directory-safe** hosted MCP (`https://mcp.omneky.com/mcp-claude`). That surface does **not** include AI creative generation or image edit tools. For image ads, product videos, `edit_image`, or `resize_ad`, use `get_creative_generation_help` (see the `creative-referral` skill) or the full connector at `https://mcp.omneky.com/mcp` (the Cursor plugin in this repo).

This package is a Claude Code plugin only: `.claude-plugin/plugin.json`, `.mcp.json`, and skills. It does not contain MCP server source.

The [Claude Connectors Directory](https://claude.ai/directory/omneky) listing is **separate** and already published. This plugin is the **skills path** for Claude Code — it does not replace that connector listing.

## What you can do

- **Analytics**: brand context, daily metrics, ranked ROAS/CTR/spend breakdowns, and trending movers (`roas-breakdown`).
- **Products**: list, inspect, create, upsert, and URL-import catalogue items (`product-catalogue`).
- **Ad launch**: Facebook/Meta, Google (PMax + Demand Gen), LinkedIn, Reddit, and TikTok. New launches stay paused unless you ask to go live (`launch-meta-ads`, `launch-google-tiktok-ads`).
- **Creative**: this Directory surface has no generate/edit tools. Call `get_creative_generation_help` (`creative-referral`).

## Local test

From this repository:

```bash
claude --plugin-dir ./claude-code/omneky
```

On first use, complete Omneky OAuth when Claude Code prompts. Confirm the `omneky` MCP server is connected, then ask to list brands, report ROAS, or launch a paused campaign.

You can also load the folder from an absolute path:

```bash
claude --plugin-dir /path/to/cursor-plugins-public/claude-code/omneky
```

## Public distribution

This plugin is **not** the Connectors Directory listing (already live). Submit the **plugin** (skills + `/mcp-claude`) for Claude Code / Cowork via:

- Console: [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit)
- claude.ai Team/Enterprise directory: [claude.ai/admin-settings/directory/submissions/plugins/new](https://claude.ai/admin-settings/directory/submissions/plugins/new)

Approved third-party plugins land in the `claude-community` marketplace:

```text
/plugin marketplace add anthropics/claude-plugins-community
/plugin install omneky@claude-community
```

Run `claude plugin validate ./claude-code/omneky` before submitting.

## MCP

Claude Code discovers the hosted server from [`.mcp.json`](./.mcp.json):

- Name: `omneky`
- Transport: HTTP
- URL: `https://mcp.omneky.com/mcp-claude`

Auth is OAuth (same pattern as the Cursor plugin). There is no static client id and no API key in this repo.

The full connector (`https://mcp.omneky.com/mcp`) is what the Cursor plugin uses. It includes `generate_image_ad`, `generate_product_video`, `edit_image`, `resize_ad`, and `get_generation_status`. Do not point this Claude Code plugin at that URL — Directory policy keeps creative gen/edit off `/mcp-claude`.

## Safety

Every action runs under the Omneky account you sign in with. New ad launches stay **paused** unless you explicitly ask to go live.

## Requirements

An [Omneky](https://www.omneky.com) account and Claude Code.

## Links

- [Website](https://www.omneky.com)
- [Connectors Directory](https://claude.ai/directory/omneky) (MCP connector — already listed)
- [Privacy policy](https://www.omneky.com/privacy-policy)
- [Terms](https://www.omneky.com/terms)
- Support: support@omneky.com
