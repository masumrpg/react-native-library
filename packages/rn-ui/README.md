# @masumdev/rn-ui

Reusable React Native UI kit with typed theme tokens, flat light/dark mode, pluggable persistence, pluggable fonts, and composable core components.

## Install

```sh
bun add @masumdev/rn-ui
```

Peer dependencies:

```sh
bun add react react-native
```

## Setup

Wrap your app once with `ThemeProvider`.

```tsx
import { ThemeProvider } from '@masumdev/rn-ui';

export default function App() {
  return (
    <ThemeProvider defaultColorScheme="system">
      <RootNavigator />
    </ThemeProvider>
  );
}
```

`defaultColorScheme` accepts:

- `light`
- `dark`
- `system`

`system` follows the device color scheme through React Native `useColorScheme()`.

## Usage

```tsx
import { Badge, Box, Button, Card, Text, useTheme } from '@masumdev/rn-ui';

export function Example() {
  const { setColorScheme, toggleColorScheme } = useTheme();

  return (
    <Box flex={1} bg="background" p="lg" gap="md">
      <Card>
        <Badge tone="success">Active</Badge>
        <Text variant="h3">Reusable UI</Text>
        <Text color="textMuted">
          Theme tokens keep spacing, color, typography, and radius consistent.
        </Text>
      </Card>

      <Button fullWidth onPress={toggleColorScheme}>
        Toggle Theme
      </Button>

      <Button variant="outline" onPress={() => setColorScheme('system')}>
        Follow System
      </Button>
    </Box>
  );
}
```

## Custom Theme

Override only the tokens you need. The library deep-merges your values with the default light and dark themes.

```tsx
import { ThemeProvider } from '@masumdev/rn-ui';

const themes = {
  light: {
    colors: {
      primary: '#4F46E5',
      primarySoft: '#EEF2FF',
      onPrimary: '#FFFFFF',
      accent: '#F97316',
    },
    fonts: {
      regular: 'OutfitRegular',
      medium: 'OutfitMedium',
      semibold: 'OutfitSemiBold',
      bold: 'OutfitBold',
    },
    typography: {
      body: {
        fontSize: 16,
      },
      label: {
        letterSpacing: 0.2,
      },
    },
    radii: {
      lg: 14,
      xl: 18,
    },
  },
  dark: {
    colors: {
      background: '#08111F',
      surface: '#0F1B2D',
      primary: '#818CF8',
      primarySoft: '#312E81',
      onPrimary: '#111827',
    },
  },
};

export function App() {
  return (
    <ThemeProvider defaultColorScheme="system" themes={themes}>
      <RootNavigator />
    </ThemeProvider>
  );
}
```

## Fonts

Fonts are pluggable. `rn-ui` does not load font files by itself, so it works with Expo Font, local TTF files, React Native CLI font linking, or any other font-loading setup.

Load the font in your app, then pass the registered font names through the `fonts` token.

```tsx
import { useFonts } from 'expo-font';
import { ThemeProvider } from '@masumdev/rn-ui';

const themes = {
  light: {
    fonts: {
      regular: 'OutfitRegular',
      medium: 'OutfitMedium',
      semibold: 'OutfitSemiBold',
      bold: 'OutfitBold',
      mono: 'SpaceMono',
    },
  },
  dark: {
    fonts: {
      regular: 'OutfitRegular',
      medium: 'OutfitMedium',
      semibold: 'OutfitSemiBold',
      bold: 'OutfitBold',
      mono: 'SpaceMono',
    },
  },
};

export function App() {
  const [loaded] = useFonts({
    OutfitRegular: require('./assets/fonts/Outfit-Regular.ttf'),
    OutfitMedium: require('./assets/fonts/Outfit-Medium.ttf'),
    OutfitSemiBold: require('./assets/fonts/Outfit-SemiBold.ttf'),
    OutfitBold: require('./assets/fonts/Outfit-Bold.ttf'),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider themes={themes}>
      <RootNavigator />
    </ThemeProvider>
  );
}
```

Default mapping:

- `display`, `h1`, `h2` use `fonts.bold`
- `h3`, `title`, `subtitle` use `fonts.semibold`
- `label`, `labelSmall` use `fonts.semibold` or `fonts.medium`
- `body`, `bodySmall`, `caption` use `fonts.regular`

You can still override one typography variant directly:

```tsx
const themes = {
  light: {
    typography: {
      h1: {
        fontFamily: 'CustomDisplayBold',
        fontSize: 34,
        lineHeight: 42,
      },
    },
  },
};
```

## Persisting Theme Choice

The core package does not depend on AsyncStorage, SQLite, Expo SecureStore, MMKV, or Zustand. Pass a small adapter from your app.

`ThemeProvider` waits for storage hydration by default, so the app can avoid rendering light mode before the saved dark mode is loaded.

### Expo SecureStore

```tsx
import * as SecureStore from 'expo-secure-store';
import { ThemeProvider } from '@masumdev/rn-ui';

const storage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};

export function App() {
  return (
    <ThemeProvider storage={storage} defaultColorScheme="system">
      <RootNavigator />
    </ThemeProvider>
  );
}
```

### AsyncStorage

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@masumdev/rn-ui';

const storage = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
};

export function App() {
  return (
    <ThemeProvider storage={storage} defaultColorScheme="system">
      <RootNavigator />
    </ThemeProvider>
  );
}
```

Expo Go support depends on whether the chosen storage native module is available in the runtime. In the native playground, SecureStore is used because it works cleanly with the Expo workflow.

## Logging

The library does not force logging. Apps can decide how noisy persistence logs should be.

Recommended app pattern:

```tsx
const ENABLE_THEME_DEBUG_LOGS = false;

const debugTheme = (...args: unknown[]) => {
  if (__DEV__ && ENABLE_THEME_DEBUG_LOGS) {
    console.debug('[rn-ui]', ...args);
  }
};

const errorTheme = (...args: unknown[]) => {
  console.error('[rn-ui]', ...args);
};
```

Use debug logs for successful hydrate/save messages and error logs for failed storage operations.

## Components

Current core components:

- `Box`
- `Text`
- `Accordion`
- `Button`
- `IconButton`
- `Badge`
- `Card`
- `Divider`

Icons are intentionally not tied to Ionicons or Expo. Pass any React node or render function.

```tsx
import { Button } from '@masumdev/rn-ui';
import { Ionicons } from '@expo/vector-icons';

<Button
  leftIcon={({ color, size }) => (
    <Ionicons name="add" color={color} size={size} />
  )}
>
  Create
</Button>
```

### Accordion

Use `Accordion` for expandable flat bordered sections. It supports controlled and uncontrolled state.

```tsx
import { Accordion, Text } from '@masumdev/rn-ui';

<Accordion
  defaultOpenIds={['theme']}
  items={[
    {
      id: 'theme',
      title: 'Theme tokens',
      subtitle: 'Colors, fonts, spacing, and radius',
      content: 'Accordion follows the same flat token-driven style.',
    },
    {
      id: 'icons',
      title: 'Generic icons',
      content: <Text color="textMuted">Icons can be render functions.</Text>,
    },
  ]}
/>
```

Controlled:

```tsx
const [openIds, setOpenIds] = React.useState(['theme']);

<Accordion
  openIds={openIds}
  onOpenChange={setOpenIds}
  allowMultiple
  items={items}
/>
```

Animation:

- Default animation uses React Native `Animated`.
- No extra dependency is required.
- Content animates height and opacity.
- Indicator animates rotation.
- Pass `animated={false}` to disable animation.
- Pass `animationDuration` to tune timing.

```tsx
<Accordion
  animationDuration={220}
  defaultOpenIds={['theme']}
  items={items}
/>
```

Reanimated or custom animation can be plugged in without making `rn-ui` depend on Reanimated:

```tsx
import type {
  AccordionAnimatedContentProps,
  AccordionAnimatedIndicatorProps,
} from '@masumdev/rn-ui';

function ReanimatedAccordionContent(props: AccordionAnimatedContentProps) {
  // App-owned Reanimated implementation.
  return <YourAnimatedContent {...props} />;
}

function ReanimatedAccordionIndicator(props: AccordionAnimatedIndicatorProps) {
  // App-owned Reanimated implementation.
  return <YourAnimatedIndicator {...props} />;
}

<Accordion
  items={items}
  animationComponents={{
    Content: ReanimatedAccordionContent,
    Indicator: ReanimatedAccordionIndicator,
  }}
/>
```

## Folder Structure

```txt
src/
  components/
    Accordion.tsx
    Badge.tsx
    Box.tsx
    Button.tsx
    Card.tsx
    Divider.tsx
    IconButton.tsx
    Text.tsx
    index.ts
  theme/
    ThemeProvider.tsx
    createTheme.ts
    index.ts
    tokens.ts
    types.ts
    useTheme.ts
    useThemeStyles.ts
  utils/
    color.ts
    index.ts
  index.ts
```

## Design Notes

- The default visual style is flat: no shadow/elevation by default, stronger borders, semantic surfaces, and consistent rounded corners.
- Default primary color uses a modern indigo palette: `#4F46E5` in light mode and `#818CF8` in dark mode.
- Use semantic colors such as `background`, `surface`, `text`, `primary`, `danger`, and `border` instead of hardcoded hex values.
- Use `spacing`, `radii`, `fonts`, and `typography` tokens from `useTheme()` or `useThemeStyles()`.
- Keep app-specific storage, fonts, icons, and haptics outside the UI core.
- Add new components through `components/` and export them from `components/index.ts`.
- When changing package APIs, tokens, default visuals, persistence behavior, or app integration examples, update this README in the same change.

## Development Rules

See [`RULES.md`](./RULES.md) for file structure rules, code style rules, component conventions, usage patterns, logging rules, and verification checklist.
