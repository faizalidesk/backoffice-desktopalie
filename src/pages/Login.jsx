import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFlavor } from '../context/FlavorContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiLock, FiMail, FiArrowRight, FiAlertCircle, FiMoon, FiSun } from 'react-icons/fi';
import DesktopalieMark from '../components/DesktopalieMark';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { activeFlavor, flavorId, switchFlavor, isMainDesktopalie } = useFlavor();
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
    const isSubplatform = hostname.includes('beta.') || hostname.includes('gamma.') || hostname.includes('delta.');
    if (!isSubplatform && flavorId !== 'platform1') {
      switchFlavor('platform1');
      localStorage.setItem('desktopalie_flavor', 'platform1');
    }
  }, [flavorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      toast.success(`Successfully signed in to ${activeFlavor?.name || 'Backoffice'}!`);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.message || err.error_description || 'Sign in failed. Please check your email & password.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
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
      {/* Background Ambient Glow Effects matching Desktopalie Platform */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: isDarkMode 
          ? 'radial-gradient(circle, rgba(129, 140, 248, 0.18) 0%, rgba(15, 23, 42, 0) 70%)'
          : 'radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, rgba(250, 249, 252, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: isDarkMode
          ? 'radial-gradient(circle, rgba(45, 212, 191, 0.12) 0%, rgba(15, 23, 42, 0) 70%)'
          : 'radial-gradient(circle, rgba(13, 148, 136, 0.06) 0%, rgba(250, 249, 252, 0) 70%)',
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
        {/* Left Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <DesktopalieMark size={36} style={{ color: isDarkMode ? '#F8FAFC' : '#0F172A', flexShrink: 0 }} />
          <span style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '0.08em', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
            {activeFlavor?.logoText?.toUpperCase() || 'DESKTOPALIE'}
          </span>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.25rem' }}>
          <a href="https://desktopalie.my.id" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none' }}>Home</a>
          <a href="https://desktopalie.my.id#projects" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none' }}>Projects</a>
          <a href="https://desktopalie.my.id#experiments" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none' }}>Experiments</a>
          <a href="https://desktopalie.my.id#about" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none' }}>About</a>
          <a href="https://desktopalie.my.id#services" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none' }}>Services</a>
          <a href="https://desktopalie.my.id#contact" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.95rem', fontWeight: '600', textDecoration: 'none' }}>Contact</a>
        </nav>

        {/* Right Controls: Interactive Dark Mode Switcher & Login Pill Button */}
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
            backgroundColor: isDarkMode ? '#818CF8' : '#0F172A',
            color: isDarkMode ? '#0F172A' : '#FFFFFF',
            fontSize: '0.95rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>Login</span>
            <FiArrowRight style={{ fontSize: '0.95rem' }} />
          </div>
        </div>
      </header>

      {/* HERO & LOGIN FORM MAIN SECTION */}
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
        {/* LEFT COLUMN: HERO TYPOGRAPHY & LOGIN FORM */}
        <div>
          {/* Status Pulse Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '99px',
            backgroundColor: isDarkMode ? 'rgba(129, 140, 248, 0.15)' : '#F1F5F9',
            border: `1px solid ${isDarkMode ? 'rgba(129, 140, 248, 0.3)' : '#E2E8F0'}`,
            fontSize: '0.825rem',
            fontWeight: '700',
            letterSpacing: '0.08em',
            color: isDarkMode ? '#818CF8' : '#0D9488',
            marginBottom: '1.75rem',
            textTransform: 'uppercase'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isDarkMode ? '#818CF8' : '#0D9488' }} />
            <span>{isMainDesktopalie ? 'MAIN BACKOFFICE ADMIN WORKSPACE' : `PLATFORM ${activeFlavor?.shortName?.toUpperCase()} WORKSPACE`}</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.75rem, 4vw, 4.25rem)',
            fontWeight: '800',
            color: isDarkMode ? '#F8FAFC' : '#0F172A',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem'
          }}>
            {activeFlavor?.name || 'Ideas, crafted into digital experiences.'}
          </h1>

          <p style={{
            fontSize: '1.125rem',
            lineHeight: '1.7',
            color: isDarkMode ? '#94A3B8' : '#64748B',
            marginBottom: '2.25rem',
            maxWidth: '580px'
          }}>
            {activeFlavor?.description || 'Desktopalie is a space for projects, experiments, and digital creations.'}
          </p>

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
              Sign In to Backoffice Admin
            </h3>

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
                  Administrator Email
                </label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ position: 'absolute', left: '1.15rem', top: '50%', transform: 'translateY(-50%)', color: isDarkMode ? '#64748B' : '#94A3B8', fontSize: '1.15rem' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@email.com"
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
                    backgroundColor: isDarkMode ? '#818CF8' : '#0F172A',
                    color: isDarkMode ? '#0F172A' : '#FFFFFF',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: isDarkMode ? '0 8px 20px rgba(129, 140, 248, 0.3)' : '0 8px 20px rgba(15, 23, 42, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{submitting ? 'Processing...' : 'Sign In to Backoffice'}</span>
                  <FiArrowRight style={{ fontSize: '1.1rem' }} />
                </button>

                <Link to="/register" style={{ fontSize: '0.95rem', fontWeight: '600', color: isDarkMode ? '#818CF8' : '#64748B', textDecoration: 'none' }}>
                  Register Account ➔
                </Link>
              </div>
            </form>
          </div>

          {/* Bottom Monospace Tagline */}
          <div style={{
            fontSize: '0.8rem',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.06em',
            color: isDarkMode ? '#64748B' : '#94A3B8',
            borderTop: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            paddingTop: '1.25rem',
            maxWidth: '540px'
          }}>
            CURRENTLY EXPLORING CREATIVE INTERFACES, THOUGHTFUL MOTION, AND USEFUL AI.
          </div>
        </div>

        {/* RIGHT COLUMN: 3D GRAPHICAL MOCKUP WINDOW (LIKE SCREENSHOT) */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
          
          {/* Floating Badge Top Right */}
          <div style={{
            position: 'absolute',
            top: '-24px',
            right: '10px',
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '10px',
            padding: '0.5rem 1.1rem',
            fontSize: '0.825rem',
            fontWeight: '800',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.08em',
            color: isDarkMode ? '#C084FC' : '#475569',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            zIndex: 10,
            transform: 'rotate(3deg)'
          }}>
            DESIGN × CODE
          </div>

          {/* Floating Code Snippet Badge Bottom Left */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '-15px',
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '10px',
            padding: '0.6rem 1.25rem',
            fontSize: '0.85rem',
            fontFamily: "'JetBrains Mono', monospace",
            color: isDarkMode ? '#F8FAFC' : '#0F172A',
            boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
            zIndex: 10,
            transform: 'rotate(-2deg)'
          }}>
            <span style={{ color: '#C084FC' }}>const</span> ideas = <span style={{ color: '#2DD4BF' }}>await</span> create();
          </div>

          {/* MAIN 3D TILTED MOCKUP BROWSER CARD */}
          <div style={{
            width: '100%',
            maxWidth: '620px',
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '24px',
            boxShadow: isDarkMode ? '0 30px 60px -15px rgba(0, 0, 0, 0.6)' : '0 30px 60px -15px rgba(15, 23, 42, 0.12)',
            overflow: 'hidden',
            transform: 'perspective(1000px) rotateY(-4deg) rotateX(2deg)',
            transition: 'transform 0.3s ease, background-color 0.3s ease'
          }}>
            {/* Titlebar */}
            <div style={{
              backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
              borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              padding: '0.9rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              </div>

              <div style={{
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                borderRadius: '8px',
                padding: '0.35rem 1.25rem',
                fontSize: '0.825rem',
                fontFamily: "'JetBrains Mono', monospace",
                color: isDarkMode ? '#94A3B8' : '#64748B'
              }}>
                desktopalie.my.id/lab
              </div>

              <span style={{ fontSize: '1rem', color: isDarkMode ? '#64748B' : '#94A3B8' }}>+</span>
            </div>

            {/* Canvas Area with Grid Pattern */}
            <div style={{
              padding: '3rem 2.5rem',
              minHeight: '400px',
              backgroundImage: isDarkMode 
                ? 'radial-gradient(#334155 1.5px, transparent 1.5px)' 
                : 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontSize: '0.8rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: '700',
                  color: isDarkMode ? '#C084FC' : '#7C3AED',
                  letterSpacing: '0.1em',
                  marginBottom: '1.25rem'
                }}>
                  EXPERIMENT / 026
                </div>

                <h2 style={{
                  fontSize: '2.6rem',
                  fontWeight: '800',
                  color: isDarkMode ? '#F8FAFC' : '#0F172A',
                  lineHeight: '1.18',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.02em'
                }}>
                  Make it useful.<br />
                  Make it <span style={{ color: isDarkMode ? '#C084FC' : '#7C3AED' }}>memorable.</span>
                </h2>
              </div>

              {/* 3D Donut & UI Chip Graphic */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '2.5rem' }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: isDarkMode ? '#64748B' : '#94A3B8',
                  letterSpacing: '0.1em'
                }}>
                  CREATIVE DEVELOPMENT
                </div>

                {/* Gradient Ring Graphic */}
                <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    background: 'conic-gradient(from 180deg, #38BDF8, #818CF8, #C084FC, #F43F5E)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF'
                    }} />
                  </div>

                  {/* UI Chip Floating Card */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '-24px',
                    backgroundColor: isDarkMode ? '#0F172A' : '#1E293B',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '0.7rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.4)'
                  }}>
                    UI
                  </div>

                  {/* Number Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    backgroundColor: isDarkMode ? '#818CF8' : '#0F172A',
                    color: isDarkMode ? '#0F172A' : '#FFFFFF',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: '800'
                  }}>
                    01
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
