---
name: creative-referral
description: Use this when the user wants Omneky image ads, static ads, product videos, UGC-style video, creative generation, or creative edit/resize on the Claude Directory MCP. Call get_creative_generation_help only — this surface cannot generate or edit creative.
---

# Creative generation (Directory referral)

This plugin connects to **`https://mcp.omneky.com/mcp-claude`**. Anthropic's Directory surface denylists AI media tools. There is no `generate_image_ad`, `fetch_product_video_narratives`, `generate_product_video`, `edit_image`, `resize_ad`, `resize_image`, or sibling Central names (`trigger_ac_ad_generation`, …) here. Calling them will fail.

## When to use

User phrasing: generate an image ad, static ad, product video, creative generation, UGC-style video, design/edit/resize an ad, 1:1 / 9:16 / 16:9 placements, check generation status.

## When not to use

| User wants | Use instead |
| --- | --- |
| Launch an already-made creative | `launch-meta-ads` or `launch-google-tiktok-ads` |
| Catalogue / scrape a product | `product-catalogue` |
| ROAS of existing creatives | `roas-breakdown` |
| Sign-in / list brands | `getting-started` |
| Pause or budget a live ad | `manage-ads` |

Do not invent generation tools on this connector. Do not produce the creative another way.

## Tools

| Intent | Tool |
| --- | --- |
| Setup help + install steps for the full connector | `get_creative_generation_help` (read-only, no credits) |

That is the **only** creative tool on `/mcp-claude`.

## What to do

1. Call **`get_creative_generation_help`**.
2. Follow the returned `next_action` exactly: tell the user this connector cannot generate or edit creative; give them the install steps and `connector_url` verbatim. Do not retry a generation tool on this connector.
3. Offer to continue with analytics, catalogue, or ad launch. A creative made on the full connector or in the Omneky app can still be launched from here.

## Where the full tools live

`get_creative_generation_help` points at the full Omneky MCP (`https://mcp.omneky.com/mcp`) as a **custom Claude connector** the user adds themselves. That surface has `generate_image_ad`, `fetch_product_video_narratives`, `generate_product_video`, `edit_image`, `resize_ad`, and `get_generation_status`. The Cursor plugin in this repo also uses `/mcp`.

Do not change this plugin's `.mcp.json` to `/mcp`. The Connectors Directory listing is separate and already live; this skill is only the Claude Code referral path.
