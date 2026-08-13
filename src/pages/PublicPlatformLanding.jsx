import { useEffect, useState } from 'react';
import { useFlavor } from '../context/FlavorContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { backofficeService } from '../services/backofficeService';
import { useNavigate, Link } from 'react-router-dom';
import './MaintenancePage.css';
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
import {
  FaBell,
  FaCheckCircle,
  FaGithub,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaLock,
  FaMoon,
  FaPaperPlane,
  FaPause,
  FaPlay,
  FaSun,
  FaTerminal
} from 'react-icons/fa';
import DesktopalieMark from '../components/DesktopalieMark';

export default function PublicPlatformLanding() {
  const { activeFlavor, flavorId } = useFlavor();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const isSubPlatform = flavorId !== 'platform1';
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle('/portal');
    } catch (err) {
      console.error('Google Sign In Error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const getInitialMaintenance = () => {
    try {
      const cached = localStorage.getItem(`desktopalie_maintenance_settings_${flavorId}`) ||
                     localStorage.getItem(`desktopalie_maint_${flavorId}`);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      // ignore
    }
    return null;
  };

  const getInitialSettings = () => {
    try {
      const cached = localStorage.getItem(`desktopalie_settings_${flavorId}`);
      if (cached) return JSON.parse(cached);
    } catch (e) {
      // ignore
    }
    return null;
  };

  const [settings, setSettings] = useState(getInitialSettings);
  const [maintenance, setMaintenance] = useState(getInitialMaintenance);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [landingData, maintData] = await Promise.all([
          backofficeService.getLandingPageSettings(flavorId),
          backofficeService.getMaintenanceSettings(flavorId)
        ]);
        if (isMounted) {
          setSettings(landingData);
          setMaintenance(maintData);
          
          if (landingData) {
            try {
              localStorage.setItem(`desktopalie_settings_${flavorId}`, JSON.stringify(landingData));
            } catch (e) {
              // ignore
            }
          }

          const isEnabled = Boolean(
            maintData && (
              maintData.is_enabled === true ||
              maintData.is_enabled === 'true' ||
              maintData.is_enabled === 1 ||
              maintData.is_enabled === '1'
            )
          );

          try {
            if (isEnabled) {
              localStorage.setItem(`desktopalie_maintenance_settings_${flavorId}`, JSON.stringify(maintData));
              localStorage.setItem(`desktopalie_maint_${flavorId}`, JSON.stringify(maintData));
            } else {
              localStorage.removeItem(`desktopalie_maintenance_settings_${flavorId}`);
              localStorage.removeItem(`desktopalie_maint_${flavorId}`);
            }
          } catch (e) {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to load platform data:', err);
      }
    }

    loadData();

    const handleStorageChange = (e) => {
      if (!e || !e.key || e.key.includes('maintenance')) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [flavorId]);

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
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
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

  const INITIAL_LOGS = [
    "[SYSTEM] Maintenance mode initiated globally.",
    "[DATABASE] PostgreSQL RLS policies indexing complete.",
    "[SECURITY] SSL certificates and PKCE token validators refreshed.",
    "[OPTIMIZATION] Vite 8 assets pre-bundled & compressed.",
    "[DEPLOYMENT] Syncing edge servers across Asia Pacific...",
  ];

  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [isLogStreaming, setIsLogStreaming] = useState(true);
  const [maintEmail, setMaintEmail] = useState("");
  const [maintSubscribed, setMaintSubscribed] = useState(false);

  // Simulated Live Log Stream
  useEffect(() => {
    if (!isLogStreaming) return undefined;
    const pool = [
      "[CACHE] Purging CDN cache nodes...",
      "[NETWORK] Latency health check 14ms (OK).",
      "[REFACTOR] Modernizing UI v2.5 micro-interactions...",
      "[STORAGE] Verifying Supabase bucket storage integrity...",
      "[SYNC] Realtime subscription channels synchronized.",
    ];
    const stream = setInterval(() => {
      const nextLog = pool[Math.floor(Math.random() * pool.length)];
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev.slice(-5), `[${timestamp}] ${nextLog.replace(/\[.*?\]\s*/, "")}`]);
    }, 3200);
    return () => clearInterval(stream);
  }, [isLogStreaming]);

  const handleMaintSubscribe = (e) => {
    e.preventDefault();
    if (!maintEmail.trim()) return;
    setMaintSubscribed(true);
  };

  // RENDER MAINTENANCE SCREEN IF MAINTENANCE MODE IS ACTIVE FOR THIS PLATFORM FLAVOR
  if (isMaintenanceActive) {
    const brandName = activeFlavor?.logoText || "Desktopalie";

    return (
      <div className="desktopalie maintenance-landing" data-theme={isDarkMode ? "dark" : "light"}>
        <div className="page-noise" aria-hidden="true" />

        {/* Unified Site Header */}
        <header className="site-header">
          <div className="site-wrap header-inner">
            <Link to="/" className="brand" aria-label={`${brandName} home`}>
              <DesktopalieMark className="brand-mark" style={{ color: primaryColor }} />
              <span>{brandName}</span>
            </Link>

            <nav className="site-nav" aria-label="Primary navigation">
              <Link to="/">Home</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/experiments">Experiments</Link>
              <Link to="/about">About</Link>
              <Link to="/services">Services</Link>
              <Link to="/contact">Contact</Link>
            </nav>

            <div className="header-actions">
              <button
                className="theme-button"
                onClick={toggleTheme}
                aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              >
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
              <span className="maint-locked-chip">
                <FaLock /> Site Locked
              </span>
            </div>
          </div>
        </header>

        <main id="top">
          {/* Hero Section matching Landing Page */}
          <section className="hero-section maint-hero-section">
            <div className="hero-glow hero-glow-one" aria-hidden="true" />
            <div className="hero-glow hero-glow-two" aria-hidden="true" />
            <div className="site-wrap maint-hero-wrap">
              <div className="maint-hero-copy">
                <div className="status-pill">
                  <span /> {activeFlavor?.shortName?.toUpperCase()} PLATFORM SYSTEM UPGRADE IN PROGRESS
                </div>
                <h1>
                  {maintenance?.title || "We are upgrading our workspace."}
                </h1>
                <p>
                  {maintenance?.message || `${brandName} is currently undergoing a core architecture refactor, database maintenance, and UI v2.5 performance enhancements. We will be back online shortly with a faster and more responsive digital experience.`}
                </p>

                {/* Countdown Timer Widget */}
                <div className="maint-timer-box">
                  <span className="timer-tag" style={{ color: primaryColor }}>ESTIMATED TIME UNTIL COMPLETION</span>
                  <div className="timer-display">
                    {timeLeft.days > 0 && (
                      <>
                        <div className="t-unit">
                          <strong>{String(timeLeft.days).padStart(2, "0")}</strong>
                          <span>DAYS</span>
                        </div>
                        <span className="t-colon" style={{ color: primaryColor }}>:</span>
                      </>
                    )}
                    <div className="t-unit">
                      <strong>{String(timeLeft.hours).padStart(2, "0")}</strong>
                      <span>HOURS</span>
                    </div>
                    <span className="t-colon" style={{ color: primaryColor }}>:</span>
                    <div className="t-unit">
                      <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong>
                      <span>MINUTES</span>
                    </div>
                    <span className="t-colon" style={{ color: primaryColor }}>:</span>
                    <div className="t-unit">
                      <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong>
                      <span>SECONDS</span>
                    </div>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="maint-steps-row">
                  <div className="step-badge done">
                    <FaCheckCircle /> <span>Database Indexing</span>
                  </div>
                  <div className="step-badge done">
                    <FaCheckCircle /> <span>Security Audit</span>
                  </div>
                  <div className="step-badge active" style={{ color: primaryColor, backgroundColor: `${primaryColor}18`, borderColor: `${primaryColor}30` }}>
                    <span className="pulse-circle" style={{ backgroundColor: primaryColor }} /> <span>UI v2.5 Deployment</span>
                  </div>
                </div>

                {/* Email Subscription Form */}
                <div className="maint-subscribe-card">
                  <h3>Get notified when we are back online</h3>
                  {maintSubscribed ? (
                    <div className="sub-success">
                      <FaCheckCircle />
                      <span>Thank you! We will email you as soon as the upgrade is complete.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleMaintSubscribe} className="maint-sub-form">
                      <div className="sub-input-row">
                        <FaBell className="sub-icon" />
                        <input
                          type="email"
                          required
                          placeholder="Enter your email address..."
                          value={maintEmail}
                          onChange={(e) => setMaintEmail(e.target.value)}
                        />
                        <button type="submit" className="sub-btn">
                          Notify me <FaPaperPlane />
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Admin Bypass Button */}
                {maintenance?.allow_admin_bypass && (
                  <div style={{ marginTop: '1.25rem' }}>
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
                      <FaLock style={{ fontSize: '0.8rem' }} />
                      <span>Portal Admin Backoffice (Bypass)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Visual Browser Window & Live Terminal */}
              <div className="maint-visual-wrap">
                <div className="browser-window">
                  <div className="browser-topbar">
                    <div className="browser-dots">
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="browser-url">{typeof window !== 'undefined' ? window.location.hostname : 'desktopalie.my.id'}/maintenance</div>
                    <span className="browser-plus">+</span>
                  </div>

                  <div className="browser-content maint-browser-content">
                    <div className="maint-terminal-panel">
                      <div className="terminal-header">
                        <div className="t-left">
                          <FaTerminal />
                          <span>System Refactor Logs</span>
                        </div>
                        <button
                          className="t-stream-toggle"
                          type="button"
                          onClick={() => setIsLogStreaming(!isLogStreaming)}
                          style={{ color: primaryColor, backgroundColor: `${primaryColor}18` }}
                        >
                          {isLogStreaming ? <FaPause /> : <FaPlay />}
                          <span>{isLogStreaming ? "Pause" : "Live"}</span>
                        </button>
                      </div>
                      <div className="terminal-logs-body">
                        {logs.map((logLine, idx) => (
                          <div key={idx} className="terminal-log-line">
                            <span className="t-prefix" style={{ color: primaryColor }}>&gt;</span> {logLine}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="floating-code" style={{ color: primaryColor }}>
                  <span>await</span> system.upgrade(<b>v2.5</b>);
                </div>
                <div className="floating-tag">MAINTENANCE MODE ✦</div>
              </div>
            </div>
          </section>
        </main>

        {/* Unified Site Footer */}
        <footer className="site-footer">
          <div className="site-wrap footer-inner">
            <Link to="/" className="brand">
              <DesktopalieMark className="brand-mark" style={{ color: primaryColor }} />
              <span>{brandName}</span>
            </Link>
            <p>Projects, experiments, and digital creations.</p>
            <div className="social-links">
              {settings?.github_url && (
                <a href={settings.github_url} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <FaGithub />
                </a>
              )}
              {settings?.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <FaLinkedinIn />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
              )}
            </div>
            <span className="copyright">© {new Date().getFullYear()} {brandName.toUpperCase()}</span>
          </div>
        </footer>
      </div>
    );
  }

  const renderPlatformWidget = () => {
    // PLATFORM 2: BETA - SMART LOGISTICS & FREIGHT TRACKING WIDGET
    if (flavorId === 'platform2') {
      return (
        <section style={{ maxWidth: '1280px', margin: '0 auto 4rem auto', padding: '0 2rem' }}>
          <div style={{
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '20px',
            padding: '2rem 2.25rem',
            boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 12px 32px rgba(15, 23, 42, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: primaryColor, fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  <FiActivity /> Live Fleet & Cargo Telemetry
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                  Smart Logistics Tracking Engine
                </h3>
              </div>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '99px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem', fontWeight: '700' }}>
                🟢 Live GPS Satellite Connected
              </span>
            </div>

            {/* Tracking Search Input */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', maxWidth: '600px' }}>
              <input
                type="text"
                defaultValue="LOG-884920-JKT"
                placeholder="Enter Shipment Waybill / Container ID..."
                style={{
                  flex: 1,
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                  color: isDarkMode ? '#F8FAFC' : '#0F172A',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="button"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  backgroundColor: primaryColor,
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: `0 4px 14px ${primaryColor}40`
                }}
              >
                Track Cargo
              </button>
            </div>

            {/* Cargo Journey Progress Bar */}
            <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { step: '1. Port Pickup', status: 'Completed', time: '08:30 WIB' },
                { step: '2. Customs Clearance', status: 'Completed', time: '10:15 WIB' },
                { step: '3. In-Transit Cargo', status: 'In Progress', time: 'Active Now' },
                { step: '4. Destination Hub', status: 'Pending', time: 'ETA 14:00' }
              ].map((s, i) => (
                <div key={i} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${s.status === 'In Progress' ? primaryColor : (isDarkMode ? '#334155' : '#E2E8F0')}` }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: s.status === 'Completed' ? '#10B981' : (s.status === 'In Progress' ? primaryColor : 'var(--text-muted)') }}>
                    {s.status}
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '0.875rem', color: isDarkMode ? '#F8FAFC' : '#0F172A', marginTop: '0.2rem' }}>
                    {s.step}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {s.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Container Telemetry Details */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`, fontSize: '0.8rem', color: isDarkMode ? '#94A3B8' : '#64748B' }}>
              <span>🌡️ Container Temp: <strong>4.2 °C (Cold Chain OK)</strong></span>
              <span>📍 Location: <strong>Tanjung Priok, Jakarta (S 6°6'12" E 106°53'45")</strong></span>
              <span>⚡ Carrier Speed: <strong>45 km/h</strong></span>
            </div>
          </div>
        </section>
      );
    }

    // PLATFORM 3: GAMMA - AI VIDEO TRANSCODER & STREAM MONITOR WIDGET
    if (flavorId === 'platform3') {
      return (
        <section style={{ maxWidth: '1280px', margin: '0 auto 4rem auto', padding: '0 2rem' }}>
          <div style={{
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '20px',
            padding: '2rem 2.25rem',
            boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 12px 32px rgba(15, 23, 42, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: primaryColor, fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  <FiZap /> Real-Time Transcode Telemetry
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                  AI Multi-Format Video Encoding Engine
                </h3>
              </div>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '99px', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', border: '1px solid rgba(139, 92, 246, 0.3)', fontSize: '0.75rem', fontWeight: '700' }}>
                🚀 Hardware Acceleration (NVENC Active)
              </span>
            </div>

            {/* Live Transcode Gauges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>GPU UTILIZATION</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: primaryColor, marginTop: '0.25rem' }}>68%</div>
                <div style={{ height: '6px', width: '100%', backgroundColor: `${primaryColor}25`, borderRadius: '99px', marginTop: '0.5rem', overflow: 'hidden' }}>
                  <div style={{ width: '68%', height: '100%', backgroundColor: primaryColor, borderRadius: '99px' }} />
                </div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>BITRATE STREAM</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10B981', marginTop: '0.25rem' }}>14.8 Mbps</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>4K H.265 / AV1 Adaptive</div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>TRANSCODE SPEED</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#F59E0B', marginTop: '0.25rem' }}>4.2x FPS</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>250 FPS Real-time Render</div>
              </div>
            </div>

            {/* Preset Output Badges */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['4K 2160p H.265', '1080p 60fps H.264', '720p HD WebM', 'Audio AAC 320kbps'].map((preset, i) => (
                <span key={i} style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', backgroundColor: isDarkMode ? '#0F172A' : '#F1F5F9', border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`, fontSize: '0.8rem', fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                  🎬 {preset}
                </span>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // PLATFORM 4: DELTA - CLOUD INFRASTRUCTURE & CLUSTER HEALTH WIDGET
    if (flavorId === 'platform4') {
      return (
        <section style={{ maxWidth: '1280px', margin: '0 auto 4rem auto', padding: '0 2rem' }}>
          <div style={{
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '20px',
            padding: '2rem 2.25rem',
            boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 12px 32px rgba(15, 23, 42, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: primaryColor, fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  <FiShield /> Multi-Node Cluster Telemetry
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                  Enterprise Cloud Infrastructure Monitor
                </h3>
              </div>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '99px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem', fontWeight: '700' }}>
                🛡️ 99.99% SLA Operational
              </span>
            </div>

            {/* Cluster Nodes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {[
                { name: 'Cluster Node 01 (Jakarta)', status: 'Healthy', load: '32%', latency: '8ms' },
                { name: 'Cluster Node 02 (Singapore)', status: 'Healthy', load: '45%', latency: '14ms' },
                { name: 'Cluster Node 03 (Tokyo)', status: 'Healthy', load: '28%', latency: '35ms' }
              ].map((node, i) => (
                <div key={i} style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>{node.name}</span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Load: <strong>{node.load}</strong> | Latency: <strong>{node.latency}</strong></div>
                  <div style={{ height: '5px', width: '100%', backgroundColor: `${primaryColor}25`, borderRadius: '99px', marginTop: '0.6rem', overflow: 'hidden' }}>
                    <div style={{ width: node.load, height: '100%', backgroundColor: primaryColor, borderRadius: '99px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`, fontSize: '0.8rem', color: isDarkMode ? '#94A3B8' : '#64748B' }}>
              <span>⚙️ Active Microservices: <strong>24 / 24 Healthy</strong></span>
              <span>💾 DB Connections: <strong>38 / 100 Active</strong></span>
              <span>🔐 SSL TLS 1.3: <strong>Valid (256-bit AES)</strong></span>
            </div>
          </div>
        </section>
      );
    }

    // PLATFORM 1: MAIN DESKTOPALIE - LIVE DEVELOPER PROFILE & SYSTEM WIDGET
    return (
      <section style={{ maxWidth: '1280px', margin: '0 auto 4rem auto', padding: '0 2rem' }}>
        <div style={{
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '20px',
          padding: '2rem 2.25rem',
          boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 12px 32px rgba(15, 23, 42, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: primaryColor, fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                <FiGlobe /> Developer Workspace & System Telemetry
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                Desktopalie Core Ecosystem Status
              </h3>
            </div>
            <span style={{ padding: '0.35rem 0.85rem', borderRadius: '99px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem', fontWeight: '700' }}>
              🟢 All Systems Operational
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>BUILD ENGINE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: primaryColor, marginTop: '0.25rem' }}>Vite 6.4</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>React 19 Core</div>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>DATABASE ENGINE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10B981', marginTop: '0.25rem' }}>Supabase DB</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PostgreSQL + RLS Enabled</div>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>EDGE LATENCY</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#F59E0B', marginTop: '0.25rem' }}>12 ms</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Asia-Pacific Edge CDN</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {['ReactJS', 'Vite', 'Supabase', 'PostgreSQL', 'Tailwind', 'Antigravity CLI'].map((tech, i) => (
              <span key={i} style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', backgroundColor: isDarkMode ? '#0F172A' : '#F1F5F9', border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`, fontSize: '0.8rem', fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                ⚡ {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderEmbeddedPlatformLoginCard = () => {
    if (!isSubPlatform) return null;

    const targetPortalPath = flavorId === 'platform2' ? '/beta/portal' : (flavorId === 'platform3' ? '/gamma/portal' : '/delta/portal');

    return (
      <section id="login-section" style={{ maxWidth: '1280px', margin: '0 auto 4rem auto', padding: '0 2rem' }}>
        <div style={{
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 12px 32px rgba(15, 23, 42, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Accent Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${primaryColor}, #8B5CF6)`
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            
            {/* Left Info Text */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: primaryColor, fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                <FiLock /> Direct Platform Portal Authentication
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.75rem 0', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                Masuk ke Workspace Portal {activeFlavor?.name}
              </h2>
              <p style={{ color: isDarkMode ? '#94A3B8' : '#64748B', fontSize: '0.95rem', margin: 0, lineHeight: '1.6', maxWidth: '540px' }}>
                Akses langsung ke ruang kerja khusus {activeFlavor?.shortName}. Silakan login menggunakan akun Google terverifikasi atau kredensial email administrator Anda.
              </p>
            </div>

            {/* Right Interactive Form / Logged In Card */}
            <div style={{ width: '100%', maxWidth: '420px' }}>
              {user ? (
                <div style={{
                  padding: '1.75rem',
                  borderRadius: '16px',
                  backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                  textAlign: 'center'
                }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1rem auto', overflow: 'hidden', border: `3px solid ${primaryColor}` }}>
                    <img
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`}
                      alt="Avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                    {user.user_metadata?.full_name || user.email}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: '700', marginBottom: '1.25rem' }}>
                    🟢 Anda Sudah Terhubung ke {activeFlavor?.shortName}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => navigate(targetPortalPath)}
                      style={{
                        padding: '0.85rem 1.5rem',
                        borderRadius: '12px',
                        backgroundColor: primaryColor,
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: '800',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: `0 6px 20px ${primaryColor}40`
                      }}
                    >
                      <span>Buka Workspace Portal {activeFlavor?.shortName}</span>
                      <FiArrowRight />
                    </button>

                    <button
                      type="button"
                      onClick={logout}
                      style={{
                        padding: '0.65rem',
                        borderRadius: '10px',
                        backgroundColor: 'transparent',
                        border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                        color: isDarkMode ? '#94A3B8' : '#64748B',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Keluar / Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: '1.75rem',
                  borderRadius: '16px',
                  backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`
                }}>
                  {/* Google Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                      color: isDarkMode ? '#F8FAFC' : '#0F172A',
                      border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.65rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <FaGoogle style={{ color: '#EA4335', fontSize: '1.1rem' }} />
                    <span>{googleLoading ? 'Memproses Google...' : 'Masuk via Google (Auto Sync)'}</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: 'var(--text-muted)' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>atau login portal</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }} />
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(flavorId === 'platform2' ? '/beta/login' : (flavorId === 'platform3' ? '/gamma/login' : '/delta/login'))}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      backgroundColor: primaryColor,
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: `0 4px 14px ${primaryColor}35`
                    }}
                  >
                    <FiLock />
                    <span>Halaman Login Dedicated {activeFlavor?.shortName}</span>
                    <FiArrowRight />
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    );
  };

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
      <header className="public-header" style={{
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
        {/* Left Brand Logo matching screenshot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <DesktopalieMark size={24} style={{ color: isDarkMode ? '#F8FAFC' : '#0F172A', flexShrink: 0 }} />
          <span style={{
            fontSize: '0.9rem',
            fontWeight: '800',
            letterSpacing: '0.08em',
            color: isDarkMode ? '#F8FAFC' : '#0F172A',
            textTransform: 'uppercase',
            lineHeight: 1
          }}>
            {activeFlavor?.logoText || 'DESKTOPALIE'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="public-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
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

        {/* Right Controls: Theme Switcher & Prominent Google Sign-In Button on Top Navbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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

          {isSubPlatform && (
            user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img
                  src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`}
                  alt="Avatar"
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${primaryColor}`, objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => navigate('/portal')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 1.15rem',
                    borderRadius: '99px',
                    backgroundColor: primaryColor,
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    boxShadow: `0 4px 14px ${primaryColor}40`
                  }}
                >
                  <span>Portal {activeFlavor?.shortName}</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '99px',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    border: '1.5px solid #CBD5E1',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FaGoogle style={{ color: '#EA4335', fontSize: '1rem' }} />
                  <span>{googleLoading ? 'Memproses...' : 'Sign in with Google'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '99px',
                    backgroundColor: primaryColor,
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <FiLock />
                  <span>Login</span>
                </button>
              </div>
            )
          )}
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

          {/* Google Login Button on Sub-platform Hero */}
          {isSubPlatform && !user && (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              style={{
                padding: '0.875rem 2rem',
                borderRadius: '99px',
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                color: isDarkMode ? '#F8FAFC' : '#0F172A',
                border: `1.5px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
              }}
            >
              <FaGoogle style={{ color: '#EA4335', fontSize: '1.1rem' }} />
              <span>{googleLoading ? 'Redirecting...' : 'Login Google (Auto-Sync Supabase)'}</span>
            </button>
          )}

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

      {/* DYNAMIC INTERACTIVE PLATFORM TELEMETRY WIDGET */}
      {renderPlatformWidget()}

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
