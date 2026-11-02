# Creative quality gates

Reference for the creative skills (`omneky-image-ads`,
`omneky-product-video`, `omneky-avatar-ugc`,
`omneky-voice-and-video-clone`, `omneky-edit-and-resize`). Read it after a render
or edit finishes and before you call the asset ready, hand it to
launch, or offer to launch it. It applies only when the connected
Omneky MCP server lists the generation, edit, or resize tool that
made the asset.

Two questions, answered separately:

1. **Technical success**: did the job produce the file that was
   asked for? (Completion checks in the matching creative skill
   already cover this.)
2. **Creative acceptance**: would this asset be fine to put in
   front of customers? Technical success never implies creative
   acceptance.

Report both. Say "rendered" for a technical pass. Say "ready to
launch" only after the creative gates below.

## When a check applies

Apply each check only when the element is requested, present in
the brief, or relevant to the asset type. Skip a check that does
not apply. A skipped check is not a failure and is not "not
observed".

Examples: captions only when speech or captions were requested
(an uncaptioned brief is not a failure); logo only when the brand
uses one; product visibility only for product ads. Brand-general
ads skip product-match checks.

## Technical success (observe, do not assume)

| Check | How observed | Severity |
|---|---|---|
| Job status is terminal success | `get_creative_status` reply (or the sync reply) | BLOCK |
| HTTPS URL loads | fetch the URL (HTTP 200, expected media type) | BLOCK |
| Dimensions / aspect | read from the fetched file, not from the request | BLOCK if not the approved aspect |
| Duration (video) | read from the fetched file, not `target_duration`. Skip for stills. | Pass if within 2s of the requested or approved length. WARN if off by more than 2s. BLOCK only when the user set an approved range and the file is outside it. |
| Brand match | brand name (and logo when the brand uses one) matches the chosen `brand_id` | BLOCK |
| Product match | product visible matches the chosen product. Product ads only. | BLOCK |
| Charge equals the cost you stated | only when the reply or `get_account` (`include_credit_history=true`) shows a charge | WARN (not a quality failure) |

## Creative acceptance

These checks are guidance for the host, not gates on the user.
BLOCK = a serious issue: fix it yourself first (one repair attempt)
when you can, otherwise show the result, name the issue in one line,
and recommend a revision. If the user wants to proceed anyway, that
is their call — proceed without asking them to restate it. WARN =
mention it briefly and carry on.

### Images

| Check | Severity |
|---|---|
| Headline and CTA readable at feed size (about 400 px wide) | BLOCK when headline or CTA was requested or is in the brief |
| Logo present when the brand uses one, not stretched, cropped, or recolored | BLOCK. Skip when the brand has no logo. |
| Packaging text, label, and product shape match the catalogue image from `get_products` | BLOCK. Product ads only. |
| No claim the user or source did not provide (prices, discounts, "clinically proven", rankings, awards) | BLOCK |
| Safe margins: key text and product survive the placement crop (1:1, 4:5, 9:16 UI overlays) | BLOCK for text cut off; WARN for tight margins |
| No artifacts: garbled text, extra or fused fingers, melted edges, duplicated objects | BLOCK when on the product or headline; WARN elsewhere |
| Contrast: text against its background is legible | BLOCK if unreadable; WARN if marginal |

### Product videos

| Check | Severity |
|---|---|
| Product visible by 2 s | WARN (skip when the concept uses a later reveal). Product ads only. |
| Hook (the first 3 s says or shows why to watch) | WARN |
| Captions readable on mobile and timed to speech | Apply only when speech or captions were requested. An uncaptioned brief is not a failure — skip this check. BLOCK if speech or captions were requested and then missing; WARN if late by more than 0.5 s. |
| Narration audible and matches the script | BLOCK when a spoken script was requested |
| Duration observed matches the request | see technical table |
| First and last frames are not frozen or broken | BLOCK |
| Audio track present when expected (narration or music) | Apply only when narration or music was requested. BLOCK for missing requested narration; WARN for missing requested music. |
| Pacing: no static shot longer than 3 s unless intended | WARN |
| Same artifact and claim checks as images, per frame sampled | as images |

### Avatar / UGC ads

| Check | Severity |
|---|---|
| Identity stays the same person for the whole clip | BLOCK |
| Lip sync plausible (no clear drift) | BLOCK for obvious drift; WARN for minor |
| Spoken line equals the approved script | BLOCK when a spoken line was requested |
| Voice clone: speaker consent confirmed before the clone | BLOCK (already required by the voice-clone skill) |

On-screen person: a stock avatar, or a brand-asset image of a person who has consented to appear.
Do not use a photo of anyone else. Voice cloning still requires speaker consent
(see the voice-clone skill).

### Edit and resize

| Check | Severity |
|---|---|
| Content you did not target is unchanged (logo, product, other text) | BLOCK |
| Output aspect is the approved aspect (read dimensions) | BLOCK |
| Edited text matches the requested wording exactly | BLOCK when text was edited |
| Resize: key text and product still inside safe margins | BLOCK for cut off; WARN for tight. Product-margin part is product ads only. |

## How to inspect

- Fetch the URL and, when the host can open images or video frames,
  look at the asset. For video, sample at 0-1 s, 2 s, mid, and the
  final second, and read the audio and caption track if the host
  exposes them.
- Compare against the source of truth: the catalogue image and copy
  from `get_products` when the work is product-specific, the
  approved script or `ad_concept`, and the approved claims.
- If the host cannot open the media, say which checks you could not
  observe (for example "I could not view the frames, so headline
  legibility and logo shape are not confirmed"). State only what
  you observed. Never say a check passed that you did not observe.
  If a detail that matters is still not confirmed after one fetch,
  say so in one short plain sentence (for example, "I couldn't
  confirm the exact length"). Do not hedge a confirmed result. Do
  not call the asset ready to launch with any applicable BLOCK
  check unobserved unless that check is in `accepted_exceptions`.
- Report results as short lists: passed (observed), failed, not
  observed, `accepted_exceptions`. Name the field and the observed
  value for each failure.

## Override rule

The user can accept any BLOCK or WARN by simply saying to go ahead
(or by asking to launch after seeing the issue). Do not ask them to
confirm again. Record it on `quality_result` as
`accepted_exceptions` (the check name and the user's wording).

The handoff contract accepts an asset with recorded
`accepted_exceptions`. Do not treat a recorded exception as a
failed BLOCK.

## When a gate fails

- Show the asset and the failed checks, one line each.
- Repair with [media-qa-and-repair.md](media-qa-and-repair.md):
  cheapest valid tool first (`edit_image` / `resize_creative` /
  `resize_creative` (`width` + `height`) before a new generate), one guided attempt, then
  stop. Never silently report success.
- A new generation, edit, or resize is a new paid action: state
  its cost, proceed, and use a new generation id. Do not regenerate
  silently, and do not retry a job that may still be running.
- Never reuse a completed job id to repair it. Never resubmit a
  charged job blindly.
- If the user asks to launch after seeing the issue, treat that as acceptance and continue.
- Hand off to the launch skill only with the accepted asset and the
  fields in [handoff-contract.md](handoff-contract.md). Show the
  user a concise plain-language summary, not the raw handoff.
