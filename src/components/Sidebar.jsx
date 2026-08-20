import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiGrid, 
  FiFolder, 
  FiCheckSquare, 
  FiFileText, 
  FiBookOpen, 
  FiUsers, 
  FiTool, 
  FiSearch,
  FiX,
  FiMenu,
  FiBookmark,
  FiDollarSign,
  FiCpu,
  FiLayers,
  FiLayout,
  FiChevronDown,
  FiBell,
  FiUser,
  FiZap
} from 'react-icons/fi';
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

  // Local storage cache profile
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('desktopalie_profile') || localStorage.getItem(`desktopalie_profile_${user?.id}`);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  });

  const searchInputRef = useRef(null);

  // Accordion open category state (default: 'analytics' or active page's category)
  const [openCategoryId, setOpenCategoryId] = useState('analytics');

  // Sidebar Collapsed state (default false / open on desktop)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('desktopalie_sidebar_collapsed') === 'true';
  });

  // Mobile / Tablet responsiveness
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 1024 : false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-load profile
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

  // Window resize handler
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

  // Notification subscription
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

  const toggleCategory = (catId) => {
    setOpenCategoryId(prev => (prev === catId ? null : catId));
  };

  // =========================================================================
  // COMPLETE FEATURES CATEGORIZED ACCORDION MENUS (A-Z)
  // 1. Analitik (Dashboard, Workspaces, Notifikasi, Portal jika sub-platform)
  // 2. Dokumentasi (Dokumentasi, Catatan, Bookmarks)
  // 3. Inovasi (Proyek, Eksperimen, To-Do List)
  // 4. Manajemen (Transaksi, Membership, Landing Manager)
  // 5. Sistem (Maintenance, Profil Akun)
  // =========================================================================
  const rawCategories = [
    {
      id: 'analytics',
      title: 'Analitik',
      icon: FiGrid,
      items: [
        ...(!isMainDesktopalie ? [{ label: `Portal ${flavor?.shortName || ''}`, path: '/portal', icon: FiZap }] : []),
        { label: t('dashboard') || 'Dashboard', path: '/dashboard', icon: FiGrid },
        { label: t('workspaces') || 'Workspaces', path: '/workspaces', icon: FiLayers },
        { label: t('notifications') || 'Notifikasi', path: '/notifications', icon: FiBell, badge: unreadCount }
      ]
    },
    {
      id: 'docs',
      title: 'Dokumentasi',
      icon: FiBookOpen,
      items: [
        { label: t('documentation') || 'Dokumentasi', path: '/documentation', icon: FiBookOpen },
        { label: t('notes') || 'Catatan', path: '/notes', icon: FiFileText },
        { label: t('bookmarks') || 'Bookmarks', path: '/bookmarks', icon: FiBookmark }
      ]
    },
    {
      id: 'innovation',
      title: 'Inovasi',
      icon: FiFolder,
      items: [
        { label: t('projects') || 'Proyek', path: '/projects', icon: FiFolder },
        { label: t('experiments') || 'Eksperimen', path: '/experiments', icon: FiCpu },
        { label: t('todos') || 'To-Do List', path: '/todos', icon: FiCheckSquare }
      ]
    },
    {
      id: 'management',
      title: 'Manajemen',
      icon: FiDollarSign,
      items: [
        { label: t('transactions') || 'Transaksi', path: '/transactions', icon: FiDollarSign },
        { label: 'Membership', path: '/members', icon: FiUsers },
        { label: t('landingManager') || 'Landing Manager', path: '/landing-manager', icon: FiLayout }
      ]
    },
    {
      id: 'settings',
      title: 'Sistem',
      icon: FiTool,
      items: [
        { label: t('maintenance') || 'Maintenance', path: '/maintenance', icon: FiTool },
        { label: t('profile') || 'Profil Akun', path: '/profile', icon: FiUser }
      ]
    }
  ];

  // Guarantee strict alphabetical sort by Category Title (A-Z)
  const menuCategories = [...rawCategories].sort((a, b) => a.title.localeCompare(b.title));

  // Automatically keep category open if active route is inside it
  useEffect(() => {
    const currentCategory = menuCategories.find(cat => 
      cat.items.some(item => location.pathname === item.path)
    );
    if (currentCategory && openCategoryId !== currentCategory.id && !searchQuery) {
      setOpenCategoryId(currentCategory.id);
    }
  }, [location.pathname]);

  // Render Accordion Category Component (Fixed without shifting / transform)
  const renderCategoryAccordion = (category, isMobileView = false) => {
    const trimmedQuery = searchQuery.toLowerCase().trim();
    
    // Filter items based on search query
    const matchingItems = category.items.filter(item => 
      item.label.toLowerCase().includes(trimmedQuery) ||
      category.title.toLowerCase().includes(trimmedQuery)
    );

    if (trimmedQuery && matchingItems.length === 0) {
      return null;
    }

    const itemsToRender = trimmedQuery ? matchingItems : category.items;
    const isCategoryOpen = trimmedQuery ? true : openCategoryId === category.id;
    const hasActiveChild = category.items.some(item => location.pathname === item.path);
    const CategoryIcon = category.icon;
    const totalBadges = category.items.reduce((sum, item) => sum + (item.badge || 0), 0);

    return (
      <div key={category.id} style={{ marginBottom: '0.25rem' }}>
        {/* Category Header Button (Clean, borderless, NO shifting/transform) */}
        <button
          type="button"
          onClick={() => toggleCategory(category.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '0.55rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isCategoryOpen ? 'var(--bg-sidebar-hover)' : 'transparent',
            border: 'none',
            outline: 'none',
            color: hasActiveChild ? 'var(--primary)' : 'var(--text-sidebar-main)',
            fontSize: '0.825rem',
            fontWeight: '700',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background-color 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
            <CategoryIcon style={{ 
              fontSize: '1.05rem', 
              flexShrink: 0, 
              color: hasActiveChild ? 'var(--primary)' : 'var(--text-sidebar-muted)' 
            }} />
            <span style={{ 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              flex: 1,
              letterSpacing: '0.01em'
            }}>
              {category.title}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
            {totalBadges > 0 && (
              <span style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: '800',
                padding: '0.05rem 0.35rem',
                borderRadius: '99px'
              }}>
                {totalBadges}
              </span>
            )}
            <FiChevronDown 
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-sidebar-muted)',
                transform: isCategoryOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
          </div>
        </button>

        {/* Sub-menu Dropdown List (Clean, NO button box, NO shifting/geser) */}
        {isCategoryOpen && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.15rem',
            paddingLeft: '0.65rem',
            borderLeft: '2px solid var(--border-sidebar, #E2E8F0)',
            marginLeft: '1.2rem',
            marginTop: '0.2rem',
            marginBottom: '0.35rem'
          }}>
            {itemsToRender.map((item) => {
              const SubIcon = item.icon;
              const isSubActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => {
                    if (isMobileView) setIsMobileMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: isSubActive ? '700' : '500',
                    textDecoration: 'none',
                    color: isSubActive ? 'var(--primary)' : 'var(--text-sidebar-muted)',
                    backgroundColor: isSubActive ? 'var(--bg-sidebar-hover)' : 'transparent',
                    border: 'none',
                    transition: 'background-color 0.15s ease, color 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0, flex: 1 }}>
                    <SubIcon style={{
                      fontSize: '0.95rem',
                      flexShrink: 0,
                      color: isSubActive ? 'var(--primary)' : 'var(--text-sidebar-muted)'
                    }} />
                    <span style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.label}
                    </span>
                  </div>

                  {Boolean(item.badge && item.badge > 0) && (
                    <span style={{
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontWeight: '800',
                      padding: '0.05rem 0.35rem',
                      borderRadius: '99px',
                      lineHeight: '1.2'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // User Profile Footer Element
  const renderUserProfile = (isMobileView = false) => (
    <div style={{
      padding: isCollapsed && !isMobileView ? '0.75rem 0' : '0.75rem 0.25rem',
      borderTop: '1px solid var(--border-sidebar)',
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: isCollapsed && !isMobileView ? 'center' : 'flex-start',
      gap: '0.65rem'
    }}>
      <NavLink
        to="/profile"
        onClick={() => {
          if (isMobileView) setIsMobileMenuOpen(false);
        }}
        title="Profil Pengguna"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          textDecoration: 'none',
          color: 'var(--text-sidebar-main)',
          minWidth: 0,
          flex: 1
        }}
      >
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-sidebar-hover)',
          border: '1px solid var(--border-sidebar)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.85rem',
          fontWeight: '700',
          color: 'var(--primary)',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {userProfile?.avatar_url ? (
            <img src={userProfile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <FiUser style={{ fontSize: '1rem', color: 'var(--text-sidebar-muted)' }} />
          )}
        </div>

        {(!isCollapsed || isMobileView) && (
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              color: 'var(--text-sidebar-main)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {userProfile?.full_name || 'Admin'}
            </span>
            <span style={{
              fontSize: '0.68rem',
              color: 'var(--text-sidebar-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.email || 'admin@desktopalie.my.id'}
            </span>
          </div>
        )}
      </NavLink>
    </div>
  );

  // Nav Content for Tablet/Mobile or Desktop Expanded
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

      {/* SEARCH INPUT BOX */}
      <div style={{
        position: 'relative',
        marginBottom: '0.85rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <FiSearch style={{
          position: 'absolute',
          left: '0.75rem',
          color: 'var(--text-sidebar-muted)',
          fontSize: '0.9rem',
          pointerEvents: 'none'
        }} />
        <input
          ref={searchInputRef}
          type="text"
          placeholder={t('searchMenu') || 'Cari menu...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.45rem 2rem 0.45rem 2.1rem',
            fontSize: '0.8rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-sidebar)',
            backgroundColor: 'var(--bg-sidebar-hover)',
            color: 'var(--text-sidebar-main)',
            outline: 'none'
          }}
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
              color: 'var(--text-sidebar-muted)',
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

      {/* CATEGORIZED ACCORDION NAV LIST (A-Z) */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
        {menuCategories.map((category) => renderCategoryAccordion(category, isMobileView))}
      </nav>
    </>
  );

  // TABLET & MOBILE VIEW
  if (isTabletOrMobile) {
    return (
      <aside style={{
        width: '100%',
        backgroundColor: 'var(--bg-sidebar)',
        borderBottom: '1px solid var(--border-sidebar)',
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
            <DesktopalieMark size={28} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{
                fontSize: '0.9rem',
                fontWeight: '800',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-sidebar-main)',
                lineHeight: '1.1',
                margin: 0
              }}>
                Desktopalie
              </h2>
              <span style={{
                fontSize: '0.625rem',
                color: isMainDesktopalie ? 'var(--text-sidebar-muted)' : '#FB7185',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                lineHeight: '1.2',
                marginTop: '0.1rem'
              }}>
                {isMainDesktopalie ? 'Desktopalie (Utama)' : flavor?.name || flavor?.shortName}
              </span>
            </div>
          </div>

          <button
            onClick={toggleCollapse}
            aria-label="Toggle Menu Navigation"
            title="Toggle Menu Navigation"
            style={{
              background: 'var(--bg-sidebar-hover)',
              border: '1px solid var(--border-sidebar)',
              color: 'var(--text-sidebar-main)',
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
            borderBottom: '1px solid var(--border-sidebar)',
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
            {renderUserProfile(true)}
          </div>
        )}
      </aside>
    );
  }

  // DESKTOP VIEW
  return (
    <aside
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        width: isCollapsed ? '72px' : '260px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-sidebar)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1rem',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s ease',
        zIndex: 40,
        boxSizing: 'border-box',
        flexShrink: 0
      }}
    >
      {/* Sidebar Header & Hamburger Button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        padding: isCollapsed ? '0.25rem 0 0.85rem 0' : '0.25rem 0.25rem 0.85rem 0.25rem',
        borderBottom: '1px solid var(--border-sidebar)',
        marginBottom: '0.85rem'
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            <DesktopalieMark size={30} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '-1px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              <h2 style={{
                fontSize: '0.95rem',
                fontWeight: '800',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--text-sidebar-main)',
                lineHeight: '1.1',
                margin: 0,
                whiteSpace: 'nowrap'
              }}>
                Desktopalie
              </h2>
              <span style={{
                fontSize: '0.65rem',
                color: isMainDesktopalie ? 'var(--text-sidebar-muted)' : '#FB7185',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                lineHeight: '1.2',
                marginTop: '0.15rem',
                whiteSpace: 'nowrap'
              }}>
                {isMainDesktopalie ? 'Desktopalie (Utama)' : flavor?.name || flavor?.shortName}
              </span>
            </div>
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
            transition: 'background-color 0.15s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FiMenu />
        </button>
      </div>

      {/* COLLAPSED MODE SEARCH TRIGGER */}
      {isCollapsed && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem' }}>
          <button
            onClick={handleSearchIconClick}
            title={t('searchMenu') || 'Cari menu'}
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
              fontSize: '1.05rem',
              transition: 'background-color 0.15s ease'
            }}
          >
            <FiSearch />
          </button>
        </div>
      )}

      {/* EXPANDED VIEW: PLATFORM SWITCHER, SEARCH & ACCORDION MENU */}
      {!isCollapsed && renderNavContent(false)}

      {/* COLLAPSED VIEW: CATEGORY ICONS */}
      {isCollapsed && (
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
          {menuCategories.map((category) => {
            const CategoryIcon = category.icon;
            const hasActiveChild = category.items.some(item => location.pathname === item.path);
            const totalBadges = category.items.reduce((sum, item) => sum + (item.badge || 0), 0);

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setIsCollapsed(false);
                  localStorage.setItem('desktopalie_sidebar_collapsed', 'false');
                  setOpenCategoryId(category.id);
                }}
                title={category.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.65rem 0',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: hasActiveChild ? 'var(--bg-sidebar-hover)' : 'transparent',
                  color: hasActiveChild ? 'var(--primary)' : 'var(--text-sidebar-muted)',
                  cursor: 'pointer',
                  position: 'relative',
                  width: '100%',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <CategoryIcon style={{ fontSize: '1.2rem' }} />
                {totalBadges > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '6px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444'
                  }} />
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* USER PROFILE FOOTER */}
      {renderUserProfile(false)}
    </aside>
  );
}
