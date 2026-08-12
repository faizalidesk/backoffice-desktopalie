import React, { createContext, useContext, useEffect } from 'react';
import { activeFlavor } from '../config';

const FlavorContext = createContext(activeFlavor);

export const FlavorProvider = ({ children }) => {
  useEffect(() => {
    // Set Document Title
    if (activeFlavor?.name) {
      document.title = activeFlavor.name;
    }

    // Set Dynamic CSS Variables ke Root Element
    if (activeFlavor?.theme) {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', activeFlavor.theme.colorPrimary);
      root.style.setProperty('--color-secondary', activeFlavor.theme.colorSecondary);
      root.style.setProperty('--bg-sidebar', activeFlavor.theme.bgSidebar);
      root.style.setProperty('--color-accent', activeFlavor.theme.accent);
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
