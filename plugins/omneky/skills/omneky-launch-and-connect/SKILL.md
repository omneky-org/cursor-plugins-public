---
name: omneky-launch-and-connect
description: >-
  Launch Omneky paid-media campaigns and connect missing ad
  accounts (Meta/Facebook, Google, TikTok, LinkedIn, Reddit,
  Pinterest, X/Twitter, OpenAI Ads). Use to launch, publish,
  pause/budget/retarget, or connect an ads account. Do
  not use for first-run onboarding (omneky-onboarding), agency
  cross-brand (omneky-agency), ROAS analytics or catalogue
  (omneky-analytics-and-catalogue), competitor analysis
  (omneky-competitor-analysis), A/B tests (omneky-ab-tests),
  weekly marketing plans (omneky-marketing-plan), AI creative
  generation, or credit balance (omneky-billing).
  Keywords: launch Meta sales ads, launch campaign, Meta ads,
  Facebook ads, Google PMax, TikTok ads, LinkedIn ads, connect
  ads, pause ad, budget, targeting, twitter, paused, preflight,
  waste pruner pause, update ad targeting, apply target CPA
  budget, Demand Gen, TikTok locations, Pinterest campaigns.
---

# Launch paid ads and connect accounts

Use this when the user wants to launch, pause, re-budget, retarget or
delete paid ads, or connect an ad account. One job: paid-media
changes and account connection. Live vs paused is the host's call from the user's request.

Gate on `tools/list`; a missing launch tool → the Omneky app. X Ads
is channel `twitter`; OpenAI Ads is `openai`.
Step detail: [playbook](references/playbook.md) (channel table, launch
path, preflight, targeting, manage, connect, launch checks).

Handoff fields: [handoff-contract](references/handoff-contract.md).
Sourced ids (how to obtain / what to do if absent): [preconditions](references/preconditions.md).
Acceptance gates: [creative-quality-gates](references/creative-quality-gates.md).
Other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).

## Goal

Launch or mutate paid media the user asked for. Set `campaign_spec.status_on_launch` from what the user asked (no server default). Launches, deletes, budget, status and targeting changes are marked destructive, so the host confirms them; do not add your own approval step.

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Brand | `list_brands` | Ask which |
| Channel | `list_connections` (`connector`) | `get_connect_link` → `list_ad_accounts` → `link_ad_account` when listed. If `link_ad_account` is not on `tools/list`, say that capability isn't available on this connector. Do not invent a link. Or managed launch |
| Budget floor | `get_launch_requirements` | Do not launch under the floor |
| Audience size | `estimate_reach` | Optional; estimate only |
| Targeting tokens | `search_targeting` (`channel`, `query`) / `search_targeting` (`channel="tiktok"`, `objective`) / `search_targeting` (`channel="google"`) | Required on LinkedIn / TikTok / Demand Gen |
| Creative URL | any finished HTTPS asset URL (prior generate or user-supplied) | No URL at all → Owning creative skill first |
| Credits | `get_account` | `omneky-billing` |

## Flow

1. Pick the channel and the exact `launch_*` tool from the playbook
   table, then read only that channel's reference.
2. Self-managed: confirm the account is connected; if not, run
   Connect and stop. Managed (no account): skip Connect.
3. Check the budget floor and run the channel's targeting pre-call
   (TikTok locations, LinkedIn locations, Demand Gen countries).
4. Fill copy, CTA, landing URL and the finished asset URL from the
   conversation; ask only for what you cannot infer. Use
   `approved_claims` from the handoff; never invent a claim or URL.
5. Show one summary (channel, spend, audience, asset, status) and
   call the tool. Launches, deletes, budget, status and targeting
   changes are marked destructive, so the host confirms them; do not
   add your own approval step.
6. Read back with one get_* call and report what launched, status,
   and spend at risk.

## When to use

- Launch a campaign, publish an ad, pause, budget, or retarget
- Connect a disconnected Meta, Google, TikTok, LinkedIn, Reddit,
  Pinterest, X Ads, or OpenAI Ads account

## When not to use

- First-run setup / first ad today / run it for me → `omneky-onboarding`
- Cross-brand / all clients → `omneky-agency`
- ROAS, winning ads, or catalogue import (analytics skill)
- Weekly marketing plan create / revise / poll / approve
- Branded image ads or product video ads (`omneky-image-ads` /
  `omneky-product-video`)
- Credit balance or plan upgrade (`omneky-billing`)

## Failure and recovery

Auth / 401 → `omneky-getting-started-and-failures` (host OAuth).
Empty reporting → `get_performance_summary` (`include_coverage=true`); empty is not zero.
`credit_insufficient` → nothing charged; state balance vs required
(`omneky-billing`). No payment links.
`needs_user_decision` → fill the missing detail and call again; ask in plain chat only if you cannot. Never dump JSON.
Missing tool → this session may run an older published app snapshot: look
the name up in [tool-name-fallbacks](references/tool-name-fallbacks.md)
and call the older name if that one is on `tools/list`. If neither is
listed, say so; Omneky app. Do not invent it.
Never ask for internal ids. Never silent-switch `brand_id`.

## Gaps

Decline social inbox, landing pages, subtitle burn-in, email/SMS,
organic scheduling, Ad Library ads, try-on, and website builder
([capability-gaps](references/capability-gaps.md)).
