import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFlavor } from '../context/FlavorContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiLock, FiMail, FiArrowRight, FiAlertCircle, FiMoon, FiSun, FiGlobe, FiShield, FiCpu, FiTruck } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import DesktopalieMark from '../components/DesktopalieMark';

export default function SubPlatformLogin() {
  const { platformName } = useParams();
  const { activeFlavor, flavorId, switchFlavor } = useFlavor();
  const { isDarkMode, toggleTheme } = useTheme();
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (platformName) {
      if (platformName.toLowerCase() === 'beta') switchFlavor('platform2');
      else if (platformName.toLowerCase() === 'gamma') switchFlavor('platform3');
      else if (platformName.toLowerCase() === 'delta') switchFlavor('platform4');
    }
  }, [platformName]);

  const primaryColor = activeFlavor?.theme?.colorPrimary || '#3B82F6';

  const targetPortalPath = '/portal';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      toast.error('Masukkan email dan kata sandi');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      toast.success(`Selamat datang di Portal ${activeFlavor?.name || 'Workspace'}!`);
      navigate(targetPortalPath);
    } catch (err) {
      console.error('SubPlatform Login Error:', err);
      const msg = err.message || 'Gagal masuk. Periksa kembali email & kata sandi Anda.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle(targetPortalPath);
    } catch (err) {
      console.error('Google Sign In Error:', err);
      toast.error('Gagal login via Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: isDarkMode ? '#0F172A' : '#FAF9FC',
      color: isDarkMode ? '#F8FAFC' : '#0F172A',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {/* Background Ambient Glow Effects matching Main Website Login */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${primaryColor}25 0%, rgba(15, 23, 42, 0) 70%)`,
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${primaryColor}15 0%, rgba(15, 23, 42, 0) 70%)`,
        pointerEvents: 'none'
      }} />

      {/* TOP NAVBAR HEADER */}
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
        {/* Left Brand Logo matching Main Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <DesktopalieMark size={30} style={{ color: primaryColor, flexShrink: 0 }} />
          <span style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '0.08em', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
            {activeFlavor?.logoText?.toUpperCase() || 'DESKTOPALIE'}
          </span>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <a href="/" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>Home</a>
          <a href="#features" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>Features</a>
          <a href="#about" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>About</a>
          <a href="#contact" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>Contact</a>
        </nav>

        {/* Right Controls: Theme Switcher & Pill Login Indicator */}
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
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>

          <div style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '99px',
            backgroundColor: primaryColor,
            color: '#FFFFFF',
            fontSize: '0.85rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: `0 4px 12px ${primaryColor}40`
          }}>
            <span>Portal Auth</span>
            <FiArrowRight style={{ fontSize: '0.85rem' }} />
          </div>
        </div>
      </header>

      {/* MAIN HERO & LOGIN FORM SECTION (2-COLUMN GRID MATCHING MAIN LOGIN) */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 2rem 4rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
        gap: '4rem',
        alignItems: 'center',
        position: 'relative',
        zIndex: 5
      }}>
        {/* LEFT COLUMN: HERO TYPOGRAPHY & SIGN IN FORM */}
        <div>
          {/* Status Pulse Tag matching Main Login */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '99px',
            backgroundColor: `${primaryColor}18`,
            border: `1px solid ${primaryColor}40`,
            fontSize: '0.725rem',
            fontWeight: '700',
            letterSpacing: '0.08em',
            color: primaryColor,
            marginBottom: '1.5rem',
            textTransform: 'uppercase'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: primaryColor }} />
            <span>PLATFORM {activeFlavor?.shortName?.toUpperCase()} PORTAL WORKSPACE</span>
          </div>

          <h1 style={{
            fontSize: '3.25rem',
            fontWeight: '800',
            color: isDarkMode ? '#F8FAFC' : '#0F172A',
            lineHeight: '1.08',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            {activeFlavor?.name}
          </h1>

          <p style={{
            fontSize: '1rem',
            lineHeight: '1.65',
            color: isDarkMode ? '#94A3B8' : '#64748B',
            marginBottom: '2rem',
            maxWidth: '520px'
          }}>
            {activeFlavor?.description}
          </p>

          {/* SIGN IN FORM CARD */}
          <div style={{
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' : '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
            marginBottom: '2rem',
            maxWidth: '480px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A', marginBottom: '1.25rem' }}>
              Sign In to {activeFlavor?.shortName} Workspace
            </h3>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '12px',
                backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
                color: isDarkMode ? '#F8FAFC' : '#0F172A',
                border: `1px solid ${isDarkMode ? '#475569' : '#CBD5E1'}`,
                fontWeight: '700',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                marginBottom: '1.25rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <FaGoogle style={{ color: '#EA4335', fontSize: '1.1rem' }} />
              <span>{googleLoading ? 'Memproses OAuth...' : 'Sign in with Google Account'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>atau login email</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }} />
            </div>

            {errorMessage && (
              <div style={{
                backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#FFF1F2',
                border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : '#FECDD3'}`,
                color: isDarkMode ? '#FCA5A5' : '#E11D48',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FiAlertCircle style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.15rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: isDarkMode ? '#94A3B8' : '#64748B', marginBottom: '0.4rem' }}>
                  Email Administrator / Pengguna
                </label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: isDarkMode ? '#64748B' : '#94A3B8' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@domain.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.75rem',
                      borderRadius: '12px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#CBD5E1'}`,
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                      color: isDarkMode ? '#F8FAFC' : '#0F172A'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: isDarkMode ? '#94A3B8' : '#64748B', marginBottom: '0.4rem' }}>
                  Kata Sandi
                </label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: isDarkMode ? '#64748B' : '#94A3B8' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.75rem',
                      borderRadius: '12px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#CBD5E1'}`,
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                      color: isDarkMode ? '#F8FAFC' : '#0F172A'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.85rem 1.85rem',
                    borderRadius: '99px',
                    backgroundColor: primaryColor,
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: `0 8px 20px ${primaryColor}40`,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{submitting ? 'Memproses...' : `Masuk Portal ${activeFlavor?.shortName}`}</span>
                  <FiArrowRight />
                </button>

                <Link to="/" style={{ fontSize: '0.85rem', fontWeight: '600', color: primaryColor, textDecoration: 'none' }}>
                  Kembali ke Landing ➔
                </Link>
              </div>
            </form>
          </div>

          {/* Bottom Monospace Tagline matching Main Login */}
          <div style={{
            fontSize: '0.7rem',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.05em',
            color: isDarkMode ? '#64748B' : '#94A3B8',
            borderTop: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            paddingTop: '1rem',
            maxWidth: '480px'
          }}>
            INTEGRATED PLATFORM FLAVORING SYSTEM — POWERED BY DESKTOPALIE ECOSYSTEM.
          </div>
        </div>

        {/* RIGHT COLUMN: 3D GRAPHICAL MOCKUP WINDOW (MATCHING MAIN LOGIN LAYOUT) */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            borderRadius: '24px',
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            padding: '1.75rem',
            boxShadow: isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 20px 40px -15px rgba(15, 23, 42, 0.1)',
            position: 'relative'
          }}>
            {/* Window Top Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                {activeFlavor?.name} Workspace Preview
              </span>
            </div>

            {/* Platform Dedicated Graphic / Features Mockup */}
            <div style={{
              borderRadius: '16px',
              backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              padding: '2rem 1.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: `${primaryColor}20`,
                color: primaryColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                fontSize: '2rem'
              }}>
                {flavorId === 'platform2' ? <FiTruck /> : (flavorId === 'platform3' ? <FiCpu /> : <FiShield />)}
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                {activeFlavor?.shortName} Dedicated Telemetry & Portal
              </h4>

              <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#94A3B8' : '#64748B', lineHeight: '1.55', margin: '0 0 1.5rem 0' }}>
                Akses mandiri ke modul real-time telemetry, kontrol keamanan terenkripsi, dan analitik performa {activeFlavor?.shortName}.
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '99px',
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
                fontWeight: '700',
                fontSize: '0.775rem'
              }}>
                🟢 Live Server Cluster Online
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
