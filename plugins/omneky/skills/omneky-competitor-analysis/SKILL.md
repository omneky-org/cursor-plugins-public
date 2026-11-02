---
name: omneky-competitor-analysis
description: >-
  Analyze competitors and brand positioning with Omneky. Use for
  competitor analysis, positioning, messaging angles, messaging
  gaps, or a competitive brief that cites Semrush, Ahrefs,
  analyze_brand, or a scraped PDP. Every claim must cite its
  evidence source. Do not use for ROAS / winning-ads tables
  (omneky-analytics-and-catalogue), A/B tests (omneky-ab-tests),
  first-run onboarding (omneky-onboarding), agency
  (omneky-agency), weekly marketing plans
  (omneky-marketing-plan), generating creatives,
  launch/connect (omneky-launch-and-connect), or credit balance
  (omneky-billing). Keywords: competitor analysis, positioning,
  messaging angles, messaging gaps, competitive brief,
  keyword gaps, domain rating, backlinks, Semrush
  competitor, Ahrefs competitor.
---

# Competitor analysis

Use this when the user asks how competitors position themselves,
which angles to test, or where keyword and backlink gaps are. One
job: cited positioning, angles, and gaps that feed a creative brief.
ROAS tables stay in `omneky-analytics-and-catalogue`.

Gate every tool on `tools/list`; a missing tool → the Omneky app.
Step detail: [playbook](references/playbook.md) (hard rules, path).

Handoff fields: [handoff-contract](references/handoff-contract.md).
Sourced ids: [preconditions](references/preconditions.md).
Acceptance gates (for a later creative): [creative-quality-gates](references/creative-quality-gates.md).
Structured brief (output of this skill): [creative-brief](references/creative-brief.md).
Other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).

## Goal

Cite positioning, keyword/query gaps, and domain-rating/backlink checks that feed a creative brief.

## When to use

- Competitor analysis, positioning, messaging gaps, Semrush/Ahrefs keyword gaps, domain rating / backlinks

## When not to use

- Paid ROAS tables → `omneky-analytics-and-catalogue`
- Meta Ad Library competitor ads → decline (gap)

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Brand | `list_brands` | Ask which |
| Analysis | `analyze_brand` | Call it |
| Semrush | `list_connections` (`connector="semrush"`) | Skip Semrush |
| Ahrefs | `list_connections` (`connector="ahrefs"`) | Skip Ahrefs |
| PDP copy | `import_product_from_url` (`url`) | Ask for one product URL |

## Flow

1. Check each source's connection status (Semrush, Ahrefs,
   HubSpot). Skip a disconnected source.
2. Pull both sides of every comparison before stating a gap.
3. Cite every claim with its source.
4. Lead with the angles worth testing, then the gaps, then confidence
   per source. Hand the brief to the creative skill.

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
