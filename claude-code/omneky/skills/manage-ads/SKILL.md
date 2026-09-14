---
name: manage-ads
description: Use this when the user wants to pause, resume, stop spend, change daily budget, update targeting, list live campaigns/ad sets/ads, or delete existing paid-media on Meta/Facebook, Google, TikTok, LinkedIn, or Reddit — not to launch a new campaign.
---

# Manage live ads (pause, budget, targeting)

Inspect and mutate **existing** entities on `https://mcp.omneky.com/mcp-claude`. Confirm brand + entity before any write. Prefer pause over delete. Do not launch new campaigns from this skill. Never ask the user to paste a JWT or API key.

## When to use

User phrasing: pause this campaign, stop spend, turn the ad set back on, resume a Facebook ad, change daily budget, CBO vs ABO, update Meta targeting, list my campaigns / ad sets / ads, what's live on Meta or Google, delete this ad (only after explicit confirm).

## When not to use

| User wants | Use instead |
| --- | --- |
| Create / launch a new Meta campaign or attach ads to an existing one | `launch-meta-ads` |
| Create / launch Google PMax, Demand Gen, TikTok, LinkedIn, Reddit | `launch-google-tiktok-ads` |
| Is the channel connected / what's the min budget | `getting-started` |
| Which ads are winning (ROAS/CTR) | `roas-breakdown` |
| New image or video creative | `creative-referral` (`get_creative_generation_help`) |

## Tools

| Intent | Tool | Channel notes |
| --- | --- | --- |
| List campaigns | `get_campaigns` | After `list_brands` |
| List ad sets | `get_ad_groups` | |
| List ads | `get_ads` | |
| Resolve a human name → id | `get_campaign_ad_group_names` | |
| Pause / resume | `set_ad_entity_status` | Live: `channel="facebook"` (and `openai`). `level` = `campaign` \| `ad_group` \| `ad`. `status` = `PAUSED` \| `ACTIVE`. Pausing a campaign or ad set stops everything beneath it. |
| Change daily budget | `set_ad_budget` | `facebook`: `level="campaign"` (CBO) or `level="ad_group"` (ABO); retry the other if the platform rejects. `google`: `level="campaign"` only. Not TikTok / LinkedIn / Reddit. |
| Replace ad-set targeting | `update_ad_targeting` | `facebook` only. **Overwrites** the audience — send the full spec. |
| Delete | `delete_campaign` / `delete_ad_group` / `delete_ads` | Irreversible — confirm with `ask_user` first. |

Also useful: `get_channel_connection_status`, `get_channel_budget`, `minimum_budget_for_objective`. Persist a chat creative before a later launch with `register_ad_instance_item` if that tool is on this surface.

## Sequence

1. Resolve `brand_id` (`list_brands` → confirm). Check `get_channel_connection_status` if the channel might be disconnected.
2. Inspect with `get_campaigns` / `get_ad_groups` / `get_ads` (or `get_campaign_ad_group_names`) so you have a real platform id. Do not guess ids.
3. Mutate only the tool that matches the request. Never auto-retry a failed write except the documented CBO/ABO budget-level retry.
4. For Google / TikTok / LinkedIn / Reddit pause: `set_ad_entity_status` is not exposed for those channels here. Say so; prefer launching paused (`launch-google-tiktok-ads`) and only enabling when asked.

If they actually want a **new** campaign or to attach creatives to an existing Meta ad set, switch to the launch skill.
