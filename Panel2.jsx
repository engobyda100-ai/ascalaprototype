/* global React */
const { useState: useS2, useRef: useR2, useEffect: useE2 } = React;

// Generic, rotating coach replies. Not connected to a real LLM — the chat
// simply cycles through these to give the prototype a believable feel.
const GENERIC_REPLIES = [
  {
    text: "Got it. To help me reason about this, who's the primary user you have in mind? Roughly: their role, the context they're using your product in, and one thing they're struggling with today.",
    suggestions: ["Early-stage founders", "Enterprise PMs", "Casual consumers"]
  },
  {
    text: "Helpful. What's the single riskiest assumption baked into this product right now? The one that, if wrong, would send the whole thing sideways.",
    suggestions: ["Users will discover the value", "They'll pay for it", "They'll come back"]
  },
  {
    text: "Good. I'll fold that into the persona generation on the right. Two quick ones: (1) what's the first moment a user should feel 'aha!' — and (2) how do you currently know they've felt it?",
    suggestions: ["Walk me through it", "I'm not sure yet", "Let me think…"]
  },
  {
    text: "Makes sense. What's the workflow you're most worried about — onboarding, the core loop, or paid conversion?",
    suggestions: ["Onboarding drop-off", "Core-loop retention", "Conversion friction"]
  },
  {
    text: "Noted. Anything we should explicitly NOT test for in the first pass? Some teams skip accessibility on day one — others won't ship without it.",
    suggestions: ["Skip nothing", "Defer compliance", "Defer accessibility"]
  },
  {
    text: "Perfect — I have enough to start. Head to the Studio on the right and hit 'Generate Persona'. We'll build 3 synthetic users grounded in what you've told me, then you can pick tests to run against your prototype.",
    suggestions: ["Generate persona now →"]
  }
];

const INITIAL_MESSAGE = {
  role: 'bot',
  text: "Hi — I'm Ascala. Most products don't fail after launch, they fail before it. Tell me what you're building and who it's for, and I'll help you frame tests against your real audience. When you're ready, head to the Studio to spin up personas and simulate the experience.",
  suggestions: ["I'm validating a new product", "Help me pick tests", "What should I upload?"]
};

function Chat({ onMessageSent }) {
  const [messages, setMessages] = useS2([INITIAL_MESSAGE]);
  const [draft, setDraft] = useS2('');
  const [recording, setRecording] = useS2(false);
  const [typing, setTyping] = useS2(false);
  const scrollRef = useR2(null);
  const turnRef = useR2(0);

  useE2(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: 'user', text: text.trim() }]);
    setDraft('');
    onMessageSent?.();
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const reply = GENERIC_REPLIES[turnRef.current % GENERIC_REPLIES.length];
      turnRef.current += 1;
      setMessages(m => [...m, { role: 'bot', text: reply.text, suggestions: reply.suggestions }]);
    }, 900 + Math.random() * 500);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(draft); }
  };

  const toggleRecord = () => {
    setRecording(r => !r);
    if (!recording) {
      setTimeout(() => {
        setRecording(false);
        setDraft(d => d + (d ? ' ' : '') + "Our target is early-stage founders validating a B2B tool.");
      }, 1800);
    }
  };

  return React.createElement('section', { className: 'panel enter-2' },
    React.createElement('div', { className: 'chat-head' },
      React.createElement('div', { className: 'chat-head-l' },
        React.createElement('div', { className: 'chat-sigil' },
          React.createElement('img', { src: 'assets/icon.png', alt: 'Ascala', style: { width: '100%', height: '100%', objectFit: 'contain' } })
        ),
        React.createElement('div', null,
          React.createElement('div', { className: 'chat-title' }, 'Ascala Intelligence'),
          React.createElement('div', { className: 'chat-status' }, 'Coaching · discovery mode')
        )
      ),
      React.createElement('div', { className: 'chat-mode' }, 'Model: ascala-v2')
    ),

    React.createElement('div', { className: 'chat-scroll', ref: scrollRef },
      messages.map((m, i) =>
        React.createElement('div', { key: i, className: `msg ${m.role}` },
          React.createElement('div', { className: 'msg-avatar' }, m.role === 'bot' ? 'A' : 'JD'),
          React.createElement('div', { style: { minWidth: 0 } },
            React.createElement('div', { className: 'msg-bubble' },
              m.text.split('\n').map((line, k) => React.createElement('p', { key: k }, line))
            ),
            m.role === 'bot' && m.suggestions && React.createElement('div', { className: 'sugg-row' },
              m.suggestions.map((s, k) =>
                React.createElement('button', {
                  key: k, className: 'sugg-chip',
                  onClick: () => sendMessage(s)
                }, s)
              )
            )
          )
        )
      ),
      typing && React.createElement('div', { className: 'msg bot' },
        React.createElement('div', { className: 'msg-avatar' }, 'A'),
        React.createElement('div', { className: 'msg-bubble' },
          React.createElement('div', { className: 'typing' },
            React.createElement('span'), React.createElement('span'), React.createElement('span')
          )
        )
      )
    ),

    React.createElement('div', { className: 'chat-input-wrap' },
      React.createElement('div', { className: 'chat-input' },
        React.createElement('textarea', {
          placeholder: 'Message Ascala…',
          rows: 1,
          value: draft,
          onChange: (e) => setDraft(e.target.value),
          onKeyDown: onKey
        }),
        React.createElement('button', {
          className: 'chat-btn voice' + (recording ? ' recording' : ''),
          onClick: toggleRecord,
          title: recording ? 'Stop recording' : 'Voice input'
        }, React.createElement(IconMic)),
        React.createElement('button', {
          className: 'chat-btn send',
          onClick: () => sendMessage(draft),
          disabled: !draft.trim()
        }, React.createElement(IconSend))
      ),
      React.createElement('div', { className: 'chat-footnote' }, 'Ascala coaches customer discovery. Responses are suggestions, not gospel.')
    )
  );
}

window.Chat = Chat;
