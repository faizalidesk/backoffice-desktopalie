import { useEffect, useState } from 'react';
import { FiMonitor, FiCopy, FiExternalLink, FiCheck, FiLock, FiMoon } from 'react-icons/fi';
import DesktopalieMark from './DesktopalieMark';
import { toast } from 'react-hot-toast';

export default function DesktopOnlyGuard({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Backoffice link copied!');
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <DesktopalieMark size={30} style={{ color: '#0F172A', flexShrink: 0, marginTop: '-1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '800', letterSpacing: '0.06em', color: '#0F172A', lineHeight: '1.1' }}>
                DESKTOPALIE
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--primary)', lineHeight: '1.2', marginTop: '0.15rem' }}>
                BACKOFFICE
              </span>
            </div>
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
            Desktop-Only Backoffice Access
          </h1>

          <p style={{
            fontSize: '0.875rem',
            lineHeight: '1.6',
            color: '#64748B',
            margin: '0 auto',
            maxWidth: '420px'
          }}>
            This admin panel is designed specifically for Desktop & Laptop screens for optimal navigation and management efficiency.
          </p>
        </div>

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
            Access on Your Desktop Device
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
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
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
            <span>Visit Main Website desktopalie.my.id</span>
            <FiExternalLink />
          </a>
        </div>

        <div style={{ marginTop: '1.75rem', fontSize: '0.75rem', color: '#94A3B8' }}>
          © {new Date().getFullYear()} Desktopalie Backoffice Workspace
        </div>
      </div>
    );
  }

  return children;
}
