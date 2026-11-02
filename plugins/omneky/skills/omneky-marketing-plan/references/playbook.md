# Marketing plan playbook

Detail for this skill's SKILL.md. Read the section the current step needs.

## Goal intake

Ask once, only for what is missing, before `analyze_brand`:

- Outcome (what "good" looks like)
- Timeframe (default **7 days**)
- Channels they care about
- Constraints (keep launches `PAUSED`, brand claims they already
  approved)
- A credit or budget cap if they named one

Do not invent a cap. Do not start create until `brand_id` is
known.

## Loop

1. `analyze_brand` with `brand_id` (optional `website_url`). Draft
   `plan_id` / `analysis_id`, no steps. Uses Exa for evidence.
2. `create_marketing_plan` with `brand_id`, `plan_id`, and
   `analysis_id`. Omit `plan_body`; the server authors the plan. Default
   timeframe is **7 days**. Do not write `plan_body.steps`. Do not stop
   on `plan_body_required`. If the result is pending, follow Pending
   polls below, then read it with `get_marketing_plan`. Create is
   draft-only: no generation, launch, or credit deduct.
3. `revise_marketing_plan` with an `instruction` (or a server-authored
   `plan_body`) if the user wants changes. A revision replaces the
   saved plan in place (the earlier version is not kept and the saved
   preview is cleared), so it is marked destructive and the host
   confirms it. That starts a **pending revision**; poll `get_marketing_plan` until applied (same bounds).
   `plan_version` increments by 1 on apply, not at start. Pass
   `step_updates` or `completed_step_ids` to mark host-run steps done.
   Status-only mark-done does not start a pending revision.
4. `preview_marketing_plan_execution` is mandatory after create and
   after every applied revise. It is read-only and has no side effects.
   It returns the ordered checklist plus the plan's credit estimate.
   State that estimate in one line.
   Re-preview after revise so the checklist matches.
5. **Run.** State the checklist and estimated `credits.total_credits`,
   then run the steps. Launch steps are marked destructive, so the
   host confirms them.
6. **Execute.** Plans are data. Each step is
   `{tool, arguments, depends_on, status}`. `tool` is a name from
   this session's `tools/list`.
   Then call each
   `step.tool` with `step.arguments` yourself.
   Then
   `revise_marketing_plan` to mark that step done. Read progress
   with `get_marketing_plan` (read-only; unrun steps show `pending`).
   `execute_marketing_plan` is not on this surface. Do not invent it.
   Leftover runs started outside this surface: poll
   `get_marketing_plan` (`run_id`) or stop them with
   `cancel_marketing_plan_run`.

## Pending polls

Never silent-loop. Never start a second create or revise while one
may still be running. Reuse the same `plan_id`.
Lost the `plan_id` from an earlier turn? Call `get_marketing_plan` (no `plan_id`)
(read-only, newest first) and reuse the matching plan's id.

1. Tell the user the plan is being written (or the revision is
   applying).
2. Call `get_marketing_plan` every **10 seconds**, at most **6** times
   (~60s).
3. Still pending: "Still writing the plan."
4. After 6 pending reads: stop. Offer to check back. Do not resubmit
   create or revise.
5. When applied: run Plan-created checks, then preview.

Quoted cost is compared to the cost you **stated** from the preview.
Request arguments
never prove a saved plan or preview.

Reply or a `get_marketing_plan` read-back already shows the fact →
say it plainly (e.g. "done"). Do not hedge. Missing detail → **one**
get. If it is still not confirmed, say so in one short plain sentence
(e.g. "I couldn't confirm the charge"). If a check fails: say which
field differed. Do not run steps on a stale preview.

## Plan-created checks

After create or an applied revise — before preview exists:

- Non-empty `plan_id` — observe create/revise or `get_marketing_plan`
- Non-empty steps — observe plan_body.steps on `get_marketing_plan`
- Selected step id + one-line summary match the request — observe
  those saved-plan fields, not the create arguments
- `plan_version` equals the applied version (revise +1 on apply) —
  observe `get_marketing_plan`

## Preview checks (state cost and proceed)

After `preview_marketing_plan_execution`, before the host runs steps.
There is no approval gate: state the quoted cost in one line and
proceed. Stop and ask only when it exceeds a cap the user named.

- Ordered checklist tools are names from this session's `tools/list`
- The cost you stated equals preview `credits.total_credits` (or
  equivalent) on **this** preview, not a stale one

## Host-step checks

After each listed `step.tool` call:

- That step's `status` is `done` — observe `get_marketing_plan` after
  `revise_marketing_plan` with `step_updates` / `completed_step_ids`
- Unrun steps may stay `pending`
- Charge for that step reconciles with the **stated** quoted line
  when the tool is quotable
