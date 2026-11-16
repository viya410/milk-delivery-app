import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.milkdelivery.app',
  appName: 'Milk Delivery',
  webDir: 'dist/milk-delivery-app/browser',
  server: {
    androidScheme: 'https',
  },
};

export default config;
