import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('desktopalie_theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('desktopalie_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    const root = document.documentElement;
    const currentFlavor = localStorage.getItem('desktopalie_flavor') || 'platform1';

    if (isDarkMode) {
      if (currentFlavor === 'platform1') {
        root.style.setProperty('--primary', '#10B981');
        root.style.setProperty('--primary-hover', '#059669');
        root.style.setProperty('--primary-light', 'rgba(16, 185, 129, 0.16)');
        root.style.setProperty('--color-primary', '#10B981');
        root.style.setProperty('--color-secondary', '#059669');
        root.style.setProperty('--color-accent', '#34D399');
      }
      root.style.setProperty('--bg-sidebar', '#042014');
      root.style.setProperty('--bg-sidebar-hover', 'rgba(16, 185, 129, 0.12)');
      root.style.setProperty('--bg-sidebar-active', '#10B981');
      root.style.setProperty('--border-sidebar', 'rgba(52, 211, 153, 0.16)');
      root.style.setProperty('--text-sidebar-main', '#ECFDF5');
      root.style.setProperty('--text-sidebar-muted', '#A7F3D0');
      root.style.setProperty('--text-sidebar-subtle', '#34D399');
      root.style.setProperty('--bg-main', '#05130E');
      root.style.setProperty('--bg-card', '#091E16');
      root.style.setProperty('--bg-card-hover', '#0F2B20');
      root.style.setProperty('--border-color', '#133829');
      root.style.setProperty('--border-highlight', '#1B4F3B');
      root.style.setProperty('--text-main', '#ECFDF5');
      root.style.setProperty('--text-muted', '#93C5AA');
      root.style.setProperty('--text-subtle', '#58836F');
    } else {
      if (currentFlavor === 'platform1') {
        root.style.setProperty('--primary', '#2563EB');
        root.style.setProperty('--primary-hover', '#1D4ED8');
        root.style.setProperty('--primary-light', '#EFF6FF');
        root.style.setProperty('--color-primary', '#2563EB');
        root.style.setProperty('--color-secondary', '#3B82F6');
        root.style.setProperty('--color-accent', '#60A5FA');
      }
      root.style.setProperty('--bg-sidebar', '#0F3574');
      root.style.setProperty('--bg-sidebar-hover', 'rgba(255, 255, 255, 0.08)');
      root.style.setProperty('--bg-sidebar-active', '#2563EB');
      root.style.setProperty('--border-sidebar', 'rgba(255, 255, 255, 0.12)');
      root.style.setProperty('--text-sidebar-main', '#FFFFFF');
      root.style.setProperty('--text-sidebar-muted', '#BFDBFE');
      root.style.setProperty('--text-sidebar-subtle', '#60A5FA');
      root.style.setProperty('--bg-main', '#F0F6FF');
      root.style.setProperty('--bg-card', '#FFFFFF');
      root.style.setProperty('--bg-card-hover', '#F8FAFC');
      root.style.setProperty('--border-color', '#E2E8F0');
      root.style.setProperty('--border-highlight', '#CBD5E1');
      root.style.setProperty('--text-main', '#0F172A');
      root.style.setProperty('--text-muted', '#64748B');
      root.style.setProperty('--text-subtle', '#94A3B8');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
