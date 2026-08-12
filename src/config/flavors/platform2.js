export default {
  id: 'platform2',
  name: 'Desktopalie Beta (Smart Logistics)',
  shortName: 'Beta',
  description: 'Platform 2 - Secondary Operations Workspace (Logistics & Fleet)',
  logoText: 'Desktopalie Beta',
  theme: {
    colorPrimary: '#059669', // Emerald Green
    colorSecondary: '#10b981',
    bgSidebar: '#ffffff',
    accent: '#34d399',
  },
  features: {
    enableProjects: true,
    enableExperiments: true,
    enableNotes: true,
    enableBookmarks: true,
    enableTodos: true,
    enableDocumentation: true,
    enableLandingManager: true,
    enableMaintenanceMode: true,
  },
  supabase: {
    url: import.meta.env.VITE_PLATFORM2_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_PLATFORM2_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  dummyData: {
    stats: {
      projectsCount: 9,
      experimentsCount: 15,
      notesCount: 11,
      bookmarksCount: 28,
      todosCount: 10,
      docsCount: 4
    },
    recentProjects: [
      { id: 'p2-1', title: 'Beta Logistics & Fleet Manager', type: 'Logistics Portal', status: 'In progress', progress: 85, tone: 'emerald' },
      { id: 'p2-2', title: 'Real-time GPS Tracking Engine', type: 'IoT & Telemetry', status: 'Completed', progress: 100, tone: 'teal' },
      { id: 'p2-3', title: 'Warehouse Inventory Mobile App', type: 'Mobile application', status: 'In progress', progress: 40, tone: 'amber' },
      { id: 'p2-4', title: 'Beta Automated Dispatcher API', type: 'Microservice', status: 'In progress', progress: 95, tone: 'emerald' },
    ],
    recentTodos: [
      { id: 't2-1', title: 'Testing Websocket Telemetry Latency under 100ms', status: 'Done', priority: 'High', category: 'Performance' },
      { id: 't2-2', title: 'Integrasi Payment Gateway QRIS & E-Wallet', status: 'In progress', priority: 'High', category: 'Payment' },
      { id: 't2-3', title: 'Optimasi Memory Leak pada Driver Tracker', status: 'In progress', priority: 'Medium', category: 'Bugfix' },
      { id: 't2-4', title: 'Konfigurasi Geofencing Notification Trigger', status: 'Not started', priority: 'Medium', category: 'Feature' },
      { id: 't2-5', title: 'Review Security Scan Snyk & Dependency Check', status: 'Done', priority: 'Low', category: 'Security' },
    ],
    recentDocs: [
      { id: 'd2-1', title: 'Arsitektur Ingest Telemetry High-Throughput', category: 'IoT', author: 'Beta Backend Team' },
      { id: 'd2-2', title: 'Panduan Integrasi Fleet API untuk Partner', category: 'API Docs', author: 'Tech Lead' },
    ],
    maintenance: {
      is_active: false,
      notice_title: 'Operasi Logistik Beta Lancar',
      notice_message: 'Seluruh server penjejak armada beroperasi tanpa kendala.'
    },
    landing: {
      hero_title: 'Smart Logistics & Fleet Telemetry System',
      hero_subtitle: 'Solusi manajemen armada dan rantai pasok cerdas Platform Beta.'
    }
  }
};
