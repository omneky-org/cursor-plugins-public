---
name: launch-meta-ads
description: Launch and manage Omneky Meta/Facebook ads (sales, traffic, leads, awareness, video views). Use this when the user wants Facebook ads, Meta ads, Instagram ads, pause a Meta campaign, change a Meta budget, or update Meta targeting.
---

# Launch Meta / Facebook ads

Use Omneky MCP tools on `https://mcp.omneky.com/mcp-claude`. Sign-in is the client's OAuth flow. Never ask the user to paste a JWT or API key. Confirm brand, objective, budget, targeting, copy, CTA, and landing URL with `ask_user` before any write. Default every new launch to **paused** unless the user explicitly asks to go live.

## Launch sequence

1. Resolve the brand. If `brand_id` is unknown, call `list_brands` and confirm. Then `get_brand_details` for images, videos, logo, and brand-book copy. Use `list_brand_products` / `fetch_product_details` when the ad is for a specific product.
2. `get_channel_connection_status` with `channel="facebook"`. Stop if Meta is not connected.
3. `get_channel_budget` (`channels="facebook"`) and `minimum_budget_for_objective` before setting spend.
4. Facebook targeting is inline — no pre-call. Use `ad_group_spec.targeting` like `{"countries": ["US"], "age_min": 25, "age_max": 55}`. Countries are ISO codes. For interests/behaviors only, `targeting_search(channel="facebook", types=["interests"]|["behaviors"])`. Never pass `geo_locations` as a search type.
5. Call the matching launch tool.

| User intent | Tool | Objective |
| --- | --- | --- |
| Sales / conversions / ROAS | `launch_facebook_sales_ad` | `OUTCOME_SALES` |
| Website clicks / traffic | `launch_facebook_traffic_ad` | `OUTCOME_TRAFFIC` |
| Lead gen / forms | `launch_facebook_leads_ad` | `OUTCOME_LEADS` |
| Brand awareness / reach | `launch_facebook_awareness_ad` | `OUTCOME_AWARENESS` |
| Video views / ThruPlay | `launch_facebook_video_views_ad` | `OUTCOME_VIDEO_VIEWS` |

Hierarchy is Campaign → Ad Set (`ad_group`) → Ad. Creative lives on the ad (`ad_specs`).

- New campaign + ad set + ads: `name` on `campaign_spec`; `name` + `daily_budget` on `ad_group_spec`.
- Existing campaign: `campaign_spec={"id": "<campaign_id>"}`.
- Existing ad set: also `ad_group_spec={"id": "<ad_set_id>"}` and `adset_id` on each `ad_spec`.

Set `status_on_launch` to `PAUSED` on campaign, ad set, and ads unless the user asked to go live.

This Directory surface does **not** expose Omneky-managed Meta/OpenAI launches. Do not invent those names.

## Manage existing ads

- Inspect: `get_campaigns`, `get_ad_groups`, `get_ads`, `get_channel_budget`, `minimum_budget_for_objective`, `get_channel_connection_status`
- Mutate: `set_ad_entity_status` (`channel="facebook"`, `level` = `campaign`|`ad_group`|`ad`, `status` = `PAUSED`|`ACTIVE`); `set_ad_budget` (CBO → `level="campaign"`, ABO → `level="ad_group"`); `update_ad_targeting` (Facebook only; **overwrites** the audience)
- Delete (irreversible — confirm first): `delete_campaign`, `delete_ad_group`, `delete_ads`
- Persist a chat creative before launch: `register_ad_instance_item`
- Missing input / `needs_user_decision`: `ask_user`. Never auto-retry a failed launch.

## Gotchas

- Facebook lead ads: set `lead_gen_form_id` on ad specs for native forms.
- Prefer pause over delete.

Need a new image or video creative first? This surface has no generate/edit tools — follow `creative-referral` (`get_creative_generation_help`).
