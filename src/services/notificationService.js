import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'desktopalie_notifications';
const EVENT_NAME = 'desktopalie_notifications_updated';

const getCurrentPlatformId = () => {
  try {
    return localStorage.getItem('desktopalie_flavor') || import.meta.env.VITE_FLAVOR || 'platform1';
  } catch (e) {
    return 'platform1';
  }
};

// Seed default initial notifications categorized by platform flavor
const INITIAL_NOTIFICATIONS = [
  // Platform 1 (Desktopalie Alpha / Main Backoffice)
  {
    id: 'notif-p1-1',
    platformId: 'platform1',
    title: 'Sistem Terhubung ke Supabase',
    message: 'Koneksi database real-time Supabase berhasil disinkronkan dengan ekosistem platform Alpha.',
    type: 'success',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    link: '/workspaces'
  },
  {
    id: 'notif-p1-2',
    platformId: 'platform1',
    title: 'Pembaruan Modul Sprint QA',
    message: '2 tugas baru telah ditambahkan ke papan To-Do & Board QA.',
    type: 'warning',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    read: false,
    link: '/todos'
  },
  {
    id: 'notif-p1-3',
    platformId: 'platform1',
    title: 'Pemeriksaan Backup Otomatis',
    message: 'Cadangan data sistem berhasil dibuat pada pukul 04:00 WIB.',
    type: 'success',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: '/maintenance'
  },

  // Platform 2 (Platform Beta - Logistics & Fleet Telemetry)
  {
    id: 'notif-p2-1',
    platformId: 'platform2',
    title: 'Telemetri Armada #B-402 Aktif',
    message: 'Truk rute Jakarta - Surabaya melaporkan posisi GPS & status bahan bakar normal.',
    type: 'success',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    read: false,
    link: '/portal'
  },
  {
    id: 'notif-p2-2',
    platformId: 'platform2',
    title: 'Peringatan Kapasitas Gudang Logistics',
    message: 'Gudang Hub 3 Surabaya telah mencapai 88% kapasitas penyimpanan barang.',
    type: 'warning',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    read: false,
    link: '/portal'
  },
  {
    id: 'notif-p2-3',
    platformId: 'platform2',
    title: 'Integrasi Manifest Pengiriman Baru',
    message: '15 manifest armada baru otomatis diproses oleh sistem telemetri Beta.',
    type: 'info',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: '/portal'
  },

  // Platform 3 (Platform Gamma - AI Video Transcoder & Streaming Analytics)
  {
    id: 'notif-p3-1',
    platformId: 'platform3',
    title: 'Transcoding Video 4K HDR Selesai',
    message: 'Berkas media #G-882 berhasil diringkas ke format H.265/HLS 60fps.',
    type: 'success',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    read: false,
    link: '/portal'
  },
  {
    id: 'notif-p3-2',
    platformId: 'platform3',
    title: 'Peak Bandwidth CDN Alert',
    message: 'Lalu lintas streaming langsung mencapai batas puncak 1.4 Gbps.',
    type: 'warning',
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    read: false,
    link: '/portal'
  },
  {
    id: 'notif-p3-3',
    platformId: 'platform3',
    title: 'Pemeriksaan Kesehatan Encoder GPU',
    message: '8 simpul GPU encoder beroperasi pada suhu dan efisiensi energi stabil (52°C).',
    type: 'info',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: '/portal'
  },

  // Platform 4 (Platform Delta - Client Financial ERP & Security Audit Engine)
  {
    id: 'notif-p4-1',
    platformId: 'platform4',
    title: 'Audit Kepatuhan ISO 27001 Terverifikasi',
    message: 'Log enkripsi AES-256 dan kontrol akses pengguna telah lolos verifikasi keamanan Delta.',
    type: 'success',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
    link: '/portal'
  },
  {
    id: 'notif-p4-2',
    platformId: 'platform4',
    title: 'Peringatan Stok Persediaan ERP',
    message: '12 SKU produk ERP mendekati batas minimum persediaan aman (Safety Stock).',
    type: 'warning',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
    link: '/portal'
  },
  {
    id: 'notif-p4-3',
    platformId: 'platform4',
    title: 'Rekonsiliasi Jurnal Keuangan Q3',
    message: 'Buku besar akuntansi terpusat berhasil direkonsiliasi tanpa selisih transaksi.',
    type: 'info',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: '/portal'
  }
];

// REAL-TIME SIMULATION GENERATOR POOLS
const LIVE_SIMULATION_POOLS = {
  platform1: [
    { title: 'Koneksi Supabase Real-Time Synced', message: 'Stream data workspace Alpha diperbarui secara otomatis.', type: 'success', link: '/workspaces' },
    { title: 'Audit Kinerja Kode Main Workspace', message: 'Pemeriksaan build dan modul telah diverifikasi 100%.', type: 'info', link: '/documentation' },
    { title: 'Tugas Sprint QA Baru Diterbitkan', message: 'Item tugas baru telah masuk ke papan pengujian To-Do.', type: 'warning', link: '/todos' }
  ],
  platform2: [
    { title: 'Telemetri GPS Truk #TRK-109 Terverifikasi', message: 'Armada logistik telah sampai di Checkpoint Hub Surabaya.', type: 'success', link: '/portal' },
    { title: 'Peringatan Sensor Suhu Kontainer #C-88', message: 'Suhu ruangan pendingin stabil pada titik 4°C.', type: 'info', link: '/portal' },
    { title: 'Pembaruan Manifest Logistik Beta', message: 'Data pengiriman kargo terbaru telah diperbarui di dashboard.', type: 'warning', link: '/portal' }
  ],
  platform3: [
    { title: 'Render Video H.265 Stream #G-104 Selesai', message: 'Video berdurasi 45 menit berhasil dikompresi tanpa penurunan kualitas.', type: 'success', link: '/portal' },
    { title: 'Analitik CDN Edge Cache Hit Ratio 98.4%', message: 'Kecepatan pengiriman konten media streaming berjalan optimal.', type: 'info', link: '/portal' },
    { title: 'Peringatan Latensi Node Live Stream', message: 'Latensi server wilayah Asia Tenggara tercatat di bawah 120ms.', type: 'warning', link: '/portal' }
  ],
  platform4: [
    { title: 'Pembaruan Audit Keamanan ISO 27001', message: 'Pemeriksaan akses autentikasi pengguna berhasil diloloskan.', type: 'success', link: '/portal' },
    { title: 'Rekonsiliasi Faktur Keuangan ERP Selesai', message: 'Faktur pajak dan jurnal pengeluaran otomatis disinkronkan.', type: 'info', link: '/portal' },
    { title: 'Peringatan Stok Gudang Persediaan', message: 'Item inventaris #SKU-991 membutuhkan pemesanan ulang.', type: 'warning', link: '/portal' }
  ]
};

function notifySubscribers() {
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

let liveGeneratorInterval = null;

export const notificationService = {
  getCurrentPlatformId,

  getNotifications(targetPlatformId) {
    const activePlatform = targetPlatformId || getCurrentPlatformId();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let list = stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
      if (activePlatform === 'all_platforms' || activePlatform === 'all_master') {
        return list;
      }
      // Filter notifications matching target platform or global ('all')
      return list.filter(n => !n.platformId || n.platformId === 'all' || n.platformId === activePlatform);
    } catch (e) {
      console.error('Error reading notifications:', e);
      return INITIAL_NOTIFICATIONS;
    }
  },

  getAllRawNotifications() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(stored);
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
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

  resetToDefault() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    notifySubscribers();
    return this.getNotifications();
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

  // START ACTIVE REAL-TIME BACKGROUND SIMULATION RUNNER
  startLivePlatformGenerator() {
    if (liveGeneratorInterval) return;

    // Trigger periodic background notification every 35 seconds
    liveGeneratorInterval = setInterval(() => {
      const activePlatform = getCurrentPlatformId();
      const pool = LIVE_SIMULATION_POOLS[activePlatform] || LIVE_SIMULATION_POOLS.platform1;
      const sample = pool[Math.floor(Math.random() * pool.length)];

      if (sample) {
        this.addNotification({
          title: sample.title,
          message: sample.message,
          type: sample.type,
          link: sample.link,
          platformId: activePlatform
        });

        // Show subtle floating toast notification alert
        try {
          toast(sample.title, {
            icon: sample.type === 'success' ? '✅' : sample.type === 'warning' ? '⚠️' : 'ℹ️',
            style: {
              fontSize: '0.825rem',
              fontWeight: '700',
              borderRadius: '99px'
            }
          });
        } catch (e) {}
      }
    }, 35000);
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

// Auto-initialize real-time live notification generator
notificationService.startLivePlatformGenerator();
