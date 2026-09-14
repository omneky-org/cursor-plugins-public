---
name: roas-breakdown
description: Break down paid-media ROAS, CTR, and spend by creative, campaign, or channel, plus day-by-day trends and WoW/MoM movers. Use this when the user asks which ads, campaigns, or channels are winning, losing, or trending.
---

# ROAS / CTR / spend breakdown

Read-only analytics on the Directory-safe Omneky MCP (`https://mcp.omneky.com/mcp-claude`). Never invent metrics. If results look empty, call `data_available` for the brand before retrying.

## Identity

1. Call `get_current_user` for `user_id` — do not ask the user for a numeric user id.
2. If `brand_id` is unknown, call `list_brands` and confirm the brand. Use `get_brand_details` only when you need brand metadata, not for metrics.

## Which tool

| Question | Tool |
| --- | --- |
| Ranked breakdown / leaderboard by creative, campaign, channel, ad, ad group, or tactic | `get_dimension_summary` |
| Day-by-day time series / charts (spend, ROAS, CTR) | `get_daily_metrics` |
| What rose or fell vs the prior window (WoW / MoM movers) | `get_trending` |
| Turn a human campaign/ad name into a filter value | `search_dimension_values` |
| Confirm the brand has imported performance data | `data_available` |

## `get_dimension_summary`

Required: `user_id`, `date_range` (`["YYYY-MM-DD", "YYYY-MM-DD"]`), `dimension`, `results_per_page`, `sort_metric`, `sort_order`. Pass `brand_id` at the top level. Pass `filters` as `[]` when not filtering — never null, and never add a redundant `{dimension: "brand"}` filter.

Common dimensions: `creative`, `campaign`, `channel`, `ad`, `ad_group`, `creative_type`, `country`. Sort by `ROAS`, `CLICK_THROUGH_RATE`, or `SPEND` as the user asked. Use `include_all_metrics=true` when they want a full scorecard on the same rows.

## `get_daily_metrics`

Required: `user_id`, `date_range`. Pass `brand_id` and `filters=[]` when unscoped. Use this for trend lines, not rankings.

## `get_trending`

Required: `brand_id`, `user_id`, `dimension`, `metric` (e.g. `ROAS`, `CLICK_THROUGH_RATE`, `SPEND`), `end_date`. Optional: `period_days` (default 7), `top_n` (default 10). The prior window is the same length immediately before the current period.

## Filters

If the user names a campaign, ad, or channel, call `search_dimension_values` (`brand_id`, `dimension`, `q`) first, then pass exact values as `{condition: "includes"|"excludes", dimension, value: [...]}` on `get_dimension_summary` / `get_daily_metrics`.

Report numbers with the date range and dimension you actually queried. If `data_available` says there is no import yet, say so instead of fabricating a table.
