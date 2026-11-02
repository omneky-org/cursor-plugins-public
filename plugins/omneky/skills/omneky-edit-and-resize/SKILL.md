---
name: omneky-edit-and-resize
description: >-
  Edit a finished Omneky image or resize it for a placement. Use for
  an edit, resize, Reels, Stories, 1:1, 4:5, or 9:16. Do not use for
  a brand-new image concept (omneky-image-ads), product video
  (omneky-product-video), avatar/UGC (omneky-avatar-ugc), voice or
  video clone (omneky-voice-and-video-clone), ROAS-only
  (omneky-analytics-and-catalogue), competitor analysis
  (omneky-competitor-analysis), A/B tests (omneky-ab-tests),
  weekly plans (omneky-marketing-plan), first-run onboarding
  (omneky-onboarding), agency (omneky-agency), launch/connect
  (omneky-launch-and-connect), or credit-balance-only
  (omneky-billing). Keywords: edit ad, resize ad, Reels, Stories,
  1:1, 4:5, 9:16, hero to every placement.
---

# Edit and resize

Use this when the user wants a finished still changed or resized for
other placements (Reels, Stories, 1:1, 4:5, 9:16). One job: edit and
resize existing stills. A new concept is `omneky-image-ads`.

Gate on `edit_image`, `resize_creative` and `resize_creative` (`width` + `height`) being on
`tools/list`; a missing tool → the Omneky app.
Step detail: [playbook](references/playbook.md) (hard rules, edit,
resize).

Handoff fields: [handoff-contract](references/handoff-contract.md).
Sourced ids (how to obtain / what to do if absent): [preconditions](references/preconditions.md).
Quote, retry, and polls: [creative-pricing-and-polling](references/creative-pricing-and-polling.md).
Acceptance gates: [creative-quality-gates](references/creative-quality-gates.md).
QA and cheapest repair: [media-qa-and-repair](references/media-qa-and-repair.md).
Other intents: [capability-registry](references/capability-registry.md).
Write for: [marketer-persona](references/marketer-persona.md).

## Goal

Fix a finished still or explode one hero into every channel size.

## When to use

- Edit headline, resize, hero-to-every-placement, Reels / Stories / 1:1 / 4:5 / 9:16

## When not to use

- New concept → `omneky-image-ads`
- Video edit → decline (gap)

## Prerequisites

| Need | Check | If missing |
|---|---|---|
| HTTPS still | prior generate URL | Ask for a public link; no upload |
| Cost | no quote tool; state the cost and proceed | Report credits actually charged (`credits_charged`) |
| Edit | `edit_image` | Say edit is not on this connector |
| Resize | `resize_creative` / `resize_creative` (`width` + `height`) | Say resize is not on this connector |

## Flow

1. Resolve the finished image URL from the conversation or
   `list_creatives`.
2. Edit: `edit_image` with `images` (HTTPS URLs) and a `prompt`.
   Edited text must match the requested wording exactly.
   New claims come only from `approved_claims`; plain edits need no
   `source_evidence`.
3. Resize: `resize_creative` once per remaining ratio.
4. State the cost and proceed; these tools charge on each call, so
   never auto-retry one.
5. Check each result against the image gates and deliver one URL per
   placement.

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
