export default {
  id: 'platform1',
  name: 'Desktopalie Backoffice Alpha',
  shortName: 'Alpha',
  description: 'Platform 1 - Primary Workspace',
  logoText: 'Desktopalie Alpha',
  theme: {
    colorPrimary: '#4f46e5', // Indigo
    colorSecondary: '#6366f1',
    bgSidebar: '#ffffff', // Clean light mode sidebar
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
  }
};
