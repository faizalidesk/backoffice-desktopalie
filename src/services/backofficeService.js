import { supabase } from '../lib/supabase';

const getCurrentPlatformId = () => {
  return localStorage.getItem('desktopalie_flavor') || import.meta.env.VITE_FLAVOR || 'platform1';
};

export const backofficeService = {
  getCurrentPlatformId,

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

  // HELPER: SAFE UPDATE/INSERT TO SITE_SETTINGS (PREVENTS 409 CONFLICT ERROR 23505)
  async saveSiteSetting(key, value) {
    const updatedAt = new Date().toISOString();
    try {
      // 1. Try to UPDATE existing row by key first
      const { data: updatedData, error: updateError } = await supabase
        .from('site_settings')
        .update({ value, updated_at: updatedAt })
        .eq('key', key)
        .select();

      if (!updateError && updatedData && updatedData.length > 0) {
        return { data: updatedData[0], error: null };
      }

      // 2. If row does not exist yet, INSERT new row
      const { data: insertedData, error: insertError } = await supabase
        .from('site_settings')
        .insert([{ key, value, updated_at: updatedAt }])
        .select();

      if (!insertError && insertedData) {
        return { data: insertedData[0], error: null };
      }

      // 3. Final fallback: upsert
      const { data: upsertData, error: upsertError } = await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: updatedAt })
        .select();

      return { data: upsertData, error: upsertError };
    } catch (err) {
      console.warn('saveSiteSetting error:', err);
      return { error: err };
    }
  },

  async getAllSiteSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) {
        console.warn('getAllSiteSettings error:', error);
        return {};
      }

      const settingsMap = {};
      if (data && data.length > 0) {
        data.forEach(item => {
          settingsMap[item.key] = item.value;
        });
      }
      return settingsMap;
    } catch (err) {
      console.warn('getAllSiteSettings exception:', err);
      return {};
    }
  },

  async getAllProfiles() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.warn('getAllProfiles error:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.warn('getAllProfiles exception:', err);
      return [];
    }
  },

  // MAINTENANCE SETTINGS (SCOPED PER PLATFORM FLAVOR)
  async getMaintenanceSettings(platformId = null) {
    const targetPlatform = platformId || getCurrentPlatformId();
    const key = `maintenance_${targetPlatform}`;
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .maybeSingle();

      let settingObj = data?.value;

      // Fallback for platform1 to legacy 'maintenance' key if missing
      if (!settingObj && targetPlatform === 'platform1') {
        const { data: legacyData } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'maintenance')
          .maybeSingle();
        settingObj = legacyData?.value;
      }

      if (settingObj) {
        let val = typeof settingObj === 'string' ? JSON.parse(settingObj) : settingObj;
        const indonesianKeywords = ["situs", "pemeliharaan", "kami", "sedang", "melakukan", "peningkatan", "pembaruan", "beberapa", "saat", "kembali"];
        let needsUpdate = false;

        if (indonesianKeywords.some(kw => String(val?.title || '').toLowerCase().includes(kw))) {
          val.title = 'System Under Maintenance';
          needsUpdate = true;
        }
        if (indonesianKeywords.some(kw => String(val?.message || '').toLowerCase().includes(kw))) {
          val.message = 'We are performing system upgrades and performance enhancements. Please check back shortly.';
          needsUpdate = true;
        }

        if (needsUpdate) {
          this.saveSiteSetting(key, val);
        }

        return val;
      }
    } catch (err) {
      console.warn('Supabase site_settings table not accessible:', err);
    }

    const localData = localStorage.getItem(`desktopalie_maintenance_settings_${targetPlatform}`);
    if (localData) {
      try {
        let val = JSON.parse(localData);
        if (val.title?.toLowerCase().includes('situs') || val.title?.toLowerCase().includes('pemeliharaan')) {
          val.title = 'System Under Maintenance';
        }
        if (val.message?.toLowerCase().includes('kami') || val.message?.toLowerCase().includes('pembaruan')) {
          val.message = 'We are performing system upgrades and performance enhancements. Please check back shortly.';
        }
        return val;
      } catch (e) {}
    }

    return {
      is_enabled: false,
      title: 'System Under Maintenance',
      message: 'We are performing system upgrades and performance enhancements. Please check back shortly.',
      end_time: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      allow_admin_bypass: true
    };
  },

  async updateMaintenanceSettings(settings, platformId = null) {
    const targetPlatform = platformId || getCurrentPlatformId();
    const key = `maintenance_${targetPlatform}`;

    // Always save to LocalStorage for instant local tab sync
    localStorage.setItem(`desktopalie_maintenance_settings_${targetPlatform}`, JSON.stringify(settings));
    if (targetPlatform === 'platform1') {
      localStorage.setItem('desktopalie_maintenance_settings', JSON.stringify(settings));
    }
    window.dispatchEvent(new Event('storage'));

    try {
      await this.saveSiteSetting(key, settings);

      if (targetPlatform === 'platform1') {
        await this.saveSiteSetting('maintenance', settings);
      }

      return settings;
    } catch (err) {
      console.warn('Saved to LocalStorage fallback:', err);
      return settings;
    }
  },

  // LANDING PAGE CONTENT SETTINGS
  async getLandingPageSettings(flavorId = 'platform1') {
    const key = `landing_page_${flavorId}`;
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .maybeSingle();

      if (data?.value) {
        const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        return val;
      }
    } catch (err) {
      console.warn('Supabase site_settings table not accessible:', err);
    }

    const localData = localStorage.getItem(`desktopalie_landing_settings_${flavorId}`);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {}
    }

    // Default presets per flavor
    const presets = {
      platform1: {
        domain_url: 'https://desktopalie.my.id',
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
      },
      platform2: {
        domain_url: 'https://beta.desktopalie.my.id',
        hero_badge: 'Smart Logistics & Fleet Telemetry System',
        hero_title: 'Real-time Fleet Intelligence & Telemetry System',
        hero_description: 'Solusi manajemen armada, pelacakan GPS real-time, pengawasan rute otomatis, dan analisis efisiensi bahan bakar Platform Beta.',
        hero_cta_text: 'Lihat Live Telemetry',
        hero_secondary_cta_text: 'Dokumentasi Fleet API',
        hero_note: 'Mendukung integrasi IoT sensor GPS, OBD-II, dan kalkulasi rute otomatis.',
        about_title: 'Transformasi Logistik Modern Berbasis Data.',
        about_large_copy: 'Platform Beta menyediakan dasbor kontrol armada kendaraan dengan pemantauan posisi real-time dan analisis pengemudi.',
        about_description: 'Dikembangkan khusus untuk kebutuhan operasi armada logistik, transportasi, dan rantai pasokan dengan transparansi data yang akurat.',
        about_location: 'Jakarta • Surabaya • Dispatch Hub',
        stat_1_value: '150+',
        stat_1_label: 'Armada Aktif Terhubung',
        stat_2_value: '99.9%',
        stat_2_label: 'Uptime GPS Telemetry',
        stat_3_value: '< 50ms',
        stat_3_label: 'Latensi Respon Sensor',
        contact_title: 'Hubungi Tim Operasi Logistik Beta.',
        contact_email: 'fleet@beta.desktopalie.my.id',
        github_url: 'https://github.com',
        linkedin_url: 'https://linkedin.com',
        instagram_url: 'https://instagram.com'
      },
      platform3: {
        domain_url: 'https://gamma.desktopalie.my.id',
        hero_badge: 'AI Video Transcoder & Streaming Analytics Hub',
        hero_title: 'High-Throughput Transcoding & Media Analytics Platform',
        hero_description: 'Engine transkoding video HLS/DASH berbasis cloud, pembuatan subtitle AI otomatis, dan analitik penonton Platform Gamma.',
        hero_cta_text: 'Coba Studio Streaming',
        hero_secondary_cta_text: 'Arsitektur Transcoder',
        hero_note: 'Dipersenjatai GPU Acceleration untuk rendering video 4K 60fps serentak.',
        about_title: 'Infrastruktur Video Terakselerasi untuk Kreator & Media.',
        about_large_copy: 'Platform Gamma memberikan pengalaman streaming berlatensi rendah dengan analitik keterlibatan penonton yang presisi.',
        about_description: 'Memproses ribuan jam konten video setiap bulan dengan konversi format otomatis dan optimasi bandwith secara cerdas.',
        about_location: 'Cloud Edge Nodes • Global CDN',
        stat_1_value: '10K+',
        stat_1_label: 'Jam Video Terolah',
        stat_2_value: '4K 60FPS',
        stat_2_label: 'Kualitas Transcode Max',
        stat_3_value: '0.8s',
        stat_3_label: 'Rata-rata Buffer Stream',
        contact_title: 'Konsultasikan Infrastruktur Streaming Anda.',
        contact_email: 'media@gamma.desktopalie.my.id',
        github_url: 'https://github.com',
        linkedin_url: 'https://linkedin.com',
        instagram_url: 'https://instagram.com'
      },
      platform4: {
        domain_url: 'https://delta.desktopalie.my.id',
        hero_badge: 'Enterprise ERP & Compliance Audit System',
        hero_title: 'Client Financial ERP, Inventory & Security Audit Engine',
        hero_description: 'Sistem manajemen sumber daya perusahaan, akuntansi terpusat, pengawasan persediaan, dan audit kepatuhan keamanan ISO 27001.',
        hero_cta_text: 'Jelajahi Modul ERP',
        hero_secondary_cta_text: 'Laporan Audit Kepatuhan',
        hero_note: 'Dilengkapi Enkripsi AES-256 dan sertifikasi audit jejak digital enterprise.',
        about_title: 'Tingkat Keamanan & Tata Kelola Enterprise Terbaik.',
        about_large_copy: 'Platform Delta dirancang untuk perusahaan berskala besar yang membutuhkan pengawasan keuangan dan audit internal tanpa kompromi.',
        about_description: 'Mengintegrasikan modul keuangan, inventaris multi-gudang, manajemen kontrak vendor, dan pelaporan audit pajak secara real-time.',
        about_location: 'Enterprise Finance Center',
        stat_1_value: 'ISO 27001',
        stat_1_label: 'Standar Keamanan Siber',
        stat_2_value: '100%',
        stat_2_label: 'Jejak Audit Terverifikasi',
        stat_3_value: '24/7',
        stat_3_label: 'Pengawasan Keuangan Real-Time',
        contact_title: 'Diskusikan Solusi Enterprise Delta dengan Kami.',
        contact_email: 'enterprise@delta.desktopalie.my.id',
        github_url: 'https://github.com',
        linkedin_url: 'https://linkedin.com',
        instagram_url: 'https://instagram.com'
      }
    };

    return presets[flavorId] || presets.platform1;
  },

  async updateLandingPageSettings(settings, flavorId = 'platform1') {
    const key = `landing_page_${flavorId}`;
    localStorage.setItem(`desktopalie_landing_settings_${flavorId}`, JSON.stringify(settings));
    window.dispatchEvent(new Event('storage'));

    try {
      await this.saveSiteSetting(key, settings);
      return settings;
    } catch (err) {
      console.warn('Saved to LocalStorage fallback:', err);
      return settings;
    }
  },

  // SYSTEM DOCUMENTATION & KNOWLEDGE BASE WITH FOLDER & SUBFOLDER TREE
  async getDocs(platformId = null) {
    const targetPlatform = platformId || getCurrentPlatformId();
    try {
      const { data, error } = await supabase
        .from('documentation')
        .select('*')
        .eq('platform_id', targetPlatform)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase documentation table error, reading fallback:', err);
    }

    const localData = localStorage.getItem(`desktopalie_docs_fallback_${targetPlatform}`);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {}
    }

    return [];
  },

  async createDoc(doc) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetPlatform = doc.platform_id || getCurrentPlatformId();
    const payload = {
      id: crypto.randomUUID(),
      platform_id: targetPlatform,
      title: doc.title,
      folder: doc.folder || '1. Arsitektur System & Core',
      subfolder: doc.subfolder || 'General',
      category: doc.category || 'Guides',
      content: doc.content || '',
      author: doc.author || user?.email || 'Admin',
      created_at: new Date().toISOString(),
      ...(user ? { user_id: user.id } : {})
    };

    try {
      const { data, error } = await supabase
        .from('documentation')
        .insert([payload])
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase insert documentation error, saved locally:', err);
    }

    const currentLocal = JSON.parse(localStorage.getItem(`desktopalie_docs_fallback_${targetPlatform}`) || '[]');
    const updated = [payload, ...currentLocal];
    localStorage.setItem(`desktopalie_docs_fallback_${targetPlatform}`, JSON.stringify(updated));
    return payload;
  },

  async updateDoc(id, updates) {
    try {
      const { data, error } = await supabase
        .from('documentation')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase update documentation error, updated locally:', err);
    }

    const currentLocal = JSON.parse(localStorage.getItem('desktopalie_docs_fallback') || '[]');
    const updated = currentLocal.map(d => d.id === id ? { ...d, ...updates } : d);
    localStorage.setItem('desktopalie_docs_fallback', JSON.stringify(updated));
    return { id, ...updates };
  },

  async deleteDoc(id) {
    try {
      await supabase.from('documentation').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete documentation error:', err);
    }

    const currentLocal = JSON.parse(localStorage.getItem('desktopalie_docs_fallback') || '[]');
    const updated = currentLocal.filter(d => d.id !== id);
    localStorage.setItem('desktopalie_docs_fallback', JSON.stringify(updated));
    return true;
  },

  // TODOS CRUD (Notion / Jira style Task Board)
  async getTodos(platformId = null) {
    const targetPlatform = platformId || getCurrentPlatformId();
    let supabaseData = [];

    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('platform_id', targetPlatform)
        .order('created_at', { ascending: false });

      if (!error && data) {
        supabaseData = data;
      }
    } catch (err) {
      console.warn('Supabase todos query error:', err);
    }

    const fallbackKey = `desktopalie_todos_fallback_${targetPlatform}`;
    const localDataStr = localStorage.getItem(fallbackKey) || localStorage.getItem('desktopalie_todos_fallback');
    const localData = localDataStr ? JSON.parse(localDataStr) : [];

    // Merge Supabase & Local fallback items to prevent task loss
    const mergedMap = new Map();
    localData.forEach(item => mergedMap.set(item.id, item));
    supabaseData.forEach(item => mergedMap.set(item.id, item));

    const result = Array.from(mergedMap.values()).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return result;
  },

  async createTodo(todo) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetPlatform = todo.platform_id || getCurrentPlatformId();
    const payload = {
      id: todo.id || crypto.randomUUID(),
      platform_id: targetPlatform,
      title: todo.title,
      description: todo.description || '',
      status: todo.status || 'Not started',
      priority: todo.priority || 'Medium',
      category: todo.category || 'General',
      subtasks: todo.subtasks || [],
      created_at: new Date().toISOString(),
      ...(user ? { user_id: user.id } : {})
    };

    // Update local storage fallback immediately (optimistic local save)
    const fallbackKey = `desktopalie_todos_fallback_${targetPlatform}`;
    const currentLocal = JSON.parse(localStorage.getItem(fallbackKey) || localStorage.getItem('desktopalie_todos_fallback') || '[]');
    const updatedLocal = [payload, ...currentLocal.filter(t => t.id !== payload.id)];
    localStorage.setItem(fallbackKey, JSON.stringify(updatedLocal));
    localStorage.setItem('desktopalie_todos_fallback', JSON.stringify(updatedLocal));

    try {
      const { subtasks, ...dbPayload } = payload;
      const { data, error } = await supabase
        .from('todos')
        .insert([{ ...dbPayload, subtasks }])
        .select()
        .single();

      if (!error && data) return { ...data, subtasks: payload.subtasks };

      // Retry without subtasks column if DB schema differs
      if (error && (error.message?.includes('column') || error.code === 'PGRST204')) {
        const { data: retryData, error: retryErr } = await supabase
          .from('todos')
          .insert([dbPayload])
          .select()
          .single();
        if (!retryErr && retryData) return { ...retryData, subtasks: payload.subtasks };
      }
    } catch (err) {
      console.warn('Supabase insert todo error, saved to local state fallback:', err);
    }

    return payload;
  },

  async updateTodo(id, updates) {
    const targetPlatform = updates.platform_id || getCurrentPlatformId();
    const fallbackKey = `desktopalie_todos_fallback_${targetPlatform}`;
    const currentLocal = JSON.parse(localStorage.getItem(fallbackKey) || localStorage.getItem('desktopalie_todos_fallback') || '[]');
    const updatedLocal = currentLocal.map(t => t.id === id ? { ...t, ...updates } : t);
    localStorage.setItem(fallbackKey, JSON.stringify(updatedLocal));
    localStorage.setItem('desktopalie_todos_fallback', JSON.stringify(updatedLocal));

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

    return { id, ...updates };
  },

  async deleteTodo(id) {
    try {
      await supabase.from('todos').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete todo error:', err);
    }

    const currentPlatform = getCurrentPlatformId();
    const fallbackKey = `desktopalie_todos_fallback_${currentPlatform}`;
    const currentLocal = JSON.parse(localStorage.getItem(fallbackKey) || localStorage.getItem('desktopalie_todos_fallback') || '[]');
    const updated = currentLocal.filter(t => t.id !== id);
    localStorage.setItem(fallbackKey, JSON.stringify(updated));
    localStorage.setItem('desktopalie_todos_fallback', JSON.stringify(updated));
    return true;
  },

  // PROJECTS CRUD
  async getProjects(platformId = null) {
    const targetPlatform = platformId || getCurrentPlatformId();
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('platform_id', targetPlatform)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
      const { data: fallbackData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      return fallbackData || [];
    } catch (err) {
      console.warn('Error fetching projects:', err);
      return [];
    }
  },

  async createProject(project) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetPlatform = project.platform_id || getCurrentPlatformId();
    const payload = { ...project, platform_id: targetPlatform };
    if (payload.cover_url !== undefined) {
      if (!payload.image_url) payload.image_url = payload.cover_url;
      delete payload.cover_url;
    }
    if (payload.image !== undefined) {
      if (!payload.image_url) payload.image_url = payload.image;
      delete payload.image;
    }
    if (user) payload.user_id = user.id;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([payload])
        .select()
        .single();
      if (!error && data) return data;
      if (error) {
        console.warn('Supabase insert project error, retrying clean payload:', error.message);
        const cleanPayload = {
          platform_id: targetPlatform,
          slug: payload.slug,
          title: payload.title,
          type: payload.type,
          description: payload.description,
          progress: payload.progress,
          status: payload.status,
          tone: payload.tone,
          image_url: payload.image_url || '',
          ...(user ? { user_id: user.id } : {})
        };
        const { data: retryData, error: retryError } = await supabase
          .from('projects')
          .insert([cleanPayload])
          .select()
          .single();
        if (!retryError && retryData) return retryData;
        throw error;
      }
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  },

  async updateProject(id, updates) {
    const payload = { ...updates, updated_at: new Date().toISOString() };
    if (payload.cover_url !== undefined) {
      if (!payload.image_url) payload.image_url = payload.cover_url;
      delete payload.cover_url;
    }
    if (payload.image !== undefined) {
      if (!payload.image_url) payload.image_url = payload.image;
      delete payload.image;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
      if (error) {
        console.warn('Supabase update project error, retrying clean payload:', error.message);
        const cleanPayload = {
          slug: payload.slug,
          title: payload.title,
          type: payload.type,
          description: payload.description,
          progress: payload.progress,
          status: payload.status,
          tone: payload.tone,
          image_url: payload.image_url || '',
          updated_at: payload.updated_at
        };
        const { data: retryData, error: retryError } = await supabase
          .from('projects')
          .update(cleanPayload)
          .eq('id', id)
          .select()
          .single();
        if (!retryError && retryData) return retryData;
        throw error;
      }
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  },

  async deleteProject(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // EXPERIMENTS CRUD
  async getExperiments(platformId = null) {
    const targetPlatform = platformId || getCurrentPlatformId();
    try {
      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .eq('platform_id', targetPlatform)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
      const { data: fallbackData } = await supabase
        .from('experiments')
        .select('*')
        .order('created_at', { ascending: false });
      return fallbackData || [];
    } catch (err) {
      console.warn('Error fetching experiments:', err);
      return [];
    }
  },

  async createExperiment(experiment) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetPlatform = experiment.platform_id || getCurrentPlatformId();
    const payload = { ...experiment, platform_id: targetPlatform };
    if (payload.cover_url !== undefined) {
      if (!payload.image_url) payload.image_url = payload.cover_url;
      delete payload.cover_url;
    }
    if (payload.image !== undefined) {
      if (!payload.image_url) payload.image_url = payload.image;
      delete payload.image;
    }
    if (user) payload.user_id = user.id;

    try {
      const { data, error } = await supabase
        .from('experiments')
        .insert([payload])
        .select()
        .single();
      if (!error && data) return data;
      if (error) {
        console.warn('Supabase insert experiment error, retrying clean payload:', error.message);
        const cleanPayload = {
          platform_id: targetPlatform,
          slug: payload.slug,
          title: payload.title,
          type: payload.type,
          description: payload.description,
          status: payload.status,
          tone: payload.tone,
          image_url: payload.image_url || '',
          ...(user ? { user_id: user.id } : {})
        };
        const { data: retryData, error: retryError } = await supabase
          .from('experiments')
          .insert([cleanPayload])
          .select()
          .single();
        if (!retryError && retryData) return retryData;
        throw error;
      }
    } catch (err) {
      console.error('Error creating experiment:', err);
      throw err;
    }
  },

  async updateExperiment(id, updates) {
    const payload = { ...updates, updated_at: new Date().toISOString() };
    if (payload.cover_url !== undefined) {
      if (!payload.image_url) payload.image_url = payload.cover_url;
      delete payload.cover_url;
    }
    if (payload.image !== undefined) {
      if (!payload.image_url) payload.image_url = payload.image;
      delete payload.image;
    }

    try {
      const { data, error } = await supabase
        .from('experiments')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
      if (error) {
        console.warn('Supabase update experiment error, retrying clean payload:', error.message);
        const cleanPayload = {
          slug: payload.slug,
          title: payload.title,
          type: payload.type,
          description: payload.description,
          status: payload.status,
          tone: payload.tone,
          image_url: payload.image_url || '',
          updated_at: payload.updated_at
        };
        const { data: retryData, error: retryError } = await supabase
          .from('experiments')
          .update(cleanPayload)
          .eq('id', id)
          .select()
          .single();
        if (!retryError && retryData) return retryData;
        throw error;
      }
    } catch (err) {
      console.error('Error updating experiment:', err);
      throw err;
    }
  },

  async deleteExperiment(id) {
    const { error } = await supabase.from('experiments').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // NOTES CRUD
  async getNotes(platformId = null) {
    const targetPlatform = platformId || getCurrentPlatformId();
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('platform_id', targetPlatform)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
      const { data: fallbackData } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });
      return fallbackData || [];
    } catch (err) {
      console.warn('Error fetching notes:', err);
      return [];
    }
  },

  async createNote(note) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetPlatform = note.platform_id || getCurrentPlatformId();
    const payload = { ...note, platform_id: targetPlatform, ...(user ? { user_id: user.id } : {}) };
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
  async getBookmarks(platformId = null) {
    const targetPlatform = platformId || getCurrentPlatformId();
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('platform_id', targetPlatform)
        .order('created_at', { ascending: false });

      if (!error && data) return data;
      const { data: fallbackData } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });
      return fallbackData || [];
    } catch (err) {
      console.warn('Error fetching bookmarks:', err);
      return [];
    }
  },

  async createBookmark(bookmark) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetPlatform = bookmark.platform_id || getCurrentPlatformId();
    const payload = { ...bookmark, platform_id: targetPlatform, ...(user ? { user_id: user.id } : {}) };
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

  // PROFILES (DATABASE PERSISTENCE VIA SITE_SETTINGS + PROFILES TABLE + LOCAL FALLBACK)
  async getProfile(userId = null) {
    const targetUserId = userId || 'default_admin';
    const localKey = `desktopalie_profile_${targetUserId}`;
    const settingKey = `profile_${targetUserId}`;

    // Check LocalStorage cache first
    let localData = null;
    try {
      const cached = localStorage.getItem(localKey) || localStorage.getItem('desktopalie_profile');
      if (cached) localData = JSON.parse(cached);
    } catch (e) {}

    // 1. Try fetching full JSON profile from site_settings (key: profile_<userId>)
    try {
      const { data: settingData, error: settingError } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', settingKey)
        .maybeSingle();

      if (!settingError && settingData?.value) {
        const dbVal = typeof settingData.value === 'string' ? JSON.parse(settingData.value) : settingData.value;
        const merged = { ...localData, ...dbVal };
        localStorage.setItem(localKey, JSON.stringify(merged));
        localStorage.setItem('desktopalie_profile', JSON.stringify(merged));
        return merged;
      }
    } catch (err) {
      console.warn('Supabase site_settings profile fetch warning:', err);
    }

    // 2. Fallback: try fetching from profiles table
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (!error && data && Object.keys(data).length > 0) {
          const merged = { ...localData, ...data };
          localStorage.setItem(localKey, JSON.stringify(merged));
          localStorage.setItem('desktopalie_profile', JSON.stringify(merged));
          return merged;
        }
      } catch (err) {
        console.warn('Supabase profiles table fetch warning:', err);
      }
    }

    return localData || {
      full_name: 'Faiz Ali',
      username: 'faizali',
      bio: 'Independent designer & developer',
      avatar_url: '',
      location: 'Indonesia',
      website: 'https://desktopalie.my.id'
    };
  },

  async updateProfile(userId = null, updates = {}) {
    const targetUserId = userId || 'default_admin';
    const localKey = `desktopalie_profile_${targetUserId}`;
    const settingKey = `profile_${targetUserId}`;
    
    const payload = {
      id: targetUserId,
      ...updates,
      updated_at: new Date().toISOString()
    };

    // 1. Always save to LocalStorage for instant persistence and storage events
    localStorage.setItem(localKey, JSON.stringify(payload));
    localStorage.setItem('desktopalie_profile', JSON.stringify(payload));
    window.dispatchEvent(new Event('storage'));

    // 2. Persist full profile JSON to site_settings table (Guaranteed 200 OK, no PGRST204 schema error)
    try {
      await this.saveSiteSetting(settingKey, payload);
    } catch (err) {
      console.warn('Save profile to site_settings warning:', err);
    }

    // 3. Try saving basic columns (id, full_name, avatar_url, updated_at) to profiles table safely
    if (userId) {
      try {
        const cleanProfile = {
          id: userId,
          updated_at: payload.updated_at
        };
        if (payload.full_name) cleanProfile.full_name = payload.full_name;
        if (payload.avatar_url) cleanProfile.avatar_url = payload.avatar_url;

        await supabase
          .from('profiles')
          .upsert([cleanProfile], { onConflict: 'id' });
      } catch (err) {
        console.warn('Profiles table upsert warning (ignored):', err);
      }
    }

    return payload;
  },

  // TRANSACTIONS & BILLING MANAGEMENT
  async getTransactions(platformId = null) {
    const targetPlatform = platformId || getCurrentPlatformId();
    const key = `transactions_${targetPlatform}`;

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .maybeSingle();

      if (data?.value) {
        const val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        if (Array.isArray(val) && val.length > 0) return val;
      }
    } catch (err) {
      console.warn('Supabase transactions fetch warning:', err);
    }

    const localData = localStorage.getItem(`desktopalie_transactions_${targetPlatform}`) || localStorage.getItem('desktopalie_transactions');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }

    // Default rich sample dataset
    const defaultTransactions = [
      {
        id: 'TRX-982026-8819',
        invoice_number: 'INV/2026/08/00192',
        customer_name: 'Faiz Ali (Super Admin)',
        customer_email: 'faizali.desk@gmail.com',
        customer_avatar: 'https://ui-avatars.com/api/?name=Faiz+Ali&background=4F46E5&color=fff',
        item_name: 'Enterprise Cloud Workspace Tier 4',
        category: 'Cloud Infrastructure',
        platform: 'platform1',
        platform_name: 'Desktopalie Main',
        amount: 3500000,
        fee: 5000,
        tax: 385000,
        total_amount: 3890000,
        payment_method: 'QRIS',
        payment_channel: 'QRIS Dinamis (GPN / Bank Indonesia)',
        status: 'Sukses',
        created_at: '2026-08-19T09:45:00Z',
        paid_at: '2026-08-19T09:46:12Z',
        notes: 'Perpanjangan lisensi tahunan platform utama.'
      },
      {
        id: 'TRX-771920-4412',
        invoice_number: 'INV/2026/08/00191',
        customer_name: 'Budi Logistics Coordinator',
        customer_email: 'budi.logistics@cargo-beta.com',
        customer_avatar: 'https://ui-avatars.com/api/?name=Budi+Logistics&background=10B981&color=fff',
        item_name: 'Cold-Chain IoT Telemetry Subscription',
        category: 'Logistics Fleet',
        platform: 'platform2',
        platform_name: 'Desktopalie Beta',
        amount: 1850000,
        fee: 4500,
        tax: 203500,
        total_amount: 2058000,
        payment_method: 'BCA Virtual Account',
        payment_channel: 'BCA Virtual Account (8077712398)',
        status: 'Sukses',
        created_at: '2026-08-19T08:20:00Z',
        paid_at: '2026-08-19T08:22:30Z',
        notes: 'Modul sensor suhu real-time 15 armada truk.'
      },
      {
        id: 'TRX-551040-3321',
        invoice_number: 'INV/2026/08/00190',
        customer_name: 'Rian Transcoder Engineer',
        customer_email: 'rian.transcode@gamma-stream.io',
        customer_avatar: 'https://ui-avatars.com/api/?name=Rian+Stream&background=8B5CF6&color=fff',
        item_name: 'Ultra HD Transcoding GPU Bandwidth 10TB',
        category: 'Streaming Engine',
        platform: 'platform3',
        platform_name: 'Desktopalie Gamma',
        amount: 4200000,
        fee: 0,
        tax: 462000,
        total_amount: 4662000,
        payment_method: 'Kartu Kredit',
        payment_channel: 'Visa Platinum (**** 4821)',
        status: 'Pending',
        created_at: '2026-08-19T07:15:00Z',
        paid_at: null,
        notes: 'Menunggu otorisasi 3D Secure dari bank penerbit.'
      },
      {
        id: 'TRX-331092-7788',
        invoice_number: 'INV/2026/08/00189',
        customer_name: 'Dedi Enterprise Cloud Admin',
        customer_email: 'dedi.cloud@delta-erp.net',
        customer_avatar: 'https://ui-avatars.com/api/?name=Dedi+Cloud&background=F59E0B&color=fff',
        item_name: 'High-Concurrency ERP Database Node',
        category: 'Enterprise ERP',
        platform: 'platform4',
        platform_name: 'Desktopalie Delta',
        amount: 6800000,
        fee: 6500,
        tax: 748000,
        total_amount: 7554500,
        payment_method: 'Mandiri Virtual Account',
        payment_channel: 'Mandiri VA (8899012384)',
        status: 'Sukses',
        created_at: '2026-08-18T22:30:00Z',
        paid_at: '2026-08-18T22:35:10Z',
        notes: 'Deployment cluster PostgreSQL 3-node enterprise.'
      },
      {
        id: 'TRX-229104-5544',
        invoice_number: 'INV/2026/08/00188',
        customer_name: 'Siti Rahmawati',
        customer_email: 'siti.rahma@fintech-asia.id',
        customer_avatar: 'https://ui-avatars.com/api/?name=Siti+Rahma&background=EC4899&color=fff',
        item_name: 'Payment Gateway API Integration Addon',
        category: 'Addon & Plugin',
        platform: 'platform1',
        platform_name: 'Desktopalie Main',
        amount: 750000,
        fee: 2500,
        tax: 82500,
        total_amount: 835000,
        payment_method: 'GoPay',
        payment_channel: 'GoPay E-Wallet (08129844xxxx)',
        status: 'Sukses',
        created_at: '2026-08-18T19:10:00Z',
        paid_at: '2026-08-18T19:11:05Z',
        notes: 'Webhook otomatis terverifikasi.'
      },
      {
        id: 'TRX-118833-2211',
        invoice_number: 'INV/2026/08/00187',
        customer_name: 'Hendro Kusuma',
        customer_email: 'hendro.k@global-trade.co.id',
        customer_avatar: 'https://ui-avatars.com/api/?name=Hendro+Kusuma&background=0284C7&color=fff',
        item_name: 'Custom Domain SSL & Dedicated IP',
        category: 'Security & Network',
        platform: 'platform1',
        platform_name: 'Desktopalie Main',
        amount: 450000,
        fee: 4000,
        tax: 49500,
        total_amount: 503500,
        payment_method: 'BNI Virtual Account',
        payment_channel: 'BNI VA (988019284)',
        status: 'Gagal',
        created_at: '2026-08-18T16:00:00Z',
        paid_at: null,
        notes: 'Waktu pembayaran kadaluarsa (Expired session).'
      },
      {
        id: 'TRX-990142-6632',
        invoice_number: 'INV/2026/08/00186',
        customer_name: 'Maya Indah Permata',
        customer_email: 'maya.indah@creative-studio.com',
        customer_avatar: 'https://ui-avatars.com/api/?name=Maya+Indah&background=14B8A6&color=fff',
        item_name: 'Annual UI Component Pro Bundle',
        category: 'Design System',
        platform: 'platform1',
        platform_name: 'Desktopalie Main',
        amount: 1200000,
        fee: 3000,
        tax: 132000,
        total_amount: 1335000,
        payment_method: 'OVO',
        payment_channel: 'OVO E-Wallet (08569123xxxx)',
        status: 'Refund',
        created_at: '2026-08-18T14:12:00Z',
        paid_at: '2026-08-18T14:15:00Z',
        notes: 'Refund disetujui karena duplicate order oleh pelanggan.'
      },
      {
        id: 'TRX-884422-9901',
        invoice_number: 'INV/2026/08/00185',
        customer_name: 'Ahmad Fauzi',
        customer_email: 'fauzi.dev@techsolusi.id',
        customer_avatar: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=6366F1&color=fff',
        item_name: 'Developer Sandbox 12-Month Access',
        category: 'Development',
        platform: 'platform3',
        platform_name: 'Desktopalie Gamma',
        amount: 950000,
        fee: 2000,
        tax: 104500,
        total_amount: 1056500,
        payment_method: 'ShopeePay',
        payment_channel: 'ShopeePay (08138891xxxx)',
        status: 'Sukses',
        created_at: '2026-08-18T11:05:00Z',
        paid_at: '2026-08-18T11:06:40Z',
        notes: 'Aktivasi instan API Sandbox.'
      },
      {
        id: 'TRX-773311-5566',
        invoice_number: 'INV/2026/08/00184',
        customer_name: 'Dewi Lestari',
        customer_email: 'dewi.lestari@agri-corp.com',
        customer_avatar: 'https://ui-avatars.com/api/?name=Dewi+Lestari&background=84CC16&color=fff',
        item_name: 'Cold Storage IoT Telemetry Sensors',
        category: 'Logistics Fleet',
        platform: 'platform2',
        platform_name: 'Desktopalie Beta',
        amount: 2900000,
        fee: 5000,
        tax: 319000,
        total_amount: 3224000,
        payment_method: 'BCA Virtual Account',
        payment_channel: 'BCA VA (8077799102)',
        status: 'Pending',
        created_at: '2026-08-18T09:40:00Z',
        paid_at: null,
        notes: 'Menunggu transfer virtual account.'
      },
      {
        id: 'TRX-662200-4477',
        invoice_number: 'INV/2026/08/00183',
        customer_name: 'Bambang Soedarto',
        customer_email: 'bambang.s@maritim-log.id',
        customer_avatar: 'https://ui-avatars.com/api/?name=Bambang+S&background=F97316&color=fff',
        item_name: 'Fleet GPS Real-Time Dispatcher Pack',
        category: 'Logistics Fleet',
        platform: 'platform2',
        platform_name: 'Desktopalie Beta',
        amount: 3100000,
        fee: 4500,
        tax: 341000,
        total_amount: 3445500,
        payment_method: 'QRIS',
        payment_channel: 'QRIS Dinamis',
        status: 'Sukses',
        created_at: '2026-08-17T20:15:00Z',
        paid_at: '2026-08-17T20:18:22Z',
        notes: 'Perangkat GPS 20 unit.'
      },
      {
        id: 'TRX-551199-3388',
        invoice_number: 'INV/2026/08/00182',
        customer_name: 'Clara Natalie',
        customer_email: 'clara.natalie@media-vox.tv',
        customer_avatar: 'https://ui-avatars.com/api/?name=Clara+Natalie&background=A855F7&color=fff',
        item_name: 'Live Stream CDN Edge Caching 50TB',
        category: 'Streaming Engine',
        platform: 'platform3',
        platform_name: 'Desktopalie Gamma',
        amount: 8500000,
        fee: 0,
        tax: 935000,
        total_amount: 9435000,
        payment_method: 'Kartu Kredit',
        payment_channel: 'Mastercard World Elite (**** 9012)',
        status: 'Sukses',
        created_at: '2026-08-17T18:00:00Z',
        paid_at: '2026-08-17T18:02:11Z',
        notes: 'Auto-renewed streaming package.'
      },
      {
        id: 'TRX-440088-2299',
        invoice_number: 'INV/2026/08/00181',
        customer_name: 'Eko Prasetyo',
        customer_email: 'eko.p@delta-finance.org',
        customer_avatar: 'https://ui-avatars.com/api/?name=Eko+Prasetyo&background=06B6D4&color=fff',
        item_name: 'Enterprise Audit Trail & Ledger Sync',
        category: 'Enterprise ERP',
        platform: 'platform4',
        platform_name: 'Desktopalie Delta',
        amount: 5400000,
        fee: 6500,
        tax: 594000,
        total_amount: 6000500,
        payment_method: 'Mandiri Virtual Account',
        payment_channel: 'Mandiri VA (8899044219)',
        status: 'Sukses',
        created_at: '2026-08-17T15:20:00Z',
        paid_at: '2026-08-17T15:24:00Z',
        notes: 'Financial ledger backup setup.'
      },
      {
        id: 'TRX-339977-1100',
        invoice_number: 'INV/2026/08/00180',
        customer_name: 'Fitri Handayani',
        customer_email: 'fitri.h@retail-hub.co.id',
        customer_avatar: 'https://ui-avatars.com/api/?name=Fitri+Handayani&background=E11D48&color=fff',
        item_name: 'Omnichannel POS Terminal License',
        category: 'Cloud Infrastructure',
        platform: 'platform1',
        platform_name: 'Desktopalie Main',
        amount: 1650000,
        fee: 2500,
        tax: 181500,
        total_amount: 1834000,
        payment_method: 'GoPay',
        payment_channel: 'GoPay E-Wallet (08779912xxxx)',
        status: 'Gagal',
        created_at: '2026-08-17T12:00:00Z',
        paid_at: null,
        notes: 'Saldo e-wallet tidak mencukupi saat proses debit.'
      },
      {
        id: 'TRX-228866-0011',
        invoice_number: 'INV/2026/08/00179',
        customer_name: 'Gilang Ramadhan',
        customer_email: 'gilang.r@creative-tech.id',
        customer_avatar: 'https://ui-avatars.com/api/?name=Gilang+R&background=3B82F6&color=fff',
        item_name: 'Premium Design System UI Components',
        category: 'Design System',
        platform: 'platform1',
        platform_name: 'Desktopalie Main',
        amount: 890000,
        fee: 3000,
        tax: 97900,
        total_amount: 990900,
        payment_method: 'QRIS',
        payment_channel: 'QRIS Statis/Dinamis',
        status: 'Sukses',
        created_at: '2026-08-16T19:30:00Z',
        paid_at: '2026-08-16T19:31:45Z',
        notes: 'Single developer lifetime access.'
      },
      {
        id: 'TRX-117755-9922',
        invoice_number: 'INV/2026/08/00178',
        customer_name: 'Hadi Gunawan',
        customer_email: 'hadi.g@supplychain-id.com',
        customer_avatar: 'https://ui-avatars.com/api/?name=Hadi+Gunawan&background=10B981&color=fff',
        item_name: 'Multi-Warehouse Inventory Gateway',
        category: 'Logistics Fleet',
        platform: 'platform2',
        platform_name: 'Desktopalie Beta',
        amount: 4750000,
        fee: 5000,
        tax: 522500,
        total_amount: 5277500,
        payment_method: 'BCA Virtual Account',
        payment_channel: 'BCA VA (8077733491)',
        status: 'Sukses',
        created_at: '2026-08-16T14:10:00Z',
        paid_at: '2026-08-16T14:15:02Z',
        notes: 'Sinkronisasi 4 gudang cabang.'
      }
    ];

    localStorage.setItem(`desktopalie_transactions_${targetPlatform}`, JSON.stringify(defaultTransactions));
    return defaultTransactions;
  },

  async saveTransactions(transactions, platformId = null) {
    const targetPlatform = platformId || getCurrentPlatformId();
    const key = `transactions_${targetPlatform}`;

    localStorage.setItem(`desktopalie_transactions_${targetPlatform}`, JSON.stringify(transactions));
    localStorage.setItem('desktopalie_transactions', JSON.stringify(transactions));
    window.dispatchEvent(new Event('storage'));

    try {
      await this.saveSiteSetting(key, transactions);
    } catch (err) {
      console.warn('Supabase save transactions error:', err);
    }
    return transactions;
  },

  async updateTransactionStatus(transactionId, newStatus, platformId = null) {
    const transactions = await this.getTransactions(platformId);
    const updated = transactions.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          status: newStatus,
          paid_at: newStatus === 'Sukses' ? (t.paid_at || new Date().toISOString()) : t.paid_at
        };
      }
      return t;
    });
    await this.saveTransactions(updated, platformId);
    return updated;
  }
};
