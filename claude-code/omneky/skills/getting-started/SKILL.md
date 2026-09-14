---
name: getting-started
description: Use this when the user is new to Omneky, needs to sign in, list brands, pick a brand, or run pre-launch checks — is Meta/Facebook, Google, TikTok, LinkedIn, or Reddit connected, what's the channel budget, or is paid-media data imported.
---

# Getting started with Omneky

First-session and pre-launch checks on `https://mcp.omneky.com/mcp-claude`. Sign-in is the client's OAuth flow. Never ask the user to paste a JWT or API key. Do not launch, generate, or mutate catalogue from this skill.

## When to use

User phrasing: get started with Omneky, who am I logged in as, list my brands, pick a brand, is Meta/Facebook connected, is Google Ads connected, is TikTok / LinkedIn / Reddit connected, check my ad account, pre-launch checklist, what's my channel budget, do I have performance data, which channels can I launch on.

## When not to use

| User wants | Use instead |
| --- | --- |
| Launch new Meta/Facebook/Instagram ads | `launch-meta-ads` |
| Launch Google PMax/Demand Gen, TikTok, LinkedIn, Reddit | `launch-google-tiktok-ads` |
| Pause, resume, change budget, retarget, or delete live ads | `manage-ads` |
| ROAS / CTR / spend / trends | `roas-breakdown` |
| Product catalogue / scrape a PDP | `product-catalogue` |
| Image ad, product video, edit, resize | `creative-referral` (`get_creative_generation_help` only) |

## Tools

| Intent | Tool |
| --- | --- |
| Signed-in `user_id` (never ask the user for it) | `get_current_user` |
| Brands the user can access | `list_brands` |
| Confirm a brand id / name | `get_brand` |
| Logo, colors, copy, `company_id`, assets | `get_brand_details` |
| Ad account connected? (`facebook` \| `google` \| `tiktok` \| `linkedin` \| `reddit`) | `get_channel_connection_status` |
| Current spend / budget on a channel | `get_channel_budget` |
| Platform minimum before setting spend | `minimum_budget_for_objective` |
| Has imported performance data (dates / channels) | `data_available` |
| Missing brand or channel choice | `ask_user` |

## Sequence

1. `get_current_user` — keep `user_id` for later analytics tools.
2. `list_brands` — if more than one, confirm with `ask_user`. Do not guess `brand_id`.
3. `get_brand` / `get_brand_details` only when you need identity assets, not for metrics.
4. Pre-launch / "is X connected": `get_channel_connection_status(brand_id, channel)`. Stop and say so if `connected` is false — this skill cannot connect an ad account.
5. If they asked about spend floors: `get_channel_budget` then `minimum_budget_for_objective` for that channel + objective.
6. If they asked whether reporting will work: `data_available` before routing to `roas-breakdown`.

Then route to the matching skill above. New launches stay **paused** unless the user later asks to go live.
