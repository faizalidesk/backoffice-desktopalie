import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { notificationService } from '../services/notificationService';
import { 
  FiBell, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiInfo, 
  FiTrash2,
  FiX,
  FiExternalLink,
  FiClock,
  FiLayers
} from 'react-icons/fi';

function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Baru saja';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  return `${days}h lalu`;
}

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

export default function NotificationBell({ primaryColor }) {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState('all');
  const [notifications, setNotifications] = useState(() => notificationService.getNotifications());
  const [selectedNotif, setSelectedNotif] = useState(null); // State for Detail Popup Modal
  const notifRef = useRef(null);

  useEffect(() => {
    notificationService.syncFromSupabase();
    const unsubscribe = notificationService.subscribe(() => {
      setNotifications(notificationService.getNotifications());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifs = notifFilter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const activeColor = primaryColor || 'var(--primary, #3B82F6)';

  const handleNotifClick = (notif) => {
    notificationService.markAsRead(notif.id);
    setSelectedNotif(notif);
    setNotifOpen(false);
  };

  return (
    <div style={{ position: 'relative' }} ref={notifRef}>
      {/* BELL TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setNotifOpen(prev => !prev)}
        title={t('notifications') || 'Notifikasi'}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          color: isDarkMode ? '#F8FAFC' : '#0F172A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          transition: 'all 0.15s ease'
        }}
      >
        <FiBell style={{ fontSize: '1.05rem', color: unreadCount > 0 ? activeColor : (isDarkMode ? '#94A3B8' : '#64748B') }} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: '0.675rem',
            fontWeight: '800',
            height: '17px',
            minWidth: '17px',
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
          top: 'calc(100% + 10px)',
          right: 0,
          width: '340px',
          backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          borderRadius: '16px',
          boxShadow: isDarkMode ? '0 20px 40px rgba(0,0,0,0.5)' : '0 15px 35px rgba(15, 23, 42, 0.12)',
          overflow: 'hidden',
          zIndex: 9999,
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
              <span style={{ fontWeight: '700', fontSize: '0.9rem', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                {t('notifications') || 'Notifikasi'}
              </span>
              {unreadCount > 0 && (
                <span style={{
                  backgroundColor: `${activeColor}20`,
                  color: activeColor,
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '99px'
                }}>
                  {unreadCount} {t('unread') || 'Belum Dibaca'}
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
                  color: activeColor,
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '6px'
                }}
              >
                {t('markAllAsRead') || 'Tandai Dibaca'}
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
                fontSize: '0.725rem',
                fontWeight: '700',
                border: 'none',
                backgroundColor: notifFilter === 'all' ? activeColor : 'transparent',
                color: notifFilter === 'all' ? '#FFFFFF' : (isDarkMode ? '#94A3B8' : '#64748B'),
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {t('all') || 'Semua'} ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setNotifFilter('unread')}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '99px',
                fontSize: '0.725rem',
                fontWeight: '700',
                border: 'none',
                backgroundColor: notifFilter === 'unread' ? activeColor : 'transparent',
                color: notifFilter === 'unread' ? '#FFFFFF' : (isDarkMode ? '#94A3B8' : '#64748B'),
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {t('unread') || 'Belum Dibaca'} ({unreadCount})
            </button>
          </div>

          {/* Notification Items List */}
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {filteredNotifs.length === 0 ? (
              <div style={{
                padding: '2.5rem 1rem',
                textAlign: 'center',
                color: isDarkMode ? '#94A3B8' : '#64748B',
                fontSize: '0.85rem'
              }}>
                <FiBell style={{ fontSize: '1.75rem', marginBottom: '0.5rem', opacity: 0.5 }} />
                <p style={{ margin: 0 }}>{t('noNotifications') || 'Tidak ada notifikasi'}</p>
              </div>
            ) : (
              filteredNotifs.map((item) => {
                const isUnread = !item.read;
                const Icon = item.type === 'success' ? FiCheckCircle : item.type === 'warning' ? FiAlertCircle : FiInfo;
                const iconColor = item.type === 'success' ? '#10B981' : item.type === 'warning' ? '#F59E0B' : '#3B82F6';
                const pInfo = PLATFORM_LABELS[item.platformId || 'all'] || PLATFORM_LABELS.all;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotifClick(item)}
                    style={{
                      padding: '0.8rem 1rem',
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
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: `${iconColor}15`,
                      color: iconColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Icon style={{ fontSize: '0.9rem' }} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <h4 style={{
                          fontSize: '0.825rem',
                          fontWeight: isUnread ? '800' : '600',
                          color: isDarkMode ? '#F8FAFC' : '#0F172A',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.title}
                        </h4>
                        <span style={{ fontSize: '0.675rem', color: isDarkMode ? '#94A3B8' : '#64748B', flexShrink: 0, marginLeft: '0.5rem' }}>
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: isDarkMode ? '#94A3B8' : '#64748B',
                        margin: '0 0 0.35rem 0',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.message}
                      </p>

                      <span style={{
                        fontSize: '0.625rem',
                        fontWeight: '700',
                        color: pInfo.bg,
                        textTransform: 'uppercase'
                      }}>
                        ● {pInfo.name}
                      </span>
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
                        color: isDarkMode ? '#64748B' : '#94A3B8',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0.7
                      }}
                    >
                      <FiTrash2 style={{ fontSize: '0.8rem' }} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Panel Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: '0.55rem 1rem',
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
                  fontSize: '0.725rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {t('clearAll') || 'Hapus Semua'}
              </button>
            </div>
          )}
        </div>
      )}

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
                <FiBell style={{ color: activeColor, fontSize: '1.2rem' }} />
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
                      <span>Diterbitkan: <strong>{formatFullDateTime(selectedNotif.timestamp)}</strong> ({formatTimeAgo(selectedNotif.timestamp)})</span>
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
                    backgroundColor: activeColor,
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: `0 4px 12px ${activeColor}40`
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
    </div>
  );
}
