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
  FiMenu
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import DesktopalieMark from './DesktopalieMark';

export default function Sidebar() {
  const { logout, user } = useAuth();
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
    { label: 'Dashboard Overview', path: '/', icon: FiGrid },
    { label: 'To-Do & Board', path: '/todos', icon: FiCheckSquare },
    { label: 'Documentation', path: '/documentation', icon: FiBookOpen },
    { label: 'Landing Manager', path: '/landing-manager', icon: FiLayout },
    { label: 'Projects Manager', path: '/projects', icon: FiFolder },
    { label: 'Experiments Lab', path: '/experiments', icon: FiCpu },
    { label: 'Notes & Journal', path: '/notes', icon: FiFileText },
    { label: 'Bookmarks', path: '/bookmarks', icon: FiBookmark },
    { label: 'Maintenance Mode', path: '/maintenance', icon: FiTool },
    { label: 'Profile & Settings', path: '/profile', icon: FiUser },
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
        {/* Hide logo mark and text completely when sidebar is collapsed */}
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            {/* Pure black logo icon aligned seamlessly with brand title */}
            <DesktopalieMark size={30} style={{ color: '#0F172A', flexShrink: 0, marginTop: '-1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <h2 style={{
                fontSize: '0.95rem',
                fontWeight: '800',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#0F172A',
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

        {/* Official 3-Line Hamburger Menu Toggle Button */}
        <button
          onClick={toggleCollapse}
          title={isCollapsed ? 'Perluas Sidebar (Expand)' : 'Ciutkan Sidebar (Collapse)'}
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
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
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

      {/* Footer Profile & Logout */}
      <div style={{
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        alignItems: isCollapsed ? 'center' : 'stretch'
      }}>
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
          title={isCollapsed ? 'Keluar (Logout)' : undefined}
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: isCollapsed ? '0.5rem 0' : '0.4rem 0.75rem'
          }}
        >
          <FiLogOut style={{ fontSize: '1.1rem' }} />
          {!isCollapsed && <span>Keluar (Logout)</span>}
        </button>
      </div>
    </aside>
  );
}
