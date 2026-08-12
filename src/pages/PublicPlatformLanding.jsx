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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLandingContent();
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

  const primaryColor = activeFlavor?.theme?.colorPrimary || '#4f46e5';
  const dummyProjects = activeFlavor?.dummyData?.recentProjects || [];

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
          <a href="#hero" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none' }}>Overview</a>
          <a href="#features" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none' }}>Features</a>
          <a href="#projects" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none' }}>Projects</a>
          <a href="#about" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none' }}>About</a>
          <a href="#contact" style={{ color: isDarkMode ? '#94A3B8' : '#475569', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none' }}>Contact</a>
        </nav>

        {/* Right Controls: Theme Switcher & Admin Sign In Button */}
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

          {user ? (
            <button
              type="button"
              onClick={() => navigate('/workspaces')}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '99px',
                backgroundColor: primaryColor,
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}
            >
              <FiLock />
              <span>Backoffice Dashboard</span>
              <FiArrowRight />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '99px',
                backgroundColor: isDarkMode ? '#1E293B' : '#0F172A',
                color: '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#334155' : '#0F172A'}`,
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
              }}
            >
              <FiLock />
              <span>Sign In Admin</span>
              <FiArrowRight />
            </button>
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

          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              padding: '0.875rem 2rem',
              borderRadius: '99px',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              color: isDarkMode ? '#F8FAFC' : '#0F172A',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FiLock />
            <span>{settings?.hero_secondary_cta_text || 'Masuk Backoffice'}</span>
          </button>
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

      {/* FOOTER CONTACT */}
      <footer id="contact" style={{
        borderTop: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
        backgroundColor: isDarkMode ? '#0B1120' : '#F1F5F9',
        padding: '4rem 2rem 3rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
            {settings?.contact_title || 'Hubungi Kami'}
          </h3>
          <p style={{ fontSize: '1rem', color: primaryColor, fontWeight: '700', marginBottom: '2rem' }}>
            ✉️ {settings?.contact_email || 'hello@desktopalie.my.id'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2.5rem', fontSize: '1.35rem', color: isDarkMode ? '#94A3B8' : '#64748B' }}>
            {settings?.github_url && <a href={settings.github_url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><FiGithub /></a>}
            {settings?.linkedin_url && <a href={settings.linkedin_url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><FiLinkedin /></a>}
            {settings?.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}><FiInstagram /></a>}
          </div>

          <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#64748B' : '#94A3B8', borderTop: `1px solid ${isDarkMode ? '#1E293B' : '#E2E8F0'}`, paddingTop: '1.5rem' }}>
            © {new Date().getFullYear()} {activeFlavor?.name}. All rights reserved. Powered by Desktopalie Core Backoffice.
          </div>
        </div>
      </footer>

    </div>
  );
}
