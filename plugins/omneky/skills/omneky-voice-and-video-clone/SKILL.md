---
name: omneky-voice-and-video-clone
description: >-
  Clone an Omneky speaker voice or a winning brand-library video. Use
  for clone voice or clone a winning video. Do not use for still
  image ads (omneky-image-ads), product video commercials
  (omneky-product-video), new avatar/UGC renders
  (omneky-avatar-ugc), edit or resize (omneky-edit-and-resize),
  ROAS-only (omneky-analytics-and-catalogue), competitor analysis
  (omneky-competitor-analysis), A/B tests (omneky-ab-tests),
  weekly plans (omneky-marketing-plan), first-run onboarding
  (omneky-onboarding), agency (omneky-agency), launch/connect
  (omneky-launch-and-connect), or credit-balance-only
  (omneky-billing).   Keywords: clone voice, clone a winning video,
  competitor video format, with our product, speaker sample.
---

# Voice clone and clone a winning video

Use this when the user wants to clone a voice from a speaker sample,
or remake a winning video for their product. One job: voice clone
and clone-a-winning-video. A new talking-head is `omneky-avatar-ugc`.

Gate on the clone tools being on `tools/list`; a missing tool → the
Omneky app.
Step detail: [playbook](references/playbook.md) (hard rules, voice
clone, clone a winning video).

Handoff fields: [handoff-contract](references/handoff-contract.md).
Sourced ids (how to obtain / what to do if absent): [preconditions](references/preconditions.md).
Quote, retry, and polls: [creative-pricing-and-polling](references/creative-pricing-and-polling.md).
Acceptance gates: [creative-quality-gates](references/creative-quality-gates.md).
Structured brief: [creative-brief](references/creative-brief.md).
QA and cheapest repair: [media-qa-and-repair](references/media-qa-and-repair.md).
Other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).

## Goal

Clone a consented voice or a winning library video onto our product. Not a new talking-head.

## When to use

- Clone voice, clone a winning video, competitor-format clone with our product

## When not to use

- New UGC talking-head → `omneky-avatar-ugc`
- Narrator on an uploaded file → decline (gap)

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| Brand | `list_brands` | Ask which |
| Consent (voice) | user yes | Stop |
| Voice sample | HTTPS `voice_url` | Ask for a public link; no upload |
| Voices list | `find_avatars_and_voices` (`include="voices"`) | Verify new id under cloned_voices |
| Clone source video | `list_creatives` | Stop if none eligible |
| Product | `get_products` | Create one; clone video always needs `product_id` |
| Cost | no quote tool; state the cost and proceed | Report credits actually charged (`credits_charged`) |

## Flow

**Voice clone**
1. Confirm the speaker consented to cloning.
2. State the cost and call `clone_voice`.
3. Verify the new voice in the `cloned_voices` list from `find_avatars_and_voices` (`include="voices"`).

**Clone a winning video**
1. Find the source with `list_creatives` (a library video,
   not a public file).
2. `get_video_metadata`, then `check_clone_video`.
3. State the cost (clone video is priced by length; the result
   reports `credits_charged`) and call `clone_video_ad` with
   `brand_id`, `product_id`, `video_url`, `locale`, `aspect_ratio`.
   Use only `approved_claims` from the handoff or the user; add
   `source_evidence` only for performance-informed work.
4. Poll, inspect against the quality gates, and deliver the URL.

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
