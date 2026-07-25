import React from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import {
  ThemeProvider,
  ToastProvider,
  type ColorSchemePreference,
  type ThemeInput,
  type ThemeStorage,
} from "@masumdev/rn-ui";
import * as SecureStore from "expo-secure-store";

const THEME_STORAGE_KEY = "rn-ui-color-scheme";
const ENABLE_THEME_DEBUG_LOGS = true;
const appThemeFonts = {
  regular: "OutfitRegular",
  medium: "OutfitMedium",
  semibold: "OutfitSemiBold",
  bold: "OutfitBold",
};
const appThemes: { light: ThemeInput; dark: ThemeInput } = {
  light: {
    fonts: appThemeFonts,
    colors: {
      background: "#F6FBFC",
      backgroundMuted: "#ECF7F9",
      backgroundSubtle: "#D8EEF3",
      surface: "#FFFFFF",
      surfaceRaised: "#FFFFFF",
      surfaceMuted: "#F0FAFC",
      text: "#06202A",
      textMuted: "#476371",
      textSubtle: "#8AA0AA",
      textInverse: "#F8FAFC",
      primary: "#06B6D4",
      primarySoft: "#CFFAFE",
      primaryStrong: "#0891B2",
      onPrimary: "#06202A",
      secondary: "#334155",
      secondarySoft: "#E2E8F0",
      onSecondary: "#FFFFFF",
      accent: "#F43F5E",
      accentSoft: "#FFE4E6",
      onAccent: "#FFFFFF",
      success: "#10B981",
      successSoft: "#D1FAE5",
      onSuccess: "#052E16",
      warning: "#F59E0B",
      warningSoft: "#FEF3C7",
      onWarning: "#111827",
      danger: "#EF4444",
      dangerSoft: "#FEE2E2",
      onDanger: "#FFFFFF",
      info: "#0EA5E9",
      infoSoft: "#E0F2FE",
      onInfo: "#082F49",
      border: "#B8D4DD",
      borderMuted: "#D8E8EE",
      divider: "#B8D4DD",
      input: "#FFFFFF",
      placeholder: "#8AA0AA",
      disabled: "#D8E8EE",
      disabledText: "#8AA0AA",
      overlay: "rgba(6, 32, 42, 0.48)",
    },
  },
  dark: {
    fonts: appThemeFonts,
    colors: {
      background: "#06141B",
      backgroundMuted: "#0B202A",
      backgroundSubtle: "#12303B",
      surface: "#0B202A",
      surfaceRaised: "#12303B",
      surfaceMuted: "#0A1B24",
      text: "#F2FBFD",
      textMuted: "#B7CDD5",
      textSubtle: "#7FA0AC",
      textInverse: "#06202A",
      primary: "#67E8F9",
      primarySoft: "#164E63",
      primaryStrong: "#A5F3FC",
      onPrimary: "#06202A",
      secondary: "#CBD5E1",
      secondarySoft: "#243746",
      onSecondary: "#06141B",
      accent: "#FB7185",
      accentSoft: "#4C1220",
      onAccent: "#19050A",
      success: "#34D399",
      successSoft: "#064E3B",
      onSuccess: "#052E16",
      warning: "#FBBF24",
      warningSoft: "#451A03",
      onWarning: "#111827",
      danger: "#F87171",
      dangerSoft: "#450A0A",
      onDanger: "#111827",
      info: "#38BDF8",
      infoSoft: "#0C4A6E",
      onInfo: "#082F49",
      border: "#2A5260",
      borderMuted: "#173441",
      divider: "#2A5260",
      input: "#0B202A",
      placeholder: "#7FA0AC",
      disabled: "#173441",
      disabledText: "#647F89",
      overlay: "rgba(0, 0, 0, 0.72)",
    },
  },
};
const themeStorage: ThemeStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};

const isColorSchemePreference = (
  value: string | null,
): value is ColorSchemePreference =>
  value === "light" || value === "dark" || value === "system";

const debugTheme = (...args: unknown[]) => {
  if (__DEV__ && ENABLE_THEME_DEBUG_LOGS) {
    console.debug("[rn-ui]", ...args);
  }
};

const errorTheme = (...args: unknown[]) => {
  console.error("[rn-ui]", ...args);
};

const AppLayout = () => {
  const [colorScheme, setColorSchemeState] =
    React.useState<ColorSchemePreference>("system");
  const [themeLoaded, setThemeLoaded] = React.useState(false);
  const [loaded, error] = useFonts({
    OutfitRegular: Outfit_400Regular,
    OutfitMedium: Outfit_500Medium,
    OutfitSemiBold: Outfit_600SemiBold,
    OutfitBold: Outfit_700Bold,
    "Amiri-Regular": require("../assets/fonts/Amiri-Regular.ttf"),
    "Amiri-Bold": require("../assets/fonts/Amiri-Bold.ttf"),
    "NotoNaskhArabic-Regular": require("../assets/fonts/NotoNaskhArabic-Regular.ttf"),
    "NotoNaskhArabic-Bold": require("../assets/fonts/NotoNaskhArabic-Bold.ttf"),
    "ScheherazadeNew-Regular": require("../assets/fonts/ScheherazadeNew-Regular.ttf"),
    "ScheherazadeNew-Bold": require("../assets/fonts/ScheherazadeNew-Bold.ttf"),
    "Mirza-Regular": require("../assets/fonts/Mirza-Regular.ttf"),
    "Harmattan-Regular": require("../assets/fonts/Harmattan-Regular.ttf"),
    "Katibeh-Regular": require("../assets/fonts/Katibeh-Regular.ttf"),
    "AmiriQuran-Regular": require("../assets/fonts/AmiriQuran-Regular.ttf"),
    "Handjet-Regular": require("../assets/fonts/Handjet-Regular.ttf"),
    "ReemKufiFun-Regular": require("../assets/fonts/ReemKufiFun-Regular.ttf"),
    "ReemKufiInk-Regular": require("../assets/fonts/ReemKufiInk-Regular.ttf"),
  });

  React.useEffect(() => {
    let mounted = true;

    SecureStore.getItemAsync(THEME_STORAGE_KEY)
      .then((saved) => {
        if (!mounted) return;

        const next = isColorSchemePreference(saved) ? saved : "system";
        setColorSchemeState(next);

        debugTheme("hydrated color scheme:", next);
      })
      .catch((storageError) => {
        errorTheme("failed to hydrate color scheme:", storageError);

        if (mounted) {
          setColorSchemeState("system");
        }
      })
      .finally(() => {
        if (mounted) {
          setThemeLoaded(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleColorSchemeChange = React.useCallback(
    (next: ColorSchemePreference) => {
      setColorSchemeState(next);
      SecureStore.setItemAsync(THEME_STORAGE_KEY, next)
        .then(() => {
          debugTheme("saved color scheme:", next);
        })
        .catch((storageError) => {
          errorTheme("failed to save color scheme:", storageError);
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
          <Stack screenOptions={{ headerShown: false }} />
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default AppLayout;
