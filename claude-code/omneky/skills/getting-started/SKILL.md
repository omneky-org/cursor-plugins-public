---
name: getting-started
description: Use this when the user needs to sign in to Omneky, list or pick a brand, or run pre-launch checks. Is Meta/Facebook, Google, TikTok, LinkedIn, Reddit, Pinterest, X Ads or OpenAI Ads connected, what's the channel budget, or is paid-media data imported. For a full first-time setup, use brand-setup.
---

# Getting started with Omneky

First-session and pre-launch checks on `https://mcp.omneky.com/mcp-claude`. Sign-in is the client's OAuth flow. Never ask the user to paste a JWT or API key. Do not launch or change the catalogue from this skill.

## When to use

User phrasing: get started with Omneky, who am I logged in as, list my brands, pick a brand, is Meta/Facebook connected, is Google Ads connected, is TikTok / LinkedIn / Reddit / Pinterest / X / OpenAI Ads connected, check my ad account, pre-launch checklist, what's my channel budget, do I have performance data, which channels can I launch on.

## When not to use

| User wants | Use instead |
| --- | --- |
| Full first-time setup (brand info, products, connecting accounts) | `brand-setup` |
| Launch new Meta/Facebook/Instagram ads | `launch-meta-ads` |
| Launch Google, TikTok, LinkedIn, Reddit, Pinterest, X Ads or OpenAI Ads | `launch-google-tiktok-ads` |
| Pause, resume, change budget, retarget, or delete live ads | `manage-ads` |
| ROAS / CTR / spend / trends | `roas-breakdown` |
| Last week's results and what to change | `weekly-ad-review` |
| Product catalogue / import a product page | `product-catalogue` |
| Image ad, product video, edit, resize | `creative-referral` |

## Tools

| Intent | Tool |
| --- | --- |
| Who is signed in | `get_current_user` |
| Brands the user can access | `list_brands` |
| What setup is still missing | `get_onboarding_status` |
| Confirm a brand | `get_brand` |
| Logo, colors, copy, assets | `get_brand_details` |
| Every connector's status at once | `list_connector_statuses` |
| One ad account connected? | `get_channel_connection_status` |
| Allocated daily budget on a channel | `get_channel_budget` |
| Platform minimum before setting spend | `minimum_budget_for_objective` |
| Has imported performance data (dates / channels) | `check_reporting_data_available` |
| Credit balance | `get_account_credit_balance` |

## Sequence

1. `get_current_user`. The server reads the user from the signed-in session; never ask for a user id.
2. `list_brands`. If there is more than one, ask which one in chat. Do not guess `brand_id`.
3. `get_brand` / `get_brand_details` only when you need identity assets, not for metrics.
4. Pre-launch / "is X connected": `get_channel_connection_status` for that brand and channel (X Ads is `twitter`). If it is not connected, hand off to `brand-setup`, which connects accounts.
5. If they asked about spend floors: `get_channel_budget` (daily budget, not spend), then `minimum_budget_for_objective` for that channel and objective.
6. If they asked whether reporting will work: `check_reporting_data_available` before routing to `roas-breakdown`. Empty means no imported data, not zero.

Then route to the matching skill above. Live or paused at launch follows what the user asked.
