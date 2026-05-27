import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.89rockcuritiba.app',
  appName: "89 Fm Curitiba",
  webDir: 'www',
  server: {
    url: 'https://socialradio.lovable.app/app/89rockcuritiba?source=android',
    cleartext: false,
    androidScheme: 'https'
  },
  android: {
    backgroundColor: '#1a1a2e'
  }
};

export default config;
