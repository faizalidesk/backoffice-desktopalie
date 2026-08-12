import React, { createContext, useContext, useEffect } from 'react';
import { activeFlavor } from '../config';

const FlavorContext = createContext(activeFlavor);

export const FlavorProvider = ({ children }) => {
  useEffect(() => {
    // Set Document Title
    if (activeFlavor?.name) {
      document.title = activeFlavor.name;
    }

    // Inject CSS Variables untuk Theme Flavor
    if (activeFlavor?.theme) {
      const root = document.documentElement;

      if (activeFlavor.theme.colorPrimary) {
        root.style.setProperty('--primary', activeFlavor.theme.colorPrimary);
        root.style.setProperty('--color-primary', activeFlavor.theme.colorPrimary);
      }

      if (activeFlavor.theme.colorSecondary) {
        root.style.setProperty('--primary-hover', activeFlavor.theme.colorSecondary);
        root.style.setProperty('--color-secondary', activeFlavor.theme.colorSecondary);
      }

      if (activeFlavor.theme.accent) {
        root.style.setProperty('--color-accent', activeFlavor.theme.accent);
      }

      // Hanya set --bg-sidebar jika ditentukan secara spesifik dan tidak mengganggu light mode
      if (activeFlavor.theme.bgSidebar && activeFlavor.theme.bgSidebar !== 'default') {
        root.style.setProperty('--bg-sidebar', activeFlavor.theme.bgSidebar);
      }
    }
  }, []);

  return (
    <FlavorContext.Provider value={activeFlavor}>
      {children}
    </FlavorContext.Provider>
  );
};

export const useFlavor = () => {
  const context = useContext(FlavorContext);
  if (!context) {
    return activeFlavor;
  }
  return context;
};

export default FlavorContext;
