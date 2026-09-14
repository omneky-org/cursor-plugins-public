---
name: launch-google-tiktok-ads
description: Launch Omneky ads on Google Performance Max or Demand Gen, plus TikTok, LinkedIn, and Reddit. Use this when the user wants Google ads, PMax, Demand Gen, TikTok ads, LinkedIn ads, or Reddit ads — including pause or budget after launch.
---

# Launch Google, TikTok, LinkedIn, and Reddit ads

Use Omneky MCP tools on `https://mcp.omneky.com/mcp-claude`. Sign-in is the client's OAuth flow. Never ask the user to paste a JWT or API key. Confirm brand, channel, objective, budget, targeting, copy, CTA, and landing URL with `ask_user` before any write. Default new launches to **paused** / disabled unless the user explicitly asks to go live.

Do not skip the targeting pre-call on LinkedIn or TikTok — those APIs return 400 without a location.

## Shared prep

1. Resolve brand: `list_brands` → confirm → `get_brand_details` if you need identity assets. Use `list_brand_products` / `fetch_product_details` when the ad is for a specific product.
2. `get_channel_connection_status` for that channel (`google` | `tiktok` | `linkedin` | `reddit`). Stop if not connected.
3. `get_channel_budget` and `minimum_budget_for_objective` before setting spend.
4. Look up targeting, then call `launch_<channel>_<objective>_ad`.

| Channel | Required pre-call | Notes |
|---|---|---|
| Google PMax | none | Set `link_url`; Google places automatically |
| Google Demand Gen | `google_country_search` | Pass `adset_spec_fragment` values as `targeting_fragments` |
| LinkedIn | `targeting_search(..., types=["locations"])` | Must include a `urn:li:adTargetingFacet:locations` entry |
| TikTok | `get_tiktok_location_ids` | `location_ids` is required on the ad group |
| Reddit | none | Inline `targeting`: `{"geolocations": ["US"], "communities": [...]}` |

Hierarchy is Campaign → Ad Set / asset group → Ad. You can attach to an existing campaign or ad set by passing its id. Creative is never attached to a campaign directly.

If a launch returns `status="needs_user_decision"`, call `ask_user`. Never auto-retry a failed launch. This surface does **not** expose Omneky-managed Meta/OpenAI launches — do not invent those names.

## Google

| Intent | Tool |
| --- | --- |
| Performance Max | `launch_google_performance_max_ad` |
| Demand Gen | `launch_google_demand_gen_ad` |

Status values are `PAUSED` | `ENABLED`. Default `status_on_launch` to `PAUSED`.

**PMax:** assets live on `ad_group_spec` (headlines 3–15, long headlines 1–5, descriptions 2–5, landscape + square images, logos, `link_url`). Pass `ad_specs` as `[]`. Existing campaign: `campaign_spec={"campaign_id": "<id>"}`.

**Demand Gen:** headlines ≤ 40 chars, descriptions ≤ 90; `business_name` and `logo_image_url` required. Existing campaign: `campaign_spec={"campaign_id": "<id>"}` and `ad_group_spec={"ad_group_id": "<id>"}`.

Change Google daily budget with `set_ad_budget` (`channel="google"`, `level="campaign"` only).

## TikTok

`launch_tiktok_conversions_ad`, `launch_tiktok_traffic_ad`, `launch_tiktok_leads_ad`, `launch_tiktok_video_views_ad`. Call `get_tiktok_location_ids(brand_id, campaign_objective)` first (`TRAFFIC`, `CONVERSIONS`, `VIDEO_VIEWS`, `LEAD_GENERATION`). Keep `operation_status` `DISABLE` unless the user asked to go live (`ENABLE`).

## LinkedIn

`launch_linkedin_brand_awareness_ad`, `launch_linkedin_conversions_ad`, `launch_linkedin_engagement_ad`, `launch_linkedin_website_visits_ad`. Hierarchy is Campaign Group (`campaign_spec`) → Campaign (`ad_group_spec`) → Creative. `start_date` is required when creating a new campaign group. Default `status_on_launch` to `PAUSED`.

## Reddit

`launch_reddit_awareness_ad`, `launch_reddit_conversions_ad`, `launch_reddit_leads_ad`, `launch_reddit_traffic_ad`, `launch_reddit_video_views_ad`. Communities without the `r/` prefix. Ad-group daily budget minimum is $5. `bid_value` is microcurrency (dollars × 1,000,000); $5 = `5000000`. Default `configured_status` to `PAUSED`.

## Manage existing ads

- Inspect: `get_campaigns`, `get_ad_groups`, `get_ads`, `get_channel_budget`, `minimum_budget_for_objective`, `get_channel_connection_status`
- Mutate: `set_ad_entity_status`, `set_ad_budget`, `update_ad_targeting` (Facebook targeting overwrite only)
- Delete (irreversible — confirm first): `delete_campaign`, `delete_ad_group`, `delete_ads`
- Persist a chat creative before launch: `register_ad_instance_item`

Need a new image or video creative first? Follow `creative-referral` (`get_creative_generation_help`).
