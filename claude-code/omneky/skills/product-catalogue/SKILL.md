---
name: product-catalogue
description: Use this when the user wants a product catalogue, brand catalogue, SKU list, add or update a product, or scrape/import a product page URL (PDP) into Omneky.
---

# Brand / product catalogue

Writes mutate the signed-in brand's catalogue on `https://mcp.omneky.com/mcp-claude`. Auth is the client's OAuth flow; never ask for a token. Confirm fields with the user before create/update/finalize. There is **no product-delete tool** on this connector.

## When to use

User phrasing: product catalogue, brand catalogue, catalog, SKU, list products, add a product, update a product, scrape a product URL, import a PDP, product page URL into Omneky.

## When not to use

| User wants | Use instead |
| --- | --- |
| Brand identity only (logo, colors) or list brands | `getting-started` |
| Generate an ad **from** a product | `creative-referral` (resolve product here first if needed) |
| Launch ads for a product | `launch-meta-ads` or `launch-google-tiktok-ads` |
| ROAS by product/creative | `roas-breakdown` |
| Delete a product | Not available — say so |

## Tools

| Intent | Tool |
| --- | --- |
| List completed products | `list_brand_products` |
| Full record | `fetch_product_details` |
| Manual create | `create_product` |
| Update a completed product | `upsert_brand_product` |
| Change product page URL only | `update_product_url` |
| Gate listing/category URLs | `identify_product_from_url` |
| Scrape into a draft | `scrape_product_from_url` |
| Complete a scrape | `finalize_scraped_product` |

## Resolve brand

If `brand_id` is unknown, call `list_brands` and confirm. Prefer a **numeric** `brand_id` so catalogue thumbnails resolve. Call `get_brand_details` only when you need brand identity, not product rows.

## Read

- `list_brand_products(brand_id)` returns id, name, and thumbnail for the first 10; later rows may have `thumbnail_url=null` until you fetch details (that does **not** mean no image). Only `status="completed"` rows appear.
- Full record: `fetch_product_details(brand_id, product_id)`.

## Manual create / update

- New product: `create_product` with `brand_id`, `product_name`, `product_description`. Optional: `price`, `benefits`, `offer`, `target_audience`, `product_url`, `product_type`, `industry_vertical`, `is_app`. Prefer this over `upsert_brand_product` for adds.
- Update a **completed** product: `upsert_brand_product` with `product_id`. Call `fetch_product_details` first and pass current `product_name` / `product_description` if you are not changing them.
- Change only the product page URL: `update_product_url(brand_id, product_id, url)`. Confirm the URL first.

Do **not** use `upsert_brand_product` to finalize a URL scrape.

## URL import

1. `identify_product_from_url(url)` — if `is_single_product` is `false`, ask for a specific product URL. If `true` or `null`, continue.
2. `scrape_product_from_url(brand_id, url)` — creates a draft (`scraped_image_urls`). Does **not** complete the product.
3. Confirm name, description, and at least one image (`ask_user` if needed).
4. `finalize_scraped_product` with `brand_id`, draft `product_id`, `image_urls` (min 1), `product_name`, `product_description`. Zero images is blocked. Return the finalized `product_id` (equals `folder_id`).

Re-import: optionally `update_product_url`, then scrape again (new draft) and finalize.
