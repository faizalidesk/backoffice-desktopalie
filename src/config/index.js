import platform1 from './flavors/platform1';
import platform2 from './flavors/platform2';
import platform3 from './flavors/platform3';
import platform4 from './flavors/platform4';

export const flavors = {
  platform1,
  platform2,
  platform3,
  platform4,
};

export const mainFlavor = platform1;

export const availableFlavors = [
  platform1,
  platform2,
  platform3,
  platform4,
];

// Sub-platform switcher excludes Desktopalie Main (platform1)
export const subPlatformFlavors = [
  platform2,
  platform3,
  platform4,
];

export const getFlavor = (flavorId) => {
  return flavors[flavorId] || platform1;
};

// Ambil mode flavor default dari env atau fallback
const rawFlavor = import.meta.env.VITE_FLAVOR || 'platform1';
export const activeFlavorKey = flavors[rawFlavor] ? rawFlavor : 'platform1';
export const activeFlavor = flavors[activeFlavorKey];

export default activeFlavor;
