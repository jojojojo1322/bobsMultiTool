export interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  icon: string;
}

export type DeviceType = 'iPhone_15' | 'iPhone_SE' | 'Galaxy_S24' | 'iPad' | 'iPad_Pro' | 'Laptop' | 'Desktop' | 'Desktop_4K' | 'Custom';

export const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  iPhone_15: {
    name: 'iPhone 15',
    width: 393,
    height: 852,
    icon: '📱'
  },
  iPhone_SE: {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    icon: '📱'
  },
  Galaxy_S24: {
    name: 'Galaxy S24',
    width: 384,
    height: 854,
    icon: '📱'
  },
  iPad: {
    name: 'iPad',
    width: 768,
    height: 1024,
    icon: '📱'
  },
  iPad_Pro: {
    name: 'iPad Pro',
    width: 1024,
    height: 1366,
    icon: '📱'
  },
  Laptop: {
    name: 'Laptop',
    width: 1366,
    height: 768,
    icon: '💻'
  },
  Desktop: {
    name: 'Desktop',
    width: 1920,
    height: 1080,
    icon: '💻'
  },
  Desktop_4K: {
    name: '4K Desktop',
    width: 3840,
    height: 2160,
    icon: '🖥️'
  },
  Custom: {
    name: 'Custom',
    width: 800,
    height: 600,
    icon: '⚙️'
  }
}; 