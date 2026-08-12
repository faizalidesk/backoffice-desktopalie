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

// Ambil mode flavor dari VITE_FLAVOR atau fallback ke platform1
const rawFlavor = import.meta.env.VITE_FLAVOR || 'platform1';
export const activeFlavorKey = flavors[rawFlavor] ? rawFlavor : 'platform1';
export const activeFlavor = flavors[activeFlavorKey];

export default activeFlavor;
