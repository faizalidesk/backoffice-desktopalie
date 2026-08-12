export default {
  id: 'platform1',
  name: 'Desktopalie Main Core',
  shortName: 'Desktopalie',
  description: 'Primary Independent Backoffice Workspace (https://desktopalie.my.id/)',
  logoText: 'Desktopalie',
  theme: {
    colorPrimary: '#4f46e5', // Indigo
    colorSecondary: '#6366f1',
    bgSidebar: '#ffffff',
    accent: '#818cf8',
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
    url: import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_PLATFORM1_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_PLATFORM1_SUPABASE_KEY,
  },
  dummyData: {
    stats: {
      projectsCount: 14,
      experimentsCount: 8,
      notesCount: 24,
      bookmarksCount: 45,
      todosCount: 18,
      docsCount: 12
    },
    recentProjects: [
      { id: 'p1-1', title: 'Alpha Design System v3', type: 'Design System', status: 'In progress', progress: 90, tone: 'violet' },
      { id: 'p1-2', title: 'E-Commerce Multi-Vendor App', type: 'Web application', status: 'In progress', progress: 75, tone: 'indigo' },
      { id: 'p1-3', title: 'Alpha AI Content Generator', type: 'AI Tool', status: 'Completed', progress: 100, tone: 'teal' },
      { id: 'p1-4', title: 'SaaS Analytics Dashboard', type: 'Web application', status: 'In progress', progress: 60, tone: 'rose' },
    ],
    recentTodos: [
      { id: 't1-1', title: 'Audit Aksesibilitas WCAG 2.1 pada Modul Checkout', status: 'In progress', priority: 'High', category: 'QA' },
      { id: 't1-2', title: 'Setup Continuous Integration via GitHub Actions', status: 'Done', priority: 'Medium', category: 'DevOps' },
      { id: 't1-3', title: 'Refactor State Management Auth Provider', status: 'Done', priority: 'High', category: 'Refactor' },
      { id: 't1-4', title: 'Optimasi Asset Bundle Size pada Vite 6', status: 'Not started', priority: 'Medium', category: 'Performance' },
      { id: 't1-5', title: 'Update Dokumen API Swagger v3.1', status: 'In progress', priority: 'Low', category: 'Docs' },
    ],
    recentDocs: [
      { id: 'd1-1', title: 'Panduan Arsitektur Micro-Frontend Alpha', category: 'Architecture', author: 'Faizal Lead' },
      { id: 'd1-2', title: 'Standard Operating Procedure (SOP) Deployment', category: 'DevOps', author: 'DevOps Team' },
      { id: 'd1-3', title: 'Prinsip Desain Core UI Tokens', category: 'UI/UX', author: 'Design Team' },
    ],
    maintenance: {
      is_active: false,
      notice_title: 'Sistem Alpha Berjalan Normal',
      notice_message: 'Seluruh layanan Alpha terhubung dan berfungsi secara optimal.'
    },
    landing: {
      hero_title: 'Building Modern Web Experience with Platform Alpha',
      hero_subtitle: 'Portofolio publik dan sistem desain utama terintegrasi.'
    }
  }
};
