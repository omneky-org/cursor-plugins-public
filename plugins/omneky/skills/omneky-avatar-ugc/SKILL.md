---
name: omneky-avatar-ugc
description: >-
  Create Omneky avatar and UGC talking-head video ads, including
  ugc-review (truthful claims only), ugc-unboxing (reveal arc),
  ugc-tutorial (demonstrable steps), and ugc-website-demo (accurate
  UI evidence). Use for an avatar video or talking-head ad. Do not
  use for still image ads (omneky-image-ads), product video
  commercials (omneky-product-video), voice or video clone
  (omneky-voice-and-video-clone), edit or resize
  (omneky-edit-and-resize), ROAS-only
  (omneky-analytics-and-catalogue), competitor analysis
  (omneky-competitor-analysis), A/B tests (omneky-ab-tests),
  weekly plans (omneky-marketing-plan), first-run onboarding
  (omneky-onboarding), agency (omneky-agency), launch/connect
  (omneky-launch-and-connect), or credit-balance-only
  (omneky-billing). Keywords: avatar video, UGC talking-head,
  talking-head ad, founder video, spokesperson, localized ad
  set, ugc-product, ugc-review, ugc-unboxing, ugc-tutorial,
  ugc-website-demo, testimonial avatar.
---

# Avatar and UGC talking-head ads

Use this when the user wants a talking-head ad: founder or
spokesperson, a localized voice, or a UGC genre (review, unboxing,
tutorial, website demo). One job: avatar and UGC video ads.

Gate on `find_avatars_and_voices` (`include="filters"`), `find_avatars_and_voices` (`include="avatars"`), `find_avatars_and_voices` (`include="voices"`) and
`generate_avatar_video_ad` being on `tools/list`; if a step's tool is
missing, say so and point to the Omneky app.
Step detail: [playbook](references/playbook.md) (hard rules, avatar
video ad, UGC genre recipes).

Handoff fields: [handoff-contract](references/handoff-contract.md).
Sourced ids (how to obtain / what to do if absent): [preconditions](references/preconditions.md).
Quote, retry, and polls: [creative-pricing-and-polling](references/creative-pricing-and-polling.md).
Acceptance gates: [creative-quality-gates](references/creative-quality-gates.md).
Structured brief: [creative-brief](references/creative-brief.md).
QA and cheapest repair: [media-qa-and-repair](references/media-qa-and-repair.md).
Other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).

## Goal

Ship a talking-head: founder/spokesperson, localized voice, or a UGC genre. On-screen person: a stock avatar, or a brand-asset image of a person who has consented to appear. Voice clone is a sibling skill.

## When to use

- Avatar / UGC / founder / spokesperson / localized talking-head / ugc-product / review / unboxing / tutorial / website-demo

## When not to use

- Clone a winning video → `omneky-voice-and-video-clone`
- Faceless product video → `omneky-product-video`
- Virtual try-on → decline (gap)

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Brand | `list_brands` | Ask which |
| Avatars | `find_avatars_and_voices` (`include="filters"`) + `find_avatars_and_voices` (`include="avatars"`) | Custom HTTPS face allowed |
| Voices / locale | `find_avatars_and_voices` (`include="voices"`) | Omit `voice_id`, or `clone_voice` after consent in `omneky-voice-and-video-clone` |
| Product still | `get_products` | Omit `product_image_url` |
| Cost | no quote tool; state the cost and proceed | Report credits actually charged (`credits_charged`) |
| Generate | `generate_avatar_video_ad` | Say avatar video is not on this connector |

## Flow

1. Fill the brief. Take `approved_claims` from the handoff, product
   page, catalogue, or the user's words; leave out any claim you
   cannot ground. Pass `product_id` for product ads.
   Otherwise: brand-general work passes `brand_id` only.
   Add `source_evidence` only for performance-informed work.
2. Pick the face and the voice with one
   `find_avatars_and_voices` call (stock or custom portraits, voices;
   one voice per language for localized).
3. State the cost and call `generate_avatar_video_ad`. Do not ask for
   a yes first.
4. Poll within the bounds in the pricing reference, then check the
   result against the quality gates.
5. Deliver the URL, the spoken line, claim sources, and confidence.

On-screen person: use a stock avatar, or a brand-asset image of a person who has consented to appear in the ad. Do not use a photo of anyone else. Cloning a voice needs speaker consent and
belongs in `omneky-voice-and-video-clone`.

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
