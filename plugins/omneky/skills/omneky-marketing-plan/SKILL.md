---
name: omneky-marketing-plan
description: >-
  Create, revise, poll, preview (exact credit quote + checklist), and
  track an Omneky marketing plan. This skill owns the weekly-plan
  loop. The host runs each listed step itself. Use when the user wants
  a weekly marketing plan, make me a plan, plan preview, or plan
  progress. Do not use for paid-media analysis or catalogue
  (omneky-analytics-and-catalogue), competitor analysis
  (omneky-competitor-analysis), A/B tests (omneky-ab-tests),
  first-run onboarding (omneky-onboarding), agency
  (omneky-agency), branded image/video creatives,
  launch/connect (omneky-launch-and-connect), or credits/plan
  upgrade (omneky-billing). Intent keywords: weekly marketing
  plan, make me a plan, marketing plan, plan preview, revise
  plan, approve plan.
---

# Omneky marketing plan

Use this when the user wants a weekly marketing plan created, revised,
checked, or run. One job: goal intake → create → revise → poll →
preview → state the cost and proceed (no approval gate; stop only
above a cap the user named). The host runs each listed plan step.

Gate on `analyze_brand`, `create_marketing_plan` and
`get_marketing_plan` being on `tools/list`; if missing, point to the
Omneky app.
Step detail: [playbook](references/playbook.md) (goal intake, loop,
pending polls, checks).

Branded stills → `omneky-image-ads`. Product video →
`omneky-product-video`. Avatar / UGC → `omneky-avatar-ugc`.
Voice or video clone → `omneky-voice-and-video-clone`. Edit /
resize → `omneky-edit-and-resize`.

Handoff fields: [handoff-contract](references/handoff-contract.md).
Sourced ids (how to obtain / what to do if absent): [preconditions](references/preconditions.md).
Acceptance gates (for a later creative): [creative-quality-gates](references/creative-quality-gates.md).
Other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).

## Goal

Author a weekly plan from a stated goal, preview the exact quote, state it, then host-run each listed step.

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Brand | `list_brands` | Ask which |
| Analysis | `analyze_brand` | Call it; draft only |
| Plan tools | `create_marketing_plan` / `get_marketing_plan` / `revise_marketing_plan` | Say plan tools are missing |
| Preview quote | `preview_marketing_plan_execution` | Do not run steps without this preview |

## Flow

1. Take the goal, budget, and window; ask only for what is missing.
2. `analyze_brand`, then `create_marketing_plan`.
3. Poll `get_marketing_plan` (`plan_id`) within the bounds in the playbook.
4. Revise with `revise_marketing_plan` until the user is happy.
5. `preview_marketing_plan_execution`, state the cost, and let the
   host run each listed step.
6. Deliver plan id, checklist, step status, and confidence.

When the plan feeds a later creative, hand over `source_evidence` and
`approved_claims` in the handoff (not as tool arguments).

## When to use

- Weekly marketing plan / "make me a plan"
- Revise, preview, or mark plan-step progress

## When not to use

- Not paid-media analysis, ROAS, or catalogue import
- Not a standalone image-ad or product-video generate call
- Not live spend or go-live
- Not launch/connect or credit-balance / plan upgrade

## Intent keywords

weekly marketing plan, make me a plan, marketing plan, plan preview,
revise plan

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
