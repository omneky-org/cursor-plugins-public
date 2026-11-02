# Tool name fallbacks (older app snapshots)

These skills name the current tools. A published app can still run an
older snapshot whose `tools/list` uses the older names. When a tool
named in a skill is not on this session's `tools/list`, find it in the
left column and call the first older name that **is** listed. The
brackets show the current tool's argument that picked that older
tool; leave it out when calling the older tool and pass its own
inputs. Never call a name that is not on `tools/list`; if none
is listed, say the capability is not available here and point to the
Omneky app.

API keys are never entered in chat, even if an older snapshot lists a
key-entry tool: send the user to the Omneky Connections page instead.

| current tool | older names (current-tool argument) |
|---|---|
| check_clone_video | clone_video_pre_assessment |
| delete_ad_entities | delete_ad_group (level="ad_group", ids), delete_ads (level="ad", ids), delete_campaign (level="campaign", ids) |
| disconnect_connector | disconnect_google_drive (connector="google_drive"), disconnect_posthog (connector="posthog") |
| estimate_reach | reach_estimate |
| find_avatars_and_voices | list_avatar_filters (include="filters"), list_voices (include="voices"), search_avatars (include="avatars") |
| get_account | get_billing_summary, get_company, get_credit_history (include_credit_history=true), get_current_user, get_payment_method_summary |
| get_brand | get_brand_details |
| get_connect_link | get_channel_connect_url, get_google_drive_connect_url (connector="google_drive") |
| get_creative_status | get_generation_status |
| get_keyword_insights | ahrefs_organic_keywords, get_semrush_keyword_overview |
| get_launch_requirements | get_ad_custom_properties (include=["custom_properties"]), minimum_budget_for_objective |
| get_marketing_plan | get_marketing_plan_run (run_id) |
| get_performance_summary | get_daily_metrics |
| get_products | get_product_details, list_brand_products |
| get_seo_domain_overview | ahrefs_backlinks_stats, ahrefs_domain_rating, get_semrush_domain_overview |
| import_product_from_url | identify_product_from_url (url), scrape_product_from_url (url) |
| link_ad_account | link_ad_channel_account |
| list_ad_accounts | list_authorized_ad_accounts, list_authorized_facebook_pages |
| list_connections | ahrefs_connection_status (connector="ahrefs"), get_channel_connection_status (connector), get_google_drive_connection_status (connector="google_drive"), get_hubspot_connection_status (connector="hubspot"), get_openai_ads_connection_status (connector="openai"), get_pinterest_connection_status (connector="pinterest"), get_posthog_connection_status (connector="posthog"), get_semrush_connection_status (connector="semrush"), list_connector_statuses |
| list_creatives | list_ad_instance_items |
| list_live_ads | get_ad_groups (level="ad_group", parent_id = campaign id), get_ads (level="ad", parent_id = ad group id), get_campaign_ad_group_names (name_query), get_campaigns, get_channel_budget |
| plan_product_video | fetch_product_video_narratives |
| resize_creative | resize_ad, resize_image (width + height) |
| save_imported_product | finalize_scraped_product (draft_id) |
| search_crm | hubspot_get_company (object_type="companies"), hubspot_get_contact (object_type="contacts", id), hubspot_get_deal (object_type="deals", id), hubspot_search_companies (object_type="companies"), hubspot_search_contacts (object_type="contacts"), hubspot_search_deals (object_type="deals") |
| search_targeting | get_tiktok_location_ids (channel="tiktok", objective), openai_location_search (channel="openai"), search_ad_targeting (channel, query), search_google_countries (channel="google") |
| set_ad_status | set_ad_entity_status |
| update_product | update_product_url, upsert_brand_product |
