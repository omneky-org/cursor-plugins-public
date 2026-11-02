# Sourced inputs — how to obtain them, what to do if absent

Use this table whenever a tool argument comes from another tool.
Confirm each named tool appears on this session's `tools/list` before
calling it. Do not invent a tool or an id. Skills stay on the
connected Omneky MCP server.

Trust your own judgment. Resolve brand, product, images, and
settings yourself from the conversation and these tools. Pick the
best match and say which one you used. Ask the user only when you
are truly blocked (nothing matches and no tool can recover it), and
then ask once.

Skills stay on the connected Omneky MCP server.

Omneky cannot receive file uploads. No tool accepts bytes or
base64. Host photo attachments only work where a creative tool
accepts an HTTPS URL. If the host has no fetchable URL, ask the
user for a public link. Catalogue products cannot take uploaded
media.

| tool | required input | how to obtain it | what to do if absent |
|---|---|---|---|
| any tool taking `brand_id` | `brand_id` | `list_brands` (then `get_brand` for name / logo) | Call `list_brands` (with `search` when they named one) and use the best match; say which brand you used. With one brand, use it. Ask only when nothing plausibly matches. |
| any listed tool taking `product_id` | `product_id` | `get_products` for this `brand_id`; `get_products` for imagery | Check the catalogue first: call `get_products` and use the product that matches the request; say which one. If it is not in the catalogue, add it yourself: with a product URL, `import_product_from_url` (`url`), then `save_imported_product` (`draft_id`); without one, find the product page with a web search when you can, or call `create_product` with a name and description from the conversation. Use the new id in the original request without making the user restart. Catalogue products cannot take uploaded media — pass a public HTTPS image URL on the original creative call when that tool accepts one. |
| `create_product` | `brand_id`, `product_name`, `product_description` | Conversation, product page, or web search (and optional `product_url`) | Write the name and short description yourself from what you know. Ask only if you cannot identify the product at all. Do not send file bytes or base64. Catalogue products cannot take uploaded media. |
| `import_product_from_url` (`url`), then `save_imported_product` (`draft_id`) | product page URL | User-supplied HTTPS PDP, or one you found with a web search | If there is no URL, search for the product page; otherwise use `create_product`. Skip scrape on listing/category pages. `save_imported_product.image_urls` must be a subset of that scrape's HTTPS `scraped_image_urls`. |
| `get_creative_status` | `job_id` | The queued-render result the user already has | Use the job_id from the earlier generate result in this chat. Do not invent a job_id. |
| `link_ad_account` | ad account id | `list_ad_accounts` after `get_connect_link` | Only when `link_ad_account` is on `tools/list`. Connect the channel, list authorized accounts, then link. If it is not listed, say that capability isn't available on this connector. Do not invent an id or a link. |
| `launch_*` `campaign_spec.id` | campaign id | `list_live_ads` (same brand + channel) | Omit `id` to create a new campaign. If they named one you do not have, call `list_live_ads` and use the match; ask only if several match. |
| `launch_*` `ad_group_spec.id` / `ad_specs[].adset_id` | ad set / ad group id | `list_live_ads` (`level="ad_group"`, prefer `parent_id` = campaign id) | Omit `id` to create a new ad set. If they named one you do not have, call `list_live_ads` (`level="ad_group"`, `parent_id` = campaign id) and use the match; ask only if several match. |
| `launch_*` `ad_specs[].media_url` | finished ad HTTPS URL | Any finished-ad HTTPS URL the user already has (prior generate or user-supplied) | If they have a URL, use it. If they have no URL at all, open the owning creative skill. |
| `register_creative_for_launch` | `asset_url` / `preview_storage_key` | Finished-ad HTTPS URL | Ask for an HTTPS URL or reuse one already in this conversation. |
| `search_targeting` (`channel`, `query`) / `search_targeting` (`channel="google"`) / `search_targeting` (`channel="tiktok"`, `objective`) | location / audience tokens | Those search tools | Call the matching search tool before a new LinkedIn / Google Demand Gen / TikTok launch. Do not invent URNs or location ids. |

Creative / clone inputs (only when those tools appear on `tools/list`):

| tool | required input | how to obtain it | what to do if absent |
|---|---|---|---|
| `clone_video_ad` and every tool taking `product_id` | `product_id` | `get_products` for this `brand_id`; `get_products` for imagery | Same recovery as the shared `product_id` row. Catalogue products cannot take uploaded media — pass a public HTTPS image URL on the original creative call when that tool accepts one. |
| `generate_avatar_video_ad` | `avatar_url` or `person_image_url` | `find_avatars_and_voices` (`include="avatars"`) `portrait_url`, or the user's brand asset | Call `find_avatars_and_voices` (`include="avatars"`), or ask for an HTTPS portrait. Use a stock portrait, or a brand-asset image of a person who has consented to appear. Do not invent a URL. |
| `generate_avatar_video_ad` | `voice_id` (optional) | `find_avatars_and_voices` (`include="voices"`) (stock or `cloned_voices`) | Call `find_avatars_and_voices` (`include="voices"`) and pick a voice that fits the brief. To create a voice after speaker consent, call `clone_voice` then pick the new id from `cloned_voices`. Omit to leave voice off the trigger. |
| `generate_avatar_video_ad` | `product_image_url` (optional) | `get_products` / catalogue still, or a public HTTPS URL | Omit when there is no product image — do not require one. A host photo attachment works only when this tool can fetch an HTTPS URL; if the host has no fetchable URL, ask the user for a public link. |
| `clone_video_ad` / `check_clone_video` / `get_video_metadata` | `video_url` | `list_creatives` video_url only, and only when that row reports clone_video_allowed true | If no eligible source video exists, stop and say so plainly. Do not invent a public video link. |
| `edit_image` | `images` (HTTPS URL list) | Prior generate / edit result, or a public HTTPS URL | Ask the user for an HTTPS image or reuse one already in this conversation. Do not invent a URL. A host photo attachment works only when this tool can fetch an HTTPS URL; if the host has no fetchable URL, ask the user for a public link. |
| `resize_creative` | `ad_url` | Prior generate / edit `presigned_url` | Ask the user for an HTTPS image or reuse one already in this conversation. Do not invent a URL. |
| `resize_creative` | `ad_url` | Same as `resize_creative` | Ask the user for an HTTPS image or reuse one already in this conversation. Do not invent a URL. |
| `generate_image_ad` | `gpt_ad_gen_id` | Mint `<slug>-<uuid4>` | Mint a fresh key per new variant. Reuse only to recover that exact submit. |
| `get_creative_status` | `job_id` | The generate / trigger result that queued the render | Ask the user for the job_id they were given, or check `list_creatives`. Do not invent a job_id. |
| `plan_product_video` | `product_image_urls` | `get_products` or a public HTTPS URL | Use `get_products` images, or scrape the product page (`import_product_from_url` (`url`)) for 1–3 HTTPS images. Do not invent URLs. Ask for a public link only when no tool can supply an image. |
| `generate_product_video` | `narrative_id` | A card from `plan_product_video` | Optional. When the user gave a script or asked to just make it, skip the cards and use Generate Now. If you fetched cards, pick the best fit yourself unless the user wants to choose. `narrative_unresolved` means no job: re-fetch. |
| `clone_voice` | `voice_url` | User HTTPS audio sample | Ask for an HTTPS audio URL. Confirm speaker consent. Do not invent a URL. Omneky cannot receive file uploads; if the host has no fetchable URL, ask the user for a public link. |
| `launch_*` `ad_specs[].creative_id` | library creative id | `register_creative_for_launch` or `list_creatives` | Launch with `ad_specs[].media_url` instead. Do not invent a creative id. |

Unknown or foreign `product_id` returns the same
`not_found_or_forbidden` envelope (it does not say whether another
account owns the id). Follow `next_action`: list or create, then retry
the original tool.
