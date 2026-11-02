# Reddit launch rules

Read this file only when launching on Reddit. Use the connected
Omneky MCP server. Gate on `tools/list`.

Inline targeting. Example shape:
`{"geolocations": ["US"], "communities": [...]}`.

`bid_value` is micros (dollars × 1,000,000). Convert the user's
dollar bid; do not invent a bid they did not approve.

| Tool | Notes |
|---|---|
| `launch_reddit_ad` (`objective="awareness"`) | Inline targeting + micros `bid_value`. |
| `launch_reddit_ad` (`objective="traffic"`) | Same. |
| `launch_reddit_ad` (`objective="conversions"`) | Same. |
| `launch_reddit_ad` (`objective="leads"`) | Same. |
| `launch_reddit_ad` (`objective="video_views"`) | Same. |

Live vs paused (`campaign_spec.status_on_launch`) follows what the user asked; the server adds no default.
