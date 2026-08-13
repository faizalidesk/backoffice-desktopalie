const STORAGE_KEY = 'desktopalie_notifications';
const EVENT_NAME = 'desktopalie_notifications_updated';

// Seed default initial notifications if empty
const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Sistem Terhubung ke Supabase',
    message: 'Koneksi database real-time Supabase berhasil disinkronkan dengan ekosistem platform.',
    type: 'success',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    link: '/workspaces'
  },
  {
    id: 'notif-2',
    title: 'Audit Keamanan ISO 27001 Selesai',
    message: 'Semua modul keamanan dan audit log dinyatakan sesuai dengan standar kepatuhan.',
    type: 'info',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    link: '/documentation'
  },
  {
    id: 'notif-3',
    title: 'Pembaruan Modul Sprint QA',
    message: '2 tugas baru telah ditambahkan ke papan To-Do & Board QA.',
    type: 'warning',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: '/todos'
  },
  {
    id: 'notif-4',
    title: 'Pemeriksaan Backup Otomatis',
    message: 'Cadangan data sistem berhasil dibuat pada pukul 04:00 WIB.',
    type: 'success',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: '/maintenance'
  }
];

function notifySubscribers() {
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export const notificationService = {
  getNotifications() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading notifications:', e);
      return INITIAL_NOTIFICATIONS;
    }
  },

  getUnreadCount() {
    const list = this.getNotifications();
    return list.filter(n => !n.read).length;
  },

  markAsRead(id) {
    const list = this.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers();
    return updated;
  },

  markAllAsRead() {
    const list = this.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers();
    return updated;
  },

  deleteNotification(id) {
    const list = this.getNotifications();
    const updated = list.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers();
    return updated;
  },

  clearAllNotifications() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    notifySubscribers();
    return [];
  },

  resetToDefault() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    notifySubscribers();
    return INITIAL_NOTIFICATIONS;
  },

  addNotification({ title, message, type = 'info', link = '' }) {
    const list = this.getNotifications();
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      link
    };
    const updated = [newNotif, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers();
    return updated;
  },

  subscribe(callback) {
    window.addEventListener(EVENT_NAME, callback);
    window.addEventListener('storage', callback);
    return () => {
      window.removeEventListener(EVENT_NAME, callback);
      window.removeEventListener('storage', callback);
    };
  }
};
