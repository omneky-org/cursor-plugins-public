---
name: launch-meta-ads
description: Use this when the user wants to launch or create Facebook ads, Meta ads, or Instagram ads — sales, conversions, ROAS, traffic, clicks, lead gen, forms, brand awareness, reach, video views, or ThruPlay — or attach new creatives to an existing Meta campaign or ad set.
---

# Launch Meta / Facebook ads

Use Omneky MCP tools on `https://mcp.omneky.com/mcp-claude`. Sign-in is the client's OAuth flow. Never ask the user to paste a JWT or API key. Confirm brand, objective, budget, targeting, copy, CTA, and landing URL with `ask_user` before any write. Default every new launch to **paused** unless the user explicitly asks to go live.

## When to use

User phrasing: launch Facebook ads, create a Meta campaign, Instagram ads, sales/conversions/ROAS, traffic/clicks, lead gen forms, brand awareness/reach, video views/ThruPlay, add ads to an existing Meta campaign or ad set.

## When not to use

| User wants | Use instead |
| --- | --- |
| Pause, resume, change budget, retarget, list, or delete **live** entities | `manage-ads` |
| Is Meta connected / min budget / which brand | `getting-started` |
| Google PMax, Demand Gen, TikTok, LinkedIn, Reddit | `launch-google-tiktok-ads` |
| ROAS / CTR / which ads are winning | `roas-breakdown` |
| Generate or edit a creative first | `creative-referral` (`get_creative_generation_help` only) |

## Tools

| User intent | Tool | Objective |
| --- | --- | --- |
| Sales / conversions / ROAS | `launch_facebook_sales_ad` | `OUTCOME_SALES` |
| Website clicks / traffic | `launch_facebook_traffic_ad` | `OUTCOME_TRAFFIC` |
| Lead gen / forms | `launch_facebook_leads_ad` | `OUTCOME_LEADS` |
| Brand awareness / reach | `launch_facebook_awareness_ad` | `OUTCOME_AWARENESS` |
| Video views / ThruPlay | `launch_facebook_video_views_ad` | `OUTCOME_VIDEO_VIEWS` |

Prep: `list_brands` → `get_brand_details` (images, videos, logo, brand-book copy) → `list_brand_products` / `fetch_product_details` when product-specific → `get_channel_connection_status(channel="facebook")` → `get_channel_budget` + `minimum_budget_for_objective`. Interests/behaviors: `targeting_search(channel="facebook", types=["interests"]|["behaviors"])`. Never pass `geo_locations` as a search type.

This Directory surface does **not** expose Omneky-managed Meta/OpenAI launches. Do not invent those names.

## Launch

1. Facebook targeting is inline — no geo pre-call. Use `ad_group_spec.targeting` like `{"countries": ["US"], "age_min": 25, "age_max": 55}`. Countries are ISO codes.
2. Call the matching launch tool.

Hierarchy is Campaign → Ad Set (`ad_group`) → Ad. Creative lives on the ad (`ad_specs`).

- New campaign + ad set + ads: `name` on `campaign_spec`; `name` + `daily_budget` on `ad_group_spec`.
- Existing campaign: `campaign_spec={"id": "<campaign_id>"}`.
- Existing ad set: also `ad_group_spec={"id": "<ad_set_id>"}` and `adset_id` on each `ad_spec`.

Set `status_on_launch` to `PAUSED` on campaign, ad set, and ads unless the user asked to go live.

Facebook lead ads: set `lead_gen_form_id` on ad specs for native forms.

If a launch returns `status="needs_user_decision"`, call `ask_user`. Never auto-retry a failed launch.

After launch, pause/budget/targeting/delete belong in `manage-ads`.
