# Omneky plugin for Claude Code

Connects Claude Code to Omneky paid media — Meta/Facebook, Google PMax/Demand
Gen, TikTok, LinkedIn, Reddit, ROAS/CTR analytics, and brand catalogue — via
the **Directory-safe** hosted MCP at
[`https://mcp.omneky.com/mcp-claude`](https://mcp.omneky.com/mcp-claude).

This directory is the **plugin package** — JSON specs plus skills. It is not
the MCP server and contains no server source.

**The [Claude Connectors Directory](https://claude.ai/directory/omneky) listing
is separate and already live.** This plugin is for **Claude Code skills** (the
workflows Claude reaches for). It does not replace that connector listing.

## What Claude Code installs

| File | Role |
|---|---|
| [`.mcp.json`](.mcp.json) | Remote HTTP MCP: `https://mcp.omneky.com/mcp-claude` |
| [`.claude-plugin/plugin.json`](.claude-plugin/plugin.json) | Plugin manifest (name, homepage, keywords) |
| [`skills/`](skills/) | Launch, ROAS, catalogue, and creative-referral workflows |

On install, Claude Code starts the MCP config and runs Omneky's OAuth flow.
No API key, no local process, no server checkout.

## Authentication

The plugin calls only `https://mcp.omneky.com/mcp-claude`. Sign in with an
Omneky account in the browser. Never paste a JWT or API key into chat.

`/mcp-claude` is the trimmed Directory surface: analytics, product catalogue,
and ad launch — **no** AI image/video generation or image edit/resize. The
full connector at `https://mcp.omneky.com/mcp` is what the Cursor plugin in
this repo uses. Do not retarget this package at `/mcp`.

## Skills

| Skill | When to use |
|---|---|
| `launch-meta-ads` | Facebook/Meta/Instagram ads — sales, traffic, leads, awareness, video views; pause, budget, retarget |
| `launch-google-tiktok-ads` | Google PMax/Demand Gen, TikTok, LinkedIn, Reddit — conversions, traffic, leads, video views |
| `roas-breakdown` | Which ads/campaigns/channels are winning — ROAS, CTR, CPC, spend, WoW/MoM |
| `product-catalogue` | Product/brand catalogue, SKU list, add/update, scrape a product page URL |
| `creative-referral` | Image ad, product video, or edit/resize — call `get_creative_generation_help` only |

## Local test

From this public repository:

```bash
claude --plugin-dir ./claude-code/omneky
```

## Submit (after merge)

After this lands on `main`, submit **this public GitHub repo / plugin path**
at [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit)
(or the claude.ai Team/Enterprise plugin form). Anthropic needs a public URL;
do not submit `omneky-org/public-mcp` (private; contains the server).

Approved plugins appear in `claude-community`. Run
`claude plugin validate ./claude-code/omneky` before submitting.

Connectors Directory submit is **not** this step — that listing is already live.

## Safety

New ad launches stay **paused** unless the user explicitly asks to go live.

## License

MIT in this repo. Use of the hosted MCP is governed by
[Omneky's terms](https://www.omneky.com/terms).
