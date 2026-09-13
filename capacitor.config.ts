/**
 * Capacitor configuration.
 * Keep this file independent from @capacitor/cli during the Next.js type-check;
 * the CLI is installed explicitly by the Android workflow before `cap add`.
 */
type WarHexCapacitorConfig = {
  appId: string;
  appName: string;
  webDir: string;
  server?: {
    url?: string;
    cleartext?: boolean;
  };
};

const config: WarHexCapacitorConfig = {
  appId: 'com.whxlabs.warhex',
  appName: 'WarHex',
  webDir: 'public',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://project-111111111.onrender.com',
    cleartext: false,
  },
};

export default config;
