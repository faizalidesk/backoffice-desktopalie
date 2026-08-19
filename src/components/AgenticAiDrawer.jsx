import { useState, useRef, useEffect } from 'react';
import { agenticAiService, AGENT_TOOLS } from '../services/agenticAiService';
import { FiCpu, FiSend, FiX, FiCheckCircle, FiTool, FiZap, FiLayers, FiRefreshCw } from 'react-icons/fi';

export default function AgenticAiDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Halo! Saya **Agentic AI Copilot** di Backoffice. Saya memiliki akses langsung ke sistem (*Tool Execution Registry*) untuk membuat tugas, mengelola dokumentasi, dan menyinkronkan Obsidian Vault.\n\nApa yang bisa saya eksekusi untuk Anda hari ini?',
      thoughts: [],
      toolExecuted: null
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

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
      {/* FLOATING ACTION TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9990,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 20px',
          borderRadius: '999px',
          backgroundColor: '#0F172A',
          color: '#38BDF8',
          border: '1px solid #0284C7',
          boxShadow: '0 10px 25px -5px rgba(14, 165, 233, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: '0.875rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
          e.currentTarget.style.boxShadow = '0 14px 30px -5px rgba(14, 165, 233, 0.6)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(14, 165, 233, 0.4)';
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <FiCpu style={{ fontSize: '1.25rem', color: '#38BDF8' }} />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            boxShadow: '0 0 8px #10B981'
          }} />
        </div>
        <span>Agentic AI Copilot</span>
        <span style={{
          fontSize: '0.68rem',
          fontWeight: '800',
          padding: '2px 6px',
          borderRadius: '4px',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          color: '#38BDF8',
          textTransform: 'uppercase'
        }}>
          Tools Active
        </span>
      </button>

      {/* AGENTIC AI DRAWER PANEL */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'flex-end',
          animation: 'fadeIn 0.2s ease'
        }} onClick={() => setIsOpen(false)}>
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              height: '100%',
              backgroundColor: '#FFFFFF',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10000
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* DRAWER HEADER */}
            <div style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #1E293B'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  padding: '0.5rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38BDF8',
                  display: 'flex'
                }}>
                  <FiCpu size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#FFFFFF' }}>
                    Agentic AI Copilot
                  </h3>
                  <div style={{ fontSize: '0.725rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <span>Autonomous Tool Execution Engine</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  display: 'flex'
                }}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* REGISTERED TOOLS BADGES */}
            <div style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: '#1E293B',
              borderBottom: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto'
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', flexShrink: 0 }}>
                Available Tools:
              </span>
              {AGENT_TOOLS.map(tool => (
                <span
                  key={tool.name}
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: '600',
                    padding: '0.15rem 0.45rem',
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
              padding: '1.25rem',
              overflowY: 'auto',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '90%'
                  }}
                >
                  {/* THOUGHT PROCESS & TOOL EXECUTION LOG BADGE */}
                  {msg.sender === 'ai' && msg.thoughts && msg.thoughts.length > 0 && (
                    <div style={{
                      backgroundColor: '#1E293B',
                      borderRadius: '8px',
                      padding: '0.625rem 0.875rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.725rem',
                      fontFamily: 'monospace',
                      color: '#38BDF8',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      borderLeft: '3px solid #0284C7'
                    }}>
                      {msg.thoughts.map((th, tIdx) => (
                        <div key={tIdx} style={{ lineHeight: 1.4 }}>
                          {th}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{
                    padding: '0.875rem 1.15rem',
                    borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    backgroundColor: msg.sender === 'user' ? '#0284C7' : '#FFFFFF',
                    color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
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
                  borderRadius: '16px',
                  padding: '0.875rem 1.15rem',
                  fontSize: '0.825rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FiRefreshCw className="spin" style={{ color: '#0284C7' }} />
                  <span>Agentic AI sedang berpikir & mengeksekusi tool...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* PRESET SHORTCUT BUTTONS */}
            <div style={{
              padding: '0.625rem 1rem',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto'
            }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem', whiteSpace: 'nowrap', height: 'auto' }}
                onClick={() => handleSend('Buat tugas baru: Security Audit & Verifikasi CSP')}
              >
                ✦ Buat Tugas Security
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem', whiteSpace: 'nowrap', height: 'auto' }}
                onClick={() => handleSend('Singkronkan data dengan Obsidian Vault')}
              >
                ✦ Sync Obsidian
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem', whiteSpace: 'nowrap', height: 'auto' }}
                onClick={() => handleSend('Tampilkan laporan telemetri proyek')}
              >
                ✦ Report Telemetri
              </button>
            </div>

            {/* INPUT FORM */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{
                padding: '1rem 1.25rem',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                gap: '0.625rem'
              }}
            >
              <input
                type="text"
                className="form-control"
                style={{ fontSize: '0.875rem', borderRadius: '8px' }}
                placeholder="Berikan perintah kepada Agentic AI (cth: Buat tugas baru...)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0 1.15rem', borderRadius: '8px', flexShrink: 0 }}
                disabled={loading || !input.trim()}
              >
                <FiSend />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
