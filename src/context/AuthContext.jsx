import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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

        // Jika profil ada dan role bukan Administrator/Admin, tolak login
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

      // Upsert profile dengan role Administrator
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
    <AuthContext.Provider value={{ user, session, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
