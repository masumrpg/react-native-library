# @masumdev/rn-tajweed-verse

A highly customizable React Native and Expo component to parse and render Quranic verses with Tajweed color-coding, interactive explainers, built-in themes, and custom styling rules.

---

## Features

- 📖 **Quranic Markup Parsing**: Automatically parses standard Quranic database tags (e.g. `[q[خَلَقَ]`, `[h:1[ٱ]`) and renders them color-coded.
- 💡 **Interactive Tooltips**: Tapping a colored word reveals Tajweed rule explanations and pronunciation guides.
- 🎨 **Theme Presets**: Switch between built-in themes like Classic, Dark Mode, Soft Pastels, and High-Contrast Accessible.
- 🚫 **Plain Reading Mode**: Easily toggle colors off to show clean, unstyled Arabic script.
- 🛠️ **Custom Rule Injection**: Prepend custom RegExp patterns and styles (e.g. highlight specific phrases).
- ⚡ **Performance Memoized**: Wrapped in `React.memo` with custom shallow comparison checks to prevent heavy regex parsing cycles on parent re-renders.
- 🔤 **Style Inheritance Fix**: Automatically resolves the React Native nested text bug where custom font family values fail to inherit down on Android/iOS.

---

## Installation

Install the package via npm, yarn, or bun:

```bash
npm install @masumdev/rn-tajweed-verse
# or
yarn add @masumdev/rn-tajweed-verse
# or
bun add @masumdev/rn-tajweed-verse
```

_Note: This package requires `react-native-parsed-text` which is installed automatically as a dependency._

---

## Quick Start

```tsx
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import TajweedVerse, { TajweedThemes } from "@masumdev/rn-tajweed-verse";

export default function App() {
  const verseText =
    "بِسْمِ [h[ٱ]للَّهِ [h[ٱ][l[ل]رَّحْمَ[n[ـٰ]نِ [h[ٱ][l[ل]رَّح[p[ِي]مِ";

  return (
    <View style={styles.container}>
      <TajweedVerse
        verse={verseText}
        colored={true}
        interactive={true}
        config={{
          style: {
            fontSize: 28,
            fontFamily: "Amiri-Regular", // Optional custom font
            lineHeight: 56,
            direction: "rtl",
          },
          tajweed: TajweedThemes.classic, // classic, dark, pastel, accessible
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
  },
});
```

---

## Config Props

| Prop          | Type                 | Default         | Description                                                                             |
| ------------- | -------------------- | --------------- | --------------------------------------------------------------------------------------- |
| `verse`       | `string`             | `""`            | The raw Quranic verse text containing Tajweed markup (e.g., `[q[خَلَقَ]`).              |
| `colored`     | `boolean`            | `true`          | When `false`, all tags are stripped and clean, uncolored Arabic is rendered.            |
| `interactive` | `boolean`            | `false`         | When `true`, tapping a colored word alerts the user with the rule details.              |
| `config`      | `TajweedVerseConfig` | `defaultConfig` | Custom style configuration for the text and individual rules.                           |
| `onRulePress` | `function`           | `undefined`     | Custom callback when a rule is pressed: `(ruleName, description, matchedText) => void`. |
| `customRules` | `ParseShape[]`       | `undefined`     | Custom regex parser shapes to inject (runs before default rules).                       |

---

## Styling & Themes

`TajweedVerse` exports a preset object `TajweedThemes` containing:

1. `classic`: Standard Quran print color scheme.
2. `dark`: High-vibrancy scheme tailored for dark screens.
3. `pastel`: Soft color palette for modern interfaces.
4. `accessible`: High-contrast, bolded, color-blind friendly scheme.

You can set it via props:

```tsx
import TajweedVerse, { TajweedThemes } from "@masumdev/rn-tajweed-verse";

<TajweedVerse verse={verse} config={{ tajweed: TajweedThemes.pastel }} />;
```

---

## Custom Rules Injection

You can inject custom parsing rules (following the `react-native-parsed-text` schema) to apply custom highlights or styles to specific words:

```tsx
<TajweedVerse
  verse="This is a [custom[special word] inside text."
  customRules={[
    {
      pattern: /\[custom\[([^\]]+)\]/,
      style: {
        color: "#6366f1",
        fontWeight: "bold",
        textDecorationLine: "underline",
      },
      renderText: (text) => text.replace(/\[custom\[/, "").replace(/\]/, ""),
      onPress: (text) => Alert.alert("Tapped Highlight", text),
    },
  ]}
/>
```

---

## 🔤 Font Family Inheritance Fix

In React Native, nested `<Text>` components with their own styles (like colored Tajweed rules) fail to inherit `fontFamily` or `lineHeight` from their parent on Android and iOS.

Our package resolves this by merging the parent `style` configuration directly into the parsed sub-elements behind the scenes. This guarantees that your custom Arabic fonts (like Amiri or Noto Naskh) render uniformly across both standard text and color-coded rules!

---

## License

MIT (c) 2026 Ma'sum / devmasum
