export default {
  id: 'platform4',
  name: 'Desktopalie Backoffice Delta',
  shortName: 'Delta',
  description: 'Platform 4 - Client Enterprise Workspace',
  logoText: 'Desktopalie Delta',
  theme: {
    colorPrimary: '#d97706', // Amber / Orange
    colorSecondary: '#f59e0b',
    bgSidebar: '#451a03',
    accent: '#fbbf24',
  },
  features: {
    enableProjects: true,
    enableExperiments: false,
    enableNotes: true,
    enableBookmarks: false,
    enableTodos: true,
    enableDocumentation: true,
    enableLandingManager: true,
    enableMaintenanceMode: true,
  },
  supabase: {
    url: import.meta.env.VITE_PLATFORM4_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_PLATFORM4_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
};
