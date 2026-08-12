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

  // MAINTENANCE SETTINGS
  async getMaintenanceSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'maintenance')
        .maybeSingle();

      if (data?.value) {
        let val = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
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
          // Update DB record to English permanently
          supabase.from('site_settings').upsert({ key: 'maintenance', value: val, updated_at: new Date().toISOString() }, { onConflict: 'key' }).then(() => {});
        }

        return val;
      }
    } catch (err) {
      console.warn('Supabase site_settings table not accessible:', err);
    }

    const localData = localStorage.getItem('desktopalie_maintenance_settings');
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
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('platform_id', targetPlatform)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase todos table error, reading fallback:', err);
    }

    const localData = localStorage.getItem(`desktopalie_todos_fallback_${targetPlatform}`);
    if (localData) {
      try {
        return JSON.parse(localData);
      } catch (e) {}
    }

    return [];
  },

  async createTodo(todo) {
    const { data: { user } } = await supabase.auth.getUser();
    const targetPlatform = todo.platform_id || getCurrentPlatformId();
    const payload = {
      id: crypto.randomUUID(),
      platform_id: targetPlatform,
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

    const currentLocal = JSON.parse(localStorage.getItem(`desktopalie_todos_fallback_${targetPlatform}`) || '[]');
    const updated = [payload, ...currentLocal];
    localStorage.setItem(`desktopalie_todos_fallback_${targetPlatform}`, JSON.stringify(updated));
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
