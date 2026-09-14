---
name: roas-breakdown
description: Use this when the user asks which paid-media ads, campaigns, or channels are winning or losing — ROAS, CTR, CPC, CPA, spend, impressions, conversions, day-by-day trends, WoW/MoM movers, or a creative/campaign/channel leaderboard.
---

# ROAS / CTR / spend breakdown

Read-only analytics. Never invent metrics. If results look empty, call `check_reporting_data_available` (alias `data_available`) for the brand before retrying.

## When to use

User phrasing: ROAS, CTR, CPC, CPA, spend, impressions, conversions, which ads/creatives/campaigns/channels are winning or losing, leaderboard, day-by-day chart, WoW/MoM movers, trending, performance report, paid-media analytics.

## When not to use

| User wants | Use instead |
| --- | --- |
| Launch a new campaign | `launch-meta-ads` or `launch-google-tiktok-ads` |
| Pause / budget / targeting on live ads | `manage-ads` |
| List brands / is data imported / is a channel connected | `getting-started` |
| Product catalogue | `product-catalogue` |
| Generate a creative | `creative-generation` |

## Tools

| Question | Tool |
| --- | --- |
| Ranked breakdown / leaderboard by creative, campaign, channel, ad, ad group, or tactic | `get_performance_breakdown` (alias `get_dimension_summary`) |
| Day-by-day time series / charts (spend, ROAS, CTR) | `get_daily_metrics` |
| What rose or fell vs the prior window (WoW / MoM movers) | `get_performance_movers` (alias `get_trending`) |
| Turn a human campaign/ad name into a filter value | `search_reporting_values` (alias `search_dimension_values`) |
| What to try next from historical performance | `get_recommendations` |
| Current spend per channel | `get_channel_budget` |
| Confirm the brand has imported performance data | `check_reporting_data_available` (alias `data_available`) |
| Signed-in `user_id` | `get_current_user` |

## Identity

1. Call `get_current_user` for `user_id` — do not ask the user for a numeric user id.
2. If `brand_id` is unknown, call `list_brands` and confirm the brand. Use `get_brand_details` only when you need brand metadata, not for metrics.

## `get_performance_breakdown` (alias `get_dimension_summary`)

Required: `user_id`, `date_range` (`["YYYY-MM-DD", "YYYY-MM-DD"]`), `dimension`, `results_per_page`, `sort_metric`, `sort_order`. Pass `brand_id` at the top level. Pass `filters` as `[]` when not filtering — never null, and never add a redundant `{dimension: "brand"}` filter.

Common dimensions: `creative`, `campaign`, `channel`, `ad`, `ad_group`, `creative_type`, `country`. Sort by `ROAS`, `CLICK_THROUGH_RATE`, or `SPEND` as the user asked. Use `include_all_metrics=true` when they want a full scorecard on the same rows.

## `get_daily_metrics`

Required: `user_id`, `date_range`. Pass `brand_id` and `filters=[]` when unscoped. Use this for trend lines, not rankings.

## `get_performance_movers` (alias `get_trending`)

Required: `brand_id`, `user_id`, `dimension`, `metric` (e.g. `ROAS`, `CLICK_THROUGH_RATE`, `SPEND`), `end_date`. Optional: `period_days` (default 7), `top_n` (default 10). The prior window is the same length immediately before the current period.

## Filters

If the user names a campaign, ad, or channel, call `search_reporting_values` (alias `search_dimension_values`) (`brand_id`, `dimension`, `q`) first, then pass exact values as `{condition: "includes"|"excludes", dimension, value: [...]}` on `get_performance_breakdown` / `get_daily_metrics`.

## Rules

- Stay on these structured tools. There is no public SQL tool — do not invent `run_sql_query` or warehouse table names.
- Do not invent score / lift endpoints. They are not on this surface.
- `selected_conversion_metric_value` is the brand's configured goal and **varies per channel**. Never sum it across channels; group by channel or use a named metric (`purchases`, `clicks`, …).

Report numbers with the date range and dimension you actually queried. If `check_reporting_data_available` (alias `data_available`) says there is no import yet, say so instead of fabricating a table.
