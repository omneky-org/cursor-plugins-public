---
name: launch-google-tiktok-ads
description: Use this when the user wants to launch Google ads (Performance Max, PMax, Demand Gen, YouTube, Discover), TikTok ads, LinkedIn ads, Reddit ads, Pinterest ads, X Ads (Twitter) or OpenAI Ads (conversions, traffic, leads, video views, awareness, website visits, engagement, followers, clicks), including attaching to an existing campaign on those channels.
---

# Launch Google, TikTok, LinkedIn, Reddit, Pinterest, X and OpenAI ads

Use Omneky MCP tools on `https://mcp.omneky.com/mcp-claude`. Sign-in is the client's OAuth flow. Never ask the user to paste a JWT or API key. Launches are marked destructive on the server, so Claude's host asks the user to confirm before each one; show one summary (brand, channel, objective, budget, targeting, copy, CTA, landing URL, creative, live or paused) and then call the tool.

Do not skip the targeting pre-call on LinkedIn or TikTok. Those APIs return 400 without a location.

## When to use

User phrasing: Google ads, Performance Max / PMax, Demand Gen, YouTube / Discover, TikTok ads, LinkedIn ads, Reddit ads, Pinterest ads, X or Twitter ads, ChatGPT / OpenAI ads, attach to an existing campaign on one of those channels.

## When not to use

| User wants | Use instead |
| --- | --- |
| Meta / Facebook / Instagram launch | `launch-meta-ads` |
| Pause, resume, budget, retarget, or delete **live** entities | `manage-ads` |
| Is a channel connected / connect it | `getting-started` or `brand-setup` |
| ROAS / CTR / which ads are winning | `roas-breakdown` |
| Generate or edit a creative first | `creative-referral` |

## Shared prep

1. Resolve the brand: `list_brands`, ask which in chat if several, `get_brand_details` for identity assets. Use `list_brand_products` / `get_product_details` when the ad is for a specific product.
2. `get_channel_connection_status` for that channel (X Ads is `twitter`; Pinterest also has `get_pinterest_connection_status`). Stop if not connected and hand off to `brand-setup`.
3. `minimum_budget_for_objective` before setting spend. Do not launch under the floor.
4. Run the channel's targeting pre-call, then call its launch tool with `objective`.

| Channel | Tool and `objective` | Required pre-call / rules |
|---|---|---|
| Google PMax | `launch_google_ad`, `performance_max` | None. `ad_specs: []`; images and `link_url` on `ad_group_spec`; at least 3 headlines and 2 descriptions for a new asset group; distinct square image and logo |
| Google Demand Gen | `launch_google_ad`, `demand_gen` | `search_google_countries` (`brand_id`, `query`); pass each `adset_spec_fragment` as `targeting_fragments`. Each ad needs `business_name` and `logo_image_url` |
| TikTok | `launch_tiktok_ad`, `traffic` / `leads` / `video_views` / `conversions` | `get_tiktok_location_ids` with `brand_id` and `campaign_objective` (`TRAFFIC`, `LEADS`, `VIDEO_VIEWS`, `CONVERSIONS`); put the ids on the ad group as `location_ids` |
| LinkedIn | `launch_linkedin_ad`, `brand_awareness` / `website_visits` / `conversions` / `engagement` | `search_ad_targeting` (`channel="linkedin"`, `types=["locations"]`); copy a `urn:li:adTargetingFacet:locations` value into `targeting_criteria`. New campaign group needs `start_date` |
| Reddit | `launch_reddit_ad`, `awareness` / `traffic` / `conversions` / `leads` / `video_views` | None. Inline `{"geolocations": ["US"], "communities": [...]}`, communities without `r/`. `bid_value` is micros (dollars × 1,000,000) |
| Pinterest | `launch_pinterest_ad`, `awareness` / `traffic` / `sales` / `leads` / `video_views` | Inline `{"countries": ["US"]}`. Pin `title` ≤100 characters; `destination_url` required |
| X Ads | `launch_x_ad`, `awareness` / `traffic` / `engagements` / `followers` / `video_views` | Optional `search_ad_targeting` (`channel="twitter"`); omit targeting for US. `bid_amount` is dollars and is omitted when `bid_strategy` is `AUTO`. Headline ≤280 characters |
| OpenAI Ads | `launch_openai_ad`, `clicks` / `impressions` | Optional `openai_location_search`. Image chat card only; title 3 to 50 characters, body ≤100; `destination_url` required; new ad groups need `max_bid_dollars`. No connected account: `account="omneky_managed"` |

Hierarchy is Campaign → Ad Set / asset group → Ad. Attach to an existing campaign or ad set by passing its id. Creative is never attached to a campaign directly, and it must be a finished HTTPS asset URL the user already has.

Live or paused (`campaign_spec.status_on_launch`) follows what the user asked; the server adds no default.

If a launch returns `status="needs_user_decision"`, fill the missing detail and call again, or ask in chat if you cannot. A managed launch that returns `status=payment_required` launched nothing; payment happens in the Omneky app. Never auto-retry a failed launch.

After launch, inspect/mutate/delete belong in `manage-ads`.
