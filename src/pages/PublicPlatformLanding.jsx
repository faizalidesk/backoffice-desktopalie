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
  FiActivity,
  FiCheck,
  FiHelpCircle,
  FiCpu,
  FiSliders,
  FiMessageSquare,
  FiAward,
  FiUsers,
  FiStar,
  FiSend,
  FiChevronRight,
  FiCode,
  FiDatabase,
  FiTerminal,
  FiTrendingUp,
  FiExternalLink
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
import NotificationBell from '../components/NotificationBell';

// SHADCN / UI COMPONENTS INTEGRATION
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export default function PublicPlatformLanding() {
  const { activeFlavor, flavorId } = useFlavor();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const isSubPlatform = flavorId !== 'platform1';
  const [googleLoading, setGoogleLoading] = useState(false);

  // Interactive Simulation Controls (shadcn Switch)
  const [simHardwareNvenc, setSimHardwareNvenc] = useState(true);
  const [simEdgeWaf, setSimEdgeWaf] = useState(true);
  const [simRealtimeSync, setSimRealtimeSync] = useState(true);
  const [simAiTelemetry, setSimAiTelemetry] = useState(true);

  // Interactive Quick Consultation Dialog (shadcn Dialog)
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultName, setConsultName] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [consultMessage, setConsultMessage] = useState('');
  const [consultSubmitting, setConsultSubmitting] = useState(false);

  const handleConsultSubmit = (e) => {
    e.preventDefault();
    if (!consultName.trim() || !consultEmail.trim() || !consultMessage.trim()) {
      toast.error('Mohon lengkapi seluruh formulir konsultasi.');
      return;
    }
    setConsultSubmitting(true);
    setTimeout(() => {
      setConsultSubmitting(false);
      setConsultOpen(false);
      toast.success('Pesan konsultasi enterprise berhasil dikirim! Tim kami akan menghubungi Anda segera.');
      setConsultName('');
      setConsultEmail('');
      setConsultMessage('');
    }, 800);
  };

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
        <section className="public-section-padding">
          <div className="public-card-container" style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 12px 32px rgba(15, 23, 42, 0.08)'
          }}>
            <div className="public-widget-header">
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: primaryColor, fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  <FiActivity /> Live Fleet & Cargo Telemetry
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
                  Smart Logistics Tracking Engine
                </h3>
              </div>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '99px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem', fontWeight: '700' }}>
                🟢 Live GPS Satellite Connected
              </span>
            </div>

            {/* Tracking Search Input */}
            <div className="public-widget-input-row">
              <input
                type="text"
                defaultValue="LOG-884920-JKT"
                placeholder="Enter Shipment Waybill / Container ID..."
                style={{
                  flex: 1,
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`,
                  color: isDarkMode ? '#ECFDF5' : '#0F172A',
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
                <div key={i} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC', border: `1px solid ${s.status === 'In Progress' ? primaryColor : (isDarkMode ? '#133829' : '#E2E8F0')}` }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: s.status === 'Completed' ? '#10B981' : (s.status === 'In Progress' ? primaryColor : 'var(--text-muted)') }}>
                    {s.status}
                  </div>
                  <div style={{ fontWeight: '800', fontSize: '0.875rem', color: isDarkMode ? '#ECFDF5' : '#0F172A', marginTop: '0.2rem' }}>
                    {s.step}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    {s.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Container Telemetry Details */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`, fontSize: '0.8rem', color: isDarkMode ? '#93C5AA' : '#64748B' }}>
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
        <section className="public-section-padding">
          <div className="public-card-container" style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 12px 32px rgba(15, 23, 42, 0.08)'
          }}>
            <div className="public-widget-header">
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: primaryColor, fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  <FiZap /> Real-Time Transcode Telemetry
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
                  AI Multi-Format Video Encoding Engine
                </h3>
              </div>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '99px', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', border: '1px solid rgba(139, 92, 246, 0.3)', fontSize: '0.75rem', fontWeight: '700' }}>
                🚀 Hardware Acceleration (NVENC Active)
              </span>
            </div>

            {/* Live Transcode Gauges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>GPU UTILIZATION</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: primaryColor, marginTop: '0.25rem' }}>68%</div>
                <div style={{ height: '6px', width: '100%', backgroundColor: `${primaryColor}25`, borderRadius: '99px', marginTop: '0.5rem', overflow: 'hidden' }}>
                  <div style={{ width: '68%', height: '100%', backgroundColor: primaryColor, borderRadius: '99px' }} />
                </div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>BITRATE STREAM</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#10B981', marginTop: '0.25rem' }}>14.8 Mbps</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>4K H.265 / AV1 Adaptive</div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>TRANSCODE SPEED</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#F59E0B', marginTop: '0.25rem' }}>4.2x FPS</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>250 FPS Real-time Render</div>
              </div>
            </div>

            {/* Preset Output Badges */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['4K 2160p H.265', '1080p 60fps H.264', '720p HD WebM', 'Audio AAC 320kbps'].map((preset, i) => (
                <span key={i} style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', backgroundColor: isDarkMode ? '#05130E' : '#F1F5F9', border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`, fontSize: '0.8rem', fontWeight: '700', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
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
        <section className="public-section-padding">
          <div className="public-card-container" style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 12px 32px rgba(15, 23, 42, 0.08)'
          }}>
            <div className="public-widget-header">
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: primaryColor, fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                  <FiShield /> Multi-Node Cluster Telemetry
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
                  Enterprise Cloud Infrastructure Monitor
                </h3>
              </div>
              <span style={{ padding: '0.35rem 0.85rem', borderRadius: '99px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem', fontWeight: '700' }}>
                🛡️ 99.99% SLA Operational
              </span>
            </div>

            {/* Cluster Nodes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {[
                { name: 'Cluster Node 01 (Jakarta)', status: 'Healthy', load: '32%', latency: '8ms' },
                { name: 'Cluster Node 02 (Singapore)', status: 'Healthy', load: '45%', latency: '14ms' },
                { name: 'Cluster Node 03 (Tokyo)', status: 'Healthy', load: '28%', latency: '35ms' }
              ].map((node, i) => (
                <div key={i} style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>{node.name}</span>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Load: <strong>{node.load}</strong> | Latency: <strong>{node.latency}</strong></div>
                  <div style={{ height: '5px', width: '100%', backgroundColor: `${primaryColor}25`, borderRadius: '99px', marginTop: '0.6rem', overflow: 'hidden' }}>
                    <div style={{ width: node.load, height: '100%', backgroundColor: primaryColor, borderRadius: '99px' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`, fontSize: '0.8rem', color: isDarkMode ? '#93C5AA' : '#64748B' }}>
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
      <section className="public-section-padding">
        <div className="public-card-container" style={{
          backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
          boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 12px 32px rgba(15, 23, 42, 0.08)'
        }}>
          <div className="public-widget-header">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: primaryColor, fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                <FiGlobe /> Developer Workspace & System Telemetry
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
                Desktopalie Core Ecosystem Status
              </h3>
            </div>
            <span style={{ padding: '0.35rem 0.85rem', borderRadius: '99px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.75rem', fontWeight: '700' }}>
              🟢 All Systems Operational
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>BUILD ENGINE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: primaryColor, marginTop: '0.25rem' }}>Vite 6.4</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>React 19 Core</div>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>DATABASE ENGINE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10B981', marginTop: '0.25rem' }}>Supabase DB</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PostgreSQL + RLS Enabled</div>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC', border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}` }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>EDGE LATENCY</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#F59E0B', marginTop: '0.25rem' }}>12 ms</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Asia-Pacific Edge CDN</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {['ReactJS', 'Vite', 'Supabase', 'PostgreSQL', 'Tailwind', 'Antigravity CLI'].map((tech, i) => (
              <span key={i} style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', backgroundColor: isDarkMode ? '#05130E' : '#F1F5F9', border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`, fontSize: '0.8rem', fontWeight: '700', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
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
      <section id="login-section" className="public-section-padding">
        <div className="public-direct-login-box" style={{
          backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
          boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.4)' : '0 12px 32px rgba(15, 23, 42, 0.08)',
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

          <div className="public-direct-login-flex">
            
            {/* Left Info Text */}
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: primaryColor, fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                <FiLock /> Direct Platform Portal Authentication
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.75rem 0', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
                Masuk ke Workspace Portal {activeFlavor?.name}
              </h2>
              <p style={{ color: isDarkMode ? '#93C5AA' : '#64748B', fontSize: '0.95rem', margin: 0, lineHeight: '1.6', maxWidth: '540px' }}>
                Akses langsung ke ruang kerja khusus {activeFlavor?.shortName}. Silakan login menggunakan akun Google terverifikasi atau kredensial email administrator Anda.
              </p>
            </div>

            {/* Right Interactive Form / Logged In Card */}
            <div style={{ width: '100%', maxWidth: '420px' }}>
              {user ? (
                <div style={{
                  padding: '1.75rem',
                  borderRadius: '16px',
                  backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
                  textAlign: 'center'
                }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1rem auto', overflow: 'hidden', border: `3px solid ${primaryColor}` }}>
                    <img
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`}
                      alt="Avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '800', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
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
                        border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`,
                        color: isDarkMode ? '#93C5AA' : '#64748B',
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
                  backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC',
                  border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`
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
                      backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
                      color: isDarkMode ? '#ECFDF5' : '#0F172A',
                      border: `1px solid ${isDarkMode ? '#133829' : '#CBD5E1'}`,
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
                    <div style={{ flex: 1, height: '1px', backgroundColor: isDarkMode ? '#133829' : '#E2E8F0' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>atau login portal</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: isDarkMode ? '#133829' : '#E2E8F0' }} />
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
      backgroundColor: isDarkMode ? '#05130E' : '#FAF9FC',
      color: isDarkMode ? '#ECFDF5' : '#0F172A',
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
        background: `radial-gradient(circle, ${primaryColor}22 0%, rgba(5, 19, 14, 0) 70%)`,
        pointerEvents: 'none'
      }} />

      {/* TOP PUBLIC NAVBAR HEADER */}
      <header className="public-header">
        {/* Left Brand Logo matching screenshot */}
        <div className="public-brand">
          <DesktopalieMark size={24} className="public-brand-mark" style={{ color: isDarkMode ? '#ECFDF5' : '#0F172A' }} />
          <span className="public-brand-title" style={{ color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
            {activeFlavor?.logoText || 'DESKTOPALIE'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="public-nav">
          {navLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.path}
              style={{
                color: isDarkMode ? '#93C5AA' : '#475569',
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
        <div className="public-header-actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="public-theme-btn"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
              color: isDarkMode ? '#FBBF24' : '#0F172A',
            }}
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>

          {isSubPlatform && (
            user ? (
              <div className="public-user-group">
                <NotificationBell primaryColor={primaryColor} />
                <img
                  src={user.user_metadata?.avatar_url || user.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}`}
                  alt="Avatar"
                  className="public-avatar"
                  style={{ border: `2px solid ${primaryColor}` }}
                />
                <button
                  type="button"
                  onClick={() => navigate('/portal')}
                  className="public-portal-btn"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 4px 14px ${primaryColor}40`
                  }}
                >
                  <span>Portal {activeFlavor?.shortName}</span>
                </button>
              </div>
            ) : (
              <div className="public-auth-group">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="public-login-btn"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 4px 14px ${primaryColor}40`
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
      <section id="hero" className="public-hero-section">
        {/* Status Pulse Badge */}
        <div className="public-hero-badge" style={{
          backgroundColor: `${primaryColor}18`,
          border: `1px solid ${primaryColor}40`,
          color: primaryColor,
        }}>
          <span style={{ backgroundColor: primaryColor }} />
          <span>{settings?.hero_badge || activeFlavor?.name}</span>
        </div>

        {/* Main Title */}
        <h1 className="public-hero-title" style={{
          color: isDarkMode ? '#ECFDF5' : '#0F172A'
        }}>
          {settings?.hero_title || activeFlavor?.name}
        </h1>

        {/* Subtitle Description */}
        <p className="public-hero-desc" style={{
          color: isDarkMode ? '#93C5AA' : '#64748B',
        }}>
          {settings?.hero_description || activeFlavor?.description}
        </p>

        {/* CTA Buttons */}
        <div className="public-hero-cta-row">
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
                backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
                color: isDarkMode ? '#ECFDF5' : '#0F172A',
                border: `1.5px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
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
              backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
              color: isDarkMode ? '#ECFDF5' : '#0F172A',
              border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
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
          <p style={{ fontSize: '0.825rem', color: isDarkMode ? '#58836F' : '#94A3B8', fontStyle: 'italic' }}>
            💡 {settings.hero_note}
          </p>
        )}
      </section>

      {/* KEY PERFORMANCE STATS */}
      <section className="public-section-padding">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem'
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            borderRadius: '16px',
            padding: '1.75rem 1.25rem',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: primaryColor, marginBottom: '0.25rem' }}>
              {settings?.stat_1_value || '100+'}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: isDarkMode ? '#93C5AA' : '#64748B' }}>
              {settings?.stat_1_label || 'Aktifitas Terhubung'}
            </div>
          </div>

          <div style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            borderRadius: '16px',
            padding: '1.75rem 1.25rem',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: primaryColor, marginBottom: '0.25rem' }}>
              {settings?.stat_2_value || '99.9%'}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: isDarkMode ? '#93C5AA' : '#64748B' }}>
              {settings?.stat_2_label || 'Sistem Uptime Reliability'}
            </div>
          </div>

          <div style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            borderRadius: '16px',
            padding: '1.75rem 1.25rem',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '2.25rem', fontWeight: '800', color: primaryColor, marginBottom: '0.25rem' }}>
              {settings?.stat_3_value || '24/7'}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: isDarkMode ? '#93C5AA' : '#64748B' }}>
              {settings?.stat_3_label || 'Monitoring Real-time'}
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC INTERACTIVE PLATFORM TELEMETRY WIDGET */}
      {renderPlatformWidget()}

      {/* FEATURED PROJECTS SHOWCASE */}
      <section id="projects" className="public-section-padding">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
            Project & Modul {activeFlavor?.shortName}
          </h2>
          <p style={{ color: isDarkMode ? '#93C5AA' : '#64748B', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
            Inisiatif dan proyek unggulan yang sedang berjalan di workspace platform ini.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {dummyProjects.map(proj => (
            <div key={proj.id} style={{
              backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
              borderRadius: '16px',
              padding: '1.5rem 1.25rem',
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
                  <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#93C5AA' : '#64748B', fontWeight: '600' }}>
                    {proj.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
                  {proj.title}
                </h3>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: `1px solid ${isDarkMode ? '#133829' : '#F1F5F9'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem', color: isDarkMode ? '#93C5AA' : '#64748B' }}>
                  <span>Progres Fitur</span>
                  <span>{proj.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: isDarkMode ? '#133829' : '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${proj.progress}%`, height: '100%', backgroundColor: primaryColor, borderRadius: '99px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="public-section-padding">
        <div className="public-about-box" style={{
          backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
          borderRadius: '24px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
            <Badge variant="secondary" className="px-3 py-1 text-xs font-bold uppercase tracking-wider">
              {activeFlavor?.shortName} Architecture
            </Badge>
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', marginBottom: '0.85rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
            {settings?.about_title || 'Tentang Platform & Ekosistem Digital'}
          </h2>
          <p style={{ fontSize: '1.05rem', fontWeight: '600', color: primaryColor, lineHeight: '1.6', marginBottom: '1.15rem' }}>
            {settings?.about_large_copy || 'Infrastruktur modern dengan multi-tenant workspace dan sistem keamanan tingkat enterprise.'}
          </p>
          <p style={{ fontSize: '0.925rem', color: isDarkMode ? '#93C5AA' : '#64748B', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            {settings?.about_description || 'Dibangun dengan fondasi React 19, Vite 6, Supabase PostgreSQL RLS, dan Tailwind CSS + shadcn/ui untuk memberikan performa ultra cepat serta fleksibilitas modul lintas industri.'}
          </p>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: isDarkMode ? '#ECFDF5' : '#475569' }}>
            📍 {settings?.about_location || 'Operating Globally & Cloud Edge Distributed'}
          </div>
        </div>
      </section>

      {/* SECTION 1: SHADCN INTERACTIVE ARCHITECTURE & CAPABILITIES TABS */}
      <section id="capabilities" className="public-section-padding">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
            <Badge variant="outline" className="px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
              ✦ SHADCN / UI INTERACTIVE TABS
            </Badge>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.65rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
            Kapabilitas & Arsitektur Sistem {activeFlavor?.shortName}
          </h2>
          <p style={{ color: isDarkMode ? '#93C5AA' : '#64748B', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto' }}>
            Eksplorasi modul inti, standar keamanan tinggi, dan sinkronisasi data real-time berbasis arsitektur multi-tenant.
          </p>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Tabs defaultValue="core" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1.5 rounded-2xl bg-slate-100 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
              <TabsTrigger value="core" className="py-2.5 rounded-xl font-bold text-xs md:text-sm">
                🏢 Multi-Tenant
              </TabsTrigger>
              <TabsTrigger value="security" className="py-2.5 rounded-xl font-bold text-xs md:text-sm">
                🛡️ Zero-Trust RLS
              </TabsTrigger>
              <TabsTrigger value="realtime" className="py-2.5 rounded-xl font-bold text-xs md:text-sm">
                ⚡ Edge Sync
              </TabsTrigger>
              <TabsTrigger value="ai" className="py-2.5 rounded-xl font-bold text-xs md:text-sm">
                🧠 Agentic AI
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: MULTI-TENANT */}
            <TabsContent value="core" className="mt-4">
              <Card className="border border-slate-200 dark:border-[#133829] bg-white dark:bg-[#091E16] shadow-sm rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-emerald-50">
                      Multi-Tenant Workspace & Brand Flavoring Engine
                    </CardTitle>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      Layer 1 & 4 Architecture
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-emerald-300/70">
                    Sistem flavor dinamis yang mampu memuat 4 platform independen dalam 1 basis kode terpadu.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-700 dark:text-emerald-100/90">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
                      <div className="font-bold text-slate-900 dark:text-emerald-50 mb-1 flex items-center gap-2">
                        <FiCheckCircle className="text-emerald-500" /> Isolasi Subdomain Otomatis
                      </div>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                        Deteksi subdomain cerdas untuk `beta.`, `gamma.`, dan `delta.` dengan konfigurasi tema dan portal terpisah.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
                      <div className="font-bold text-slate-900 dark:text-emerald-50 mb-1 flex items-center gap-2">
                        <FiCheckCircle className="text-emerald-500" /> State Caching Offline Resilient
                      </div>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                        Fallback penyimpanan instan di browser `localStorage` menjamin situs tetap dapat diakses meski koneksi lambat.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: SECURITY */}
            <TabsContent value="security" className="mt-4">
              <Card className="border border-slate-200 dark:border-[#133829] bg-white dark:bg-[#091E16] shadow-sm rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-emerald-50">
                      PostgreSQL Row Level Security (RLS) & PKCE Auth
                    </CardTitle>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                      Layer 8 Security
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-emerald-300/70">
                    Otorisasi berbasis token JWT kriptografi dengan kebijakan akses RLS PostgreSQL tingkat baris.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-700 dark:text-emerald-100/90">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
                      <div className="font-bold text-slate-900 dark:text-emerald-50 mb-1 flex items-center gap-2">
                        <FiShield className="text-blue-500" /> PKCE OAuth 2.0 & Email Security
                      </div>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                        Pemeriksaan token terotentikasi Supabase Auth dengan auto-refresh token tanpa jeda sesi.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
                      <div className="font-bold text-slate-900 dark:text-emerald-50 mb-1 flex items-center gap-2">
                        <FiShield className="text-blue-500" /> Strict Maintenance Quarantine
                      </div>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                        Penguncian gerbang login dan portal platform secara instan saat sistem masuk ke status pemeliharaan.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: REALTIME EDGE */}
            <TabsContent value="realtime" className="mt-4">
              <Card className="border border-slate-200 dark:border-[#133829] bg-white dark:bg-[#091E16] shadow-sm rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-emerald-50">
                      Cloudflare & Vercel Edge Global Realtime Sync
                    </CardTitle>
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                      Layer 10 & 11 CDN
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-emerald-300/70">
                    Jaringan distribusi edge multi-region dengan latensi rata-rata di bawah 20ms di Asia Pasifik.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-700 dark:text-emerald-100/90">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
                      <div className="font-bold text-slate-900 dark:text-emerald-50 mb-1 flex items-center gap-2">
                        <FiZap className="text-purple-500" /> Live PostgreSQL Broadcast
                      </div>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                        Sinkronisasi telemetri armada, status transcode, dan transaksi keuangan seketika via WebSocket channel.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
                      <div className="font-bold text-slate-900 dark:text-emerald-50 mb-1 flex items-center gap-2">
                        <FiZap className="text-purple-500" /> Static Brotli Assets Caching
                      </div>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                        Bundle Vite 6 yang dioptimasi dengan kompresi Brotli & Gzip tingkat tinggi untuk waktu muat instan.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: AGENTIC AI */}
            <TabsContent value="ai" className="mt-4">
              <Card className="border border-slate-200 dark:border-[#133829] bg-white dark:bg-[#091E16] shadow-sm rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-emerald-50">
                      Agentic AI & Obsidian Bi-Directional Knowledge
                    </CardTitle>
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                      Layer 13 Intelligence
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-emerald-300/70">
                    Asisten AI bawaan dan sinkronisasi graf pengetahuan dua arah dengan Obsidian Vault lokal.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-700 dark:text-emerald-100/90">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
                      <div className="font-bold text-slate-900 dark:text-emerald-50 mb-1 flex items-center gap-2">
                        <FiCpu className="text-amber-500" /> Embedded Agentic AI Drawer
                      </div>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                        Panel pendamping cerdas yang terintegrasi di bawah navbar Backoffice untuk riset kode dan otomasi tugas.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
                      <div className="font-bold text-slate-900 dark:text-emerald-50 mb-1 flex items-center gap-2">
                        <FiCpu className="text-amber-500" /> Bi-Directional Vault Recovery
                      </div>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                        Sinkronisasi catatan PRD & dokumentasi sistem langsung dengan file markdown lokal di komputer pengguna.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* SECTION 2: SHADCN INTERACTIVE LIVE TELEMETRY SIMULATOR WITH SWITCH & TOOLTIPS */}
      <section id="telemetry-sim" className="public-section-padding">
        <TooltipProvider>
          <div className="public-card-container" style={{
            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
            borderRadius: '24px',
            padding: '2.25rem',
            boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.5)' : '0 12px 32px rgba(15, 23, 42, 0.08)'
          }}>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
                  <FiSliders /> SIMULASI KONTROL INFRASTRUKTUR SHADCN
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-emerald-50 m-0">
                  Live System Telemetry & Module Simulator
                </h3>
              </div>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-bold px-3 py-1">
                🟢 Mode Interaktif Aktif
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Column: Interactive shadcn Switches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-900 dark:text-emerald-50 flex items-center gap-2">
                      Hardware Acceleration NVENC
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200">
                            <FiHelpCircle className="w-3.5 h-3.5" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mengaktifkan akselerasi GPU NVIDIA untuk encoding ultra cepat.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-emerald-300/70">
                      Tingkatkan performa render multi-channel hingga 4.2x FPS.
                    </div>
                  </div>
                  <Switch checked={simHardwareNvenc} onCheckedChange={setSimHardwareNvenc} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-900 dark:text-emerald-50 flex items-center gap-2">
                      Cloudflare Edge WAF Shield
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200">
                            <FiHelpCircle className="w-3.5 h-3.5" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Melindungi API gateway dari serangan DDoS & bot scraping.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-emerald-300/70">
                      Rate limiting 100 req/s dan filtering ancaman zero-day.
                    </div>
                  </div>
                  <Switch checked={simEdgeWaf} onCheckedChange={setSimEdgeWaf} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-900 dark:text-emerald-50 flex items-center gap-2">
                      PostgreSQL Realtime Channel
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200">
                            <FiHelpCircle className="w-3.5 h-3.5" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Live data push tanpa perlu polling berulang.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-emerald-300/70">
                      Broadcast update data armada, video, dan status keuangan instan.
                    </div>
                  </div>
                  <Switch checked={simRealtimeSync} onCheckedChange={setSimRealtimeSync} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#05130E] border border-slate-200 dark:border-[#133829]">
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-slate-900 dark:text-emerald-50 flex items-center gap-2">
                      AI Predictive Telemetry
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-emerald-200">
                            <FiHelpCircle className="w-3.5 h-3.5" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Prediksi beban server dan anomali trafik otomatis.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-emerald-300/70">
                      Optimasi routing armada dan analisis kepuasan member.
                    </div>
                  </div>
                  <Switch checked={simAiTelemetry} onCheckedChange={setSimAiTelemetry} />
                </div>
              </div>

              {/* Right Column: Live Gauges dynamically computed */}
              <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-bold text-sm flex items-center gap-2 text-emerald-400">
                    <FiActivity /> SIMULATED SYSTEM METRICS
                  </div>
                  <span className="text-xs text-slate-400">Auto Refreshed (Live)</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-xs font-bold text-slate-400">LATENCY JARINGAN</div>
                    <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                      {simEdgeWaf ? '12 ms' : '85 ms'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {simEdgeWaf ? '⚡ Ultra Optimized' : '⚠️ Unshielded'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-xs font-bold text-slate-400">THROUGHPUT SPEED</div>
                    <div className="text-2xl font-extrabold text-blue-400 mt-1">
                      {simHardwareNvenc ? '250 FPS' : '45 FPS'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {simHardwareNvenc ? '🚀 Hardware GPU' : '🐢 Software CPU'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-xs font-bold text-slate-400">REALTIME CHANNELS</div>
                    <div className="text-2xl font-extrabold text-purple-400 mt-1">
                      {simRealtimeSync ? 'Connected' : 'Polling'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {simRealtimeSync ? '🟢 WebSocket Active' : '🟡 5s Fallback'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-xs font-bold text-slate-400">AI HEALTH SCORE</div>
                    <div className="text-2xl font-extrabold text-amber-400 mt-1">
                      {simAiTelemetry ? '99.8%' : '78.4%'}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {simAiTelemetry ? '✨ Optimal Health' : '⚠️ Manual Monitoring'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </section>

      {/* SECTION 3: SHADCN VERIFIED TESTIMONIALS & PLATFORM ARCHITECTS */}
      <section id="reviews" className="public-section-padding">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
            <Badge variant="secondary" className="px-3 py-1 text-xs font-bold uppercase tracking-wider">
              ✦ EKOSISTEM & ULASAN PENGGUNA
            </Badge>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.65rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
            Dipercaya Oleh Para Profesional & Enterprise
          </h2>
          <p style={{ color: isDarkMode ? '#93C5AA' : '#64748B', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto' }}>
            Pengalaman nyata dari tim developer, manajer logistik, dan pimpinan proyek yang menggunakan Desktopalie Backoffice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1 */}
          <Card className="border border-slate-200 dark:border-[#133829] bg-white dark:bg-[#091E16] shadow-sm rounded-2xl flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border-2 border-emerald-500/30">
                  <AvatarFallback className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-sm">
                    FA
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-emerald-50">Faiz Ali</CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-emerald-300/70">Lead Architect & Creator</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-emerald-100/80 leading-relaxed">
              "Arsitektur 13-Layer dan sistem isolasi multi-tenant di Desktopalie memungkinkan kami meluncurkan portal sub-platform mandiri dalam hitungan menit tanpa friksi."
            </CardContent>
            <CardFooter className="pt-0 flex items-center justify-between text-xs text-slate-400 dark:text-emerald-300/60 border-t border-slate-100 dark:border-[#133829] pt-3">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Desktopalie Core</span>
              <div className="flex text-amber-400">★★★★★</div>
            </CardFooter>
          </Card>

          {/* Card 2 */}
          <Card className="border border-slate-200 dark:border-[#133829] bg-white dark:bg-[#091E16] shadow-sm rounded-2xl flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border-2 border-emerald-500/30">
                  <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-sm">
                    BL
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-emerald-50">Budi Logistics</CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-emerald-300/70">Fleet Ops Director</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-emerald-100/80 leading-relaxed">
              "Platform Beta memberikan pemantauan real-time GPS armada kami dengan dashboard yang sangat responsif di layar monitor kantor maupun laptop di lapangan."
            </CardContent>
            <CardFooter className="pt-0 flex items-center justify-between text-xs text-slate-400 dark:text-emerald-300/60 border-t border-slate-100 dark:border-[#133829] pt-3">
              <span className="font-semibold text-blue-600 dark:text-blue-400">Beta Logistics</span>
              <div className="flex text-amber-400">★★★★★</div>
            </CardFooter>
          </Card>

          {/* Card 3 */}
          <Card className="border border-slate-200 dark:border-[#133829] bg-white dark:bg-[#091E16] shadow-sm rounded-2xl flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border-2 border-emerald-500/30">
                  <AvatarFallback className="bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-bold text-sm">
                    DE
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-emerald-50">Delta Financial Group</CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-emerald-300/70">Chief Security Officer</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-emerald-100/80 leading-relaxed">
              "Kepatuhan ISO 27001 dan isolasi data per-platform membuat kami yakin mempercayakan audit transaksi keuangan enterprise di platform Delta."
            </CardContent>
            <CardFooter className="pt-0 flex items-center justify-between text-xs text-slate-400 dark:text-emerald-300/60 border-t border-slate-100 dark:border-[#133829] pt-3">
              <span className="font-semibold text-amber-600 dark:text-amber-400">Delta ERP</span>
              <div className="flex text-amber-400">★★★★★</div>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* SECTION 4: SHADCN INTERACTIVE FAQ ACCORDION */}
      <section id="faq" className="public-section-padding">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
            <Badge variant="outline" className="px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
              ✦ PERTANYAAN UMUM (FAQ)
            </Badge>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.65rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
            Pertanyaan yang Sering Diajukan
          </h2>
          <p style={{ color: isDarkMode ? '#93C5AA' : '#64748B', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto' }}>
            Pelajari lebih lanjut mengenai arsitektur sistem, keamanan data, dan mekanisme operasional ekosistem Desktopalie.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border border-slate-200 dark:border-[#133829] bg-white dark:bg-[#091E16] p-6 rounded-2xl shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-base font-bold text-slate-900 dark:text-emerald-50 hover:no-underline">
                  Bagaimana sistem isolasi multi-tenant di Desktopalie bekerja?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 dark:text-emerald-200/80 leading-relaxed pt-2">
                  Setiap platform (Alpha Main, Beta Logistics, Gamma Video, Delta ERP) memiliki identifikasi scoped flavor ID terisolasi. Data transaksi, proyek, dan setelan maintenance dikelola secara mandiri dengan perlindungan PostgreSQL Row Level Security (RLS) sehingga data antar platform tidak akan tercampur.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-base font-bold text-slate-900 dark:text-emerald-50 hover:no-underline">
                  Apakah platform tetap aman saat mode maintenance aktif?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 dark:text-emerald-200/80 leading-relaxed pt-2">
                  Ya, $100\%$ aman. Saat mode pemeliharaan diaktifkan dari Backoffice, seluruh pintu masuk publik (termasuk halaman portal login dan endpoint modul) secara ketat diblokir dan dialihkan ke layar pemeliharaan resmi dengan countdown timer real-time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-base font-bold text-slate-900 dark:text-emerald-50 hover:no-underline">
                  Teknologi apa saja yang menjadi pilar frontend & UI?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 dark:text-emerald-200/80 leading-relaxed pt-2">
                  Frontend dibangun menggunakan <strong>React 19</strong>, <strong>Vite 6</strong>, <strong>Tailwind CSS</strong>, serta pustaka komponen <strong>shadcn/ui</strong> berbasis Radix UI untuk menjamin aksesibilitas penuh, animasi halus, dan responsivitas adaptif di berbagai ukuran monitor.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-base font-bold text-slate-900 dark:text-emerald-50 hover:no-underline">
                  Bagaimana cara melakukan konsultasi integrasi enterprise khusus?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 dark:text-emerald-200/80 leading-relaxed pt-2">
                  Anda dapat menekan tombol <strong>"Konsultasi Enterprise"</strong> di bawah ini untuk membuka formulir dialog interaktif, atau mengirim email langsung ke tim kami di <code>hello@desktopalie.my.id</code>.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </div>
      </section>

      {/* SECTION 5: SHADCN ENTERPRISE CALL TO ACTION WITH MODAL DIALOG */}
      <section className="public-section-padding">
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '3rem 2rem',
          borderRadius: '24px',
          background: isDarkMode 
            ? 'linear-gradient(135deg, #091E16 0%, #05130E 100%)' 
            : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
          border: `1px solid ${isDarkMode ? '#133829' : '#C7D2FE'}`,
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
            <Badge className="bg-primary text-white font-bold px-3 py-1 text-xs">
              ✦ KONSULTASI & INTEGRASI SISTEM
            </Badge>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.75rem', color: isDarkMode ? '#ECFDF5' : '#0F172A' }}>
            Siap Membangun Platform Digital Bersama Desktopalie?
          </h2>
          <p style={{ color: isDarkMode ? '#93C5AA' : '#475569', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Tingkatkan efisiensi operasional dengan ruang kerja terpadu, telemetri live, dan keamanan terenkripsi.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* SHADCN DIALOG MODAL TRIGGER */}
            <Dialog open={consultOpen} onOpenChange={setConsultOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="rounded-full font-bold px-8 shadow-lg hover:shadow-xl transition-all" style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}>
                  <FiMessageSquare className="mr-2" />
                  Mulai Konsultasi Enterprise
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px] bg-white dark:bg-[#091E16] border-slate-200 dark:border-[#133829]">
                <form onSubmit={handleConsultSubmit}>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-emerald-50">
                      Konsultasi Enterprise & Solusi Kustom
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 dark:text-emerald-300/70">
                      Sampaikan kebutuhan proyek atau integrasi platform Anda kepada tim arsitek kami.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-emerald-200 block mb-1">
                        Nama Lengkap / Organisasi
                      </label>
                      <Input 
                        placeholder="Misal: Faiz Ali (Enterprise Lead)" 
                        value={consultName} 
                        onChange={(e) => setConsultName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-emerald-200 block mb-1">
                        Email Resmi
                      </label>
                      <Input 
                        type="email" 
                        placeholder="nama@perusahaan.com" 
                        value={consultEmail} 
                        onChange={(e) => setConsultEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-emerald-200 block mb-1">
                        Rincian Kebutuhan & Ekspektasi
                      </label>
                      <textarea
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        rows={3}
                        placeholder="Jelaskan kebutuhan integrasi sistem Anda..."
                        value={consultMessage}
                        onChange={(e) => setConsultMessage(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="secondary" onClick={() => setConsultOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" disabled={consultSubmitting} style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}>
                      {consultSubmitting ? 'Mengirim...' : <><FiSend className="mr-2" /> Kirim Permintaan</>}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <a
              href="#about"
              className="px-6 py-2.5 rounded-full font-bold text-sm text-slate-700 dark:text-emerald-200 bg-white/80 dark:bg-[#05130E]/80 border border-slate-300 dark:border-[#133829] hover:bg-slate-50 dark:hover:bg-[#091E16] transition-all no-underline inline-flex items-center gap-2"
            >
              <span>Pelajari Fitur Lengkap</span>
              <FiChevronRight />
            </a>
          </div>
        </div>
      </section>

      {/* MODERN MULTI-COLUMN HIGH-END FOOTER WITH SHADCN SEPARATOR & TOOLTIPS */}
      <footer id="contact" className="public-footer" style={{
        borderTop: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
        backgroundColor: isDarkMode ? '#05130E' : '#F8FAFC',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <TooltipProvider>
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

          <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 5, padding: '4rem 1.5rem 2rem 1.5rem' }}>
            
            {/* Main Footer Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '3rem',
              marginBottom: '3rem'
            }}>

              {/* COLUMN 1: BRANDING & SYSTEM STATUS */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <DesktopalieMark size={36} style={{ color: isDarkMode ? '#ECFDF5' : '#0F172A' }} />
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '0.04em', color: isDarkMode ? '#ECFDF5' : '#0F172A', display: 'block', lineHeight: 1 }}>
                      {activeFlavor?.logoText || 'DESKTOPALIE'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: primaryColor, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {activeFlavor?.shortName} Platform Hub
                    </span>
                  </div>
                </div>

                <p style={{
                  fontSize: '0.875rem',
                  lineHeight: '1.65',
                  color: isDarkMode ? '#93C5AA' : '#64748B',
                  marginBottom: '1.5rem',
                  maxWidth: '300px'
                }}>
                  {activeFlavor?.description || 'Desktopalie ekosistem digital terpadu untuk proyek, aplikasi enterprise, dan otomasi cerdas.'}
                </p>

                {/* System Live Operational Status Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '99px',
                  backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.12)' : 'rgba(22, 163, 74, 0.1)',
                  border: `1px solid ${isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(22, 163, 74, 0.2)'}`,
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: isDarkMode ? '#34D399' : '#16A34A'
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                  <span>Ekosistem 100% Operational</span>
                </div>
              </div>

              {/* COLUMN 2: QUICK NAVIGATION */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: isDarkMode ? '#ECFDF5' : '#0F172A', marginBottom: '1.25rem' }}>
                  Navigasi Halaman
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  {navLinks.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.path}
                        style={{
                          color: isDarkMode ? '#93C5AA' : '#64748B',
                          textDecoration: 'none',
                          transition: 'color 0.15s ease',
                          fontWeight: '500'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = primaryColor}
                        onMouseOut={(e) => e.currentTarget.style.color = isDarkMode ? '#93C5AA' : '#64748B'}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="#capabilities"
                      style={{ color: isDarkMode ? '#93C5AA' : '#64748B', textDecoration: 'none', fontWeight: '500' }}
                    >
                      Kapabilitas Sistem
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      style={{ color: isDarkMode ? '#93C5AA' : '#64748B', textDecoration: 'none', fontWeight: '500' }}
                    >
                      FAQ & Pengetahuan
                    </a>
                  </li>
                </ul>
              </div>

              {/* COLUMN 3: EKOSISTEM SUB-PLATFORM */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: isDarkMode ? '#ECFDF5' : '#0F172A', marginBottom: '1.25rem' }}>
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
                        color: isDarkMode ? '#93C5AA' : '#64748B',
                        textDecoration: 'none',
                        fontSize: '0.825rem',
                        fontWeight: '600'
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
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
                        color: isDarkMode ? '#93C5AA' : '#64748B',
                        textDecoration: 'none',
                        fontSize: '0.825rem',
                        fontWeight: '600'
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
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
                        color: isDarkMode ? '#93C5AA' : '#64748B',
                        textDecoration: 'none',
                        fontSize: '0.825rem',
                        fontWeight: '600'
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
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
                        color: isDarkMode ? '#93C5AA' : '#64748B',
                        textDecoration: 'none',
                        fontSize: '0.825rem',
                        fontWeight: '600'
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                      <span>Platform Delta (Enterprise ERP)</span>
                    </a>
                  </li>
                </ul>
              </div>

              {/* COLUMN 4: CONTACT & SOCIAL HANDLES WITH TOOLTIPS */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: isDarkMode ? '#ECFDF5' : '#0F172A', marginBottom: '1.25rem' }}>
                  Kontak & Komunitas
                </h4>
                <p style={{ fontSize: '0.85rem', color: isDarkMode ? '#93C5AA' : '#64748B', marginBottom: '1rem' }}>
                  {settings?.contact_title || 'Punya pertanyaan atau butuh integrasi custom?'}
                </p>

                <div style={{
                  backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
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

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {settings?.github_url && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={settings.github_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
                            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isDarkMode ? '#ECFDF5' : '#0F172A',
                            fontSize: '1.1rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <FiGithub />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent><p>GitHub Repository</p></TooltipContent>
                    </Tooltip>
                  )}

                  {settings?.linkedin_url && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={settings.linkedin_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
                            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isDarkMode ? '#ECFDF5' : '#0F172A',
                            fontSize: '1.1rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <FiLinkedin />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent><p>LinkedIn Profile</p></TooltipContent>
                    </Tooltip>
                  )}

                  {settings?.instagram_url && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={settings.instagram_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: isDarkMode ? '#091E16' : '#FFFFFF',
                            border: `1px solid ${isDarkMode ? '#133829' : '#E2E8F0'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isDarkMode ? '#ECFDF5' : '#0F172A',
                            fontSize: '1.1rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <FiInstagram />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent><p>Instagram Community</p></TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

            </div>

            {/* SHADCN SEPARATOR */}
            <Separator className="my-6 bg-slate-200 dark:bg-[#133829]" />

            {/* BOTTOM BAR: COPYRIGHT & COMPLIANCE */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              fontSize: '0.775rem',
              color: isDarkMode ? '#58836F' : '#94A3B8'
            }}>
              <div>
                © {new Date().getFullYear()} <strong>{activeFlavor?.name}</strong>. Hak Cipta Dilindungi. Powered by Desktopalie Core Engine.
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontWeight: '600' }}>
                <span className="flex items-center gap-1.5"><FiShield className="text-emerald-500" /> ISO 27001 Security Compliant</span>
                <span>•</span>
                <span>Encrypted SSL 256-bit</span>
                <span>•</span>
                <span>shadcn/ui v2.5 Enhanced</span>
              </div>
            </div>

          </div>
        </TooltipProvider>
      </footer>

    </div>
  );
}
