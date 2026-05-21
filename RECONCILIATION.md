# Frontend ↔ Backend Reconciliation

This document inventories every place where the frontend prototype (`/Users/ob/ascala/project/`)
diverges from the three backend schemas. Backend schemas are the source of truth; the frontend
must change to match.

**Backend schema sources:**
- `backend/persona_synthesis/schema.py` — `SynthesisResult` (3 `PersonaGroup`s + `ContextSummary`)
- `backend/persona_simulation/schema.py` — `SimulationResult` (screen graph, agent paths, report, metrics, categorized issues)
- `backend/persona_report/schema.py` — `Report` (6 `TestTypeReport`s + meta)

**Frontend status:** all data is hardcoded mock data — no live API calls exist anywhere.
Reconciliation will require both renaming/reshaping field accesses *and* threading real
backend data into components that currently receive nothing.

Each mismatch below uses this format:
- **Location** — file and line range in frontend
- **Current assumption** — what the frontend code expects
- **Backend contract** — what the schema actually produces
- **Proposed change** — concrete edit, OR a flag if the feature has no backend support

---

## Module: `persona_synthesis` → `SynthesisResult`

### M1 — Persona shape entirely wrong
- **Location:** `Panel3.jsx:78-82` (hardcoded `personas` array), `Panel3.jsx:125-143` (rendering)
- **Current assumption:**
  ```js
  { seed: int, name: str, role: str, attrs: [[k, v], ...] }
  ```
  Three personas are hardcoded; rendered as `<Avatar seed={p.seed}/>`, `p.name`, `p.role`,
  and a flat `<dl>` of `p.attrs` key-value pairs.
- **Backend contract:** `PersonaGroup`
  ```
  { id, name, estimated_share_pct,
    demographics: { age_range, education_level, occupation, role_seniority,
                    company_size, industry, geography, primary_device, language },
    cognitive: { tech_savviness, patience_threshold, risk_tolerance,
                 decision_style, learning_style, prior_saas_experience },
    economic: { pricing_sensitivity, budget_authority, trial_vs_roi },
    testing_postures: { accessibility, compliance, onboarding,
                        activation, engagement_retention },
    narrative: { backstory, goals, frustrations } }
  ```
- **Proposed change:** Replace the hardcoded array with `SynthesisResult.groups`. Derive
  display fields from the nested schema:
  - `seed` → keep as UI-only avatar variant; derive from array index `% 3`
  - `name` → `group.name` (direct)
  - `role` → `${group.demographics.occupation} · ${group.demographics.role_seniority}`
    (or use `group.narrative.backstory` first clause)
  - `attrs` → derive from a small selection of fields, e.g.:
    `[['age', group.demographics.age_range],
      ['context', group.demographics.industry || group.demographics.company_size],
      ['goal', group.narrative.goals[0]],
      ['blocker', group.narrative.frustrations[0]]]`

### M2 — Backend persona detail not rendered (flag)
- **Location:** persona card (`Panel3.jsx:125-143`)
- **Backend produces but frontend doesn't render:**
  - `PersonaGroup.estimated_share_pct` — share % of user base
  - `PersonaGroup.cognitive` (all 6 fields)
  - `PersonaGroup.economic` (all 3 fields)
  - `PersonaGroup.testing_postures` (5 nested posture objects with ~25 fields total)
  - `PersonaGroup.narrative.backstory` and the rest of `goals`/`frustrations`
  - `SynthesisResult.context_summary` (app_category, pricing_model, etc.)
- **Flag:** Decide whether persona cards should expand to show this richer schema, or
  whether to leave the current 4-attr summary card and surface detail on click. No
  current frontend feature is broken by this — backend data is simply unused.

---

## Module: `persona_simulation` → `SimulationResult`

### M3 — Hardcoded agent count "200"
- **Location:** `Panel3.jsx:209` ("spinning up 200 synthetic personas…"),
  `Panel3.jsx:252` ("200 synthetic"), `Panel3.jsx:297` ("200 personas · …"),
  `Report.jsx:267` ("200 synthetic personas")
- **Current assumption:** literal "200" agent count
- **Backend contract:** `SimulationResult.report.metrics.total_agents` is the actual count.
  `SimulationConfig.max_agents_budget` defaults to **150**, not 200.
- **Proposed change:** Replace literal with `metrics.total_agents`. The pre-run "spinning up"
  string can use the configured budget, but the post-run count must come from metrics.

### M4 — Screen graph not rendered (flag)
- **Location:** no UI exists for this anywhere in the frontend
- **Backend contract:** `SimulationResult.screen_graph: ScreenGraph` containing:
  - `screens: list[Screen]` (with `id`, `source_filename`, `inferred_purpose`, `copy`,
    `elements: list[InteractiveElement]`, optional `duplicate_of`)
  - `transitions: list[Transition]` (`from_screen`, `via_element_id`, `to_screen`, `confidence`)
  - `unresolved: list[UnresolvedAction]` (clicks with no destination screenshot)
  - `entry_screen_id`
- **Flag:** Backend produces a fully validated graph; frontend has no view component.
  Decide whether to add (e.g., a node-link diagram in the simulation tab) or defer.

### M5 — Agent paths not rendered (flag)
- **Location:** no UI exists
- **Backend contract:** `SimulationResult.paths: list[AgentPath]` — per-agent walkthroughs
  with `steps: list[AgentStep]`, each step containing `screen_id` plus a full
  `AgentDecision` (action, target, reasoning, confidence, emotional_state, observed_issues,
  alternative_actions). Also `terminal_state`, `screens_visited`, `fork_points`,
  `cumulative_seconds`, `tokens_used`.
- **Flag:** This is rich behavioral data the backend produces per agent. Frontend has no
  agent-trace view. Decide whether to add (e.g., per-persona drill-down with emotional
  state heatmap) or defer.

### M6 — Simulation-level findings not surfaced (flag)
- **Location:** no UI for these specific fields
- **Backend produces but frontend doesn't render:**
  - `SimulationReport.executive_summary`
  - `SimulationReport.cluster_findings` (per-cluster `summary`, `completion_rate`, `key_friction`)
  - `SimulationReport.top_friction_points`
  - `SimulationReport.findings_by_category` (dict keyed by test category)
  - `SimulationReport.recommended_next_tests`
  - `SimulationReport.categorized_issues.issues` (list of `CategorizedIssue`)
  - `GlobalMetrics.completion_rate_overall`, `.completion_rate_by_cluster`,
    `.drop_off_curve`, `.top_friction_screens`, `.per_screen` (with `ScreenMetrics`)
- **Flag:** Note that a *separate* `Report` is produced by `persona_report` for the
  6-section TestTypeReport view; some of this simulation-level data may be redundant
  with `Report` content, but `cluster_findings` and `drop_off_curve` are unique here.
  Decide what to surface.

### M7 — `simPhase` UI state machine has no backend counterpart (informational)
- **Location:** `Ascala Prototype.html:99` (initial `simPhase: 'confirm'`),
  `Panel3.jsx:218-307` (state transitions: `confirm`/`running`/`done`/`cancel`)
- **Backend contract:** N/A — the simulation API will be a single call returning
  `SimulationResult`. Streaming events would need a separate channel (synthesis has
  `StreamEvent`; simulation does not).
- **Proposed change:** None to local state shape. When wiring to the real API,
  `running` phase becomes "awaiting `simulate()` response" and `done` triggers when
  `SimulationResult` arrives. No schema change needed.

---

## Module: `persona_report` → `Report`

### M8 — Test ID mismatch
- **Location:** `Panel3.jsx:4-12` (`UNIVERSAL_TESTS` and `PERSONA_TESTS` arrays),
  `Report.jsx:5-174` (`RESULT_BY_TEST` keys), `Report.jsx:248`
  (`RESULT_BY_TEST[testId]` lookup)
- **Current assumption:** test IDs are `a11y`, `comp`, `onb`, `act`, `eng`, `ret`
- **Backend contract:** `TestType` enum is
  `accessibility | compliance | onboarding | activation | engagement | retention`.
  The 6 `TestTypeReport`s in `Report.test_type_reports` are keyed by `test_type`.
- **Proposed change:** Rename frontend IDs to match backend enum values. Update:
  - `UNIVERSAL_TESTS[0].id`: `'a11y'` → `'accessibility'`
  - `UNIVERSAL_TESTS[1].id`: `'comp'` → `'compliance'`
  - `PERSONA_TESTS[0].id`: `'onb'` → `'onboarding'`
  - `PERSONA_TESTS[1].id`: `'act'` → `'activation'`
  - `PERSONA_TESTS[2].id`: `'eng'` → `'engagement'`
  - `PERSONA_TESTS[3].id`: `'ret'` → `'retention'`
  - `RESULT_BY_TEST` keys renamed to match
- **Note:** This affects CSS classes that use `.fix.urgent`, `.fix.important`,
  `.fix.medium` — those map to `Fix.severity` and don't use the test IDs, so no
  CSS changes needed.

### M9 — `score` field has no backend equivalent (flag)
- **Location:** `Report.jsx:7, 35, 63, 91, 119, 147` (defined per test);
  `Panel3.jsx:316` (color class), `Panel3.jsx:322` (display);
  `Report.jsx:252, 264` (color class + big display)
- **Current assumption:** `result.score` is an integer 0–100 used to:
  - render the big number in the report header
  - render the small score badge in the simulation tab results list
  - drive a tri-state CSS class (`score-high` ≥75, `score-mid` ≥55, `score-low` <55)
- **Backend contract:** `TestTypeReport` has **no `score` field**.
  Closest data: `GlobalMetrics.completion_rate_overall` (float 0–1, simulation-wide,
  not per test type), or one of the three `key_stats` (string values like "42%").
- **Flag — no backend support.** Options:
  - **(A)** Cut the score feature; replace the big number with `data_confidence` badge
    and `short_summary`. Replaces both display sites and removes the CSS-class logic.
  - **(B)** Derive score from `key_stats[0].value` (parse the string), but `key_stats`
    are free-form per test type — there's no guarantee position 0 is a 0–100 number.
  - **(C)** Add a `score: int` (or `health: 0..100`) field to `TestTypeReport`.
    Requires backend change.
  - **Recommendation:** option (A) — the score is a UX invention that summarizes
    information already conveyed by `data_confidence` + `key_stats` + fix severities.

### M10 — `headline` field has no backend equivalent (flag)
- **Location:** `Report.jsx:8, 36, 64, 92, 120, 148` (defined);
  `Panel3.jsx:325`, `Report.jsx:267` (rendered)
- **Current assumption:** `result.headline` is a short tagline (≤6 words, e.g.
  "Contrast & focus gaps in key flows") shown next to the test name.
- **Backend contract:** `TestTypeReport` has no `headline`. The closest is
  `short_summary` (2–4 sentences — too long for a tagline).
- **Flag — no backend support.** Options:
  - **(A)** Cut the headline feature; show just `test.name` in the result row and
    `short_summary` in the report header sub-line.
  - **(B)** Derive headline from the first sentence of `short_summary` (split on `.`).
    Brittle — backend doesn't guarantee sentence-segmentable summaries.
  - **(C)** Add a `headline: str` field to `TestTypeReport` (1-clause tagline).
    Requires backend change.
  - **Recommendation:** option (C) if you want to keep the tagline UI; option (A) otherwise.

### M11 — `summary` → `short_summary` (rename)
- **Location:** `Report.jsx:9, 37, 65, 93, 121, 149` (defined); `Report.jsx:276` (rendered)
- **Current assumption:** `r.summary` (string)
- **Backend contract:** `TestTypeReport.short_summary` (string, 2–4 sentences)
- **Proposed change:** Rename access `r.summary` → `r.short_summary`. (And rename the
  mock keys accordingly.)

### M12 — `stats` shape mismatch
- **Location:** `Report.jsx:10, 38, 66, 94, 122, 150` (defined);
  `Report.jsx:279-285` (rendered)
- **Current assumption:** `stats: [[label, value], ...]` — array of 2-tuples of strings
- **Backend contract:** `TestTypeReport.key_stats: list[Stat]` (exactly 3 items) where
  `Stat = { value: str, label: str, context?: str, sentiment: 'positive'|'negative'|'neutral' }`
- **Proposed change:** Rewrite the render block:
  ```js
  r.key_stats.map((s) =>
    React.createElement('div', { key: s.label, className: 'rpt-stat' },
      React.createElement('div', { className: 'k' }, s.label),
      React.createElement('div', { className: 'v' }, s.value)
    )
  )
  ```
- **Backend fields not yet rendered:** `Stat.context`, `Stat.sentiment`. Sentiment
  could drive a color cue; context could become a tooltip or sub-line. Flag for
  optional follow-up — no current frontend feature breaks if these stay unused.

### M13 — Chart model completely mismatched
- **Location:** `Report.jsx:11-22, 39-50, 67-78, 95-106, 123-134, 151-162` (defined);
  `Report.jsx:178-243` (`FrictionChart` component); `Report.jsx:293` (use site)
- **Current assumption:**
  ```js
  chart: {
    title: str,
    xlabels: str[],   // discrete categories (e.g. screens or steps)
    series: number[], // one number per xlabel — drives line+area chart
    quotes: { i: int, who: str, text: str }[]  // one quote per index, popover on dot click
  }
  ```
  Renders a single line+area chart with hoverable dots → quote popovers.
- **Backend contract:** `TestTypeReport.persona_distributions: list[PersonaDistribution]`
  (1–3 items per test type), where each `PersonaDistribution` is:
  ```
  { id, title, description,
    chart_type: 'scatter' | 'dot_grid' | 'beeswarm' | 'grouped_dot_plot' |
                'funnel_dot_flow' | 'dot_plot' | 'parallel_coordinates' |
                'dot_distribution' | 'grouped_dot_count',
    scope: 'per_cluster' | 'all_clusters',
    axes: { 'x': AxisDef, 'y'?: AxisDef },         // AxisDef has label/unit/min/max/categorical
    dots: [ { agent_id, cluster_id, x, y?, meta } ],   // one dot per agent
    annotations: [ { type, text, position? } ]      // thresholds, group labels, notes
  }
  ```
  Fundamentally a **dot-per-agent** model, not a binned series. Multiple charts per
  test type are possible (1–3).
- **Proposed change:** Replace `FrictionChart` with a new component (call it
  `DotDistribution`) that:
  - Reads `axes.x.label/min/max` (and `axes.y` if present) for axis ranges
  - Renders one dot per `dots[i]` at `(x, y)`, colored by `cluster_id`
  - Renders `annotations` (thresholds as horizontal lines, group labels as text, etc.)
  - Switches layout based on `chart_type`:
    - **MVP:** treat all chart types as scatter/dot_grid (just position dots);
      special-case `funnel_dot_flow` (sequential stages) and `parallel_coordinates`
      (multi-axis) only if needed for the demo
  - Loops over `persona_distributions` to render 1–3 charts in the section
- **Flag — `chart.quotes` has no backend support in `Report`:** Verbatim persona
  text is in `SimulationResult.paths[*].steps[*].decision.reasoning` and
  `.observed_issues`, but the report module **does not** propagate quotes into
  `TestTypeReport`. Options:
  - **(A)** Cut quotes from the report UI.
  - **(B)** When wiring the API, also pass `SimulationResult` to the report view
    and derive a few representative quotes per category from `paths`. Adds frontend
    join logic.
  - **(C)** Add a `representative_quotes: list[Quote]` field to `TestTypeReport`
    (or to `PersonaDistribution`). Requires backend change.
  - **Note:** `Fix.evidence.representative_quotes` (max 3) does exist — but those
    are scoped to a fix, not to a chart point.
  - **Recommendation:** option (C) if quotes are a key UX moment; (A) if not.

### M14 — `findings` field has no backend equivalent (flag)
- **Location:** `Report.jsx:23-27, 51-55, 79-83, 107-111, 135-139, 163-167` (defined);
  `Report.jsx:296-308` (rendered as a numbered list with title + description)
- **Current assumption:** `findings: [{ t: str, d: str }]` per test — title + description
  pairs, rendered as the third report section ("Key findings").
- **Backend contract:** `TestTypeReport` has **no `findings` field**. Related but
  not equivalent data lives in `SimulationResult`:
  - `SimulationReport.categorized_issues.issues: list[CategorizedIssue]` — each has
    `summary`, `category` (one of 5 sim categories — note the simulation enum
    collapses engagement_retention, while the report enum splits them), `severity`,
    `evidence: list[str]`, `affected_screens: list[str]`
  - `SimulationReport.findings_by_category: dict[str, list[str]]`
  - `SimulationReport.top_friction_points: list[str]`
- **Flag — no backend support in `Report` schema.** Options:
  - **(A)** Cut findings; the chart + fixes already convey similar information.
  - **(B)** Derive findings from `SimulationResult.report.categorized_issues.issues`
    filtered by category matching `test_type` (with engagement_retention duplicated
    into both engagement and retention reports). Each `CategorizedIssue.summary`
    becomes the title `t`; `evidence` joined becomes description `d`. Requires
    threading `SimulationResult` into the report view alongside `Report`.
  - **(C)** Add `findings: list[Finding]` to `TestTypeReport`. Requires backend change.
  - **Recommendation:** option (B) — the data exists in `CategorizedIssue` and
    matches the frontend's title+description shape; just unjoined in the report module.

### M15 — `fixes` field shape mismatch
- **Location:** `Report.jsx:28-32, 56-60, 84-88, 112-116, 140-144, 168-172` (defined);
  `Report.jsx:254-258` (copy handler), `Report.jsx:313-336` (render)
- **Current assumption:**
  ```js
  fixes: [{ prio: 'urgent'|'important'|'medium', title: str, desc: str }]
  ```
- **Backend contract:** `TestTypeReport.recommended_fixes: list[Fix]` where:
  ```
  Fix = { severity: 'urgent'|'important'|'medium',
          title: str,
          summary: str,
          evidence: { affected_clusters, affected_screens, agent_count, representative_quotes },
          fix_prompt: str,
          estimated_impact: str,
          related_issue_ids: list[str] }
  ```
- **Proposed change:**
  - `f.prio` → `f.severity` (field rename only; the literal values
    `urgent`/`important`/`medium` already match — no value mapping needed)
  - `f.desc` → `f.summary`
  - CSS classes `.fix.urgent`, `.fix.important`, `.fix.medium` continue to work
    with the renamed field
- **Copy button (`Report.jsx:254-258`):** currently builds the prompt by
  concatenating `[ASCALA FIX · {prio}]\n{title}\n\n{desc}` — should instead copy
  `fix.fix_prompt` directly (the backend produces a paste-ready prompt). Update:
  ```js
  navigator.clipboard?.writeText(fix.fix_prompt);
  ```
- **Backend fields not yet rendered (flag):** `Fix.evidence` (with affected clusters,
  screens, agent count, and up to 3 representative quotes), `Fix.estimated_impact`,
  `Fix.related_issue_ids`. The fix card has room to expand — flag for follow-up.

### M16 — `data_confidence` not rendered (flag)
- **Location:** no UI for this
- **Backend contract:** `TestTypeReport.data_confidence: 'high'|'medium'|'low'`
- **Flag:** Backend produces this; frontend has no view for it. Natural placement is
  a small pill near the report header (e.g. next to test name). If `score` (M9) is
  cut in favor of `data_confidence`, this becomes the primary trust signal.

### M17 — Hardcoded date in report header
- **Location:** `Report.jsx:267` — `new Date().toLocaleDateString()` interpolated
  into the sub-line ("… · 200 synthetic personas · {date}")
- **Current assumption:** date is "now" (re-evaluated on each render)
- **Backend contract:** `Report.meta.generated_at: datetime` is the actual generation time
- **Proposed change:** Replace with `new Date(report.meta.generated_at).toLocaleDateString()`
  (assuming ISO-8601 string from JSON serialization).

### M18 — `Report.executive_summary` not rendered (flag)
- **Location:** no UI for this
- **Backend contract:** `Report.executive_summary: Optional[str]` — a top-level
  cross-section narrative
- **Flag:** Currently each test type has its own summary (`short_summary`), but
  there's no overview pane spanning all 6. Decide whether to add an overview page
  or summary banner that uses this.

### M19 — `Report.meta` largely unused (flag)
- **Location:** only `generated_at` is partially used (M17)
- **Backend produces but frontend doesn't render:**
  - `meta.simulation_run_id` (could appear in URL or footer for traceability)
  - `meta.total_llm_calls`, `meta.tokens_used_total` (admin/cost transparency)
  - `meta.budgets_engaged` (warns if a budget cap was hit — important quality signal)
  - `meta.warnings` (non-fatal issues during generation — should be surfaced if non-empty)
  - `meta.schema_version` (version pin, not user-facing)
- **Flag:** `meta.warnings` is the highest-priority unused field — if the report
  generation hit a problem, the user should see it. The rest is admin-flavored.

---

## Cross-cutting observations

### Test-type enum split between modules
- `persona_simulation/schema.py` uses `TestCategory = accessibility | compliance |
  onboarding | activation | engagement_retention` (**5 categories**, with engagement
  and retention combined).
- `persona_report/schema.py` uses `TestType = accessibility | compliance | onboarding
  | activation | engagement | retention` (**6 types**, split).
- The frontend currently lists 6 tests (matching the report enum). When deriving
  data from simulation-side artifacts (e.g. `CategorizedIssues` for M14b), the
  frontend will need to map `engagement_retention` → both `engagement` and
  `retention` reports.
- **No frontend change required for this directly** — it's an inter-module concern.
  Flagging here so it's not surprising during M14b implementation.

### No live API integration anywhere
- All three backends are absent from the frontend: no `fetch`, no `XMLHttpRequest`,
  no client SDK, no streaming. Hardcoded mock data drives everything.
- This reconciliation only addresses **shapes and field names**. Wiring real API
  calls is a separate task (and would surface additional questions: where does
  state for `SynthesisResult` live? does the sim view stream `StreamEvent`s?
  is `Report` fetched once or polled?).

---

## Decisions (resolved)

The four mismatches with no native backend support have been resolved as follows:

| ID | Feature | Decision |
|----|---------|----------|
| **M9** | `score` (0–100) | **Cut.** Big number and badge removed; `data_confidence` pill replaces them in the report header. |
| **M10** | `headline` tagline | **Cut.** Result row shows `test.name` only; report sub-line uses `short_summary`. |
| **M13b** | `chart.quotes` | **Derive.** Pick representative `AgentDecision.reasoning` / `observed_issues` per cluster from `SimulationResult.paths`; pass `SimulationResult` into the report view alongside `Report`. |
| **M14** | `findings` list | **Derive.** Filter `SimulationResult.report.categorized_issues.issues` by `category` matching `test_type` (with `engagement_retention` duplicated to both `engagement` and `retention`). `issue.summary` → finding title; `issue.evidence` joined → finding description. |

And these are unused-backend-data flags (no current feature breaks; pure scope decisions):

- M2: persona detail (cognitive/economic/testing_postures/share_pct)
- M4: screen graph view
- M5: agent path / trace view
- M6: simulation-level findings (`cluster_findings`, `drop_off_curve`, etc.)
- M16: `data_confidence` badge
- M18: `Report.executive_summary` overview pane
- M19 (partial): `meta.warnings` (recommended to surface), rest admin-flavored
- Within M12: `Stat.context`, `Stat.sentiment` (flair on stats cards)
- Within M15: `Fix.evidence`, `Fix.estimated_impact`, `Fix.related_issue_ids` (richer fix cards)
