# Getting started and failures playbook

Detail for this skill's SKILL.md. Read the section the current step needs.

## Context, not onboarding

There is no mandatory first-turn sequence. Act on the user's request and
resolve only what it needs. Reuse known identity and brand context.
Ask only for missing info.

1. **Identity.** The server knows who is signed in. Call
   `get_account` only when the user asks who they are signed in as.
   On JWT / 401, ask the user to reconnect the Omneky app in the host.
2. **Brand.** Reuse the `brand_id` already chosen in this conversation.
   If it is unknown and the request needs one, `list_brands` (pass
   `search` when the user named the brand):
   - **No brands.** Say this login has no brands yet. Do not invent a
     `brand_id`. Point them at the Omneky app (Ads Central) to create
     one.
   - **Several matches.** List each matching name and id and ask which
     one. Do not take the first row.
   - **One clear match.** Say that name and id, then keep it.
3. Stick to the chosen `brand_id`. Empty metrics are not a reason to
   switch brands.
4. `get_brand` when the next step needs logo, colors, or copy.
   Basic record only: `get_brand`.
5. `list_connections` when the user asks what is connected.
6. `health_check` only when diagnosing a connection problem. It does
   not return ads, credits, brands, or ROAS.

## Approvals

Do not ask for a yes before paid work the user asked for: state what
will happen, for which brand, and the cost, then proceed. Reads and
status checks need no approval. Launches, deletes, plan revisions
and catalogue overwrites are marked destructive, so the host confirms
them (`omneky-launch-and-connect`).

## Hard rules shared with creative

- After a narrative card pick, pass that `narrative_id`. A bad or
  missing id is `narrative_unresolved`: re-fetch narratives and pick
  again. Do not turn that error into Generate Now.
- Generate Now is only a true omit of both narrative fields, and only
  when the user explicitly skips the pick (`omneky-product-video`).
- A hero spin or product animation is not a commercial. Do not route
  it to `generate_product_video`.
- `environment_setting` is an HTTPS image URL only.
- `generate_image_ad` uses `ad_concept` (never `prompt`) and a
  `gpt_ad_gen_id` (`<short-slug>-<uuid4>`). New id per new variant;
  see Ambiguous paid-submit recovery for retries. `edit_image` uses
  `images` (list of URL strings) and `prompt`.
- Generation poll bounds live in
  [creative-pricing-and-polling](creative-pricing-and-polling.md).
  Plan poll bounds live in `omneky-marketing-plan`. Do not
  silent-loop here.
- State the cost and proceed: say the run uses credits (video is
  priced by length). There is no quote tool; never guess a figure. Leave
  `expected_credits` out; it is informational and the server never
  refuses a call over it. A short balance returns
  `credit_insufficient` (nothing charged); results report
  `credits_charged`.

## Ambiguous paid-submit recovery

This rule covers async paid submits (`generate_image_ad` and
`generate_product_video`). Sync edit and resize are charged on
each call.

### Rejected before acceptance

These responses happen before any charge. Fix the request and
resubmit only when the code is in this list:

- `schema_invalid`
- `invalid_argument`
- `not_found_or_forbidden`
- `credit_insufficient` (nothing charged; upgrade or stop — do not
  retry until they have credits)
- `narrative_unresolved` (re-fetch and pick again; no job)
- `quote_unavailable` (price cannot be confirmed; do not invent one)

Mint a new submit id only after one of those recognized pre-accept
rejections or the user's OK.

### Credit outcome

Read `credits_charged` when the tool result includes it.

- `credits_charged: false` means this server did not deduct. Say that.
  Do not tell the user you cannot tell whether credits were deducted.
- `submission: not_started` with `credits_charged: false` means no job
  exists. Fix the request and resubmit only for a recognized
  pre-accept rejection (the list above, or this pair).
- `submission: unconfirmed` with `credits_charged: false` means credits
  were not charged, but a job might still have been queued. Check
  `get_creative_status` with the returned `job_id` and `kind=video`.
  Before any resubmit, also check `list_creatives` for a matching video from the last few minutes. If neither shows it and generate_* tools for this job type appear on this session's `tools/list`, it is safe to retry once. If they
  do not, do not retry. Poll `get_creative_status` or
  `list_creatives` when listed, and tell the user generation
  isn't available on this connector. A timed-out submit can still be rendering and charged (there is no submission key), so a retry is a new job charged as one.
- `credits_charged: true` means the charge landed and `job_id` is the
  poll id.
- If `credits_charged` is absent, keep the rule below.

### Do not resubmit

Split image and video recovery. Do not reuse "the same id" for both.

- Image ads: a timeout, 5xx, or connection drop means do **not**
  mint a new id. Reuse the same `gpt_ad_gen_id`. Check
  `get_creative_status` with `kind=image` (bounds in
  [creative-pricing-and-polling](creative-pricing-and-polling.md)).
  A repeat of an already-charged image id returns
  `already_submitted` and the original job.
- Product video `submission: unconfirmed` (timeout / 5xx): there is
  no caller submission key. Check `get_creative_status` with the
  returned `job_id` and `kind=video`. Before any resubmit, also check `list_creatives` for a matching video from the last few minutes. If neither shows it and generate_* tools for this job type appear on this session's `tools/list`, it is safe to retry once. If they do not, do not
  retry. Poll `get_creative_status` or `list_creatives`
  when listed, and tell the user generation isn't available on
  this connector. Credits deduct only after a confirmed `job_id`.
- Product video `submission: not_started`: no job exists. Fix the
  request and resubmit only for a recognized pre-accept rejection.
- `edit_image`, `resize_creative`, and `resize_creative` (`width` + `height`): do **not**
  auto-retry. Check `get_account` (`include_credit_history=true`) or the returned asset,
  or ask the user. A retry is a new charge.
- Any other timeout, 5xx, connection drop, or unrecognized error
  means do **not** resubmit. The request may already have been
  accepted.

An image transport retry reuses `gpt_ad_gen_id`. Product video
has no caller submission key — poll the returned `job_id`, and
retry once only if no job is found and generate_* tools for
this job type are on `tools/list`. If they are not, do not
retry; tell the user generation isn't available on this
connector. A new
image variant uses a new `gpt_ad_gen_id`. Never mint a new
`gpt_ad_gen_id` just because a call timed out or the connection
dropped.

## After a job or a failed check

Three states. Poll bounds live in
[creative-pricing-and-polling](creative-pricing-and-polling.md).
Acceptance gates live in
[creative-quality-gates](creative-quality-gates.md).
Never reuse a completed job id to repair it.

**Pending.** Still running. Same generation id. Never resubmit.

**Terminal failure.** Job failed. Explain. A new attempt is a new
paid generation unless the tool says refunded / not charged; state
the cost and proceed.

**Quality failure.** Job succeeded but a check failed. Show the
result. Offer a revision. A new generation is a new paid run; state its cost.

## Failures

- Empty reporting → `get_performance_summary` (`include_coverage=true`) first; empty is
  not zero. Do not switch brands to force a number. Performance depth:
  `omneky-analytics-and-catalogue`.
- `get_recommendations` or unscoped `list_live_ads` (`level="ad_group"`, `parent_id` = campaign id) timeout → narrow
  the query; do not retry the identical call this turn.
- Scrape `pending` → retry later, same `brand_id` + url.
- LinkedIn / TikTok 400 → location pre-call on the launch skill
  (`search_targeting` (`channel`, `query`) / `search_targeting` (`channel="tiktok"`, `objective`)). X Ads channel
  value is `twitter`.
- `needs_user_decision` → fill the missing detail from the
  conversation and call again; ask in plain chat only if you cannot.
  Never dump `clarification_needed` JSON.
- `credit_insufficient` → nothing started or was charged. Tell the user
  the shortfall (`required` vs `balance`). Plan changes happen in the
  Omneky app; do not send payment links.
  Never collect a PAN. Never invent a credit purchase tool.
- A tool named in these skills is not available in this session: do
  not invent it. Say it is not available here; the user can do it in
  the Omneky app (Ads Central). Do not offer another app or connector.
