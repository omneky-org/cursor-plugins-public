---
name: weekly-ad-review
description: >-
  Run a weekly review of a brand's Omneky paid media across Meta,
  Google, TikTok, LinkedIn, Reddit, Pinterest and X Ads: what spent,
  what won, what slipped, and what to change next week. Use for a
  weekly ad review, Monday ads check, last week's performance,
  weekly report, or a review before a budget meeting. Do not use for
  a one-off metric lookup (roas-breakdown), tired
  creative (creative-refresh), launches or edits
  (manage-ads, launch-meta-ads, launch-google-tiktok-ads), or first-run setup
  (brand-setup). Keywords: weekly ad review, weekly report,
  last week, week over week, Monday review, ads check-in, what
  changed, spend pacing, winners and losers, next week plan.
---

# Weekly ad review

Use this when the user wants the whole week read for them: one
answer on how paid media did, the few things that moved, and the
changes worth making. One job: a short, sourced review with a plan.
This skill reads only. Changes go to `manage-ads`.

Call tools by their exact names when they are on `tools/list`.

## Goal

A review the user can read in a minute: the headline number, two or
three movers with the reason, and at most three proposed changes,
each tied to the metric that justifies it.

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Brand | `list_brands` | Ask which; do not invent |
| Coverage | `check_reporting_data_available` | Say which days or channels have no data; empty is not zero |
| Budgets | `get_channel_budget` | Skip pacing; say budgets were not readable |

## Flow

1. Resolve the brand. Default the window to the last 7 complete
   days ending yesterday, compared with the 7 days before. Say the
   dates.
2. Confirm coverage for both windows. Drop channels with no data
   from the comparison and name them.
3. Headline: `get_performance_breakdown` by channel, once per
   window (`date_range` `[start, end]`, `filters` `[]`). Report
   spend, conversions, CPA and ROAS (or the brand's goal metric)
   per channel. Never add a goal metric across channels; each
   channel can count a different conversion. Use
   `get_daily_metrics` only when a day-by-day trend helps.
4. Movers: `get_performance_movers` with `end_date` and
   `period_days` 7. Keep the two or three biggest moves that have
   enough spend to matter.
5. Winners and losers: `get_performance_breakdown` by ad or
   campaign for this week, sorted by the goal metric, with
   `filters` as `[]`. Name the top three and the bottom three that
   spent money.
6. Pacing: `get_channel_budget` is the daily budget, so compare it
   with this week's spend divided by 7. Flag a channel far under or
   over its budget.
7. Optional: `get_recommendations` for the same window, and keep
   only suggestions the numbers above support.
8. Write the review, then offer the next step.

## Output

- One line: the week in a sentence with the headline number and
  the change from last week.
- Movers: each with metric, before, after, and the likely cause.
- Proposed changes, three at most: pause, shift budget, refresh
  creative, or test. Each names the ad or campaign, the amount, and
  the evidence. Thin samples say "too little data to conclude".
- Next step: apply a pause or budget change through `manage-ads`
  (the host confirms each one), or refresh fatigued ads through
  `creative-refresh`.

## When to use

- "How did my ads do last week?", "weekly ad review", "Monday check"
- A review before a budget or planning meeting
- A standing weekly report the user asks for each week

## When not to use

- One metric or one chart (`roas-breakdown`)
- Ads that are wearing out and need new creative
  (`creative-refresh`)
- Pausing or re-budgeting now (`manage-ads`); launching (`launch-meta-ads`, `launch-google-tiktok-ads`)
- Account setup or connecting a channel (`brand-setup`)

## Failure and recovery

Auth or 401 → `getting-started`.
No data in the window → say so and offer a longer window.
A tool missing from `tools/list` → say that part is unavailable on
this connector and finish the rest. Never invent a number.
Never ask for internal ids. Never switch `brand_id` silently.
