import { useState, useRef, useEffect } from 'react';
import { agenticAiService, AGENT_TOOLS } from '../services/agenticAiService';
import { useTheme } from '../context/ThemeContext';
import { 
  FiCpu, 
  FiSend, 
  FiX, 
  FiChevronLeft, 
  FiRefreshCw,
  FiFileText,
  FiFilePlus,
  FiBookOpen,
  FiPlus,
  FiMoreVertical,
  FiList
} from 'react-icons/fi';

export default function AgenticAiDrawer() {
  const { isDarkMode } = useTheme();

  // Read initial collapsed state from localStorage (default: false / expanded on desktop)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('desktopalie_ai_sidebar_collapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [showToolsList, setShowToolsList] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '✦ **Agentic AI Copilot & Knowledge Intelligence**\n\nSelamat datang di panel **Agentic AI Copilot**. Saya terintegrasi penuh dengan seluruh lapisan sistem Backoffice (*Tool Registry* & *Obsidian Vault*).\n\nSilakan berikan instruksi langsung (misal: buat tugas baru, sinkronisasi Obsidian Vault, atau ringkasan telemetri).',
      thoughts: [],
      toolExecuted: null
    }
  ]);

  const chatEndRef = useRef(null);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const nextState = !prev;
      localStorage.setItem('desktopalie_ai_sidebar_collapsed', JSON.stringify(nextState));
      window.dispatchEvent(new CustomEvent('ai-sidebar-change', { detail: { isCollapsed: nextState } }));
      return nextState;
    });
  };

  const handleResetChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: '✦ **Agentic AI Copilot Siap**\n\nSesi baru telah dimulai. Apa yang ingin Anda eksekusi atau analisis sekarang?',
        thoughts: [],
        toolExecuted: null
      }
    ]);
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
    <aside
      style={{
        width: '400px',
        height: 'calc(100vh - 64px)',
        position: 'fixed',
        top: '64px',
        right: 0,
        zIndex: 90,
        backgroundColor: 'var(--bg-card)',
        borderLeft: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isCollapsed ? 'none' : 'var(--shadow-md)',
        transform: isCollapsed ? 'translateX(100%)' : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: 'var(--font-sans)'
      }}
    >
      {/* PERSISTENT ATTACHED TOGGLE TAB (PERMANENTLY VISIBLE ON RIGHT EDGE WITH [|] ICON) */}
      <button
        type="button"
        onClick={toggleCollapse}
        title={isCollapsed ? "Buka Agentic AI Panel [|]" : "Tutup Panel [|]"}
        style={{
          position: 'absolute',
          top: '8px',
          left: '-44px',
          width: '44px',
          height: '40px',
          borderRadius: '8px 0 0 8px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRight: 'none',
          boxShadow: '-4px 4px 12px rgba(0, 0, 0, 0.08)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isCollapsed ? 'var(--primary)' : 'var(--text-main)',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = 'var(--primary)';
          e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = isCollapsed ? 'var(--primary)' : 'var(--text-main)';
          e.currentTarget.style.backgroundColor = 'var(--bg-card)';
        }}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      </button>

      {/* TOP TOOLBAR ROW (MATCHING IDE WALKTHROUGH TOOLBAR PRECISELY) */}
      <div style={{
        height: '40px',
        minHeight: '40px',
        padding: '0 10px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        {/* Left Toolbar Icons & Tab Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            title="Notes / Documentation"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px'
            }}
          >
            <FiFileText size={14} />
          </button>

          <button
            type="button"
            title="Templates / Tasks"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px'
            }}
          >
            <FiFilePlus size={14} />
          </button>

          <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-color)', margin: '0 2px' }} />

          {/* Active Tab Pill Button (Matching [ 📖 Walkthrough ] pill in Image) */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'var(--text-main)'
          }}>
            <FiBookOpen size={13} style={{ color: 'var(--primary)' }} />
            <span>Walkthrough</span>
          </div>
        </div>

        {/* Right Action Icons (New '+' and Split-Panel Toggle '[|]') */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={handleResetChat}
            title="Sesi Baru (New Chat / Reset)"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px 6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <FiPlus size={16} />
          </button>

          {/* Split-Panel Toggle Icon [|] */}
          <button
            type="button"
            onClick={toggleCollapse}
            title="Tutup / Collapse Panel [|]"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px 6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
          </button>
        </div>
      </div>

      {/* SUBHEADER TITLE ROW (MATCHING IDE SUBHEADER) */}
      <div style={{
        height: '36px',
        minHeight: '36px',
        padding: '0 14px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
          Walkthrough
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setShowToolsList(prev => !prev)}
            title="Daftar Tool Registry AI"
            style={{
              background: 'none',
              border: 'none',
              color: showToolsList ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FiList size={14} />
          </button>

          <button
            type="button"
            onClick={handleResetChat}
            title="Menu Opsi"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FiMoreVertical size={14} />
          </button>
        </div>
      </div>

      {/* OPTIONAL TOOL REGISTRY DROPDOWN BANNER */}
      {showToolsList && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px'
        }}>
          <span style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-muted)', width: '100%', textTransform: 'uppercase' }}>
            Active Agentic Tools:
          </span>
          {AGENT_TOOLS.map(t => (
            <span key={t.name} style={{
              fontSize: '0.65rem',
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-mono)'
            }}>
              ⚡ {t.name}
            </span>
          ))}
        </div>
      )}

      {/* CHAT / WALKTHROUGH CONTENT BODY */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '96%'
            }}
          >
            {/* THOUGHT PROCESS & TOOL LOG BADGE */}
            {msg.sender === 'ai' && msg.thoughts && msg.thoughts.length > 0 && (
              <div style={{
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                marginBottom: '6px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                border: '1px solid var(--border-color)',
                borderLeft: '3px solid var(--primary)'
              }}>
                {msg.thoughts.map((th, tIdx) => (
                  <div key={tIdx} style={{ lineHeight: 1.35 }}>
                    {th}
                  </div>
                ))}
              </div>
            )}

            <div style={{
              padding: '10px 14px',
              borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '10px',
              backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-main)',
              color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-main)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
              fontSize: '0.825rem',
              lineHeight: '1.55',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{
            alignSelf: 'flex-start',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <FiRefreshCw className="spin" style={{ color: 'var(--primary)' }} />
            <span>Agentic AI sedang menganalisis & mengeksekusi...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* PRESET SHORTCUT ACTIONS ROW */}
      <div style={{
        padding: '6px 12px',
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto'
      }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.7rem', padding: '3px 8px', whiteSpace: 'nowrap', height: 'auto', borderRadius: '4px' }}
          onClick={() => handleSend('Buat tugas baru: Security Audit & CSP Verification')}
        >
          ✦ Task Security
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.7rem', padding: '3px 8px', whiteSpace: 'nowrap', height: 'auto', borderRadius: '4px' }}
          onClick={() => handleSend('Singkronkan data dengan Obsidian Vault')}
        >
          ✦ Sync Vault
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.7rem', padding: '3px 8px', whiteSpace: 'nowrap', height: 'auto', borderRadius: '4px' }}
          onClick={() => handleSend('Tampilkan laporan telemetri proyek')}
        >
          ✦ Telemetri
        </button>
      </div>

      {/* INPUT FORM (COMPACT BOTTOM DOCK) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          padding: '10px 12px',
          backgroundColor: 'var(--bg-card)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '6px'
        }}
      >
        <input
          type="text"
          className="form-control"
          style={{ fontSize: '0.825rem', borderRadius: '6px', padding: '7px 10px', height: '36px' }}
          placeholder="Ketik instruksi untuk Agentic AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '36px', height: '36px', padding: 0, borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          disabled={loading || !input.trim()}
        >
          <FiSend size={14} />
        </button>
      </form>
    </aside>
  );
}
