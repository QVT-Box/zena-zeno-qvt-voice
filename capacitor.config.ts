import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ebb766ccdc124d64a580db96bef091f0',
  appName: 'zena-zeno-qvt-voice',
  webDir: 'dist',
  server: {
    url: 'https://ebb766cc-dc12-4d64-a580-db96bef091f0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
