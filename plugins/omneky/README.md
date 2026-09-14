# Omneky

Omneky connects Cursor to paid media: analyze ROAS/CTR/spend by creative, campaign, or channel; manage your brand product catalogue; generate image ads and product videos; and launch or pause campaigns on Meta/Facebook, Google, LinkedIn, Reddit, and TikTok — from one conversation. New launches stay paused unless you ask to go live.

This plugin is a Cursor Marketplace listing only: plugin JSON that points at the hosted Omneky MCP. It does not contain the MCP server source.

## What you can do

- **Analytics**: brand and account context, daily metrics, ranked ROAS/CTR/spend breakdowns, and trending movers (`roas-breakdown` skill).
- **Products**: list, inspect, create, and upsert catalogue items, including URL scrape (`product-catalogue` skill).
- **Ad launch**: Facebook/Meta, Google (PMax + Demand Gen), LinkedIn, Reddit, and TikTok campaigns. New launches default to paused unless you ask to go live (`launch-meta-ads`, `launch-google-tiktok-ads` skills).
- **Creative**: generate image ads and product videos; poll generation status (`creative-generation` skill).
- **Image edit**: edit and resize existing creatives.

## Install

1. Install the **Omneky** plugin from the [Cursor Marketplace](https://cursor.com/marketplace), or load this folder locally (see the [repository README](../../README.md#local-testing)).
2. On first use, Cursor opens Omneky sign-in (OAuth) to link your workspace.
3. Ask Cursor to list brands, generate a creative, or launch a paused campaign.

## MCP

Cursor discovers the hosted server from [`mcp.json`](./mcp.json):

- Name: `omneky`
- Transport: HTTP
- URL: `https://mcp.omneky.com/mcp`

Auth is OAuth with dynamic client registration. There is no static client id and no API key in this repo.

## Safety

Every action runs under the permissions of the Omneky account you sign in with. New ad launches stay **paused** unless you explicitly ask to go live.

## Requirements

An [Omneky](https://www.omneky.com) account.

## Links

- [Website](https://www.omneky.com)
- [Privacy policy](https://www.omneky.com/privacy-policy)
- [Terms](https://www.omneky.com/terms)
- Support: support@omneky.com
