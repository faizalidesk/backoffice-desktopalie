import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, 
  FiFolder, 
  FiCpu, 
  FiFileText, 
  FiBookmark, 
  FiUser, 
  FiTool,
  FiLayout,
  FiCheckSquare,
  FiBookOpen,
  FiMenu,
  FiInfo
} from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import DesktopalieMark from './DesktopalieMark';

export default function Sidebar() {
  const { t } = useLanguage();
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

      {/* FOOTER: APP WEBSITE VERSION INFORMATION ONLY */}
      <div style={{
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCollapsed ? 'center' : 'stretch'
      }}>
        {!isCollapsed ? (
          <div style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-card-hover)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary)' }}>
                SYSTEM VERSION
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '0.1rem 0.4rem',
                borderRadius: '99px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#16A34A'
              }}>
                v2.5.0
              </span>
            </div>

            <div style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FiInfo style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>Desktopalie Workspace</span>
            </div>

            <div style={{ fontSize: '0.675rem', color: 'var(--text-subtle)', lineHeight: '1.4' }}>
              Built for Desktop Experience • Synced
            </div>
          </div>
        ) : (
          <div 
            title="Desktopalie Backoffice v2.5.0"
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: '99px',
              backgroundColor: 'var(--bg-card-hover)',
              border: '1px solid var(--border-color)',
              fontSize: '0.65rem',
              fontWeight: '800',
              color: 'var(--primary)',
              fontFamily: "'JetBrains Mono', monospace"
            }}
          >
            v2.5
          </div>
        )}
      </div>
    </aside>
  );
}
