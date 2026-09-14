---
name: creative-generation
description: Use this when the user wants an image ad, static ad, product video, creative generation, UGC-style video, edit an ad, resize an ad for 1:1 / 9:16 / 16:9 placements, or check generation job status.
---

# Creative generation

Writes spend credits. Confirm intent before calling. Image ads cost **5 credits** on submit; product videos cost **30 credits**. If a tool returns `credit_insufficient`, tell the user and do not retry until they top up.

## When to use

User phrasing: generate an image ad, static ad, product video, creative generation, UGC-style video, edit an existing ad, resize for 1:1 / 4:5 / 9:16 / 16:9 placements, check generation status / job_id.

## When not to use

| User wants | Use instead |
| --- | --- |
| Launch the finished creative | `launch-meta-ads` or `launch-google-tiktok-ads` |
| Pick / scrape the product first | `product-catalogue` |
| List brands / company_id only | `getting-started` |
| ROAS of existing creatives | `roas-breakdown` |
| Pause or budget a live ad | `manage-ads` |

## Tools

| Intent | Tool |
| --- | --- |
| Queue a static image ad | `generate_image_ad` |
| Narrative options for a product video | `fetch_product_video_narratives` |
| Queue a multi-scene product video | `generate_product_video` |
| One-shot status peek | `get_generation_status` |
| Edit copy/colors/layout on a finished image | `edit_image` |
| Change aspect ratio of a finished ad | `resize_ad` |

`get_current_user` for `user_id`. `list_brands` / `get_brand_details` for `brand_id`, `company_id`, assets. Product-specific: `list_brand_products` → `fetch_product_details`.

## Resolve brand / product

1. `get_current_user` for `user_id` (needed by `generate_image_ad`).
2. `list_brands` if `brand_id` is unknown; `get_brand_details` for logo, colors, `company_id`, and brand assets.
3. Ask whether the creative is for a **specific product** or the **brand in general**.
   - Product: `list_brand_products` → `fetch_product_details` and ground the brief in that product's name, imagery, and details.
   - Brand-general: use `get_brand_details` and skip product selection.

## Image ads — `generate_image_ad`

Net-new static ads only. Required: `brand_id`, `brand_name`, `company_id`, `user_id`, `ad_concept` (full prompt — there is no separate `prompt` arg), and a fresh `gpt_ad_gen_id` like `<slug>-<uuid4>` (never reuse). Prefer gathering aspect ratio (`1:1`, `4:5`, `9:16`, `16:9`) and goal first; attach product imagery when product-specific.

Returns `job_id` immediately. If a generation widget opens, confirm the job is running and let the widget finish — do **not** loop `get_generation_status`. On text-only hosts, share `job_id` and wait for the user to ask; then call `get_generation_status` once with `kind="image"`.

For extra placements, generate once at a primary ratio, then call `resize_ad` for each remaining ratio in one parallel round.

## Product videos

1. Confirm a specific product and 1–3 HTTPS product image URLs.
2. `fetch_product_video_narratives` (`brand_id`, `product_name`, `product_image_urls`; optional description/type). Present options; wait for the user to pick. Do not auto-generate in the same turn unless they already chose.
3. `generate_product_video` with that narrative (narrative, script, segments, music/hook fields), imagery, and orientation: `9:16` → `portrait`, `16:9` → `landscape`, `1:1` → `square`. Fresh `job_id` (`<slug>-<uuid4>`).
4. Same widget vs text-only rule as image ads. Status peek: `get_generation_status(job_id, kind="video")` **once** on follow-up.

## Edit and resize

- `edit_image` — change copy, colors, layout, or style on an existing finished image. Synchronous; returns `presigned_url`. No `job_id` / `get_generation_status`. Costs 5 credits on success.
- `resize_ad` — change aspect ratio of a finished ad (`ad_url` + `aspect_ratio`). Synchronous; returns `resized_ad_url`. Not charged. Do not use `get_generation_status`.

## Status

`get_generation_status` is a single non-blocking peek. Follow `next_action`. Statuses: `queued`, `processing`, `completed` (use `assets`), `failed` / `cancelled`, `error`, `unknown`. Never poll in a loop in the same turn.
