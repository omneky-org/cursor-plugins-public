---
name: roas-breakdown
description: Read Omneky paid-media ROAS, CTR, and spend by creative, campaign, or channel, plus day-by-day trends and WoW/MoM movers. Use this when the user asks which ads, campaigns, or channels are winning, losing, or trending.
---

# ROAS / CTR / spend breakdown

Read-only reporting on `https://mcp.omneky.com/mcp-claude`. Auth is the client's OAuth flow; never ask for a token. Never invent metrics.

## Start here

1. `get_current_user` — `user_id` for brand-scoped calls. Do not ask the user for a numeric user id.
2. `list_brands` / `get_brand` / `get_brand_details` — confirm which brand. Do not guess `brand_id`.
3. `data_available` — confirm the brand has imported data (and which dates/channels) before querying.

## Choose the tool

| Question | Tool |
| --- | --- |
| Ranked breakdown / leaderboard (creative, campaign, channel, ad, …) | `get_dimension_summary` |
| Day-by-day time series / charts | `get_daily_metrics` |
| What rose or fell vs the prior window | `get_trending` |
| Turn a human campaign/ad name into a filter value | `search_dimension_values` |
| What to try next from historical performance | `get_recommendations` |
| Current spend per channel | `get_channel_budget` |

## Rules

- Stay on these structured tools. There is no public SQL tool — do not invent `run_sql_query` or warehouse table names.
- Do not invent score / lift endpoints. They are not on this surface.
- `get_dimension_summary` needs `user_id`, `date_range` (`["YYYY-MM-DD", "YYYY-MM-DD"]`), `dimension`, `results_per_page`, `sort_metric`, `sort_order`. Pass `filters` as `[]` when unscoped — never null, and never a redundant `{dimension: "brand"}` filter.
- Common dimensions: `creative`, `campaign`, `channel`, `ad`, `ad_group`. Sort by `ROAS`, `CLICK_THROUGH_RATE`, or `SPEND` as asked.
- `get_trending` needs `brand_id`, `user_id`, `dimension`, `metric`, `end_date`. Optional `period_days` (default 7).
- `selected_conversion_metric_value` is the brand's configured goal and **varies per channel**. Never sum it across channels; group by channel or use a named metric (`purchases`, `clicks`, …).
- If `data_available` says there is no import yet, say so instead of fabricating a table.
