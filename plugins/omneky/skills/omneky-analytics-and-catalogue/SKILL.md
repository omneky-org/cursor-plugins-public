---
name: omneky-analytics-and-catalogue
description: >-
  Call get_products, import_product_from_url, and
  get_products by name (list my products, import this
  product URL, SKU, PDP). Also winning ads, ROAS, CTR, weekly
  performance report, HubSpot, and read-only budget
  reallocation. Do not use for first-run onboarding
  (omneky-onboarding), agency cross-brand (omneky-agency),
  competitor positioning (omneky-competitor-analysis), A/B
  tests (omneky-ab-tests), weekly marketing plans
  (omneky-marketing-plan), generating creatives, launch
  (omneky-launch-and-connect), or credit balance
  (omneky-billing). Keywords: list my products, import this URL,
  catalogue, SKU, PDP, which ads should I make more of, winning
  ads, ROAS drop, CPA drop, CTR, weekly performance report,
  fatigue refresh, budget reallocation, waste pruner, audience
  targeting, target CPA, HubSpot attribution, ABM, Semrush,
  Ahrefs.
---

# Ad performance and product catalogue

Use this when the user asks how their ads perform, which ads to make
more of, or wants to list or import products. One job: ranked
evidence and catalogue records. No render, no spend change.

Call tools by their exact names when they are on `tools/list`.
Catalogue tools are optional; if they are missing, say that
capability isn't available on this connector.

Handoff fields: [handoff-contract](references/handoff-contract.md).
Sourced ids (how to obtain / what to do if absent): [preconditions](references/preconditions.md).
Acceptance gates (for a later creative): [creative-quality-gates](references/creative-quality-gates.md).
Structured brief (for a later creative): [creative-brief](references/creative-brief.md).
Other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).

## Goal

Ranked evidence, catalogue records, and connector reads.

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Brand | `list_brands` | Ask which; do not invent |
| Coverage | `get_performance_summary` (`include_coverage=true`) | Say there is no imported data; do not report zeros |
| Winners / diagnosis | `get_performance_breakdown` / `get_performance_summary` / `get_performance_movers` | Narrow the window |
| Product | `get_products` when listed | Import via `import_product_from_url` (`url`), then `save_imported_product` (`draft_id`). If catalogue tools are not on `tools/list`, say that capability isn't available on this connector |
| HubSpot | `list_connections` (`connector="hubspot"`) | Skip CRM joins; say disconnected |
| Semrush / Ahrefs | matching status tool | Skip that source |
| Budget apply | (read-only here) | `omneky-launch-and-connect` (`set_ad_budget` / `set_ad_status`; the host confirms) |

## Flow

1. Resolve the brand and confirm coverage for the window.
2. Run the recipe the user asked for: winners, fatigue, weekly
   report, ROAS/CPA drop, waste pruner (evidence only), targeting
   evidence, target-CPA plan, HubSpot attribution, ABM brief, or
   catalogue import. Details: [playbook](references/playbook.md).
3. Lead with the answer (ROAS, CPA, CTR, spend, lift), one
   recommendation, and confidence.
4. When handing off to creative or a plan-driven launch, attach
   `source_evidence` (metric, window, channel, ad ids, sample size)
   and `approved_claims`, each with its source. Never invent a claim.

## When to use

- "Which ads should I make more of?", winning ads, next batch brief
- ROAS, CTR, CPA, spend, movers, daily paid-media charts
- List products / SKUs, or import a product URL before an ad
  (only when those catalogue tools appear on `tools/list`)

## When not to use

- Competitor positioning / messaging gaps
  (`omneky-competitor-analysis`)
- A/B test create or "which variant won" (`omneky-ab-tests`)
- Weekly marketing plan create / revise / poll / approve
  (`omneky-marketing-plan`)
- Generating the image or video (hand off to `omneky-image-ads` or
  `omneky-product-video`)
- Launching or connecting campaigns (`omneky-launch-and-connect`)
- Credit balance or plan upgrade (`omneky-billing`)
- First-run setup / first ad today (`omneky-onboarding`)
- Cross-brand / all clients (`omneky-agency`)
- No product-delete tool

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
