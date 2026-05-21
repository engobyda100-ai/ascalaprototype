/* global React */
const { useState: uS3, useEffect: uE3, useRef: uR3, useMemo: uM3 } = React;

// Test IDs match the persona_report TestType enum (backend/persona_report/schema.py).
const UNIVERSAL_TESTS = [
  { id: 'accessibility', name: 'Accessibility', desc: 'WCAG 2.2 AA · color contrast, focus order, screen-reader paths.', q: 'Can everyone actually use this product?', cost: 2 },
  { id: 'compliance', name: 'Compliance', desc: 'GDPR, CCPA, SOC-2 touchpoints · consent & data-handling flows.', q: 'Will this get us in legal trouble?', cost: 2 }
];
const PERSONA_TESTS = [
  { id: 'onboarding', name: 'Onboarding', desc: 'First 5 minutes · sign-up, setup, and time-to-value.', q: 'Where do new users drop off before they even start?', cost: 3 },
  { id: 'activation', name: 'Activation', desc: 'Path to the "aha" moment and first meaningful action.', q: 'Do users ever feel the "aha" — and how long does it take?', cost: 3 },
  { id: 'engagement', name: 'Engagement', desc: 'Core-loop friction · do users return to the key surface?', q: 'Is the core loop sticky enough to bring people back?', cost: 4 },
  { id: 'retention', name: 'Retention', desc: 'Day 7 & 30 behavior · churn signals and win-back triggers.', q: 'Why do users stop coming back after week one?', cost: 4 }
];

// Persona data — single Canva example powers every persona in the prototype.
const SYNTHESIS_BY_WEBSITE = {
  canva: {
    groups: [
      {
        id: 'c1',
        name: 'Solo Entrepreneur · E-commerce',
        estimated_share_pct: 35,
        demographics: {
          age_range: '28-40', education_level: "Bachelor's", occupation: 'E-commerce Owner',
          role_seniority: 'founder', company_size: 'solo', industry: 'Retail',
          geography: ['US', 'APAC'], primary_device: 'desktop', language: 'en'
        },
        narrative: {
          backstory: 'Running Etsy shop, needs social media graphics daily.',
          goals: ['Create pro visuals without design skills'],
          frustrations: ['Keeps re-uploading logo because brand kit is hidden']
        }
      },
      {
        id: 'c2',
        name: 'Marketing Manager · SMB',
        estimated_share_pct: 40,
        demographics: {
          age_range: '26-35', education_level: "Bachelor's", occupation: 'Marketing Manager',
          role_seniority: 'mid', company_size: '11-50', industry: 'Professional Services',
          geography: ['US', 'EU'], primary_device: 'desktop', language: 'en'
        },
        narrative: {
          backstory: 'One-person marketing team for a growing agency.',
          goals: ['Maintain brand consistency across channels'],
          frustrations: ['Brand kit discovered after creating 20+ designs']
        }
      },
      {
        id: 'c3',
        name: 'Social Media Creator',
        estimated_share_pct: 25,
        demographics: {
          age_range: '20-30', education_level: "Bachelor's", occupation: 'Content Creator',
          role_seniority: 'individual', company_size: 'solo', industry: 'Creator Economy',
          geography: ['US', 'LATAM'], primary_device: 'mobile', language: 'en'
        },
        narrative: {
          backstory: 'Instagram and TikTok creator with 50K followers.',
          goals: ['Fast, trendy content creation'],
          frustrations: ['Mobile app missing key desktop features']
        }
      }
    ],
    context_summary: {
      app_category: 'Design & Visual Content',
      stated_audience: 'Non-designers and small businesses',
      pricing_model: 'freemium',
      apparent_complexity: 'low'
    }
  }
};

// Mock backend payload — shape mirrors persona_synthesis/schema.py SynthesisResult.
const SYNTHESIS_RESULT = {
  groups: [
    {
      id: 'c1',
      name: 'Solo founder · SaaS',
      estimated_share_pct: 33.3,
      demographics: {
        age_range: '25-35', education_level: "Bachelor's", occupation: 'Founder',
        role_seniority: 'founder', company_size: 'solo', industry: 'Pre-seed SaaS',
        geography: ['US'], primary_device: 'desktop', language: 'en'
      },
      cognitive: {
        tech_savviness: 4, patience_threshold: 'medium', risk_tolerance: 'high',
        decision_style: 'analytical', learning_style: 'tinker', prior_saas_experience: 'moderate'
      },
      economic: { pricing_sensitivity: 4, budget_authority: 'self_serve', trial_vs_roi: 'trial_first' },
      testing_postures: {
        accessibility: { assistive_tech: [], vision: 'full', motor: 'full', hearing: 'full', screen_reader_likelihood: 5, dexterity_factors: null },
        compliance: { regulations: ['GDPR'], data_sensitivity: 'medium', enterprise_procurement: false },
        onboarding: { time_to_value_tolerance_minutes: 5, docs_vs_support: 'docs', self_serve_capability: 'high' },
        activation: { motivation_level: 'high', problem_urgency: 'high', aha_shape: 'See PMF signal' },
        engagement_retention: { expected_frequency: 'daily', habit_formation_likelihood: 'medium', switching_cost_tolerance: 'low', support_seeking: 'self' }
      },
      narrative: {
        backstory: 'Pre-seed founder iterating on a SaaS prototype.',
        goals: ['Find PMF signal'],
        frustrations: ['10 min setup feels long']
      }
    },
    {
      id: 'c2',
      name: 'Product-lead PM · Series B',
      estimated_share_pct: 33.3,
      demographics: {
        age_range: '30-45', education_level: "Master's", occupation: 'Product Manager',
        role_seniority: 'lead', company_size: '11-50', industry: 'B2B SaaS',
        geography: ['US', 'EU'], primary_device: 'desktop', language: 'en'
      },
      cognitive: {
        tech_savviness: 5, patience_threshold: 'high', risk_tolerance: 'medium',
        decision_style: 'analytical', learning_style: 'docs', prior_saas_experience: 'heavy'
      },
      economic: { pricing_sensitivity: 3, budget_authority: 'team_approval', trial_vs_roi: 'needs_roi_upfront' },
      testing_postures: {
        accessibility: { assistive_tech: [], vision: 'full', motor: 'full', hearing: 'full', screen_reader_likelihood: 2, dexterity_factors: null },
        compliance: { regulations: ['GDPR', 'SOC2'], data_sensitivity: 'high', enterprise_procurement: false },
        onboarding: { time_to_value_tolerance_minutes: 15, docs_vs_support: 'either', self_serve_capability: 'high' },
        activation: { motivation_level: 'medium', problem_urgency: 'medium', aha_shape: 'See team-wide value' },
        engagement_retention: { expected_frequency: 'weekly', habit_formation_likelihood: 'high', switching_cost_tolerance: 'medium', support_seeking: 'vendor' }
      },
      narrative: {
        backstory: 'Series B product lead managing a 40-person team.',
        goals: ['Reduce churn 12%'],
        frustrations: ['Buys tools on proof, not promises']
      }
    },
    {
      id: 'c3',
      name: 'Solo designer-developer',
      estimated_share_pct: 33.3,
      demographics: {
        age_range: '35-50', education_level: "Bachelor's", occupation: 'Designer-Developer',
        role_seniority: 'senior', company_size: 'solo', industry: 'Agency spin-out',
        geography: ['EU'], primary_device: 'desktop', language: 'en'
      },
      cognitive: {
        tech_savviness: 3, patience_threshold: 'low', risk_tolerance: 'medium',
        decision_style: 'mixed', learning_style: 'video', prior_saas_experience: 'light'
      },
      economic: { pricing_sensitivity: 5, budget_authority: 'self_serve', trial_vs_roi: 'trial_first' },
      testing_postures: {
        accessibility: { assistive_tech: [], vision: 'full', motor: 'full', hearing: 'full', screen_reader_likelihood: 8, dexterity_factors: null },
        compliance: { regulations: ['GDPR'], data_sensitivity: 'low', enterprise_procurement: false },
        onboarding: { time_to_value_tolerance_minutes: 8, docs_vs_support: 'docs', self_serve_capability: 'medium' },
        activation: { motivation_level: 'medium', problem_urgency: 'high', aha_shape: 'Ship MVP fast' },
        engagement_retention: { expected_frequency: 'ad_hoc', habit_formation_likelihood: 'low', switching_cost_tolerance: 'high', support_seeking: 'self' }
      },
      narrative: {
        backstory: 'Agency spin-out shipping client MVPs solo.',
        goals: ['Ship MVP by Q2'],
        frustrations: ['No budget for research ops']
      }
    }
  ],
  context_summary: {
    app_category: 'SaaS productivity',
    stated_audience: 'Early-stage founders and product teams',
    pricing_model: 'freemium',
    apparent_complexity: 'moderate',
    geography_signals: ['US', 'EU'],
    industry_signals: ['SaaS'],
    uploaded_research: [],
    raw_notes: ''
  }
};

function StudioTabs({ step, personaDone, testsPicked, simDone, onStep }) {
  const tabs = [
    { n: 1, label: 'Persona Groups', enabled: true, done: personaDone },
    { n: 2, label: 'Tests', enabled: personaDone, done: testsPicked },
    { n: 3, label: 'Simulation', enabled: testsPicked, done: simDone }
  ];
  return React.createElement('div', { className: 'studio-tabs' },
    tabs.map(t =>
      React.createElement('button', {
        key: t.n,
        className: 'studio-tab' + (step === t.n ? ' active' : '') + (t.done && step !== t.n ? ' done' : '') + (!t.enabled ? ' locked' : ''),
        disabled: !t.enabled,
        onClick: () => t.enabled && onStep(t.n)
      },
        React.createElement('span', { className: 'studio-tab-num' },
          t.done && step !== t.n ? React.createElement(IconCheck) : t.n
        ),
        t.label
      )
    )
  );
}

// Persona group avatar — stylized SVG silhouette of three overlapping people,
// signaling that each card represents a cluster (group) of users, not an individual.
const Avatar = ({ seed }) => {
  const palettes = [
    { bg: 'var(--terra-tint)', back: '#c26a43', mid: '#3d1700', front: '#8a3a1a' },
    { bg: '#e6cfb0', back: '#8a5a30', mid: '#1a0a00', front: '#4a2410' },
    { bg: '#efe3d4', back: '#c98b38', mid: '#6b3410', front: '#9a5a28' }
  ];
  const v = palettes[seed % 3];

  return React.createElement('svg', { viewBox: '0 0 100 100', width: 44, height: 44 },
    React.createElement('rect', { width: 100, height: 100, rx: 50, fill: v.bg }),

    // back-left person (smallest, deepest)
    React.createElement('g', { fill: v.back, opacity: 0.85 },
      React.createElement('circle', { cx: 26, cy: 44, r: 11 }),
      React.createElement('path', { d: 'M6 92 Q6 70 26 66 Q46 70 46 92 Z' })
    ),
    // back-right person
    React.createElement('g', { fill: v.back, opacity: 0.85 },
      React.createElement('circle', { cx: 74, cy: 44, r: 11 }),
      React.createElement('path', { d: 'M54 92 Q54 70 74 66 Q94 70 94 92 Z' })
    ),
    // front-center person (prominent)
    React.createElement('g', { fill: v.front },
      React.createElement('path', { d: 'M22 100 Q22 70 50 64 Q78 70 78 100 Z' }),
      React.createElement('circle', { cx: 50, cy: 44, r: 15, fill: v.front })
    ),
    // subtle highlight on front face to lift it
    React.createElement('ellipse', { cx: 50, cy: 40, rx: 11, ry: 12, fill: v.mid, opacity: 0.18 })
  );
};

function PersonaTab({ personaDone, onDone, onContinue, selectedWebsite }) {
  const [phase, setPhase] = uS3(personaDone ? 'done' : 'idle');
  const dots = uM3(() =>
    Array.from({ length: 36 }, () => ({
      sx: (Math.random() - 0.5) * 260 + 'px',
      sy: (Math.random() - 0.5) * 160 + 'px',
      delay: Math.random() * 0.8
    })), []);

  const generate = () => {
    setPhase('generating');
    setTimeout(() => { setPhase('done'); onDone(); }, 3200);
  };

  // Single Canva sample drives every persona — fall back to it whenever a
  // caller doesn't pass an explicit website key.
  const synthesisData = SYNTHESIS_BY_WEBSITE[selectedWebsite] || SYNTHESIS_BY_WEBSITE.canva;
  
  // Derive display fields from the backend PersonaGroup shape.
  const personas = synthesisData.groups.map((g, i) => ({
    seed: i,
    id: g.id,
    name: g.name,
    role: `${g.demographics.occupation} · ${g.demographics.industry || g.demographics.company_size}`,
    attrs: [
      ['age', g.demographics.age_range],
      ['context', g.demographics.industry || g.demographics.company_size],
      ['goal', g.narrative.goals[0] || ''],
      ['blocker', g.narrative.frustrations[0] || '']
    ]
  }));

  return React.createElement(React.Fragment, null,
    React.createElement('div', { className: 'panel-body' },
    React.createElement('div', { className: 'persona-stage' + (phase === 'generating' ? ' generating' : '') + (phase === 'done' ? ' done' : '') },
      phase !== 'done' && React.createElement('div', { className: 'orbit' },
        dots.map((d, i) =>
          React.createElement('div', {
            key: i,
            className: 'dot' + (i % 4 === 0 ? ' quote' : ''),
            style: {
              '--sx': d.sx, '--sy': d.sy,
              left: '50%', top: '50%',
              animationDelay: `${d.delay}s`
            }
          })
        )
      ),
      phase !== 'done' && React.createElement('div', { className: 'core' }),

      phase === 'idle' && React.createElement('div', {
        style: { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', padding: 20 }
      },
        React.createElement('div', null,
          React.createElement('div', { style: { fontFamily: 'Montserrat', fontSize: 18, fontWeight: 600, marginBottom: 4 } }, 'Ready to synthesize'),
          React.createElement('div', { style: { fontSize: 11.5, color: 'var(--ink-60)' } }, 'Grounded in your files + chat')
        )
      ),
      phase === 'generating' && React.createElement('div', {
        style: { position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontFamily: 'Montserrat', fontSize: 11, color: 'var(--ink-60)' }
      }, 'synthesizing traits · clustering signals · grounding'),
      phase === 'done' && React.createElement('div', { className: 'persona-cluster-done' },
        personas.map((p) =>
          React.createElement('div', { key: p.id, className: 'persona-cluster-chip' },
            React.createElement(Avatar, { seed: p.seed }),
            React.createElement('div', { className: 'persona-cluster-name' }, p.name)
          )
        )
      )
    ),

    phase === 'idle' && React.createElement('button', {
      className: 'btn-primary', style: { width: '100%' }, onClick: generate
    },
      React.createElement(IconSparkle, { width: 14, height: 14 }),
      'Generate Persona Groups'
    ),

    phase === 'done' && personas.map((p, i) =>
      React.createElement('div', { key: p.name, className: `persona-card delay-${i + 1}` },
        React.createElement('div', { className: 'persona-head' },
          React.createElement(Avatar, { seed: p.seed }),
          React.createElement('div', null,
            React.createElement('div', { className: 'persona-name' }, p.name),
            React.createElement('div', { className: 'persona-role' }, p.role)
          )
        ),
        React.createElement('dl', { className: 'persona-attrs' },
          p.attrs.flatMap(([k, v]) => [
            React.createElement('div', { key: k },
              React.createElement('dt', null, k),
              React.createElement('dd', null, v)
            )
          ])
        )
      )
    )
    ),
    phase === 'done' && React.createElement('div', { className: 'panel-actions' },
      React.createElement('button', {
        className: 'btn-primary',
        onClick: onContinue,
        style: { flex: 'none', padding: '10px 16px' }
      },
        'Continue to tests',
        React.createElement(IconArrow, { width: 14, height: 14 })
      )
    )
  );
}

function TestsTab({ selected, setSelected, onContinue }) {
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const total = [...UNIVERSAL_TESTS, ...PERSONA_TESTS].filter(t => selected.includes(t.id)).reduce((a, b) => a + b.cost, 0);

  const renderCard = (t) =>
    React.createElement('button', {
      key: t.id,
      className: 'test-card' + (selected.includes(t.id) ? ' selected' : ''),
      onClick: () => toggle(t.id)
    },
      React.createElement('div', { className: 'test-check' }, React.createElement(IconCheck)),
      React.createElement('div', { className: 'test-body' },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 } },
          React.createElement('div', { className: 'test-name' }, t.name),
          React.createElement('span', { className: 'test-cost' }, `${t.cost}k tk`)
        ),
        React.createElement('div', { className: 'test-desc' }, t.desc),
        React.createElement('div', { className: 'test-q' }, t.q)
      )
    );

  return React.createElement(React.Fragment, null,
    React.createElement('div', { className: 'panel-body' },
      React.createElement('div', { className: 'tests-group' },
        React.createElement('div', { className: 'tests-label' }, 'Universal Tests'),
        React.createElement('div', { className: 'tests-grid' },
          UNIVERSAL_TESTS.map(renderCard)
        )
      ),
      React.createElement('div', { className: 'tests-group' },
        React.createElement('div', { className: 'tests-label' }, 'Persona-Specific'),
        React.createElement('div', { className: 'tests-grid' },
          PERSONA_TESTS.map(renderCard)
        )
      )
    ),
    React.createElement('div', { className: 'panel-actions' },
      React.createElement('div', { style: { fontSize: 11.5, color: 'var(--ink-60)' } },
        selected.length, ' picked · ',
        React.createElement('strong', { style: { color: 'var(--terra)' } }, `${total}k tokens`)
      ),
      React.createElement('button', {
        className: 'btn-primary',
        disabled: selected.length === 0,
        onClick: onContinue,
        style: { flex: 'none', padding: '10px 16px' }
      },
        'Continue',
        React.createElement(IconArrow, { width: 14, height: 14 })
      )
    )
  );
}

const makeSimSteps = (count) => [
  `spinning up ${count} synthetic personas…`,
  'seeding behavioral priors from context…',
  'simulating onboarding paths…',
  'logging friction events & drop-offs…',
  'harvesting verbatim quotes…',
  'scoring & clustering findings…',
  'drafting recommendations…'
];

function SimulationTab({ selected, onDone, simPhase, setSimPhase, tokensUsed, selectedWebsite }) {
  const allTests = [...UNIVERSAL_TESTS, ...PERSONA_TESTS].filter(t => selected.includes(t.id));
  const simResult = window.getSimResult ? window.getSimResult(selectedWebsite || 'canva') : SIM_RESULT;
  const totalAgents = simResult.report.metrics.total_agents;
  const SIM_STEPS = makeSimSteps(totalAgents);
  const [progress, setProgress] = uS3(0);
  const [stepIdx, setStepIdx] = uS3(0);

  uE3(() => {
    if (simPhase !== 'running') return;
    const start = Date.now();
    const dur = 4500;
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / dur);
      setProgress(p * 100);
      setStepIdx(Math.min(SIM_STEPS.length - 1, Math.floor(p * SIM_STEPS.length)));
      if (p >= 1) {
        clearInterval(id);
        setTimeout(() => { setSimPhase('done'); onDone(); }, 400);
      }
    }, 60);
    return () => clearInterval(id);
  }, [simPhase]);

  if (simPhase === 'confirm') {
    return React.createElement(React.Fragment, null,
      React.createElement('div', { className: 'panel-body' },
        React.createElement('div', { className: 'sim-confirm' },
          React.createElement('div', { className: 'sim-confirm-head' },
            React.createElement('div', { className: 'sim-confirm-title' }, 'Confirm simulation'),
            React.createElement('div', { className: 'sim-confirm-sub' },
              "Running this will charge your token balance and spin up the simulation. You'll see scored results here when it's done (usually < 3 min)."
            )
          ),
          React.createElement('div', { className: 'sim-confirm-grid' },
            React.createElement('div', { className: 'sim-summary' },
              React.createElement('div', { className: 'sim-summary-label' }, 'Selected tests'),
              allTests.map(t =>
                React.createElement('div', { key: t.id, className: 'sim-row' },
                  React.createElement('span', { className: 'k' }, t.name),
                  React.createElement('span', { className: 'v' }, `${t.cost}k tk`)
                )
              )
            ),
            React.createElement('div', { className: 'sim-stats' },
              React.createElement('div', { className: 'sim-stat' },
                React.createElement('div', { className: 'sim-stat-label' }, 'Personas'),
                React.createElement('div', { className: 'sim-stat-value' }, totalAgents),
                React.createElement('div', { className: 'sim-stat-sub' }, 'synthetic agents')
              ),
              React.createElement('div', { className: 'sim-stat' },
                React.createElement('div', { className: 'sim-stat-label' }, 'Tests'),
                React.createElement('div', { className: 'sim-stat-value' }, allTests.length),
                React.createElement('div', { className: 'sim-stat-sub' }, 'selected')
              ),
              React.createElement('div', { className: 'sim-stat total' },
                React.createElement('div', { className: 'sim-stat-label' }, 'Total cost'),
                React.createElement('div', { className: 'sim-stat-value' }, `${tokensUsed}k`),
                React.createElement('div', { className: 'sim-stat-sub' }, 'tokens')
              )
            )
          )
        )
      ),
      React.createElement('div', { className: 'panel-actions' },
        React.createElement('button', { className: 'btn-secondary', onClick: () => setSimPhase('cancel') }, 'Back'),
        React.createElement('button', { className: 'btn-primary', onClick: () => setSimPhase('running') },
          React.createElement(IconPlay, { width: 12, height: 12 }),
          `Run simulation · ${tokensUsed}k tk`
        )
      )
    );
  }

  if (simPhase === 'running') {
    return React.createElement('div', { className: 'panel-body' },
      React.createElement('div', { className: 'sim-stage' },
        React.createElement('div', { className: 'sim-globe' },
          React.createElement('svg', { viewBox: '0 0 200 200' },
            [80, 60, 40].map((r, i) =>
              React.createElement('circle', { key: i, cx: 100, cy: 100, r, className: 'sim-ring', style: { opacity: 0.2 + i * 0.15 } })
            ),
            Array.from({ length: 40 }).map((_, i) => {
              const a = (i / 40) * Math.PI * 2 + progress / 30;
              const rr = 30 + ((i * 13) % 55);
              return React.createElement('circle', {
                key: i,
                cx: 100 + Math.cos(a) * rr,
                cy: 100 + Math.sin(a) * rr,
                r: 2 + (i % 3),
                className: 'sim-particle',
                style: { opacity: 0.4 + ((i * 7) % 6) / 10 }
              });
            }),
            React.createElement('circle', { cx: 100, cy: 100, r: 18, fill: 'var(--terra)', style: { opacity: 0.9 } })
          )
        ),
        React.createElement('h3', null, 'Running simulation'),
        React.createElement('p', null, `${totalAgents} personas · `, allTests.length, ' tests'),
        React.createElement('div', { className: 'sim-bar-wrap' },
          React.createElement('div', { className: 'sim-bar', style: { width: `${progress}%` } })
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: 6 } },
          React.createElement('div', { className: 'sim-step' }, SIM_STEPS[stepIdx]),
          React.createElement('div', { className: 'sim-pct' }, `${Math.round(progress)}%`)
        )
      )
    );
  }

  // done — results
  return React.createElement('div', { className: 'panel-body' },
    React.createElement('div', { className: 'results-head' },
      React.createElement('div', null,
        React.createElement('div', { className: 'results-title' }, 'Results'),
        React.createElement('div', { className: 'results-sub' },
          `${allTests.length} test${allTests.length === 1 ? '' : 's'} · ${totalAgents} personas · tap any card to open the full report`
        )
      )
    ),
    React.createElement('button', {
      className: 'result-btn result-btn-summary',
      onClick: () => window.__openReport('__summary')
    },
      React.createElement('div', { className: 'result-score result-score-summary' }, '↗'),
      React.createElement('div', { className: 'result-body' },
        React.createElement('div', { className: 'result-name' }, 'Executive Summary'),
        React.createElement('div', { className: 'result-meta' }, 'Cross-test overview · all clusters')
      ),
      React.createElement('div', { className: 'result-arrow' },
        React.createElement(IconArrow, { width: 18, height: 18 })
      )
    ),
    React.createElement('div', { className: 'results-grid' },
      allTests.map((t) => {
        const tt = REPORT.test_type_reports.find(r => r.test_type === t.id);
        const confBg = tt.data_confidence === 'high' ? '#23a66c'
                     : tt.data_confidence === 'medium' ? '#c98b38'
                     : '#b8412b';
        return React.createElement('button', {
          key: t.id,
          className: 'result-btn',
          onClick: () => window.__openReport(t.id)
        },
          React.createElement('div', {
            className: 'result-score',
            style: { background: confBg }
          }, tt.data_confidence),
          React.createElement('div', { className: 'result-body' },
            React.createElement('div', { className: 'result-name' }, t.name),
            React.createElement('div', { className: 'result-meta' }, `${tt.recommended_fixes.length} recommended fixes`)
          ),
          React.createElement('div', { className: 'result-arrow' },
            React.createElement(IconArrow, { width: 16, height: 16 })
          )
        );
      })
    )
  );
}

function Studio({ state, dispatch, selectedWebsite }) {
  const { step, personaDone, selected, simPhase } = state;
  const tokensUsed = [...UNIVERSAL_TESTS, ...PERSONA_TESTS].filter(t => selected.includes(t.id)).reduce((a, b) => a + b.cost, 0);

  return React.createElement('section', { className: 'panel enter-3' },
    React.createElement('div', { className: 'panel-head', style: { padding: '14px 20px 10px' } },
      React.createElement('div', { className: 'panel-title' },
        React.createElement(IconTarget, { width: 18, height: 18, style: { color: 'var(--terra)' } }),
        'Studio Space'
      ),
    ),
    React.createElement(StudioTabs, {
      step, personaDone,
      testsPicked: selected.length > 0 && (simPhase === 'done' || step >= 3),
      simDone: simPhase === 'done',
      onStep: (n) => dispatch({ type: 'setStep', step: n })
    }),
    step === 1 && React.createElement(PersonaTab, {
      personaDone,
      onDone: () => dispatch({ type: 'personaDone' }),
      onContinue: () => dispatch({ type: 'setStep', step: 2 }),
      selectedWebsite
    }),
    step === 2 && React.createElement(TestsTab, {
      selected,
      setSelected: (fn) => dispatch({ type: 'setSelected', selected: typeof fn === 'function' ? fn(selected) : fn }),
      onContinue: () => dispatch({ type: 'goSim' })
    }),
    step === 3 && React.createElement(SimulationTab, {
      selected,
      tokensUsed,
      simPhase,
      setSimPhase: (p) => dispatch({ type: 'setSimPhase', simPhase: p }),
      onDone: () => dispatch({ type: 'simDone' }),
      selectedWebsite
    })
  );
}

window.Studio = Studio;
window.UNIVERSAL_TESTS = UNIVERSAL_TESTS;
window.PERSONA_TESTS = PERSONA_TESTS;
window.SYNTHESIS_BY_WEBSITE = SYNTHESIS_BY_WEBSITE;
