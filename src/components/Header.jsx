import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useFlavor } from '../context/FlavorContext';
import { Link, useNavigate } from 'react-router-dom';
import { backofficeService } from '../services/backofficeService';
import { notificationService } from '../services/notificationService';
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
  FiSettings,
  FiBell,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiTrash2,
  FiX,
  FiClock,
  FiLayers,
  FiCpu,
  FiSidebar
} from 'react-icons/fi';

function formatFullDateTime(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';
  } catch (e) {
    return dateString;
  }
}

const PLATFORM_LABELS = {
  all: { name: 'Semua Platform (Broadcast)', bg: '#F43F5E', color: '#FFFFFF' },
  platform1: { name: 'Platform 1 - Alpha (Main)', bg: '#3B82F6', color: '#FFFFFF' },
  platform2: { name: 'Platform 2 - Beta Logistics', bg: '#10B981', color: '#FFFFFF' },
  platform3: { name: 'Platform 3 - Gamma Video Streaming', bg: '#8B5CF6', color: '#FFFFFF' },
  platform4: { name: 'Platform 4 - Delta Financial ERP', bg: '#F59E0B', color: '#FFFFFF' }
};

export default function Header({ title = 'Dashboard Overview' }) {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { activeFlavor, flavorId } = useFlavor();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState('all');
  const [notifications, setNotifications] = useState(() => notificationService.getNotifications());
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('desktopalie_profile') || localStorage.getItem(`desktopalie_profile_${user?.id}`);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  });
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Refresh notifications on service subscriber event
  useEffect(() => {
    const unsubscribe = notificationService.subscribe(() => {
      setNotifications(notificationService.getNotifications());
    });
    return unsubscribe;
  }, []);

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

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    localStorage.setItem('desktopalie_flavor', 'platform1');
    try {
      await logout();
    } catch (e) {}
    navigate('/login');
  };

  const [selectedNotif, setSelectedNotif] = useState(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifs = notifFilter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const handleNotifClick = (notif) => {
    notificationService.markAsRead(notif.id);
    setSelectedNotif(notif);
    setNotifOpen(false);
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

      {/* RIGHT: Status Badge, View Site, Notifications & Profile Dropdown */}
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

        {/* NOTIFICATION BELL BUTTON & POPUP PANEL */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen(prev => !prev)}
            title={t('notifications')}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              transition: 'all 0.15s ease'
            }}
          >
            <FiBell style={{ fontSize: '1.1rem', color: unreadCount > 0 ? 'var(--primary)' : 'var(--text-muted)' }} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: '800',
                height: '18px',
                minWidth: '18px',
                padding: '0 4px',
                borderRadius: '99px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                border: `2px solid ${isDarkMode ? '#1E293B' : '#FFFFFF'}`
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* FLOATING NOTIFICATION DROPDOWN MENU */}
          {notifOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '340px',
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              borderRadius: '16px',
              boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.5)' : '0 15px 35px rgba(15, 23, 42, 0.12)',
              overflow: 'hidden',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeIn 0.15s ease-out'
            }}>
              {/* Header section */}
              <div style={{
                padding: '0.85rem 1rem',
                borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.925rem', color: 'var(--text-main)' }}>
                    {t('notifications')}
                  </span>
                  {unreadCount > 0 && (
                    <span style={{
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      fontSize: '0.725rem',
                      fontWeight: '800',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '99px'
                    }}>
                      {unreadCount} {t('unread')}
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => notificationService.markAllAsRead()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '6px'
                    }}
                  >
                    {t('markAllAsRead')}
                  </button>
                )}
              </div>

              {/* Tab Filters */}
              <div style={{
                display: 'flex',
                padding: '0.5rem 0.75rem 0.25rem 0.75rem',
                gap: '0.5rem',
                borderBottom: `1px solid ${isDarkMode ? '#334155' : '#F1F5F9'}`
              }}>
                <button
                  type="button"
                  onClick={() => setNotifFilter('all')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '99px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    border: 'none',
                    backgroundColor: notifFilter === 'all' ? 'var(--primary)' : 'transparent',
                    color: notifFilter === 'all' ? '#FFFFFF' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {t('all')} ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setNotifFilter('unread')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '99px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    border: 'none',
                    backgroundColor: notifFilter === 'unread' ? 'var(--primary)' : 'transparent',
                    color: notifFilter === 'unread' ? '#FFFFFF' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {t('unread')} ({unreadCount})
                </button>
              </div>

              {/* Notification Items List */}
              <div style={{
                maxHeight: '320px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {filteredNotifs.length === 0 ? (
                  <div style={{
                    padding: '2.5rem 1rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem'
                  }}>
                    <FiBell style={{ fontSize: '1.75rem', marginBottom: '0.5rem', opacity: 0.5 }} />
                    <p style={{ margin: 0 }}>{t('noNotifications')}</p>
                  </div>
                ) : (
                  filteredNotifs.map((item) => {
                    const isUnread = !item.read;
                    const Icon = item.type === 'success' ? FiCheckCircle : item.type === 'warning' ? FiAlertCircle : FiInfo;
                    const iconColor = item.type === 'success' ? '#10B981' : item.type === 'warning' ? '#F59E0B' : '#3B82F6';

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotifClick(item)}
                        style={{
                          padding: '0.85rem 1rem',
                          borderBottom: `1px solid ${isDarkMode ? '#334155' : '#F1F5F9'}`,
                          backgroundColor: isUnread ? (isDarkMode ? 'rgba(59, 130, 246, 0.08)' : 'rgba(239, 246, 255, 0.7)') : 'transparent',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        {/* Type Icon */}
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: `${iconColor}15`,
                          color: iconColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px'
                        }}>
                          <Icon style={{ fontSize: '0.95rem' }} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                            <h4 style={{
                              fontSize: '0.85rem',
                              fontWeight: isUnread ? '800' : '600',
                              color: 'var(--text-main)',
                              margin: 0,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {item.title}
                            </h4>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '0.5rem' }}>
                              {formatTimeAgo(item.timestamp)}
                            </span>
                          </div>
                          <p style={{
                            fontSize: '0.78rem',
                            color: isDarkMode ? '#94A3B8' : '#64748B',
                            margin: 0,
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {item.message}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            notificationService.deleteNotification(item.id);
                          }}
                          title="Hapus"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0.7
                          }}
                        >
                          <FiTrash2 style={{ fontSize: '0.85rem' }} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Panel Footer */}
              {notifications.length > 0 && (
                <div style={{
                  padding: '0.6rem 1rem',
                  borderTop: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                  backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                  textAlign: 'center'
                }}>
                  <button
                    type="button"
                    onClick={() => notificationService.clearAllNotifications()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isDarkMode ? '#94A3B8' : '#64748B',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {t('clearAll')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* TOP BAR AGENTIC AI SIDEBAR TOGGLE ICON BUTTON */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-ai-sidebar'))}
          title="Toggle Agentic AI Copilot Sidebar"
          style={{
            height: '38px',
            padding: '0 0.85rem',
            borderRadius: '999px',
            backgroundColor: isDarkMode ? '#1E293B' : '#0F172A',
            border: `1px solid ${isDarkMode ? '#334155' : '#0284C7'}`,
            color: '#38BDF8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(14, 165, 233, 0.25)',
            fontSize: '0.8rem',
            fontWeight: '700',
            transition: 'all 0.15s ease'
          }}
        >
          <FiCpu style={{ fontSize: '1rem', color: '#38BDF8' }} />
          <span>AI Copilot</span>
          <FiSidebar style={{ fontSize: '0.9rem', opacity: 0.8, transform: 'rotate(180deg)' }} />
        </button>

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

      {/* DETAIL NOTIFICATION POPUP MODAL (POPUP LENGKAP PEMBAHASAN) */}
      {selectedNotif && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1.25rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '540px',
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FiBell style={{ color: 'var(--primary)', fontSize: '1.2rem' }} />
                <span style={{ fontWeight: '800', fontSize: '1rem', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                  Detail & Rincian Notifikasi
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isDarkMode ? '#94A3B8' : '#64748B',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  padding: '0.2rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FiX />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem 1.75rem' }}>
              {/* Target Platform Tag */}
              {(() => {
                const pInfo = PLATFORM_LABELS[selectedNotif.platformId || 'all'] || PLATFORM_LABELS.all;
                const Icon = selectedNotif.type === 'success' ? FiCheckCircle : selectedNotif.type === 'warning' ? FiAlertCircle : FiInfo;
                const iconColor = selectedNotif.type === 'success' ? '#10B981' : selectedNotif.type === 'warning' ? '#F59E0B' : '#3B82F6';

                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{
                        backgroundColor: pInfo.bg,
                        color: pInfo.color,
                        fontSize: '0.725rem',
                        fontWeight: '800',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '99px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        <FiLayers style={{ fontSize: '0.8rem' }} />
                        <span>{pInfo.name}</span>
                      </span>

                      <span style={{
                        backgroundColor: `${iconColor}18`,
                        color: iconColor,
                        fontSize: '0.725rem',
                        fontWeight: '800',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '99px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}>
                        <Icon />
                        <span style={{ textTransform: 'capitalize' }}>{selectedNotif.type}</span>
                      </span>
                    </div>

                    <h2 style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: isDarkMode ? '#F8FAFC' : '#0F172A',
                      margin: '0 0 1rem 0',
                      lineHeight: 1.35
                    }}>
                      {selectedNotif.title}
                    </h2>

                    {/* Detailed Message Box */}
                    <div style={{
                      backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                      border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                      borderRadius: '14px',
                      padding: '1.25rem',
                      marginBottom: '1.25rem'
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: isDarkMode ? '#94A3B8' : '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Isi & Pembahasan Lengkap:
                      </div>
                      <p style={{
                        fontSize: '0.925rem',
                        lineHeight: 1.65,
                        color: isDarkMode ? '#E2E8F0' : '#334155',
                        margin: 0,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {selectedNotif.message}
                      </p>
                    </div>

                    {/* Timestamp Details */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.78rem',
                      color: isDarkMode ? '#94A3B8' : '#64748B'
                    }}>
                      <FiClock />
                      <span>Diterbitkan: <strong>{formatFullDateTime(selectedNotif.timestamp)}</strong></span>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Modal Footer Actions */}
            <div style={{
              padding: '1rem 1.75rem',
              borderTop: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              {selectedNotif.link && (
                <button
                  type="button"
                  onClick={() => {
                    const link = selectedNotif.link;
                    setSelectedNotif(null);
                    navigate(link);
                  }}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)'
                  }}
                >
                  <span>Buka Modul / Halaman Target</span>
                  <FiExternalLink />
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: isDarkMode ? '#334155' : '#E2E8F0',
                  color: isDarkMode ? '#F8FAFC' : '#0F172A',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
