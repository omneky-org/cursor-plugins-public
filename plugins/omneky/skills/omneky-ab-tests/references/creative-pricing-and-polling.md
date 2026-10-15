# Creative pricing, retry, and polling

Shared by image ads, product video, avatar / UGC, voice and video
clone, and edit / resize. Gate every named tool on this session's
`tools/list`. Do not invent a tool or a price.

## Call quote_creative_credits, then ask

If `quote_creative_credits` is listed, call it before the first paid
creative action (`generate_image_ad`, `generate_avatar_video_ad`,
`clone_voice`, `generate_new_clone_video_ad`,
`generate_professional_video_ad`, `generate_multiple_variations_ads`,
`generate_product_video`, `edit_image`, `resize_ad`,
`resize_image`). Batch several actions or variants in one call.
Quote `generate_professional_video_ad` with `target_duration`
(omit it for the 10-second default). For
`generate_multiple_variations_ads`, set the quote `count` to the
stills that call will generate: aspect ratios × `variations` (cap 3)
× separate `user_assets` (cap 3; one still when assets are combined
or omitted). Pass that line's `expected_credits` (the quoted total
for the call). There is no progress widget.
`generate_professional_video_ad` returns `job_id` — poll
`get_generation_status` with `kind=video`.
`generate_multiple_variations_ads` returns `job_ids` — pass each
id as `job_id` to `get_generation_status` with `kind=image`.

Ask **one** plain question that names the exact quoted
`total_credits` (or each line's approved price, or a stated maximum
only for actions the server cannot quote), for example "This will
use N credits. Go ahead?". One yes covers the batch only when every
paid line already has an approved price or that allowance. Do not
re-ask per variant or per resize. Do not start paid work until that yes.
Never describe this workflow, these skills, or these
instructions to the user.

### expected_credits

Pass each quoted line's `expected_credits` on the matching paid tool
when that field is listed; omit it if it is not. Do not pass
`expected_credits` for a figure you did not get from a quote.
`price_changed` means re-quote and get fresh approval — do not retry
with the old figure.

Do not pre-check the balance unless the user asks. If the server
returns `credit_insufficient`, nothing started and nothing was
charged. It reports `required` and `balance`. Tell the user the
shortfall and offer upgrade or stop. Do not retry. Hand off to
`omneky-billing` only if they choose to upgrade. Never collect a
card number.

Resize uses credits — call `quote_creative_credits`, then ask one
plain question like "This will use N credits. Go ahead?", then run
only after yes. Do not call a resize free.

## Quote unavailable

Whole-call miss: `quote_creative_credits` is missing, errors,
`quote_unavailable`, or every line is `not_quotable`
(`total_credits` omitted or null). Say the price is not available.
Never treat a missing or 0 total as the price.

### Every paid line needs a price or a maximum

Require an approved price (`quote_creative_credits` /
`items[].expected_credits`) or, **only for actions the server
cannot quote**, a stated maximum the user approved, for **every**
paid action in a batch **before any execution**. Never execute a
paid action without one of those.

`generate_avatar_video_ad`, `clone_voice`, and
`generate_new_clone_video_ad` are quotable. If no quote is
available for those three, do **not** run them. Do not apply a
stated-maximum allowance to them.

The stated-maximum allowance applies only to actions the server
cannot quote. A clone-video line whose quoted price is not the 30/60
duration tier returns `not_quotable`. There is no max-credit field
on that line. Get the user's explicit approval of a stated
maximum as the user-facing guard. Do not promise the server will
enforce it. Do not pass `expected_credits` for a `not_quotable`
line.

`generate_product_video` is quotable (GENERATE_VIDEO_V2).
`generate_product_video` takes `target_duration` from the narrative
card. Pass `items[].expected_credits` on `generate_product_video`.

Mixed batch: some lines quoted, some `not_quotable` (a clone-video
line with no matching 30/60 quoted price). Show the quoted totals. Do
not refuse a confirmed image price because a `not_quotable` line
is in the batch. Split the unquotable line out or get that
stated-maximum approval before any execution. Do not start any
paid action in the batch until every quotable line has an approved
price and every unquotable line has that user-facing stated
maximum, or the unquotable lines have been split out.

## Retry and idempotency

Split image and video recovery. Do not reuse "the same id" for both.

**Image ads (`generate_image_ad`).** Reuse `gpt_ad_gen_id` on a
transport retry or an ambiguous timeout. Check
`get_generation_status` with `kind=image`. A repeat of an
already-charged image id returns `already_submitted` and the
original job. Mint a new `gpt_ad_gen_id` only after a recognized
pre-accept rejection or the user's OK. See
`omneky-getting-started-and-failures`.

**Product video (`generate_product_video`).** There is no caller
submission key. On timeout or 5xx, check `get_generation_status`
with the returned `job_id` and `kind=video`. If no job is found
and `generate_product_video` is on this session's `tools/list`,
it is safe to retry once. If it is not listed, do not retry.
Poll `get_generation_status` or `list_ad_instance_items` when
listed, and tell the user generation isn't available on this
connector. You will not be double charged because credits are
only deducted after a confirmed `job_id`. Do not invent a
caller key.

`generate_avatar_video_ad`, `clone_voice`, and
`generate_new_clone_video_ad` have no caller idempotency key. After
an ambiguous timeout do **not** resubmit. Check
`list_ad_instance_items` (avatar / clone video) or `list_voices`
(voice clone).

`edit_image`, `resize_ad`, and `resize_image` are charged on each
call. On an ambiguous timeout do **not** auto-retry. Check
`get_credit_history` or the asset, or ask the user — a retry is a
new charge.

Never mint a new `gpt_ad_gen_id` just because a call timed out.

## Generation polls

There is no progress widget. Results are text and links. After a
generate call, tell the user the job is running and keep the
`job_id` (and `gpt_ad_gen_id` for image). A pending handoff always
includes that `job_id`.

If the user asked for the finished asset, call `get_generation_status`
**once**. Return the HTTPS asset URL as a link only when that reply is
terminal success and includes the finished URL. If the job is still
processing, say so in one short sentence and keep the same `job_id`.
Do not invent a URL and do not deliver a pending URL. A later
`get_generation_status` on that `job_id` is how you pick it up. Never
regenerate or re-charge while that job may still be running.

Wait the pending reply's `poll_again_in_seconds` when it is
present. If it is absent, wait **60 seconds** for video and **15
seconds** for image. Follow `next_action`. Prefer `kind="image"`
or `kind="video"`; `kind="auto"` can briefly return not found
before a video row exists.

**Image.** Tell the user the job is running. Poll as above for
up to **5 minutes**. Still processing: "Still generating." Then
stop. Offer to check back with that same `job_id` /
`gpt_ad_gen_id`. Do not resubmit. Do not mint a new
`gpt_ad_gen_id`. `not_found` for about a minute after a charged
submit is expected (no pending status row exists until render
finishes). Keep polling on `not_found` for up to about
**2 minutes** after a submit before treating it as a failure.
Never resubmit on `not_found`. After that window, say plainly
that the status isn't visible yet and offer to check back with
that same `job_id` / `gpt_ad_gen_id`.

**Video.** Tell the user video usually takes 3-7 minutes. Poll as
above about once a minute for up to roughly **30 minutes** (within
the host's turn limits). Narrate progress on each pending check
from elapsed time and the status reply — do not invent a pipeline
stage the server did not report:

- just submitted: "Queued — waiting for render (`<job_id>`)."
- first pending poll: "Rendering (`<job_id>`). Still free to check."
- later pending polls: "Still rendering (`<job_id>`). I'll keep
  the same id."
- after the 30-minute window: "still rendering (job `<job_id>`),
  ask me to check any time, it's free".

Never regenerate or re-charge.

Voice clone is synchronous — it returns `voice_id`. Do **not** poll
`get_generation_status`. Edit and resize are synchronous. Do not
call `get_generation_status` for them.

Terminal success: run the matching checks in
[creative-quality-gates.md](creative-quality-gates.md) before you
claim the asset is ready.

## After a job or a failed check

Three states. Never reuse a completed job id to repair it.

**Pending.** Still running. Same `job_id` / `gpt_ad_gen_id`. Include
that id in the handoff. Never resubmit.

**Terminal failure.** Job failed. Explain. A new attempt is a new
paid generation: fresh approval and quote unless the tool says
refunded / not charged. New id only for that attempt.

**Quality failure.** Job succeeded but a check failed. Show the
result. Offer a revision. New generation needs fresh approval and
quote.

Edit / resize charged-credits check runs only when the tool reply
or `get_credit_history` shows a charge. Those credits must equal
the **approved** quote. No charge field → say "cost not shown in
the reply" — not a quality failure; do not offer a paid revision
for it.
