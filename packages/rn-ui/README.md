# @masumdev/rn-ui

Reusable React Native UI kit with typed theme tokens, light/dark mode, and composable core components.

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
      primary: '#2563EB',
      primarySoft: '#DBEAFE',
      onPrimary: '#FFFFFF',
      accent: '#F97316',
    },
    typography: {
      body: {
        fontFamily: 'OutfitRegular',
      },
      label: {
        fontFamily: 'OutfitSemiBold',
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
      primary: '#38BDF8',
      onPrimary: '#082F49',
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

## Persisting Theme Choice

The core package does not depend on AsyncStorage, SQLite, Expo SecureStore, or Zustand. Pass a small adapter from your app.

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@masumdev/rn-ui';

const storage = {
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
};

export function App() {
  return (
    <ThemeProvider storage={storage} defaultColorScheme="system">
      <RootNavigator />
    </ThemeProvider>
  );
}
```

## Components

Current core components:

- `Box`
- `Text`
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

## Folder Structure

```txt
src/
  components/
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

- Use semantic colors such as `background`, `surface`, `text`, `primary`, `danger`, and `border` instead of hardcoded hex values.
- Use `spacing`, `radii`, and `typography` tokens from `useTheme()` or `useThemeStyles()`.
- Keep app-specific storage, fonts, icons, and haptics outside the UI core.
- Add new components through `components/` and export them from `components/index.ts`.
