import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * Set EXPO_PUBLIC_APP_URL in mobile/.env (e.g. http://192.168.1.5:5000).
 * Emulator: Android http://10.0.2.2:5000, iOS simulator http://localhost:5000
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Chatsystem",
  slug: "chatsystem-mobile",
  extra: {
    appUrl: process.env.EXPO_PUBLIC_APP_URL ?? "",
  },
  android: {
    ...config.android,
    // LAN HTTP for dev; valid in app.json, types may omit it
    ...({ usesCleartextTraffic: true } as Record<string, unknown>),
  },
  ios: {
    ...config.ios,
    infoPlist: {
      ...((config.ios as { infoPlist?: Record<string, unknown> })?.infoPlist ??
        {}),
      NSAppTransportSecurity: {
        NSAllowsLocalNetworking: true,
      },
    },
  },
});
