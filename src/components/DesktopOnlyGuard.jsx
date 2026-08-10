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
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
        textAlign: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999999,
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
      }}>
        {/* Ambient Top Glow with Main Primary Color */}
        <div style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, rgba(248, 250, 252, 0) 70%)',
          top: '10%',
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '420px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '20px',
          padding: '2.25rem 1.5rem',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Logo Mark Header Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.875rem',
            borderRadius: '99px',
            backgroundColor: '#EEF2FF',
            border: '1px solid #C7D2FE',
            color: '#4F46E5',
            fontSize: '0.725rem',
            fontWeight: '700',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem'
          }}>
            <DesktopalieMark size={16} />
            <span>DESKTOPALIE BACKOFFICE</span>
          </div>

          {/* Icon Container in Main Primary Indigo */}
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '2rem',
            marginBottom: '1.25rem',
            boxShadow: '0 8px 20px rgba(79, 70, 229, 0.28)'
          }}>
            <FiMonitor />
          </div>

          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: '800',
            lineHeight: '1.35',
            color: '#0F172A',
            marginBottom: '0.625rem',
            letterSpacing: '-0.02em'
          }}>
            Buka Melalui Laptop atau Komputer
          </h2>

          <p style={{
            fontSize: '0.85rem',
            lineHeight: '1.6',
            color: '#64748B',
            marginBottom: '1.75rem'
          }}>
            Panel Administrasi <strong>Desktopalie Backoffice</strong> dirancang khusus untuk resolusi layar lebar (Desktop/Laptop). Silakan salin tautan dan buka di Perangkat Komputer Anda.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <button
              onClick={handleCopyLink}
              style={{
                width: '100%',
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '600',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
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
                padding: '0.75rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                border: '1px solid #E2E8F0',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Kunjungi desktopalie.my.id</span>
              <FiExternalLink />
            </a>
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
