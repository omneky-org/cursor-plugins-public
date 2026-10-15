# Omneky

Omneky connects Cursor to paid media: analyze ROAS/CTR/CPC/spend by creative, campaign, or channel; manage your brand product catalogue; generate image ads and product videos; and launch or pause campaigns on Meta/Facebook, Google (Performance Max + Demand Gen), LinkedIn, Reddit, and TikTok — from one conversation. New launches stay paused unless you ask to go live.

This plugin is a Cursor Marketplace listing only: plugin JSON that points at the hosted Omneky MCP. It does not contain the MCP server source.

## What you can do

Skills are the Omneky Grok Bot pack, synced from `omneky-org/public-mcp` (`plugins/grokbot/skills`). Each skill is self-contained and ships its own `references/`.

- `omneky-getting-started-and-failures`: sign-in, brands, connections, and error handling.
- `omneky-analytics-and-catalogue`: ROAS/CTR/CPC/spend reporting and the brand product catalogue.
- `omneky-launch-and-connect`: connect channels and launch on Meta, Google, TikTok, LinkedIn, Reddit, Pinterest, X, and more (paused by default).
- `omneky-image-ads`, `omneky-product-video`, `omneky-avatar-ugc`, `omneky-voice-and-video-clone`, `omneky-edit-and-resize`: creative generation (check jobs once with `get_generation_status`).
- `omneky-billing`, `omneky-marketing-plan`, `omneky-competitor-analysis`, `omneky-ab-tests`, `omneky-onboarding`, `omneky-agency`.

## Install

1. Install the **Omneky** plugin from the [Cursor Marketplace](https://cursor.com/marketplace), or load this folder locally (see the [repository README](../../README.md#local-testing)).
2. On first use, Cursor opens Omneky sign-in (OAuth) to link your workspace.
3. Ask Cursor to list brands, break down ROAS/CTR, generate an image ad or product video, manage the catalogue, or launch a paused Meta / Google PMax / TikTok campaign.

## MCP

Cursor discovers the hosted server from [`mcp.json`](./mcp.json):

- Name: `omneky`
- Transport: HTTP
- URL: `https://mcp.omneky.com/grok`

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
