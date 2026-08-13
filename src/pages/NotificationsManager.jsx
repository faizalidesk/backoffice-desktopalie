import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { useFlavor } from '../context/FlavorContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-hot-toast';
import { 
  FiBell, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiInfo, 
  FiTrash2, 
  FiPlus, 
  FiCheck, 
  FiFilter,
  FiSearch,
  FiRotateCcw,
  FiExternalLink
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

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

export default function NotificationsManager() {
  const { activeFlavor, flavorId } = useFlavor();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(() => notificationService.getNotifications(flavorId));
  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'info' | 'warning' | 'success'
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State for New Notification
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState('info');
  const [newLink, setNewLink] = useState('/workspaces');

  useEffect(() => {
    setNotifications(notificationService.getNotifications(flavorId));
    const unsubscribe = notificationService.subscribe(() => {
      setNotifications(notificationService.getNotifications(flavorId));
    });
    return unsubscribe;
  }, [flavorId]);

  const handleMarkAsRead = (id) => {
    notificationService.markAsRead(id);
    toast.success('Notifikasi ditandai sudah dibaca');
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
    toast.success('Semua notifikasi ditandai sudah dibaca');
  };

  const handleDelete = (id) => {
    notificationService.deleteNotification(id);
    toast.success('Notifikasi dihapus');
  };

  const handleClearAll = () => {
    notificationService.clearAllNotifications();
    toast.success('Daftar notifikasi dibersihkan');
  };

  const handleResetStatic = () => {
    notificationService.resetToDefault();
    toast.success('Notifikasi static dimuat ulang');
  };

  const handleCreateNotification = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) {
      toast.error('Judul dan pesan notifikasi wajib diisi!');
      return;
    }

    notificationService.addNotification({
      title: `${newTitle} [${activeFlavor?.shortName || 'Platform'}]`,
      message: newMessage,
      type: newType,
      link: newLink,
      platformId: flavorId
    });

    toast.success('Notifikasi baru berhasil diterbitkan!');
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewMessage('');
  };

  // Filtering
  const filteredList = notifications.filter(item => {
    if (filterType === 'unread' && item.read) return false;
    if (filterType === 'info' && item.type !== 'info') return false;
    if (filterType === 'warning' && item.type !== 'warning') return false;
    if (filterType === 'success' && item.type !== 'success') return false;
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.message.toLowerCase().includes(q);
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const successCount = notifications.filter(n => n.type === 'success').length;
  const warningCount = notifications.filter(n => n.type === 'warning').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Header title={`Notifikasi Platform - ${activeFlavor?.name || 'Desktopalie'}`} />

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* PAGE HEADER HERO CARD */}
        <div className="card" style={{
          padding: '1.75rem 2rem',
          borderRadius: '16px',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <span style={{
                padding: '0.2rem 0.65rem',
                borderRadius: '99px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                fontWeight: '800',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Platform Notifikasi
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ● {activeFlavor?.name}
              </span>
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 0.4rem 0' }}>
              Pusat Notifikasi & Log Platform
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '650px' }}>
              Pantau seluruh pesan sistem, peringatan audit keamanan ISO 27001, serta pembaruan aktivitas untuk workspace platform aktif Anda.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetStatic}
              title="Reset ke Notifikasi Static Bawaan"
            >
              <FiRotateCcw />
              <span>Muat Notifikasi Static</span>
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleMarkAllAsRead}
              >
                <FiCheck />
                <span>Tandai Semua Dibaca</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <FiPlus />
              <span>Buat Notifikasi</span>
            </button>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '1.25rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              <FiBell />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
                {notifications.length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Total Notifikasi
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              <FiAlertCircle />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
                {unreadCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Belum Dibaca
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              <FiCheckCircle />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
                {successCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Status Sukses
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              <FiInfo />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.1 }}>
                {warningCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Peringatan System
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH & TABS */}
        <div className="card" style={{
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `Semua (${notifications.length})` },
              { id: 'unread', label: `Belum Dibaca (${unreadCount})` },
              { id: 'info', label: 'Info' },
              { id: 'warning', label: 'Warning' },
              { id: 'success', label: 'Success' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '99px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  border: 'none',
                  backgroundColor: filterType === tab.id ? 'var(--primary)' : (isDarkMode ? '#334155' : '#F1F5F9'),
                  color: filterType === tab.id ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box & Clear All */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FiSearch style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari notifikasi..."
                style={{
                  padding: '0.4rem 0.75rem 0.4rem 2.2rem',
                  borderRadius: '99px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                  color: 'var(--text-main)',
                  fontSize: '0.825rem',
                  outline: 'none',
                  width: '200px'
                }}
              />
            </div>

            {notifications.length > 0 && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={handleClearAll}
                title="Hapus Seluruh Notifikasi"
              >
                <FiTrash2 />
                <span>Bersihkan</span>
              </button>
            )}
          </div>
        </div>

        {/* NOTIFICATIONS LIST CONTAINER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredList.length === 0 ? (
            <div className="card" style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              borderRadius: '16px',
              color: 'var(--text-muted)'
            }}>
              <FiBell style={{ fontSize: '2.5rem', opacity: 0.4, marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>
                Tidak Ada Notifikasi Ditemukan
              </h3>
              <p style={{ fontSize: '0.875rem', margin: '0 0 1.25rem 0' }}>
                {searchQuery ? `Tidak ada pesan notifikasi yang cocok dengan "${searchQuery}".` : 'Daftar notifikasi platform ini sedang kosong.'}
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleResetStatic}
              >
                Muat Notifikasi Static Bawaan
              </button>
            </div>
          ) : (
            filteredList.map((item) => {
              const isUnread = !item.read;
              const Icon = item.type === 'success' ? FiCheckCircle : item.type === 'warning' ? FiAlertCircle : FiInfo;
              const iconColor = item.type === 'success' ? '#10B981' : item.type === 'warning' ? '#F59E0B' : '#3B82F6';

              return (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.1rem',
                    backgroundColor: isUnread 
                      ? (isDarkMode ? 'rgba(59, 130, 246, 0.08)' : 'rgba(239, 246, 255, 0.85)')
                      : (isDarkMode ? '#1E293B' : '#FFFFFF'),
                    borderLeft: `4px solid ${iconColor}`,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Category Icon */}
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: `${iconColor}18`,
                    color: iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.15rem',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Icon />
                  </div>

                  {/* Details Body */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <h3 style={{
                          fontSize: '0.975rem',
                          fontWeight: isUnread ? '800' : '700',
                          color: 'var(--text-main)',
                          margin: 0
                        }}>
                          {item.title}
                        </h3>

                        {isUnread && (
                          <span style={{
                            backgroundColor: 'var(--primary)',
                            color: '#FFFFFF',
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '99px',
                            textTransform: 'uppercase'
                          }}>
                            Baru
                          </span>
                        )}
                      </div>

                      <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </div>

                    <p style={{
                      fontSize: '0.875rem',
                      color: isDarkMode ? '#CBD5E1' : '#475569',
                      margin: '0 0 0.85rem 0',
                      lineHeight: 1.5
                    }}>
                      {item.message}
                    </p>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {item.link && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            handleMarkAsRead(item.id);
                            navigate(item.link);
                          }}
                          style={{ padding: '0.25rem 0.65rem', fontSize: '0.775rem' }}
                        >
                          <span>Buka Modul</span>
                          <FiExternalLink style={{ fontSize: '0.75rem' }} />
                        </button>
                      )}

                      {isUnread ? (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            fontSize: '0.775rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          Tandai Dibaca
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ✓ Sudah dibaca
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          fontSize: '0.775rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          marginLeft: 'auto',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <FiTrash2 />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>

      {/* MODAL BUAT NOTIFIKASI BARU */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Terbitkan Notifikasi Baru"
      >
        <form onSubmit={handleCreateNotification} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Judul Notifikasi
            </label>
            <input
              type="text"
              className="form-control"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Misal: Pembaruan Modul Backoffice"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
              Pesan / Deskripsi Notifikasi
            </label>
            <textarea
              className="form-control"
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tuliskan rincian pesan notifikasi di sini..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Tipe Notifikasi
              </label>
              <select
                className="form-control"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
              >
                <option value="info">Info (Biru)</option>
                <option value="warning">Peringatan (Kuning)</option>
                <option value="success">Sukses (Hijau)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                Tautan Modul (Link)
              </label>
              <select
                className="form-control"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
              >
                <option value="/workspaces">Workspaces</option>
                <option value="/projects">Projects</option>
                <option value="/todos">To-Do & Board QA</option>
                <option value="/documentation">Dokumentasi</option>
                <option value="/maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Terbitkan Notifikasi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
