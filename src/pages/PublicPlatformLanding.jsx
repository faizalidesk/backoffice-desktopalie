import { useEffect, useState } from 'react';
import { useFlavor } from '../context/FlavorContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { backofficeService } from '../services/backofficeService';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiGlobe, 
  FiArrowRight, 
  FiLock, 
  FiSun, 
  FiMoon, 
  FiGithub, 
  FiLinkedin, 
  FiInstagram, 
  FiCheckCircle, 
  FiZap, 
  FiLayers, 
  FiShield,
  FiActivity
} from 'react-icons/fi';
import DesktopalieMark from '../components/DesktopalieMark';

export default function PublicPlatformLanding() {
  const { activeFlavor, flavorId } = useFlavor();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLandingContent();
    loadMaintenanceStatus();
  }, [flavorId]);

  const loadLandingContent = async () => {
    setLoading(true);
    try {
      const data = await backofficeService.getLandingPageSettings(flavorId);
      setSettings(data);
    } catch (err) {
      console.error('Failed to load landing content:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMaintenanceStatus = async () => {
    try {
      const data = await backofficeService.getMaintenanceSettings(flavorId);
      setMaintenance(data);
    } catch (err) {
      console.error('Failed to load maintenance status:', err);
    }
  };

  const primaryColor = activeFlavor?.theme?.colorPrimary || '#4f46e5';
  const dummyProjects = activeFlavor?.dummyData?.recentProjects || [];

  const getNavLinks = () => {
    switch (flavorId) {
      case 'platform2': // Beta (Logistics & Fleet)
        return [
          { label: 'Ikhtisar Armada', path: '#hero' },
          { label: 'Live Telemetry', path: '#features' },
          { label: 'Manajemen Rute', path: '#projects' },
          { label: 'Tentang Beta', path: '#about' },
          { label: 'Dukungan Logistik', path: '#contact' },
        ];
      case 'platform3': // Gamma (Streaming & Analytics)
        return [
          { label: 'Hub Transcoder', path: '#hero' },
          { label: 'AI Subtitle Video', path: '#features' },
          { label: 'Studio Streaming', path: '#projects' },
          { label: 'Arsitektur CDN', path: '#about' },
          { label: 'Kontak Media', path: '#contact' },
        ];
      case 'platform4': // Delta (Enterprise ERP)
        return [
          { label: 'Enterprise Core', path: '#hero' },
          { label: 'Modul Keuangan', path: '#features' },
          { label: 'Audit ISO 27001', path: '#projects' },
          { label: 'Tata Kelola Delta', path: '#about' },
          { label: 'Konsultasi Enterprise', path: '#contact' },
        ];
      case 'platform1':
      default: // Desktopalie Main Core
        return [
          { label: 'Beranda Core', path: '#hero' },
          { label: 'Fitur Utama', path: '#features' },
          { label: 'Proyek & Karya', path: '#projects' },
          { label: 'Tentang Saya', path: '#about' },
          { label: 'Kontak', path: '#contact' },
        ];
    }
  };

  const navLinks = getNavLinks();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!maintenance?.end_time) return;
    const calculateTimeLeft = () => {
      const target = new Date(maintenance.end_time).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [maintenance?.end_time]);

  const isMaintenanceActive = Boolean(
    maintenance && (
      maintenance.is_enabled === true ||
      maintenance.is_enabled === 'true' ||
      maintenance.is_enabled === 1 ||
      maintenance.is_enabled === '1'
    )
  );

  // RENDER MAINTENANCE SCREEN IF MAINTENANCE MODE IS ACTIVE FOR THIS PLATFORM FLAVOR
  if (isMaintenanceActive) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: isDarkMode ? '#080C14' : '#F6F5F9',
        color: isDarkMode ? '#F8FAFC' : '#0F172A',
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflowX: 'hidden',
        boxSizing: 'border-box'
      }}>
        {/* Ambient Radial Background Glows */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-100px',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}18 0%, rgba(0,0,0,0) 70%)`,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-100px',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}15 0%, rgba(0,0,0,0) 70%)`,
          pointerEvents: 'none'
        }} />

        {/* 1. TOP NAVBAR HEADER */}
        <header style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Left Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <DesktopalieMark size={32} style={{ color: isDarkMode ? '#F8FAFC' : '#0F172A', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '0.04em', color: isDarkMode ? '#F8FAFC' : '#0F172A', display: 'block', lineHeight: 1 }}>
                {activeFlavor?.logoText || 'DESKTOPALIE'}
              </span>
              <span style={{ fontSize: '0.675rem', color: primaryColor, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {activeFlavor?.shortName} Portal
              </span>
            </div>
          </div>

          {/* Center Disabled Nav Items */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            {['Home', 'Projects', 'Experiments', 'About', 'Services', 'Contact'].map((item, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: isDarkMode ? '#64748B' : '#94A3B8',
                  textDecoration: 'line-through',
                  opacity: 0.75,
                  cursor: 'not-allowed'
                }}
              >
                {item}
              </span>
            ))}
          </nav>

          {/* Right Controls: Theme Switcher & Site Locked Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDarkMode ? '#FBBF24' : '#0F172A',
                fontSize: '1.1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>

            {/* Site Locked Red Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '99px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#EF4444',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              <FiLock style={{ fontSize: '0.8rem' }} />
              <span>Site Locked</span>
            </div>
          </div>
        </header>

        {/* 2. MAIN 2-COLUMN HERO SECTION */}
        <main style={{
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: '2.5rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
          flex: 1
        }}>

          {/* LEFT COLUMN: HERO MAINTENANCE INFO & LIVE COUNTDOWN */}
          <div>
            {/* Status Pill Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '99px',
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              color: '#16A34A',
              fontSize: '0.725rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1.5rem'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
              <span>{activeFlavor?.shortName} PLATFORM SYSTEM UPGRADE IN PROGRESS</span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
              color: isDarkMode ? '#F8FAFC' : '#0F172A'
            }}>
              {maintenance?.title || 'System Under Maintenance'}
            </h1>

            {/* Message */}
            <p style={{
              fontSize: '1.05rem',
              lineHeight: '1.65',
              color: isDarkMode ? '#94A3B8' : '#64748B',
              marginBottom: '2rem',
              maxWidth: '540px'
            }}>
              {maintenance?.message || 'We are performing system upgrades and performance enhancements. Please check back shortly.'}
            </p>

            {/* COUNTDOWN CARD (White Box as in Screenshot) */}
            <div style={{
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              borderRadius: '20px',
              padding: '1.5rem 2rem',
              marginBottom: '1.75rem',
              boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.05)',
              maxWidth: '520px'
            }}>
              <div style={{
                fontSize: '0.675rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: primaryColor,
                marginBottom: '0.85rem'
              }}>
                ESTIMATED TIME UNTIL COMPLETION
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                fontFamily: "'JetBrains Mono', monospace, sans-serif"
              }}>
                <div>
                  <div style={{ fontSize: '2.25rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A', lineHeight: 1 }}>
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.625rem', fontWeight: '700', color: isDarkMode ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
                    DAYS
                  </div>
                </div>

                <span style={{ fontSize: '1.75rem', fontWeight: '700', color: primaryColor, marginTop: '-0.75rem' }}>:</span>

                <div>
                  <div style={{ fontSize: '2.25rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A', lineHeight: 1 }}>
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.625rem', fontWeight: '700', color: isDarkMode ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
                    HOURS
                  </div>
                </div>

                <span style={{ fontSize: '1.75rem', fontWeight: '700', color: primaryColor, marginTop: '-0.75rem' }}>:</span>

                <div>
                  <div style={{ fontSize: '2.25rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A', lineHeight: 1 }}>
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.625rem', fontWeight: '700', color: isDarkMode ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
                    MINUTES
                  </div>
                </div>

                <span style={{ fontSize: '1.75rem', fontWeight: '700', color: primaryColor, marginTop: '-0.75rem' }}>:</span>

                <div>
                  <div style={{ fontSize: '2.25rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A', lineHeight: 1 }}>
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '0.625rem', fontWeight: '700', color: isDarkMode ? '#94A3B8' : '#64748B', marginTop: '0.35rem' }}>
                    SECONDS
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS BADGES ROW */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '2rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.35rem 0.85rem',
                borderRadius: '99px',
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                color: isDarkMode ? '#94A3B8' : '#475569',
                border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`
              }}>
                ✓ Database Indexing
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.35rem 0.85rem',
                borderRadius: '99px',
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                color: isDarkMode ? '#94A3B8' : '#475569',
                border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`
              }}>
                ✓ Security Audit
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.35rem 0.85rem',
                borderRadius: '99px',
                backgroundColor: `${primaryColor}18`,
                color: primaryColor,
                border: `1px solid ${primaryColor}30`
              }}>
                ● UI v2.5 Deployment
              </span>
            </div>

            {/* NOTIFY EMAIL FORM */}
            <div style={{ maxWidth: '520px', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A', marginBottom: '0.65rem' }}>
                Get notified when we are back online
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success('Thank you! We will notify you when system is live.', { icon: '🔔' });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                  borderRadius: '16px',
                  padding: '0.35rem 0.35rem 0.35rem 1rem',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
                }}
              >
                <span style={{ color: isDarkMode ? '#64748B' : '#94A3B8', marginRight: '0.5rem' }}>🔔</span>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: isDarkMode ? '#F8FAFC' : '#0F172A',
                    fontSize: '0.875rem'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? '#F8FAFC' : '#0F172A',
                    color: isDarkMode ? '#0F172A' : '#FFFFFF',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span>Notify me</span>
                  <FiArrowRight />
                </button>
              </form>
            </div>

            {/* ADMIN BYPASS BUTTON */}
            {maintenance?.allow_admin_bypass && (
              <div>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: primaryColor,
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>🔒 Portal Admin Backoffice (Bypass)</span>
                  <FiArrowRight style={{ fontSize: '0.8rem' }} />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: MAC-STYLE CODE EDITOR MOCKUP */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            
            {/* FLOATING BADGE 1: MAINTENANCE MODE */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              right: '20px',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.7rem',
              fontWeight: '800',
              fontFamily: "'JetBrains Mono', monospace",
              color: isDarkMode ? '#F8FAFC' : '#0F172A',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              zIndex: 20
            }}>
              MAINTENANCE MODE ⚡
            </div>

            {/* FLOATING BADGE 2: AWAIT SYSTEM UPGRADE */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '-20px',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              fontFamily: "'JetBrains Mono', monospace",
              color: primaryColor,
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              zIndex: 20
            }}>
              await system.upgrade(v2.5);
            </div>

            {/* MAIN CODE WINDOW CARD */}
            <div style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: isDarkMode ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(0,0,0,0.08)',
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              {/* Window Header Toolbar */}
              <div style={{
                backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
                borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                {/* 3 Mac Dots */}
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                </div>

                {/* URL Bar */}
                <div style={{
                  fontSize: '0.725rem',
                  color: isDarkMode ? '#94A3B8' : '#64748B',
                  backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                  borderRadius: '6px',
                  padding: '0.2rem 0.85rem'
                }}>
                  desktopalie.my.id/maintenance
                </div>

                <div style={{ width: '30px' }} />
              </div>

              {/* Window Code Content */}
              <div style={{ padding: '2rem 1.75rem', minHeight: '300px', fontSize: '0.825rem', lineHeight: '1.8', color: isDarkMode ? '#CBD5E1' : '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: isDarkMode ? '#94A3B8' : '#64748B' }}>
                  <span>System Refactor Logs</span>
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: `${primaryColor}20`, color: primaryColor, fontWeight: '700' }}>
                    || Pause
                  </span>
                </div>

                <div style={{ color: '#6366F1' }}>&gt; Initializing platform maintenance...</div>
                <div style={{ color: '#10B981' }}>✓ Supabase DB schema migration: DONE</div>
                <div style={{ color: '#10B981' }}>✓ Asset CDN Edge cache sync: DONE</div>
                <div style={{ color: '#3B82F6' }}>ℹ Optimizing React v19 UI bundles...</div>
                <div style={{ color: '#F59E0B' }}>⚠ Re-indexing global full-text search...</div>
                <div style={{ color: primaryColor, fontWeight: '700', marginTop: '1rem' }}>
                  [ STATUS ] System Upgrade v2.5 In Progress.
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* 3. BOTTOM FOOTER BAR */}
        <footer style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1.5rem 2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          borderTop: `1px solid ${isDarkMode ? '#1E293B' : '#E2E8F0'}`,
          position: 'relative',
          zIndex: 10
        }}>
          {/* Left Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DesktopalieMark size={22} style={{ color: isDarkMode ? '#F8FAFC' : '#0F172A' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.05em', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
              {activeFlavor?.logoText || 'DESKTOPALIE'}
            </span>
          </div>

          {/* Center Text */}
          <div style={{ fontSize: '0.725rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: isDarkMode ? '#64748B' : '#94A3B8' }}>
            PROJECTS, EXPERIMENTS, AND DIGITAL CREATIONS
          </div>

          {/* Right Social Icons & Copyright */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem', color: isDarkMode ? '#64748B' : '#94A3B8' }}>
            {settings?.github_url && <a href={settings.github_url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><FiGithub /></a>}
            {settings?.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><FiLinkedin /></a>}
            {settings?.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><FiInstagram /></a>}
            <span>© {new Date().getFullYear()} {activeFlavor?.logoText || 'DESKTOPALIE'}</span>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: isDarkMode ? '#0F172A' : '#FAF9FC',
      color: isDarkMode ? '#F8FAFC' : '#0F172A',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>

      {/* Background Ambient Radial Glow */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '600px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${primaryColor}22 0%, rgba(15, 23, 42, 0) 70%)`,
        pointerEvents: 'none'
      }} />

      {/* TOP PUBLIC NAVBAR HEADER */}
      <header style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Left Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <DesktopalieMark size={32} style={{ color: isDarkMode ? '#F8FAFC' : '#0F172A', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '1.05rem', fontWeight: '800', letterSpacing: '0.05em', color: isDarkMode ? '#F8FAFC' : '#0F172A', display: 'block', lineHeight: 1 }}>
              {activeFlavor?.logoText || 'DESKTOPALIE'}
            </span>
            <span style={{ fontSize: '0.7rem', color: primaryColor, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {activeFlavor?.shortName} Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {navLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.path}
              style={{
                color: isDarkMode ? '#94A3B8' : '#475569',
                fontSize: '0.875rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'color 0.15s ease'
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Controls: Theme Switcher Only */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDarkMode ? '#FBBF24' : '#0F172A',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.2s ease'
            }}
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '5rem 2rem 4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Status Pulse Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '99px',
          backgroundColor: `${primaryColor}18`,
          border: `1px solid ${primaryColor}40`,
          fontSize: '0.775rem',
          fontWeight: '700',
          color: primaryColor,
          marginBottom: '2rem',
          letterSpacing: '0.05em'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: primaryColor }} />
          <span>{settings?.hero_badge || activeFlavor?.name}</span>
        </div>

        {/* Main Title */}
        <h1 style={{
          fontSize: '3.75rem',
          fontWeight: '800',
          lineHeight: '1.08',
          letterSpacing: '-0.03em',
          maxWidth: '900px',
          margin: '0 auto 1.5rem auto',
          color: isDarkMode ? '#F8FAFC' : '#0F172A'
        }}>
          {settings?.hero_title || activeFlavor?.name}
        </h1>

        {/* Subtitle Description */}
        <p style={{
          fontSize: '1.15rem',
          lineHeight: '1.65',
          color: isDarkMode ? '#94A3B8' : '#64748B',
          maxWidth: '720px',
          margin: '0 auto 2.5rem auto'
        }}>
          {settings?.hero_description || activeFlavor?.description}
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <a
            href="#projects"
            style={{
              padding: '0.875rem 2rem',
              borderRadius: '99px',
              backgroundColor: primaryColor,
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '0.95rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: `0 8px 24px ${primaryColor}40`
            }}
          >
            <span>{settings?.hero_cta_text || 'Jelajahi Platform'}</span>
            <FiArrowRight />
          </a>

          <a
            href="#about"
            style={{
              padding: '0.875rem 2rem',
              borderRadius: '99px',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              color: isDarkMode ? '#F8FAFC' : '#0F172A',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              fontWeight: '600',
              fontSize: '0.95rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{settings?.hero_secondary_cta_text || 'Tentang Platform'}</span>
          </a>
        </div>

        {/* Footnote Note */}
        {settings?.hero_note && (
          <p style={{ fontSize: '0.825rem', color: isDarkMode ? '#64748B' : '#94A3B8', fontStyle: 'italic' }}>
            💡 {settings.hero_note}
          </p>
        )}
      </section>

      {/* KEY PERFORMANCE STATS */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem 4rem 2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: primaryColor, marginBottom: '0.25rem' }}>
              {settings?.stat_1_value || '100+'}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: isDarkMode ? '#94A3B8' : '#64748B' }}>
              {settings?.stat_1_label || 'Aktifitas Terhubung'}
            </div>
          </div>

          <div style={{
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: primaryColor, marginBottom: '0.25rem' }}>
              {settings?.stat_2_value || '99.9%'}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: isDarkMode ? '#94A3B8' : '#64748B' }}>
              {settings?.stat_2_label || 'Sistem Uptime Reliability'}
            </div>
          </div>

          <div style={{
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: primaryColor, marginBottom: '0.25rem' }}>
              {settings?.stat_3_value || '24/7'}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: isDarkMode ? '#94A3B8' : '#64748B' }}>
              {settings?.stat_3_label || 'Monitoring Real-time'}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS SHOWCASE */}
      <section id="projects" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '4rem 2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.75rem', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
            Project & Modul {activeFlavor?.shortName}
          </h2>
          <p style={{ color: isDarkMode ? '#94A3B8' : '#64748B', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
            Inisiatif dan proyek unggulan yang sedang berjalan di workspace platform ini.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.75rem'
        }}>
          {dummyProjects.map(proj => (
            <div key={proj.id} style={{
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              borderRadius: '16px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '99px',
                    backgroundColor: `${primaryColor}18`,
                    color: primaryColor
                  }}>
                    {proj.type}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#94A3B8' : '#64748B', fontWeight: '600' }}>
                    {proj.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                  {proj.title}
                </h3>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: `1px solid ${isDarkMode ? '#334155' : '#F1F5F9'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem', color: isDarkMode ? '#94A3B8' : '#64748B' }}>
                  <span>Progres Fitur</span>
                  <span>{proj.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: isDarkMode ? '#334155' : '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${proj.progress}%`, height: '100%', backgroundColor: primaryColor, borderRadius: '99px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '4rem 2rem'
      }}>
        <div style={{
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '24px',
          padding: '3.5rem 3rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
            {settings?.about_title || 'Tentang Platform'}
          </h2>
          <p style={{ fontSize: '1.1rem', fontWeight: '600', color: primaryColor, lineHeight: '1.6', marginBottom: '1.25rem' }}>
            {settings?.about_large_copy}
          </p>
          <p style={{ fontSize: '0.95rem', color: isDarkMode ? '#94A3B8' : '#64748B', lineHeight: '1.7', marginBottom: '1.75rem' }}>
            {settings?.about_description}
          </p>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: isDarkMode ? '#CBD5E1' : '#475569' }}>
            📍 {settings?.about_location || 'Operating Globally'}
          </div>
        </div>
      </section>

      {/* MODERN MULTI-COLUMN HIGH-END FOOTER */}
      <footer id="contact" style={{
        borderTop: `1px solid ${isDarkMode ? '#1E293B' : '#E2E8F0'}`,
        backgroundColor: isDarkMode ? '#090D16' : '#F1F5F9',
        padding: '5rem 2rem 2.5rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>

        {/* Ambient Bottom Glow */}
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}15 0%, rgba(0,0,0,0) 70%)`,
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 5 }}>
          
          {/* Main Footer Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem'
          }}>

            {/* COLUMN 1: BRANDING & SYSTEM STATUS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <DesktopalieMark size={34} style={{ color: isDarkMode ? '#F8FAFC' : '#0F172A' }} />
                <div>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '0.04em', color: isDarkMode ? '#F8FAFC' : '#0F172A', display: 'block', lineHeight: 1 }}>
                    {activeFlavor?.logoText || 'DESKTOPALIE'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: primaryColor, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {activeFlavor?.shortName} Portal
                  </span>
                </div>
              </div>

              <p style={{
                fontSize: '0.875rem',
                lineHeight: '1.65',
                color: isDarkMode ? '#94A3B8' : '#64748B',
                marginBottom: '1.5rem',
                maxWidth: '300px'
              }}>
                {activeFlavor?.description || 'Desktopalie Ekosistem digital terpadu untuk proyek, aplikasi enterprise, dan inovasi teknologi.'}
              </p>

              {/* System Live Operational Status Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '99px',
                backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.12)' : 'rgba(22, 163, 74, 0.1)',
                border: `1px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(22, 163, 74, 0.2)'}`,
                fontSize: '0.75rem',
                fontWeight: '700',
                color: isDarkMode ? '#4ADE80' : '#16A34A'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
                <span>Ekosistem System Operational</span>
              </div>
            </div>

            {/* COLUMN 2: QUICK NAVIGATION */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: isDarkMode ? '#F8FAFC' : '#0F172A', marginBottom: '1.25rem' }}>
                Navigasi Platform
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                {navLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.path}
                      style={{
                        color: isDarkMode ? '#94A3B8' : '#64748B',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                        fontWeight: '500'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = primaryColor}
                      onMouseOut={(e) => e.currentTarget.style.color = isDarkMode ? '#94A3B8' : '#64748B'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* COLUMN 3: EKOSISTEM SUB-PLATFORM */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: isDarkMode ? '#F8FAFC' : '#0F172A', marginBottom: '1.25rem' }}>
                Ekosistem Sub-Platform
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <li>
                  <a
                    href="https://desktopalie.my.id"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: isDarkMode ? '#94A3B8' : '#64748B',
                      textDecoration: 'none',
                      fontSize: '0.825rem',
                      fontWeight: '600'
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4f46e5' }} />
                    <span>Desktopalie Main Core</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://beta.desktopalie.my.id"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: isDarkMode ? '#94A3B8' : '#64748B',
                      textDecoration: 'none',
                      fontSize: '0.825rem',
                      fontWeight: '600'
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }} />
                    <span>Platform Beta (Logistics)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://gamma.desktopalie.my.id"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: isDarkMode ? '#94A3B8' : '#64748B',
                      textDecoration: 'none',
                      fontSize: '0.825rem',
                      fontWeight: '600'
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
                    <span>Platform Gamma (Streaming)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://delta.desktopalie.my.id"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: isDarkMode ? '#94A3B8' : '#64748B',
                      textDecoration: 'none',
                      fontSize: '0.825rem',
                      fontWeight: '600'
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d97706' }} />
                    <span>Platform Delta (Enterprise ERP)</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* COLUMN 4: CONTACT & SOCIAL HANDLES */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: isDarkMode ? '#F8FAFC' : '#0F172A', marginBottom: '1.25rem' }}>
                Kontak & Komunitas
              </h4>
              <p style={{ fontSize: '0.85rem', color: isDarkMode ? '#94A3B8' : '#64748B', marginBottom: '1rem' }}>
                {settings?.contact_title || 'Punya pertanyaan atau butuh integrasi custom?'}
              </p>

              <div style={{
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                color: primaryColor,
                marginBottom: '1.25rem',
                display: 'inline-block'
              }}>
                ✉️ {settings?.contact_email || 'hello@desktopalie.my.id'}
              </div>

              <div style={{ display: 'flex', gap: '0.85rem' }}>
                {settings?.github_url && (
                  <a
                    href={settings.github_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                      border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDarkMode ? '#F8FAFC' : '#0F172A',
                      fontSize: '1.1rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <FiGithub />
                  </a>
                )}
                {settings?.linkedin_url && (
                  <a
                    href={settings.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                      border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDarkMode ? '#F8FAFC' : '#0F172A',
                      fontSize: '1.1rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <FiLinkedin />
                  </a>
                )}
                {settings?.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                      border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isDarkMode ? '#F8FAFC' : '#0F172A',
                      fontSize: '1.1rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <FiInstagram />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* BOTTOM BAR: COPYRIGHT & COMPLIANCE */}
          <div style={{
            borderTop: `1px solid ${isDarkMode ? '#1E293B' : '#E2E8F0'}`,
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.775rem',
            color: isDarkMode ? '#64748B' : '#94A3B8'
          }}>
            <div>
              © {new Date().getFullYear()} <strong>{activeFlavor?.name}</strong>. Hak Cipta Dilindungi. Powered by Desktopalie Core Engine.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontWeight: '600' }}>
              <span>ISO 27001 Security Compliant</span>
              <span>•</span>
              <span>Encrypted SSL 256-bit</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
