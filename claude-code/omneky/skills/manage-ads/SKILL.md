---
name: manage-ads
description: Use this when the user wants to pause, resume, stop spend, change daily budget, update targeting, list live campaigns/ad sets/ads, or delete existing paid media on Meta/Facebook, Google, TikTok, LinkedIn, Reddit, Pinterest, X Ads or OpenAI Ads. Not for launching a new campaign.
---

# Manage live ads (pause, budget, targeting)

Inspect and change **existing** entities on `https://mcp.omneky.com/mcp-claude`. Prefer pause over delete. Do not launch new campaigns from this skill. Never ask the user to paste a JWT or API key. Status, budget, targeting and delete tools are marked destructive on the server, so Claude's host asks the user to confirm each change.

## When to use

User phrasing: pause this campaign, stop spend, turn the ad set back on, resume a Facebook ad, change daily budget, CBO vs ABO, update Meta targeting, list my campaigns / ad sets / ads, what's live on Meta or Google, delete this ad.

## When not to use

| User wants | Use instead |
| --- | --- |
| Create / launch a new Meta campaign or attach ads to an existing one | `launch-meta-ads` |
| Launch on Google, TikTok, LinkedIn, Reddit, Pinterest, X Ads or OpenAI Ads | `launch-google-tiktok-ads` |
| Is the channel connected / what's the min budget | `getting-started` |
| Which ads are winning (ROAS/CTR) | `roas-breakdown` |
| Replace tired ads with new creative | `creative-refresh` |
| New image or video creative | `creative-referral` |

## Tools

| Intent | Tool | Channel notes |
| --- | --- | --- |
| List campaigns | `get_campaigns` | After `list_brands`; pass `channel` |
| List ad sets | `get_ad_groups` | Pass `campaign_id` |
| List ads | `get_ads` | |
| Resolve a human name → id | `get_campaign_ad_group_names` | |
| Pause / resume | `set_ad_entity_status` | `level` = `campaign` \| `ad_group` \| `ad`. Pausing a campaign or ad set stops everything beneath it. X Ads: campaign level only |
| Change daily budget | `set_ad_budget` | `facebook`: `level="campaign"` (CBO) or `level="ad_group"` (ABO); retry the other if the platform rejects. `google`: `level="campaign"` only |
| Replace ad-set targeting | `update_ad_targeting` | `facebook` only. **Overwrites** the audience, so send the full spec |
| Delete | `delete_campaign` / `delete_ad_group` / `delete_ads` | Irreversible; say so in the summary |

Also useful: `get_channel_connection_status`, `get_channel_budget`, `minimum_budget_for_objective`. Register a finished creative for a later launch with `register_creative_for_launch`.

## Sequence

1. Resolve `brand_id` (`list_brands`, ask which in chat if several). Check `get_channel_connection_status` if the channel might be disconnected.
2. Inspect with `get_campaigns` / `get_ad_groups` / `get_ads` (or `get_campaign_ad_group_names`) so you have a real platform id. Do not guess ids.
3. Show one summary naming each entity and the change, then call only the tool that matches the request. Never auto-retry a failed write except the documented CBO/ABO budget-level retry.
4. If a channel rejects a status or budget change, say what the platform returned and stop.

If they actually want a **new** campaign or to attach creatives to an existing ad set, switch to the launch skill.
