---
name: launch-meta-ads
description: Use this when the user wants to launch or create Facebook ads, Meta ads, or Instagram ads (sales, conversions, ROAS, traffic, clicks, lead gen forms, brand awareness, reach, video views) or attach new creatives to an existing Meta campaign or ad set, including an Omneky-managed launch when the brand has no Meta ad account.
---

# Launch Meta / Facebook ads

Use Omneky MCP tools on `https://mcp.omneky.com/mcp-claude`. Sign-in is the client's OAuth flow. Never ask the user to paste a JWT or API key. Launches are marked destructive on the server, so Claude's host asks the user to confirm before each one; show one summary (brand, objective, budget, targeting, copy, CTA, landing URL, creative, live or paused) and then call the tool.

## When to use

User phrasing: launch Facebook ads, create a Meta campaign, Instagram ads, sales/conversions/ROAS, traffic/clicks, lead gen forms, brand awareness/reach, video views, add ads to an existing Meta campaign or ad set, run ads without a Meta account.

## When not to use

| User wants | Use instead |
| --- | --- |
| Pause, resume, change budget, retarget, list, or delete **live** entities | `manage-ads` |
| Is Meta connected / connect it / min budget / which brand | `getting-started` or `brand-setup` |
| Google, TikTok, LinkedIn, Reddit, Pinterest, X Ads, OpenAI Ads | `launch-google-tiktok-ads` |
| ROAS / CTR / which ads are winning | `roas-breakdown` |
| Generate or edit a creative first | `creative-referral` |

## Tool

One tool, `launch_meta_ad`, with `objective`:

| User intent | `objective` |
| --- | --- |
| Sales / conversions / ROAS | `sales` |
| Website clicks / traffic | `traffic` |
| Lead gen / forms | `leads` |
| Brand awareness / reach | `awareness` |
| Video views | `video_views` |

Prep: `list_brands` → `get_brand_details` (images, videos, logo, brand-book copy) → `list_brand_products` / `get_product_details` when product-specific → `get_channel_connection_status` (`channel="facebook"`) → `minimum_budget_for_objective`. Interests or behaviors: `search_ad_targeting` (`channel="facebook"`, `types=["interests"]` or `["behaviors"]`). Never pass `geo_locations` as a search type.

The creative must be a finished HTTPS image or video URL the user already has. If there is none, use `creative-referral`.

## Launch

1. Facebook targeting is inline, with no geo pre-call. Use `ad_group_spec.targeting` like `{"countries": ["US"], "age_min": 25, "age_max": 55}`. Countries are ISO codes.
2. Call `launch_meta_ad` with the objective.

Hierarchy is Campaign → Ad Set (`ad_group`) → Ad. Creative lives on the ad (`ad_specs`).

- New campaign + ad set + ads: `name` on `campaign_spec`; `name` + `daily_budget` on `ad_group_spec`.
- Existing campaign: `campaign_spec={"id": "<campaign_id>"}`.
- Existing ad set: also `ad_group_spec={"id": "<ad_set_id>"}` and `adset_id` on each `ad_spec`.

Live or paused (`campaign_spec.status_on_launch`) follows what the user asked; the server adds no default.

Lead ads: set `lead_gen_form_id` on ad specs for native forms.

## No Meta ad account

`launch_meta_ad` with `account="omneky_managed"` runs on Omneky's managed account. Objectives `traffic`, `video_views` and `awareness` only. Do not pass a landing-page URL in ad specs, a pixel or a lead form. `status=payment_required` means nothing launched: tell the user the amount and that payment happens in the Omneky app.

If a launch returns `status="needs_user_decision"`, fill the missing detail and call again, or ask in chat if you cannot. Never auto-retry a failed launch. After launch, pause/budget/targeting/delete belong in `manage-ads`.
