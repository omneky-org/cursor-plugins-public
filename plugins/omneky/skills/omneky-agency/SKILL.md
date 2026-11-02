---
name: omneky-agency
description: >-
  Agency multi-brand Omneky work. Use for a weekly cross-brand
  report (per-client summaries) or a multi-brand campaign rollout
  with per-brand confirmation. Never silent-switch brands. Do not
  use for a single-brand ROAS table
  (omneky-analytics-and-catalogue), first-run onboarding
  (omneky-onboarding), competitor analysis
  (omneky-competitor-analysis), A/B tests (omneky-ab-tests), or
  credit balance (omneky-billing). Keywords: weekly cross-brand
  report, per-client summary, multi-brand rollout, agency
  clients, all brands this week.
---

# Agency multi-brand work

Use this when an agency operator wants numbers or a rollout across
several client brands. One job: cross-brand reports and rollouts,
one brand at a time. A single brand goes to
`omneky-analytics-and-catalogue` or the matching creative or launch skill.

Gate every tool on this session's `tools/list`; a missing tool → the
Omneky app. Never ask for internal ids.

Handoff fields: [handoff-contract](references/handoff-contract.md).
Sourced ids: [preconditions](references/preconditions.md).
Acceptance gates: [creative-quality-gates](references/creative-quality-gates.md).
Other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).

## Goal

Per-client numbers and a safe multi-brand rollout. Never switch
brands silently.

## When to use

- Weekly cross-brand / per-client report
- Multi-brand campaign rollout
- "All my clients this week"

## When not to use

- One brand's ROAS / movers → `omneky-analytics-and-catalogue`
- First-run setup → `omneky-onboarding`
- Credit ledger → `omneky-billing`
- Sign-in only → `omneky-getting-started-and-failures`

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Session | `get_account` | Host OAuth reconnect |
| Brand list | `list_brands` | No brands → Omneky app. Do not invent |
| Reporting coverage | `get_performance_summary` (`include_coverage=true`) per `brand_id` | Skip that brand; empty is not zero |
| Metrics | `get_performance_breakdown` / `get_performance_summary` / `get_performance_movers` | Narrow the window; do not invent ROAS |
| Launch apply | matching `launch_*` tool / `set_ad_budget` / `set_ad_status` | Name the brand first; the host confirms. Status as asked |

## Flow

### weekly-cross-brand-report

1. `list_brands`. Show the name + id list. Confirm the set
   (or the named subset) before any metric call.
2. For each confirmed `brand_id`:
   - `get_performance_summary` (`include_coverage=true`)
   - `get_performance_breakdown` (winners / spend)
   - `get_performance_movers` when they asked what changed
   - `get_performance_summary` when they asked for the chart
3. Thin samples: "too little data to conclude" + the numbers.
4. Deliverable: one short card per client (spend, ROAS, CTR,
   mover, recommendation) and a one-line roll-up. Confidence =
   coverage + sample size per brand.

### multi-brand-rollout

1. Resolve the brand set from `list_brands`. One brand per cycle.
2. Name the brand and id before generating or launching for it. Never reuse one brand's id for another.
3. Creative / launch follow those skills. Set `campaign_spec.status_on_launch` as asked (no server default).
   Pass each brand's own `brand_id`.
4. Deliverable: per-brand status table (quoted, generated,
   launched `PAUSED`, skipped).

## Failure and recovery

Auth / 401 → `omneky-getting-started-and-failures`.
One brand empty → skip it; do not pull another brand's rows
to fill the card.
`status=timeout` → narrow that brand's window; do not retry
the identical call this turn.
`credit_insufficient` → stop that brand and state the shortfall
(`omneky-billing`). Carry on with the other brands.

## Gaps

No agency inbox, no organic scheduler, no cross-account
login. See
[capability-gaps](references/capability-gaps.md).
