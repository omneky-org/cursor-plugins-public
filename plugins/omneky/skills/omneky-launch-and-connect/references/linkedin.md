# LinkedIn launch rules

Read this file only when launching on LinkedIn. Use the connected
Omneky MCP server. Gate on `tools/list`.

Required before any `launch_linkedin_ad` (the API returns 400 without
it):

1. `search_targeting` (`channel`, `query`) with `brand_id`, `channel="linkedin"`,
   `types=["locations"]`, and the place the user named (`query`).
2. Copy a hit whose value includes
   `urn:li:adTargetingFacet:locations` into `targeting_criteria`.
   Do not invent a URN.
3. A new campaign group also needs `start_date` (`YYYY-MM-DD`).

| Tool | Notes |
|---|---|
| `launch_linkedin_ad` (`objective="brand_awareness"`) | Location search + `start_date` rule. |
| `launch_linkedin_ad` (`objective="website_visits"`) | Same. |
| `launch_linkedin_ad` (`objective="conversions"`) | Same. |
| `launch_linkedin_ad` (`objective="engagement"`) | Same. |

Live vs paused (`campaign_spec.status_on_launch`) follows what the user asked; the server adds no default.
