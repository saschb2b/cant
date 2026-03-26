import type { DevicePreset } from "./types";

export const DEVICE_PRESETS: DevicePreset[] = [
  // Phones
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    category: "phone",
    width: 393,
    height: 852,
  },
  {
    id: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    category: "phone",
    width: 430,
    height: 932,
  },
  {
    id: "iphone-se",
    name: "iPhone SE",
    category: "phone",
    width: 375,
    height: 667,
  },
  {
    id: "pixel-8",
    name: "Pixel 8",
    category: "phone",
    width: 412,
    height: 915,
  },
  {
    id: "pixel-8-pro",
    name: "Pixel 8 Pro",
    category: "phone",
    width: 448,
    height: 998,
  },
  {
    id: "galaxy-s24",
    name: "Galaxy S24",
    category: "phone",
    width: 360,
    height: 780,
  },
  {
    id: "galaxy-s24-ultra",
    name: "Galaxy S24 Ultra",
    category: "phone",
    width: 384,
    height: 824,
  },
  // Tablets
  {
    id: "ipad-pro-12-9",
    name: 'iPad Pro 12.9"',
    category: "tablet",
    width: 1024,
    height: 1366,
  },
  {
    id: "ipad-pro-11",
    name: 'iPad Pro 11"',
    category: "tablet",
    width: 834,
    height: 1194,
  },
  {
    id: "ipad-mini",
    name: "iPad Mini",
    category: "tablet",
    width: 744,
    height: 1133,
  },
  {
    id: "ipad-air",
    name: "iPad Air",
    category: "tablet",
    width: 820,
    height: 1180,
  },
  {
    id: "galaxy-tab-s9",
    name: "Galaxy Tab S9",
    category: "tablet",
    width: 800,
    height: 1280,
  },
  // Desktops
  {
    id: "macbook-14",
    name: 'MacBook Pro 14"',
    category: "desktop",
    width: 1512,
    height: 982,
  },
  {
    id: "macbook-16",
    name: 'MacBook Pro 16"',
    category: "desktop",
    width: 1728,
    height: 1117,
  },
  {
    id: "macbook-air-13",
    name: 'MacBook Air 13"',
    category: "desktop",
    width: 1470,
    height: 956,
  },
  {
    id: "desktop-1080p",
    name: "Desktop 1080p",
    category: "desktop",
    width: 1920,
    height: 1080,
  },
  {
    id: "desktop-1440p",
    name: "Desktop 1440p",
    category: "desktop",
    width: 2560,
    height: 1440,
  },
  {
    id: "desktop-4k",
    name: "Desktop 4K",
    category: "desktop",
    width: 3840,
    height: 2160,
  },
];

export const getDeviceById = (id: string): DevicePreset | undefined => {
  return DEVICE_PRESETS.find((d) => d.id === id);
};

export const getDevicesByCategory = (
  category: DevicePreset["category"],
): DevicePreset[] => {
  return DEVICE_PRESETS.filter((d) => d.category === category);
};

export const createCustomDevice = (
  width: number,
  height: number,
  name?: string,
): DevicePreset => ({
  id: `custom-${String(Date.now())}`,
  name: name ?? `Custom ${String(width)}x${String(height)}`,
  category: "custom",
  width,
  height,
});
