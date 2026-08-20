export default {
  id: 'platform4',
  name: 'Desktopalie Delta (Enterprise ERP)',
  shortName: 'Delta',
  description: 'Platform 4 - Client Enterprise Workspace (ERP & Security Audit)',
  logoText: 'Desktopalie Delta',
  theme: {
    colorPrimary: '#d97706', // Amber / Orange
    colorSecondary: '#f59e0b',
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
      projectsCount: 6,
      experimentsCount: 2,
      notesCount: 19,
      bookmarksCount: 14,
      todosCount: 25,
      docsCount: 15
    },
    recentProjects: [
      { id: 'p4-1', title: 'Delta Enterprise ERP & Resource Planning', type: 'Enterprise Software', status: 'In progress', progress: 68, tone: 'amber' },
      { id: 'p4-2', title: 'Client Multi-Org Access Control (RBAC)', type: 'Security & IAM', status: 'In progress', progress: 95, tone: 'orange' },
      { id: 'p4-3', title: 'Financial Audit & Compliance Reporting', type: 'Finance Module', status: 'Completed', progress: 100, tone: 'emerald' },
      { id: 'p4-4', title: 'Payroll & Tax Automation Engine', type: 'Enterprise Software', status: 'In progress', progress: 30, tone: 'amber' },
    ],
    recentTodos: [
      { id: 't4-1', title: 'Penyelarasan ISO 27001 Compliance Audit Data', status: 'In progress', priority: 'High', category: 'Compliance' },
      { id: 't4-2', title: 'Migrasi Database Legacy Enterprise ke PostgreSQL', status: 'Done', priority: 'High', category: 'Database' },
      { id: 't4-3', title: 'Review Multi-Tenant Row Level Security (RLS)', status: 'Done', priority: 'High', category: 'Security' },
      { id: 't4-4', title: 'Setup Automated Daily Backup Snapshot', status: 'Done', priority: 'Medium', category: 'DevOps' },
      { id: 't4-5', title: 'Laporan Rekonsiliasi Pajak Q3 2026', status: 'In progress', priority: 'Medium', category: 'Finance' },
    ],
    recentDocs: [
      { id: 'd4-1', title: 'Buku Panduan Compliance & ISO 27001 Security', category: 'Compliance', author: 'Audit & Security Team' },
      { id: 'd4-2', title: 'Skema Otorisasi RBAC Enterprise Multi-Tenant', category: 'Security', author: 'Security Lead' },
      { id: 'd4-3', title: 'SOP Handling Disaster Recovery & Data Backup', category: 'DevOps', author: 'SysAdmin' },
    ],
    maintenance: {
      is_active: false,
      notice_title: 'Server Delta Enterprise Normal',
      notice_message: 'Sistem ERP dan Audit Keamanan berjalan dengan tingkat SLA 99.9%.'
    },
    landing: {
      hero_title: 'Enterprise Resource Planning & Security Hub',
      hero_subtitle: 'Pengelolaan data korporat terenkripsi Platform Delta.'
    }
  }
};
