# OpenAI Ads launch rules

Read this file only when launching on a **connected** OpenAI Ads
account. Use the connected Omneky MCP server. Gate on `tools/list`.

No connected account → [managed.md](managed.md)
(`launch_openai_ad` (`account="omneky_managed"`)).

`search_targeting` (`channel="openai"`) is optional — omit `campaign_spec.targeting`
to reach all eligible locations; otherwise paste
`campaign_spec_fragment` into `campaign_spec.targeting`.

- Daily budget floor is the figure `get_launch_requirements`
  returns (do not invent a dollar floor)
- Image `chat_card` only
- Title 3–50 / body ≤100
- `destination_url` required
- New ad groups need `max_bid_dollars`

| Tool | Notes |
|---|---|
| `launch_openai_ad` (`objective="clicks"`) | Connected OpenAI Ads. Location optional. |
| `launch_openai_ad` (`objective="impressions"`) | Same location and creative rules; the tool bids on impressions (no `bidding_type` argument). |

Live vs paused (`campaign_spec.status_on_launch`) follows what the user asked; the server adds no default.
Targeting stays on `campaign_spec.targeting`.
