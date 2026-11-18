---
name: roas-breakdown
description: Use this when the user asks which paid-media ads, campaigns, or channels are winning or losing: ROAS, CTR, CPC, CPA, spend, impressions, conversions, day-by-day trends, WoW/MoM movers, or a creative/campaign/channel leaderboard.
---

# ROAS / CTR / spend breakdown

Read-only reporting on `https://mcp.omneky.com/mcp-claude`. Auth is the client's OAuth flow; never ask for a token. Never invent metrics.

## When to use

User phrasing: ROAS, CTR, CPC, CPA, spend, impressions, conversions, which ads/creatives/campaigns/channels are winning or losing, leaderboard, day-by-day chart, WoW/MoM movers, trending, performance report, paid-media analytics.

## When not to use

| User wants | Use instead |
| --- | --- |
| Launch a new campaign | `launch-meta-ads` or `launch-google-tiktok-ads` |
| Pause / budget / targeting on live ads | `manage-ads` |
| List brands / is data imported / is a channel connected | `getting-started` |
| Product catalogue | `product-catalogue` |
| Generate a creative | `creative-referral` |
| A full weekly review with proposed changes | `weekly-ad-review` |
| Find and replace tired ads | `creative-refresh` |

## Tools

| Question | Tool |
| --- | --- |
| Ranked breakdown / leaderboard (creative, campaign, channel, ad, …) | `get_performance_breakdown` |
| Day-by-day time series / charts | `get_daily_metrics` |
| What rose or fell vs the prior window | `get_performance_movers` |
| Turn a human campaign/ad name into a filter value | `search_reporting_values` |
| What to try next from historical performance | `get_recommendations` |
| Allocated daily budget per channel (not spend) | `get_channel_budget` |
| Confirm imported data | `check_reporting_data_available` |

## Start here

1. `list_brands` / `get_brand` / `get_brand_details`: confirm which brand. Do not guess `brand_id`. The server reads the user from the signed-in session; never pass or ask for a user id.
2. `check_reporting_data_available`: confirm the brand has imported data (and which dates/channels) before querying.

## Rules

- Stay on these structured tools. There is no public SQL tool, so do not invent `run_sql_query` or warehouse table names.
- Do not invent score / lift endpoints. They are not on this surface.
- `get_performance_breakdown` needs `brand_id`, `date_range` (`["YYYY-MM-DD", "YYYY-MM-DD"]`), `dimension`, `results_per_page`, `sort_metric`, `sort_order`. Pass `filters` as `[]` when unscoped, never null, and never a redundant `{dimension: "brand"}` filter.
- Common dimensions: `creative`, `campaign`, `channel`, `ad`, `ad_group`. Sort by `ROAS`, `CLICK_THROUGH_RATE`, or `SPEND` as asked.
- `get_performance_movers` needs `brand_id`, `dimension`, `metric`, `end_date`. Optional `period_days` (default 7).
- `selected_conversion_metric_value` is the brand's configured goal and **varies per channel**. Never sum it across channels; group by channel or use a named metric (`purchases`, `clicks`, …).
- If `check_reporting_data_available` says there is no import yet, say so instead of fabricating a table.
