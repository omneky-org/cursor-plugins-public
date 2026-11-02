---
name: omneky-image-ads
description: >-
  Create Omneky branded image ads from the brand catalogue. Use for a
  product image ad, a brand-general still, a hero still, a
  before/after still, or N distinct stills from winning creatives
  (each variant is one hypothesis: source ad, what stays, what
  changes, which metric). Do not use for product video
  (omneky-product-video), avatar/UGC (omneky-avatar-ugc), voice or
  video clone (omneky-voice-and-video-clone), edit or resize
  (omneky-edit-and-resize), ROAS-only
  (omneky-analytics-and-catalogue), competitor analysis
  (omneky-competitor-analysis), A/B tests (omneky-ab-tests),
  weekly plans (omneky-marketing-plan), first-run onboarding
  (omneky-onboarding), agency (omneky-agency), launch/connect
  (omneky-launch-and-connect), or credit-balance-only
  (omneky-billing). Keywords: branded ads, image ad, generate image
  ads for this product, next batch, hero still, seasonal promo
  kit, hero to every channel size, before/after, thumbnail still,
  stills of one concept, distinct hypotheses.
---

# Branded image ads

Use this when the user wants a branded still: a hero shot, a seasonal
kit, a thumbnail, or new variations of a winning ad. One job: finished
stills. Launching is `omneky-launch-and-connect`.

Gate on `generate_image_ad` being on `tools/list`; if it is missing,
say image ads aren't available here and point to the Omneky app.
Step detail: [playbook](references/playbook.md) (hard rules, brand and
product context, image ad, creative strategy, next batch).

Handoff fields: [handoff-contract](references/handoff-contract.md).
Sourced ids (how to obtain / what to do if absent): [preconditions](references/preconditions.md).
Quote, retry, and polls: [creative-pricing-and-polling](references/creative-pricing-and-polling.md).
Acceptance gates: [creative-quality-gates](references/creative-quality-gates.md).
Structured brief: [creative-brief](references/creative-brief.md).
QA and cheapest repair: [media-qa-and-repair](references/media-qa-and-repair.md).
Other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).

## Goal

Ship decision-ready stills: hero, seasonal kit, thumbnail, N winner hypotheses. No launch here.

## When to use

- Branded still, hero, before/after, thumbnail, seasonal kit, N hypotheses
- Several stills of one concept

## When not to use

- Product / faceless video → `omneky-product-video`
- UGC talking-head → `omneky-avatar-ugc`
- Resize only → `omneky-edit-and-resize`
- Launch → `omneky-launch-and-connect`

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Brand | `list_brands` | Ask which |
| Product (product ad) | `get_products` | Import via `omneky-analytics-and-catalogue` or `omneky-onboarding` |
| Cost | no quote tool; state the cost and proceed | Report credits actually charged (`credits_charged`) |
| Credits | `get_account` | `omneky-billing` |
| Generate | `generate_image_ad` | Say image ads are not on this connector |

## Flow

1. Fill the structured brief. Take `approved_claims` from the
   handoff, product page, catalogue, or the user's words; leave out
   any claim you cannot ground. Pass `product_id` for product work
   (check `get_products`).
   Brand-general work passes `brand_id` only.
   Direct mode (no saved product, no import): pass `brand_id`,
   `ad_concept`, and the user's HTTPS image URL in `user_assets`.
2. State the cost and call `generate_image_ad`. Several different
   ads in one ask: when `generate_image_ad` lists a `concepts` input,
   send them all (up to 3, each with a short `title` and its
   `ad_concept`) in **one** call so one widget shows every tile.
   Otherwise call it once per concept, with a new `gpt_ad_gen_id`
   per variant. Do not ask for a yes first.
3. Poll within the bounds in the pricing reference. On a timeout,
   reuse the same `gpt_ad_gen_id`; never mint a new one.
4. Inspect against the quality gates; fix with the cheapest repair.
5. Seasonal kit: one brief, then resize per placement through
   `omneky-edit-and-resize`.
6. Show the asset URL, the cost, and the next step (launch `PAUSED`
   or iterate).

Do not generate a product video or talking-head here.

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
