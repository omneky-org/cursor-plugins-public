---
name: omneky-getting-started-and-failures
description: >-
  Recover Omneky session context: sign-in/OAuth, unknown brand,
  unauthorized, pending/timeout/needs_user_decision/credit_insufficient.
  Also the named-preset menu when they ask what they can do. Do not
  use for first-run onboarding (omneky-onboarding), agency
  cross-brand (omneky-agency), weekly marketing plans
  (omneky-marketing-plan), paid-media analysis or catalogue
  (omneky-analytics-and-catalogue), competitor analysis
  (omneky-competitor-analysis), A/B tests (omneky-ab-tests),
  generating creatives, launch/connect
  (omneky-launch-and-connect), or credits (omneky-billing).
  Keywords: sign in, OAuth, list brands, unauthorized, timeout,
  empty data, no brands, which brand, needs user decision,
  credit insufficient, named presets, what can you do.
---

# Session context and failure recovery

Use this when sign-in fails, the brand is unknown, a call returns an
error state, or the user asks what they can do. One job: get the
session working again and point to the owning skill.

The user signs in to the connected Omneky MCP server through the host's
OAuth. Never ask for or paste a JWT, token, or password.

This skill is the recovery entry. Healthy creative (`omneky-image-ads`,
`omneky-product-video`, `omneky-avatar-ugc`,
`omneky-voice-and-video-clone`, `omneky-edit-and-resize`), launch,
analytics, catalogue, billing, and marketing-plan requests go straight
to those skills.

Handoff fields: [handoff-contract](references/handoff-contract.md).
Sourced ids (how to obtain / what to do if absent): [preconditions](references/preconditions.md).
Quote, retry, and polls: [creative-pricing-and-polling](references/creative-pricing-and-polling.md).
Acceptance gates: [creative-quality-gates](references/creative-quality-gates.md).
Structured brief: [creative-brief](references/creative-brief.md).
QA and cheapest repair: [media-qa-and-repair](references/media-qa-and-repair.md).
Named presets and other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).

## Goal

Recover a broken session and list named presets. First-run setup is `omneky-onboarding`.

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Session | `get_account` | Host OAuth reconnect |
| Brand | `list_brands` | Ask which; no brands → Omneky app |
| Connectors | `list_connections` | Connect via `omneky-launch-and-connect` |
| Credits (shortfall) | `get_account` | `omneky-billing` |

## Flow

1. Act on the request; there is no mandatory first-turn sequence.
2. Reuse the chosen `brand_id`. If unknown, `list_brands` (pass
   `search`). No brands → Omneky app. Several matches → list name and
   id and ask. One match → say it and keep it. Never switch brands
   because metrics are empty.
3. On 401, ask the user to reconnect Omneky in the host.
4. Match the error to its recovery in
   [playbook](references/playbook.md) (Failures; creative states
   such as pending, terminal failure, and ambiguous paid submits).
5. Tell the user what broke, the fix, and the next step.

## When to use

- 401 / JWT errors, unknown or ambiguous `brand_id`
- Empty metrics, `status=timeout` / `pending` / `needs_user_decision`
- `credit_insufficient`
- A video pick that returns `narrative_unresolved`

## When not to use

- A healthy "make a branded ad" / "video ad" / "which ads should I make
  more of" / "how many credits" / "weekly marketing plan" request —
  open that skill directly
- Weekly plan create / revise / poll / approve →
  `omneky-marketing-plan` (this skill does not own that loop)
- Competitor analysis → `omneky-competitor-analysis`
- A/B test create or measure → `omneky-ab-tests`
- First-run setup / first ad today → `omneky-onboarding`
- Cross-brand / all clients → `omneky-agency`
- Not a license to invent purchase, card-PAN, or warehouse tools

## Named presets

When they ask what they can do, show the one-liners in
[named-presets](references/named-presets.md), then open the owning
skill. Do not run a healthy request here.

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
