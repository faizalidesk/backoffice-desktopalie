export default {
  id: 'platform3',
  name: 'Desktopalie Backoffice Gamma',
  shortName: 'Gamma',
  description: 'Platform 3 - Analytics & Media Hub Workspace',
  logoText: 'Desktopalie Gamma',
  theme: {
    colorPrimary: '#7c3aed', // Purple Violet
    colorSecondary: '#8b5cf6',
    bgSidebar: '#2e1065',
    accent: '#a78bfa',
  },
  features: {
    enableProjects: true,
    enableExperiments: true,
    enableNotes: true,
    enableBookmarks: true,
    enableTodos: false,
    enableDocumentation: true,
    enableLandingManager: false,
    enableMaintenanceMode: true,
  },
  supabase: {
    url: import.meta.env.VITE_PLATFORM3_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_PLATFORM3_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY,
  }
};
