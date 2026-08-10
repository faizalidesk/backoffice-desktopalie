import { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  id: {
    // Navigation
    dashboard: 'Dashboard Overview',
    todos: 'To-Do & Board QA',
    documentation: 'Dokumentasi System',
    landingManager: 'Landing Page Manager',
    projects: 'Projects Manager',
    experiments: 'Experiments Lab',
    notes: 'Catatan & Jurnal',
    bookmarks: 'Bookmarks',
    maintenance: 'Mode Pemeliharaan',
    profile: 'Profil & Pengaturan',
    
    // Header & Controls
    lightMode: 'Mode Terang',
    darkMode: 'Mode Gelap',
    language: 'Bahasa',
    indonesian: 'Bahasa Indonesia 🇮🇩',
    english: 'English 🇬🇧',
    viewWebsite: 'Buka Website Utama',
    signOut: 'Keluar (Sign Out)',
    
    // Settings Page
    accountSettings: 'Pengaturan Akun & Profil',
    subtitleSettings: 'Kelola profil publik, preferensi bahasa, dan informasi pengembang Anda.',
    langPreference: 'Preferensi Bahasa Aplikasi',
    langSubtitle: 'Pilih bahasa tampilan untuk antarmuka Backoffice Workspace.',
    fullName: 'Nama Lengkap',
    username: 'Nama Pengguna (Username)',
    shortBio: 'Bio Singkat',
    location: 'Lokasi',
    portfolioWebsite: 'Website Portofolio',
    saveChanges: 'Simpan Perubahan',
    saving: 'Menyimpan...',
    profileUpdated: 'Profil berhasil diperbarui!',
    profileFailed: 'Gagal memperbarui profil',

    // Dashboard
    welcomeTitle: 'Selamat Datang Kembali, Administrator Workspace 👋',
    welcomeSubtitle: 'Kelola seluruh portofolio publik, pembaruan konten landing page, papan tugas sprint QA, serta dokumentasi sistem dalam satu kontrol terpusat.',
    realtimeSynced: 'Ekosistem Real-Time Synced'
  },
  en: {
    // Navigation
    dashboard: 'Dashboard Overview',
    todos: 'To-Do & Board QA',
    documentation: 'System Documentation',
    landingManager: 'Landing Page Manager',
    projects: 'Projects Manager',
    experiments: 'Experiments Lab',
    notes: 'Notes & Journal',
    bookmarks: 'Bookmarks',
    maintenance: 'Maintenance Mode',
    profile: 'Profile & Settings',
    
    // Header & Controls
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
    indonesian: 'Bahasa Indonesia 🇮🇩',
    english: 'English 🇬🇧',
    viewWebsite: 'View Main Website',
    signOut: 'Sign Out',
    
    // Settings Page
    accountSettings: 'Account & Profile Settings',
    subtitleSettings: 'Manage your public profile, language preferences, and developer details.',
    langPreference: 'Application Language Preference',
    langSubtitle: 'Choose your preferred display language for the Backoffice Workspace interface.',
    fullName: 'Full Name',
    username: 'Username',
    shortBio: 'Short Bio',
    location: 'Location',
    portfolioWebsite: 'Portfolio Website',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    profileUpdated: 'Profile updated successfully!',
    profileFailed: 'Failed to update profile',

    // Dashboard
    welcomeTitle: 'Welcome Back, Workspace Administrator 👋',
    welcomeSubtitle: 'Manage your public portfolio, landing page updates, QA sprint tasks, and system documentation in one centralized workspace.',
    realtimeSynced: 'Real-Time Synced Ecosystem'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('desktopalie_language');
    return saved || 'id'; // Default to Indonesian per request
  });

  const setLanguage = (lang) => {
    if (lang === 'id' || lang === 'en') {
      setLanguageState(lang);
      localStorage.setItem('desktopalie_language', lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['id']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
