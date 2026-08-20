import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HiHome,
  HiOutlineHome,
  HiSquares2X2,
  HiOutlineSquares2X2,
  HiBanknotes,
  HiOutlineBanknotes,
  HiFolder,
  HiOutlineFolder,
  HiClipboardDocumentCheck,
  HiOutlineClipboardDocumentCheck,
  HiPencilSquare,
  HiOutlinePencilSquare,
  HiDocumentText,
  HiOutlineDocumentText,
  HiUserGroup,
  HiOutlineUserGroup,
  HiBell,
  HiOutlineBell,
  HiCog6Tooth,
  HiOutlineCog6Tooth,
  HiUser,
  HiOutlineUser,
  HiBolt,
  HiOutlineBolt,
  HiMagnifyingGlass,
  HiBars3,
  HiXMark
} from 'react-icons/hi2';
import { FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useFlavor } from '../context/FlavorContext';
import { backofficeService } from '../services/backofficeService';
import { notificationService } from '../services/notificationService';
import DesktopalieMark from './DesktopalieMark';

export default function Sidebar() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const { flavor, flavorId, isMainDesktopalie, switchFlavor } = useFlavor();
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(() => notificationService.getUnreadCount());

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('desktopalie_profile') || localStorage.getItem(`desktopalie_profile_${user?.id}`);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  });
  const searchInputRef = useRef(null);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('desktopalie_sidebar_collapsed') === 'true';
  });

  const [isTabletOrMobile, setIsTabletOrMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 1024 : false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadSidebarProfile() {
      try {
        if (user?.id) {
          const p = await backofficeService.getProfile(user.id);
          if (p) setUserProfile(p);
        }
      } catch (e) {}
    }
    loadSidebarProfile();
    const handleStorage = (e) => {
      if (!e || !e.key || e.key.includes('profile')) {
        loadSidebarProfile();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [user?.id]);

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

  // =========================================================================
  // TAILORED MENU DEFINITIONS:
  // Back Office Utama: Admin operations, tenants, finance, members & maintenance
  // Sub-Platform Portal: Core tool (portal), dashboard, user projects, tasks, notes, docs, notifications & profile
  // =========================================================================
  const flatMenuItems = isMainDesktopalie
    ? [
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard', solidIcon: HiHome, outlineIcon: HiOutlineHome },
        { id: 'workspaces', label: 'Workspaces', path: '/workspaces', solidIcon: HiSquares2X2, outlineIcon: HiOutlineSquares2X2 },
        { id: 'transactions', label: 'Transaksi', path: '/transactions', solidIcon: HiBanknotes, outlineIcon: HiOutlineBanknotes },
        { id: 'members', label: 'Member', path: '/members', solidIcon: HiUserGroup, outlineIcon: HiOutlineUserGroup },
        { id: 'projects', label: 'Proyek', path: '/projects', solidIcon: HiFolder, outlineIcon: HiOutlineFolder },
        { id: 'todos', label: 'To-Do', path: '/todos', solidIcon: HiClipboardDocumentCheck, outlineIcon: HiOutlineClipboardDocumentCheck },
        { id: 'documentation', label: 'Dokumen', path: '/documentation', solidIcon: HiDocumentText, outlineIcon: HiOutlineDocumentText },
        { id: 'notifications', label: 'Notifikasi', path: '/notifications', solidIcon: HiBell, outlineIcon: HiOutlineBell, badge: unreadCount },
        { id: 'maintenance', label: 'Sistem', path: '/maintenance', solidIcon: HiCog6Tooth, outlineIcon: HiOutlineCog6Tooth },
        { id: 'profile', label: 'Profil', path: '/profile', solidIcon: HiUser, outlineIcon: HiOutlineUser }
      ]
    : [
        { id: 'portal', label: `Portal ${flavor?.shortName || ''}`.trim(), path: '/portal', solidIcon: HiBolt, outlineIcon: HiOutlineBolt },
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard', solidIcon: HiHome, outlineIcon: HiOutlineHome },
        { id: 'workspaces', label: 'Workspaces', path: '/workspaces', solidIcon: HiSquares2X2, outlineIcon: HiOutlineSquares2X2 },
        { id: 'projects', label: 'Proyek', path: '/projects', solidIcon: HiFolder, outlineIcon: HiOutlineFolder },
        { id: 'todos', label: 'Tugas', path: '/todos', solidIcon: HiClipboardDocumentCheck, outlineIcon: HiOutlineClipboardDocumentCheck },
        { id: 'notes', label: 'Catatan', path: '/notes', solidIcon: HiPencilSquare, outlineIcon: HiOutlinePencilSquare },
        { id: 'documentation', label: 'Dokumen', path: '/documentation', solidIcon: HiDocumentText, outlineIcon: HiOutlineDocumentText },
        { id: 'notifications', label: 'Notifikasi', path: '/notifications', solidIcon: HiBell, outlineIcon: HiOutlineBell, badge: unreadCount },
        { id: 'profile', label: 'Profil', path: '/profile', solidIcon: HiUser, outlineIcon: HiOutlineUser }
      ];

  const filteredItems = flatMenuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const getFlavorEmoji = (id) => {
    switch (id) {
      case 'platform2': return '🚀';
      case 'platform3': return '⚡';
      case 'platform4': return '🛡️';
      default: return '💎';
    }
  };

  const renderNavItem = (item, isMobileView = false) => {
    const isActive = location.pathname === item.path;
    const Icon = isMainDesktopalie ? item.solidIcon : item.outlineIcon;
    const styleModeClass = isMainDesktopalie ? 'main-style' : 'sub-style';

    return (
      <NavLink
        key={item.id}
        to={item.path}
        onClick={() => {
          if (isMobileView) setIsMobileMenuOpen(false);
        }}
        className={`sidebar-flat-item ${styleModeClass} ${isActive ? 'active' : ''}`}
        title={item.label}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isCollapsed && !isMobileView ? 0 : '0.75rem',
          padding: '0.65rem 0.85rem',
          marginBottom: '0.25rem',
          borderRadius: isMainDesktopalie ? 'var(--radius-sm)' : '0 var(--radius-sm) var(--radius-sm) 0',
          textDecoration: 'none',
          color: isActive ? '#FFFFFF' : 'var(--text-sidebar-muted, #E2E8F0)',
          backgroundColor: isActive 
            ? (isMainDesktopalie ? 'var(--bg-sidebar-active, #2563EB)' : 'var(--bg-sidebar-hover, rgba(255, 255, 255, 0.14))') 
            : 'transparent',
          borderLeft: !isMainDesktopalie ? (isActive ? '4px solid #60A5FA' : '4px solid transparent') : 'none',
          boxShadow: isMainDesktopalie && isActive ? '0 4px 14px rgba(0, 0, 0, 0.25)' : 'none',
          justifyContent: isCollapsed && !isMobileView ? 'center' : 'flex-start',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <Icon style={{
          fontSize: '1.25rem',
          flexShrink: 0,
          color: isActive ? '#FFFFFF' : 'inherit',
          transition: 'transform 0.2s ease',
          transform: isActive ? 'scale(1.08)' : 'scale(1)'
        }} />

        {(!isCollapsed || isMobileView) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            minWidth: 0
          }}>
            <span style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '0.01em',
              fontWeight: isActive ? '800' : '600',
              color: isActive ? '#FFFFFF' : 'inherit'
            }}>
              {item.label}
            </span>

            {Boolean(item.badge && item.badge > 0) && (
              <span style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.675rem',
                fontWeight: '800',
                padding: '0.1rem 0.45rem',
                borderRadius: '99px',
                lineHeight: '1.2',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
              }}>
                {item.badge}
              </span>
            )}
          </div>
        )}
      </NavLink>
    );
  };

  const renderUserProfileItem = (isMobileView = false) => (
    <NavLink
      to="/profile"
      onClick={() => { if (isMobileView) setIsMobileMenuOpen(false); }}
      title="Profil Saya"
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.55rem 0.65rem',
        borderRadius: 'var(--radius-sm)',
        textDecoration: 'none',
        backgroundColor: isActive ? 'var(--bg-sidebar-hover)' : 'transparent',
        border: 'none',
        transition: 'all 0.15s ease'
      })}
    >
      <div style={{
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.95rem',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        {userProfile?.avatar_url ? (
          <img src={userProfile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : null}
        <FiUser style={{ fontSize: '1.05rem', display: userProfile?.avatar_url ? 'none' : 'block' }} />
      </div>
      {(!isCollapsed || isMobileView) && (
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-sidebar-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {userProfile?.full_name || 'User'}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-sidebar-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email}
          </span>
        </div>
      )}
    </NavLink>
  );

  const renderNavContent = (isMobileView = false) => (
    <>
      {/* PLATFORM WORKSPACE SWITCHER */}
      <div style={{ marginBottom: '0.75rem' }}>
        <select
          value={flavorId}
          onChange={(e) => switchFlavor(e.target.value)}
          aria-label="Pilih Platform Workspace"
          style={{
            width: '100%',
            padding: '0.45rem 0.65rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-sidebar)',
            backgroundColor: 'var(--bg-sidebar-hover)',
            color: 'var(--text-sidebar-main)',
            fontSize: '0.78rem',
            fontWeight: '700',
            cursor: 'pointer',
            outline: 'none',
            transition: 'border-color 0.15s ease'
          }}
        >
          <option value="platform1">💎 Desktopalie (Utama)</option>
          <option value="platform3">⚡ Gamma</option>
          <option value="platform2">🚀 Beta</option>
          <option value="platform4">🛡️ Delta</option>
        </select>
      </div>

      {/* SEARCH INPUT */}
      <div style={{ position: 'relative', marginBottom: '0.85rem', display: 'flex', alignItems: 'center' }}>
        <HiMagnifyingGlass style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-sidebar-muted)', fontSize: '1rem', pointerEvents: 'none' }} />
        <input
          ref={searchInputRef}
          type="text"
          placeholder={t('searchMenu') || 'Cari menu...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem 0.5rem 2.25rem',
            fontSize: '0.8rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-sidebar)',
            backgroundColor: 'var(--bg-sidebar-hover)',
            color: 'var(--text-sidebar-main)',
            outline: 'none'
          }}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '0.6rem', background: 'transparent', border: 'none', color: 'var(--text-sidebar-muted)', cursor: 'pointer', padding: '0.2rem' }}>
            <HiXMark style={{ fontSize: '1rem' }} />
          </button>
        )}
      </div>

      {/* FLAT MENU LIST */}
      <div className="sidebar-nav-list" style={{ flex: 1, overflowY: 'auto' }}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => renderNavItem(item, isMobileView))
        ) : (
          <div style={{ padding: '1rem 0.5rem', fontSize: '0.775rem', color: 'var(--text-sidebar-muted)', textAlign: 'center' }}>
            Menu tidak ditemukan
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* TABLET / MOBILE TOPBAR */}
      <div className="tablet-mobile-topbar" style={{ display: isTabletOrMobile ? 'block' : 'none', position: 'sticky', top: 0, zIndex: 9999, backgroundColor: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-sidebar)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {isMainDesktopalie ? (
              <>
                <DesktopalieMark size={28} style={{ color: 'var(--text-sidebar-main)', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ fontSize: '0.925rem', fontWeight: '800', margin: 0, color: 'var(--text-sidebar-main)' }}>Desktopalie</h2>
                  <span style={{ fontSize: '0.625rem', color: 'var(--text-sidebar-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Backoffice Utama</span>
                </div>
              </>
            ) : (
              <div className="sidebar-subplatform-badge">
                <span>{getFlavorEmoji(flavorId)}</span>
                <span>Portal {flavor?.shortName}</span>
              </div>
            )}
          </div>
          <button onClick={toggleCollapse} style={{ background: 'var(--bg-sidebar-hover)', border: '1px solid var(--border-sidebar)', color: 'var(--text-sidebar-main)', padding: '0.45rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isMobileMenuOpen ? <HiXMark style={{ fontSize: '1.25rem' }} /> : <HiBars3 style={{ fontSize: '1.25rem' }} />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--bg-sidebar)', padding: '1rem', borderBottom: '1px solid var(--border-sidebar)', boxShadow: '0 12px 30px rgba(0,0,0,0.25)', maxHeight: 'calc(100vh - 70px)', overflowY: 'auto' }}>
            {renderNavContent(true)}
            <div style={{ borderTop: '1px solid var(--border-sidebar)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>{renderUserProfileItem(true)}</div>
          </div>
        )}
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
        style={{
          display: isTabletOrMobile ? 'none' : 'flex',
          flexDirection: 'column',
          width: isCollapsed ? '72px' : '256px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          flexShrink: 0,
          backgroundColor: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-sidebar)',
          padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1rem',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s ease',
          zIndex: 40,
          boxSizing: 'border-box'
        }}
      >
        {/* HEADER BRANDING: Main Backoffice with Logo vs Sub-Platform with Badge Only */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          marginBottom: '1.25rem',
          minHeight: '40px',
          gap: '0.5rem'
        }}>
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
              {isMainDesktopalie ? (
                <>
                  <DesktopalieMark size={30} style={{ color: 'var(--text-sidebar-main)', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-sidebar-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Desktopalie
                    </h2>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-sidebar-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.1rem', whiteSpace: 'nowrap' }}>
                      Backoffice Utama
                    </span>
                  </div>
                </>
              ) : (
                <div className="sidebar-subplatform-badge">
                  <span>{getFlavorEmoji(flavorId)}</span>
                  <span>Portal {flavor?.shortName}</span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={toggleCollapse}
            title={isCollapsed ? 'Buka Sidebar' : 'Tutup Sidebar'}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-sidebar-muted)',
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
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <HiBars3 />
          </button>
        </div>

        {/* COLLAPSED MODE SEARCH TRIGGER */}
        {isCollapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <button
              onClick={handleSearchIconClick}
              title="Cari menu"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-sidebar)',
                backgroundColor: 'var(--bg-sidebar-hover)',
                color: 'var(--text-sidebar-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.15rem',
                transition: 'all 0.15s ease'
              }}
            >
              <HiMagnifyingGlass />
            </button>
          </div>
        )}

        {/* EXPANDED VIEW: SEARCH & FLAT MENU */}
        {!isCollapsed && renderNavContent(false)}

        {/* COLLAPSED VIEW: ICON ONLY FLAT LIST */}
        {isCollapsed && (
          <div className="sidebar-nav-list" style={{ flex: 1, overflowY: 'auto' }}>
            {filteredItems.map(item => renderNavItem(item, false))}
          </div>
        )}

        {/* BOTTOM USER PROFILE */}
        <div style={{ borderTop: '1px solid var(--border-sidebar)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
          {renderUserProfileItem(false)}
        </div>
      </aside>
    </>
  );
}
