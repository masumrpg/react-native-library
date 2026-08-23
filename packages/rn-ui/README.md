# @masumdev/rn-ui

> A modern, flat-designed React Native & Expo UI kit with 55+ typed components, dynamic light/dark theme engine, zero-shadow defaults, and pluggable architecture.

[![npm version](https://img.shields.io/npm/v/@masumdev/rn-ui.svg)](https://www.npmjs.com/package/@masumdev/rn-ui)
[![license](https://img.shields.io/npm/l/@masumdev/rn-ui.svg)](./LICENSE)

---

## 📚 Full Documentation

Comprehensive guides, component previews, prop tables, and interactive examples are available in our official documentation:

👉 **[Explore Full Documentation & Component Catalog](https://react-native-library-docs.netlify.app/rn-ui)**

- 📖 **[Installation Guide](https://react-native-library-docs.netlify.app/rn-ui/installation)**
- 🎨 **[Theming & Dark Mode](https://react-native-library-docs.netlify.app/rn-ui/theming)**
- 🧩 **[55+ Component Catalog](https://react-native-library-docs.netlify.app/rn-ui/components)**
- 🛠️ **[Building Custom Components](https://react-native-library-docs.netlify.app/rn-ui/custom-components)**
- 📜 **[Architectural Rules](./RULES.md)**
- 🚀 **[Changelog](https://react-native-library-docs.netlify.app/rn-ui/changelog)**

---

## ✨ Features

- **Flat Aesthetic**: Border-based, clean UI primitives with zero elevation/shadow by default.
- **Dynamic Theme Engine**: Light, dark, and system preference support via `ThemeProvider`.
- **55+ Typed Components**: Forms, feedback, overlays, navigation, data display, and chat UI primitives.
- **Pluggable Architecture**: Zero lock-in for fonts, icons, navigation, storage, or haptics.
- **Reanimated Powered**: Smooth 60fps micro-animations powered by `react-native-reanimated`.
- **Strict Type Safety**: 100% TypeScript with zero `any` types and shared base UI prop interfaces.

---

## 📦 Quick Install

### Expo
```sh
npx expo install react-native-reanimated react-native-worklets react-native-gesture-handler react-native-calendars
bun add @masumdev/rn-ui @gorhom/bottom-sheet
```

### React Native CLI
```sh
bun add @masumdev/rn-ui react-native-reanimated react-native-worklets react-native-gesture-handler react-native-calendars @gorhom/bottom-sheet
```

---

## ⚡ Quick Setup

Wrap your application root with `GestureHandlerRootView` and `ThemeProvider`:

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider, ToastProvider } from "@masumdev/rn-ui";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider defaultColorScheme="system">
        <ToastProvider placement="bottom">
          <RootNavigator />
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
```

---

## 🚀 Basic Usage

```tsx
import React from "react";
import { Box, Card, Text, Badge, Button, useTheme } from "@masumdev/rn-ui";

export function ExampleScreen() {
  const { toggleColorScheme } = useTheme();

  return (
    <Box flex={1} bg="background" p="lg" gap="md" justify="center">
      <Card elevated>
        <Box row justify="space-between" align="center">
          <Text variant="h3">@masumdev/rn-ui</Text>
          <Badge tone="success">Active</Badge>
        </Box>
        <Text color="textMuted" style={{ marginTop: 8 }}>
          Flat, token-driven React Native components built for speed and type-safety.
        </Text>
      </Card>

      <Button tone="primary" variant="filled" fullWidth onPress={toggleColorScheme}>
        Toggle Theme Mode
      </Button>
    </Box>
  );
}
```

---

## 📄 License

MIT © [Ma'sum](https://github.com/masumrpg)
