import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFlavor } from '../context/FlavorContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiLock, FiMail, FiArrowRight, FiMoon, FiSun, FiLayers, FiShield, FiCheckCircle } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import DesktopalieMark from '../components/DesktopalieMark';

export default function SubPlatformLogin() {
  const { platformName } = useParams();
  const { activeFlavor, flavorId, switchFlavor } = useFlavor();
  const { login, signInWithGoogle, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Switch flavor based on URL route parameter or domain
  useEffect(() => {
    if (platformName === 'beta' && flavorId !== 'platform2') {
      switchFlavor('platform2');
    } else if (platformName === 'gamma' && flavorId !== 'platform3') {
      switchFlavor('platform3');
    } else if (platformName === 'delta' && flavorId !== 'platform4') {
      switchFlavor('platform4');
    }
  }, [platformName]);

  const targetPortalPath = (() => {
    if (flavorId === 'platform2' || platformName === 'beta') return '/beta/portal';
    if (flavorId === 'platform3' || platformName === 'gamma') return '/gamma/portal';
    if (flavorId === 'platform4' || platformName === 'delta') return '/delta/portal';
    return '/beta/portal';
  })();

  // If already logged in, automatically redirect to sub-platform portal
  useEffect(() => {
    if (user) {
      navigate(targetPortalPath, { replace: true });
    }
  }, [user, targetPortalPath]);

  const primaryColor = activeFlavor?.theme?.colorPrimary || '#4F46E5';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      toast.error('Masukkan email dan kata sandi Anda');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      toast.success(`Berhasil masuk ke Portal ${activeFlavor?.name || 'Workspace'}!`);
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
      await signInWithGoogle();
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
      overflowX: 'hidden'
    }}>
      {/* Top Navbar */}
      <header style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <DesktopalieMark size={28} style={{ color: primaryColor }} />
          <span style={{
            fontSize: '1rem',
            fontWeight: '800',
            letterSpacing: '0.05em',
            color: isDarkMode ? '#F8FAFC' : '#0F172A',
            textTransform: 'uppercase'
          }}>
            {activeFlavor?.logoText || 'DESKTOPALIE'} WORKSPACE
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              color: isDarkMode ? '#FBBF24' : '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: isDarkMode ? '0 25px 50px rgba(0,0,0,0.5)' : '0 15px 35px rgba(15, 23, 42, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Ambient Glow Bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${primaryColor}, #8B5CF6)`
          }} />

          {/* Header Badge */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.85rem',
              borderRadius: '99px',
              backgroundColor: `${primaryColor}18`,
              color: primaryColor,
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              marginBottom: '0.75rem'
            }}>
              <FiLayers /> Platform Workspace Login
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', margin: '0 0 0.4rem 0', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
              Portal {activeFlavor?.name}
            </h2>
            <p style={{ fontSize: '0.875rem', color: isDarkMode ? '#94A3B8' : '#64748B', margin: 0 }}>
              Masuk ke akun ruang kerja khusus platform ini
            </p>
          </div>

          {errorMessage && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '1.5rem'
            }}>
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Google One-Click Login */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '12px',
              backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
              color: isDarkMode ? '#F8FAFC' : '#0F172A',
              border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`,
              fontWeight: '700',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <FaGoogle style={{ color: '#EA4335', fontSize: '1.1rem' }} />
            <span>{googleLoading ? 'Memproses OAuth Google...' : 'Masuk via akun Google'}</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            color: isDarkMode ? '#475569' : '#CBD5E1'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: isDarkMode ? '#64748B' : '#94A3B8' }}>atau email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem', color: isDarkMode ? '#CBD5E1' : '#475569' }}>
                EMAIL ADMINISTRATOR
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@desktopalie.my.id"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.75rem',
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                    border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                    color: isDarkMode ? '#F8FAFC' : '#0F172A',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.4rem', color: isDarkMode ? '#CBD5E1' : '#475569' }}>
                KATA SANDI
              </label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.75rem',
                    borderRadius: '12px',
                    backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                    border: `1px solid ${isDarkMode ? '#334155' : '#CBD5E1'}`,
                    color: isDarkMode ? '#F8FAFC' : '#0F172A',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '12px',
                backgroundColor: primaryColor,
                color: '#FFFFFF',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                boxShadow: `0 6px 20px ${primaryColor}40`
              }}
            >
              <span>{submitting ? 'Memverifikasi...' : `Masuk ke Portal ${activeFlavor?.shortName}`}</span>
              <FiArrowRight />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
