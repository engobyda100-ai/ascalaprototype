/* global React */
const { useState, useRef } = React;

const fmtSize = (bytes) => {
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Trim a long URL to a compact host/path display for the topbar chip.
const formatUrlForChip = (url) => {
  if (!url) return 'No prototype set';
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    const path = u.pathname && u.pathname !== '/' ? u.pathname : '';
    const display = `${host}${path}`;
    return display.length > 26 ? display.slice(0, 25) + '…' : display;
  } catch (e) {
    return url.length > 26 ? url.slice(0, 25) + '…' : url;
  }
};

function TopBar({
  onToggleTheme, dark, tokens,
  productUrl, contextCount,
  onChangePrototype, onAddContext
}) {
  return React.createElement('header', { className: 'topbar enter' },
    React.createElement('div', { className: 'topbar-left' },
      React.createElement('img', { src: 'assets/logo.png', alt: 'Ascala', className: 'topbar-logo' }),
      React.createElement('div', { className: 'topbar-project' },
        React.createElement('strong', null, 'Canva UX Testing'), ' · draft'
      )
    ),

    (onChangePrototype || onAddContext) && React.createElement('div', { className: 'topbar-center' },
      onChangePrototype && React.createElement('button', {
        className: 'tb-info-chip',
        onClick: onChangePrototype,
        title: productUrl || 'Set prototype URL'
      },
        React.createElement(IconLink, { width: 13, height: 13, className: 'tb-info-icon' }),
        React.createElement('span', { className: 'tb-info-value' }, formatUrlForChip(productUrl)),
        React.createElement('span', { className: 'tb-info-action' }, 'Change')
      ),
      onAddContext && React.createElement('button', {
        className: 'tb-info-chip',
        onClick: onAddContext,
        title: `${contextCount || 0} context file${contextCount === 1 ? '' : 's'} attached`
      },
        React.createElement(IconFile, { width: 13, height: 13, className: 'tb-info-icon' }),
        React.createElement('span', { className: 'tb-info-value' },
          `${contextCount || 0} context file${contextCount === 1 ? '' : 's'}`
        ),
        React.createElement('span', { className: 'tb-info-action' }, '+ Add')
      )
    ),

    React.createElement('div', { className: 'topbar-right' },
      React.createElement('button', { className: 'tb-btn icon-only', onClick: onToggleTheme, title: dark ? 'Light mode' : 'Dark mode' },
        React.createElement(dark ? IconSun : IconMoon, { width: 14, height: 14 })
      ),
      React.createElement('button', { className: 'tb-btn' },
        React.createElement(IconShare, { width: 14, height: 14 }),
        'Share'
      ),
      React.createElement('button', { className: 'tb-btn' },
        React.createElement(IconSettings, { width: 14, height: 14 }),
        'Settings'
      ),
      React.createElement('button', { className: 'tb-btn tokens' },
        React.createElement(IconCoin, { width: 14, height: 14 }),
        'Tokens ', `${tokens}k`
      ),
      React.createElement('button', { className: 'tb-btn icon-only', style: { paddingLeft: 4, paddingRight: 4 } },
        React.createElement('div', { className: 'tb-avatar' }, 'JD')
      )
    )
  );
}

// Suggested context files for the Canva sample project — used as quick-pick chips.
const CANVA_SUGGESTED_FILES = [
  { name: 'canva-designer-research.pdf', size: '2.8 MB' },
  { name: 'smb-marketing-needs-analysis.pdf', size: '1.4 MB' },
  { name: 'template-usage-analytics.csv', size: '340 KB' },
  { name: 'canva-brand-identity-guidelines.pdf', size: '4.1 MB' }
];

function Onboarding({
  productUrl, setProductUrl,
  files, setFiles,
  screenshots, setScreenshots,
  videos, setVideos,
  onContinue,
  focusSection
}) {
  const [agentOpen, setAgentOpen] = useState(false);
  const [productMode, setProductMode] = useState('url');
  const shotInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const contextInputRef = useRef(null);
  const productSectionRef = useRef(null);
  const contextSectionRef = useRef(null);
  const urlInputRef = useRef(null);

  React.useEffect(() => {
    if (!focusSection) return;
    const target = focusSection === 'context' ? contextSectionRef.current : productSectionRef.current;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add('section-focus-flash');
      const t = setTimeout(() => target.classList.remove('section-focus-flash'), 1200);
      if (focusSection === 'url' && urlInputRef.current) {
        urlInputRef.current.focus();
      }
      return () => clearTimeout(t);
    }
  }, [focusSection]);

  const handleShotFiles = (e) => {
    const items = Array.from(e.target.files).map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      url: URL.createObjectURL(f),
      size: fmtSize(f.size)
    }));
    setScreenshots(s => [...s, ...items]);
    e.target.value = '';
  };

  const handleVideoFiles = (e) => {
    const items = Array.from(e.target.files).map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: fmtSize(f.size)
    }));
    setVideos(v => [...v, ...items]);
    e.target.value = '';
  };

  const handleContextFiles = (e) => {
    const items = Array.from(e.target.files).map(f => ({
      id: Date.now() + Math.random(),
      name: f.name,
      size: fmtSize(f.size)
    }));
    setFiles(fs => [...fs, ...items]);
    e.target.value = '';
  };

  const addSuggested = (f) => {
    if (files.some(x => x.name === f.name)) return;
    setFiles(fs => [...fs, { ...f, id: Date.now() + Math.random() }]);
  };

  const hasProduct = Boolean((productUrl && productUrl.trim()) || screenshots.length > 0 || videos.length > 0);
  const canContinue = hasProduct;

  return React.createElement('div', { className: 'onboarding-page' },
    React.createElement('div', { className: 'onboarding-card enter-1' },
      React.createElement('div', { className: 'onboarding-head' },
        React.createElement('div', { className: 'onboarding-eyebrow' },
          React.createElement(IconFlask, { width: 14, height: 14, style: { color: 'var(--terra)' } }),
          'New project'
        ),
        React.createElement('h1', { className: 'onboarding-title' }, 'Tell us about your product'),
        React.createElement('p', { className: 'onboarding-sub' },
          "Drop a link, screenshots or video — then any context that shapes who you serve. We'll use this to ground every persona and test."
        )
      ),

      // Section 1 — Product
      React.createElement('div', { className: 'onboarding-section', ref: productSectionRef },
        React.createElement('div', { className: 'section-head' },
          React.createElement('div', { className: 'section-title' }, '01 · Product / Prototype'),
        ),
        React.createElement('div', { className: 'toggle-row' },
          React.createElement('button', { className: 'toggle-btn' + (productMode === 'url' ? ' active' : ''), onClick: () => setProductMode('url') },
            React.createElement(IconLink, null), 'URL'),
          React.createElement('button', { className: 'toggle-btn' + (productMode === 'images' ? ' active' : ''), onClick: () => setProductMode('images') },
            React.createElement(IconImage, null), 'Shots'),
          React.createElement('button', { className: 'toggle-btn' + (productMode === 'video' ? ' active' : ''), onClick: () => setProductMode('video') },
            React.createElement(IconVideo, null), 'Video')
        ),

        productMode === 'url' && React.createElement('div', null,
          React.createElement('div', { className: 'url-input-row' },
            React.createElement('div', { className: 'url-input-wrap' },
              React.createElement(IconLink, { className: 'url-input-icon' }),
              React.createElement('input', {
                type: 'url',
                ref: urlInputRef,
                className: 'url-input',
                placeholder: 'https://your-product.com',
                value: productUrl,
                onChange: (e) => setProductUrl(e.target.value)
              })
            )
          ),
          React.createElement('div', { className: 'onboarding-hint' },
            'Paste the live URL of your product or prototype. We pre-filled Canva as the demo example — feel free to keep it.'
          )
        ),

        productMode === 'images' && React.createElement('div', null,
          React.createElement('input', {
            type: 'file', accept: 'image/*', multiple: true,
            ref: shotInputRef, style: { display: 'none' },
            onChange: handleShotFiles
          }),
          screenshots.length === 0
            ? React.createElement('div', { className: 'dropzone', onClick: () => shotInputRef.current.click() },
                React.createElement(IconImage, null),
                React.createElement('strong', null, 'Drop screenshots or click'),
                React.createElement('span', null, 'PNG, JPG · up to 20 files')
              )
            : React.createElement('div', { className: 'shot-strip' },
                screenshots.map(s =>
                  React.createElement('div', { key: s.id, className: 'shot-thumb' },
                    React.createElement('img', { src: s.url, alt: s.name, draggable: false }),
                    React.createElement('button', { className: 'shot-del', onClick: () => setScreenshots(ss => ss.filter(x => x.id !== s.id)) },
                      React.createElement(IconX, { width: 8, height: 8 })
                    )
                  )
                ),
                React.createElement('button', { className: 'shot-add', onClick: () => shotInputRef.current.click() },
                  React.createElement(IconImage, { width: 16, height: 16 }),
                  'Add'
                )
              )
        ),

        productMode === 'video' && React.createElement('div', null,
          React.createElement('input', {
            type: 'file', accept: 'video/*',
            ref: videoInputRef, style: { display: 'none' },
            onChange: handleVideoFiles
          }),
          React.createElement('div', { className: 'dropzone', onClick: () => videoInputRef.current.click() },
            React.createElement(IconVideo, null),
            React.createElement('strong', null, 'Drop a walkthrough video'),
            React.createElement('span', null, 'MP4, MOV · up to 200 MB')
          ),
          videos.map(v =>
            React.createElement('div', { key: v.id, className: 'file-chip' },
              React.createElement(IconVideo, null),
              React.createElement('span', { className: 'fname' }, v.name),
              React.createElement('span', { className: 'fsize' }, v.size),
              React.createElement('button', { className: 'chip-del', onClick: () => setVideos(vs => vs.filter(x => x.id !== v.id)) },
                React.createElement(IconX, { width: 9, height: 9 })
              )
            )
          )
        )
      ),

      // Section 2 — Context Files
      React.createElement('div', { className: 'onboarding-section', ref: contextSectionRef },
        React.createElement('div', { className: 'section-head' },
          React.createElement('div', { className: 'section-title' }, '02 · Context Files'),
          React.createElement('span', { className: 'section-note' }, `${files.length} added`)
        ),
        React.createElement('div', { className: 'section-desc' },
          'PRDs, user research, brand guidelines — anything that shapes who you serve.'),
        React.createElement('input', {
          type: 'file', multiple: true,
          accept: '.pdf,.doc,.docx,.md,.txt,.csv,.xlsx',
          ref: contextInputRef, style: { display: 'none' },
          onChange: handleContextFiles
        }),
        React.createElement('div', { className: 'dropzone', onClick: () => contextInputRef.current.click() },
          React.createElement(IconUpload, null),
          React.createElement('strong', null, 'Upload context'),
          React.createElement('span', null, 'PDF, DOCX, MD, TXT')
        ),
        files.length > 0 && React.createElement('div', { className: 'file-chip-list' },
          files.map(f =>
            React.createElement('div', { key: f.id, className: 'file-chip' },
              React.createElement(IconFile, null),
              React.createElement('span', { className: 'fname' }, f.name),
              React.createElement('span', { className: 'fsize' }, f.size),
              React.createElement('button', { className: 'chip-del', onClick: () => setFiles(fs => fs.filter(x => x.id !== f.id)) },
                React.createElement(IconX, { width: 9, height: 9 })
              )
            )
          )
        ),
        React.createElement('div', { className: 'suggested-files' },
          React.createElement('div', { className: 'suggested-label' }, 'Or try sample Canva context:'),
          React.createElement('div', { className: 'suggested-row' },
            CANVA_SUGGESTED_FILES.map((f, i) =>
              React.createElement('button', {
                key: i,
                className: 'suggested-chip' + (files.some(x => x.name === f.name) ? ' added' : ''),
                onClick: () => addSuggested(f),
                disabled: files.some(x => x.name === f.name)
              },
                React.createElement(IconFile, { width: 12, height: 12 }),
                f.name
              )
            )
          )
        )
      ),

      // Section 3 — Coding Agent (collapsed)
      React.createElement('div', { className: 'agent-dropdown' + (agentOpen ? ' open' : '') },
        React.createElement('button', {
          className: 'agent-dropdown-head',
          onClick: () => setAgentOpen(o => !o)
        },
          React.createElement('div', { className: 'agent-dd-left' },
            React.createElement(IconTerminal, { width: 14, height: 14 }),
            React.createElement('span', { className: 'agent-dd-title' }, '03 · Connect Coding Agent'),
            React.createElement('span', { className: 'soon-pill sm' }, 'soon')
          ),
          React.createElement('span', {
            className: 'agent-dd-chev',
            style: { transform: agentOpen ? 'rotate(-90deg)' : 'rotate(90deg)' }
          }, React.createElement(IconArrow, { width: 12, height: 12 }))
        ),
        agentOpen && React.createElement('div', { className: 'agent-dropdown-body' },
          React.createElement('div', { className: 'agent-grid' },
            [1, 2, 3, 4].map(n =>
              React.createElement('div', { key: n, className: 'agent-card' },
                React.createElement('img', { src: `assets/api${n}.png`, alt: `Agent ${n}` }),
                React.createElement('span', { className: 'aname' },
                  ['Claude Code', 'Cursor', 'Figma', 'Replit'][n - 1]
                )
              )
            )
          ),
          React.createElement('div', { style: { textAlign: 'center', marginTop: 10, fontSize: 10.5, color: 'var(--ink-40)' } },
            'In beta · shipping Q3 \'26')
        )
      ),

      React.createElement('div', { className: 'onboarding-actions' },
        React.createElement('div', { className: 'onboarding-status' },
          canContinue
            ? React.createElement(React.Fragment, null,
                React.createElement('span', { className: 'status-dot ready' }),
                'Ready to start'
              )
            : React.createElement(React.Fragment, null,
                React.createElement('span', { className: 'status-dot' }),
                'Add a URL, screenshot or video to continue'
              )
        ),
        React.createElement('button', {
          className: 'btn-primary onboarding-cta',
          disabled: !canContinue,
          onClick: onContinue
        },
          'Continue to studio',
          React.createElement(IconArrow, { width: 14, height: 14 })
        )
      )
    )
  );
}

window.TopBar = TopBar;
window.Onboarding = Onboarding;
