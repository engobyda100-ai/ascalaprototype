/* global React */
const { useState: uS4, useMemo: uM4, useRef: uR4 } = React;

// ──────────────────── Website-specific mock data ────────────────────

const SIM_RESULTS_BY_WEBSITE = {
  canva: {
    screen_graph: {
      screens: [
        { id: 's1', source_filename: 'home.png', inferred_purpose: 'Design home', copy: ['What will you design?'], elements: [], duplicate_of: null },
        { id: 's2', source_filename: 'templates.png', inferred_purpose: 'Template browser', copy: ['Templates'], elements: [], duplicate_of: null },
        { id: 's3', source_filename: 'editor.png', inferred_purpose: 'Design editor', copy: ['Edit design'], elements: [], duplicate_of: null },
        { id: 's4', source_filename: 'brand.png', inferred_purpose: 'Brand kit', copy: ['Brand kit'], elements: [], duplicate_of: null }
      ],
      transitions: [],
      unresolved: [],
      entry_screen_id: 's1'
    },
    paths: [
      {
        agent: { agent_id: 'ag_1', parent_agent_id: null, cluster_id: 'c1', cluster_name: 'Solo Entrepreneur',
                 age: 33, tech_savviness: 3, patience_threshold: 'medium', pricing_sensitivity: 4,
                 primary_device: 'desktop', group: null, personalized_backstory: '', rng_seed: 1 },
        steps: [
          { order: 0, screen_id: 's3', was_fork_point: false, elapsed_seconds_total: 300,
            decision: { action: 'complete', target_element_id: null,
                        reasoning: "Made my Instagram post but had to upload my logo again. Third time this week.",
                        confidence: 4, emotional_state: { confusion: 2, frustration: 3, interest: 4, trust: 4 },
                        estimated_seconds_on_screen: 300, observed_issues: ['brand kit not discovered'], alternative_actions: [] } }
        ],
        terminal_state: 'complete', screens_visited: ['s3'], fork_points: [], cumulative_seconds: 300, tokens_used: 880
      },
      {
        agent: { agent_id: 'ag_2', parent_agent_id: null, cluster_id: 'c2', cluster_name: 'Marketing Manager',
                 age: 29, tech_savviness: 4, patience_threshold: 'high', pricing_sensitivity: 3,
                 primary_device: 'desktop', group: null, personalized_backstory: '', rng_seed: 2 },
        steps: [
          { order: 0, screen_id: 's4', was_fork_point: false, elapsed_seconds_total: 120,
            decision: { action: 'complete', target_element_id: null,
                        reasoning: "Finally found brand kit after 20 designs. Would have saved hours if I knew earlier.",
                        confidence: 4, emotional_state: { confusion: 2, frustration: 2, interest: 5, trust: 4 },
                        estimated_seconds_on_screen: 120, observed_issues: ['brand kit discovered too late'], alternative_actions: [] } }
        ],
        terminal_state: 'complete', screens_visited: ['s4'], fork_points: [], cumulative_seconds: 120, tokens_used: 720
      },
      {
        agent: { agent_id: 'ag_3', parent_agent_id: null, cluster_id: 'c3', cluster_name: 'Social Creator',
                 age: 24, tech_savviness: 4, patience_threshold: 'low', pricing_sensitivity: 5,
                 primary_device: 'mobile', group: null, personalized_backstory: '', rng_seed: 3 },
        steps: [
          { order: 0, screen_id: 's3', was_fork_point: false, elapsed_seconds_total: 180,
            decision: { action: 'give_up', target_element_id: null,
                        reasoning: "Mobile app is missing half the features I need. Went back to desktop.",
                        confidence: 3, emotional_state: { confusion: 3, frustration: 5, interest: 3, trust: 2 },
                        estimated_seconds_on_screen: 180, observed_issues: ['mobile feature parity'], alternative_actions: [] } }
        ],
        terminal_state: 'give_up', screens_visited: ['s3'], fork_points: [], cumulative_seconds: 180, tokens_used: 950
      },
      {
        agent: { agent_id: 'ag_4', parent_agent_id: null, cluster_id: 'c1', cluster_name: 'Solo Entrepreneur',
                 age: 36, tech_savviness: 2, patience_threshold: 'low', pricing_sensitivity: 5,
                 primary_device: 'desktop', group: null, personalized_backstory: '', rng_seed: 4 },
        steps: [
          { order: 0, screen_id: 's2', was_fork_point: false, elapsed_seconds_total: 240,
            decision: { action: 'complete', target_element_id: null,
                        reasoning: "Templates are great but I keep uploading my logo from Etsy shop folder.",
                        confidence: 3, emotional_state: { confusion: 3, frustration: 4, interest: 4, trust: 3 },
                        estimated_seconds_on_screen: 240, observed_issues: ['brand kit not discovered'], alternative_actions: [] } }
        ],
        terminal_state: 'complete', screens_visited: ['s2'], fork_points: [], cumulative_seconds: 240, tokens_used: 810
      },
      {
        agent: { agent_id: 'ag_5', parent_agent_id: null, cluster_id: 'c2', cluster_name: 'Marketing Manager',
                 age: 31, tech_savviness: 3, patience_threshold: 'medium', pricing_sensitivity: 3,
                 primary_device: 'desktop', group: null, personalized_backstory: '', rng_seed: 5 },
        steps: [
          { order: 0, screen_id: 's1', was_fork_point: false, elapsed_seconds_total: 90,
            decision: { action: 'complete', target_element_id: null,
                        reasoning: "Set up team brand colors after onboarding — wish I'd done this on day one.",
                        confidence: 4, emotional_state: { confusion: 2, frustration: 2, interest: 4, trust: 4 },
                        estimated_seconds_on_screen: 90, observed_issues: ['brand kit not in onboarding'], alternative_actions: [] } }
        ],
        terminal_state: 'complete', screens_visited: ['s1'], fork_points: [], cumulative_seconds: 90, tokens_used: 680
      },
      {
        agent: { agent_id: 'ag_6', parent_agent_id: null, cluster_id: 'c3', cluster_name: 'Social Creator',
                 age: 22, tech_savviness: 3, patience_threshold: 'medium', pricing_sensitivity: 4,
                 primary_device: 'mobile', group: null, personalized_backstory: '', rng_seed: 6 },
        steps: [
          { order: 0, screen_id: 's3', was_fork_point: false, elapsed_seconds_total: 150,
            decision: { action: 'complete', target_element_id: null,
                        reasoning: "Quick reel template worked on mobile but couldn't add custom fonts.",
                        confidence: 3, emotional_state: { confusion: 2, frustration: 3, interest: 4, trust: 3 },
                        estimated_seconds_on_screen: 150, observed_issues: ['mobile feature parity'], alternative_actions: [] } }
        ],
        terminal_state: 'complete', screens_visited: ['s3'], fork_points: [], cumulative_seconds: 150, tokens_used: 720
      }
    ],
    report: {
      executive_summary: 'Across 6 test categories, 200 synthetic designers revealed high template engagement but late brand kit discovery causing repetitive manual work.',
      cluster_findings: [
        { cluster_id: 'c1', cluster_name: 'Solo Entrepreneur', summary: 'E-commerce owners love templates but repeatedly upload brand assets instead of using brand kit.', completion_rate: 0.68, key_friction: ['brand kit hidden', 're-uploading logos daily'] },
        { cluster_id: 'c2', cluster_name: 'Marketing Manager', summary: 'Marketing managers discover brand kit only after creating 10-20 designs manually.', completion_rate: 0.74, key_friction: ['brand kit not in onboarding', 'team sharing friction'] },
        { cluster_id: 'c3', cluster_name: 'Social Creator', summary: 'Mobile creators frustrated by feature gaps between desktop and mobile apps.', completion_rate: 0.45, key_friction: ['mobile feature parity', 'no offline editing'] }
      ],
      top_friction_points: ['Brand kit discovered too late', 'Mobile app feature gaps', 'No prompt to set up brand assets'],
      findings_by_category: {
        accessibility: ['small text on mobile editor', 'color picker hard for color-blind users'],
        onboarding: ['brand kit not mentioned in onboarding', 'template selection could be personalized']
      },
      recommended_next_tests: ['re-test with brand kit introduction in onboarding'],
      metrics: {
        total_agents: 200,
        completion_rate_overall: 0.62,
        completion_rate_by_cluster: { c1: 0.68, c2: 0.74, c3: 0.45 },
        drop_off_curve: [
          { step_index: 0, remaining_pct: 98.0 },
          { step_index: 1, remaining_pct: 88.0 },
          { step_index: 2, remaining_pct: 74.0 },
          { step_index: 3, remaining_pct: 62.0 }
        ],
        tokens_used_total: 17600,
        top_friction_screens: ['s4', 's3'],
        per_screen: []
      },
      categorized_issues: {
        issues: [
          { summary: 'Brand kit feature discovered after weeks of manual work.', category: 'activation', severity: 'critical',
            evidence: ['Average user creates 15 designs before finding brand kit. Causes hours of wasted re-uploading.'],
            affected_screens: ['s4'] },
          { summary: 'Mobile app missing key desktop features.', category: 'engagement_retention', severity: 'critical',
            evidence: ['43% of mobile-first creators switch to desktop or competitor apps for advanced editing.'],
            affected_screens: ['s3'] },
          { summary: 'No brand setup prompt during onboarding.', category: 'onboarding', severity: 'high',
            evidence: ['Brand kit setup could save users 2+ hours weekly but is never introduced.'],
            affected_screens: ['s1'] }
        ]
      }
    },
    budget_stopped: false,
    budgets_engaged: []
  }
};

// ──────────────────── Mock backend payloads (backend-shaped) ────────────────────
//
// These mocks mirror the Pydantic schemas in backend/persona_simulation/schema.py
// and backend/persona_report/schema.py. When the API is wired up, the same field
// access paths used below will work against the real responses.

const SIM_RESULT = {
  // SimulationResult.screen_graph — minimum valid shape (not visualized yet)
  screen_graph: {
    screens: [
      { id: 's1', source_filename: 'api1.png', inferred_purpose: 'Sign-up landing', copy: ['Get started'], elements: [], duplicate_of: null },
      { id: 's2', source_filename: 'api2.png', inferred_purpose: 'Dashboard', copy: ['Welcome'], elements: [], duplicate_of: null },
      { id: 's3', source_filename: 'api3.png', inferred_purpose: 'Settings', copy: ['Preferences'], elements: [], duplicate_of: null },
      { id: 's4', source_filename: 'api4.png', inferred_purpose: 'Checkout', copy: ['Confirm plan'], elements: [], duplicate_of: null }
    ],
    transitions: [],
    unresolved: [],
    entry_screen_id: 's1'
  },
  // SimulationResult.paths — agent walkthroughs (used to derive per-dot quotes)
  paths: [
    {
      agent: { agent_id: 'ag_1', parent_agent_id: null, cluster_id: 'c1', cluster_name: 'Solo founder',
               age: 29, tech_savviness: 4, patience_threshold: 'medium', pricing_sensitivity: 4,
               primary_device: 'desktop', group: null, personalized_backstory: '', rng_seed: 1 },
      steps: [
        { order: 0, screen_id: 's1', was_fork_point: false, elapsed_seconds_total: 12,
          decision: { action: 'click_element', target_element_id: 's1.btn_signup',
                      reasoning: "Sign-up worked fine — tab order followed what I saw.",
                      confidence: 4, emotional_state: { confusion: 1, frustration: 1, interest: 4, trust: 4 },
                      estimated_seconds_on_screen: 12, observed_issues: [], alternative_actions: [] } },
        { order: 1, screen_id: 's4', was_fork_point: false, elapsed_seconds_total: 240,
          decision: { action: 'give_up', target_element_id: null,
                      reasoning: "You want me to invite my team before I've seen anything? I closed the tab.",
                      confidence: 5, emotional_state: { confusion: 2, frustration: 5, interest: 1, trust: 2 },
                      estimated_seconds_on_screen: 30, observed_issues: ['invite step blocks before value'], alternative_actions: [] } }
      ],
      terminal_state: 'give_up', screens_visited: ['s1', 's4'], fork_points: [], cumulative_seconds: 240, tokens_used: 1200
    },
    {
      agent: { agent_id: 'ag_2', parent_agent_id: null, cluster_id: 'c2', cluster_name: 'Product-lead PM',
               age: 34, tech_savviness: 5, patience_threshold: 'high', pricing_sensitivity: 3,
               primary_device: 'desktop', group: null, personalized_backstory: '', rng_seed: 2 },
      steps: [
        { order: 0, screen_id: 's1', was_fork_point: false, elapsed_seconds_total: 18,
          decision: { action: 'click_element', target_element_id: 's1.btn_signup',
                      reasoning: "Email verification was fine, standard.",
                      confidence: 5, emotional_state: { confusion: 1, frustration: 1, interest: 4, trust: 5 },
                      estimated_seconds_on_screen: 18, observed_issues: [], alternative_actions: [] } },
        { order: 1, screen_id: 's2', was_fork_point: false, elapsed_seconds_total: 95,
          decision: { action: 'complete', target_element_id: null,
                      reasoning: "Once I saw the dashboard populated, I understood what you do.",
                      confidence: 5, emotional_state: { confusion: 1, frustration: 1, interest: 5, trust: 5 },
                      estimated_seconds_on_screen: 77, observed_issues: [], alternative_actions: [] } }
      ],
      terminal_state: 'complete', screens_visited: ['s1', 's2'], fork_points: [], cumulative_seconds: 95, tokens_used: 980
    },
    {
      agent: { agent_id: 'ag_3', parent_agent_id: null, cluster_id: 'c3', cluster_name: 'Solo designer-developer',
               age: 41, tech_savviness: 3, patience_threshold: 'low', pricing_sensitivity: 5,
               primary_device: 'desktop', group: null, personalized_backstory: '', rng_seed: 3 },
      steps: [
        { order: 0, screen_id: 's3', was_fork_point: false, elapsed_seconds_total: 90,
          decision: { action: 'click_element', target_element_id: 's3.modal_open',
                      reasoning: "The settings modal opened but I landed at the bottom. I didn't know there was a title above.",
                      confidence: 2, emotional_state: { confusion: 4, frustration: 3, interest: 2, trust: 2 },
                      estimated_seconds_on_screen: 50, observed_issues: ['modal focus returns to body, not trigger'], alternative_actions: [] } }
      ],
      terminal_state: 'dead_end', screens_visited: ['s3'], fork_points: [], cumulative_seconds: 90, tokens_used: 740
    },
    {
      agent: { agent_id: 'ag_4', parent_agent_id: null, cluster_id: 'c1', cluster_name: 'Solo founder',
               age: 31, tech_savviness: 3, patience_threshold: 'low', pricing_sensitivity: 5,
               primary_device: 'mobile', group: null, personalized_backstory: '', rng_seed: 4 },
      steps: [
        { order: 0, screen_id: 's2', was_fork_point: false, elapsed_seconds_total: 110,
          decision: { action: 'give_up', target_element_id: null,
                      reasoning: "Naming a workspace felt premature — I don't know what this tool does yet.",
                      confidence: 4, emotional_state: { confusion: 4, frustration: 4, interest: 2, trust: 2 },
                      estimated_seconds_on_screen: 40, observed_issues: ['workspace naming feels premature'], alternative_actions: [] } }
      ],
      terminal_state: 'give_up', screens_visited: ['s2'], fork_points: [], cumulative_seconds: 110, tokens_used: 600
    },
    {
      agent: { agent_id: 'ag_5', parent_agent_id: null, cluster_id: 'c2', cluster_name: 'Product-lead PM',
               age: 36, tech_savviness: 5, patience_threshold: 'high', pricing_sensitivity: 2,
               primary_device: 'desktop', group: null, personalized_backstory: '', rng_seed: 5 },
      steps: [
        { order: 0, screen_id: 's2', was_fork_point: false, elapsed_seconds_total: 60,
          decision: { action: 'click_element', target_element_id: 's2.tile_1',
                      reasoning: "Search returned nothing for queries that should clearly match. I gave up.",
                      confidence: 3, emotional_state: { confusion: 3, frustration: 4, interest: 2, trust: 3 },
                      estimated_seconds_on_screen: 60, observed_issues: ['strict prefix matching'], alternative_actions: [] } }
      ],
      terminal_state: 'dead_end', screens_visited: ['s2'], fork_points: [], cumulative_seconds: 60, tokens_used: 540
    },
    {
      agent: { agent_id: 'ag_6', parent_agent_id: null, cluster_id: 'c3', cluster_name: 'Solo designer-developer',
               age: 38, tech_savviness: 4, patience_threshold: 'medium', pricing_sensitivity: 5,
               primary_device: 'desktop', group: null, personalized_backstory: '', rng_seed: 6 },
      steps: [
        { order: 0, screen_id: 's4', was_fork_point: false, elapsed_seconds_total: 40,
          decision: { action: 'click_element', target_element_id: 's4.btn_continue',
                      reasoning: "Day 1 I was excited, but I forgot to come back.",
                      confidence: 3, emotional_state: { confusion: 2, frustration: 2, interest: 3, trust: 3 },
                      estimated_seconds_on_screen: 40, observed_issues: ['no re-engagement nudge'], alternative_actions: [] } }
      ],
      terminal_state: 'max_steps_reached', screens_visited: ['s4'], fork_points: [], cumulative_seconds: 40, tokens_used: 480
    }
  ],
  // SimulationResult.report — narrative + categorized findings + metrics
  report: {
    executive_summary: 'Across 6 test categories, 200 synthetic agents revealed strong baseline compliance and engagement, with onboarding and retention as the primary risk areas.',
    cluster_findings: [
      { cluster_id: 'c1', cluster_name: 'Solo founder', summary: 'Solo founders churn early when the product asks for team setup before showing value.', completion_rate: 0.38, key_friction: ['team-invite blocker', 'workspace naming premature'] },
      { cluster_id: 'c2', cluster_name: 'Product-lead PM', summary: 'PMs complete onboarding reliably and engage deeply once activated.', completion_rate: 0.71, key_friction: ['search returns false negatives'] },
      { cluster_id: 'c3', cluster_name: 'Solo designer-developer', summary: 'Designers find templates only when surfaced; settings modal traps screen-readers.', completion_rate: 0.42, key_friction: ['template gallery hidden', 'modal focus loss'] }
    ],
    top_friction_points: ['Step 3 invite blocker', 'Settings modal focus loss', 'Search prefix matching'],
    findings_by_category: {
      accessibility: ['focus rings invisible on cream', 'modal focus returns to body', 'unlabeled radio group'],
      onboarding: ['invite blocks solo users', 'workspace naming premature']
    },
    recommended_next_tests: ['re-test onboarding after invite-step deferral'],
    metrics: {
      total_agents: 200,
      completion_rate_overall: 0.46,
      completion_rate_by_cluster: { c1: 0.38, c2: 0.71, c3: 0.42 },
      drop_off_curve: [
        { step_index: 0, remaining_pct: 92.0 },
        { step_index: 1, remaining_pct: 86.0 },
        { step_index: 2, remaining_pct: 78.0 },
        { step_index: 3, remaining_pct: 46.0 },
        { step_index: 4, remaining_pct: 46.0 }
      ],
      tokens_used_total: 18432,
      top_friction_screens: ['s2', 's3'],
      per_screen: []
    },
    // CategorizedIssue.category uses the simulation enum (5 values: engagement_retention is combined)
    categorized_issues: {
      issues: [
        { summary: 'Focus rings are invisible on cream cards.', category: 'accessibility', severity: 'critical',
          evidence: ['3 CTAs in the dashboard use a 1px terracotta ring at 30% opacity — below the 3:1 threshold.'],
          affected_screens: ['s2'] },
        { summary: 'Modal focus returns to <body>, not the trigger.', category: 'accessibility', severity: 'high',
          evidence: ['After closing Settings, tab order resets. 11 screen-reader personas got lost here.'],
          affected_screens: ['s3'] },
        { summary: 'One radio group is unlabeled.', category: 'accessibility', severity: 'medium',
          evidence: ['Plan picker in checkout has <input type="radio"> without fieldset/legend. SR reads each option out of context.'],
          affected_screens: ['s4'] },
        { summary: 'Analytics fires before consent.', category: 'compliance', severity: 'critical',
          evidence: ['GA4 and Segment initialize in app shell, not after banner. Violation in EU and for new CCPA rules.'],
          affected_screens: ['s1'] },
        { summary: 'Data export path is missing.', category: 'compliance', severity: 'high',
          evidence: ['GDPR Art. 20 requires user-initiated export. No entry point exists in settings.'],
          affected_screens: ['s3'] },
        { summary: 'Cookie prefs state is stale after change.', category: 'compliance', severity: 'medium',
          evidence: ['Toggles update local state but don\'t re-evaluate loaded scripts until refresh.'],
          affected_screens: ['s3'] },
        { summary: 'Invite step blocks solo users before they see value.', category: 'onboarding', severity: 'critical',
          evidence: ['38% drop at step 3 is almost entirely solo-founder and designer personas. They are not ready to commit a team.'],
          affected_screens: ['s4'] },
        { summary: 'Workspace naming feels premature.', category: 'onboarding', severity: 'high',
          evidence: ['22% friction on step 2. Users do not know enough about the product yet to name their workspace well.'],
          affected_screens: ['s2'] },
        { summary: 'First meaningful action lands fast once reached.', category: 'onboarding', severity: 'low',
          evidence: ['Personas who clear step 4 complete step 5 at 91%. The funnel problem is up-front, not at value delivery.'],
          affected_screens: ['s4'] },
        { summary: 'Aha moment is 3 clicks behind an empty state.', category: 'activation', severity: 'critical',
          evidence: ['Users need to create → populate → view before the value becomes obvious.'],
          affected_screens: ['s2'] },
        { summary: 'Template gallery solves the empty state but is hidden.', category: 'activation', severity: 'high',
          evidence: ['Only 31% of personas found it within 2 minutes.'],
          affected_screens: ['s2'] },
        { summary: 'Post-aha conversion is strong.', category: 'activation', severity: 'low',
          evidence: ['84% of personas who reach the aha engage with the core loop within 24h.'],
          affected_screens: ['s2'] },
        { summary: 'Search uses strict prefix matching.', category: 'engagement_retention', severity: 'high',
          evidence: ['Personas expect fuzzy/typo-tolerant search. 47% of failed queries had a typo or synonym.'],
          affected_screens: ['s2'] },
        { summary: 'Feed drives repeat visits.', category: 'engagement_retention', severity: 'low',
          evidence: ['62% of personas returned within 7 days; 78% of returns landed on the feed first.'],
          affected_screens: ['s1'] },
        { summary: 'Compose is slow on long content.', category: 'engagement_retention', severity: 'medium',
          evidence: ['Editor drops frames above ~800 chars. 18% of personas mentioned lag.'],
          affected_screens: ['s2'] },
        { summary: 'No re-engagement system exists.', category: 'engagement_retention', severity: 'critical',
          evidence: ['0 personas received any nudge. Cohort-based retention dies on the vine.'],
          affected_screens: ['s1'] },
        { summary: 'One well-timed nudge is worth a lot.', category: 'engagement_retention', severity: 'low',
          evidence: ['Personas who got a simulated day-10 email retained at 2.4× the baseline.'],
          affected_screens: ['s1'] },
        { summary: 'Password reset flow adds churn.', category: 'engagement_retention', severity: 'medium',
          evidence: ['7 personas tried to return but bounced off the reset flow.'],
          affected_screens: ['s1'] }
      ]
    }
  },
  budget_stopped: false,
  budgets_engaged: []
};

window.SIM_RESULT = SIM_RESULT;
window.SIM_RESULTS_BY_WEBSITE = SIM_RESULTS_BY_WEBSITE;

// Helper to get the appropriate data for the selected website. The prototype
// ships with a single Canva example, so we fall back to it whenever no key
// (or an unknown key) is passed.
const getSimResult = (selectedWebsite) => SIM_RESULTS_BY_WEBSITE[selectedWebsite] || SIM_RESULTS_BY_WEBSITE.canva;

const CANVA_SIM = SIM_RESULTS_BY_WEBSITE.canva;

// Build a cluster_id → display name map from simulation findings.
const clusterNamesFromSim = (simResult) =>
  Object.fromEntries((simResult?.report?.cluster_findings || []).map(cf => [cf.cluster_id, cf.cluster_name]));

// Helper: build a per-agent dot list with x = friction score (0-100), colored later by cluster
const dotsForAgents = (xByAgent, simResult) => {
  const result = simResult || CANVA_SIM;
  return result.paths.map(p => ({
    agent_id: p.agent.agent_id,
    cluster_id: p.agent.cluster_id,
    cluster_name: p.agent.cluster_name,
    x: xByAgent[p.agent.agent_id],
    y: p.agent.tech_savviness * 20,
    meta: {}
  }));
};

// Report — final output of persona_report module
const REPORT = {
  test_type_reports: [
    {
      test_type: 'accessibility',
      short_summary: 'Accessibility audit found moderate friction for low-vision and keyboard-only users. The onboarding flow passes WCAG 2.2 AA for 72% of paths; dashboard fails on focus order and color contrast in 3 interactive surfaces.',
      key_stats: [
        { value: '41', label: 'Paths audited', sentiment: 'neutral' },
        { value: '28', label: 'AA passes', sentiment: 'positive' },
        { value: '3', label: 'Critical issues', sentiment: 'negative' }
      ],
      persona_distributions: [{
        id: 'a11y_friction',
        title: 'Friction × tech-savviness per agent',
        description: 'Each dot is one agent; horizontal axis is friction score (0-100), vertical is tech-savviness.',
        chart_type: 'scatter',
        scope: 'all_clusters',
        axes: {
          x: { label: 'Friction score', unit: '%', min: 0, max: 100 },
          y: { label: 'Tech savviness', min: 0, max: 100 }
        },
        dots: dotsForAgents({ ag_1: 12, ag_2: 8, ag_3: 78, ag_4: 32, ag_5: 22, ag_6: 18 }, CANVA_SIM),
        annotations: [{ type: 'threshold', text: 'WCAG AA threshold', position: { x: 30 } }]
      }],
      recommended_fixes: [
        { severity: 'urgent', title: 'Boost focus ring to 2px, full-opacity terracotta.',
          summary: 'Raises contrast to 4.7:1 on cream and 5.2:1 on dark. Two-line CSS change on all .btn and .link.',
          evidence: { affected_clusters: ['c1','c3'], affected_screens: ['s2'], agent_count: 14, representative_quotes: ["I couldn't tell which button was focused."] },
          fix_prompt: 'Update the global focus-ring style: 2px solid var(--terra) with no opacity reduction. Apply to all .btn and .link selectors. Verify contrast ≥ 3:1 against both cream (#f4ead6) and dark (#1a1a1a) backgrounds.',
          estimated_impact: '+18% AA pass rate', related_issue_ids: [] },
        { severity: 'important', title: 'Return focus to trigger on modal close.',
          summary: 'Set tabindex={-1} on modal root; on unmount, triggerRef.current.focus(). Covers 11 SR reports.',
          evidence: { affected_clusters: ['c3'], affected_screens: ['s3'], agent_count: 11, representative_quotes: [] },
          fix_prompt: 'In the Modal component, capture the previously-focused element on open and call .focus() on it during the unmount cleanup. Add tabindex={-1} to the modal root for safe initial focus.',
          estimated_impact: 'Removes screen-reader dead-end', related_issue_ids: [] },
        { severity: 'medium', title: 'Wrap plan picker in <fieldset><legend>.',
          summary: 'Adds group context for screen readers; no visual change required.',
          evidence: { affected_clusters: [], affected_screens: ['s4'], agent_count: 4, representative_quotes: [] },
          fix_prompt: 'Wrap the plan-picker radio inputs in a <fieldset> with a visually-hidden <legend> describing the group. No CSS changes required.',
          estimated_impact: 'Improves SR comprehension', related_issue_ids: [] }
      ],
      data_confidence: 'high',
      scenarios: [
        { name: 'status_quo', label: 'Status quo', description: 'No fixes applied — current issue baseline.', fixes_applied: [], residual_issue_counts: { urgent: 1, important: 1, medium: 1 }, effort_estimate: 'none' },
        { name: 'quick_win', label: 'Fix critical', description: 'Resolve all urgent issues.', fixes_applied: ['Boost focus ring to 2px, full-opacity terracotta.'], residual_issue_counts: { urgent: 0, important: 1, medium: 1 }, effort_estimate: 'small' },
        { name: 'redesign', label: 'Fix critical + important', description: 'Resolve all urgent and important issues.', fixes_applied: ['Boost focus ring to 2px, full-opacity terracotta.', 'Return focus to trigger on modal close.'], residual_issue_counts: { urgent: 0, important: 0, medium: 1 }, effort_estimate: 'medium-to-large' }
      ]
    },
    {
      test_type: 'compliance',
      short_summary: 'Compliance review identified generally strong GDPR/CCPA posture. Core data flows have clear consent. Two gaps: third-party analytics fires before consent banner, and data-export path missing for EU users. No SOC-2 blockers.',
      key_stats: [
        { value: '14', label: 'Flows audited', sentiment: 'neutral' },
        { value: '2', label: 'Consent gaps', sentiment: 'negative' },
        { value: '0', label: 'Blockers', sentiment: 'positive' }
      ],
      persona_distributions: [{
        id: 'comp_consent_friction',
        title: 'Consent friction by agent',
        description: 'Each dot is one agent; x = consent-flow friction (0-100).',
        chart_type: 'scatter',
        scope: 'all_clusters',
        axes: {
          x: { label: 'Consent friction', unit: '%', min: 0, max: 100 },
          y: { label: 'Trust score', min: 0, max: 100 }
        },
        dots: dotsForAgents({ ag_1: 18, ag_2: 12, ag_3: 44, ag_4: 52, ag_5: 29, ag_6: 22 }, CANVA_SIM),
        annotations: []
      }],
      recommended_fixes: [
        { severity: 'urgent', title: 'Gate analytics behind consent state.',
          summary: 'Wrap GA4/Segment init in a consentGranted() check. Lazy-load scripts after banner response.',
          evidence: { affected_clusters: ['c1','c2','c3'], affected_screens: ['s1'], agent_count: 22, representative_quotes: [] },
          fix_prompt: 'Wrap GA4 and Segment SDK initialization in a consentGranted() gate. Move script loading to fire only after the consent banner returns "accept all" or category-specific consent.',
          estimated_impact: 'Resolves EU/CCPA violation', related_issue_ids: [] },
        { severity: 'important', title: 'Add "Export my data" in settings.',
          summary: 'Ship a 30-day-window async export button; email link when ready. Satisfies GDPR Art. 20.',
          evidence: { affected_clusters: ['c1','c2'], affected_screens: ['s3'], agent_count: 9, representative_quotes: ["I couldn't find 'export my data' anywhere."] },
          fix_prompt: 'Add an "Export my data" entry in account settings. On click, queue an async job that produces a JSON+CSV bundle of the user\'s data; email a signed download link when ready (30-day expiry).',
          estimated_impact: 'Satisfies GDPR Art. 20', related_issue_ids: [] },
        { severity: 'medium', title: 'Re-evaluate loaded scripts on pref change.',
          summary: 'Subscribe to the consent store; unload/reload analytics when a user flips a toggle.',
          evidence: { affected_clusters: ['c2'], affected_screens: ['s3'], agent_count: 5, representative_quotes: [] },
          fix_prompt: 'Subscribe analytics initialization to the consent-preference store. When a category is disabled, unload the corresponding script tag and zero out its global. When re-enabled, load fresh.',
          estimated_impact: 'Keeps prefs honest', related_issue_ids: [] }
      ],
      data_confidence: 'high',
      scenarios: [
        { name: 'status_quo', label: 'Status quo', description: 'No fixes applied — current issue baseline.', fixes_applied: [], residual_issue_counts: { urgent: 1, important: 1, medium: 1 }, effort_estimate: 'none' },
        { name: 'quick_win', label: 'Fix critical', description: 'Resolve all urgent issues.', fixes_applied: ['Gate analytics behind consent state.'], residual_issue_counts: { urgent: 0, important: 1, medium: 1 }, effort_estimate: 'small' },
        { name: 'redesign', label: 'Fix critical + important', description: 'Resolve all urgent and important issues.', fixes_applied: ['Gate analytics behind consent state.', "Add 'Export my data' in settings."], residual_issue_counts: { urgent: 0, important: 0, medium: 1 }, effort_estimate: 'medium-to-large' }
      ]
    },
    {
      test_type: 'onboarding',
      short_summary: 'Onboarding simulation found a major drop-off at the workspace-setup step. Of 200 personas, 38% abandoned after being asked to invite teammates before seeing any value. Solo-founder personas were most affected; PM personas completed at 71%.',
      key_stats: [
        { value: '46%', label: 'Completion rate', sentiment: 'negative' },
        { value: '6m 20s', label: 'Median time', sentiment: 'neutral' },
        { value: 'Step 3', label: 'Biggest drop', sentiment: 'negative' }
      ],
      persona_distributions: [{
        id: 'onb_dropoff',
        title: 'Drop-off step per agent',
        description: 'Each dot is one agent; x = step at which they dropped (0=sign-up, 4=first action).',
        chart_type: 'dot_plot',
        scope: 'all_clusters',
        axes: {
          x: { label: 'Onboarding step', categorical: ['Sign up', 'Verify', 'Workspace', 'Invite', 'First action'] },
          y: { label: 'Engagement', min: 0, max: 100 }
        },
        dots: dotsForAgents({ ag_1: 'Invite', ag_2: 'First action', ag_3: 'Workspace', ag_4: 'Workspace', ag_5: 'First action', ag_6: 'Verify' }, CANVA_SIM),
        annotations: [{ type: 'note', text: '38% drop at step 3' }]
      }],
      recommended_fixes: [
        { severity: 'urgent', title: 'Make "invite team" skippable or defer it.',
          summary: 'Move to post-activation. Replace with "Try it solo for now" CTA. Projected lift: +28% completion for solo personas.',
          evidence: { affected_clusters: ['c1','c3'], affected_screens: ['s4'], agent_count: 76, representative_quotes: ["You want me to invite my team before I've seen anything?"] },
          fix_prompt: 'Defer the team-invite step until after the user reaches their first activation moment. Replace the current invite gate with a dismissible "Try it solo for now" CTA that routes to the first-action screen.',
          estimated_impact: '+28% completion (solo)', related_issue_ids: [],
          counterfactual_impact: { predicted_lift_pct: 0.18, predicted_lift_range: [0.13, 0.23], sample_size: 7, confidence: 'high', affected_personas: ['c1','c3'], method: 'sibling-path', sibling_completion_rate: 0.71, baseline_completion_rate: 0.53 } },
        { severity: 'important', title: 'Auto-name workspace · let users rename later.',
          summary: 'Default to "{Name}\'s workspace". Surface rename in settings. Removes 22% friction at step 2.',
          evidence: { affected_clusters: ['c1','c3'], affected_screens: ['s2'], agent_count: 44, representative_quotes: ["Naming a workspace felt premature."] },
          fix_prompt: 'On account creation, auto-name the workspace "{FirstName}\'s workspace" and skip the naming prompt. Add a rename action in workspace settings for later.',
          estimated_impact: '-22% step-2 friction', related_issue_ids: [],
          counterfactual_impact: { predicted_lift_pct: 0.09, predicted_lift_range: [0.04, 0.14], sample_size: 4, confidence: 'medium', affected_personas: ['c1','c3'], method: 'sibling-path', sibling_completion_rate: 0.62, baseline_completion_rate: 0.53 } },
        { severity: 'medium', title: 'Surface "first action" preview earlier.',
          summary: 'Show a 10-second animated preview of the core value before asking for any setup details.',
          evidence: { affected_clusters: ['c1'], affected_screens: ['s1'], agent_count: 18, representative_quotes: [] },
          fix_prompt: 'Add a 10-second autoplaying preview of the core product loop on the sign-up landing screen. Skippable. Designed to show value before any setup commitment.',
          estimated_impact: 'Sets expectation early', related_issue_ids: [],
          counterfactual_impact: { predicted_lift_pct: null, predicted_lift_range: null, sample_size: 1, confidence: 'low', affected_personas: ['c1'], method: 'insufficient-data', sibling_completion_rate: null, baseline_completion_rate: 0.50 } }
      ],
      data_confidence: 'high',
      outcome_context: {
        test_type_metric: 'onboarding completion rate',
        baseline_outcome: '46% complete onboarding',
        overall_completion_rate: 0.46,
        completion_rate_by_cluster: { c1: 0.38, c2: 0.71, c3: 0.42 },
        worst_affected_cluster: 'Solo Entrepreneur',
        worst_affected_cluster_rate: 0.38,
        best_performing_cluster: 'Marketing Manager',
        best_performing_cluster_rate: 0.71,
        gap_pct: 0.33,
        business_implication: 'Solo Entrepreneur (38%) trails Marketing Manager (71%) by 33 points on onboarding completion rate. Closing this gap is the highest-impact lever for onboarding.'
      },
      trajectory: {
        screens: ['s1', 's2', 's3', 's4'],
        clusters: ['c1', 'c2', 'c3'],
        cells: [
          { cluster_id: 'c1', screen_id: 's1', screen_index: 0, emotions: { confusion: 1.4, frustration: 1.2, interest: 4.2, trust: 4.0 }, sample_size: 14 },
          { cluster_id: 'c1', screen_id: 's2', screen_index: 1, emotions: { confusion: 2.1, frustration: 2.6, interest: 3.4, trust: 3.2 }, sample_size: 13 },
          { cluster_id: 'c1', screen_id: 's3', screen_index: 2, emotions: { confusion: 2.5, frustration: 3.4, interest: 2.8, trust: 2.9 }, sample_size: 12 },
          { cluster_id: 'c1', screen_id: 's4', screen_index: 3, emotions: { confusion: 2.3, frustration: 4.6, interest: 1.6, trust: 2.2 }, sample_size: 9 },
          { cluster_id: 'c2', screen_id: 's1', screen_index: 0, emotions: { confusion: 1.2, frustration: 1.0, interest: 4.4, trust: 4.3 }, sample_size: 12 },
          { cluster_id: 'c2', screen_id: 's2', screen_index: 1, emotions: { confusion: 1.6, frustration: 1.4, interest: 4.1, trust: 4.0 }, sample_size: 12 },
          { cluster_id: 'c2', screen_id: 's3', screen_index: 2, emotions: { confusion: 1.8, frustration: 1.7, interest: 3.9, trust: 3.8 }, sample_size: 11 },
          { cluster_id: 'c2', screen_id: 's4', screen_index: 3, emotions: { confusion: 1.9, frustration: 2.0, interest: 3.7, trust: 3.6 }, sample_size: 11 },
          { cluster_id: 'c3', screen_id: 's1', screen_index: 0, emotions: { confusion: 1.5, frustration: 1.3, interest: 4.0, trust: 3.9 }, sample_size: 13 },
          { cluster_id: 'c3', screen_id: 's2', screen_index: 1, emotions: { confusion: 2.0, frustration: 2.2, interest: 3.5, trust: 3.4 }, sample_size: 12 },
          { cluster_id: 'c3', screen_id: 's3', screen_index: 2, emotions: { confusion: 2.4, frustration: 3.0, interest: 3.0, trust: 3.0 }, sample_size: 11 },
          { cluster_id: 'c3', screen_id: 's4', screen_index: 3, emotions: { confusion: 2.6, frustration: 4.1, interest: 2.0, trust: 2.5 }, sample_size: 8 }
        ]
      },
      scenarios: [
        { name: 'status_quo', label: 'Status quo', description: 'No fixes applied — current observed completion rate.', fixes_applied: [], baseline_completion_rate: 0.46, predicted_completion_rate_low: 0.46, predicted_completion_rate_high: 0.46, predicted_lift_low: 0, predicted_lift_high: 0, primary_benefit_cluster: null, effort_estimate: 'none' },
        { name: 'quick_win', label: 'Quick win', description: 'Apply the top 2 highest-confidence fixes.', fixes_applied: ['Make "invite team" skippable or defer it.', 'Auto-name workspace · let users rename later.'], baseline_completion_rate: 0.46, predicted_completion_rate_low: 0.64, predicted_completion_rate_high: 0.73, predicted_lift_low: 0.18, predicted_lift_high: 0.27, primary_benefit_cluster: 'c1', effort_estimate: 'small' },
        { name: 'redesign', label: 'Redesign', description: 'Apply the top 3 fixes — implies a deeper redesign.', fixes_applied: ['Make "invite team" skippable or defer it.', 'Auto-name workspace · let users rename later.', 'Surface "first action" preview earlier.'], baseline_completion_rate: 0.46, predicted_completion_rate_low: 0.64, predicted_completion_rate_high: 0.78, predicted_lift_low: 0.18, predicted_lift_high: 0.32, primary_benefit_cluster: 'c1', effort_estimate: 'medium-to-large' }
      ]
    },
    {
      test_type: 'activation',
      short_summary: "Activation testing shows the 'aha' happens, but only for 54% of personas. The moment lives 3 clicks deep behind an empty state. Personas who reach it convert to engaged users at 84%.",
      key_stats: [
        { value: '54%', label: 'Activation rate', sentiment: 'negative' },
        { value: '4m 12s', label: 'Time-to-aha', sentiment: 'neutral' },
        { value: '84%', label: 'Post-aha engagement', sentiment: 'positive' }
      ],
      persona_distributions: [{
        id: 'act_aha_reach',
        title: 'Aha reach by agent',
        description: 'Each dot is one agent; x = clicks to aha, y = post-aha engagement score.',
        chart_type: 'scatter',
        scope: 'per_cluster',
        axes: {
          x: { label: 'Clicks to aha', min: 0, max: 10 },
          y: { label: 'Engagement', min: 0, max: 100 }
        },
        dots: dotsForAgents({ ag_1: 7, ag_2: 2, ag_3: 5, ag_4: 9, ag_5: 3, ag_6: 4 }, CANVA_SIM),
        annotations: [{ type: 'threshold', text: 'Aha threshold', position: { x: 4 } }]
      }],
      recommended_fixes: [
        { severity: 'urgent', title: 'Replace empty state with a live demo workspace.',
          summary: 'Preload a "Sample project" that showcases the aha immediately. Projected activation: 54% → 78%.',
          evidence: { affected_clusters: ['c1','c2','c3'], affected_screens: ['s2'], agent_count: 92, representative_quotes: ["I didn't realize I had to click through empty states."] },
          fix_prompt: 'On first dashboard load, preload a "Sample project" that demonstrates the core value. Mark it visually as a sample. Provide a single-click "Clear sample and start fresh" action.',
          estimated_impact: 'Activation 54% → 78%', related_issue_ids: [],
          counterfactual_impact: { predicted_lift_pct: 0.18, predicted_lift_range: [0.13, 0.23], sample_size: 7, confidence: 'high', affected_personas: ['c1','c2','c3'], method: 'sibling-path', sibling_completion_rate: 0.72, baseline_completion_rate: 0.54 } },
        { severity: 'important', title: 'Surface template gallery on first load.',
          summary: 'Promote gallery to primary CTA instead of "Create blank". Cuts time-to-aha by ~90 seconds.',
          evidence: { affected_clusters: ['c3'], affected_screens: ['s2'], agent_count: 31, representative_quotes: ["The template gallery is buried."] },
          fix_prompt: 'On first load of the home screen, replace the "Create blank" primary CTA with a "Browse templates" CTA that opens the gallery. Move "Create blank" to a secondary text link.',
          estimated_impact: '-90s time-to-aha', related_issue_ids: [],
          counterfactual_impact: { predicted_lift_pct: 0.09, predicted_lift_range: [0.04, 0.14], sample_size: 4, confidence: 'medium', affected_personas: ['c3'], method: 'sibling-path', sibling_completion_rate: 0.63, baseline_completion_rate: 0.54 } },
        { severity: 'medium', title: 'Add a 20-second video tour to the home screen.',
          summary: 'Auto-play muted. Skippable. Designed for personas who bounce before any click.',
          evidence: { affected_clusters: ['c1'], affected_screens: ['s2'], agent_count: 22, representative_quotes: [] },
          fix_prompt: 'Add a 20-second muted autoplaying tour video to the home screen, with a clear skip button. Pause on click and resume on dismissal.',
          estimated_impact: 'Reduces zero-click bounce', related_issue_ids: [],
          counterfactual_impact: { predicted_lift_pct: 0.06, predicted_lift_range: [null, null], sample_size: 2, confidence: 'low', affected_personas: ['c1'], method: 'sibling-path', sibling_completion_rate: 0.60, baseline_completion_rate: 0.54 } }
      ],
      data_confidence: 'medium',
      scenarios: [
        { name: 'status_quo', label: 'Status quo', description: 'No fixes applied — current observed activation rate.', fixes_applied: [], baseline_completion_rate: 0.54, predicted_completion_rate_low: 0.54, predicted_completion_rate_high: 0.54, predicted_lift_low: 0, predicted_lift_high: 0, primary_benefit_cluster: null, effort_estimate: 'none' },
        { name: 'quick_win', label: 'Quick win', description: 'Apply the top 2 highest-confidence fixes.', fixes_applied: ['Replace empty state with a live demo workspace.', 'Surface template gallery on first load.'], baseline_completion_rate: 0.54, predicted_completion_rate_low: 0.72, predicted_completion_rate_high: 0.81, predicted_lift_low: 0.18, predicted_lift_high: 0.27, primary_benefit_cluster: 'c1', effort_estimate: 'small' },
        { name: 'redesign', label: 'Redesign', description: 'Apply all 3 fixes — implies a deeper redesign.', fixes_applied: ['Replace empty state with a live demo workspace.', 'Surface template gallery on first load.', 'Add a 20-second video tour to the home screen.'], baseline_completion_rate: 0.54, predicted_completion_rate_low: 0.72, predicted_completion_rate_high: 0.87, predicted_lift_low: 0.18, predicted_lift_high: 0.33, primary_benefit_cluster: 'c1', effort_estimate: 'medium-to-large' }
      ]
    },
    {
      test_type: 'engagement',
      short_summary: 'Engagement simulation indicates strong core-loop retention week 1. Search and filter surface is the primary friction — 47% of personas abandoned a task when results didn\'t match their mental model.',
      key_stats: [
        { value: '62%', label: 'Week-1 return', sentiment: 'positive' },
        { value: '3.4', label: 'Core-loop completions/user', sentiment: 'positive' },
        { value: '47%', label: 'Search abandonment', sentiment: 'negative' }
      ],
      persona_distributions: [{
        id: 'eng_search_friction',
        title: 'Search friction per agent',
        description: 'Each dot is one agent; x = search-friction score, y = trust.',
        chart_type: 'scatter',
        scope: 'all_clusters',
        axes: {
          x: { label: 'Search friction', unit: '%', min: 0, max: 100 },
          y: { label: 'Trust', min: 0, max: 100 }
        },
        dots: dotsForAgents({ ag_1: 14, ag_2: 22, ag_3: 38, ag_4: 30, ag_5: 68, ag_6: 18 }, CANVA_SIM),
        annotations: []
      }],
      recommended_fixes: [
        { severity: 'urgent', title: 'Ship typo-tolerant search with synonyms.',
          summary: 'Swap exact-match index for trigram/BM25 with a synonym table. Estimated recovery: +30% of abandoned queries.',
          evidence: { affected_clusters: ['c2'], affected_screens: ['s2'], agent_count: 47, representative_quotes: ["Search returned nothing for queries that should clearly match."] },
          fix_prompt: 'Replace the exact-match search index with a BM25 + trigram fuzzy index. Add a synonym table for common product-domain terms. Maintain a relevance threshold tuned via A/B test.',
          estimated_impact: '+30% recovered queries', related_issue_ids: [],
          counterfactual_impact: { predicted_lift_pct: 0.14, predicted_lift_range: [0.09, 0.19], sample_size: 6, confidence: 'high', affected_personas: ['c2'], method: 'sibling-path', sibling_completion_rate: 0.67, baseline_completion_rate: 0.53 } },
        { severity: 'important', title: 'Add "did you mean…" suggestions on empty results.',
          summary: 'Surface top-3 near-matches when a query returns 0 results. Simple but high-impact.',
          evidence: { affected_clusters: ['c2','c3'], affected_screens: ['s2'], agent_count: 31, representative_quotes: [] },
          fix_prompt: 'When a search query returns zero results, render a "Did you mean…" section showing the top 3 fuzzy-matched alternatives, each clickable to re-run the search.',
          estimated_impact: 'Recovers near-misses', related_issue_ids: [],
          counterfactual_impact: { predicted_lift_pct: 0.08, predicted_lift_range: [0.03, 0.13], sample_size: 4, confidence: 'medium', affected_personas: ['c2','c3'], method: 'sibling-path', sibling_completion_rate: 0.61, baseline_completion_rate: 0.53 } },
        { severity: 'medium', title: 'Virtualize the compose editor above 500 chars.',
          summary: 'Eliminates lag; keeps compose feel snappy for power users.',
          evidence: { affected_clusters: ['c2'], affected_screens: ['s2'], agent_count: 12, representative_quotes: [] },
          fix_prompt: 'In the compose editor, switch to a virtualized renderer (e.g., react-window) once the document exceeds 500 characters. Keep keyboard handling identical.',
          estimated_impact: 'Eliminates editor lag', related_issue_ids: [],
          counterfactual_impact: { predicted_lift_pct: 0.04, predicted_lift_range: [null, null], sample_size: 2, confidence: 'low', affected_personas: ['c2'], method: 'sibling-path', sibling_completion_rate: 0.57, baseline_completion_rate: 0.53 } }
      ],
      data_confidence: 'high',
      scenarios: [
        { name: 'status_quo', label: 'Status quo', description: 'No fixes applied — current observed task-completion rate.', fixes_applied: [], baseline_completion_rate: 0.53, predicted_completion_rate_low: 0.53, predicted_completion_rate_high: 0.53, predicted_lift_low: 0, predicted_lift_high: 0, primary_benefit_cluster: null, effort_estimate: 'none' },
        { name: 'quick_win', label: 'Quick win', description: 'Apply the top 2 highest-confidence fixes.', fixes_applied: ['Ship typo-tolerant search with synonyms.', 'Add "did you mean…" suggestions on empty results.'], baseline_completion_rate: 0.53, predicted_completion_rate_low: 0.67, predicted_completion_rate_high: 0.75, predicted_lift_low: 0.14, predicted_lift_high: 0.22, primary_benefit_cluster: 'c2', effort_estimate: 'small' },
        { name: 'redesign', label: 'Redesign', description: 'Apply all 3 fixes — implies a deeper redesign.', fixes_applied: ['Ship typo-tolerant search with synonyms.', 'Add "did you mean…" suggestions on empty results.', 'Virtualize the compose editor above 500 chars.'], baseline_completion_rate: 0.53, predicted_completion_rate_low: 0.67, predicted_completion_rate_high: 0.79, predicted_lift_low: 0.14, predicted_lift_high: 0.26, primary_benefit_cluster: 'c2', effort_estimate: 'medium-to-large' }
      ]
    },
    {
      test_type: 'retention',
      short_summary: 'Retention simulation shows healthy day-7 (38%) but steep day-30 drop to 12%. Root cause: no event-triggered re-engagement, weak notification strategy. Personas who receive one relevant nudge at day 10 retain at 2.4×.',
      key_stats: [
        { value: '38%', label: 'Day-7 retention', sentiment: 'neutral' },
        { value: '12%', label: 'Day-30 retention', sentiment: 'negative' },
        { value: '2.4×', label: 'Lift from nudge', sentiment: 'positive' }
      ],
      persona_distributions: [{
        id: 'ret_curve',
        title: 'Days active per agent',
        description: 'Each dot is one agent; x = days active before drop-off.',
        chart_type: 'dot_plot',
        scope: 'all_clusters',
        axes: {
          x: { label: 'Days active', min: 0, max: 30 },
          y: { label: 'Engagement', min: 0, max: 100 }
        },
        dots: dotsForAgents({ ag_1: 1, ag_2: 28, ag_3: 7, ag_4: 3, ag_5: 21, ag_6: 14 }, CANVA_SIM),
        annotations: [{ type: 'threshold', text: 'Day-10 nudge window', position: { x: 10 } }]
      }],
      recommended_fixes: [
        { severity: 'urgent', title: 'Ship a day-10 "pick up where you left off" email.',
          summary: 'Trigger on inactivity + value-threshold. Projected retention lift: 12% → ~22%.',
          evidence: { affected_clusters: ['c1','c2','c3'], affected_screens: ['s1'], agent_count: 88, representative_quotes: ["I got no emails, no pings. Out of sight, out of mind."] },
          fix_prompt: 'Add a transactional email job that fires on day-10 inactivity (post-activation only). Body: "pick up where you left off" with a deep link to the user\'s last in-progress workspace artifact.',
          estimated_impact: 'Retention 12% → 22%', related_issue_ids: [] },
        { severity: 'important', title: 'Add magic-link sign-in as primary option.',
          summary: 'Removes password-reset churn. Especially high impact on returning users.',
          evidence: { affected_clusters: [], affected_screens: ['s1'], agent_count: 7, representative_quotes: [] },
          fix_prompt: 'Promote magic-link email sign-in to the primary auth option on the sign-in screen. Demote password sign-in to a secondary toggle. Keep both available for users who prefer passwords.',
          estimated_impact: 'Removes reset churn', related_issue_ids: [] },
        { severity: 'medium', title: 'Build an in-app digest for weekly actives.',
          summary: 'Summarize what happened in their workspace since last visit. Keeps engagement sticky.',
          evidence: { affected_clusters: ['c2'], affected_screens: ['s2'], agent_count: 11, representative_quotes: [] },
          fix_prompt: 'On dashboard load for users who haven\'t visited in 3+ days, render a "since you were away" digest at the top: new artifacts, comments, and activity in their workspace.',
          estimated_impact: 'Sticky weekly habit', related_issue_ids: [] }
      ],
      data_confidence: 'medium',
      retention_signals: [
        "Users with a day-10 inactivity nudge retained at 2.4× — event-triggered re-engagement is the highest-signal intervention.",
        "Password-reset churn is a leading indicator of drop-off — magic-link auth removes the single biggest return barrier.",
        "Users who see a 'since you were away' digest on return engage with workspace content at higher rates than cold-start users."
      ]
    }
  ],
  executive_summary: 'Across 6 test categories, 200 synthetic agents revealed strong baseline compliance and engagement, with onboarding (46% completion) and retention (12% at day 30) as the primary risk areas. Activation depends on reaching an aha moment that is currently 3 clicks deep.',
  summary: {
    overall_completion_rate: 0.46,
    completion_rate_by_cluster: { c1: 0.38, c2: 0.71, c3: 0.42 },
    worst_affected_cluster: 'c1',
    worst_affected_cluster_rate: 0.38,
    best_performing_cluster: 'c2',
    best_performing_cluster_rate: 0.71,
    cluster_gap_pct: 0.33,
    top_blockers_across_tests: [
      'Make "invite team" skippable or defer it.',
      'Replace empty state with a live demo workspace.',
      'Gate analytics behind consent state.',
      'Boost focus ring to 2px, full-opacity terracotta.',
      'Ship a day-10 "pick up where you left off" email.'
    ],
    business_summary: 'Across 6 test categories, 200 synthetic agents revealed strong baseline compliance and engagement, with onboarding (46% completion) and retention (12% at day 30) as the primary risk areas. Activation depends on reaching an aha moment that is currently 3 clicks deep.'
  },
  meta: {
    simulation_run_id: 'sim_001',
    generated_at: '2026-04-26T10:30:00Z',
    total_llm_calls: 200,
    tokens_used_total: 18432,
    budgets_engaged: [],
    warnings: [],
    schema_version: '1.0'
  }
};

window.REPORT = REPORT;

// ──────────────────── Components ────────────────────

// Map persona_report's TestType to persona_simulation's TestCategory.
// engagement and retention both map to engagement_retention.
const reportToSimCategory = (testType) =>
  (testType === 'engagement' || testType === 'retention') ? 'engagement_retention' : testType;

// Cluster color palette (3 clusters from synthesis)
const CLUSTER_COLORS = { c1: '#c26a43', c2: '#3d7a8c', c3: '#7a8c3d' };
const clusterColor = (cid) => CLUSTER_COLORS[cid] || 'var(--terra)';

function DotDistribution({ distribution, paths }) {
  const { title, description, chart_type, axes, dots, annotations } = distribution;
  const [active, setActive] = uS4(null);
  const [hovered, setHovered] = uS4(null);

  const W = 500, H = 220, PAD_L = 70, PAD_R = 20, PAD_T = 30, PAD_B = 60;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const xAxis = axes.x;
  const yAxis = axes.y;

  const scaleX = (v) => {
    if (xAxis.categorical) {
      const idx = xAxis.categorical.indexOf(v);
      const denom = Math.max(1, xAxis.categorical.length - 1);
      return PAD_L + (idx / denom) * innerW;
    }
    const min = xAxis.min ?? 0;
    const max = xAxis.max ?? 100;
    return PAD_L + ((Number(v) - min) / (max - min)) * innerW;
  };
  const scaleY = (v) => {
    if (v == null || !yAxis) return PAD_T + innerH / 2;
    if (yAxis.categorical) {
      const idx = yAxis.categorical.indexOf(v);
      const denom = Math.max(1, yAxis.categorical.length - 1);
      return PAD_T + innerH - (idx / denom) * innerH;
    }
    const min = yAxis.min ?? 0;
    const max = yAxis.max ?? 100;
    return PAD_T + innerH - ((Number(v) - min) / (max - min)) * innerH;
  };

  const positions = dots.map(d => ({ ...d, cx: scaleX(d.x), cy: scaleY(d.y) }));

  const activeDot = active != null ? positions[active] : null;
  const activeAgentPath = activeDot ? paths.find(p => p.agent.agent_id === activeDot.agent_id) : null;
  const activeQuote = activeAgentPath ? (
    activeAgentPath.steps.flatMap(s => s.decision.observed_issues).filter(Boolean)[0]
    || activeAgentPath.steps.find(s => s.decision.reasoning)?.decision.reasoning
    || null
  ) : null;
  const activeWho = activeAgentPath ? `Persona · ${activeAgentPath.agent.cluster_name}` : null;

  return React.createElement('div', { className: 'chart-wrap' },
    React.createElement('div', { className: 'chart-title' }, title),
    description && React.createElement('div', { className: 'chart-desc', style: { fontSize: 11, color: 'var(--ink-60)', marginBottom: 6 } }, description),
    React.createElement('svg', { className: 'chart-svg', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none' },
      // grid
      [0, 0.25, 0.5, 0.75, 1].map((g, i) => {
        const y = PAD_T + g * innerH;
        return React.createElement('line', {
          key: 'g' + i, x1: PAD_L, x2: W - PAD_R, y1: y, y2: y,
          stroke: 'var(--hair)', strokeWidth: 1, strokeDasharray: i === 4 ? '0' : '2 3'
        });
      }),
      // y-axis labels
      yAxis && [yAxis.min ?? 0, ((yAxis.min ?? 0) + (yAxis.max ?? 100)) / 2, yAxis.max ?? 100].map((val, i) => {
        const y = scaleY(val) + 3;
        return React.createElement('text', {
          key: 'yl' + i, x: PAD_L - 12, y, fontSize: 9, fill: 'var(--ink-40)', fontFamily: 'Montserrat', textAnchor: 'end'
        }, typeof val === 'number' ? Math.round(val) : val);
      }),
      // y-axis title (vertical, parallel to y-axis)
      yAxis && React.createElement('text', {
        key: 'y-title', x: 8, y: PAD_T + innerH / 2,
        fontSize: 10, fill: 'var(--ink-60)', fontFamily: 'Montserrat', fontWeight: 500,
        textAnchor: 'middle', transform: `rotate(-90 8 ${PAD_T + innerH / 2})`
      }, yAxis.label),
      // x-axis labels (at bottom, parallel to x-axis)
      xAxis.categorical && xAxis.categorical.map((cat, i) => {
        const x = scaleX(cat);
        return React.createElement('text', {
          key: 'xl' + i, x, y: PAD_T + innerH + 16,
          fontSize: 9, fill: 'var(--ink-40)', fontFamily: 'Montserrat', textAnchor: 'middle'
        }, cat.length > 12 ? cat.slice(0, 10) + '…' : cat);
      }),
      // x-axis numeric labels (min, mid, max)
      !xAxis.categorical && [xAxis.min ?? 0, ((xAxis.min ?? 0) + (xAxis.max ?? 100)) / 2, xAxis.max ?? 100].map((val, i) => {
        const x = scaleX(val);
        return React.createElement('text', {
          key: 'xl' + i, x, y: PAD_T + innerH + 16,
          fontSize: 9, fill: 'var(--ink-40)', fontFamily: 'Montserrat', textAnchor: 'middle'
        }, typeof val === 'number' ? Math.round(val) : val);
      }),
      // x-axis title
      xAxis && React.createElement('text', {
        key: 'x-title', x: PAD_L + innerW / 2, y: H - 6,
        fontSize: 10, fill: 'var(--ink-60)', fontFamily: 'Montserrat', fontWeight: 500, textAnchor: 'middle'
      }, `${xAxis.label}${xAxis.unit ? ' (' + xAxis.unit + ')' : ''}`),
      // annotations: threshold lines
      annotations.filter(a => a.type === 'threshold').map((a, i) => {
        if (!a.position || a.position.x == null) return null;
        const x = scaleX(a.position.x);
        return React.createElement('line', {
          key: 'th' + i, x1: x, x2: x, y1: PAD_T, y2: PAD_T + innerH,
          stroke: 'var(--ink-40)', strokeWidth: 1, strokeDasharray: '3 3'
        });
      }),
      // hover crosshair lines + axis value labels
      hovered !== null && (() => {
        const hp = positions[hovered];
        const rawX = hp.x;
        const rawY = hp.y;
        const xLabel = typeof rawX === 'number'
          ? `${Math.round(rawX)}${xAxis.unit || ''}`
          : String(rawX ?? '').slice(0, 8);
        const yLabel = rawY != null
          ? `${Math.round(rawY)}${yAxis?.unit || ''}`
          : '';
        const xLabelW = Math.max(28, xLabel.length * 6 + 10);
        const yLabelW = Math.max(24, yLabel.length * 6 + 10);
        return [
          React.createElement('line', {
            key: 'hv', x1: hp.cx, x2: hp.cx, y1: hp.cy, y2: PAD_T + innerH,
            stroke: '#999', strokeWidth: 1, strokeDasharray: '3 3'
          }),
          React.createElement('line', {
            key: 'hh', x1: PAD_L, x2: hp.cx, y1: hp.cy, y2: hp.cy,
            stroke: '#999', strokeWidth: 1, strokeDasharray: '3 3'
          }),
          React.createElement('rect', {
            key: 'xb', x: hp.cx - xLabelW / 2, y: PAD_T + innerH + 26,
            width: xLabelW, height: 13, rx: 3, fill: '#666'
          }),
          React.createElement('text', {
            key: 'xt', x: hp.cx, y: PAD_T + innerH + 35,
            textAnchor: 'middle', fontSize: 8, fill: 'white', fontFamily: 'Montserrat'
          }, xLabel),
          React.createElement('rect', {
            key: 'yb', x: 1, y: hp.cy - 7, width: yLabelW, height: 13, rx: 3, fill: '#666'
          }),
          React.createElement('text', {
            key: 'yt', x: 1 + yLabelW / 2, y: hp.cy + 4,
            textAnchor: 'middle', fontSize: 8, fill: 'white', fontFamily: 'Montserrat'
          }, yLabel)
        ];
      })(),
      // dot labels (abbreviated cluster names)
      positions.map((p, i) =>
        React.createElement('text', {
          key: 'l' + i, x: p.cx, y: p.cy - 9,
          textAnchor: 'middle', fontSize: 8,
          fill: clusterColor(p.cluster_id), fontFamily: 'Montserrat'
        }, p.cluster_name?.split(' ')[0] ?? p.cluster_id)
      ),
      // dots
      positions.map((p, i) =>
        React.createElement('circle', {
          key: 'd' + i, cx: p.cx, cy: p.cy, r: active === i ? 7 : 5,
          className: 'chart-dot',
          fill: clusterColor(p.cluster_id), stroke: 'var(--bg)', strokeWidth: 2,
          onClick: () => setActive(active === i ? null : i),
          onMouseEnter: () => setHovered(i),
          onMouseLeave: () => setHovered(null),
          style: { cursor: 'pointer' }
        })
      )
    ),
    // x-axis labels
    React.createElement('div', { className: 'chart-xlabels' },
      xAxis.categorical
        ? xAxis.categorical.map((l, i) => React.createElement('span', { key: i }, l))
        : [xAxis.min ?? 0, xAxis.max ?? 100].map((v, i) =>
            React.createElement('span', { key: i }, `${v}${xAxis.unit || ''}`))
    ),
    // annotations: text notes
    annotations.filter(a => a.type === 'note' || a.type === 'group_label').length > 0 &&
      React.createElement('div', { style: { fontSize: 11, color: 'var(--ink-60)', marginTop: 6, fontStyle: 'italic' } },
        annotations.filter(a => a.type === 'note' || a.type === 'group_label').map(a => a.text).join(' · ')),
    // quote popup
    activeDot && activeQuote && React.createElement('div', {
      className: 'quote-pop',
      style: {
        left: `${(activeDot.cx / W) * 100}%`,
        top: `${20 + (activeDot.cy / H) * 175}px`
      }
    },
      React.createElement('div', { className: 'who' }, activeWho),
      activeQuote
    )
  );
}

// Trajectory chart: per-cluster frustration arc across screens (1–5).
function TrajectoryChart({ trajectory, clusterNames }) {
  if (!trajectory || !trajectory.cells || trajectory.cells.length === 0) return null;
  const { screens, clusters, cells } = trajectory;
  const W = 500, H = 220, PAD_L = 70, PAD_R = 20, PAD_T = 30, PAD_B = 60;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const xStep = screens.length > 1 ? innerW / (screens.length - 1) : 0;
  const scaleX = (i) => PAD_L + i * xStep;
  const scaleY = (v) => PAD_T + innerH - ((v - 1) / 4) * innerH;

  const byCluster = {};
  for (const cell of cells) {
    if (!byCluster[cell.cluster_id]) byCluster[cell.cluster_id] = [];
    byCluster[cell.cluster_id].push(cell);
  }
  for (const cid in byCluster) byCluster[cid].sort((a, b) => a.screen_index - b.screen_index);

  return React.createElement('div', { className: 'chart-wrap' },
    React.createElement('div', { className: 'chart-title' }, 'Frustration trajectory by cluster'),
    React.createElement('div', { className: 'chart-desc', style: { fontSize: 11, color: 'var(--ink-60)', marginBottom: 6 } },
      'Average frustration (1–5) across the flow per cluster. Crossing 3 (dashed) marks critical friction.'),
    React.createElement('svg', { className: 'chart-svg', viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'none' },
      [1, 2, 3, 4, 5].map((g, i) =>
        React.createElement('line', {
          key: 'g' + i, x1: PAD_L, x2: W - PAD_R, y1: scaleY(g), y2: scaleY(g),
          stroke: 'var(--hair)', strokeWidth: 1, strokeDasharray: g === 3 ? '4 2' : '2 3'
        })
      ),
      [1, 3, 5].map((v, i) =>
        React.createElement('text', { key: 'yl' + i, x: PAD_L - 12, y: scaleY(v) + 3, fontSize: 9, fill: 'var(--ink-40)', fontFamily: 'Montserrat', textAnchor: 'end' }, v)
      ),
      React.createElement('text', {
        key: 'y-title', x: 8, y: PAD_T + innerH / 2,
        fontSize: 10, fill: 'var(--ink-60)', fontFamily: 'Montserrat', fontWeight: 500,
        textAnchor: 'middle', transform: `rotate(-90 8 ${PAD_T + innerH / 2})`
      }, 'Frustration'),
      screens.map((s, i) =>
        React.createElement('text', { key: 'xl' + i, x: scaleX(i), y: H - 12, fontSize: 9, fill: 'var(--ink-40)', textAnchor: 'middle', fontFamily: 'Montserrat' }, s)
      ),
      React.createElement('text', {
        key: 'x-title', x: PAD_L + innerW / 2, y: H - 6,
        fontSize: 10, fill: 'var(--ink-60)', fontFamily: 'Montserrat', fontWeight: 500, textAnchor: 'middle'
      }, 'Screen'),
      clusters.flatMap(cid => {
        const cclls = byCluster[cid] || [];
        if (!cclls.length) return [];
        const points = cclls.map(c => `${scaleX(c.screen_index)},${scaleY(c.emotions.frustration)}`).join(' ');
        const items = [
          React.createElement('polyline', { key: 'ln' + cid, points, fill: 'none', stroke: clusterColor(cid), strokeWidth: 2 })
        ];
        cclls.forEach((c, i) => items.push(React.createElement('circle', {
          key: 'pt' + cid + i,
          cx: scaleX(c.screen_index), cy: scaleY(c.emotions.frustration),
          r: 3, fill: clusterColor(cid), stroke: 'var(--bg)', strokeWidth: 1.5
        })));
        return items;
      })
    ),
    React.createElement('div', { style: { display: 'flex', gap: 10, marginTop: 6, fontSize: 10, color: 'var(--ink-60)', flexWrap: 'wrap' } },
      clusters.map(cid =>
        React.createElement('span', { key: cid, style: { display: 'inline-flex', alignItems: 'center', gap: 4 } },
          React.createElement('span', { style: { width: 10, height: 2, background: clusterColor(cid), display: 'inline-block' } }),
          clusterNames?.[cid] || cid
        )
      )
    )
  );
}

// Compact lift bar shown inside each Fix card.
function LiftBadge({ impact }) {
  if (!impact) return null;
  const conf = impact.confidence || 'low';
  const confBg = conf === 'high' ? '#23a66c' : conf === 'medium' ? '#c98b38' : '#9c9c9c';
  let label;
  if (impact.predicted_lift_pct == null) {
    label = 'Lift: insufficient sibling-path data';
  } else {
    const pct = Math.round(impact.predicted_lift_pct * 100);
    const range = impact.predicted_lift_range;
    const rangeStr = range ? ` (${Math.round(range[0] * 100)}–${Math.round(range[1] * 100)}%)` : '';
    label = `Predicted lift: ${pct >= 0 ? '+' : ''}${pct}%${rangeStr} · n=${impact.sample_size}`;
  }
  return React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 11, color: 'var(--ink-70)' }
  },
    React.createElement('span', {
      style: { background: confBg, color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }
    }, conf + ' confid'),
    React.createElement('span', null, label)
  );
}

// Cards for what-if scenarios.
function RetentionSignals({ signals }) {
  if (!signals || signals.length === 0) return null;
  return React.createElement('div', { className: 'rpt-section' },
    React.createElement('h3', null,
      'Signals that would predict better retention',
      React.createElement('span', { className: 'badge' }, '05')
    ),
    React.createElement('ul', { style: { paddingLeft: 18, margin: 0 } },
      signals.map((s, i) =>
        React.createElement('li', { key: i, style: { marginBottom: 6, fontSize: 13 } }, s)
      )
    )
  );
}

function ScenarioCards({ scenarios }) {
  const [selectedScenario, setSelectedScenario] = React.useState(null);

  if (!scenarios || scenarios.length === 0) return null;
  return React.createElement('div', { className: 'rpt-section' },
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 } },
      React.createElement('h3', { style: { margin: 0 } }, 'What-if scenarios', React.createElement('span', { className: 'badge' }, '05')),
      React.createElement('div', { style: { display: 'flex', gap: 6, fontSize: 11 } },
        React.createElement('button', {
          onClick: () => setSelectedScenario(null),
          style: {
            padding: '4px 10px',
            borderRadius: 4,
            border: selectedScenario === null ? '1px solid var(--terra)' : '1px solid var(--hair)',
            background: selectedScenario === null ? 'var(--terra-tint)' : 'transparent',
            color: selectedScenario === null ? 'var(--terra)' : 'var(--ink-60)',
            cursor: 'pointer',
            fontWeight: selectedScenario === null ? 500 : 400,
            transition: 'all 160ms ease',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            fontSize: 10
          }
        }, 'All'),
        ...['status_quo', 'quick_win', 'redesign'].map(scenarioType => {
          const label = scenarioType === 'status_quo' ? 'Status quo' : scenarioType === 'quick_win' ? 'Quick win' : 'Redesign';
          return React.createElement('button', {
            key: scenarioType,
            onClick: () => setSelectedScenario(scenarioType),
            style: {
              padding: '4px 10px',
              borderRadius: 4,
              border: selectedScenario === scenarioType ? '1px solid var(--terra)' : '1px solid var(--hair)',
              background: selectedScenario === scenarioType ? 'var(--terra-tint)' : 'transparent',
              color: selectedScenario === scenarioType ? 'var(--terra)' : 'var(--ink-60)',
              cursor: 'pointer',
              fontWeight: selectedScenario === scenarioType ? 500 : 400,
              transition: 'all 160ms ease',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontSize: 10
            }
          }, label);
        })
      )
    ),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 } },
      scenarios
        .filter(s => selectedScenario === null || s.name === selectedScenario)
        .map(s => {
          const hasResidualCounts = s.residual_issue_counts != null;
          const lo = hasResidualCounts ? null : Math.round((s.predicted_completion_rate_low || 0) * 100);
          const hi = hasResidualCounts ? null : Math.round((s.predicted_completion_rate_high || 0) * 100);
          const lift = !hasResidualCounts && (s.predicted_lift_high > 0)
            ? `+${Math.round(s.predicted_lift_low * 100)}–${Math.round(s.predicted_lift_high * 100)}%`
            : '—';
          const issueCountStr = hasResidualCounts
            ? `${s.residual_issue_counts.urgent} critical · ${s.residual_issue_counts.important} important · ${s.residual_issue_counts.medium} medium remaining`
            : null;

          const effortColors = {
            'none': 'var(--ink-40)',
            'small': 'var(--terra)',
            'medium-to-large': '#C26A43'
          };

          return React.createElement('div', {
            key: s.name,
            className: 'scenario-card',
            style: {
              border: '1px solid var(--hair)',
              borderRadius: 8,
              padding: 16,
              background: 'var(--bg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              boxShadow: 'var(--shadow-panel)',
              position: 'relative',
              overflow: 'hidden'
            }
          },
            // Decorative accent line
            React.createElement('div', {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: s.name === 'status_quo' ? 'var(--ink-40)' : s.name === 'quick_win' ? 'var(--terra)' : '#c98b38',
              }
            }),
            React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'space-between' } },
              React.createElement('div', { style: { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-60)', fontWeight: 500 } }, s.label),
              React.createElement('div', { style: { fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: effortColors[s.effort_estimate] || 'var(--ink-60)', fontWeight: 600 } }, s.effort_estimate.replace('-', '–'))
            ),
            React.createElement('div', { style: { fontSize: hasResidualCounts ? 13 : 28, marginTop: 2, fontFamily: 'Montserrat', lineHeight: hasResidualCounts ? 1.5 : 'inherit', fontWeight: 600, color: 'var(--ink)' } },
              hasResidualCounts ? issueCountStr : (lo === hi ? `${lo}%` : `${lo}–${hi}%`)),
            !hasResidualCounts && React.createElement('div', { style: { fontSize: 10, color: 'var(--ink-60)', marginTop: 2 } }, `Lift ${lift}`),
            React.createElement('div', { style: { fontSize: 12, color: 'var(--ink-70)', lineHeight: 1.4, marginTop: 2 } }, s.description),
            s.fixes_applied && s.fixes_applied.length > 0 && React.createElement('div', { style: { marginTop: 8, paddingTop: 10, borderTop: '1px solid var(--hair)' } },
              React.createElement('div', { style: { fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-40)', marginBottom: 6, fontWeight: 600 } }, 'Changes applied'),
              React.createElement('ul', {
                style: { fontSize: 11, color: 'var(--ink-70)', margin: 0, paddingLeft: 16, lineHeight: 1.5 }
              },
                s.fixes_applied.map((t, i) => React.createElement('li', { key: i }, t))
              )
            )
          );
        })
    )
  );
}

// Outcome context header shown above the per-test "Summary" section.
function OutcomeContextHeader({ ctx }) {
  if (!ctx) return null;
  return React.createElement('div', {
    style: { padding: '10px 12px', background: 'var(--terra-tint)', border: '1px solid var(--hair)', borderRadius: 6, marginBottom: 12 }
  },
    React.createElement('div', { style: { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-60)' } }, ctx.test_type_metric),
    React.createElement('div', { style: { fontSize: 13, marginTop: 4 } }, ctx.business_implication)
  );
}

// Persona profiles tab — color-coded cards per cluster.
function PersonaProfiles({ paths, clusterFindings }) {
  if (!clusterFindings || clusterFindings.length === 0) return null;

  const clusterStats = {};
  paths.forEach(p => {
    const cid = p.agent.cluster_id;
    if (!clusterStats[cid]) clusterStats[cid] = { ages: [], tech: [], patience: [], devices: [] };
    clusterStats[cid].ages.push(p.agent.age);
    clusterStats[cid].tech.push(p.agent.tech_savviness);
    clusterStats[cid].patience.push(p.agent.patience_threshold);
    clusterStats[cid].devices.push(p.agent.primary_device);
  });

  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 16 } },
    clusterFindings.map(cf => {
      const stats = clusterStats[cf.cluster_id] || { ages: [], tech: [], patience: [], devices: [] };
      const avgAge = stats.ages.length ? Math.round(stats.ages.reduce((a, b) => a + b, 0) / stats.ages.length) : '—';
      const avgTech = stats.tech.length ? (stats.tech.reduce((a, b) => a + b, 0) / stats.tech.length).toFixed(1) : '—';
      const color = clusterColor(cf.cluster_id);
      const rateNum = cf.completion_rate != null ? Math.round(cf.completion_rate * 100) : 0;
      const rateColor = rateNum >= 60 ? '#23a66c' : rateNum >= 40 ? '#c98b38' : '#b8412b';

      return React.createElement('div', {
        key: cf.cluster_id,
        style: {
          borderLeft: `3px solid ${color}`, padding: 16, background: 'var(--bg-alt)',
          borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 12
        }
      },
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' } },
          React.createElement('h4', { style: { margin: 0, color, fontSize: 16 } }, cf.cluster_name),
          React.createElement('span', {
            style: {
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color,
              border: `1px solid ${color}`,
              padding: '2px 6px',
              borderRadius: 999,
              opacity: 0.85
            }
          }, 'Cluster'),
          React.createElement('div', {
            style: {
              fontSize: 11, fontWeight: 500, color: '#fff', background: rateColor,
              padding: '2px 8px', borderRadius: 3,
              marginLeft: 'auto'
            }
          }, `${rateNum}% completion`)
        ),
        React.createElement('p', { style: { margin: 0, fontSize: 13, color: 'var(--ink-70)' } }, cf.summary),
        React.createElement('div', { style: { display: 'flex', gap: 8, flexWrap: 'wrap' } },
          cf.key_friction?.map((friction, i) =>
            React.createElement('span', {
              key: i,
              style: {
                fontSize: 10, padding: '4px 8px', background: 'var(--hair)', borderRadius: 3,
                color: 'var(--ink-60)'
              }
            }, friction)
          )
        ),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontSize: 11 } },
          React.createElement('div', null,
            React.createElement('div', { style: { color: 'var(--ink-40)', textTransform: 'uppercase', fontSize: 9 } }, 'Avg age'),
            React.createElement('div', { style: { fontFamily: 'Montserrat', marginTop: 4 } }, avgAge)
          ),
          React.createElement('div', null,
            React.createElement('div', { style: { color: 'var(--ink-40)', textTransform: 'uppercase', fontSize: 9 } }, 'Tech savvy'),
            React.createElement('div', { style: { fontFamily: 'Montserrat', marginTop: 4 } }, avgTech)
          ),
          React.createElement('div', null,
            React.createElement('div', { style: { color: 'var(--ink-40)', textTransform: 'uppercase', fontSize: 9 } }, 'Patience'),
            React.createElement('div', { style: { fontFamily: 'Montserrat', marginTop: 4, fontSize: 10 } },
              stats.patience[0] || '—'
            )
          ),
          React.createElement('div', null,
            React.createElement('div', { style: { color: 'var(--ink-40)', textTransform: 'uppercase', fontSize: 9 } }, 'Device'),
            React.createElement('div', { style: { fontFamily: 'Montserrat', marginTop: 4, fontSize: 10 } },
              stats.devices[0] || '—'
            )
          )
        )
      );
    })
  );
}

// Top-level executive summary banner.
function ExecutiveSummaryBanner({ summary }) {
  if (!summary) return null;
  const overall = Math.round((summary.overall_completion_rate || 0) * 100);
  const worstRate = summary.worst_affected_cluster_rate != null ? Math.round(summary.worst_affected_cluster_rate * 100) : null;
  const bestRate = summary.best_performing_cluster_rate != null ? Math.round(summary.best_performing_cluster_rate * 100) : null;
  const gap = summary.cluster_gap_pct != null ? Math.round(summary.cluster_gap_pct * 100) : null;
  return React.createElement('div', { className: 'rpt-section' },
    React.createElement('h3', null, 'Executive summary', React.createElement('span', { className: 'badge' }, '00')),
    React.createElement('div', { style: { display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' } },
      React.createElement('div', { style: { minWidth: 120 } },
        React.createElement('div', { style: { fontSize: 11, color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.08em' } }, 'Overall completion'),
        React.createElement('div', { style: { fontSize: 28, fontFamily: 'Montserrat' } }, `${overall}%`)
      ),
      gap != null && React.createElement('div', { style: { minWidth: 200 } },
        React.createElement('div', { style: { fontSize: 11, color: 'var(--ink-60)', textTransform: 'uppercase', letterSpacing: '0.08em' } }, 'Worst-hit segment'),
        React.createElement('div', { style: { fontSize: 13, marginTop: 4 } },
          `${summary.worst_affected_cluster} (${worstRate}%) trails ${summary.best_performing_cluster} (${bestRate}%) by ${gap} points.`
        )
      ),
      summary.business_summary && React.createElement('div', { style: { flex: 1, minWidth: 240, fontSize: 12, color: 'var(--ink-80)' } },
        summary.business_summary
      )
    ),
    summary.top_blockers_across_tests && summary.top_blockers_across_tests.length > 0 && React.createElement('div', { style: { marginTop: 16 } },
      React.createElement('div', { style: { fontSize: 10, color: 'var(--ink-40)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10, fontWeight: 600 } }, 'Top blockers across tests'),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 6 } },
        summary.top_blockers_across_tests.map((blocker, i) => {
          const rankColors = ['#b8412b', '#c98b38', '#c26a43', '#3d7a8c', '#7a8c3d'];
          const color = rankColors[i] || '#9c9c9c';
          return React.createElement('div', {
            key: i,
            style: {
              display: 'flex', gap: 10, alignItems: 'center',
              padding: '9px 12px',
              background: i === 0 ? 'rgba(184,65,43,0.05)' : 'var(--bg-alt)',
              borderLeft: `3px solid ${color}`,
              borderRadius: '0 6px 6px 0',
              transition: 'background 150ms'
            }
          },
            React.createElement('div', {
              style: {
                minWidth: 20, height: 20, borderRadius: 4, background: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: 'white',
                fontFamily: 'Montserrat', flexShrink: 0
              }
            }, i + 1),
            React.createElement('div', { style: { fontSize: 12, lineHeight: 1.4, color: 'var(--ink-80)', fontWeight: i === 0 ? 500 : 400 } }, blocker)
          );
        })
      )
    )
  );
}

function SummaryReport({ onClose, selectedWebsite }) {
  const simResult = getSimResult(selectedWebsite);
  const generatedDate = new Date(REPORT.meta.generated_at).toLocaleDateString();
  
  // Create dynamic summary based on website
  const summary = {
    overall_completion_rate: simResult.report.metrics.completion_rate_overall,
    completion_rate_by_cluster: simResult.report.metrics.completion_rate_by_cluster,
    worst_affected_cluster: simResult.report.cluster_findings.reduce((min, cf) => cf.completion_rate < min.completion_rate ? cf : min, simResult.report.cluster_findings[0])?.cluster_name,
    worst_affected_cluster_rate: simResult.report.cluster_findings.reduce((min, cf) => cf.completion_rate < min.completion_rate ? cf : min, simResult.report.cluster_findings[0])?.completion_rate,
    best_performing_cluster: simResult.report.cluster_findings.reduce((max, cf) => cf.completion_rate > max.completion_rate ? cf : max, simResult.report.cluster_findings[0])?.cluster_name,
    best_performing_cluster_rate: simResult.report.cluster_findings.reduce((max, cf) => cf.completion_rate > max.completion_rate ? cf : max, simResult.report.cluster_findings[0])?.completion_rate,
    cluster_gap_pct: Math.abs(
      simResult.report.cluster_findings.reduce((max, cf) => cf.completion_rate > max.completion_rate ? cf : max, simResult.report.cluster_findings[0])?.completion_rate -
      simResult.report.cluster_findings.reduce((min, cf) => cf.completion_rate < min.completion_rate ? cf : min, simResult.report.cluster_findings[0])?.completion_rate
    ),
    top_blockers_across_tests: simResult.report.top_friction_points,
    business_summary: simResult.report.executive_summary
  };

  return React.createElement('div', { className: 'report-mask', onClick: onClose },
    React.createElement('div', { className: 'report', onClick: (e) => e.stopPropagation() },
      React.createElement('div', { className: 'report-head' },
        React.createElement('div', {
          className: 'score-big',
          style: { background: 'var(--ink-80)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px', textAlign: 'center', lineHeight: 1.2 }
        }, '↗', React.createElement('div', { style: { fontSize: 9, opacity: 0.7, marginTop: 2 } }, 'summary')),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('h2', null, 'Executive summary'),
          React.createElement('div', { className: 'sub' },
            `${simResult.report.metrics.total_agents} synthetic personas · ${generatedDate}`)
        ),
        React.createElement('button', { className: 'report-close', onClick: onClose }, React.createElement(IconX))
      ),
      React.createElement('div', { className: 'report-content' },
        React.createElement('div', { className: 'report-main' },
        React.createElement(ExecutiveSummaryBanner, { summary }),
        React.createElement('div', { className: 'rpt-section' },
          React.createElement('h3', null, 'Cluster findings'),
          simResult.report.cluster_findings.map(cf =>
            React.createElement('div', {
              key: cf.cluster_id,
              style: {
                display: 'flex', gap: 12, padding: 12, marginBottom: 8, background: 'var(--bg-alt)',
                borderLeft: `3px solid ${clusterColor(cf.cluster_id)}`, borderRadius: 4
              }
            },
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: 13, fontWeight: 500, color: clusterColor(cf.cluster_id), marginBottom: 4 } }, cf.cluster_name),
                React.createElement('div', { style: { fontSize: 12, color: 'var(--ink-70)' } }, cf.summary)
              ),
              React.createElement('div', { style: { textAlign: 'right', minWidth: 70 } },
                React.createElement('div', { style: { fontSize: 9, color: 'var(--ink-40)', textTransform: 'uppercase' } }, 'Completion'),
                React.createElement('div', {
                  style: {
                    fontSize: 20, fontFamily: 'Montserrat', fontWeight: 500,
                    color: cf.completion_rate >= 0.6 ? '#23a66c' : cf.completion_rate >= 0.4 ? '#c98b38' : '#b8412b'
                  }
                }, `${Math.round(cf.completion_rate * 100)}%`)
              )
            )
          )
        )
        ),
        React.createElement('div', { className: 'persona-card-column', onClick: (e) => e.stopPropagation() },
          React.createElement('div', { className: 'persona-card-header' },
            React.createElement('h3', { style: { margin: 0, fontSize: 16, fontWeight: 600 } }, 'Persona Groups')
          ),
          React.createElement('div', { className: 'persona-card-body' },
            React.createElement(PersonaProfiles, { paths: simResult.paths, clusterFindings: simResult.report.cluster_findings })
          )
        )
      )
    )
  );
}

function Report({ testId, onClose, selectedWebsite }) {
  if (testId === '__summary') return React.createElement(SummaryReport, { onClose, selectedWebsite });

  const simResult = getSimResult(selectedWebsite);
  const test = [...UNIVERSAL_TESTS, ...PERSONA_TESTS].find(t => t.id === testId);
  const tt = REPORT.test_type_reports.find(r => r.test_type === testId);
  const [copiedIdx, setCopiedIdx] = uS4(null);
  if (!test || !tt) return null;

  const simCategory = reportToSimCategory(tt.test_type);
  const findings = simResult.report.categorized_issues.issues
    .filter(issue => issue.category === simCategory)
    .map(issue => ({ t: issue.summary, d: issue.evidence.join(' ') }));

  const generatedDate = new Date(REPORT.meta.generated_at).toLocaleDateString();

  const copy = (i) => {
    const fix = tt.recommended_fixes[i];
    navigator.clipboard?.writeText(fix.fix_prompt);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1600);
  };

  const confBg = tt.data_confidence === 'high' ? '#23a66c'
               : tt.data_confidence === 'medium' ? '#c98b38'
               : '#b8412b';
  const clusterNames = clusterNamesFromSim(simResult);

  return React.createElement('div', { className: 'report-mask', onClick: onClose },
    React.createElement('div', { className: 'report', onClick: (e) => e.stopPropagation() },
      React.createElement('div', { className: 'report-head' },
        React.createElement('div', {
          className: 'score-big',
          style: { background: confBg, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 8px', textAlign: 'center', lineHeight: 1.1 }
        }, tt.data_confidence, React.createElement('div', { style: { fontSize: 9, opacity: 0.85, marginTop: 2 } }, 'Conf')),
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('h2', null, test.name, ' report'),
          React.createElement('div', { className: 'sub' },
            `${simResult.report.metrics.total_agents} synthetic personas · ${generatedDate}`)
        ),
        React.createElement('button', { className: 'report-close', onClick: onClose }, React.createElement(IconX))
      ),
      React.createElement('div', { className: 'report-content' },
        React.createElement('div', { className: 'report-main' },
        React.createElement(OutcomeContextHeader, { ctx: tt.outcome_context }),
        React.createElement('div', { className: 'rpt-section' },
          React.createElement('h3', null, 'Summary', React.createElement('span', { className: 'badge' }, '01')),
          React.createElement('div', { className: 'rpt-summary' },
            React.createElement('p', null, tt.short_summary)
          ),
          React.createElement('div', { className: 'rpt-stats' },
            tt.key_stats.map((s) =>
              React.createElement('div', { key: s.label, className: 'rpt-stat' },
                React.createElement('div', { className: 'k' }, s.label),
                React.createElement('div', { className: 'v' }, s.value)
              )
            )
          )
        ),
        React.createElement('div', { className: 'rpt-section' },
          React.createElement('h3', null, 'Persona distribution',
            React.createElement('span', { className: 'badge' }, '02'),
            React.createElement('span', { className: 'badge', style: { background: 'var(--terra-tint)', color: 'var(--terra)' } }, 'click a dot')
          ),
          React.createElement('div', { className: 'cluster-legend' },
            Object.entries(clusterNames).map(([cid, name]) =>
              React.createElement('span', { key: cid, className: 'cluster-legend-item' },
                React.createElement('span', { className: 'cluster-legend-swatch', style: { background: clusterColor(cid) } }),
                name
              )
            )
          ),
          tt.persona_distributions.map((pd) =>
            React.createElement(DotDistribution, { key: pd.id, distribution: pd, paths: simResult.paths })),
          tt.trajectory && React.createElement(TrajectoryChart, { trajectory: tt.trajectory, clusterNames })
        ),
        React.createElement('div', { className: 'rpt-section' },
          React.createElement('h3', null, 'Key findings', React.createElement('span', { className: 'badge' }, '03')),
          React.createElement('div', { className: 'findings-list' },
            findings.map((f, i) =>
              React.createElement('div', { key: i, className: 'finding' },
                React.createElement('div', { className: 'finding-num' }, i + 1),
                React.createElement('div', { className: 'finding-text' },
                  React.createElement('strong', null, f.t), ' ', f.d
                )
              )
            )
          )
        ),
        React.createElement('div', { className: 'rpt-section' },
          React.createElement('h3', null, 'Recommended fixes', React.createElement('span', { className: 'badge' }, '04')),
          React.createElement('div', { className: 'fixes-list' },
            tt.recommended_fixes.map((f, i) =>
              React.createElement('div', { key: i, className: `fix ${f.severity}` },
                React.createElement('div', { className: 'fix-head' },
                  React.createElement('span', { className: 'fix-prio' }, f.severity),
                  React.createElement('span', { className: 'fix-title' }, f.title)
                ),
                React.createElement('div', { className: 'fix-desc' }, f.summary),
                React.createElement(LiftBadge, { impact: f.counterfactual_impact }),
                React.createElement('div', { className: 'fix-actions' },
                  React.createElement('button', {
                    className: 'fix-btn' + (copiedIdx === i ? ' copied' : ''),
                    onClick: () => copy(i)
                  },
                    React.createElement(copiedIdx === i ? IconCheck : IconCopy),
                    copiedIdx === i ? 'Copied' : 'Copy fix prompt'
                  ),
                  React.createElement('button', { className: 'fix-btn primary' },
                    React.createElement(IconTerminal),
                    'Send to coding agent'
                  )
                )
              )
            )
          )
        ),
        tt.test_type === 'retention'
          ? React.createElement(RetentionSignals, { signals: tt.retention_signals })
          : React.createElement(ScenarioCards, { scenarios: tt.scenarios })
        ),
        React.createElement('div', { className: 'persona-card-column', onClick: (e) => e.stopPropagation() },
          React.createElement('div', { className: 'persona-card-header' },
            React.createElement('h3', { style: { margin: 0, fontSize: 16, fontWeight: 600 } }, 'Persona Groups')
          ),
          React.createElement('div', { className: 'persona-card-body' },
            React.createElement(PersonaProfiles, { paths: simResult.paths, clusterFindings: simResult.report.cluster_findings })
          )
        )
      )
    )
  );
}

window.Report = Report;
window.getSimResult = getSimResult;
