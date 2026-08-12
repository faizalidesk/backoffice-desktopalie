import React, { createContext, useContext, useEffect, useState } from 'react';
import { flavors, availableFlavors, getFlavor } from '../config';

const FlavorContext = createContext();

export const FlavorProvider = ({ children }) => {
  const [hasSelectedFlavor, setHasSelectedFlavor] = useState(() => {
    return Boolean(localStorage.getItem('desktopalie_flavor'));
  });

  const [flavorId, setFlavorId] = useState(() => {
    const saved = localStorage.getItem('desktopalie_flavor');
    if (saved && flavors[saved]) {
      return saved;
    }
    const envFlavor = import.meta.env.VITE_FLAVOR;
    return (envFlavor && flavors[envFlavor]) ? envFlavor : 'platform1';
  });

  const activeFlavor = getFlavor(flavorId);

  useEffect(() => {
    // 1. Set Document Title
    if (activeFlavor?.name) {
      document.title = activeFlavor.name;
    }

    // 2. Inject CSS Variables untuk Theme Flavor
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

      if (activeFlavor.theme.bgSidebar && activeFlavor.theme.bgSidebar !== 'default') {
        root.style.setProperty('--bg-sidebar', activeFlavor.theme.bgSidebar);
      }
    }
  }, [flavorId, activeFlavor]);

  const switchFlavor = (newFlavorId) => {
    if (flavors[newFlavorId]) {
      setFlavorId(newFlavorId);
      setHasSelectedFlavor(true);
      localStorage.setItem('desktopalie_flavor', newFlavorId);
    }
  };

  return (
    <FlavorContext.Provider value={{
      flavor: activeFlavor,
      activeFlavor,
      flavorId,
      hasSelectedFlavor,
      availableFlavors,
      switchFlavor
    }}>
      {children}
    </FlavorContext.Provider>
  );
};

export const useFlavor = () => {
  const context = useContext(FlavorContext);
  if (!context) {
    const defaultFlavor = getFlavor('platform1');
    return {
      flavor: defaultFlavor,
      activeFlavor: defaultFlavor,
      flavorId: 'platform1',
      availableFlavors,
      switchFlavor: () => {}
    };
  }
  return context;
};

export default FlavorContext;
