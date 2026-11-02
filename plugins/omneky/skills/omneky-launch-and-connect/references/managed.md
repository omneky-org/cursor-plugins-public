# Omneky-managed launch rules

Read this file only for a managed launch (no connected Meta or
OpenAI Ads account, or the user asked for managed). Use the
connected Omneky MCP server. Gate on `tools/list`.

Skip Connect and the disconnected-account preflight. These tools
work without a linked advertiser account. Do not refuse because
`list_connections` (`connector`) is disconnected.

Prepaid: `status=payment_required` means nothing launched. Tell the
user the amount the server reports and that payment happens in the
Omneky app. Do not send payment links. Retry the launch once it is
paid.

| Tool | Notes |
|---|---|
| `launch_meta_ad` (`account="omneky_managed"`) | No connected Meta account. Objectives: traffic / video_views / awareness only. Do not pass a landing-page URL in ad specs. |
| `launch_openai_ad` (`account="omneky_managed"`) | No connected OpenAI Ads account. Same prepaid / hosted-landing-page rules. |

Live vs paused (`campaign_spec.status_on_launch`) follows what the user asked; the server adds no default. Connecting an account is a separate step
from launching.
