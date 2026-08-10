import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, 
  FiFolder, 
  FiCpu, 
  FiFileText, 
  FiBookmark, 
  FiUser, 
  FiLogOut,
  FiTool,
  FiLayout,
  FiCheckSquare,
  FiBookOpen,
  FiMenu,
  FiMoon,
  FiSun,
  FiGlobe
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import DesktopalieMark from './DesktopalieMark';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('desktopalie_sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('desktopalie_sidebar_collapsed', String(next));
      return next;
    });
  };

  const navItems = [
    { label: t('dashboard'), path: '/', icon: FiGrid },
    { label: t('todos'), path: '/todos', icon: FiCheckSquare },
    { label: t('documentation'), path: '/documentation', icon: FiBookOpen },
    { label: t('landingManager'), path: '/landing-manager', icon: FiLayout },
    { label: t('projects'), path: '/projects', icon: FiFolder },
    { label: t('experiments'), path: '/experiments', icon: FiCpu },
    { label: t('notes'), path: '/notes', icon: FiFileText },
    { label: t('bookmarks'), path: '/bookmarks', icon: FiBookmark },
    { label: t('maintenance'), path: '/maintenance', icon: FiTool },
    { label: t('profile'), path: '/profile', icon: FiUser },
  ];

  return (
    <aside style={{
      width: isCollapsed ? '80px' : '260px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      left: 0,
      zIndex: 200,
      padding: isCollapsed ? '1.25rem 0.5rem' : '1.25rem 1rem',
      overflowY: 'auto',
      flexShrink: 0,
      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Sidebar Header & Hamburger Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        padding: isCollapsed ? '0.5rem 0 1.5rem 0' : '0.5rem 0.25rem 1.5rem 0.25rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '1.25rem'
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            <DesktopalieMark size={30} style={{ color: 'var(--text-main)', flexShrink: 0, marginTop: '-1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <h2 style={{
                fontSize: '0.95rem',
                fontWeight: '800',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-main)',
                lineHeight: '1.1',
                margin: 0,
                whiteSpace: 'nowrap'
              }}>
                Desktopalie
              </h2>
              <span style={{
                fontSize: '0.65rem',
                color: 'var(--primary)',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                lineHeight: '1.2',
                marginTop: '0.15rem',
                whiteSpace: 'nowrap'
              }}>
                Backoffice Admin
              </span>
            </div>
          </div>
        )}

        <button
          onClick={toggleCollapse}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            flexShrink: 0,
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FiMenu />
        </button>
      </div>

      {/* Nav List */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              title={isCollapsed ? item.label : undefined}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: isCollapsed ? 0 : '0.75rem',
                padding: isCollapsed ? '0.75rem 0' : '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                borderLeft: !isCollapsed && isActive ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <Icon style={{ fontSize: '1.25rem', flexShrink: 0 }} />
              {!isCollapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Controls: Language Switcher, Theme Switcher & Logout */}
      <div style={{
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: isCollapsed ? 'center' : 'stretch'
      }}>
        {/* Language Switcher Quick Button */}
        <button
          type="button"
          onClick={toggleLanguage}
          title="Switch Language (Indonesia / English)"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '0.5rem 0' : '0.45rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontSize: '0.825rem',
            fontWeight: '600'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{language === 'id' ? '🇮🇩' : '🇬🇧'}</span>
            {!isCollapsed && <span>{language === 'id' ? 'Bahasa Indonesia' : 'English'}</span>}
          </div>
        </button>

        {/* Dark Mode Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            padding: isCollapsed ? '0.5rem 0' : '0.45rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontSize: '0.825rem',
            fontWeight: '600'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isDarkMode ? <FiSun style={{ color: '#F59E0B' }} /> : <FiMoon style={{ color: 'var(--primary)' }} />}
            {!isCollapsed && <span>{isDarkMode ? t('lightMode') : t('darkMode')}</span>}
          </div>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: isCollapsed ? 0 : '0.75rem',
          padding: isCollapsed ? '0.5rem 0' : '0.5rem 0.75rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '0.85rem',
            color: 'var(--primary)',
            flexShrink: 0
          }} title={isCollapsed ? (user?.email || 'Admin User') : undefined}>
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.email || 'Admin User'}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Administrator</span>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          title={isCollapsed ? t('signOut') : undefined}
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: isCollapsed ? '0.5rem 0' : '0.4rem 0.75rem'
          }}
        >
          <FiLogOut style={{ fontSize: '1.1rem' }} />
          {!isCollapsed && <span>{t('signOut')}</span>}
        </button>
      </div>
    </aside>
  );
}
