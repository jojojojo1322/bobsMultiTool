export interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  icon: string;
}

export type DeviceType = 'iPhone' | 'iPad' | 'Desktop';

export const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  iPhone: {
    name: 'iPhone',
    width: 390,
    height: 844,
    icon: '📱'
  },
  iPad: {
    name: 'iPad',
    width: 768,
    height: 1024,
    icon: '📱'
  },
  Desktop: {
    name: 'Desktop',
    width: 1280,
    height: 800,
    icon: '💻'
  }
}; 