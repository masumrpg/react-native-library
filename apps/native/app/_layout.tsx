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
  },
  dark: {
    fonts: appThemeFonts,
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
