import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiLock, FiMail, FiArrowRight, FiAlertCircle, FiMoon, FiCheck } from 'react-icons/fi';
import DesktopalieMark from '../components/DesktopalieMark';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      toast.error('Silakan isi email dan kata sandi');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Berhasil masuk ke Backoffice!');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.message || err.error_description || 'Gagal login. Periksa kembali email & kata sandi Anda.';
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
      backgroundColor: '#FAF9FC',
      color: '#0F172A',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background Ambient Glow Effects */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, rgba(250, 249, 252, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.06) 0%, rgba(250, 249, 252, 0) 70%)',
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
        {/* Left Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <DesktopalieMark size={30} style={{ color: '#0F172A', flexShrink: 0 }} />
          <span style={{ fontSize: '1rem', fontWeight: '800', letterSpacing: '0.08em', color: '#0F172A' }}>
            DESKTOPALIE
          </span>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <a href="https://desktopalie.my.id" style={{ color: '#475569', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>Home</a>
          <a href="https://desktopalie.my.id#projects" style={{ color: '#475569', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>Projects</a>
          <a href="https://desktopalie.my.id#experiments" style={{ color: '#475569', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>Experiments</a>
          <a href="https://desktopalie.my.id#about" style={{ color: '#475569', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>About</a>
          <a href="https://desktopalie.my.id#services" style={{ color: '#475569', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>Services</a>
          <a href="https://desktopalie.my.id#contact" style={{ color: '#475569', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>Contact</a>
        </nav>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0F172A',
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
          }}>
            <FiMoon />
          </div>

          <div style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '99px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <span>Login</span>
            <FiArrowRight style={{ fontSize: '0.85rem' }} />
          </div>
        </div>
      </header>

      {/* HERO & LOGIN FORM MAIN SECTION */}
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
        {/* LEFT COLUMN: HERO TYPOGRAPHY & LOGIN FORM */}
        <div>
          {/* Status Pulse Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '99px',
            backgroundColor: '#F1F5F9',
            border: '1px solid #E2E8F0',
            fontSize: '0.725rem',
            fontWeight: '700',
            letterSpacing: '0.08em',
            color: '#0D9488',
            marginBottom: '1.5rem',
            textTransform: 'uppercase'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0D9488' }} />
            <span>BACKOFFICE ADMIN WORKSPACE</span>
          </div>

          {/* Display Hero Title */}
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            color: '#0F172A',
            lineHeight: '1.08',
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem'
          }}>
            Ideas, crafted into digital experiences.
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.65',
            color: '#64748B',
            marginBottom: '2rem',
            maxWidth: '520px'
          }}>
            Desktopalie is my personal space for projects, experiments, and digital creations—documenting my journey through web development, UI/UX design, and modern technology.
          </p>

          {/* LOGIN FORM CONTAINER */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
            marginBottom: '2.5rem',
            maxWidth: '480px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginBottom: '1.25rem' }}>
              Masuk ke Backoffice Admin
            </h3>

            {errorMessage && (
              <div style={{
                backgroundColor: '#FFF1F2',
                border: '1px solid #FECDD3',
                color: '#E11D48',
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
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', marginBottom: '0.4rem' }}>
                  Email Administrator
                </label>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.75rem',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: '#F8FAFC'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', marginBottom: '0.4rem' }}>
                  Kata Sandi
                </label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
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
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: '#F8FAFC'
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
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{submitting ? 'Memproses...' : 'Masuk ke Backoffice'}</span>
                  <FiArrowRight />
                </button>

                <Link to="/register" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#64748B', textDecoration: 'none' }}>
                  Daftar Akun Baru ➔
                </Link>
              </div>
            </form>
          </div>

          {/* Bottom Monospace Tagline */}
          <div style={{
            fontSize: '0.7rem',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.05em',
            color: '#94A3B8',
            borderTop: '1px solid #E2E8F0',
            paddingTop: '1rem',
            maxWidth: '480px'
          }}>
            CURRENTLY EXPLORING CREATIVE INTERFACES, THOUGHTFUL MOTION, AND USEFUL AI.
          </div>
        </div>

        {/* RIGHT COLUMN: 3D GRAPHICAL MOCKUP WINDOW (LIKE SCREENSHOT) */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          
          {/* Floating Badge Top Right */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.35rem 0.85rem',
            fontSize: '0.725rem',
            fontWeight: '800',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.08em',
            color: '#475569',
            boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
            zIndex: 10,
            transform: 'rotate(3deg)'
          }}>
            DESIGN × CODE
          </div>

          {/* Floating Code Snippet Badge Bottom Left */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '-10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.45rem 1rem',
            fontSize: '0.75rem',
            fontFamily: "'JetBrains Mono', monospace",
            color: '#0F172A',
            boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
            zIndex: 10,
            transform: 'rotate(-2deg)'
          }}>
            <span style={{ color: '#8B5CF6' }}>const</span> ideas = <span style={{ color: '#0D9488' }}>await</span> create();
          </div>

          {/* MAIN 3D TILTED MOCKUP BROWSER CARD */}
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.12), 0 10px 20px -5px rgba(15, 23, 42, 0.04)',
            overflow: 'hidden',
            transform: 'perspective(1000px) rotateY(-4deg) rotateX(2deg)',
            transition: 'transform 0.3s ease'
          }}>
            {/* Titlebar */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '0.2rem 1rem',
                fontSize: '0.725rem',
                fontFamily: "'JetBrains Mono', monospace",
                color: '#64748B'
              }}>
                desktopalie.my.id/lab
              </div>

              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>+</span>
            </div>

            {/* Canvas Area with Grid Pattern */}
            <div style={{
              padding: '2.5rem 2rem',
              minHeight: '340px',
              backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              backgroundColor: '#FFFFFF',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  fontSize: '0.7rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: '700',
                  color: '#7C3AED',
                  letterSpacing: '0.1em',
                  marginBottom: '1rem'
                }}>
                  EXPERIMENT / 026
                </div>

                <h2 style={{
                  fontSize: '2.1rem',
                  fontWeight: '800',
                  color: '#0F172A',
                  lineHeight: '1.15',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.02em'
                }}>
                  Make it useful.<br />
                  Make it <span style={{ color: '#7C3AED' }}>memorable.</span>
                </h2>
              </div>

              {/* 3D Donut & UI Chip Graphic (Like screenshot) */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '2rem' }}>
                <div style={{
                  fontSize: '0.65rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#94A3B8',
                  letterSpacing: '0.1em'
                }}>
                  CREATIVE DEVELOPMENT
                </div>

                {/* Gradient Ring Graphic */}
                <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'conic-gradient(from 180deg, #38BDF8, #818CF8, #C084FC, #F43F5E)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF'
                    }} />
                  </div>

                  {/* UI Chip Floating Card */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '-20px',
                    backgroundColor: '#1E293B',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '0.6rem 0.85rem',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                  }}>
                    UI
                  </div>

                  {/* Number Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
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
