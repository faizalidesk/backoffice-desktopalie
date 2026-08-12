import { useState, useRef } from 'react';
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
  FiInfo,
  FiSearch,
  FiX,
  FiLayers
} from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { useFlavor } from '../context/FlavorContext';
import DesktopalieMark from './DesktopalieMark';

export default function Sidebar() {
  const { t } = useLanguage();
  const { flavor, flavorId, subPlatformFlavors, isMainDesktopalie, switchFlavor, resetToMainFlavor } = useFlavor();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
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

  const handleSearchIconClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      localStorage.setItem('desktopalie_sidebar_collapsed', 'false');
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  };

  const allNavItems = [
    { label: t('dashboard'), path: '/dashboard', icon: FiGrid },
    { label: t('workspaces'), path: '/workspaces', icon: FiLayers },
    { label: t('projects'), path: '/projects', icon: FiFolder },
    { label: t('experiments'), path: '/experiments', icon: FiCpu },
    { label: t('notes'), path: '/notes', icon: FiFileText },
    { label: t('bookmarks'), path: '/bookmarks', icon: FiBookmark },
    { label: t('todos'), path: '/todos', icon: FiCheckSquare },
    { label: t('documentation'), path: '/documentation', icon: FiBookOpen },
    { label: t('landingManager'), path: '/landing-manager', icon: FiLayout },
    { label: t('maintenance'), path: '/maintenance', icon: FiTool },
    { label: t('profile'), path: '/profile', icon: FiUser },
  ];

  const filteredNavItems = allNavItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

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
        padding: isCollapsed ? '0.5rem 0 1rem 0' : '0.5rem 0.25rem 1rem 0.25rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '1rem'
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
                color: isMainDesktopalie ? 'var(--color-primary, var(--primary))' : '#E11D48',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                lineHeight: '1.2',
                marginTop: '0.15rem',
                whiteSpace: 'nowrap'
              }}>
                {isMainDesktopalie ? 'Main Backoffice' : `Platform ${flavor.shortName}`}
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

      {/* SUB-PLATFORM SWITCHER (Ultra Minimalist) */}
      {!isCollapsed ? (
        <div style={{ marginBottom: '0.85rem' }}>
          <select
            value={isMainDesktopalie ? '' : flavorId}
            onChange={(e) => {
              if (e.target.value === 'main') {
                resetToMainFlavor();
              } else if (e.target.value) {
                switchFlavor(e.target.value);
              }
            }}
            style={{
              width: '100%',
              padding: '0.4rem 0.6rem',
              fontSize: '0.775rem',
              fontWeight: '600',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {isMainDesktopalie && (
              <option value="" disabled>
                -- Sub-Platform --
              </option>
            )}
            {!isMainDesktopalie && (
              <option value="main">
                ← Desktopalie Main
              </option>
            )}
            {subPlatformFlavors?.map((f) => (
              <option key={f.id} value={f.id}>
                Platform {f.shortName}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <button
          onClick={() => {
            const subIds = subPlatformFlavors.map(f => f.id);
            if (isMainDesktopalie) {
              switchFlavor(subIds[0]);
            } else {
              const currentIdx = subIds.indexOf(flavorId);
              if (currentIdx === subIds.length - 1) {
                resetToMainFlavor();
              } else {
                switchFlavor(subIds[currentIdx + 1]);
              }
            }
          }}
          title={isMainDesktopalie ? "Desktopalie Main. Klik untuk pilih sub-platform." : `Platform Sub: ${flavor?.shortName}. Klik untuk ganti.`}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.35rem 0',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: '700',
            width: '100%',
            transition: 'all 0.15s ease'
          }}
        >
          {isMainDesktopalie ? 'D' : (flavor?.shortName?.[0] || 'S')}
        </button>
      )}

      {/* Search Input Box */}
      {!isCollapsed ? (
        <div style={{
          position: 'relative',
          marginBottom: '0.85rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <FiSearch style={{
            position: 'absolute',
            left: '0.75rem',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            pointerEvents: 'none'
          }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={t('searchMenu')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 2rem 0.45rem 2.1rem',
              fontSize: '0.825rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: 'var(--text-main)',
              outline: 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              title="Clear search"
              style={{
                position: 'absolute',
                right: '0.4rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.2rem',
                borderRadius: '50%'
              }}
            >
              <FiX style={{ fontSize: '0.9rem' }} />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={handleSearchIconClick}
          title={t('searchMenu')}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.5rem 0',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FiSearch style={{ fontSize: '1.1rem' }} />
        </button>
      )}

      {/* Nav List */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {filteredNavItems.length > 0 ? (
          filteredNavItems.map((item) => {
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
          })
        ) : (
          !isCollapsed && (
            <div style={{
              padding: '1rem 0.5rem',
              textAlign: 'center',
              fontSize: '0.8rem',
              color: 'var(--text-subtle)',
              fontStyle: 'italic'
            }}>
              {t('noMenuFound')}
            </div>
          )
        )}
      </nav>

      {/* FOOTER: PLAIN VERSION TEXT ONLY (NO CARDS) */}
      <div style={{
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        fontSize: '0.725rem',
        color: 'var(--text-subtle)',
        fontWeight: '600',
        paddingLeft: isCollapsed ? 0 : '0.25rem',
        paddingRight: isCollapsed ? 0 : '0.25rem'
      }}>
        {!isCollapsed ? (
          <>
            <span>Desktopalie</span>
            <span>v2.5.0</span>
          </>
        ) : (
          <span title="Desktopalie v2.5.0">v2.5</span>
        )}
      </div>
    </aside>
  );
}
