import { supabase } from '../lib/supabase';
import { backofficeService } from './backofficeService';

const STORAGE_KEY = 'desktopalie_notifications';
const EVENT_NAME = 'desktopalie_notifications_updated';

const getCurrentPlatformId = () => {
  try {
    // Detect domain URL first for standalone sub-platforms
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname.toLowerCase();
      if (hostname.includes('beta.')) return 'platform2';
      if (hostname.includes('gamma.')) return 'platform3';
      if (hostname.includes('delta.')) return 'platform4';
    }

    return localStorage.getItem('desktopalie_flavor') || import.meta.env.VITE_FLAVOR || 'platform1';
  } catch (e) {
    return 'platform1';
  }
};

function notifySubscribers() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

// SUPABASE DATABASE SYNC & PERSISTENCE HELPER
async function syncFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'platform_notifications')
      .maybeSingle();

    if (!error && data && data.value) {
      let parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      if (Array.isArray(parsed)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        notifySubscribers();
      }
    }
  } catch (err) {
    console.warn('Failed to sync notifications from Supabase:', err);
  }
}

async function saveToSupabase(updatedList) {
  try {
    await backofficeService.saveSiteSetting('platform_notifications', JSON.stringify(updatedList));
  } catch (err) {
    console.warn('Failed to save notifications to Supabase:', err);
  }
}

// SETUP SUPABASE REALTIME & POLLING SYNC ACROSS SUBDOMAINS
if (typeof window !== 'undefined') {
  // 1. Initial fetch from Supabase
  syncFromSupabase();

  // 2. Poll Supabase every 8 seconds for cross-subdomain synchronization
  setInterval(syncFromSupabase, 8000);

  // 3. Supabase Realtime Subscription Channel
  try {
    supabase
      .channel('public:site_settings_notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'site_settings'
      }, (payload) => {
        if (payload?.new?.key === 'platform_notifications') {
          syncFromSupabase();
        }
      })
      .subscribe();
  } catch (e) {
    console.warn('Supabase realtime channel subscription failed:', e);
  }
}

export const notificationService = {
  getCurrentPlatformId,
  syncFromSupabase,

  getNotifications(targetPlatformId) {
    const activePlatform = targetPlatformId || getCurrentPlatformId();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let list = stored ? JSON.parse(stored) : [];
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
      if (!stored) return [];
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
    saveToSupabase(updated);
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
    saveToSupabase(updated);
    return this.getNotifications();
  },

  deleteNotification(id) {
    const rawList = this.getAllRawNotifications();
    const updated = rawList.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers();
    saveToSupabase(updated);
    return this.getNotifications();
  },

  clearAllNotifications(targetPlatformId) {
    const activePlatform = targetPlatformId || getCurrentPlatformId();
    const rawList = this.getAllRawNotifications();
    const updated = rawList.filter(n => n.platformId && n.platformId !== 'all' && n.platformId !== activePlatform);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifySubscribers();
    saveToSupabase(updated);
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
    saveToSupabase(updated);
    return this.getNotifications();
  },

  subscribe(callback) {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener(EVENT_NAME, callback);
    window.addEventListener('storage', callback);
    return () => {
      window.removeEventListener(EVENT_NAME, callback);
      window.removeEventListener('storage', callback);
    };
  }
};
