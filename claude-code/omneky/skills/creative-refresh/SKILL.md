---
name: creative-refresh
description: >-
  Find Omneky paid ads that are wearing out and replace them: spot
  falling CTR or rising CPA on ads with real spend, write a refresh
  brief from the brand's own winners, launch the replacement paused
  beside the tired ad, then pause the tired ad once the new one runs.
  Use for creative fatigue, tired ads, ad refresh, swap out
  creative, CTR dropping, frequency burnout, or ads that stopped
  working. Do not use for a full weekly review
  (weekly-ad-review), a one-off metric
  (roas-breakdown), or a fresh launch with no tired
  ad (launch-meta-ads, launch-google-tiktok-ads, manage-ads). Keywords: creative fatigue, ad
  fatigue, refresh creative, tired ads, CTR decline, CPA rising,
  replace ad, rotate creative, new variant brief.
---

# Refresh tired creative

Use this when the user thinks ads are wearing out or wants the
weakest live ads replaced. One job: find the tired ads with
evidence, brief the replacement, and swap it in without a gap in
delivery.

This connector does not generate images or video. The replacement
is a finished asset the user already has, or one they make in the
Omneky app (`get_creative_connector_setup` gives the steps when it
is on `tools/list`).

## Goal

Up to three tired ads, each with the evidence, a replacement brief,
and a replacement live or ready to launch paused.

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Brand | `list_brands` | Ask which; do not invent |
| Coverage | `check_reporting_data_available` | Say there is not enough history to judge fatigue |
| Live ads | `get_campaigns` / `get_ads` | Nothing live → nothing to refresh |

## Flow

1. Window: the last 7 complete days against the 7 before (or 14
   against 14 for low spend). Say the dates.
2. Find candidates: `get_performance_movers` (`period_days` 7),
   then `get_performance_breakdown` by ad for both windows with
   `filters` as `[]`. A tired ad has meaningful spend in both
   windows and a clear drop in CTR or ROAS, or a rise in CPA. Skip
   ads with too few clicks or conversions to tell; say so.
3. Find the brand's winners from the same breakdown: the ads with
   the best goal metric and enough spend. They are the model for
   the replacement.
4. Write one brief per tired ad: what to keep from the winners
   (angle, offer, hook, format), what to change, the channel and
   size, and `approved_claims` with their source. Never invent a
   claim, price or offer.
5. Get the asset: a finished HTTPS URL the user gives, or one they
   make in the Omneky app from the brief. Stop and wait if there is
   no asset yet; hand the brief over as the result.
6. Swap: through `launch-meta-ads` or `launch-google-tiktok-ads`, register the asset
   with `register_creative_for_launch` and launch it into the same
   ad set or campaign, `PAUSED` unless the user says to go live.
7. Once the replacement is live, pause the tired ad with
   `set_ad_entity_status`. The host confirms each change.
8. Report what changed and when to check again (about 7 days).

## When to use

- "My ads are getting tired", "CTR keeps dropping", "refresh creative"
- Replace the worst live ads with new variants
- A refresh step that came out of `weekly-ad-review`

## When not to use

- Full weekly review (`weekly-ad-review`)
- Which ads win, no swap (`roas-breakdown`)
- A brand new campaign (`launch-meta-ads` or `launch-google-tiktok-ads`)
- Asking this connector to render the asset (`creative-referral`)

## Failure and recovery

Auth or 401 → `getting-started`.
Thin data → say "too little data to conclude" and stop short of a swap.
Launch refused or `credit_insufficient` → nothing changed; state why
(check `get_account_credit_balance`). Keep the tired ad running.
A tool missing from `tools/list` → say so and finish what you can.
Never ask for internal ids. Never switch `brand_id` silently.
