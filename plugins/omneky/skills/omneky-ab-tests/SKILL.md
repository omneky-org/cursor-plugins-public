---
name: omneky-ab-tests
description: >-
  Create or measure an Omneky paid-media A/B test. Use for A/B
  test creation (one hypothesis, one variable, precommitted
  plan, launch live or paused as the user chooses) or A/B test measurement (z-test, CI,
  power, SRM, interim peek with no verdict, refuse a thin
  winner). Do not use for generic ROAS tables
  (omneky-analytics-and-catalogue), competitor analysis
  (omneky-competitor-analysis), first-run onboarding
  (omneky-onboarding), agency (omneky-agency), weekly marketing
  plans (omneky-marketing-plan), generating creatives
  (omneky-image-ads, omneky-product-video, omneky-avatar-ugc),
  or credit balance (omneky-billing). Keywords: A/B test,
  ab test create, ab test measurement, which variant won,
  significance, two-proportion z-test, MDE, SRM, interim peek,
  underpowered, commercially meaningful, budget split.
---

# A/B tests

Use this when the user wants to set up an A/B test or read out which
variant won. One job: own the test plan and the readout.

Gate every tool on this session's `tools/list`. If a step's tool is
missing, say so and point to the Omneky app.

Plan fields: [handoff-contract](references/handoff-contract.md).
Formulas: [ab-test-statistics](references/ab-test-statistics.md).
Sourced ids: [preconditions](references/preconditions.md).
Acceptance gates: [creative-quality-gates](references/creative-quality-gates.md).
Brief: [creative-brief](references/creative-brief.md).
Other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).
Step detail: [playbook](references/playbook.md) (Hard rules, Create, Measure).

## Goal

Create a one-variable test with a precommitted plan (live or paused is
the user's choice in the host), or
measure it with a two-proportion z-test and a marketer verdict.

## When to use

- Create an A/B test, measure one, "which variant won", significance,
  stop rule, interim peek, SRM, MDE

## When not to use

- Generic ROAS table → `omneky-analytics-and-catalogue`
- Launch without a test plan → `omneky-launch-and-connect`

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Brand | `list_brands` | Ask which |
| Channel | `list_connections` (`connector`) | Connect or managed |
| Budget floor | `get_launch_requirements` | Do not launch under the floor |
| Variants | prior creative handoff | Owning creative skill |
| Baseline | `get_performance_summary` with `date_range` | State an assumed `baseline_rate` |
| Coverage (measure) | `get_performance_summary` (`include_coverage=true`) | Do not declare a winner |
| Metrics (measure) | `get_performance_breakdown` / `get_performance_summary` | Narrow the window |

## Flow

**Create**
1. Write one hypothesis with one changed variable.
2. Record metric, MDE, duration (`horizon`) and stop rule before launch.
3. Budget at or above the floor. One ad group with one ad per variant
   does not guarantee an even spend split (delivery is auction-driven);
   say so. For an even split, use one ad group (or campaign) per variant
   with equal budgets, or the platform's A/B / split-test feature.
4. Launch through `omneky-launch-and-connect`, live or paused as the
   user chose (the host confirms).

**Measure**
1. Confirm coverage for the window; empty is missing data, not zero.
2. Run the setup check on every look (broken setup; SRM only for a
   randomized planned allocation, not default auction delivery). If it
   fails, give the verdict Invalid at once and recommend a pause.
   Never mutate here.
3. Before `horizon`, report INTERIM with no statistical verdict.
4. At `horizon`, run the z-test and give one verdict: Winner, Not
   commercially meaningful, Inconclusive, or No detectable difference.
5. Refuse a winner when the sample is thin.

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
There is no sequential-testing platform tool. Early stop is
acknowledgement + correction, or not supported.
