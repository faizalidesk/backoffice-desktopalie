import { supabase } from '../lib/supabase';

export const backofficeService = {
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
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
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
    const { data, error } = await supabase
      .from('experiments')
      .insert([experiment])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateExperiment(id, updates) {
    const { data, error } = await supabase
      .from('experiments')
      .update(updates)
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
    const { data, error } = await supabase
      .from('notes')
      .insert([note])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateNote(id, updates) {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
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
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([bookmark])
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
