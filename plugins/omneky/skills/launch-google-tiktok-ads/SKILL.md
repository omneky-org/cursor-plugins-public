---
name: launch-google-tiktok-ads
description: Use this when the user wants to launch Google ads, Performance Max, PMax, Demand Gen, YouTube, Discover, TikTok ads, LinkedIn ads, or Reddit ads — conversions, traffic, leads, video views, awareness, website visits, or engagement — including attaching to an existing campaign on those channels.
---

# Launch Google, TikTok, LinkedIn, and Reddit ads

Use Omneky MCP tools. Confirm brand, channel, objective, budget, targeting, copy, CTA, and landing URL with `request_user_decision` (alias `ask_user`) before any write. Default new launches to **paused** / disabled unless the user explicitly asks to go live.

Do not skip the targeting pre-call on LinkedIn or TikTok — those APIs return 400 without a location.

## When to use

User phrasing: Google ads, Performance Max / PMax, Demand Gen, YouTube / Discover / Gmail, TikTok ads (conversions, traffic, leads, video views), LinkedIn ads (awareness, website visits, conversions, engagement), Reddit ads (awareness, traffic, conversions, leads, video views), attach to an existing PMax or TikTok campaign.

## When not to use

| User wants | Use instead |
| --- | --- |
| Meta / Facebook / Instagram launch | `launch-meta-ads` |
| Pause, resume, budget, retarget, or delete **live** entities | `manage-ads` |
| Is Google/TikTok/LinkedIn/Reddit connected | `getting-started` |
| ROAS / CTR / which ads are winning | `roas-breakdown` |
| Generate or edit a creative first | `creative-generation` |

## Shared prep

1. Resolve brand: `list_brands` → confirm → `get_brand_details` if you need identity assets.
2. `get_channel_connection_status` for that channel (`google` \| `tiktok` \| `linkedin` \| `reddit`). Stop if not connected.
3. `get_channel_budget` and `minimum_budget_for_objective` before setting spend.
4. Look up targeting, then call `launch_<channel>_<objective>_ad`.

| Channel | Required pre-call | Notes |
|---|---|---|
| Google PMax | none | Set `link_url`; Google places automatically |
| Google Demand Gen | `search_google_countries` (alias `google_country_search`) | Pass `adset_spec_fragment` values as `targeting_fragments` |
| LinkedIn | `search_ad_targeting` (alias `targeting_search`) (`..., types=["locations"]`) | Must include a `urn:li:adTargetingFacet:locations` entry |
| TikTok | `get_tiktok_location_ids` | `location_ids` is required on the ad group |
| Reddit | none | Inline `targeting`: `{"geolocations": ["US"], "communities": [...]}` |

Hierarchy is Campaign → Ad Set / asset group → Ad. Attach to an **existing** campaign or ad set by passing its id. Creative is never attached to a campaign directly.

If a launch returns `status="needs_user_decision"`, call `request_user_decision` (alias `ask_user`). Never auto-retry a failed launch. This surface does **not** expose Omneky-managed Meta/OpenAI launches — do not invent those names.

## Tools by channel

### Google

| Intent | Tool |
| --- | --- |
| Performance Max (Search + Display + YouTube + Gmail) | `launch_google_performance_max_ad` |
| Demand Gen (YouTube / Discover / Gmail image or video) | `launch_google_demand_gen_ad` |

Status values are `PAUSED` \| `ENABLED`. Default `status_on_launch` to `PAUSED` unless the user asked to go live.

**PMax:** assets live on `ad_group_spec` (headlines 3–15, long headlines 1–5, descriptions 2–5, landscape + square images, logos, `link_url`). Pass `ad_specs` as `[]`. Existing campaign: `campaign_spec={"campaign_id": "<id>"}`. Existing asset group: also set `ad_group_id`.

**Demand Gen:** geo via `search_google_countries` (alias `google_country_search`) → pass results as `ad_group_spec.targeting_fragments`. Existing campaign: `campaign_spec={"campaign_id": "<id>"}` and `ad_group_spec={"ad_group_id": "<id>"}`; set `ad_group_id` on each `ad_spec`. Headlines ≤ 40 chars, descriptions ≤ 90; `business_name` and `logo_image_url` required.

### TikTok

| Intent | Tool |
| --- | --- |
| Conversions | `launch_tiktok_conversions_ad` |
| Traffic / clicks | `launch_tiktok_traffic_ad` |
| Leads | `launch_tiktok_leads_ad` |
| Video views | `launch_tiktok_video_views_ad` |

`location_ids` on `ad_group_spec` are **required** — call `get_tiktok_location_ids(brand_id, campaign_objective)` first (`TRAFFIC`, `CONVERSIONS`, `VIDEO_VIEWS`, or `LEAD_GENERATION`). Campaign `operation_status` defaults to `DISABLE`; keep it disabled unless the user asked to go live (`ENABLE`).

### LinkedIn

| Intent | Tool |
| --- | --- |
| Brand awareness | `launch_linkedin_brand_awareness_ad` |
| Website conversions | `launch_linkedin_conversions_ad` |
| Engagement | `launch_linkedin_engagement_ad` |
| Website visits | `launch_linkedin_website_visits_ad` |

Locations are required: `search_ad_targeting` (alias `targeting_search`) (`channel="linkedin"`, `types=["locations"]`, `query=...`). Build `ad_group_spec.targeting_criteria` from the returned URNs (AND-of-ORs). Hierarchy is Campaign Group (`campaign_spec`) → Campaign (`ad_group_spec`) → Creative (`ad_specs`). `start_date` is required when creating a new campaign group. Default `status_on_launch` to `PAUSED`.

### Reddit

| Intent | Tool |
| --- | --- |
| Awareness / impressions | `launch_reddit_awareness_ad` |
| Conversions | `launch_reddit_conversions_ad` |
| Leads | `launch_reddit_leads_ad` |
| Traffic / clicks | `launch_reddit_traffic_ad` |
| Video views | `launch_reddit_video_views_ad` |

Targeting is inline: `geolocations` (ISO), `communities` (no `r/` prefix), interests, keywords, `age_ranges`. Ad-group daily budget minimum is $5. `bid_value` is microcurrency (dollars × 1,000,000); $5 = `5000000`. Default `configured_status` to `PAUSED`.

After launch, budget/status writes belong in `manage-ads` (`set_ad_budget` for Google campaign-level; `set_ad_status` (alias `set_ad_entity_status`) is Facebook-only on this connector).
