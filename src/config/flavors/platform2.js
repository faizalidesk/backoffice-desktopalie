export default {
  id: 'platform2',
  name: 'Desktopalie Backoffice Beta',
  shortName: 'Beta',
  description: 'Platform 2 - Secondary Operations Workspace',
  logoText: 'Desktopalie Beta',
  theme: {
    colorPrimary: '#059669', // Emerald Green
    colorSecondary: '#10b981',
    bgSidebar: '#064e3b',
    accent: '#34d399',
  },
  features: {
    enableProjects: true,
    enableExperiments: true,
    enableNotes: true,
    enableBookmarks: true,
    enableTodos: true,
    enableDocumentation: false,
    enableLandingManager: true,
    enableMaintenanceMode: false,
  },
  supabase: {
    url: import.meta.env.VITE_PLATFORM2_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_PLATFORM2_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
};
