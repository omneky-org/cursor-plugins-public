---
name: launch-meta-ads
description: Use this when the user wants to launch or create Facebook ads, Meta ads, or Instagram ads — sales, conversions, ROAS, traffic, clicks, lead gen, forms, brand awareness, reach, video views, or ThruPlay — or attach new creatives to an existing Meta campaign or ad set.
---

# Launch Meta / Facebook ads

Use Omneky MCP tools. Confirm brand, objective, budget, targeting, copy, CTA, and landing URL with `request_user_decision` (alias `ask_user`) before any write. Default every new launch to **paused** unless the user explicitly asks to go live.

## When to use

User phrasing: launch Facebook ads, create a Meta campaign, Instagram ads, sales/conversions/ROAS, traffic/clicks, lead gen forms, brand awareness/reach, video views/ThruPlay, add ads to an existing Meta campaign or ad set.

## When not to use

| User wants | Use instead |
| --- | --- |
| Pause, resume, change budget, retarget, list, or delete **live** entities | `manage-ads` |
| Is Meta connected / min budget / which brand | `getting-started` |
| Google PMax, Demand Gen, TikTok, LinkedIn, Reddit | `launch-google-tiktok-ads` |
| ROAS / CTR / which ads are winning | `roas-breakdown` |
| Generate or edit a creative first | `creative-generation` |

## Tools

| User intent | Tool | Objective |
| --- | --- | --- |
| Sales / conversions / ROAS | `launch_facebook_sales_ad` | `OUTCOME_SALES` |
| Website clicks / traffic | `launch_facebook_traffic_ad` | `OUTCOME_TRAFFIC` |
| Lead gen / forms | `launch_facebook_leads_ad` | `OUTCOME_LEADS` |
| Brand awareness / reach | `launch_facebook_awareness_ad` | `OUTCOME_AWARENESS` |
| Video views / ThruPlay | `launch_facebook_video_views_ad` | `OUTCOME_VIDEO_VIEWS` |

Prep: `list_brands` → `get_brand_details` (logo, colors, `company_id`) → `list_brand_products` / `get_product_details` (alias `fetch_product_details`) when product-specific → `get_channel_connection_status(channel="facebook")` → `get_channel_budget` + `minimum_budget_for_objective`. Interests/behaviors: `search_ad_targeting` (alias `targeting_search`) (`channel="facebook"`, `types=["interests"]|["behaviors"]`). Never pass `geo_locations` as a search type.

This surface does **not** expose Omneky-managed Meta/OpenAI launches. Do not invent those names.

## Launch

Hierarchy is Campaign → Ad Set (`ad_group`) → Ad. Creative lives on the ad (`ad_specs`), never on the campaign.

- New campaign + ad set + ads: pass `name` on `campaign_spec` and `name` + `daily_budget` on `ad_group_spec`.
- Add an ad set under an existing campaign: `campaign_spec={"id": "<campaign_id>"}`.
- Add ads to an existing ad set: also pass `ad_group_spec={"id": "<ad_set_id>"}` and set `adset_id` on each `ad_spec`.

Facebook lead ads: set `lead_gen_form_id` on ad specs for native forms.

Set `status_on_launch` to `PAUSED` on campaign, ad set, and ads unless the user asked to go live. Facebook tool defaults are not safe to trust for this.

Meta targeting is inline on `ad_group_spec`: `{countries: ["US"], age_min, age_max, ...}`. Countries are ISO codes — do not call `search_ad_targeting` (alias `targeting_search`) for countries.

If a launch returns `status="needs_user_decision"`, call `request_user_decision` (alias `ask_user`) with the remediations. Never auto-retry a failed launch.

After launch, pause/budget/targeting writes belong in `manage-ads` (`set_ad_status` (alias `set_ad_entity_status`), `set_ad_budget`, `update_ad_targeting`).
