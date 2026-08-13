import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { backofficeService } from '../services/backofficeService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUserToMembershipRegistry = async (authUser) => {
    if (!authUser || !authUser.id) return;
    try {
      const meta = authUser.user_metadata || {};
      const fullName = meta.full_name || meta.name || authUser.email?.split('@')[0] || 'User Member';
      const avatarUrl = meta.avatar_url || meta.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.email || 'User')}`;
      const provider = authUser.app_metadata?.provider === 'google' ? 'Google OAuth 2.0' : 'Email & Password';

      const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
      let platform = 'platform1';
      let platformName = 'Desktopalie Main';

      if (hostname.includes('beta.') || (typeof window !== 'undefined' && window.location.pathname.startsWith('/beta'))) {
        platform = 'platform2';
        platformName = 'Desktopalie Beta';
      } else if (hostname.includes('gamma.') || (typeof window !== 'undefined' && window.location.pathname.startsWith('/gamma'))) {
        platform = 'platform3';
        platformName = 'Desktopalie Gamma';
      } else if (hostname.includes('delta.') || (typeof window !== 'undefined' && window.location.pathname.startsWith('/delta'))) {
        platform = 'platform4';
        platformName = 'Desktopalie Delta';
      }

      const memberPayload = {
        id: authUser.id,
        email: authUser.email,
        full_name: fullName,
        avatar_url: avatarUrl,
        provider: provider,
        platform: platform,
        platformName: platformName,
        role: 'Member',
        status: 'Active',
        created_at: authUser.created_at || new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      // 1. Save to local storage registry
      const localKey = `desktopalie_member_${authUser.id}`;
      localStorage.setItem(localKey, JSON.stringify(memberPayload));
      
      const registryStr = localStorage.getItem('desktopalie_members_registry');
      let registry = registryStr ? JSON.parse(registryStr) : [];
      const existingIdx = registry.findIndex(m => m.id === authUser.id || m.email === authUser.email);
      if (existingIdx >= 0) {
        registry[existingIdx] = { ...registry[existingIdx], ...memberPayload };
      } else {
        registry.unshift(memberPayload);
      }
      localStorage.setItem('desktopalie_members_registry', JSON.stringify(registry));
      window.dispatchEvent(new Event('storage'));

      // 2. Persist to site_settings table
      await backofficeService.saveSiteSetting(`member_${authUser.id}`, memberPayload);

      // 3. Upsert clean columns to profiles table
      await supabase.from('profiles').upsert([{
        id: authUser.id,
        full_name: fullName,
        avatar_url: avatarUrl,
        role: 'Member',
        updated_at: new Date().toISOString()
      }], { onConflict: 'id' });
    } catch (err) {
      console.warn('Sync User Membership Warning:', err);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        syncUserToMembershipRegistry(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          syncUserToMembershipRegistry(session.user);
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
