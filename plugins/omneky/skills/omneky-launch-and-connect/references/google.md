# Google launch rules

Read this file only when launching on Google. Use the connected
Omneky MCP server. Gate on `tools/list`.

## Demand Gen

One image or video on YouTube or Discover.

1. `search_targeting` (`channel="google"`) with `brand_id` and `query` (the country).
2. Pass each returned `adset_spec_fragment` as `targeting_fragments`
   on `launch_google_ad` (`objective="demand_gen"`).
3. Map `campaign_spec.name` → `campaign_name`, `ad_group_spec.name` →
   `ad_group_name`.
4. Each ad needs `ad_specs[].business_name` and `logo_image_url`.
5. Do not send those fragments to PMax.

Reuse an existing ad set with `ad_group_id` when the user named one.

## Performance Max

Full multi-placement asset suite. No country lookup.

- `launch_google_ad` (`objective="performance_max"`)
- `ad_specs: []`
- Images + `link_url` on `ad_group_spec`
- New asset group: at least 3 headlines and 2 descriptions
- Distinct `square_marketing_images` and `logo_image` — do not reuse
  the landscape ad image as the logo or the square image

Live vs paused (`campaign_spec.status_on_launch`) follows what the user asked; the server adds no default.
