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
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark' || localStorage.getItem('desktopalie_theme') === 'dark';

    if (isDark) {
      if (flavorId === 'platform1') {
        root.style.setProperty('--primary', '#10B981');
        root.style.setProperty('--primary-hover', '#059669');
        root.style.setProperty('--primary-light', 'rgba(16, 185, 129, 0.16)');
        root.style.setProperty('--color-primary', '#10B981');
        root.style.setProperty('--color-secondary', '#059669');
        root.style.setProperty('--color-accent', '#34D399');
      } else if (activeFlavor?.theme) {
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
      }
      root.style.setProperty('--bg-sidebar', '#091E16');
      root.style.setProperty('--bg-main', '#05130E');
    } else {
      if (flavorId === 'platform1') {
        root.style.setProperty('--primary', '#2563EB');
        root.style.setProperty('--primary-hover', '#1D4ED8');
        root.style.setProperty('--primary-light', '#EFF6FF');
        root.style.setProperty('--color-primary', '#2563EB');
        root.style.setProperty('--color-secondary', '#3B82F6');
        root.style.setProperty('--color-accent', '#60A5FA');
        root.style.setProperty('--bg-sidebar', '#FFFFFF');
        root.style.setProperty('--bg-main', '#F8FAFC');
      } else if (activeFlavor?.theme) {
        if (activeFlavor.theme.colorPrimary) {
          root.style.setProperty('--primary', activeFlavor.theme.colorPrimary);
          root.style.setProperty('--color-primary', activeFlavor.theme.colorPrimary);
          root.style.setProperty('--primary-light', '#EFF6FF');
        }

        if (activeFlavor.theme.colorSecondary) {
          root.style.setProperty('--primary-hover', activeFlavor.theme.colorSecondary);
          root.style.setProperty('--color-secondary', activeFlavor.theme.colorSecondary);
        }

        if (activeFlavor.theme.accent) {
          root.style.setProperty('--color-accent', activeFlavor.theme.accent);
        }

        root.style.setProperty('--bg-sidebar', '#FFFFFF');
        root.style.setProperty('--bg-main', '#F8FAFC');
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
