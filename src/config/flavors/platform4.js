export default {
  id: 'platform4',
  name: 'Desktopalie Delta (Enterprise ERP)',
  shortName: 'Delta',
  description: 'Platform 4 - Client Enterprise Workspace (ERP & Security Audit)',
  logoText: 'Desktopalie Delta',
  theme: {
    colorPrimary: '#d97706', // Amber / Orange
    colorSecondary: '#f59e0b',
    bgSidebar: '#0F3574',
    accent: '#fbbf24',
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
    url: import.meta.env.VITE_PLATFORM4_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_PLATFORM4_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  dummyData: {
    stats: {
      projectsCount: 8,
      experimentsCount: 3,
      notesCount: 42,
      bookmarksCount: 35,
      todosCount: 29,
      docsCount: 20
    },
    recentProjects: [
      { id: 'p4-1', title: 'Ledger Audit ISO 27001 Compliance', type: 'Compliance', status: 'In progress', progress: 88, tone: 'amber' },
      { id: 'p4-2', title: 'Automated Tax Calculation Engine', type: 'FinTech', status: 'Completed', progress: 100, tone: 'emerald' },
      { id: 'p4-3', title: 'Enterprise Role-Based Access Matrix', type: 'Security', status: 'In progress', progress: 65, tone: 'rose' },
      { id: 'p4-4', title: 'ERP Multi-Currency Reconciliation', type: 'Accounting', status: 'In progress', progress: 55, tone: 'orange' },
    ],
    recentTodos: [
      { id: 't4-1', title: 'Finalisasi Laporan Audit Triwulan ISO 27001', status: 'In progress', priority: 'High', category: 'Compliance' },
      { id: 't4-2', title: 'Validasi Enkripsi Database AES-256 pada Field Finansial', status: 'Done', priority: 'High', category: 'Security' },
      { id: 't4-3', title: 'Sinkronisasi Kurs Bank Sentral API Realtime', status: 'Done', priority: 'Medium', category: 'Integration' },
    ],
    recentDocs: [
      { id: 'd4-1', title: 'Matriks Otorisasi Finansial & Persetujuan Bertingkat', category: 'Policy', author: 'CFO Office' },
      { id: 'd4-2', title: 'Buku Panduan Rekonsiliasi Kas dan Bank', category: 'Finance', author: 'Audit Team' },
    ],
    maintenance: {
      is_active: false,
      notice_title: 'Sistem Finansial & Audit Delta Stabil',
      notice_message: 'Seluruh buku besar dan rekonsiliasi transaksi berjalan aman.'
    },
    landing: {
      hero_title: 'Enterprise ERP, Financial Ledger & Security Governance',
      hero_subtitle: 'Solusi terintegrasi untuk pembukuan keuangan tingkat lanjut, audit kepatuhan ISO 27001, dan kontrol akses berbasis peran.'
    }
  }
};
