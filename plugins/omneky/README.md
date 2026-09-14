# Omneky

Omneky connects Cursor to paid media: analyze ROAS/CTR/CPC/spend by creative, campaign, or channel; manage your brand product catalogue; generate image ads and product videos; and launch or pause campaigns on Meta/Facebook, Google (Performance Max + Demand Gen), LinkedIn, Reddit, and TikTok — from one conversation. New launches stay paused unless you ask to go live.

This plugin is a Cursor Marketplace listing only: plugin JSON that points at the hosted Omneky MCP. It does not contain the MCP server source.

## What you can do

- **Getting started**: sign-in identity, list brands, channel connection, min budget, data-available (`getting-started` skill).
- **Analytics**: daily metrics, ranked ROAS/CTR/CPC/spend leaderboards, WoW/MoM movers (`roas-breakdown` skill).
- **Products**: list, inspect, create, and upsert catalogue items, including product-page URL scrape (`product-catalogue` skill).
- **Ad launch**: Facebook/Meta/Instagram, Google (PMax + Demand Gen / YouTube / Discover), LinkedIn, Reddit, and TikTok. New launches default to paused unless you ask to go live (`launch-meta-ads`, `launch-google-tiktok-ads` skills).
- **Manage live ads**: pause, resume, budget, targeting, list, delete (`manage-ads` skill).
- **Creative**: generate image ads and product videos; edit or resize for 1:1 / 9:16 / 16:9; check job status (`creative-generation` skill).

## Install

1. Install the **Omneky** plugin from the [Cursor Marketplace](https://cursor.com/marketplace), or load this folder locally (see the [repository README](../../README.md#local-testing)).
2. On first use, Cursor opens Omneky sign-in (OAuth) to link your workspace.
3. Ask Cursor to list brands, break down ROAS/CTR, generate an image ad or product video, manage the catalogue, or launch a paused Meta / Google PMax / TikTok campaign.

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
