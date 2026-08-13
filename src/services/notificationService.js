const STORAGE_KEY = 'desktopalie_notifications';
const EVENT_NAME = 'desktopalie_notifications_updated';

const getCurrentPlatformId = () => {
  try {
    return localStorage.getItem('desktopalie_flavor') || import.meta.env.VITE_FLAVOR || 'platform1';
  } catch (e) {
    return 'platform1';
  }
};

function notifySubscribers() {
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export const notificationService = {
  getCurrentPlatformId,

  getNotifications(targetPlatformId) {
    const activePlatform = targetPlatformId || getCurrentPlatformId();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let list = stored ? JSON.parse(stored) : [];
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      }
      if (activePlatform === 'all_platforms' || activePlatform === 'all_master') {
        return list;
      }
      // Filter notifications matching target platform or global ('all')
      return list.filter(n => !n.platformId || n.platformId === 'all' || n.platformId === activePlatform);
    } catch (e) {
      console.error('Error reading notifications:', e);
      return [];
    }
  },

  getAllRawNotifications() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return [];
      }
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  },

  getUnreadCount(targetPlatformId) {
    const list = this.getNotifications(targetPlatformId);
    return list.filter(n => !n.read).length;
  },

  markAsRead(id) {
    const rawList = this.getAllRawNotifications();
    const updated = rawList.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers();
    return this.getNotifications();
  },

  markAllAsRead(targetPlatformId) {
    const activePlatform = targetPlatformId || getCurrentPlatformId();
    const rawList = this.getAllRawNotifications();
    const updated = rawList.map(n => {
      if (!n.platformId || n.platformId === 'all' || n.platformId === activePlatform) {
        return { ...n, read: true };
      }
      return n;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers();
    return this.getNotifications();
  },

  deleteNotification(id) {
    const rawList = this.getAllRawNotifications();
    const updated = rawList.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers();
    return this.getNotifications();
  },

  clearAllNotifications(targetPlatformId) {
    const activePlatform = targetPlatformId || getCurrentPlatformId();
    const rawList = this.getAllRawNotifications();
    const updated = rawList.filter(n => n.platformId && n.platformId !== 'all' && n.platformId !== activePlatform);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers();
    return [];
  },

  addNotification({ title, message, type = 'info', link = '', platformId }) {
    const activePlatform = platformId || getCurrentPlatformId();
    const rawList = this.getAllRawNotifications();
    const newNotif = {
      id: `notif-${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      platformId: activePlatform,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      link
    };
    const updated = [newNotif, ...rawList];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers();
    return this.getNotifications();
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
