import { useEffect, useState } from 'react';
import { FiMonitor, FiCopy, FiExternalLink, FiCheck } from 'react-icons/fi';
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
        backgroundColor: '#0F172A',
        color: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999999,
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(0,0,0,0) 70%)',
          top: '20%',
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '440px',
          width: '100%',
          backgroundColor: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '24px',
          padding: '2.5rem 1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Logo Mark Header */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.4rem 1rem',
            borderRadius: '99px',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#818CF8',
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.75rem'
          }}>
            <DesktopalieMark size={16} />
            <span>DESKTOP EXPERIENCE ONLY</span>
          </div>

          {/* Monitor Icon Container */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '2.25rem',
            marginBottom: '1.5rem',
            boxShadow: '0 12px 24px rgba(79, 70, 229, 0.35)'
          }}>
            <FiMonitor />
          </div>

          <h2 style={{
            fontSize: '1.35rem',
            fontWeight: '800',
            lineHeight: '1.3',
            color: '#FFFFFF',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em'
          }}>
            Buka Melalui Laptop atau Komputer
          </h2>

          <p style={{
            fontSize: '0.875rem',
            lineHeight: '1.6',
            color: '#94A3B8',
            marginBottom: '2rem'
          }}>
            Panel Administrasi <strong>Desktopalie Backoffice</strong> didesain secara khusus untuk layar lebar (Desktop/Laptop). Silakan buka tautan ini di Komputer Anda.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={handleCopyLink}
              style={{
                width: '100%',
                padding: '0.875rem 1.25rem',
                borderRadius: '12px',
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {copied ? <FiCheck /> : <FiCopy />}
              <span>{copied ? 'Tautan Berhasil Disalin!' : 'Salin Tautan Backoffice'}</span>
            </button>

            <a
              href="https://desktopalie.my.id"
              target="_blank"
              rel="noreferrer"
              style={{
                width: '100%',
                padding: '0.875rem 1.25rem',
                borderRadius: '12px',
                backgroundColor: '#334155',
                color: '#F1F5F9',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Kunjungi desktopalie.my.id</span>
              <FiExternalLink />
            </a>
          </div>
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#64748B' }}>
          © {new Date().getFullYear()} Desktopalie Backoffice Workspace
        </div>
      </div>
    );
  }

  return children;
}
