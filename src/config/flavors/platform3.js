export default {
  id: 'platform3',
  name: 'Desktopalie Backoffice Gamma',
  shortName: 'Gamma',
  description: 'Platform 3 - Analytics & Media Hub Workspace (Streaming & Encoding)',
  logoText: 'Desktopalie Gamma',
  theme: {
    colorPrimary: '#7c3aed', // Purple Violet
    colorSecondary: '#8b5cf6',
    bgSidebar: '#ffffff',
    accent: '#a78bfa',
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
    url: import.meta.env.VITE_PLATFORM3_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_PLATFORM3_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  dummyData: {
    stats: {
      projectsCount: 18,
      experimentsCount: 22,
      notesCount: 35,
      bookmarksCount: 62,
      todosCount: 7,
      docsCount: 19
    },
    recentProjects: [
      { id: 'p3-1', title: 'Gamma Video Transcoder & Streaming Engine', type: 'Media Processing', status: 'In progress', progress: 92, tone: 'violet' },
      { id: 'p3-2', title: 'AI Audio Noise Reduction Plugin', type: 'Audio R&D', status: 'Completed', progress: 100, tone: 'rose' },
      { id: 'p3-3', title: 'Live Stream Analytics & CDN Ingest', type: 'Analytics', status: 'In progress', progress: 50, tone: 'purple' },
      { id: 'p3-4', title: 'Dynamic Watermark & DRM Protection', type: 'Security', status: 'In progress', progress: 80, tone: 'indigo' },
    ],
    recentTodos: [
      { id: 't3-1', title: 'Benchmark FFmpeg H.265 vs AV1 Encoding Speed', status: 'Done', priority: 'High', category: 'Media R&D' },
      { id: 't3-2', title: 'Implementasi HLS Multi-Bitrate Adaptive Streaming', status: 'In progress', priority: 'High', category: 'Streaming' },
      { id: 't3-3', title: 'Stress Test CDN Edge Cache Hit Rate', status: 'In progress', priority: 'Medium', category: 'CDN' },
      { id: 't3-4', title: 'Pemberitahuan Maintenance Transcoder Node 3', status: 'Done', priority: 'Low', category: 'Maintenance' },
    ],
    recentDocs: [
      { id: 'd3-1', title: 'Standard HLS & DASH Streaming Protocol', category: 'Streaming', author: 'Gamma Media Lead' },
      { id: 'd3-2', title: 'Panduan Encoding Presets FFmpeg GPU Acceleration', category: 'Encoding', author: 'Media Team' },
      { id: 'd3-3', title: 'Penanganan Low-Latency WebRTC Transmissions', category: 'Network', author: 'Network Engineer' },
    ],
    maintenance: {
      is_active: true,
      notice_title: 'Jadwal Pemeliharaan Node Transcoder 3',
      notice_message: 'Peningkatan kapasitas cluster video encoding sedang berlangsung.'
    },
    landing: {
      hero_title: 'High-Performance Video Encoding & Streaming Platform',
      hero_subtitle: 'Platform pemrosesan media berkinerja tinggi Platform Gamma.'
    }
  }
};
