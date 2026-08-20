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
      root.style.setProperty('--bg-main', '#05130E');
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
      root.style.setProperty('--bg-main', '#F0F6FF');
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
