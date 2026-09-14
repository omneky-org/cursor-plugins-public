---
name: launch-google-tiktok-ads
description: Launch Google Performance Max or Demand Gen, plus TikTok, LinkedIn, and Reddit ads. Use this when the user wants Google ads, PMax, Demand Gen, TikTok ads, LinkedIn ads, or Reddit ads — including pause/budget after launch.
---

# Launch Google, TikTok, LinkedIn, and Reddit ads

Use Omneky MCP tools. Confirm brand, channel, objective, budget, targeting, copy, CTA, and landing URL with `ask_user` before any write. Default new launches to **paused** / disabled unless the user explicitly asks to go live.

## Shared prep

1. Resolve brand: `list_brands` → confirm → `get_brand_details` if you need identity assets.
2. `get_channel_connection_status` for that channel (`google` | `tiktok` | `linkedin` | `reddit`). Stop if not connected.
3. `get_channel_budget` and `minimum_budget_for_objective` before setting spend.
4. Hierarchy is Campaign → Ad Set / asset group → Ad. You can attach to an **existing** campaign or ad set by passing its id in the spec (see each channel). Creative is never attached to a campaign directly.

If a launch returns `status="needs_user_decision"`, call `ask_user`. Never auto-retry a failed launch.

## Google

| Intent | Tool |
| --- | --- |
| Performance Max (Search + Display + YouTube + Gmail) | `launch_google_performance_max_ad` |
| Demand Gen (YouTube / Discover / Gmail image or video) | `launch_google_demand_gen_ad` |

Status values are `PAUSED` | `ENABLED`. Default `status_on_launch` to `PAUSED` unless the user asked to go live.

**PMax:** assets live on `ad_group_spec` (headlines 3–15, long headlines 1–5, descriptions 2–5, landscape + square images, logos, `link_url`). Pass `ad_specs` as `[]`. Existing campaign: `campaign_spec={"campaign_id": "<id>"}`. Existing asset group: also set `ad_group_id`.

**Demand Gen:** geo via `google_country_search` → pass results as `ad_group_spec.targeting_fragments`. Existing campaign: `campaign_spec={"campaign_id": "<id>"}` and `ad_group_spec={"ad_group_id": "<id>"}`; set `ad_group_id` on each `ad_spec`. Headlines ≤ 40 chars, descriptions ≤ 90; `business_name` and `logo_image_url` required.

Change Google daily budget with `set_ad_budget` (`channel="google"`, `level="campaign"` only).

## TikTok

| Intent | Tool |
| --- | --- |
| Conversions | `launch_tiktok_conversions_ad` |
| Traffic / clicks | `launch_tiktok_traffic_ad` |
| Leads | `launch_tiktok_leads_ad` |
| Video views | `launch_tiktok_video_views_ad` |

`location_ids` on `ad_group_spec` are **required** — call `get_tiktok_location_ids(brand_id, campaign_objective)` first (`TRAFFIC`, `CONVERSIONS`, `VIDEO_VIEWS`, or `LEAD_GENERATION`). Campaign `operation_status` defaults to `DISABLE`; keep it disabled unless the user asked to go live (`ENABLE`).

## LinkedIn

| Intent | Tool |
| --- | --- |
| Brand awareness | `launch_linkedin_brand_awareness_ad` |
| Website conversions | `launch_linkedin_conversions_ad` |
| Engagement | `launch_linkedin_engagement_ad` |
| Website visits | `launch_linkedin_website_visits_ad` |

Locations are required: `targeting_search(channel="linkedin", types=["locations"], query=...)`. Build `ad_group_spec.targeting_criteria` from the returned URNs (AND-of-ORs). LinkedIn hierarchy is Campaign Group (`campaign_spec`) → Campaign (`ad_group_spec`) → Creative (`ad_specs`). Default `status_on_launch` to `PAUSED`.

## Reddit

| Intent | Tool |
| --- | --- |
| Awareness / impressions | `launch_reddit_awareness_ad` |
| Conversions | `launch_reddit_conversions_ad` |
| Leads | `launch_reddit_leads_ad` |
| Traffic / clicks | `launch_reddit_traffic_ad` |
| Video views | `launch_reddit_video_views_ad` |

Targeting is inline: `geolocations` (ISO), `communities` (no `r/` prefix), interests, keywords, `age_ranges`. Ad-group daily budget minimum is $5. Default `configured_status` to `PAUSED`.

## Pause / budget / targeting after launch

- `set_ad_entity_status` — pause/resume. Live connector supports `channel="facebook"` (and `openai`). For Google / TikTok / LinkedIn / Reddit, prefer launching paused and only enabling when asked; do not invent a pause tool those channels do not expose here.
- `set_ad_budget` — `facebook` (campaign or ad set) and `google` (campaign only).
- `update_ad_targeting` — `facebook` only; overwrites the ad set.
