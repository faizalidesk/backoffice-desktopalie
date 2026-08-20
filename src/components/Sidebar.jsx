import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  FiSearch, 
  FiX, 
  FiLayers, 
  FiUsers, 
  FiBell, 
  FiDollarSign,
  FiChevronDown
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
  const { flavor, flavorId, subPlatformFlavors, isMainDesktopalie, switchFlavor, resetToMainFlavor } = useFlavor();
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(() => notificationService.getUnreadCount());
  
  // Accordion open/close state: By default all categories are collapsed
  const [openCategories, setOpenCategories] = useState({});

  const [userProfile, setUserProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('desktopalie_profile') || localStorage.getItem(`desktopalie_profile_${user?.id}`);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  });
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

  // Load user profile
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

  // Window resize handler for mobile/tablet detection
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

  // Toggle Category Accordion Dropdown
  const toggleCategory = (catId) => {
    setOpenCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // =========================================================================
  // CATEGORIZED MENUS SORTED ALPHABETICALLY (A-Z)
  // 1. Analitik & Dashboard
  // 2. Dokumentasi & Catatan
  // 3. Inovasi & Proyek
  // 4. Manajemen & Finansial
  // 5. Pengaturan & Sistem
  // =========================================================================
  const rawCategories = [
    {
      id: 'analytics',
      title: 'Analitik & Dashboard',
      icon: FiGrid,
      items: [
        { label: t('dashboard') || 'Dashboard Overview', path: '/dashboard', icon: FiGrid },
        { label: t('workspaces') || 'Workspaces', path: '/workspaces', icon: FiLayers },
        { label: t('notifications') || 'Notifikasi', path: '/notifications', icon: FiBell, badge: unreadCount },
      ]
    },
    {
      id: 'docs',
      title: 'Dokumentasi & Catatan',
      icon: FiBookOpen,
      items: [
        { label: t('documentation') || 'Dokumentasi Sistem', path: '/documentation', icon: FiBookOpen },
        { label: t('notes') || 'Jurnal & Catatan', path: '/notes', icon: FiFileText },
        { label: t('bookmarks') || 'Resource Library', path: '/bookmarks', icon: FiBookmark },
      ]
    },
    {
      id: 'innovation',
      title: 'Inovasi & Proyek',
      icon: FiFolder,
      items: [
        { label: t('projects') || 'Portofolio Proyek', path: '/projects', icon: FiFolder },
        { label: t('experiments') || 'Motion & Eksperimen', path: '/experiments', icon: FiCpu },
        { label: t('todos') || 'Kanban & To-Do', path: '/todos', icon: FiCheckSquare },
      ]
    },
    {
      id: 'management',
      title: 'Manajemen & Finansial',
      icon: FiDollarSign,
      items: [
        { label: t('transactions') || 'Transaksi & Keuangan', path: '/transactions', icon: FiDollarSign },
        { label: 'Membership Pengguna', path: '/members', icon: FiUsers },
        { label: t('landingManager') || 'Landing Page Builder', path: '/landing-manager', icon: FiLayout },
      ]
    },
    {
      id: 'settings',
      title: 'Pengaturan & Sistem',
      icon: FiTool,
      items: [
        { label: t('maintenance') || 'Maintenance & Fitur', path: '/maintenance', icon: FiTool },
        { label: t('profile') || 'Profil Akun Saya', path: '/profile', icon: FiUser },
      ]
    }
  ];

  // Guarantee strict alphabetical sort by Category Title (A-Z)
  const menuCategories = [...rawCategories].sort((a, b) => a.title.localeCompare(b.title));

  // Render Accordion Category Component
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
    const isCategoryOpen = trimmedQuery ? true : !!openCategories[category.id];
    const hasActiveChild = category.items.some(item => location.pathname === item.path);
    const CategoryIcon = category.icon;
    const totalBadges = category.items.reduce((sum, item) => sum + (item.badge || 0), 0);

    return (
      <div key={category.id} style={{ marginBottom: '0.35rem' }}>
        {/* Category Header Button (Accordion Trigger) */}
        <button
          type="button"
          onClick={() => toggleCategory(category.id)}
          className={`sidebar-category-btn ${hasActiveChild ? 'has-active' : ''}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isCategoryOpen ? 'var(--bg-sidebar-hover)' : 'transparent',
            border: `1px solid ${hasActiveChild ? 'var(--border-sidebar)' : 'transparent'}`,
            color: hasActiveChild ? '#FFFFFF' : 'var(--text-sidebar-main)',
            fontSize: '0.825rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
            <CategoryIcon style={{ 
              fontSize: '1.1rem', 
              flexShrink: 0, 
              color: hasActiveChild ? 'var(--accent-violet, #818CF8)' : 'var(--text-sidebar-muted)' 
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
            {totalBadges > 0 && (
              <span style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.675rem',
                fontWeight: '800',
                padding: '0.05rem 0.4rem',
                borderRadius: '99px'
              }}>
                {totalBadges}
              </span>
            )}
            <FiChevronDown 
              className={`sidebar-chevron-icon ${isCategoryOpen ? 'open' : ''}`} 
              style={{
                transform: isCategoryOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>
        </button>

        {/* Sub-menu Dropdown List with Smooth CSS Transition */}
        <div 
          className={`sidebar-accordion-body ${isCategoryOpen ? 'open' : 'closed'}`}
          style={{
            maxHeight: isCategoryOpen ? `${itemsToRender.length * 52 + 20}px` : '0px',
            opacity: isCategoryOpen ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, margin 0.25s ease',
            marginTop: isCategoryOpen ? '0.2rem' : '0',
            marginBottom: isCategoryOpen ? '0.4rem' : '0'
          }}
        >
          <div className="sidebar-submenu-container" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            paddingLeft: '0.6rem',
            borderLeft: '2px solid var(--border-sidebar, rgba(255, 255, 255, 0.12))',
            marginLeft: '1.25rem'
          }}>
            {itemsToRender.map((item) => {
              const ItemIcon = item.icon;
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
                  className={({ isActive }) => `sidebar-subitem-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? '700' : '600',
                    textDecoration: 'none',
                    color: isActive ? '#FFFFFF' : 'var(--text-sidebar-muted)',
                    backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                    boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
                    transition: 'all 0.15s ease'
                  })}
                >
                  <ItemIcon style={{ fontSize: '1rem', flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                    {item.label}
                  </span>
                  {item.badge > 0 && (
                    <span style={{
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      fontSize: '0.675rem',
                      fontWeight: '800',
                      padding: '0.05rem 0.4rem',
                      borderRadius: '99px',
                      marginLeft: 'auto'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // User Profile Component (Minimalist with photo avatar / default fallback icon)
  const renderUserProfile = (isMobileView = false) => (
    <NavLink
      to="/profile"
      title={userProfile?.full_name || user?.email || 'Profil Saya'}
      onClick={() => {
        if (isMobileView) {
          setIsMobileMenuOpen(false);
        }
      }}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: isCollapsed && !isMobileView ? 0 : '0.75rem',
        justifyContent: isCollapsed && !isMobileView ? 'center' : 'flex-start',
        padding: isCollapsed && !isMobileView ? '0.5rem 0' : '0.6rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'var(--bg-sidebar-hover)',
        border: `1px solid ${isActive ? 'var(--text-sidebar-main)' : 'var(--border-sidebar)'}`,
        textDecoration: 'none',
        color: 'var(--text-sidebar-main)',
        marginTop: 'auto',
        marginBottom: '0.5rem',
        transition: 'all 0.15s ease'
      })}
    >
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        {userProfile?.avatar_url ? (
          <img
            src={userProfile.avatar_url}
            alt="Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.nextSibling) {
                e.currentTarget.nextSibling.style.display = 'block';
              }
            }}
          />
        ) : null}
        <FiUser style={{
          fontSize: '1rem',
          display: userProfile?.avatar_url ? 'none' : 'block'
        }} />
      </div>

      {(!isCollapsed || isMobileView) && (
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '0.1rem', minWidth: 0, flex: 1 }}>
          <span style={{
            fontSize: '0.825rem',
            fontWeight: '700',
            color: 'var(--text-sidebar-main)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
          </span>
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-sidebar-muted)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {user?.email || 'Member'}
          </span>
        </div>
      )}
    </NavLink>
  );

  // RENDERING NAVIGATION CONTENT (Used for both Desktop Sidebar and Mobile Overlay Drawer)
  const renderNavContent = (isMobileView = false) => (
    <>
      {/* SUB-PLATFORM SWITCHER */}
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
            padding: '0.5rem 0.65rem',
            fontSize: '0.775rem',
            fontWeight: '600',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-sidebar)',
            backgroundColor: 'var(--bg-sidebar-hover)',
            color: 'var(--text-sidebar-main)',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <option value="platform1" style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-sidebar-main)' }}>
            🏠 Desktopalie Main
          </option>
          {subPlatformFlavors?.map((f) => (
            <option key={f.id} value={f.id} style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-sidebar-main)' }}>
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
          left: '0.75rem',
          color: 'var(--text-sidebar-muted)',
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
            border: '1px solid var(--border-sidebar)',
            backgroundColor: 'var(--bg-sidebar-hover)',
            color: 'var(--text-sidebar-main)',
            outline: 'none',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-sidebar)'}
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

      {/* MINIMALIST USER PROFILE */}
      {renderUserProfile(isMobileView)}

      {/* FOOTER */}
      <div style={{
        paddingTop: '0.75rem',
        marginTop: '0.25rem',
        borderTop: '1px solid var(--border-sidebar)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.725rem',
        color: 'var(--text-sidebar-muted)',
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
            <DesktopalieMark size={28} style={{ color: 'var(--text-sidebar-main)', flexShrink: 0 }} />
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
                {isMainDesktopalie ? 'Main Backoffice' : `Platform ${flavor.shortName}`}
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
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
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
      width: isCollapsed ? '80px' : '260px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-sidebar)',
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
        borderBottom: '1px solid var(--border-sidebar)',
        marginBottom: '1rem'
      }}>
        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            <DesktopalieMark size={30} style={{ color: 'var(--text-sidebar-main)', flexShrink: 0, marginTop: '-1px' }} />
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
              padding: '0.5rem 0.65rem',
              fontSize: '0.775rem',
              fontWeight: '600',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-sidebar)',
              backgroundColor: 'var(--bg-sidebar-hover)',
              color: 'var(--text-sidebar-main)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <option value="platform1" style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-sidebar-main)' }}>
              🏠 Desktopalie Main
            </option>
            {subPlatformFlavors?.map((f) => (
              <option key={f.id} value={f.id} style={{ backgroundColor: 'var(--bg-sidebar)', color: 'var(--text-sidebar-main)' }}>
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
            border: '1px solid var(--border-sidebar)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-sidebar-muted)',
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
          marginBottom: '1rem',
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
            placeholder={t('searchMenu')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 2rem 0.45rem 2.1rem',
              fontSize: '0.825rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-sidebar)',
              backgroundColor: 'var(--bg-sidebar-hover)',
              color: 'var(--text-sidebar-main)',
              outline: 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-sidebar)'}
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
      ) : (
        <button
          onClick={handleSearchIconClick}
          title={t('searchMenu')}
          style={{
            background: 'transparent',
            border: '1px solid var(--border-sidebar)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-sidebar-muted)',
            cursor: 'pointer',
            padding: '0.5rem 0',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FiSearch style={{ fontSize: '1.1rem' }} />
        </button>
      )}

      {/* CATEGORIZED ACCORDION NAV LIST (A-Z) */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
        {!isCollapsed ? (
          menuCategories.map((category) => renderCategoryAccordion(category, false))
        ) : (
          /* COLLAPSED MODE: RENDER CATEGORY ICONS THAT EXPAND SIDEBAR & TRIGGER ACCORDION */
          menuCategories.map((category) => {
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
                  setOpenCategories(prev => ({ ...prev, [category.id]: true }));
                }}
                title={category.title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem 0',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: hasActiveChild ? 'var(--bg-sidebar-active)' : 'transparent',
                  color: hasActiveChild ? '#FFFFFF' : 'var(--text-sidebar-muted)',
                  cursor: 'pointer',
                  position: 'relative',
                  width: '100%',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => !hasActiveChild && (e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)')}
                onMouseOut={(e) => !hasActiveChild && (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <CategoryIcon style={{ fontSize: '1.25rem' }} />
                {totalBadges > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '8px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444'
                  }} />
                )}
              </button>
            );
          })
        )}
      </nav>

      {/* MINIMALIST USER PROFILE */}
      {renderUserProfile(false)}

      {/* FOOTER */}
      <div style={{
        paddingTop: '0.75rem',
        marginTop: '0.25rem',
        borderTop: '1px solid var(--border-sidebar)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        fontSize: '0.725rem',
        color: 'var(--text-sidebar-muted)',
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
