import "@/clientExtend";
import { AuthProvider } from "@/context/AuthContext";
import { Colors } from "@/constants/theme";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

const RootLayoutNav = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
};

const fontConfig = {
  ios: {
    regular: {
      fontFamily: "system-ui",
      fontWeight: "normal" as "normal",
    },
    medium: {
      fontFamily: "system-ui",
      fontWeight: "500" as "500",
    },
    bold: {
      fontFamily: "system-ui",
      fontWeight: "bold" as "bold",
    },
    heavy: {
      fontFamily: "system-ui",
      fontWeight: "900" as "900",
    },
  },
  android: {
    regular: {
      fontFamily: "sans-serif",
      fontWeight: "normal" as "normal",
    },
    medium: {
      fontFamily: "sans-serif-medium",
      fontWeight: "normal" as "normal",
    },
    bold: {
      fontFamily: "sans-serif",
      fontWeight: "bold" as "bold",
    },
    heavy: {
      fontFamily: "sans-serif-black",
      fontWeight: "normal" as "normal",
    },
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const theme =
    colorScheme === "dark"
      ? {
          ...MD3DarkTheme,
          ...NavigationDarkTheme,
          colors: Colors.dark,
          fonts: configureFonts({ config: fontConfig, isV3: true }),
        }
      : {
          ...MD3LightTheme,
          ...NavigationDefaultTheme,
          colors: Colors.light,
          fonts: configureFonts({ config: fontConfig, isV3: true }),
        };

  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <ThemeProvider value={theme}>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
