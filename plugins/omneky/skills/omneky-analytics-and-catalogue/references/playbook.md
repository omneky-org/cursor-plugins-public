# Analytics and catalogue playbook

Detail for this skill's SKILL.md. Read the section the current step needs.

## Winning ads → next batch

Stay on the chosen brand for every call below. Empty rows are missing
coverage, not a reason to silent-switch brands.

1. Reuse the `brand_id` already chosen in this conversation. Unknown:
   `list_brands` (pass `search` when the user named the brand). Several
   matches: ask which one and wait. One clear match: say the name and
   id, then keep that `brand_id`.
2. Pick the date window before any metric call.
   - User named dates: use those inclusive `YYYY-MM-DD` days.
   - "This week" means the calendar week to date, not the last 7
     days. Use last 7 days only when the user says "last 7 days".
     Movers keep `period_days` (default 7) and do not take
     `date_range`. A winner list with no dates uses the last 30
     days. Always say which window you used.
   - This surface has no latest-date tool. Do not invent one.
3. `get_performance_summary` (`include_coverage=true`)
   with that `brand_id`.
   Read which dates and channels actually have imported data.
   - Window or channel outside that coverage: say there is no imported
     data. Do not call a metric tool and report zeros. Narrow to a
     covered window, or stop.
   - Empty metrics after this check are missing data, not a zero ROAS,
     spend, or CTR.
4. Then, always passing that `brand_id` (it is optional in some
   schemas; send it anyway so results stay on the chosen brand):
   - Ranked winners: `get_performance_breakdown` with `dimension`
     (creative, campaign, ad, or channel), `date_range` as two inclusive
     dates `["YYYY-MM-DD", "YYYY-MM-DD"]`, `sort_metric` (the metric to
     rank by, such as `spend` or `roas`; the schema does not list
     values), `sort_order` (`desc` for winners), and
     `results_per_page` (10 is enough for a winner list). Pass
     `filters` as `[]` when not filtering. There is no `metrics`
     argument; set `include_all_metrics` to `true` when you need every
     column.
   - Day-by-day: `get_performance_summary` with `date_range` (same shape) and
     `filters` as `[]` when not filtering. There is no `metrics`
     argument.
   - What changed vs the prior period: `get_performance_movers` with
     `dimension`, `metric`, `end_date` (last day of the current window,
     `YYYY-MM-DD`), and `period_days` (default 7). It builds the prior
     window. Do not send `date_range` to this tool.
   - Name the user said: `search_reporting_values` with `dimension` and
     `q` (the text). It returns labels, not metrics. Put the exact value
     in a later filter. Operators are `includes` or `excludes` only
     (`condition`, `dimension`, `value` as a list of strings). Do not
     invent `=`, `in`, or `gt`.
   - Current allocated daily budget (not spend, not historical ROAS):
     `list_live_ads` per `channel` (the campaign list carries the channel budget). Totals plus per-campaign
     `breakdown` / `basis` when the backend returns them. A disconnected
     or skipped channel is a per-channel error, not an empty total.
   - Fill any other required field from the tool's own schema and
     earlier results in this session. Do not ask the user for internal
     ids.
5. Never sum `selected_conversion_metric_value` across channels. That
   field is the brand's goal and it differs per channel (purchases on
   one channel, conversions on another). Group by channel, or use a
   named metric (`purchases`, clicks, spend, ROAS, CTR).
6. Minimum evidence (also in the handoff contract). State the
   sample next to every conclusion. Fewer than about 1,000
   impressions, 30 clicks, or 10 conversions per ad is thin — say
   "too little data to conclude" and show the numbers. Attribution
   differs by channel; do not mix attributed totals or sum
   `selected_conversion_metric_value` across channels. An aggregate
   ratio is summed numerators over summed denominators, never the
   mean of per-row ratios.
7. `get_recommendations` when the user asks what to try next. This is
   advice, not the metric table from steps 4–5.
   - Required: `brand_id`.
   - `start_date` and `end_date` are inclusive `YYYY-MM-DD`. Omit both
     for the last 30 days. A window longer than 30 days is capped at
     30. `metric` defaults to `spend`.
   - `status=timeout`: narrow the dates. Do not retry the identical
     call in this turn.
8. To **make** the next batch, hand the winning product or concept to
   `omneky-image-ads` or `omneky-product-video` with the handoff
   contract (brand, product, source evidence, approved claims,
   `source_ad_ids`, and one hypothesis per requested variant). This
   skill does not generate creatives. Launch is a later handoff. A
   weekly plan is `omneky-marketing-plan`, not a reconstructed
   generate/launch sequence here.

## Performance-to-creative flows

Evidence first, then a handoff. Do not invent ROAS. Do not generate
here. Each requested variant is one hypothesis: source ad, what
stays constant, what changes, audience / placement, success metric.

- **fatigue-refresh.** `get_performance_movers` on Meta (falling
  CTR or ROAS; state the window and sample). Pick up to 3 fatigued
  ads with enough evidence. Hand 3 replacement hypotheses to
  `omneky-image-ads` (or avatar/video when they asked for that
  format).
- **top-roas-variations.** `get_performance_breakdown` sorted by
  `roas`. Take the verified winners. Hand N distinct hypotheses
  (N = the count they asked for) to `omneky-image-ads`.
- **ugc-from-best-messaging.** From the same winner list, extract
  the winning line of copy into `approved_claims`. Hand that
  messaging to `omneky-avatar-ugc` (default testimonial, or the
  named UGC genre).
- **paused-campaign-from-winners.** After the creative skill
  returns accepted assets, hand `omneky-launch-and-connect` with
  those URLs. Launch stays `PAUSED` unless they explicitly say to
  go live.
- **weekly-performance-report.** Same coverage check, then
  `get_performance_breakdown` + `get_performance_summary` +
  `get_performance_movers`. State the window. Thin samples stay
  "too little data to conclude." Do not declare an A/B winner
  here (`omneky-ab-tests`).
- **budget-reallocation.** Read `list_live_ads` and the
  winner / mover tables. Recommend a move (from / to / amount /
  why). This skill is read-only. Applying `set_ad_budget` is
  `omneky-launch-and-connect` (the host confirms). Do not mutate spend
  here.

Thin samples stay suggestions: say "too little data to conclude"
and still show the numbers.

- **roas-cpa-drop-diagnosis.** Coverage first. Then
  `get_performance_movers` (falling ROAS or CPA),
  `get_performance_breakdown`, and `get_performance_summary`. Explain
  with evidence only (window, sample, channel). Confidence is
  thin when samples are thin.
- **waste-pruner (evidence).** Rank by spend with weak CTR / ROAS
  on `get_performance_breakdown`. List pause candidates. Do not
  call `set_ad_status` here — `omneky-launch-and-connect`
  applies it (the host confirms).
- **audience-targeting-evidence.** Breakdowns by the dimensions
  they named. Token lookup is `search_targeting` (`channel`, `query`). Applying
  `update_ad_targeting` is launch (the host confirms).
- **target-cpa-budget-plan.** `get_launch_requirements` +
  `estimate_reach` + current `list_live_ads`. Recommend a
  daily number at or above the floor. Applying it is launch.

## HubSpot (attribution caveats)

`list_connections` (`connector="hubspot"`) first. Disconnected → skip.

Campaign-to-deal: `search_crm` (`object_type="deals"`) then `search_crm` (`object_type="deals"`, `id`).
There is **no join key** from a paid `campaign_id` to a HubSpot
deal on this surface. Say that. You may place their named
campaign/deal labels side by side and label the pairing
**inferred, not attributed**. Do not claim paid-media ROAS from
HubSpot. Confidence = low unless they supplied the join.

ABM brief: `search_crm` (`object_type="companies"`) / `search_crm` (`object_type="companies"`)
(industry, name). Hand cited firmographic lines as
`approved_claims` to a creative skill. Do not invent industry
stats.

## Call by name (catalogue)

Only when `get_products` /
`import_product_from_url` (`url`) appear on this session's `tools/list`.
If they do not, say that capability isn't available on this
connector. Do not invent a catalogue.

| User ask | Tool |
|---|---|
| list my products / show SKUs / what's in the catalogue | `get_products` |
| details / images for one product | `get_products` |
| import this product URL / paste a PDP | `import_product_from_url` (`url`), then `save_imported_product` (`draft_id`) |

`get_products` needs numeric `brand_id`. Then
`get_products` for images and copy used by a later ad. Do not
mention a second name for product details here.

## Import (short)

Only when the import tools appear on `tools/list`. If they do
not, say that capability isn't available on this connector.

Stay on the chosen numeric `brand_id`. Catalogue writes need one
confirmation of the fields being saved; reads need none.

1. `import_product_from_url` with `brand_id` and the pasted `url`
   (`locale` defaults to `en-us`). It checks the page first and
   captures the first product on a product page only.
   - `status=not_a_product_page` (listing, category, or home):
     nothing was scraped. Ask for one product page URL.
   - `is_single_product` `null` (uncertain, often JS-rendered): it
     still scrapes; say the page was uncertain.
   - `status=pending`: retry **later** with the same `brand_id` and
     `url`. Do not tight-loop this turn. Do not start a second scrape.
   - `status=scraped`: show the fields and `scraped_image_urls`. The
     user confirms which images and any edits.
2. `save_imported_product`. Required: `brand_id`,
   `draft_id` (the `product_id` from step 1), `image_urls` (at least one), `product_name`, and
   `product_description`. Zero images does not save. Do not finish a
   scrape with `update_product` (the draft stays hidden). Use the
   **returned** catalogue `product_id` after this call.
4. No URL, hand-built: `create_product`. Required: `brand_id`,
   `product_name`, `product_description`. Confirm those fields first.
   `create_product` does not accept image or video bytes. Catalogue
   products cannot take uploaded media. If
   `get_products` is empty and another tool needs a
   `product_id`, tell the user "I'll create a product you can reuse
   later", create it, and use the new id without making the user
   restart.
   Pass a public HTTPS image URL on the original creative
   call when that tool accepts one.
5. Edit a completed product: `update_product` with `product_id`,
   and send the current `product_name` and `product_description` even
   when they are unchanged. URL only:
   `update_product` with `brand_id`, `product_id`, and `product_url`.
   There is no product-delete tool.
6. Hand off to `omneky-image-ads` or `omneky-product-video` for the
   ad. A product image ad sends
   **one** confirmed HTTPS image in `user_assets` (more only when the
   user asks). Quality drops with more than two.

## If a catalogue tool is not available

If this session cannot call `get_products`, `import_product_from_url` (`url`), or the other
catalogue names, say that capability isn't available on this
connector. Do **not** invent a catalogue or claim Omneky has no
product list. The user can manage products in the Omneky app
(Ads Central).

## Connector reads

Connector reads stay available but are not the hero path. Check status
before a live read, and skip when disconnected:

- HubSpot: `list_connections` (`connector="hubspot"`), then
  `search_crm` (`object_type="contacts"`), `search_crm` (`object_type="companies"`), or
  `search_crm` (`object_type="deals"`) (page size 10, cap 100). One record after
  search: `search_crm` (`object_type="contacts"`, `id`), `search_crm` (`object_type="companies"`), or
  `search_crm` (`object_type="deals"`, `id`) by id. Skip when disconnected.
  To connect HubSpot, the user starts it from the brand's Connections
  page in the Omneky app.
- Semrush: `list_connections` (`connector="semrush"`), then
  `get_seo_domain_overview` (`domain`) or
  `get_keyword_insights` (`keyword`)
- Ahrefs: `list_connections` (`connector="ahrefs"`), then `get_seo_domain_overview`
  (`target` is the domain).
  Organic keywords: `get_keyword_insights` (default `limit` 10;
  refuse `limit` greater than 50 — do not clamp). Backlinks:
  `get_seo_domain_overview` is an overview only, not a full export.
- Google Search Console is not available in Omneky. If asked, say so
  and use Semrush / Ahrefs instead.

These do not answer "which ads should I make more of."
