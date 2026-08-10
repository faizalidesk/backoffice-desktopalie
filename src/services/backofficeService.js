import { supabase } from '../lib/supabase';

export const backofficeService = {
  // STORAGE MEDIA UPLOAD
  async uploadMedia(file, folder = 'general') {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('workspace-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.warn('Supabase storage bucket missing or error, using Data URL fallback:', error.message);
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from('workspace-media')
        .getPublicUrl(fileName);

      return publicUrlData?.publicUrl || null;
    } catch (err) {
      console.warn('Using Data URL fallback for media upload:', err);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  },

  // MAINTENANCE SETTINGS
  async getMaintenanceSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'maintenance')
        .maybeSingle();

      if (data?.value) {
        return data.value;
      }
    } catch (err) {
      console.warn('Supabase site_settings table not accessible:', err);
    }

    const localData = localStorage.getItem('desktopalie_maintenance_settings');
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {}
    }

    return {
      is_enabled: false,
      title: 'Situs Sedang Dalam Pemeliharaan',
      message: 'Kami sedang melakukan peningkatan performa dan pembaruan sistem. Kembali lagi dalam beberapa saat.',
      end_time: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      allow_admin_bypass: true
    };
  },

  async updateMaintenanceSettings(settings) {
    // Always save to LocalStorage for instant local tab sync
    localStorage.setItem('desktopalie_maintenance_settings', JSON.stringify(settings));
    window.dispatchEvent(new Event('storage'));

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'maintenance',
            value: settings,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'key' }
        )
        .select();

      if (error) {
        console.warn('Supabase site_settings error, saved to LocalStorage:', error.message);
      }
      return settings;
    } catch (err) {
      console.warn('Saved to LocalStorage fallback:', err);
      return settings;
    }
  },

  // LANDING PAGE CONTENT SETTINGS
  async getLandingPageSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'landing_page')
        .maybeSingle();

      if (data?.value) {
        const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        return val;
      }
    } catch (err) {
      console.warn('Supabase site_settings table not accessible:', err);
    }

    const localData = localStorage.getItem('desktopalie_landing_settings');
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {}
    }

    return {
      hero_badge: 'Independent designer & developer',
      hero_title: 'Ideas, crafted into digital experiences.',
      hero_description: 'Desktopalie is my personal space for projects, experiments, and digital creations—documenting my journey through web development, UI/UX design, and modern technology.',
      hero_cta_text: 'Explore my work',
      hero_secondary_cta_text: 'More about me',
      hero_note: 'Currently exploring creative interfaces, thoughtful motion, and useful AI.',
      about_title: 'I build to learn, and share what I discover.',
      about_large_copy: 'I am Ali, a designer and developer interested in the space between technology and human experience.',
      about_description: 'Desktopalie is where I collect the projects, lessons, and experiments that shape my creative journey. I care about simple ideas, precise details, and digital work with a clear reason to exist.',
      about_location: 'Based in Indonesia • Working worldwide',
      stat_1_value: '4+',
      stat_1_label: 'Years exploring the web',
      stat_2_value: '20+',
      stat_2_label: 'Projects & experiments',
      stat_3_value: '∞',
      stat_3_label: 'Ideas still in progress',
      contact_title: "Let's make something worth remembering.",
      contact_email: 'hello@desktopalie.my.id',
      github_url: 'https://github.com',
      linkedin_url: 'https://linkedin.com',
      instagram_url: 'https://instagram.com'
    };
  },

  async updateLandingPageSettings(settings) {
    localStorage.setItem('desktopalie_landing_settings', JSON.stringify(settings));
    window.dispatchEvent(new Event('storage'));

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'landing_page',
            value: settings,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'key' }
        )
        .select();

      if (error) {
        console.warn('Supabase site_settings error, saved to LocalStorage:', error.message);
      }
      return settings;
    } catch (err) {
      console.warn('Saved to LocalStorage fallback:', err);
      return settings;
    }
  },

  // TODOS CRUD (Notion / Jira style Task Board)
  async getTodos() {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        localStorage.setItem('desktopalie_todos_fallback', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('Supabase todos table error, reading fallback:', err);
    }

    const localData = localStorage.getItem('desktopalie_todos_fallback');
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {}
    }

    const defaultTodos = [
      { 
        id: '1', 
        title: 'Mengenal struktur aplikasi Web (Nuxt.js)', 
        status: 'Not started', 
        priority: 'Medium', 
        category: 'Research',
        description: 'Pelajari arsitektur Nuxt 3, directory structure (pages, components, composables), dan SSR vs SPA mode.',
        subtasks: [
          { id: 'sub-101', title: 'Instalasi Nuxt 3 CLI', is_completed: true },
          { id: 'sub-102', title: 'Memahami Routing File-based', is_completed: false },
          { id: 'sub-103', title: 'Eksplorasi Composables & useState', is_completed: false }
        ],
        created_at: new Date().toISOString() 
      },
      { 
        id: '2', 
        title: 'Mengenal struktur aplikasi Mobile (Flutter)', 
        status: 'Not started', 
        priority: 'Low', 
        category: 'Research',
        description: 'Eksplorasi Widget Tree, State Management (Provider/Riverpod), dan struktur lib/ folder.',
        subtasks: [
          { id: 'sub-201', title: 'Setup Flutter SDK', is_completed: true },
          { id: 'sub-202', title: 'Uji Coba Widget Stateless & Stateful', is_completed: false }
        ],
        created_at: new Date().toISOString() 
      },
      { 
        id: '3', 
        title: 'Mengenal struktur aplikasi Backoffice (Laravel/Vue)', 
        status: 'Not started', 
        priority: 'Medium', 
        category: 'Research',
        description: 'Struktur MVC Laravel, Blade vs Vue inertia integration, dan middleware authentication.',
        subtasks: [],
        created_at: new Date().toISOString() 
      },
      { 
        id: '4', 
        title: 'Memahami alur kerja Sprint Development', 
        status: 'In progress', 
        priority: 'High', 
        category: 'Development',
        description: 'Siklus 2 minggu Sprint: Planning, Daily Standup, Review, & Retrospective.',
        subtasks: [
          { id: 'sub-401', title: 'Sprint Planning Meeting', is_completed: true },
          { id: 'sub-402', title: 'Task Estimation (Story Points)', is_completed: true },
          { id: 'sub-403', title: 'Execution & Daily Standup', is_completed: false }
        ],
        created_at: new Date().toISOString() 
      },
      { 
        id: '5', 
        title: 'Memahami role dan tanggung jawab QA', 
        status: 'In progress', 
        priority: 'Medium', 
        category: 'Testing',
        description: 'Definisi QA Engineer vs QC, pencegahan bug vs pencarian bug, dan jaminan kualitas end-to-end.',
        subtasks: [
          { id: 'sub-501', title: 'Review Requirement Specification', is_completed: true },
          { id: 'sub-502', title: 'Analisis Risk & Complexity', is_completed: false }
        ],
        created_at: new Date().toISOString() 
      },
      { 
        id: '6', 
        title: 'Mempelajari Manual Testing (UI, Functional, Exploratory)', 
        status: 'Done', 
        priority: 'High', 
        category: 'Testing',
        description: 'Metode verifikasi fitur secara manual sebelum dirilis ke lingkungan staging/production.',
        subtasks: [
          { id: 'sub-601', title: 'Testing Form Input & Validation', is_completed: true },
          { id: 'sub-602', title: 'Testing Boundary Values & Negative Cases', is_completed: true },
          { id: 'sub-603', title: 'Cross-browser Compatibility Check', is_completed: true }
        ],
        created_at: new Date().toISOString() 
      },
      { 
        id: '7', 
        title: 'Membuat Test Scenario dan Test Case', 
        status: 'Done', 
        priority: 'Urgent', 
        category: 'Testing',
        description: 'Dokumentasi langkah pengujian, precondition, expected result, dan actual result.',
        subtasks: [
          { id: 'sub-701', title: 'Penyusunan Test Matrix', is_completed: true },
          { id: 'sub-702', title: 'Penulisan 15 High-Priority Test Cases', is_completed: true }
        ],
        created_at: new Date().toISOString() 
      },
      { 
        id: '8', 
        title: 'Memahami Severity dan Priority', 
        status: 'Done', 
        priority: 'Medium', 
        category: 'Documentation',
        description: 'Dampak teknis bug (Severity: Blocker/Critical/Major) vs Urgensi bisnis (Priority: P1/P2/P3).',
        subtasks: [
          { id: 'sub-801', title: 'Matriks Klasifikasi Bug Severity', is_completed: true }
        ],
        created_at: new Date().toISOString() 
      },
      { 
        id: '9', 
        title: 'Membuat Bug Report', 
        status: 'Done', 
        priority: 'High', 
        category: 'Testing',
        description: 'Laporan bug yang efektif dengan steps to reproduce, screenshot/video evidence, dan environment detail.',
        subtasks: [
          { id: 'sub-901', title: 'Template Standard Bug Report', is_completed: true },
          { id: 'sub-902', title: 'Lampiran Console Log & Network Capture', is_completed: true }
        ],
        created_at: new Date().toISOString() 
      },
      { 
        id: '10', 
        title: 'Memahami Requirement, Product Backlog, User Story, Acceptance Criteria', 
        status: 'Done', 
        priority: 'Urgent', 
        category: 'Documentation',
        description: 'Format User Story (As a... I want to... So that...) dan Acceptance Criteria (Given... When... Then...).',
        subtasks: [
          { id: 'sub-1001', title: 'Bedah User Story Epic Auth', is_completed: true },
          { id: 'sub-1002', title: 'Definisi Done (DoD) Criteria', is_completed: true }
        ],
        created_at: new Date().toISOString() 
      }
    ];

    localStorage.setItem('desktopalie_todos_fallback', JSON.stringify(defaultTodos));
    return defaultTodos;
  },

  async createTodo(todo) {
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      id: crypto.randomUUID(),
      title: todo.title,
      description: todo.description || '',
      status: todo.status || 'Not started',
      priority: todo.priority || 'Medium',
      category: todo.category || 'General',
      created_at: new Date().toISOString(),
      ...(user ? { user_id: user.id } : {})
    };

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([payload])
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase insert todo error, saved to local state fallback:', err);
    }

    const currentLocal = JSON.parse(localStorage.getItem('desktopalie_todos_fallback') || '[]');
    const updated = [payload, ...currentLocal];
    localStorage.setItem('desktopalie_todos_fallback', JSON.stringify(updated));
    return payload;
  },

  async updateTodo(id, updates) {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase update todo error, updated locally:', err);
    }

    const currentLocal = JSON.parse(localStorage.getItem('desktopalie_todos_fallback') || '[]');
    const updated = currentLocal.map(t => t.id === id ? { ...t, ...updates } : t);
    localStorage.setItem('desktopalie_todos_fallback', JSON.stringify(updated));
    return { id, ...updates };
  },

  async deleteTodo(id) {
    try {
      await supabase.from('todos').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete todo error:', err);
    }

    const currentLocal = JSON.parse(localStorage.getItem('desktopalie_todos_fallback') || '[]');
    const updated = currentLocal.filter(t => t.id !== id);
    localStorage.setItem('desktopalie_todos_fallback', JSON.stringify(updated));
    return true;
  },

  // PROJECTS CRUD
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createProject(project) {
    const { data: { user } } = await supabase.auth.getUser();
    const payload = user ? { ...project, user_id: user.id } : project;
    const { data, error } = await supabase
      .from('projects')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProject(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProject(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // EXPERIMENTS CRUD
  async getExperiments() {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createExperiment(experiment) {
    const { data: { user } } = await supabase.auth.getUser();
    const payload = user ? { ...experiment, user_id: user.id } : experiment;
    const { data, error } = await supabase
      .from('experiments')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateExperiment(id, updates) {
    const { data, error } = await supabase
      .from('experiments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteExperiment(id) {
    const { error } = await supabase.from('experiments').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // NOTES CRUD
  async getNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createNote(note) {
    const { data: { user } } = await supabase.auth.getUser();
    const payload = user ? { ...note, user_id: user.id } : note;
    const { data, error } = await supabase
      .from('notes')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateNote(id, updates) {
    const { data, error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteNote(id) {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // BOOKMARKS CRUD
  async getBookmarks() {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createBookmark(bookmark) {
    const { data: { user } } = await supabase.auth.getUser();
    const payload = user ? { ...bookmark, user_id: user.id } : bookmark;
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteBookmark(id) {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // PROFILES
  async getProfile(userId) {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
