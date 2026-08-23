import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts,
} from "@expo-google-fonts/outfit";
import * as SecureStore from "expo-secure-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  ThemeProvider,
  ToastProvider,
  defaultThemes,
  type ColorSchemePreference,
  type Theme,
  type ThemeStorage,
} from "@masumdev/rn-ui";

const THEME_STORAGE_KEY = "rn_ui_theme_preference_v1";

const customDarkTheme: Theme = {
  ...defaultThemes.dark,
  colors: {
    ...defaultThemes.dark.colors,
    background: "#05161E",
    backgroundMuted: "#0B202A",
    backgroundSubtle: "#122B37",
    surface: "#0B202A",
    surfaceRaised: "#122B37",
    surfaceMuted: "#071B24",
    border: "rgba(242, 251, 253, 0.16)",
    borderMuted: "rgba(242, 251, 253, 0.08)",
    divider: "rgba(242, 251, 253, 0.16)",
    input: "#0B202A",
  },
};

const appThemes = {
  light: defaultThemes.light,
  dark: customDarkTheme,
};

const themeStorage: ThemeStorage = {
  getItem: (key: string) => {
    if (Platform.OS === "web") {
      try {
        return Promise.resolve(
          typeof window !== "undefined" ? localStorage.getItem(key) : null,
        );
      } catch {
        return Promise.resolve(null);
      }
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === "web") {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(key, value);
        }
        return Promise.resolve();
      } catch {
        return Promise.resolve();
      }
    }
    return SecureStore.setItemAsync(key, value);
  },
};

const isColorSchemePreference = (
  value: string | null,
): value is ColorSchemePreference =>
  value === "light" || value === "dark" || value === "system";

const AppLayout = () => {
  const [colorScheme, setColorSchemeState] =
    React.useState<ColorSchemePreference>("system");
  const [themeLoaded, setThemeLoaded] = React.useState(false);
  const [loaded, error] = useFonts({
    OutfitRegular: Outfit_400Regular,
    OutfitMedium: Outfit_500Medium,
    OutfitSemiBold: Outfit_600SemiBold,
    OutfitBold: Outfit_700Bold,
  });

  React.useEffect(() => {
    themeStorage
      .getItem(THEME_STORAGE_KEY)
      .then((saved) => {
        if (isColorSchemePreference(saved)) {
          setColorSchemeState(saved);
        }
      })
      .catch((err) => {
        console.error("Theme load error:", err);
      })
      .finally(() => {
        setThemeLoaded(true);
      });
  }, []);

  const handleColorSchemeChange = React.useCallback(
    (next: ColorSchemePreference) => {
      setColorSchemeState(next);
      themeStorage.setItem(THEME_STORAGE_KEY, next).catch((err) => {
        console.error("Theme save error:", err);
      });
    },
    [],
  );

  if ((!loaded && !error) || !themeLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider
        colorScheme={colorScheme}
        defaultColorScheme="system"
        themes={appThemes}
        storage={themeStorage}
        storageKey={THEME_STORAGE_KEY}
        onColorSchemeChange={handleColorSchemeChange}
      >
        <ToastProvider placement="bottom">
          <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </BottomSheetModalProvider>
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default AppLayout;
