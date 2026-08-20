import { useState, useRef, useEffect } from 'react';
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
  FiLayers,
  FiUsers,
  FiBell,
  FiDollarSign
} from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { useFlavor } from '../context/FlavorContext';
import { notificationService } from '../services/notificationService';
import DesktopalieMark from './DesktopalieMark';

export default function Sidebar() {
  const { t } = useLanguage();
  const { flavor, flavorId, subPlatformFlavors, isMainDesktopalie, switchFlavor, resetToMainFlavor } = useFlavor();
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(() => notificationService.getUnreadCount());
  const searchInputRef = useRef(null);

  // Desktop collapse state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('desktopalie_sidebar_collapsed') === 'true';
  });

  // Tablet & Mobile detection & drawer toggle
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 1024 : false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isTablet = window.innerWidth <= 1024;
      setIsTabletOrMobile(isTablet);
      if (!isTablet) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(() => {
      setUnreadCount(notificationService.getUnreadCount());
    });
    return unsubscribe;
  }, []);

  const toggleCollapse = () => {
    if (isTabletOrMobile) {
      setIsMobileMenuOpen(prev => !prev);
    } else {
      setIsCollapsed(prev => {
        const next = !prev;
        localStorage.setItem('desktopalie_sidebar_collapsed', String(next));
        return next;
      });
    }
  };

  const handleSearchIconClick = () => {
    if (isCollapsed && !isTabletOrMobile) {
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
    { label: t('notifications') || 'Notifikasi', path: '/notifications', icon: FiBell, badge: unreadCount },
    { label: 'Membership', path: '/members', icon: FiUsers },
    { label: t('transactions') || 'Transaksi', path: '/transactions', icon: FiDollarSign },
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

  // RENDERING NAVIGATION CONTENT (Used for both Desktop Sidebar and Mobile Overlay Drawer)
  const renderNavContent = (isMobileView = false) => (
    <>
      {/* SUB-PLATFORM SWITCHER */}
      <div style={{ marginBottom: '1rem' }}>
        <select
          value={flavorId}
          onChange={(e) => {
            const selectedVal = e.target.value;
            if (selectedVal === 'platform1') {
              resetToMainFlavor();
            } else if (selectedVal) {
              switchFlavor(selectedVal);
            }
          }}
          style={{
            width: '100%',
            padding: '0.55rem 0.75rem',
            fontSize: '0.85rem',
            fontWeight: '600',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card-hover)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <option value="platform1">
            🏠 Desktopalie Main
          </option>
          {subPlatformFlavors?.map((f) => (
            <option key={f.id} value={f.id}>
              ⚡ Platform {f.shortName}
            </option>
          ))}
        </select>
      </div>

      {/* SEARCH INPUT BOX */}
      <div style={{
        position: 'relative',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <FiSearch style={{
          position: 'absolute',
          left: '0.85rem',
          color: 'var(--text-muted)',
          fontSize: '1rem',
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
            padding: '0.55rem 2rem 0.55rem 2.3rem',
            fontSize: '0.875rem',
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

      {/* NAV LIST */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {filteredNavItems.length > 0 ? (
          filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => {
                  if (isMobileView) {
                    setIsMobileMenuOpen(false);
                  }
                }}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.8rem 1.1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.925rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'all 0.15s ease'
                })}
              >
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Icon style={{ fontSize: '1.3rem', flexShrink: 0 }} />
                </div>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '99px',
                    marginLeft: 'auto'
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })
        ) : (
          <div style={{
            padding: '1rem 0.5rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-subtle)',
            fontStyle: 'italic'
          }}>
            {t('noMenuFound')}
          </div>
        )}
      </nav>

      {/* FOOTER */}
      <div style={{
        paddingTop: '0.75rem',
        marginTop: '0.5rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.725rem',
        color: 'var(--text-subtle)',
        fontWeight: '600',
        paddingLeft: '0.25rem',
        paddingRight: '0.25rem'
      }}>
        <span>Desktopalie Backoffice</span>
        <span>v2.5.0</span>
      </div>
    </>
  );

  // TABLET & MOBILE VIEW (TOP HEADER WITH HAMBURGER MENU & SLIDE-DOWN DRAWER)
  if (isTabletOrMobile) {
    return (
      <aside style={{
        width: '100%',
        backgroundColor: 'var(--bg-sidebar)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 500,
        padding: '0.65rem 1rem',
        flexShrink: 0
      }}>
        {/* TABLET / MOBILE TOP BAR */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <DesktopalieMark size={28} style={{ color: 'var(--text-main)', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{
                fontSize: '0.9rem',
                fontWeight: '800',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-main)',
                lineHeight: '1.1',
                margin: 0
              }}>
                Desktopalie
              </h2>
              <span style={{
                fontSize: '0.625rem',
                color: isMainDesktopalie ? 'var(--color-primary, var(--primary))' : '#E11D48',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                lineHeight: '1.2',
                marginTop: '0.1rem'
              }}>
                {isMainDesktopalie ? 'Main Backoffice' : `Platform ${flavor.shortName}`}
              </span>
            </div>
          </div>

          <button
            onClick={toggleCollapse}
            aria-label="Toggle Menu Navigation"
            title="Toggle Menu Navigation"
            style={{
              background: 'var(--bg-card-hover)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              transition: 'all 0.15s ease'
            }}
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* TABLET / MOBILE SLIDE-DOWN DRAWER OVERLAY */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-sidebar)',
            borderBottom: '1px solid var(--border-color)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxHeight: 'calc(85vh - 60px)',
            overflowY: 'auto',
            zIndex: 500
          }}>
            {renderNavContent(true)}
          </div>
        )}
      </aside>
    );
  }

  // DESKTOP VIEW (STICKY SIDEBAR WITH EXPAND / COLLAPSE TOGGLE)
  return (
    <aside style={{
      width: isCollapsed ? '80px' : '270px',
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

      {/* SUB-PLATFORM SWITCHER */}
      {!isCollapsed && (
        <div style={{ marginBottom: '0.85rem' }}>
          <select
            value={flavorId}
            onChange={(e) => {
              const selectedVal = e.target.value;
              if (selectedVal === 'platform1') {
                resetToMainFlavor();
              } else if (selectedVal) {
                switchFlavor(selectedVal);
              }
            }}
            style={{
              width: '100%',
              padding: '0.45rem 0.65rem',
              fontSize: '0.775rem',
              fontWeight: '600',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card-hover)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <option value="platform1">
              🏠 Desktopalie Main
            </option>
            {subPlatformFlavors?.map((f) => (
              <option key={f.id} value={f.id}>
                ⚡ Platform {f.shortName}
              </option>
            ))}
          </select>
        </div>
      )}
      {isCollapsed && (
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

      {/* SEARCH INPUT BOX */}
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

      {/* NAV LIST */}
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
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Icon style={{ fontSize: '1.25rem', flexShrink: 0 }} />
                  {isCollapsed && item.badge > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#EF4444'
                    }} />
                  )}
                </div>
                {!isCollapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{item.label}</span>}
                {!isCollapsed && item.badge > 0 && (
                  <span style={{
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '99px',
                    marginLeft: 'auto'
                  }}>
                    {item.badge}
                  </span>
                )}
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

      {/* FOOTER */}
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
