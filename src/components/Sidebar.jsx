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
  FiCheckSquare
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import DesktopalieMark from './DesktopalieMark';

export default function Sidebar() {
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Dashboard Overview', path: '/', icon: FiGrid },
    { label: 'To-Do & Board', path: '/todos', icon: FiCheckSquare },
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
      width: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '1.25rem 1rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0.75rem 1.5rem 0.75rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '1.25rem'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: '#0F172A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          flexShrink: 0
        }}>
          <DesktopalieMark size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '0.95rem', fontWeight: '700', letterSpacing: '0.04em', textTransform: 'uppercase', lineHeight: '1.2' }}>
            Desktopalie
          </h2>
          <span style={{ 
            fontSize: '0.7rem', 
            color: 'var(--primary)', 
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Backoffice Admin
          </span>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                fontWeight: '500',
                textDecoration: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <Icon style={{ fontSize: '1.1rem' }} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 0.75rem'
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
            color: 'var(--primary)'
          }}>
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.email || 'Admin User'}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Administrator</span>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <FiLogOut />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
