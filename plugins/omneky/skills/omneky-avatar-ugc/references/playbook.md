# Avatar ugc playbook

Detail for this skill's SKILL.md. Read the section the current step needs.

## Hard rules

- Stick to the chosen `brand_id`. Never silent-switch brands.
- State the cost and proceed; do not ask for a yes before a paid
  avatar action. There is no quote tool: avatar video is priced by
  length, so say the cost depends on the length and report what was
  charged after the run (`credits_charged`). A short balance returns
  `credit_insufficient` and starts nothing.
- Only pass URLs / portraits from `list_creatives` /
  `find_avatars_and_voices` (`include="avatars"`) / the user's own brand assets. Do not invent a
  public video or portrait URL.
- `generate_avatar_video_ad` has no caller idempotency key. After an
  ambiguous timeout do **not** resubmit. Check
  `list_creatives`.
- Fill a structured brief before you generate.
- After render: inspect, then cheapest repair. There is no in-place
  audio edit — a wrong spoken line is a new generate (paid again). Never silently report success. Never resubmit a
  charged job blindly.
- Narrate long video jobs per Generation polls (queued / rendering
  / still rendering). Do not invent a pipeline stage the server
  did not report.

## Avatar video ad

1. `find_avatars_and_voices` (`include="filters"`) when you need valid filter values.
2. `find_avatars_and_voices` (`include="avatars"`) with `brand_id`, then `find_avatars_and_voices` (`include="voices"`) with `brand_id`.
3. `generate_avatar_video_ad` takes `avatar_url` or `person_image_url`
   (a stock portrait from `find_avatars_and_voices` (`include="avatars"`), or a brand-asset image of a
   person who has consented to appear). Pass `voice_id` from `find_avatars_and_voices` (`include="voices"`) when the user
   wants a voice.
4. `generate_avatar_video_ad` takes `user_prompt` as the spoken line —
   keep it within about 30 seconds or Brief rejects it and no job starts.
5. If there is no product image, omit `product_image_url` — do not
   require a product image. When a still is available, pass it.
6. Check once with `get_creative_status(job_id, kind="video")`
   per Generation polls in the pricing reference (return the URL
   only on terminal success). State results plainly.

Then run technical success and the video gates.

## UGC genre recipes

Same tools as Avatar video ad. The execution contract is the
spoken line, the visual beats, and the QA bar. Pick the matching
recipe; do not open a second skill.

Write `user_prompt` from the brief. Keep it within about 30
seconds. Hook in the first 2 s unless a later reveal is recorded
as an accepted exception.

### ugc-product

A talking-head with the catalogue product in frame.

- Pass `product_id` and a product still when one exists
  (`product_image_url`).
- Claims stay inside `approved_claims`. Product match is BLOCK.
- This is not a virtual try-on. A try-on / garment-on-body ask
  is a capability gap — decline it. Do not fake a fit.

### ugc-review (strict truthfulness)

A person on camera reviews the product.

- Every spoken and on-screen claim is in `approved_claims` with a
  source. No invented ratings, "best", medical, or savings lines.
- If a requested claim has no source, stop and ask. Do not generate.
- Product match is BLOCK. Identity stays one person.

### ugc-unboxing (reveal arc)

Hands or the speaker open or reveal the product.

- Beat 1 (0–2 s): hook without spoiling the product unless the
  approved concept shows it immediately.
- Beat 2: the reveal. Product visible by this beat, or record a
  later-reveal exception before you generate.
- Beat 3: one approved benefit + CTA.
- Do not show a different SKU than `product_id`.

### ugc-tutorial (demonstrable steps)

The speaker **does** the steps, not only talks about them.

- List 3–5 demonstrable steps in the brief. Each step is visible
  (hands, product, or result), not voiceover-only.
- Step order is the spoken order. Skip a step you cannot show;
  do not fake it.
- Claims stay inside `approved_claims`.

### ugc-website-demo (accurate UI evidence)

A talking-head plus a real product or site UI.

- UI evidence is a real HTTPS image or a catalogue / brand asset
  URL. Do not invent screens, metrics, or dashboard numbers.
- If you have no fetchable UI capture, say so and offer
  ugc-tutorial or a brand-general talking-head instead.
- Any on-screen figure is an `approved_claims` line.

### founder-spokesperson

On-screen person: a stock avatar, or a brand-asset image of a person who has consented to appear. A cloned `voice_id` from
`omneky-voice-and-video-clone` after speaker consent when they
asked for their voice. Claims stay inside `approved_claims`.

### localized-ad-set

`find_avatars_and_voices` (`include="voices"`) per locale. One generate per language; state the
batch cost once and proceed. Do not invent a translation of a regulated
claim.

### Testimonial avatar

Default talking-head: one approved line, one person, and a
product still when one exists. Use a stock avatar, or a brand-asset image of a person who has consented to appear. Voice
cloning still requires speaker consent in
`omneky-voice-and-video-clone`.

## Finished ad → launch

This skill does not launch. Hand off to `omneky-launch-and-connect`
with the video HTTPS URL on `ad_specs[].media_url` and the rest of
the handoff contract.
