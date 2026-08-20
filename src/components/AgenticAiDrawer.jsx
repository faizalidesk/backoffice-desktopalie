import { useState, useRef, useEffect } from 'react';
import { agenticAiService } from '../services/agenticAiService';
import { useTheme } from '../context/ThemeContext';
import { 
  FiSend, 
  FiRefreshCw,
  FiPlus,
  FiCpu,
  FiSettings,
  FiCheck,
  FiX,
  FiZap,
  FiTrash2,
  FiDatabase,
  FiBookOpen
} from 'react-icons/fi';

const DEFAULT_GREETING = {
  sender: 'ai',
  text: 'Halo! Selamat datang di Desktopalie Backoffice. Saya adalah Desktop-Agentic (Powered by Google Gemini 2.0 Flash), siap bantu oprek coding, analisis arsitektur, dan eksekusi tugas otomatis Anda hari ini. 🚀\n\n🧠 Saya sudah terhubung dengan Live Database Supabase & Obsidian Knowledge RAG:\n- Live Context: Membaca status tugas in-progress dan proyek aktif secara instan.\n- Autonomous Actions: Bisa otomatis buat task Kanban, update PRD, dan sinkronkan Obsidian.\n- Ultra-Fast Intelligence: Model Gemini 2.0 Flash terbaru dengan pemahaman kode yang tajam.\n\nApa yang ingin kita diskusikan atau eksekusi sekarang?'
};

export default function AgenticAiDrawer() {
  const { isDarkMode } = useTheme();

  // Initial collapsed state from localStorage (default: true / closed by default)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('desktopalie_ai_sidebar_collapsed');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => agenticAiService.getApiKey());
  const [selectedModel, setSelectedModel] = useState(() => agenticAiService.getModel());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Chat messages with persistent session storage
  const [messages, setMessages] = useState(() => {
    const history = agenticAiService.getChatHistory();
    return (history && history.length > 0) ? history : [DEFAULT_GREETING];
  });

  const chatEndRef = useRef(null);

  // Save messages to persistent history on change
  useEffect(() => {
    if (messages.length > 0) {
      agenticAiService.saveChatHistory(messages);
    }
  }, [messages]);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const nextState = !prev;
      localStorage.setItem('desktopalie_ai_sidebar_collapsed', JSON.stringify(nextState));
      window.dispatchEvent(new CustomEvent('ai-sidebar-change', { detail: { isCollapsed: nextState } }));
      return nextState;
    });
  };

  const handleResetChat = () => {
    const newSessionGreeting = {
      sender: 'ai',
      text: 'Halo, sesi baru telah dimulai bersama Desktop-Agentic (Google Gemini 2.0 Flash) dengan Live Context & RAG aktif.\n\nApa yang ingin Anda analisis atau eksekusi sekarang?'
    };
    setMessages([newSessionGreeting]);
    agenticAiService.saveChatHistory([newSessionGreeting]);
  };

  const handleClearHistory = () => {
    agenticAiService.clearChatHistory();
    setMessages([DEFAULT_GREETING]);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    agenticAiService.setApiKey(apiKeyInput);
    agenticAiService.setModel(selectedModel);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowSettings(false);
    }, 1200);
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
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await agenticAiService.processUserIntent(query, newMessages);
      const aiMessage = {
        sender: 'ai',
        text: response.responseText,
        toolExecuted: response.toolExecuted || null
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: `Terjadi kendala pada Desktop-Agentic: ${err.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getActiveModelDisplay = () => {
    if (selectedModel === 'gemini-2.0-flash-thinking-exp') return 'Gemini 2.0 • Thinking';
    if (selectedModel === 'gemini-1.5-pro') return 'Gemini 1.5 Pro • Ready';
    return 'Gemini 2.0 Flash • Ready';
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
      {/* PERSISTENT ATTACHED TOGGLE TAB (WHEN COLLAPSED ON RIGHT EDGE UNDER NAVBAR) */}
      {isCollapsed && (
        <button
          type="button"
          onClick={toggleCollapse}
          title="Buka Desktop-Agentic (Gemini 2.0) [|]"
          style={{
            position: 'absolute',
            top: '12px',
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
            color: 'var(--primary)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = 'var(--primary)';
            e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = 'var(--primary)';
            e.currentTarget.style.backgroundColor = 'var(--bg-card)';
          }}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
        </button>
      )}

      {/* SIMPLE CLEAN HEADER (SINGLE ROW UNDER NAVBAR) */}
      <div style={{
        height: '48px',
        minHeight: '48px',
        padding: '0 16px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Title & Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <FiCpu size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: 1.2 }}>
              Desktop-Agentic
            </span>
            <span style={{ fontSize: '0.68rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              {getActiveModelDisplay()}
            </span>
          </div>
        </div>

        {/* Header Action Buttons: Settings, Reset '+', Clear, and Close '[|]' */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button
            type="button"
            onClick={() => setShowSettings(prev => !prev)}
            title="Setelan AI & Model Gemini"
            style={{
              background: showSettings ? 'var(--bg-sidebar-hover)' : 'none',
              border: 'none',
              color: showSettings ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px',
              transition: 'all 0.15s ease'
            }}
          >
            <FiSettings size={16} />
          </button>

          <button
            type="button"
            onClick={handleResetChat}
            title="Mulai Sesi Baru"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <FiPlus size={18} />
          </button>

          <button
            type="button"
            onClick={handleClearHistory}
            title="Hapus Riwayat Chat"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#EF4444'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <FiTrash2 size={15} />
          </button>

          <button
            type="button"
            onClick={toggleCollapse}
            title="Tutup Panel [|]"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
          </button>
        </div>
      </div>

      {/* OPTIONAL GEMINI SETTINGS PANEL */}
      {showSettings && (
        <form onSubmit={handleSaveSettings} style={{
          padding: '12px 16px',
          backgroundColor: 'var(--bg-main)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Setelan Google Gemini Engine</span>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <FiX size={14} />
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
              Pilihan Model Gemini:
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{
                width: '100%',
                padding: '5px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '0.76rem',
                outline: 'none'
              }}
            >
              <option value="gemini-2.0-flash">✨ Google Gemini 2.0 Flash (Default & Ultra Cepat)</option>
              <option value="gemini-2.0-flash-thinking-exp">🧠 Gemini 2.0 Flash Thinking (Deep Reasoning)</option>
              <option value="gemini-1.5-pro">💎 Gemini 1.5 Pro (Large Context)</option>
              <option value="gemini-1.5-flash">⚡ Gemini 1.5 Flash (Legacy)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
              Google Gemini API Key (aistudio.google.com):
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              style={{
                width: '100%',
                padding: '5px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontSize: '0.76rem',
                outline: 'none'
              }}
            />
          </div>

          {/* INTELLIGENCE FEATURES BADGES IN SETTINGS */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '6px 8px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FiDatabase style={{ color: '#10B981' }} />
              <span><strong>Live Context:</strong> Real-time Supabase Database Sync</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <FiBookOpen style={{ color: '#3B82F6' }} />
              <span><strong>Obsidian RAG:</strong> Semantic Search di 30+ Dokumen & PRD</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '2px' }}>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {savedSuccess ? <><FiCheck /> Tersimpan!</> : 'Simpan Setelan'}
            </button>
          </div>
        </form>
      )}

      {/* CHAT CONVERSATION BODY */}
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
              maxWidth: '92%',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            {/* Tool Executed Badge */}
            {msg.toolExecuted && (
              <div style={{
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.68rem',
                fontWeight: '700',
                color: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                padding: '2px 8px',
                borderRadius: '99px',
                marginBottom: '2px'
              }}>
                <FiZap size={11} /> Tool Executed: {msg.toolExecuted}
              </div>
            )}

            {/* Message Bubble */}
            <div style={{
              padding: '12px 15px',
              borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-main)',
              color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-main)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
              fontSize: '0.84rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(37, 99, 235, 0.2)' : 'none'
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
            borderRadius: '12px',
            padding: '8px 14px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FiRefreshCw className="spin" style={{ color: 'var(--primary)' }} />
            <span>Desktop-Agentic (Gemini 2.0) sedang memproses...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* QUICK SHORTCUT PILLS */}
      <div style={{
        padding: '8px 14px',
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto'
      }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.72rem', padding: '4px 10px', whiteSpace: 'nowrap', height: 'auto', borderRadius: '20px' }}
          onClick={() => handleSend('Update PRD: tambahkan modul Desktop-Agentic & Serverless Security')}
        >
          ✦ Update PRD
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.72rem', padding: '4px 10px', whiteSpace: 'nowrap', height: 'auto', borderRadius: '20px' }}
          onClick={() => handleSend('Buat tugas baru: Security Audit & Verifikasi CSP')}
        >
          ✦ Buat Tugas
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.72rem', padding: '4px 10px', whiteSpace: 'nowrap', height: 'auto', borderRadius: '20px' }}
          onClick={() => handleSend('Singkronkan data dengan Obsidian Vault')}
        >
          ✦ Sync Obsidian
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.72rem', padding: '4px 10px', whiteSpace: 'nowrap', height: 'auto', borderRadius: '20px' }}
          onClick={() => handleSend('Tampilkan laporan telemetri proyek')}
        >
          ✦ Cek Telemetri
        </button>
      </div>

      {/* COMPACT INPUT FORM & AI MODEL ATTRIBUTION */}
      <div style={{
        padding: '10px 14px 12px 14px',
        backgroundColor: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            display: 'flex',
            gap: '8px'
          }}
        >
          <input
            type="text"
            className="form-control"
            style={{ fontSize: '0.84rem', borderRadius: '8px', padding: '8px 12px', height: '38px' }}
            placeholder="Tanyakan kode atau perintahkan Desktop-Agentic..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '38px', height: '38px', padding: 0, borderRadius: '8px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            disabled={loading || !input.trim()}
          >
            <FiSend size={15} />
          </button>
        </form>

        {/* AI MODEL INFO BADGE */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          fontSize: '0.68rem',
          color: 'var(--text-muted)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span>Powered by <strong style={{ color: 'var(--text-main)', fontWeight: '600' }}>Google Gemini 2.0 Flash</strong> • Live Context & Obsidian RAG</span>
        </div>
      </div>
    </aside>
  );
}
