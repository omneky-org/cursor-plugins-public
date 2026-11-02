# Meta / Facebook launch rules

Read this file only when launching on Meta / Facebook. Use the
connected Omneky MCP server. Gate on `tools/list`.

Inline targeting. No lookup tool. Example shape:
`{"countries": ["US"], "age_min": 25, "age_max": 55}`.

| Tool | Notes |
|---|---|
| `launch_meta_ad` (`objective="sales"`) | Inline targeting. |
| `launch_meta_ad` (`objective="leads"`) | Same targeting. Set `lead_gen_form_id` on ad specs for native forms. |
| `launch_meta_ad` (`objective="awareness"`) | Same targeting. |
| `launch_meta_ad` (`objective="traffic"`) | Same targeting. |
| `launch_meta_ad` (`objective="video_views"`) | Same targeting. |

Live vs paused (`campaign_spec.status_on_launch`) follows what the user asked; the server adds no default.
