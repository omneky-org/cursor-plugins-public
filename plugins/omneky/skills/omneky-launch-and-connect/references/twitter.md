# X Ads launch rules

Read this file only when launching on X Ads. Use the connected
Omneky MCP server. Gate on `tools/list`.

Wire name is `twitter`, never `x`. Omit targeting = US. Optional
`search_targeting` (`channel`, `query`) with `channel="twitter"`.

`bid_amount` is dollars, not micros, and must be omitted when
`bid_strategy` is `AUTO`. Headline ≤280 characters.

| Tool | Notes |
|---|---|
| `launch_x_ad` (`objective="awareness"`) | `channel="twitter"`. |
| `launch_x_ad` (`objective="traffic"`) | Same. |
| `launch_x_ad` (`objective="engagements"`) | Same. |
| `launch_x_ad` (`objective="followers"`) | Same. |
| `launch_x_ad` (`objective="video_views"`) | Same. |

Pause with `set_ad_status` at **campaign** level only.
Live vs paused (`campaign_spec.status_on_launch`) follows what the user asked; the server adds no default.
