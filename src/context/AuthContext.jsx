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
          },
        },
      });
      if (error) throw error;
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
