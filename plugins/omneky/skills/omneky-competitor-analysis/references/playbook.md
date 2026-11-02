# Competitor analysis playbook

Detail for this skill's SKILL.md. Read the section the current step needs.

## Hard rules

- Stick to the chosen `brand_id`. Never silent-switch brands.
- Every claim cites `source` (tool name + entity + date or window).
  No source → do not write the claim.
- Gate Semrush / Ahrefs on that connector's status tool.
  Disconnected → skip that source and say so. Do not invent ranks
  or keywords.
- Reads need no approval. This skill does not generate or launch.
- Do not ask the user for internal ids.

## Path

1. Reuse the chosen `brand_id`. Unknown: `list_brands` (pass
   `search` when they named it). Several matches: ask which one.
2. `get_brand` when you need the brand site, name, or copy.
3. `analyze_brand` with `brand_id` (optional `website_url`, optional
   `product_id`). Draft only — no plan steps. Cite it as
   `analyze_brand`.
4. Own-site organic (each gated on status):
   - Semrush: `list_connections` (`connector="semrush"`), then
     `get_seo_domain_overview` (`domain`) and/or
     `get_keyword_insights` (`keyword`).
   - Ahrefs: `list_connections` (`connector="ahrefs"`), then `get_seo_domain_overview`
     (`target`), `get_keyword_insights` (default `limit` 10;
     refuse `limit` greater than 50), `get_seo_domain_overview`
     (overview only).
5. Competitor or own PDP they pasted: `import_product_from_url` (`url`). `status=not_a_product_page` → ask for one product URL. It returns the page copy to cite. Finalize only if they asked to save the product
   (`omneky-analytics-and-catalogue`).
6. Write the brief feed. Each line is `{claim, source}`. Group as:
   - Positioning (who they are vs the cited competitor set)
   - Messaging angles (hooks / benefits that appear in the sources)
   - Gaps (what the sources do not support — say "not in sources",
     never invent a gap stat)

### keyword-gaps

Semrush `get_keyword_insights` / domain overview and
Ahrefs `get_keyword_insights` (limit ≤ 50). A gap is "in
their list, not in ours" only when both sides were fetched.
Otherwise say which side is missing.

### domain-rating-backlinks

`get_seo_domain_overview` (overview
only). Not a full export. Not Meta Ad Library ads (gap).

Hand `approved_claims` and those angles to `omneky-image-ads`,
`omneky-product-video`, or `omneky-avatar-ugc` when they ask to
make the ad. Do not generate here.
