# Ab tests playbook

Detail for this skill's SKILL.md. Read the section the current step needs.

## Hard rules

- Stick to the chosen `brand_id`. Never silent-switch brands.
- One hypothesis, **one** variable. Extra changes are a new test.
- Set each arm's `status_on_launch` from the user's request (the server
  adds no default); launches are marked destructive.
- Call the budget-floor tool (`get_launch_requirements`)
  before any budget. Do not set a daily budget under that floor.
  Split the stated total across variants; each arm stays at or
  above the floor or you do not launch.
- Paid creatives that precede the test use the owning creative
  skill: Never invent a price.
- Precommit and record the test plan: `primary_metric` (one),
  `baseline_rate`, `mde`, `alpha` (default 0.05), `power`
  (default 0.8), `n_per_arm` from the two-proportion formula
  (show it), `randomization_unit` plus the ad-level-split caveat,
  `attribution_window`, and `horizon` (end date or sample).
- Measure: **Invalid** is exempt from the horizon gate. The
  setup check runs on every look, including pre-horizon
  peeks. If it fails, give the verdict Invalid immediately,
  Stop, and recommend pausing or fixing (pause is a later step via
  `omneky-launch-and-connect`; never mutate here). Only
  Winner, Not commercially meaningful, Inconclusive, and
  No detectable difference wait for `horizon`. A peek that
  passes setup is INTERIM. Early stop needs an explicit
  acknowledgement and a Bonferroni or O'Brien-Fleming
  correction (or say it is not supported).
- Report effect size + CI, p-value, and achieved power.
  Significance is not commercial meaning — compare to `mde` and
  a CPA / ROAS $ impact.
- SRM → Invalid only on a randomized planned split (platform
  A/B / split-test, or an explicit planned allocation). Default
  one-ad-group, one-ad-per-variant delivery is auction-driven:
  do not run SRM as a gate; report imbalance as a caveat and
  compare rates, not totals. Broken setup (near-zero delivery,
  mid-test change, more than one variable) → Invalid. Low
  counts → Insufficient data. Many variants → Bonferroni.
- Scale / kill / iterate is a later step
  (`omneky-launch-and-connect`).

## Create

1. Write the test plan with the user (one turn if they already
   gave it):
   - Hypothesis (what should win, and why)
   - Single variable (creative, or headline, or audience — pick one)
   - `primary_metric` (CTR or CVR — one only)
   - `baseline_rate` from `get_performance_summary` with `date_range`,
     or a stated assumption
   - `mde` (absolute rate)
   - `alpha` 0.05 and `power` 0.8 unless they set others
   - `n_per_arm` from the two-proportion formula (show it;
     [ab-test-statistics](ab-test-statistics.md))
   - `randomization_unit` and the caveat that platform ad-level
     splits are not true user randomization unless platform A/B
     is used
   - `attribution_window`
   - `horizon` (end date or sample). This is the stop rule.
2. Variants come from the structured brief (or a prior creative
   handoff). Same brief except the one variable.
3. Structure: one campaign, one ad group, one ad per variant (same
   targeting). This does not guarantee an even spend split: delivery
   is auction-driven, so tell the user. When they need an even split,
   use one ad group (or campaign) per variant with equal budgets, or
   the platform's A/B / split-test feature. Use an existing campaign
   only when they named it (`campaign_spec.id`).
4. Preflight the channel with `omneky-launch-and-connect` rules:
   connect status, budget floor, targeting pre-call, copy / CTA /
   landing URL, credits. Status follows the test plan.
5. One summary: channel, tool, variants, budget split (and whether it
   is enforced), floor, the full test plan, live or paused as the user
   chose, then launch (the host confirms).
6. Call the matching `launch_*` tool. Then write the test plan back
   (`primary_metric`, `baseline_rate`, `mde`, `alpha`, `power`,
   `n_per_arm`, `randomization_unit`, `attribution_window`,
   `horizon`, campaign / ad ids).

Live vs paused is the user's choice in the host; follow it.

## Measure

1. Reuse the test plan. Missing ids: `list_live_ads` /
   `list_live_ads` (`level="ad_group"`, `parent_id` = campaign id; `level="ad"` for ads). Do not guess.
2. `get_performance_summary` (`include_coverage=true`) for the brand + window +
   channel. No imported data → stop. Empty is not zero.
3. `get_performance_breakdown` (dimension ad or creative) and
   `get_performance_summary` for the window. `get_performance_movers`
   when they asked what changed vs the prior period.
4. Setup check on every look, including pre-horizon peeks.
   **Invalid** only for a broken setup: near-zero delivery
   on a variant, a variant changed mid-test, or more than
   one variable differs. Default setup (one ad group, one
   ad per variant) is auction-driven: do not run SRM as a
   gate. Report delivery imbalance as a caveat and compare
   rates, not totals. Run SRM → Invalid only when traffic
   was randomized with a planned split (platform A/B /
   split-test, or an explicit planned allocation) and
   χ² p < 0.001. If the setup check fails, give the verdict
   Invalid immediately, Stop, and recommend pausing or fixing the
   test (a pause is a later step via
   `omneky-launch-and-connect`; never mutate here).
5. Sample size: state impressions, clicks, and conversions per
   arm. Thin if either arm has fewer than about 1,000 impressions
   or 30 clicks (or 10 conversions when the metric is CVR) →
   Insufficient data. Do not declare a winner.
6. Horizon not reached and setup check passed → **INTERIM**
   status only. No statistical verdict (Winner / Not
   commercially meaningful / Inconclusive / No detectable
   difference). Do not relabel a failed setup check as
   INTERIM. If they insist on early stopping, require an
   explicit acknowledgement and apply Bonferroni across
   looks or O'Brien-Fleming-style (see the statistics
   reference). If they will not acknowledge, say early
   stopping is not supported.
7. Horizon reached (or corrected early stop): two-proportion
   z-test on the precommitted metric. Two-sided. Show n,
   successes, z, p-value, 95% CI, achieved power. This is a
   simple frequentist check, not an uncorrected sequential test
   — say that.
8. Verdict:
   - **Invalid** — exempt from the horizon gate. From the
     step-4 setup check on every look, including peeks.
     Immediate Stop. Recommend pausing or fixing (later step
     via `omneky-launch-and-connect`; never mutate here).
   - Only these wait for `horizon` (or a corrected early
     stop — lead with this):
     - **Inconclusive (underpowered)** — power < 0.8 and not
       significant
     - **No detectable difference** — |z| < 1.96 and power ≥ 0.8
     - Not commercially meaningful — significant but |lift| < `mde`
       (or $ impact below the stated floor)
     - **Winner** — significant, |lift| ≥ `mde`, $ impact stated
9. Scale / kill / iterate is a later step on
   `omneky-launch-and-connect`. Do not mutate here.
