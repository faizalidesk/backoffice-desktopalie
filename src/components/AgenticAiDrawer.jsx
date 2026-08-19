import { useState, useRef, useEffect } from 'react';
import { agenticAiService, AGENT_TOOLS } from '../services/agenticAiService';
import { 
  FiCpu, 
  FiSend, 
  FiX, 
  FiChevronRight, 
  FiChevronLeft, 
  FiRefreshCw,
  FiSidebar,
  FiZap
} from 'react-icons/fi';

export default function AgenticAiDrawer() {
  // Read initial collapsed state from localStorage (default: expanded on desktop, collapsible)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('desktopalie_ai_sidebar_collapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Halo! Saya **Agentic AI Copilot** di Sidebar Kanan Backoffice. Saya memiliki akses langsung ke sistem (*Tool Execution Registry*) untuk membuat tugas, mengelola dokumentasi, dan menyinkronkan Obsidian Vault.\n\nApa yang bisa saya eksekusi untuk Anda hari ini?',
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
      {/* COLLAPSED FLOATING STRIP / TOGGLE TRIGGER ON RIGHT EDGE */}
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
            padding: '12px 14px 12px 16px',
            borderRadius: '12px 0 0 12px',
            backgroundColor: '#0F172A',
            color: '#38BDF8',
            border: '1px solid #0284C7',
            borderRight: 'none',
            boxShadow: '-6px 6px 20px rgba(14, 165, 233, 0.35)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '0.825rem',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateX(-4px)';
            e.currentTarget.style.boxShadow = '-8px 8px 25px rgba(14, 165, 233, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = '-6px 6px 20px rgba(14, 165, 233, 0.35)';
          }}
        >
          <FiChevronLeft style={{ fontSize: '1.1rem', color: '#38BDF8' }} />
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
          <span style={{ letterSpacing: '0.02em' }}>AI Copilot</span>
        </button>
      )}

      {/* EXPANDED RIGHT SIDEBAR PANEL */}
      {!isCollapsed && (
        <aside
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '380px',
            height: '100vh',
            zIndex: 9985,
            backgroundColor: '#FFFFFF',
            borderLeft: '1px solid var(--border-color)',
            boxShadow: '-8px 0 25px rgba(15, 23, 42, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* SIDEBAR HEADER */}
          <div style={{
            padding: '1rem 1.25rem',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1E293B'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                padding: '0.45rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38BDF8',
                display: 'flex'
              }}>
                <FiCpu size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.925rem', fontWeight: '700', color: '#FFFFFF' }}>
                  Agentic AI Copilot
                </h3>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span>Right Sidebar • Active</span>
                </div>
              </div>
            </div>

            {/* COLLAPSE BUTTON */}
            <button
              type="button"
              onClick={toggleCollapse}
              title="Ciutkan Sidebar (Collapse)"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '0.35rem 0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.725rem',
                fontWeight: '600'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#FFFFFF'}
              onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}
            >
              <span>Collapse</span>
              <FiChevronRight size={16} />
            </button>
          </div>

          {/* REGISTERED TOOL BADGES */}
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#1E293B',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflowX: 'auto'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', flexShrink: 0 }}>
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
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#E2E8F0',
                  whiteSpace: 'nowrap',
                  fontFamily: 'monospace'
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
            backgroundColor: '#F8FAFC',
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
                    backgroundColor: '#1E293B',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    marginBottom: '0.4rem',
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                    color: '#38BDF8',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    borderLeft: '3px solid #0284C7'
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
                  backgroundColor: msg.sender === 'user' ? '#0284C7' : '#FFFFFF',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
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
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                fontSize: '0.78rem',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <FiRefreshCw className="spin" style={{ color: '#0284C7' }} />
                <span>Agentic AI sedang mengeksekusi tool...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* PRESET SHORTCUT BUTTONS */}
          <div style={{
            padding: '0.5rem 0.875rem',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
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
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <input
              type="text"
              className="form-control"
              style={{ fontSize: '0.825rem', borderRadius: '6px' }}
              placeholder="Ketik perintah untuk Agentic AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0 1rem', borderRadius: '6px', flexShrink: 0 }}
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
