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
        maxWidth: '1560px',
        margin: '0 auto',
        padding: '1.75rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Left Brand Logo matching Main Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <DesktopalieMark size={36} style={{ color: primaryColor, flexShrink: 0 }} />
          <span style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '0.08em', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
            {activeFlavor?.logoText?.toUpperCase() || 'DESKTOPALIE'}
          </span>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.25rem' }}>
          <a href="/" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none' }}>Home</a>
          <a href="#features" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none' }}>Features</a>
          <a href="#about" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none' }}>About</a>
          <a href="#contact" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none' }}>Contact</a>
        </nav>

        {/* Right Controls: Theme Switcher & Pill Login Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            type="button"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDarkMode ? '#FBBF24' : '#0F172A',
              fontSize: '1.2rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>

          <div style={{
            padding: '0.6rem 1.4rem',
            borderRadius: '99px',
            backgroundColor: primaryColor,
            color: '#FFFFFF',
            fontSize: '0.95rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: `0 4px 12px ${primaryColor}40`
          }}>
            <span>Portal Auth</span>
            <FiArrowRight style={{ fontSize: '0.95rem' }} />
          </div>
        </div>
      </header>

      {/* MAIN HERO & LOGIN FORM SECTION (2-COLUMN GRID MATCHING MAIN LOGIN) */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: '1560px',
        margin: '0 auto',
        padding: '2.5rem 2.5rem 5rem 2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '4.5rem',
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
            gap: '0.6rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '99px',
            backgroundColor: `${primaryColor}18`,
            border: `1px solid ${primaryColor}40`,
            fontSize: '0.825rem',
            fontWeight: '700',
            letterSpacing: '0.08em',
            color: primaryColor,
            marginBottom: '1.75rem',
            textTransform: 'uppercase'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: primaryColor }} />
            <span>PLATFORM {activeFlavor?.shortName?.toUpperCase()} PORTAL WORKSPACE</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.75rem, 4vw, 4.25rem)',
            fontWeight: '800',
            color: isDarkMode ? '#F8FAFC' : '#0F172A',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem'
          }}>
            {activeFlavor?.name}
          </h1>

          <p style={{
            fontSize: '1.125rem',
            lineHeight: '1.7',
            color: isDarkMode ? '#94A3B8' : '#64748B',
            marginBottom: '2.25rem',
            maxWidth: '580px'
          }}>
            {activeFlavor?.description}
          </p>

          {/* SIGN IN FORM CARD */}
          <div style={{
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '28px',
            padding: '2.5rem',
            boxShadow: isDarkMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' : '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
            marginBottom: '2.5rem',
            maxWidth: '540px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: isDarkMode ? '#F8FAFC' : '#0F172A', marginBottom: '1.5rem' }}>
              Sign In to {activeFlavor?.shortName} Workspace
            </h3>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || submitting}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '14px',
                border: `1px solid ${isDarkMode ? '#475569' : '#CBD5E1'}`,
                backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                color: isDarkMode ? '#F8FAFC' : '#0F172A',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <FaGoogle style={{ color: '#EA4335', fontSize: '1.1rem' }} />
              <span>{googleLoading ? 'Menghubungkan ke Google...' : `Sign in with Google`}</span>
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
              color: isDarkMode ? '#64748B' : '#94A3B8',
              fontSize: '0.8rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }} />
              <span>OR EMAIL</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }} />
            </div>

            {errorMessage && (
              <div style={{
                backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.15)' : '#FFF1F2',
                border: `1px solid ${isDarkMode ? 'rgba(239, 68, 68, 0.3)' : '#FECDD3'}`,
                color: isDarkMode ? '#FCA5A5' : '#E11D48',
                padding: '0.85rem 1.15rem',
                borderRadius: '14px',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <FiAlertCircle style={{ flexShrink: 0, fontSize: '1.1rem' }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.35rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: isDarkMode ? '#94A3B8' : '#64748B', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                  Work Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ position: 'absolute', left: '1.15rem', top: '50%', transform: 'translateY(-50%)', color: isDarkMode ? '#64748B' : '#94A3B8', fontSize: '1.15rem' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@organization.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.95rem 1.25rem 0.95rem 3.2rem',
                      borderRadius: '14px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#CBD5E1'}`,
                      fontSize: '1rem',
                      outline: 'none',
                      backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                      color: isDarkMode ? '#F8FAFC' : '#0F172A',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', color: isDarkMode ? '#94A3B8' : '#64748B', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: '1.15rem', top: '50%', transform: 'translateY(-50%)', color: isDarkMode ? '#64748B' : '#94A3B8', fontSize: '1.15rem' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{
                      width: '100%',
                      padding: '0.95rem 1.25rem 0.95rem 3.2rem',
                      borderRadius: '14px',
                      border: `1px solid ${isDarkMode ? '#475569' : '#CBD5E1'}`,
                      fontSize: '1rem',
                      outline: 'none',
                      backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                      color: isDarkMode ? '#F8FAFC' : '#0F172A',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.95rem 2.25rem',
                    borderRadius: '99px',
                    backgroundColor: primaryColor,
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: `0 8px 20px ${primaryColor}40`,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{submitting ? 'Authenticating...' : `Enter ${activeFlavor?.shortName} Portal`}</span>
                  <FiArrowRight style={{ fontSize: '1.1rem' }} />
                </button>

                <Link to="/login" style={{ fontSize: '0.95rem', fontWeight: '600', color: primaryColor, textDecoration: 'none' }}>
                  Main Backoffice ➔
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE FEATURE SHOWCASE */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
          
          <div style={{
            width: '100%',
            maxWidth: '620px',
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            boxShadow: isDarkMode ? '0 30px 60px -15px rgba(0, 0, 0, 0.6)' : '0 30px 60px -15px rgba(15, 23, 42, 0.12)',
            position: 'relative'
          }}>
            {/* Platform Dedicated Graphic / Features Mockup */}
            <div style={{
              borderRadius: '18px',
              backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              padding: '2.5rem 2rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: `${primaryColor}20`,
                color: primaryColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                fontSize: '2.25rem'
              }}>
                {flavorId === 'platform2' ? <FiTruck /> : (flavorId === 'platform3' ? <FiCpu /> : <FiShield />)}
              </div>

              <h4 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0 0 0.75rem 0', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                {activeFlavor?.shortName} Dedicated Telemetry & Portal
              </h4>

              <p style={{ fontSize: '0.95rem', color: isDarkMode ? '#94A3B8' : '#64748B', lineHeight: '1.65', margin: '0 0 1.75rem 0' }}>
                Akses mandiri ke modul real-time telemetry, kontrol keamanan terenkripsi, dan analitik performa {activeFlavor?.shortName}.
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '99px',
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
                fontWeight: '700',
                fontSize: '0.85rem'
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
