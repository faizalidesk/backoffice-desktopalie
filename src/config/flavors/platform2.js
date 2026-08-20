export default {
  id: 'platform2',
  name: 'Desktopalie Beta (Smart Logistics)',
  shortName: 'Beta',
  description: 'Platform 2 - Secondary Operations Workspace (Logistics & Fleet)',
  logoText: 'Desktopalie Beta',
  theme: {
    colorPrimary: '#059669', // Emerald Green
    colorSecondary: '#10b981',
    bgSidebar: '#0F3574',
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
      projectsCount: 19,
      experimentsCount: 5,
      notesCount: 31,
      bookmarksCount: 28,
      todosCount: 14,
      docsCount: 9
    },
    recentProjects: [
      { id: 'p2-1', title: 'Route Optimization Engine v2', type: 'Logistics Algo', status: 'In progress', progress: 85, tone: 'emerald' },
      { id: 'p2-2', title: 'Fleet GPS Realtime Telemetry', type: 'IoT & Telemetry', status: 'Completed', progress: 100, tone: 'teal' },
      { id: 'p2-3', title: 'Warehouse Automated Dispatch', type: 'Automation', status: 'In progress', progress: 45, tone: 'indigo' },
      { id: 'p2-4', title: 'Cold-Chain Temperature Monitor', type: 'Sensors IoT', status: 'In progress', progress: 70, tone: 'blue' },
    ],
    recentTodos: [
      { id: 't2-1', title: 'Kalibrasi Sensor Suhu Armada Truk Pendingin #12', status: 'In progress', priority: 'High', category: 'Hardware' },
      { id: 't2-2', title: 'Integrasi API Google Maps Distance Matrix', status: 'Done', priority: 'High', category: 'Backend' },
      { id: 't2-3', title: 'Pengujian Stress Test 1.000 Kendaraan Bersamaan', status: 'Done', priority: 'Medium', category: 'Testing' },
      { id: 't2-4', title: 'Penyusunan Jadwal Maintenance Rutin Q3', status: 'Not started', priority: 'Low', category: 'Ops' },
    ],
    recentDocs: [
      { id: 'd2-1', title: 'Protokol Darurat Kegagalan Sinyal GPS', category: 'Security', author: 'Fleet Security' },
      { id: 'd2-2', title: 'Panduan Instalasi OBD-II Tracker pada Unit', category: 'Hardware', author: 'Technician Team' },
    ],
    maintenance: {
      is_active: false,
      notice_title: 'Operasional Logistik Beta Lancar',
      notice_message: 'Pelacakan armada dan pembaruan rute berfungsi normal.'
    },
    landing: {
      hero_title: 'Next-Generation Logistics & Fleet Management',
      hero_subtitle: 'Platform operasional cerdas untuk optimasi rute, pemantauan armada real-time, dan otomasi pergudangan.'
    }
  }
};
