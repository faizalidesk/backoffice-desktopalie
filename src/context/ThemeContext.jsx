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
        root.style.setProperty('--primary', '#4F46E5');
        root.style.setProperty('--primary-hover', '#4338CA');
        root.style.setProperty('--primary-light', '#EEF2FF');
        root.style.setProperty('--color-primary', '#4F46E5');
        root.style.setProperty('--color-secondary', '#6366F1');
        root.style.setProperty('--color-accent', '#818CF8');
      }
      root.style.setProperty('--bg-sidebar', '#1E1B4B');
      root.style.setProperty('--bg-main', '#F5F3FF');
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
