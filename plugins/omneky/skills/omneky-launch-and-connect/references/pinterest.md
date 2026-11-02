# Pinterest launch rules

Read this file only when launching on Pinterest. Use the connected
Omneky MCP server. Gate on `tools/list`.

1. `list_connections` (`connector="pinterest"`) first. Disconnected → connect;
   do not launch.
2. Inline targeting `{"countries": ["US"], "age_min": 25, "age_max": 55}`.
3. Pin `title` ≤100 characters.
4. `destination_url` (or `link_urls`) required.

| Tool | Notes |
|---|---|
| `launch_pinterest_ad` (`objective="awareness"`) | Connection check, countries, title, destination. |
| `launch_pinterest_ad` (`objective="traffic"`) | Same. |
| `launch_pinterest_ad` (`objective="sales"`) | Same. |
| `launch_pinterest_ad` (`objective="leads"`) | Same. |
| `launch_pinterest_ad` (`objective="video_views"`) | Same. |

Lists: `list_live_ads` (`channel="pinterest"`), `list_live_ads` (`level="ad_group"`, `parent_id` = campaign id) (`channel="pinterest"`) (pass
`campaign_id`), `list_live_ads` (`level="ad"`, `parent_id` = ad group id) (`channel="pinterest"`). Pause or resume with
`set_ad_status` (`channel="pinterest"`). Live vs paused (`campaign_spec.status_on_launch`) follows what the user asked; the server adds no default.
