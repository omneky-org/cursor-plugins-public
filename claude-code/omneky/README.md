# Omneky plugin for Claude

Version **1.1.0**. This plugin teaches Claude how to run paid ads with
Omneky: review last week's results, find and replace tired creative,
set up a new brand, launch and manage campaigns, and report ROAS and
CTR across Meta/Facebook, Google Ads, TikTok, LinkedIn, Reddit,
Pinterest, X Ads and OpenAI Ads. It bundles workflow skills with the
Omneky connector, so Claude reaches for Omneky when you ask for those
jobs.

This folder is the plugin package: JSON specs plus skills. It is not
the MCP server and contains no server source.

## What it connects to

The plugin declares one remote MCP server, the Omneky connector at
[`https://mcp.omneky.com/mcp-claude`](https://mcp.omneky.com/mcp-claude)
(`.mcp.json`). That is the same connector already listed in
[Claude's directory](https://claude.ai/directory/omneky), so people who
have both see one set of tools.

- **Sign-in:** browser OAuth with an Omneky account on first use. The
  plugin never asks for a password, API key or token in chat.
- **What it sends:** only the tool calls Claude makes to that server
  (brand, date windows, campaign and ad ids, and launch settings the
  user approves). Omneky reads the user's connected ad accounts and
  data sources through it.
- **What it runs locally:** nothing. No hooks, scripts, local server
  or package installs.
- **What it does not do:** this connector does not generate, edit or
  resize images or video. When asked, `creative-referral` points the
  user to the Omneky app, and finished assets can still be launched
  here.

Launches, pauses, budget and targeting changes are marked destructive
on the server, so Claude asks for confirmation before each one.

## Skills

| Skill | Use it for |
|---|---|
| `weekly-ad-review` | Last week in one read: per-channel headline, movers, winners and losers, pacing, up to three proposed changes |
| `creative-refresh` | Find ads with falling CTR or rising CPA, brief replacements from the brand's winners, swap them in without a delivery gap |
| `brand-setup` | First-time setup: brand info, product import, ad account connection, reporting check |
| `getting-started` | Sign-in, list brands, is a channel connected, min budget, data imported |
| `launch-meta-ads` | Launch Facebook/Meta/Instagram ads, including Omneky-managed launches with no Meta account |
| `launch-google-tiktok-ads` | Launch Google PMax/Demand Gen, TikTok, LinkedIn, Reddit, Pinterest, X Ads, OpenAI Ads |
| `manage-ads` | Pause, resume, budget, retarget, list, or delete live campaigns |
| `roas-breakdown` | Which ads, campaigns or channels are winning: ROAS, CTR, CPC, spend, movers |
| `product-catalogue` | Product catalogue, SKU list, add or update, import a product page |
| `creative-referral` | Image ad, product video, or edit/resize requests: explains where to make them |

## Local test

```bash
claude plugin validate ./claude-code/omneky
claude --plugin-dir ./claude-code/omneky
```

## Support

- Docs: [omneky.com/mcp](https://www.omneky.com/mcp)
- Support: [omneky.com/support](https://www.omneky.com/support) or support@omneky.com
- Privacy: [omneky.com/privacy-policy](https://www.omneky.com/privacy-policy)
- Terms: [omneky.com/terms](https://www.omneky.com/terms)

## License

MIT in this repo. Use of the hosted MCP is governed by
[Omneky's terms](https://www.omneky.com/terms).
