import React, { createContext, useContext, useEffect, useState } from 'react';
import { flavors, availableFlavors, subPlatformFlavors, mainFlavor, getFlavor } from '../config';

const FlavorContext = createContext();

const detectPlatformFromHostname = () => {
  if (typeof window === 'undefined') return 'platform1';
  const hostname = window.location.hostname.toLowerCase();

  if (hostname.includes('beta.')) return 'platform2';
  if (hostname.includes('gamma.')) return 'platform3';
  if (hostname.includes('delta.')) return 'platform4';

  // For back.desktopalie.my.id, main domain or default, lock to platform1 (Desktopalie Main)
  if (hostname.includes('back.') || hostname.includes('desktopalie.my.id')) {
    return 'platform1';
  }

  return 'platform1';
};

export const FlavorProvider = ({ children }) => {
  const [hasSelectedFlavor, setHasSelectedFlavor] = useState(true);

  const [flavorId, setFlavorId] = useState(() => {
    // 1. Detect platform automatically from domain URL (e.g. back.desktopalie.my.id -> platform1)
    const hostnameFlavor = detectPlatformFromHostname();
    if (hostnameFlavor && flavors[hostnameFlavor]) {
      return hostnameFlavor;
    }

    // 2. Fallback to localStorage saved selection
    const saved = localStorage.getItem('desktopalie_flavor');
    if (saved && flavors[saved]) {
      return saved;
    }

    return 'platform1';
  });

  const activeFlavor = getFlavor(flavorId);
  const isMainDesktopalie = flavorId === 'platform1';

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

  const resetToMainFlavor = () => {
    switchFlavor('platform1');
  };

  return (
    <FlavorContext.Provider value={{
      flavor: activeFlavor,
      activeFlavor,
      flavorId,
      hasSelectedFlavor,
      availableFlavors,
      subPlatformFlavors,
      mainFlavor,
      isMainDesktopalie,
      switchFlavor,
      resetToMainFlavor
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
      subPlatformFlavors,
      mainFlavor,
      isMainDesktopalie: true,
      switchFlavor: () => {},
      resetToMainFlavor: () => {}
    };
  }
  return context;
};

export default FlavorContext;
