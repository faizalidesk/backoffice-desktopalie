import { useState, useRef, useEffect } from 'react';
import { agenticAiService } from '../services/agenticAiService';
import { useTheme } from '../context/ThemeContext';
import { 
  FiSend, 
  FiRefreshCw,
  FiPlus,
  FiCpu
} from 'react-icons/fi';

export default function AgenticAiDrawer() {
  const { isDarkMode } = useTheme();

  // Initial collapsed state from localStorage (default: false / expanded on desktop)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('desktopalie_ai_sidebar_collapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Halo! 👋 Saya adalah **Desktop-Agentic** di Desktopalie Backoffice.\n\nSaya siap membantu Anda mengeksekusi berbagai tugas otomatis:\n- 📝 **Buat Tugas Baru** (contoh: *"Buat tugas baru: Security Audit & Verifikasi CSP"*)\n- 🔄 **Sinkronkan Obsidian** (contoh: *"Singkronkan data dengan Obsidian Vault"*)\n- 📊 **Cek Telemetri** (contoh: *"Tampilkan laporan telemetri proyek"*)\n- 📄 **Buat Dokumentasi** (contoh: *"Buat catatan dokumentasi arsitektur"*)\n\nApa yang ingin Anda eksekusi hari ini? 🚀'
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
        text: 'Halo! 👋 Sesi baru telah dimulai bersama **Desktop-Agentic**.\n\nApa yang ingin Anda analisis atau eksekusi sekarang?'
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
        text: response.responseText
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
      {/* PERSISTENT ATTACHED TOGGLE TAB (WHEN COLLAPSED ON RIGHT EDGE) */}
      {isCollapsed && (
        <button
          type="button"
          onClick={toggleCollapse}
          title="Buka Desktop-Agentic [|]"
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

      {/* SIMPLE CLEAN HEADER (SINGLE ROW) */}
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
            <span style={{ fontSize: '0.68rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              Ready & Autonomous
            </span>
          </div>
        </div>

        {/* Header Action Buttons: Reset '+' and Close '[|]' */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
              flexDirection: 'column'
            }}
          >
            <div style={{
              padding: '12px 15px',
              borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-main)',
              color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-main)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
              fontSize: '0.84rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(79, 70, 229, 0.2)' : 'none'
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
            <span>Desktop-Agentic sedang memproses...</span>
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
            placeholder="Ketik instruksi untuk Desktop-Agentic..."
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
          <span>Powered by <strong style={{ color: 'var(--text-main)', fontWeight: '600' }}>Google Gemini 1.5 Flash</strong> & Tool Engine</span>
        </div>
      </div>
    </aside>
  );
}
