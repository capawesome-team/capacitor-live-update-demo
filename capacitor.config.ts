import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'capacitor-live-update-demo',
  webDir: 'www',
  plugins: {
    LiveUpdate: {
      appId: 'c6dd52ad-c8e9-49cd-bc63-c516d601f17f',
    }
  }
};

export default config;
