# Launch and connect playbook

Detail for this skill's SKILL.md. Read the section the current step needs.

## Channel rules

Read **only** the reference for the channel you are launching. Do not
load the other eight. Channel budgets, required fields, and targeting
live there — not in this file.

| Channel | Read | Call |
|---|---|---|
| Meta / Facebook | [references/facebook.md](facebook.md) | `launch_meta_ad`; `objective`: sales, leads, awareness, traffic, video_views |
| Google | [references/google.md](google.md) | `launch_google_ad`; `objective`: performance_max, demand_gen |
| LinkedIn | [references/linkedin.md](linkedin.md) | `launch_linkedin_ad`; `objective`: brand_awareness, website_visits, conversions, engagement |
| Reddit | [references/reddit.md](reddit.md) | `launch_reddit_ad`; `objective`: awareness, traffic, conversions, leads, video_views |
| TikTok | [references/tiktok.md](tiktok.md) | `launch_tiktok_ad`; `objective`: traffic, leads, video_views, conversions |
| X Ads | [references/twitter.md](twitter.md) | `launch_x_ad`; `objective`: awareness, traffic, engagements, followers, video_views |
| Pinterest | [references/pinterest.md](pinterest.md) | `launch_pinterest_ad`; `objective`: awareness, traffic, sales, leads, video_views |
| OpenAI Ads | [references/openai.md](openai.md) | `launch_openai_ad`; `objective`: clicks, impressions (`search_targeting` (`channel="openai"`) optional) |
| Managed (no ad account) | [references/managed.md](managed.md) | `launch_meta_ad` (`account="omneky_managed"`), `launch_openai_ad` (`account="omneky_managed"`) |

Every channel and objective the `launch_*` tools accept is named above. Do not
guess another combination.

## Launch path

Pick one branch before any `launch_*` call.

**paused-campaign-from-winners.** Incoming handoff from analytics +
creative must include accepted `asset_url`s, `source_evidence`, and
`source_ad_ids`. Status follows what they asked. One summary, then launch.

An A/B test with a recorded plan (hypothesis, metric, duration,
stop rule) is `omneky-ab-tests`. A budget-reallocation
**recommendation** is `omneky-analytics-and-catalogue`. Applying
`set_ad_budget` after that recommendation happens here (the host
confirms it).

**waste-pruner (apply).** Incoming pause list from analytics.
One summary naming each entity. Then `set_ad_status`
(the host confirms it).

**audience-targeting-apply.** Incoming tokens from
`search_targeting` (`channel`, `query`). `update_ad_targeting` (the host confirms it).

**target-cpa-budget-apply.** Incoming floor from
`get_launch_requirements` / `estimate_reach`. `set_ad_budget`
at or above the floor (the host confirms it).

### Managed launch

`launch_meta_ad` (`account="omneky_managed"`) or `launch_openai_ad` (`account="omneky_managed"`)
when the brand has no connected Meta / OpenAI Ads account, or the
user asks for managed. Read
[references/managed.md](managed.md). Skip Connect and the
disconnected-account preflight — these tools work without a linked
advertiser account. Still: budget floor, copy / CTA / hosted-landing
rules, credits, one summary, status from the user's request. Then Launch
checks.

### Self-managed launch

Every other `launch_*` call. Full Preflight below. Disconnected →
Connect, do not launch.

## Preflight (self-managed)

Work through this checklist with tool calls before a self-managed
the channel's `launch_*` tool call. Reuse answers the user already gave; ask only for
what is still missing (usually copy, landing URL, budget, and
audience). Then show **one** launch summary — channel, tool, account,
campaign / ad set (new or existing), budget, audience, copy, CTA,
landing URL, creative, and status — then call the channel's `launch_*` tool. Fill
gaps from the conversation and sensible defaults; ask only for what
you cannot infer. Do not ask for a separate confirmation per item.
The launch tools are marked destructive, so the host shows its own confirmation before they run.

Status: `campaign_spec.status_on_launch` decides whether the new
campaign goes live (`ACTIVE` / `ENABLED`) or is created paused
(`PAUSED` / `DISABLED`). Set it from what the user asked; the server
adds no default, so when you omit it the ad network's own default
applies.

Hierarchy is Campaign → Ad Set (`ad_group`) → Ad. The creative is an
asset on the Ad (`ad_specs`), never on the campaign.

1. **Objective.** Name the channel and the exact `launch_*` tool from
   the table. Read that channel's reference. Do not guess a sibling
   objective.
2. **Connected account (self-managed only).**
   `list_connections` (X Ads: `connector="twitter"`).
   Pinterest also: `list_connections` (`connector="pinterest"`). Disconnected →
   Connect below. Do not launch.
3. **Budget.** `get_launch_requirements` with `brand_id`, channel,
   and objective. Do not set a daily or lifetime budget under that
   floor. `list_live_ads` is allocated daily budget, not spend,
   not the floor, and not historical ROAS. A disconnected channel is a
   per-channel error, not an empty total.
4. **Targeting.** The channel pre-call in that reference. Do not launch
   LinkedIn or TikTok without it (the API returns 400).
5. **Copy, CTA, and landing URL.** Use what the user gave. Do not
   invent a destination. Meta leads also need `lead_gen_form_id` on
   the ad spec.
6. **Existing campaign or ad set.** `list_live_ads`, then
   `list_live_ads` with `level="ad_group"` and `parent_id` (campaign id) (unscoped lists can timeout).
   Add under an existing campaign: `campaign_spec={"id": "<campaign_id>"}`.
   Add into an existing ad set: `ad_group_spec={"id": "<ad_set_id>"}`
   and set `adset_id` on each ad spec.
7. **Audience size.** `estimate_reach` with `brand_id`, `channel`, and
   `targeting_fragments` when the user asks how large the audience is.
   That is an estimate, not live delivery or ROAS.
8. **Custom conversions.** `get_launch_requirements` (`include=["custom_properties"]`) when the launch needs
   a brand conversion event. Not a performance report.
9. **Credits.** Launch creates need available Omneky credits; the
   server checks this. `credit_insufficient` means the launch did
   **not** start. Do not retry it. Tell the user the shortfall; plan
   changes happen in the Omneky app. Never collect a PAN. Never invent a
   credit purchase tool.

## Targeting pre-calls

Meta and Reddit take inline targeting (see those references). X Ads
uses `channel="twitter"`. Pinterest checks
`list_connections` (`connector="pinterest"`) and uses inline countries. The three
lookups below are required before launch.

**TikTok.** Before any `launch_tiktok_ad`: `search_targeting` with `channel="tiktok"`, `brand_id` and required `objective`. Put the returned
ids on the ad group as `location_ids`. Without them the API returns
400. Details: [references/tiktok.md](tiktok.md).

**LinkedIn.** Before any `launch_linkedin_ad`: `search_targeting` (`channel`, `query`)
with `brand_id`, `channel="linkedin"`, `types=["locations"]`. Copy a
hit whose value includes `urn:li:adTargetingFacet:locations` into
`targeting_criteria`. A new campaign group also needs `start_date`.
Details: [references/linkedin.md](linkedin.md).

**Google Demand Gen vs PMax.** Demand Gen is one image or video on
YouTube or Discover — `search_targeting` (`channel="google"`), then
`targeting_fragments`. PMax is the full multi-placement asset suite
(no country lookup). Details: [references/google.md](google.md).

`register_creative_for_launch` is optional (Ad Central library). Pass
`asset_url` or `preview_storage_key` as the finished HTTPS URL
(`presigned_url` / `assets.url`); the server copies it. Launch itself
takes `ad_specs[].media_url`. Use `search_targeting` (`channel`, `query`) for LinkedIn /
optional X Ads location lookup.

## Creative → launch (short)

Generation stays in the matching creative skill (`omneky-image-ads`,
`omneky-product-video`, `omneky-avatar-ugc`,
`omneky-voice-and-video-clone`, or `omneky-edit-and-resize`). This
skill starts once the user
has a finished Omneky ad and wants it on a paid-media channel.

1. The launch summary covers the creative URL too.
2. Put the finished HTTPS URL (`presigned_url` / `resized_ad_url` /
   `assets.url`) on `ad_specs[].media_url` with `media_type`. Published
   copy fields (`headline`, `primary_text`, `cta`, `landing_url`) are
   mapped to the launcher names. Google Performance Max: `ad_specs: []`
   and put images / `link_url` / headlines (≥3) / descriptions (≥2) on
   `ad_group_spec`. Square and logo images are required and must not
   reuse the landscape ad image.
   `register_creative_for_launch` is optional (library). Pass
   `asset_url` or `preview_storage_key` as that same HTTPS URL if the
   user wants it saved. Do not stop for a missing storage key.
3. Run the matching Launch path (managed or self-managed Preflight),
   then the matching `launch_*` tool from the table. Keep the launch
   status from the user's request. Then run
   Launch checks.

## Manage (short)

`list_live_ads` (each row is name with campaign id) /
`list_live_ads` (`level="ad_group"`, `parent_id` = campaign id; `level="ad"` for ads). A disconnected or
skipped channel returns an explicit error, not an empty-looking list.
`set_ad_status` (pause or resume), `set_ad_budget`,
`update_ad_targeting`, `set_ad_status` (`channel="pinterest"`).

Before any of those mutate tools, state one summary: the entity (name
and id), the channel, the current value, the new value, and that the
change affects live spend. Then call the tool; it is marked
destructive, so the host confirms it. Do not confirm each item
separately.

Name the user said, ids only: `list_live_ads` (`name_query`). Not a
status or budget list.

Pinterest lists: `list_live_ads` (`channel="pinterest"`), `list_live_ads` (`level="ad_group"`, `parent_id` = campaign id) (`channel="pinterest"`)
(pass `campaign_id`), `list_live_ads` (`level="ad"`, `parent_id` = ad group id) (`channel="pinterest"`). Pause or resume with
`set_ad_status` (`channel="pinterest"`) (same one-summary rule).

`needs_user_decision` → fill the missing detail and call again; ask
in plain chat only if you cannot. Do not dump raw JSON.

**Deletes.** `delete_ad_entities` (`level="campaign"`, `ids`), `delete_ad_entities` (`level="ad_group"`, `ids`), and `delete_ad_entities` (`level="ad"`, `ids`)
are irreversible. Prefer pause (`set_ad_status`) when the user
only wants a stop.

1. Resolve ids first: `list_live_ads`, `list_live_ads` (`level="ad_group"`, `parent_id` = campaign id), `list_live_ads` (`level="ad"`, `parent_id` = ad group id). Do not delete from a name alone.
2. In chat, name exactly what will be removed: channel, entity type,
   name, and id. Say it cannot be undone.
3. Call the delete only for what the user asked to remove. The delete
   tools are marked destructive, so the host confirms them.
4. Then call one tool:
   - `delete_ad_entities` — `brand_id`, `channel`, `level="campaign"`, `ids`
   - `delete_ad_entities` — `brand_id`, `channel`, `level="ad_group"`, `ids`
   - `delete_ad_entities` — `brand_id`, `channel`, `level="ad"`, `ids` (list of ids)

## Connect (short)

Paid-media self-connect for the chosen brand. OAuth wire values:
`facebook`, `google`, `linkedin`, `tiktok`, `reddit`, `twitter`,
`pinterest`. X Ads is `twitter`, never `x`. OAuth channels never need a
token or password in chat — do not ask for one.

Call `link_ad_account` only when it appears on this
session's `tools/list`. If it is not listed, say that capability
isn't available on this connector. Do not invent a link.

1. `get_connect_link` with `connector` and `brand_id`. Omit
   `redirect_url` unless its host is `omneky.com`. Hand the user
   `connect_url` (or `browser_connect_url`). `next_action` is
   `open_connect_url`. They finish the provider consent screen.
2. **OAuth not finished.** If they have not completed consent, or
   `list_ad_accounts` is empty or errors, do not link and
   do not launch. Send the same URL again. Do not collect a token.
3. After they confirm consent: `list_ad_accounts` with
   `brand_id` and `channel`. Several accounts: ask which `id` / name.
   Do not pick silently.
4. Meta / Facebook pages: also `list_ad_accounts` with
   `brand_id`. When `link_ad_account` is on `tools/list`, it
   needs `facebook_page_id` plus `channel_account_id` and
   `channel_account_name`. If `link_ad_account` is not on
   `tools/list`, say that capability isn't available on this
   connector. Do not invent a link.
5. Other channels: when `link_ad_account` is on `tools/list`,
   call it with `brand_id`, `channel`, `channel_account_id`, and
   `channel_account_name`. If it is not listed, say that capability
   isn't available on this connector. Do not invent a link.
6. Confirm with `list_connections` and
   `list_connections` (`connector`). Still disconnected: stop and say
   so. Do not launch.

**OpenAI Ads** has no OAuth URL. Status:
`list_connections` (`connector="openai"`) (or `list_connections` (`connector`)
with `channel="openai"`).
Connect: `get_connect_link` (`connector="openai"`) takes the
brand's OpenAI Ads `api_key`. Use it only when the user chooses to
connect that way and supplies the key; pass the key to that tool only,
never repeat it, and never ask for it unprompted (the user can also
connect it in the Omneky app).
Launching on OpenAI Ads is supported:
connected accounts use `launch_openai_ad` (`objective="clicks"`) /
`launch_openai_ad` (`objective="impressions"`); brands without an account can use
`launch_openai_ad` (`account="omneky_managed"`) (see [references/openai.md](openai.md)
and [references/managed.md](managed.md)).

**PostHog:** `get_connect_link` (`connector="posthog"`) takes an `api_key`, `host`, and
`project_id`; same key rule as OpenAI Ads. The personal API key needs
both Project:Read and Query:Read. Then
`list_connections` (`connector="posthog"`) (host and project id, never the key).
`disconnect_connector` (`connector="posthog"`) when the user asks (marked destructive; the host confirms). Drive:
`list_connections` (`connector="google_drive"`), then
`get_connect_link` (`connector="google_drive"`) if it is disconnected.
`disconnect_connector` (`connector="google_drive"`) when the user asks (marked destructive). No Pinterest or
X Ads disconnect tool on this surface.

X Ads pause is `set_ad_status` at **campaign** level only.
Pinterest launches are supported (`launch_pinterest_ad`).

Connected OpenAI Ads launches use `launch_openai_ad`. OpenAI targeting
stays on `campaign_spec.targeting`. Unconnected Meta / OpenAI use
`launch_meta_ad` / `launch_openai_ad` with `account="omneky_managed"`. Connecting an account is a separate step
from launching.

## Launch checks

Observe the launch reply or one cheap get_* read-back. Request
arguments never prove saved campaign configuration.

Reply or read-back already shows the fact → say it plainly (e.g.
"done"). Do not hedge. Missing detail → **one** get_* call. If it
is still not confirmed, say so in one short plain sentence (e.g.
"I couldn't confirm the saved budget").

- Campaign / ad-set / ad ids — launch reply, then `list_live_ads` /
  `list_live_ads` (`level="ad_group"`, `parent_id` = campaign id) / `list_live_ads` (`level="ad"`, `parent_id` = ad group id) (Pinterest: the same `list_live_ads` calls with `channel="pinterest"`)
- Status equals the approval (live or paused as they asked) —
  same reply or a get_* read-back, not request `status_on_launch`
- Budget and dates — created entity via get_*. Request args never
  prove the save
- Channel and `launch_*` tool — the tool that ran plus the entity's
  channel field
- Creative URL and copy on the created ad — `list_live_ads` (`level="ad"`, `parent_id` = ad group id) (or
  launch-reply ad fields). Request `ad_specs` never prove the save

If a check fails: say which field differed. Do not claim live or
paused as requested. Do not silently relaunch.
