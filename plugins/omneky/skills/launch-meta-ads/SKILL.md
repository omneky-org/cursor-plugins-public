---
name: launch-meta-ads
description: Use this when the user wants Facebook ads, Meta ads, Instagram ads, or to launch, pause, resume, budget, or retarget a Meta/Facebook paid-media campaign — sales, conversions, ROAS, traffic, clicks, lead gen, forms, brand awareness, reach, video views, or ThruPlay. Also use when attaching creatives to an existing Meta campaign or ad set.
---

# Launch Meta / Facebook ads

Use Omneky MCP tools. Confirm brand, objective, budget, targeting, copy, CTA, and landing URL with `ask_user` before any write. Default every new launch to **paused** unless the user explicitly asks to go live.

## When to use

User phrasing that should load this skill: Facebook ads, Meta ads, Instagram ads, launch a Meta campaign, pause/resume a Facebook ad set, change a Meta budget (CBO/ABO), update targeting/interests/behaviors, sales/conversions/ROAS, traffic/clicks, lead gen forms, brand awareness/reach, video views/ThruPlay, attach a creative to an existing Meta campaign.

## Resolve brand and connection

1. If `brand_id` is unknown, call `list_brands`, then confirm the brand. Call `get_brand_details` when you need logo, colors, copy, or `company_id`.
2. Call `get_channel_connection_status` with `channel="facebook"`. Stop and tell the user if Meta is not connected.
3. Call `get_channel_budget` with `channels="facebook"` and `minimum_budget_for_objective` (channel `facebook`, objective matching the launch tool) before setting spend.

## Pick the launch tool

| User intent | Tool | Objective |
| --- | --- | --- |
| Sales / conversions / ROAS | `launch_facebook_sales_ad` | `OUTCOME_SALES` |
| Website clicks / traffic | `launch_facebook_traffic_ad` | `OUTCOME_TRAFFIC` |
| Lead gen / forms | `launch_facebook_leads_ad` | `OUTCOME_LEADS` |
| Brand awareness / reach | `launch_facebook_awareness_ad` | `OUTCOME_AWARENESS` |
| Video views / ThruPlay | `launch_facebook_video_views_ad` | `OUTCOME_VIDEO_VIEWS` |

Hierarchy is Campaign → Ad Set (`ad_group`) → Ad. Creative lives on the ad (`ad_specs`), never on the campaign.

- New campaign + ad set + ads: pass `name` on `campaign_spec` and `name` + `daily_budget` on `ad_group_spec`.
- Add an ad set under an existing campaign: `campaign_spec={"id": "<campaign_id>"}`.
- Add ads to an existing ad set: also pass `ad_group_spec={"id": "<ad_set_id>"}` and set `adset_id` on each `ad_spec`.

Set `status_on_launch` to `PAUSED` on campaign, ad set, and ads unless the user asked to go live. Facebook tool defaults are not safe to trust for this.

## Targeting

Meta takes a targeting dict inline on `ad_group_spec`: `{countries: ["US"], age_min, age_max, ...}`. Countries are ISO codes — do not call `targeting_search` for countries.

For interests or behaviors, call `targeting_search` with `channel="facebook"` and `types` such as `["interests"]` or `["behaviors"]`. Never pass `geo_locations` as a search type.

## After launch / manage live entities

- Pause or resume: `set_ad_entity_status` (`channel="facebook"`, `level` = `campaign` | `ad_group` | `ad`, `status` = `PAUSED` | `ACTIVE`). Prefer pause over delete. Pausing a campaign or ad set stops everything beneath it.
- Change daily budget: `set_ad_budget` (`channel="facebook"`). Use `level="campaign"` for CBO, `level="ad_group"` for ABO. If the platform rejects the level, retry the other.
- Replace ad-set targeting: `update_ad_targeting` (`channel="facebook"`). This **overwrites** the audience — send the full spec you want.

If a launch returns `status="needs_user_decision"`, call `ask_user` with the remediations. Never auto-retry a failed launch.
