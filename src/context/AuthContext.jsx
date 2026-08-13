import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { backofficeService } from '../services/backofficeService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncGoogleUserToDatabase = async (authUser) => {
    if (!authUser || !authUser.id) return;
    try {
      const meta = authUser.user_metadata || {};
      const fullName = meta.full_name || meta.name || authUser.email?.split('@')[0] || 'Google User';
      const avatarUrl = meta.avatar_url || meta.picture || '';

      const profilePayload = {
        id: authUser.id,
        full_name: fullName,
        username: authUser.email ? authUser.email.split('@')[0] : 'user',
        avatar_url: avatarUrl,
        bio: 'Google Authenticated User',
        location: 'Indonesia',
        website: '',
        updated_at: new Date().toISOString()
      };

      // 1. Store in localStorage
      const localKey = `desktopalie_profile_${authUser.id}`;
      localStorage.setItem(localKey, JSON.stringify(profilePayload));
      localStorage.setItem('desktopalie_profile', JSON.stringify(profilePayload));
      window.dispatchEvent(new Event('storage'));

      // 2. Persist full JSON to site_settings table
      await backofficeService.saveSiteSetting(`profile_${authUser.id}`, profilePayload);

      // 3. Upsert clean columns to profiles table
      await supabase.from('profiles').upsert([{
        id: authUser.id,
        full_name: fullName,
        avatar_url: avatarUrl,
        role: 'Administrator',
        updated_at: new Date().toISOString()
      }], { onConflict: 'id' });
    } catch (err) {
      console.warn('Sync Google User Profile Warning:', err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        syncGoogleUserToDatabase(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          syncGoogleUserToDatabase(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async (customRedirectPath = '') => {
    try {
      let redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}${customRedirectPath}` : undefined;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      return data;
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.toString().includes('Failed to fetch')) {
        throw new Error('Gagal menghubungkan ke Supabase. Pastikan VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY sudah terkonfigurasi!');
      }
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Validasi Role di tabel profiles
      if (data?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile && profile.role && !['Administrator', 'Admin'].includes(profile.role)) {
          await supabase.auth.signOut();
          throw new Error('Akses Ditolak: Akun Anda terdaftar sebagai Pengguna Biasa, bukan Administrator Backoffice.');
        }
      }

      return data;
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.toString().includes('Failed to fetch')) {
        throw new Error('Gagal menghubungkan ke Supabase (Failed to fetch). Pastikan VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY sudah ditambahkan di Vercel Environment Variables dan sudah di-Redeploy!');
      }
      throw err;
    }
  };

  const register = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'Administrator',
          },
        },
      });
      if (error) throw error;

      if (data?.user?.id) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: fullName,
          role: 'Administrator',
          updated_at: new Date().toISOString(),
        });
      }

      return data;
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.toString().includes('Failed to fetch')) {
        throw new Error('Gagal menghubungkan ke Supabase (Failed to fetch). Pastikan VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY sudah ditambahkan di Vercel Environment Variables dan sudah di-Redeploy!');
      }
      throw err;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
