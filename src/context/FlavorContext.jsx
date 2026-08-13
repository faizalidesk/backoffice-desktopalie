import React, { createContext, useContext, useEffect, useState } from 'react';
import { flavors, availableFlavors, subPlatformFlavors, mainFlavor, getFlavor } from '../config';

const FlavorContext = createContext();

const detectPlatformFromHostname = () => {
  if (typeof window === 'undefined') return null;
  const hostname = window.location.hostname.toLowerCase();

  if (hostname.includes('beta.')) return 'platform2';
  if (hostname.includes('gamma.')) return 'platform3';
  if (hostname.includes('delta.')) return 'platform4';

  return null;
};

export const FlavorProvider = ({ children }) => {
  const [hasSelectedFlavor, setHasSelectedFlavor] = useState(true);

  const [flavorId, setFlavorId] = useState(() => {
    // 1. Check if explicitly on sub-platform subdomain (e.g. beta, gamma, delta)
    const hostnameFlavor = detectPlatformFromHostname();
    if (hostnameFlavor && flavors[hostnameFlavor]) {
      return hostnameFlavor;
    }

    // 2. Check saved localStorage selection (retains active flavor on refresh in backoffice)
    const saved = localStorage.getItem('desktopalie_flavor');
    if (saved && flavors[saved]) {
      return saved;
    }

    // 3. Default fallback
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
