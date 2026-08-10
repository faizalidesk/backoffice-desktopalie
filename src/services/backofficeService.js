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
    // Always save to LocalStorage first for instant reliability
    localStorage.setItem('desktopalie_maintenance_settings', JSON.stringify(settings));

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'maintenance',
          value: settings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.warn('Supabase site_settings error, saved to LocalStorage:', error.message);
      }
      return settings;
    } catch (err) {
      console.warn('Saved to LocalStorage fallback:', err);
      return settings;
    }
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
