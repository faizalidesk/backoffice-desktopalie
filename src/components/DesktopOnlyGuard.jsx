import { useEffect, useState } from 'react';
import { FiMonitor, FiCopy, FiExternalLink, FiCheck, FiLock, FiMoon, FiSend, FiCheckCircle } from 'react-icons/fi';
import DesktopalieMark from './DesktopalieMark';
import { toast } from 'react-hot-toast';

export default function DesktopOnlyGuard({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Block screens narrower than 900px (Mobile Phones & Portrait Tablets)
      setIsMobile(window.innerWidth < 900);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Tautan Backoffice telah disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (isMobile) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#FAF8FC',
        color: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '1.25rem 1rem 2.5rem 1rem',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999999,
        overflowY: 'auto',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
      }}>
        {/* TOP BAR HEADER */}
        <div style={{
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            {/* Pure black logo icon without badge wrapper */}
            <DesktopalieMark size={28} style={{ color: '#0F172A', flexShrink: 0 }} />
            <span style={{ fontSize: '0.95rem', fontWeight: '800', letterSpacing: '0.08em', color: '#0F172A' }}>
              DESKTOPALIE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F172A',
              fontSize: '0.9rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <FiMoon />
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '99px',
              backgroundColor: '#FFE4E6',
              border: '1px solid #FECDD3',
              color: '#E11D48',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              <FiLock style={{ fontSize: '0.8rem' }} />
              <span>Desktop Only</span>
            </div>
          </div>
        </div>

        {/* HERO SECTION */}
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center', marginBottom: '1.5rem' }}>
          {/* Status Pulse Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.85rem',
            borderRadius: '99px',
            backgroundColor: '#F1F5F9',
            border: '1px solid #E2E8F0',
            fontSize: '0.7rem',
            fontWeight: '700',
            letterSpacing: '0.08em',
            color: '#0D9488',
            marginBottom: '1.25rem',
            textTransform: 'uppercase'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0D9488' }} />
            <span>DESKTOP EXPERIENCE REQUIRED</span>
          </div>

          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: '800',
            color: '#0F172A',
            lineHeight: '1.3',
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem'
          }}>
            Akses Backoffice Khusus Desktop
          </h1>

          <p style={{
            fontSize: '0.875rem',
            lineHeight: '1.6',
            color: '#64748B',
            margin: '0 auto',
            maxWidth: '420px'
          }}>
            Panel administrasi ini didesain secara khusus untuk layar lebar Komputer & Laptop untuk kenyamanan navigasi dan efisiensi manajemen.
          </p>
        </div>

        {/* ESTIMATED SPEC CARD (PURPLE GLASS STYLE LIKE SCREENSHOT) */}
        <div style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: '#F5F3FF',
          border: '1px solid #DDD6FE',
          borderRadius: '16px',
          padding: '1.5rem 1.25rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 15px rgba(124, 58, 237, 0.05)'
        }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: '800',
            letterSpacing: '0.12em',
            color: '#7C3AED',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            SYSTEM REQUIREMENT CHECK
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '1.5rem',
            fontWeight: '800',
            color: '#0F172A',
            marginBottom: '1.25rem'
          }}>
            <span>900px +</span>
            <span style={{ color: '#8B5CF6' }}>:</span>
            <span style={{ fontSize: '1rem', color: '#6D28D9' }}>DESKTOP / LAPTOP</span>
          </div>

          {/* Chips Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '99px',
              backgroundColor: '#CCFBF1',
              border: '1px solid #99F6E4',
              color: '#0F766E',
              fontSize: '0.725rem',
              fontWeight: '700'
            }}>
              <FiCheckCircle style={{ fontSize: '0.8rem' }} />
              <span>Resolution Verified</span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '99px',
              backgroundColor: '#CCFBF1',
              border: '1px solid #99F6E4',
              color: '#0F766E',
              fontSize: '0.725rem',
              fontWeight: '700'
            }}>
              <FiCheckCircle style={{ fontSize: '0.8rem' }} />
              <span>Security Audit</span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '99px',
              backgroundColor: '#F3E8FF',
              border: '1px solid #E9D5FF',
              color: '#6B21A8',
              fontSize: '0.725rem',
              fontWeight: '700'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#7C3AED' }} />
              <span>Backoffice v2.5 Admin</span>
            </div>
          </div>
        </div>

        {/* ACTION FORM BOX ("Get notified when back online" STYLE) */}
        <div style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '18px',
          padding: '1.5rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.06)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '0.9rem',
            fontWeight: '700',
            color: '#0F172A',
            marginBottom: '0.875rem',
            textAlign: 'center'
          }}>
            Dapatkan Akses di Perangkat Komputer Anda
          </h3>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '12px',
            padding: '0.35rem 0.35rem 0.35rem 0.875rem',
            gap: '0.5rem',
            marginBottom: '0.875rem'
          }}>
            <FiMonitor style={{ color: '#64748B', fontSize: '1.1rem', flexShrink: 0 }} />
            <input
              type="text"
              readOnly
              value="https://back.desktopalie.my.id"
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                color: '#334155',
                fontSize: '0.8rem',
                fontWeight: '600',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            />
            <button
              onClick={handleCopyLink}
              style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem 1rem',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
            >
              {copied ? <FiCheck /> : <FiCopy />}
              <span>{copied ? 'Disalin!' : 'Salin Link'}</span>
            </button>
          </div>

          <a
            href="https://desktopalie.my.id"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem',
              borderRadius: '8px',
              backgroundColor: '#F1F5F9',
              color: '#334155',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.825rem',
              transition: 'all 0.15s ease'
            }}
          >
            <span>Kunjungi Website Utama desktopalie.my.id</span>
            <FiExternalLink />
          </a>
        </div>

        {/* BOTTOM MOCK WINDOW GRAPHIC (LIKE SCREENSHOT) */}
        <div style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)'
        }}>
          {/* Mock Window Titlebar */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            padding: '0.6rem 0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '0.15rem 0.75rem',
              fontSize: '0.7rem',
              fontFamily: "'JetBrains Mono', monospace",
              color: '#64748B'
            }}>
              desktopalie.my.id/backoffice
            </div>

            <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700' }}>MODE +</span>
          </div>

          {/* Terminal / Status Body */}
          <div style={{
            padding: '1rem',
            backgroundColor: '#0F172A',
            color: '#38BDF8',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            textAlign: 'left',
            lineHeight: '1.6'
          }}>
            <div><span style={{ color: '#10B981' }}>✓</span> [System Log] Screen Resolution: {window.innerWidth}px</div>
            <div><span style={{ color: '#F59E0B' }}>!</span> [Guard Status] Desktop Guard Active</div>
            <div><span style={{ color: '#818CF8' }}>&gt;</span> Require min: 900px width</div>
          </div>
        </div>

        <div style={{ marginTop: '1.75rem', fontSize: '0.75rem', color: '#94A3B8' }}>
          © {new Date().getFullYear()} Desktopalie Backoffice Workspace
        </div>
      </div>
    );
  }

  return children;
}
