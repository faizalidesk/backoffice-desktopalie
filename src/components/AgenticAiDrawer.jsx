import { useState, useRef, useEffect } from 'react';
import { agenticAiService } from '../services/agenticAiService';
import { useTheme } from '../context/ThemeContext';
import { 
  FiSend, 
  FiRefreshCw,
  FiPlus,
  FiCpu,
  FiZap,
  FiTrash2,
  FiMic,
  FiMicOff,
  FiVolume2,
  FiVolumeX
} from 'react-icons/fi';

const DEFAULT_GREETING = {
  sender: 'ai',
  text: 'Halo! Selamat datang di Desktopalie Backoffice. Saya adalah Desktop-Agentic (Powered by Google Gemini 2.0 Flash di Server Backend), siap bantu oprek coding, analisis arsitektur, dan eksekusi tugas otomatis Anda hari ini. 🚀\n\n🧠 Seluruh sistem terhubung otomatis dengan Live Database Supabase & Obsidian Knowledge RAG:\n- Live Context: Membaca status tugas in-progress dan proyek aktif secara instan.\n- Autonomous Actions: Bisa otomatis buat task Kanban, update PRD, dan sinkronkan Obsidian.\n- Secure Backend: Menggunakan Google Gemini 2.0 Flash resmi yang diamankan di server.\n\nApa yang ingin kita diskusikan atau eksekusi sekarang?'
};

export default function AgenticAiDrawer() {
  const { isDarkMode } = useTheme();

  // Initial collapsed state (ALWAYS closed by default when entering the app)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = sessionStorage.getItem('desktopalie_ai_sidebar_collapsed');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  // Chat messages with persistent session storage
  const [messages, setMessages] = useState(() => {
    const history = agenticAiService.getChatHistory();
    return (history && history.length > 0) ? history : [DEFAULT_GREETING];
  });

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Save messages to persistent history on change
  useEffect(() => {
    if (messages.length > 0) {
      agenticAiService.saveChatHistory(messages);
    }
  }, [messages]);

  // Synchronize initial layout state on mount (guarantee closed by default)
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('ai-sidebar-change', { detail: { isCollapsed } }));
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const nextState = !prev;
      sessionStorage.setItem('desktopalie_ai_sidebar_collapsed', JSON.stringify(nextState));
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

  // Google Voice Speech-to-Text (Voice Command)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda tidak mendukung Google Speech Recognition. Gunakan Google Chrome atau Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition exception:', e);
      setIsListening(false);
    }
  };

  // Google Voice Text-to-Speech (Audio Playback)
  const toggleSpeak = (text, index) => {
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda tidak mendukung Speech Synthesis Audio.');
      return;
    }

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.05;

    utterance.onend = () => {
      setSpeakingIndex(null);
    };
    utterance.onerror = () => {
      setSpeakingIndex(null);
    };

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
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
              Gemini 2.0 Flash • Live Backend
            </span>
          </div>
        </div>

        {/* Header Action Buttons: Reset '+', Clear, and Close '[|]' */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
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
        {messages.map((msg, idx) => (
          <div
            key={idx}
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
              position: 'relative',
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

              {/* Text-to-Speech audio button for AI replies */}
              {msg.sender === 'ai' && (
                <button
                  type="button"
                  onClick={() => toggleSpeak(msg.text, idx)}
                  title={speakingIndex === idx ? 'Hentikan Suara' : 'Dengarkan Jawaban AI (Google TTS)'}
                  style={{
                    position: 'absolute',
                    bottom: '6px',
                    right: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: speakingIndex === idx ? '#10B981' : 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    opacity: 0.8
                  }}
                >
                  {speakingIndex === idx ? <FiVolumeX size={13} /> : <FiVolume2 size={13} />}
                </button>
              )}
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
            <span>Desktop-Agentic sedang memproses via Gemini 2.0 Backend...</span>
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
            placeholder={isListening ? 'Mendengarkan suara Anda...' : 'Tanyakan kode atau perintah suara...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />

          {/* Voice Microphone (Google Speech-to-Text) Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            title={isListening ? 'Hentikan Mikrofon' : 'Gunakan Perintah Suara (Google Speech STT)'}
            style={{
              width: '38px',
              height: '38px',
              padding: 0,
              borderRadius: '8px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isListening ? '#EF4444' : 'var(--bg-card-hover, #F1F5F9)',
              color: isListening ? '#FFFFFF' : 'var(--text-main)',
              border: `1px solid ${isListening ? '#DC2626' : 'var(--border-color)'}`,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {isListening ? <FiMicOff size={16} /> : <FiMic size={16} />}
          </button>

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
          <span>Powered by <strong style={{ color: 'var(--text-main)', fontWeight: '600' }}>Google Gemini 2.0 Flash</strong> • Secure Server Backend</span>
        </div>
      </div>
    </aside>
  );
}
