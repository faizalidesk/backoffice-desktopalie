import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useFlavor } from '../context/FlavorContext';
import { Link, useNavigate } from 'react-router-dom';
import { backofficeService } from '../services/backofficeService';
import { 
  FiActivity, 
  FiGlobe, 
  FiExternalLink, 
  FiUser, 
  FiMoon, 
  FiSun, 
  FiLogOut, 
  FiChevronDown, 
  FiCheck,
  FiSettings
} from 'react-icons/fi';

export default function Header({ title = 'Dashboard Overview' }) {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { activeFlavor, flavorId } = useFlavor();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('desktopalie_profile') || localStorage.getItem(`desktopalie_profile_${user?.id}`);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  });
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHeaderProfile() {
      try {
        const p = await backofficeService.getProfile(user?.id);
        if (p) setUserProfile(p);
      } catch (e) {}
    }

    loadHeaderProfile();

    const handleStorage = (e) => {
      if (!e || !e.key || e.key.includes('profile')) {
        loadHeaderProfile();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user?.id]);

  const targetWebsite = flavorId === 'platform2' 
    ? 'https://beta.desktopalie.my.id' 
    : flavorId === 'platform3' 
    ? 'https://gamma.desktopalie.my.id' 
    : flavorId === 'platform4' 
    ? 'https://delta.desktopalie.my.id' 
    : 'https://desktopalie.my.id';

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background-color 0.2s ease, border-color 0.2s ease'
    }}>
      {/* LEFT: Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>{title}</h2>
      </div>

      {/* RIGHT: Status Badge, View Site & Profile Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        {/* Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '999px',
          backgroundColor: isDarkMode ? 'rgba(45, 212, 191, 0.12)' : 'rgba(20, 184, 166, 0.1)',
          border: `1px solid ${isDarkMode ? 'rgba(45, 212, 191, 0.25)' : 'rgba(20, 184, 166, 0.2)'}`,
          fontSize: '0.78rem',
          color: isDarkMode ? '#2DD4BF' : '#0D9488'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#2DD4BF',
            boxShadow: '0 0 8px #2DD4BF'
          }} />
          <FiActivity style={{ fontSize: '0.85rem' }} />
          <span>Supabase Connected</span>
        </div>

        {/* View Main Website Button */}
        <a 
          href={targetWebsite} 
          target="_blank" 
          rel="noreferrer"
          className="btn btn-secondary btn-sm"
          style={{ textDecoration: 'none' }}
        >
          <FiGlobe />
          <span>{t('viewWebsite')}</span>
          <FiExternalLink style={{ fontSize: '0.75rem' }} />
        </a>

        {/* TOP RIGHT PROFILE AVATAR & DROPDOWN TRIGGER */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '99px',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              color: 'var(--text-main)',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              transition: 'all 0.15s ease'
            }}
          >
            {/* Avatar Circle */}
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '0.85rem',
              overflow: 'hidden'
            }}>
              {userProfile?.avatar_url ? (
                <img src={userProfile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                userProfile?.full_name ? userProfile.full_name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'A')
              )}
            </div>

            <span style={{ fontSize: '0.85rem', fontWeight: '700', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userProfile?.full_name || user?.email?.split('@')[0] || 'Admin'}
            </span>

            <FiChevronDown style={{
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }} />
          </button>

          {/* FLOATING PROFILE DROPDOWN MENU */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '270px',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              borderRadius: '16px',
              boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.5)' : '0 15px 35px rgba(15, 23, 42, 0.12)',
              padding: '0.75rem',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              animation: 'fadeIn 0.15s ease-out'
            }}>
              {/* Profile Header Info */}
              <div style={{
                padding: '0.75rem',
                backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1.05rem',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}>
                  {userProfile?.avatar_url ? (
                    <img src={userProfile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    userProfile?.full_name ? userProfile.full_name.charAt(0).toUpperCase() : (user?.email?.charAt(0).toUpperCase() || 'A')
                  )}
                </div>

                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {userProfile?.full_name || user?.email || 'Admin User'}
                  </div>
                  <span style={{
                    fontSize: '0.675rem',
                    fontWeight: '700',
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Workspace Administrator
                  </span>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }} />

              {/* DARK MODE TOGGLE ITEM */}
              <button
                type="button"
                onClick={toggleTheme}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {isDarkMode ? <FiSun style={{ color: '#FBBF24', fontSize: '1rem' }} /> : <FiMoon style={{ color: 'var(--primary)', fontSize: '1rem' }} />}
                  <span>{isDarkMode ? t('lightMode') : t('darkMode')}</span>
                </div>

                <span style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '99px',
                  backgroundColor: 'var(--bg-card-hover)',
                  color: 'var(--text-muted)',
                  fontWeight: '700'
                }}>
                  {isDarkMode ? 'DARK' : 'LIGHT'}
                </span>
              </button>

              {/* LANGUAGE TOGGLE ITEM */}
              <div style={{
                padding: '0.6rem 0.75rem',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.4)' : '#F8FAFC'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  <FiGlobe style={{ color: 'var(--primary)' }} />
                  <span>{t('language')}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => setLanguage('id')}
                    style={{
                      padding: '0.35rem 0.5rem',
                      borderRadius: '8px',
                      border: `1px solid ${language === 'id' ? 'var(--primary)' : 'transparent'}`,
                      backgroundColor: language === 'id' ? 'var(--primary-light)' : 'transparent',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>🇮🇩 ID</span>
                    {language === 'id' && <FiCheck style={{ color: 'var(--primary)', fontSize: '0.75rem' }} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    style={{
                      padding: '0.35rem 0.5rem',
                      borderRadius: '8px',
                      border: `1px solid ${language === 'en' ? 'var(--primary)' : 'transparent'}`,
                      backgroundColor: language === 'en' ? 'var(--primary-light)' : 'transparent',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>🇬🇧 EN</span>
                    {language === 'en' && <FiCheck style={{ color: 'var(--primary)', fontSize: '0.75rem' }} />}
                  </button>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.25rem 0' }} />

              {/* PROFILE & SETTINGS LINK ITEM */}
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '10px',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FiSettings style={{ color: 'var(--primary)', fontSize: '1rem' }} />
                <span>{t('profile')}</span>
              </Link>

              {/* SIGN OUT BUTTON ITEM */}
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#EF4444',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
              >
                <FiLogOut style={{ fontSize: '1rem' }} />
                <span>{t('signOut')}</span>
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}
