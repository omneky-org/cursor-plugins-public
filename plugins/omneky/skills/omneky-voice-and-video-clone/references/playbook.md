# Voice and video clone playbook

Detail for this skill's SKILL.md. Read the section the current step needs.

## Hard rules

- Stick to the chosen `brand_id`. Never silent-switch brands.
- State the cost and proceed; do not ask for a yes before a paid
  clone action. There is no quote tool: clone video is priced by
  length, so say the cost depends on the length, never present it
  as 0, and report what was charged after the run (`credits_charged`).
  A short balance returns `credit_insufficient` and starts nothing.
- Confirm speaker consent before calling `clone_voice`.
- Use only `video_url` from `list_creatives`.
- Stop the clone-video flow on pre-assessment `nsfw-error`.
- `clone_video_ad` always requires `brand_id`,
  `video_url`, `locale`, `product_id`, and `aspect_ratio`. If
  `product_id` is unknown, follow [preconditions](preconditions.md):
  list products, or create one and continue without restarting.
- No caller idempotency key on `clone_voice` or
  `clone_video_ad`. After an ambiguous timeout do
  **not** resubmit.

## Voice clone

Confirm speaker consent before calling.

1. `clone_voice` takes `brand_id` and `voice_url` (optional `name`).
   State the cost and proceed; leave `expected_credits` out.
   Synchronous — it returns `voice_id`. Do **not** poll
   `get_creative_status`.
2. Call `find_avatars_and_voices` (`include="voices"`) with `brand_id`. It returns a cloned_voices
   list — verify the new id there before saying it speaks in their
   voice.
3. After an ambiguous timeout do **not** resubmit. Check
   `find_avatars_and_voices` (`include="voices"`).

## Clone a winning video

1. `list_creatives` with `brand_id`. Pick a row the tool
   reports as clone_video_allowed true. Use only that row's
   `video_url`. If no row is eligible, stop and say so plainly.
   Do not invent a public video link.
2. `get_video_metadata` takes that `video_url`. Continue only when
   the result reports clone_video_allowed true (rounded duration
   4–30s).
3. `check_clone_video` takes `brand_id` and that `video_url`.
   Relay the questions and disclaimers. Stop if the result reports
   status nsfw-error.
4. Clone video is priced by length (`duration_s` from
   `get_video_metadata`). Say the cost depends on the length, never
   present it as 0, and report what was charged.
5. `clone_video_ad` always takes `brand_id`, that
   `video_url`, `locale`, catalogue `product_id`, `aspect_ratio`,
   and `user_answers_for_cloning` from the pre-assessment. Pass
   `duration_s` and `expected_credits` when those fields are listed
   (`duration_s` is overlay-only). Clone video is never
   brand-general `brand_id`-only.
6. After an ambiguous timeout do **not** resubmit. Check
   `list_creatives`. Poll
   `get_creative_status(job_id, kind="video")` once per
   Generation polls in the pricing reference (return the URL only on
   terminal success).

### competitor-format-clone

Only when `list_creatives` returns a
clone_video_allowed source. A competitor file we do not own
is a gap (no Ad Library / ingest). Decline that ask. Offer
clone a winning library video onto our product instead.

Then run technical success and the video gates.

Burning a cloned voice onto an **existing** video the user
uploaded is a capability gap (no mux / burn-in tool). Decline
that ask. `clone_voice` only returns a `voice_id`.

## Finished ad → launch

This skill does not launch. Hand a finished clone-video URL to
`omneky-launch-and-connect` with the rest of the handoff contract.
A new `voice_id` stays on the brand for later avatar work
(`omneky-avatar-ugc`).
