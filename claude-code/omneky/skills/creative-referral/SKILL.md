---
name: creative-referral
description: Explain how to generate image ads and product videos when on the Claude Directory MCP. Use this when the user wants an image ad, product video, creative generation, edit an ad, resize an ad, or check generation status.
---

# Creative generation (Directory referral)

This Claude Code plugin connects to **`https://mcp.omneky.com/mcp-claude`** — the Directory-safe surface. It does **not** expose AI creative generation or edit tools.

Do **not** call `generate_image_ad`, `fetch_product_video_narratives`, `generate_product_video`, `edit_image`, `resize_ad`, or `get_generation_status` on this connector. Those tools are not on `/mcp-claude`. Inventing them will fail.

## What to do on `/mcp-claude`

1. Call **`get_creative_generation_help`** and follow its returned guidance.
2. Tell the user this Directory plugin can still list brands, manage the product catalogue, report ROAS/CTR, and launch/pause campaigns — but it cannot render or edit creatives here.

## Where the full tools live

The full Omneky MCP at **`https://mcp.omneky.com/mcp`** (Cursor plugin in this repo: `plugins/omneky`) includes:

- `generate_image_ad` — net-new static image ads
- `fetch_product_video_narratives` + `generate_product_video` — multi-scene product videos
- `edit_image` / `resize_ad` — edit or re-aspect a finished ad
- `get_generation_status` — single status peek for a `job_id`

Point the user at that full connector (or the Cursor Marketplace Omneky plugin) when they need those writes. Do not retarget this plugin's `.mcp.json` to `/mcp`.

The Claude Connectors Directory listing is separate and already published; this skill is only the Claude Code referral path.
