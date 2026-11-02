---
name: omneky-billing
description: >-
  Call get_account by name for remaining Omneky prepaid ad
  credits. Also plan entitlements and credit history. Use when the user asks how many ad credits remain,
  credit balance, credit history, out of credits, which plan,
  or card on file. Do not use for campaign spend/ROAS
  (omneky-analytics-and-catalogue), competitor analysis
  (omneky-competitor-analysis), A/B tests (omneky-ab-tests),
  first-run onboarding (omneky-onboarding), agency
  (omneky-agency), weekly marketing plans
  (omneky-marketing-plan), creating ads, launching
  campaigns (omneky-launch-and-connect), or collecting card numbers.
  Keywords: ad credits, credit balance, remaining credits, how many
  credits, credit history audit, top-up, plan, card on file.
---

# Ad credits and plan (read only)

Use this when the user asks how many ad credits remain, what they
have spent credits on, which plan they are on, or what card is on
file. One job: read-only billing answers.

There is no upgrade, portal or checkout tool, and no payment links.

Never collect a PAN. Never invent a purchase or upgrade tool, and never
send payment, checkout or portal links. The user adds credits or
changes plan in the Omneky app.

Handoff fields: [handoff-contract](references/handoff-contract.md).
Sourced ids: [preconditions](references/preconditions.md).
Acceptance gates: [creative-quality-gates](references/creative-quality-gates.md).
Other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).

## Goal

Show credits, the shortfall if any, and the credit history.

## When to use

- Remaining credits, credit history, which plan, card on file
- `credit_insufficient` after a creative or launch

## When not to use

- Campaign spend, ROAS, or daily metrics (analytics skill)
- Weekly marketing plans (`omneky-marketing-plan`)
- Creating ads (`omneky-image-ads`) or launching them
  (`omneky-launch-and-connect`)
- Collecting a card number

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Balance | `get_account` | Say the tool is missing; Omneky app |
| Ledger | `get_account` (`include_credit_history=true`) | Skip the audit line |

## Call by name

Call only names on this session's `tools/list`.

| User ask | Tool |
|---|---|
| how many credits remain | `get_account` |
| credit grants and usage ledger | `get_account` (`include_credit_history=true`) |
| plan and credit snapshot | `get_account` |
| which plans exist, buy credits, change plan | no tool: the user does it on omneky.com |
| card brand and last4 | `get_account` |
| company record | `get_account` |

## Flow

1. Call the tool for the ask. Lead with the number, the shortfall if
   any, and one next step.
2. For "what will this cost": there is no quote tool. Say a paid run
   uses credits and its result reports `credits_charged`; the amount
   shows in `get_account` (`include_credit_history=true`). Never invent a figure.
3. Present `get_account` (`include_credit_history=true`) as a dated ledger, not the balance.
4. For plans, plan changes or top-ups, say the user buys credits or
   changes plan on omneky.com (Ads Central).

## credit_insufficient

Nothing started and nothing was charged. Tell the user `required` and
`balance` in one line and that credits are added in the Omneky app.
Do not retry until they say they have enough.

Quote rules for creative jobs:
[creative-pricing-and-polling](references/creative-pricing-and-polling.md).

## Failure and recovery

Auth / 401 → `omneky-getting-started-and-failures` (host OAuth).
A billing tool is missing → say so; the user checks in the Omneky app.
Never invent a balance or a purchase tool.
`needs_user_decision` → fill the missing detail and call again.

## Gaps

Decline social inbox, landing pages, subtitle burn-in, email/SMS,
organic scheduling, Ad Library ads, try-on, and website builder
([capability-gaps](references/capability-gaps.md)).
