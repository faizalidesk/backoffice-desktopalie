import { useState, useRef, useEffect } from 'react';
import { agenticAiService, AGENT_TOOLS } from '../services/agenticAiService';
import { useTheme } from '../context/ThemeContext';
import { 
  FiCpu, 
  FiSend, 
  FiX, 
  FiChevronRight, 
  FiChevronLeft, 
  FiRefreshCw,
  FiSidebar,
  FiZap,
  FiCheckCircle
} from 'react-icons/fi';

export default function AgenticAiDrawer() {
  const { isDarkMode } = useTheme();

  // Read initial collapsed state from localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('desktopalie_ai_sidebar_collapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Halo! Saya **Agentic AI Copilot** di Sidebar Kanan. Saya terintegrasi langsung dengan sistem Backoffice (*Tool Registry*) untuk membuat tugas, mengelola dokumentasi, dan menyinkronkan Obsidian Vault.\n\nApa yang ingin Anda eksekusi hari ini?',
      thoughts: [],
      toolExecuted: null
    }
  ]);

  const chatEndRef = useRef(null);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const nextState = !prev;
      localStorage.setItem('desktopalie_ai_sidebar_collapsed', JSON.stringify(nextState));
      return nextState;
    });
  };

  useEffect(() => {
    const handleToggleEvent = () => {
      toggleCollapse();
    };
    window.addEventListener('toggle-ai-sidebar', handleToggleEvent);
    return () => window.removeEventListener('toggle-ai-sidebar', handleToggleEvent);
  }, []);

  useEffect(() => {
    if (!isCollapsed) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isCollapsed]);

  const handleSend = async (textToSend = null) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await agenticAiService.processUserIntent(query);
      const aiMessage = {
        sender: 'ai',
        text: response.responseText,
        thoughts: response.thoughts || [],
        toolExecuted: response.toolExecuted,
        payload: response.resultPayload
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: `Terjadi kendala eksekusi agentic AI: ${err.message}`,
        thoughts: ['❌ Exception caught in agent execution flow']
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* COLLAPSED FLOATING TRIGGER ON RIGHT EDGE */}
      {isCollapsed && (
        <button
          type="button"
          onClick={toggleCollapse}
          title="Buka Agentic AI Sidebar (Kanan)"
          style={{
            position: 'fixed',
            top: '84px',
            right: 0,
            zIndex: 9980,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '10px 0 0 10px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--primary)',
            border: '1px solid var(--border-color)',
            borderRight: 'none',
            boxShadow: 'var(--shadow-md)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '0.825rem',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <FiChevronLeft style={{ fontSize: '1.1rem' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <FiCpu style={{ fontSize: '1.15rem' }} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 6px #10B981'
            }} />
          </div>
          <span>AI Copilot</span>
        </button>
      )}

      {/* EXPANDED RIGHT SIDEBAR PANEL MATCHING BACKOFFICE THEME BELOW NAVBAR */}
      {!isCollapsed && (
        <aside
          style={{
            width: '380px',
            height: 'calc(100vh - 64px)',
            position: 'fixed',
            top: '64px',
            right: 0,
            zIndex: 90,
            backgroundColor: 'var(--bg-card)',
            borderLeft: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.25s ease'
          }}
        >
          {/* SIDEBAR PANEL HEADER */}
          <div style={{
            padding: '1.1rem 1.25rem',
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                padding: '0.45rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex'
              }}>
                <FiCpu size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.925rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Agentic AI Copilot
                </h3>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span>Right Panel • Integrated</span>
                </div>
              </div>
            </div>

            {/* COLLAPSE CLOSE BUTTON */}
            <button
              type="button"
              onClick={toggleCollapse}
              title="Ciutkan Panel Sidebar"
              style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                padding: '0.35rem 0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.725rem',
                fontWeight: '600'
              }}
            >
              <span>Collapse</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </button>
          </div>

          {/* REGISTERED TOOL BADGES */}
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--bg-main)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflowX: 'auto'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', flexShrink: 0 }}>
              Tools:
            </span>
            {AGENT_TOOLS.map(tool => (
              <span
                key={tool.name}
                style={{
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  padding: '0.12rem 0.4rem',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                ⚡ {tool.name}
              </span>
            ))}
          </div>

          {/* CHAT MESSAGES BODY */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            backgroundColor: 'var(--bg-main)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '92%'
                }}
              >
                {/* THOUGHT PROCESS & TOOL LOG BADGE */}
                {msg.sender === 'ai' && msg.thoughts && msg.thoughts.length > 0 && (
                  <div style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.5rem 0.75rem',
                    marginBottom: '0.4rem',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    borderLeft: '3px solid var(--primary)',
                    border: '1px solid var(--border-color)',
                    borderLeftWidth: '3px'
                  }}>
                    {msg.thoughts.map((th, tIdx) => (
                      <div key={tIdx} style={{ lineHeight: 1.35 }}>
                        {th}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-card)',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-main)',
                  boxShadow: 'var(--shadow-sm)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  fontSize: '0.825rem',
                  lineHeight: '1.45',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <FiRefreshCw className="spin" style={{ color: 'var(--primary)' }} />
                <span>Agentic AI sedang mengeksekusi tool...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* PRESET SHORTCUT BUTTONS */}
          <div style={{
            padding: '0.5rem 0.875rem',
            backgroundColor: 'var(--bg-card)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto'
          }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', whiteSpace: 'nowrap', height: 'auto' }}
              onClick={() => handleSend('Buat tugas baru: Security Audit CSP')}
            >
              ✦ Task Security
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', whiteSpace: 'nowrap', height: 'auto' }}
              onClick={() => handleSend('Singkronkan data dengan Obsidian Vault')}
            >
              ✦ Sync Vault
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', whiteSpace: 'nowrap', height: 'auto' }}
              onClick={() => handleSend('Tampilkan laporan telemetri proyek')}
            >
              ✦ Telemetri
            </button>
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.875rem 1rem',
              backgroundColor: 'var(--bg-card)',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              className="form-control"
              style={{ fontSize: '0.825rem', borderRadius: 'var(--radius-sm)' }}
              placeholder="Ketik perintah untuk Agentic AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0 1rem', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
              disabled={loading || !input.trim()}
            >
              <FiSend />
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
