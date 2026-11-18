---
name: brand-setup
description: >-
  Get a brand ready to run ads with Omneky: pick the brand, check
  what setup is missing, fill in brand info, import products from
  the website, connect ad accounts and data sources, and confirm
  reporting data is flowing. Use for first-time setup, onboarding,
  getting started with a new brand, connecting Meta or Google Ads
  for the first time, or "what do I still need to set up". Do not
  use for sign-in errors (getting-started), a
  launch on an already connected account
  (launch-meta-ads, launch-google-tiktok-ads, manage-ads), or performance questions
  (weekly-ad-review). Keywords: onboarding, set up my brand,
  get started, first time, connect ad account, import products,
  brand profile, setup checklist, ready to launch.
---

# Set up a brand

Use this when a brand is new to Omneky, or the user asks what is
left to set up before they can launch and report. One job: a
complete setup checklist, worked through in order, with each gap
closed or named.

Call tools by their exact names when they are on `tools/list`.

## Goal

A brand with its info filled in, at least one product in the
catalogue, its ad accounts linked, and reporting data confirmed, or
a short list of what is still missing and who has to do it.

## Flow

1. Who and which brand: `get_current_user`, then `list_brands`.
   More than one brand → ask which, by name or website. Keep that
   `brand_id` for the whole setup.
2. What is missing: `get_onboarding_status` for that brand. Work
   only the sections it reports as incomplete.
3. Brand info: `get_brand_details`. If the profile is thin,
   `analyze_brand` drafts it from the website; show the user the
   draft before relying on it.
4. Products: `list_brand_products`. None, or the user names one →
   import from a product page with `identify_product_from_url`,
   then `scrape_product_from_url`, then `finalize_scraped_product`.
   A listing or home page → ask for one product page.
5. Ad accounts: `list_connector_statuses` or
   `get_channel_connection_status` per channel. To connect one:
   `get_channel_connect_url` (the user signs in on the platform),
   then `list_authorized_ad_accounts` for the account they pick
   (Meta also needs `list_authorized_facebook_pages`). When
   `link_ad_channel_account` is on `tools/list`, call it. If it is
   not listed, say that capability isn't available on this
   connector. Never ask for a password or token.
6. Optional sources the user wants: HubSpot, Semrush, Ahrefs,
   PostHog, Google Drive, each through its own status and connect
   tool when listed.
7. Reporting: `check_reporting_data_available`. A newly linked
   account can take time to import; say so instead of reporting
   zeros.
8. Finish with the checklist: done, still missing, and the next
   step (a first paused launch through `launch-meta-ads` or `launch-google-tiktok-ads`,
   or a first review through `weekly-ad-review`).

## When to use

- "Set up my brand", "get me started", "what's left to set up"
- A new brand or a new ad channel for an existing brand
- Products missing from the catalogue before a first launch

## When not to use

- Sign-in fails or tools error (`getting-started`)
- Launching on an account that is already linked
  (`launch-meta-ads` or `launch-google-tiktok-ads`)
- How ads are performing (`weekly-ad-review`)
- Credits or plan (`get_account_credit_balance`; plan changes happen in the Omneky app)
- Making image or video ads here (`creative-referral`)

## Failure and recovery

Auth or 401 → `getting-started` (host OAuth).
Connect link expired or account not shown → call
`get_channel_connect_url` again; the user may lack admin access on
the ad platform.
A tool missing from `tools/list` → say that step is unavailable on
this connector and point to the Omneky app.
Never ask for internal ids. Never switch `brand_id` silently.
