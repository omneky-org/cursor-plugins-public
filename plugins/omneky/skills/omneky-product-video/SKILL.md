---
name: omneky-product-video
description: >-
  Create Omneky multi-scene product video ads from the brand
  catalogue. Use for a video commercial, pick-a-story, or Generate
  Now. Do not use for still image ads (omneky-image-ads),
  avatar/UGC (omneky-avatar-ugc), voice or video clone
  (omneky-voice-and-video-clone), edit or resize
  (omneky-edit-and-resize), ROAS-only
  (omneky-analytics-and-catalogue), competitor analysis
  (omneky-competitor-analysis), A/B tests (omneky-ab-tests),
  weekly plans (omneky-marketing-plan), first-run onboarding
  (omneky-onboarding), agency (omneky-agency), launch/connect
  (omneky-launch-and-connect), or credit-balance-only
  (omneky-billing). Keywords: product video ad, video commercial,
  product launch video, explainer video, professional video,
  faceless product video, turn this product URL into video ads,
  Generate Now, revise narrative, re-pick story.
---

# Product video ads

Use this when the user wants a video ad for a product: a story-driven
spot, a launch or explainer video, a faceless product video, or a
video from their own script. One job: product video ads.

Gate on `plan_product_video` and `generate_product_video`
being on `tools/list`; a missing tool → the Omneky app.
Step detail: [playbook](references/playbook.md) (hard rules, pick a
story, Generate Now, revision, inspect, faceless, launch video).

Handoff fields: [handoff-contract](references/handoff-contract.md).
Sourced ids (how to obtain / what to do if absent): [preconditions](references/preconditions.md).
Quote, retry, and polls: [creative-pricing-and-polling](references/creative-pricing-and-polling.md).
Acceptance gates: [creative-quality-gates](references/creative-quality-gates.md).
Structured brief: [creative-brief](references/creative-brief.md).
QA and cheapest repair: [media-qa-and-repair](references/media-qa-and-repair.md).
Other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).

## Goal

Ship a product-launch, explainer, faceless, or professional video from a narrative pick or Generate Now.

## When to use

- Product video, explainer, launch video, faceless, professional commercial, Generate Now, revise narrative

## When not to use

- Talking-head UGC → `omneky-avatar-ugc`
- Stills → `omneky-image-ads`
- Animation / hero-spin → decline (gap)

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Brand | `list_brands` | Use the best match |
| Product + images | `get_products` | Import it yourself (`import_product_from_url` (`url`), or web search) |
| Narratives | `plan_product_video` | Optional; skip when a script is given |
| Generate | `generate_product_video` | Say product video is not on this connector |
| Professional | `generate_professional_video_ad` | Skip that recipe if unlisted |
| Cost | no quote tool; say it uses credits | State the cost and proceed; `credit_insufficient` → add credits on omneky.com |

## Flow

1. Product video is product-specific: pass `product_id` (look it up
   with `get_products`).
   Take `approved_claims` from the handoff, product page, or
   catalogue; leave out a claim you cannot source. Add
   `source_evidence` only for performance-informed work.
2. Get story cards with `plan_product_video` and pick the
   best one yourself, unless the user gave a script or said "just
   generate" (Generate Now omits both narrative fields).
3. Pass the picked `narrative_id`. `narrative_unresolved` → re-fetch
   and pick again; never fall back to Generate Now.
4. State the cost and call `generate_product_video`. Do not ask for a
   yes first.
5. Poll the returned `job_id` within the bounds in the pricing
   reference, then inspect against the quality gates.
6. Deliver the URL, the story used, and the next step.

A hero spin or product animation is not a commercial. A YouTube
title, description, or chapters pack is not offered; decline it.

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
