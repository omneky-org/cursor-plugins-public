# TikTok launch rules

Read this file only when launching on TikTok. Use the connected
Omneky MCP server. Gate on `tools/list`.

Required before any `launch_tiktok_ad` (the API returns 400 without
it):

1. `search_targeting` with `channel="tiktok"`, `brand_id` and required `objective` (`TRAFFIC`, `LEADS`, `VIDEO_VIEWS`, or
   `CONVERSIONS` — match the `launch_tiktok_ad` you are about to call).
2. Put the returned ids on the ad group as `location_ids`. Do not
   invent ids.
3. `ad_group_spec.name` maps to `adgroup_name`.

| Tool | Notes |
|---|---|
| `launch_tiktok_ad` (`objective="traffic"`) | Location pre-call required. |
| `launch_tiktok_ad` (`objective="leads"`) | Same. |
| `launch_tiktok_ad` (`objective="video_views"`) | Same. |
| `launch_tiktok_ad` (`objective="conversions"`) | Same. |

Live vs paused (`campaign_spec.status_on_launch`) follows what the user asked; the server adds no default.
