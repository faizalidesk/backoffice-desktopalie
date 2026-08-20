export default {
  id: 'platform3',
  name: 'Gamma',
  shortName: 'Gamma',
  description: 'Platform 3 - Analytics & Media Hub Workspace (Streaming & Encoding)',
  logoText: 'Desktopalie Gamma',
  theme: {
    colorPrimary: '#7c3aed', // Purple Violet
    colorSecondary: '#8b5cf6',
    bgSidebar: '#FFFFFF',
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
      projectsCount: 11,
      experimentsCount: 12,
      notesCount: 18,
      bookmarksCount: 52,
      todosCount: 22,
      docsCount: 15
    },
    recentProjects: [
      { id: 'p3-1', title: 'H.265 / AV1 Distributed Transcoder', type: 'Video Core', status: 'In progress', progress: 95, tone: 'violet' },
      { id: 'p3-2', title: 'Realtime Subtitle Whisper AI Engine', type: 'AI Media', status: 'In progress', progress: 80, tone: 'fuchsia' },
      { id: 'p3-3', title: 'Adaptive Bitrate HLS Stream Optimizer', type: 'CDN Pipeline', status: 'Completed', progress: 100, tone: 'purple' },
      { id: 'p3-4', title: 'Video Watermark & DRM Protection', type: 'Security', status: 'In progress', progress: 50, tone: 'rose' },
    ],
    recentTodos: [
      { id: 't3-1', title: 'Optimasi Latensi FFmpeg Segmenter di bawah 1.5 detik', status: 'In progress', priority: 'High', category: 'Streaming' },
      { id: 't3-2', title: 'Benchmark Model Whisper-v3 pada GPU Cluster', status: 'Done', priority: 'High', category: 'AI' },
      { id: 't3-3', title: 'Setup Auto-Scaling Cloudflare Stream Workers', status: 'In progress', priority: 'Medium', category: 'Infra' },
    ],
    recentDocs: [
      { id: 'd3-1', title: 'Spesifikasi Preset Encoding 4K 60FPS AV1', category: 'Encoding', author: 'Media Lead' },
      { id: 'd3-2', title: 'Arsitektur WebRTC Low-Latency Broadcast', category: 'Network', author: 'Streaming Team' },
    ],
    maintenance: {
      is_active: false,
      notice_title: 'Media Streaming Cluster Normal',
      notice_message: 'Transcoder pipeline dan distribusi CDN aktif 100%.'
    },
    landing: {
      hero_title: 'Ultra-Fast AI Video Transcoding & Streaming Engine',
      hero_subtitle: 'Infrastruktur pemrosesan media berbasis edge compute, encoding AV1/H.265 terdistribusi, dan otomasi subtitle cerdas.'
    }
  }
};
