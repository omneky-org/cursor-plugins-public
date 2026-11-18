# Claude directory submission: Omneky plugin

Answers to paste into the developer portal at
[claude.ai/directory/manage](https://claude.ai/directory/manage) when
submitting `claude-code/omneky`. Nothing here is submitted
automatically.

Docs: [Submit your plugin](https://claude.com/docs/plugins/submit),
[Plugin pre-submission checklist](https://claude.com/docs/plugins/pre-submission-checklist),
[Publish to the directory](https://claude.com/docs/directory/publish).

## Who submits

Submit from the Omneky Claude organization that owns the Omneky
connector listing, so the two listings can be paired. On Team or
Enterprise, an Owner (or a role with the Directory permission)
submits. The first organization to submit a repository folder owns
that listing.

## Portal steps

| Step | Field | Answer |
|---|---|---|
| Submit new | What would you like to submit? | Plugin bundle |
| Source | Repository | `omneky-org/cursor-plugins-public` |
| Source | Plugin path | `claude-code/omneky` |
| Source | Branch or tag | `main` |
| Validate | | No Blocking findings expected. `claude plugin validate ./claude-code/omneky` passes with none |
| Listing details | | Read from `plugin.json` and the plugin README; edit there, not in the portal |
| Data handling | | See below |
| Compliance | Contact email | A monitored Omneky address, then read and tick the four acknowledgements |
| Review and submit | Updates | Keep GitHub push webhook; leave auto-publish off for the first version |
| After submit | Pairing | Pair the plugin with the Omneky connector listing |

## Data handling answers

- **Does the plugin read or store personal data?** The plugin stores
  nothing. Through the Omneky connector it can read the signed-in
  user's ad account data and, when the user has connected it, CRM
  records such as HubSpot contacts and companies.
- **Does it send data to services other than its declared
  connectors?** No. The only server is
  `https://mcp.omneky.com/mcp-claude`.
- **How long does it keep data?** The plugin keeps none. Omneky's
  retention is set out in its
  [privacy policy](https://www.omneky.com/privacy-policy).
- **Is it intended for people under 18?** No.

## Listing copy

Short description (from `plugin.json`):

> Run paid ads with Omneky from Claude: weekly ad reviews, tired
> creative refreshes, brand setup, launches, budgets and ROAS reporting
> across Meta, Google Ads, TikTok, LinkedIn, Reddit, Pinterest, X Ads
> and OpenAI Ads.

Long description:

> Ask Claude how your ads did last week and get one clear read: what
> spent, what won, what slipped, and the two or three changes worth
> making. Ask it to refresh tired ads and it finds the ones losing
> clicks, writes a brief from your best performers, and swaps the new
> ad in without a gap in delivery. New to Omneky? It walks you through
> brand setup, product import and connecting your ad accounts. Every
> launch, pause and budget change waits for your yes.

## Not in this plugin

The directory does not accept AI image, video or audio generation, so
the plugin uses the Directory-safe connector. Requests to make or edit
creative are referred to the Omneky app, and finished assets can be
launched from Claude.

## Before each release

1. Raise `version` in `claude-code/omneky/.claude-plugin/plugin.json`.
2. Run `claude plugin validate ./claude-code/omneky`.
3. Merge to `main`; the directory scans the new commit.
