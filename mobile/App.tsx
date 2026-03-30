import { useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function resolveAppUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_APP_URL;
  if (fromEnv?.length) return fromEnv;
  const extra = Constants.expoConfig?.extra as { appUrl?: string } | undefined;
  if (extra?.appUrl?.length) return extra.appUrl;
  return "";
}

function AppBody() {
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const url = resolveAppUrl();

  if (!url) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Point the app at your dev server</Text>
        <Text style={styles.hint}>
          Add mobile/.env with:{"\n\n"}
          EXPO_PUBLIC_APP_URL=http://YOUR_PC_LAN_IP:5000{"\n\n"}
          Then run npm run dev in the project root and start Expo again.{"\n\n"}
          Android emulator: http://10.0.2.2:5000{"\n"}
          iOS simulator: http://localhost:5000
        </Text>
        <StatusBar barStyle="dark-content" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.fill} edges={["top"]}>
      <WebView
        source={{ uri: url }}
        onLoadStart={() => {
          setLoading(true);
          setLoadProgress(0);
        }}
        onLoadProgress={({ nativeEvent }) => {
          setLoadProgress(nativeEvent.progress);
        }}
        onLoadEnd={() => {
          setLoading(false);
          setLoadProgress(1);
        }}
        onError={() => setLoading(false)}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        cacheEnabled
        androidLayerType="hardware"
      />
      {loading ? (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator size="large" />
          <Text style={styles.progressLabel}>
            {loadProgress > 0 && loadProgress < 1
              ? `${Math.round(loadProgress * 100)}%`
              : "Loading…"}
          </Text>
          <Text style={styles.progressHint}>
            First open after starting the dev server can take a bit while Vite
            compiles. Open the same URL once in your PC browser to warm it up.
          </Text>
        </View>
      ) : null}
      <StatusBar barStyle="dark-content" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppBody />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  hint: {
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },
  fill: {
    flex: 1,
    backgroundColor: "#fff",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    paddingHorizontal: 24,
  },
  progressLabel: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  progressHint: {
    marginTop: 12,
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 320,
  },
});
