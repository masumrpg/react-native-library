# React Native Library Monorepo

Welcome to the React Native package development workspace. This project is structured as a **Turborepo** monorepo using **Bun** workspaces to build, test, and showcase customizable React Native libraries.

---

## 🏗️ Monorepo Architecture

This workspace contains two main libraries (packages) and two application playgrounds:

### Libraries (`packages/`)

- **[`@masumdev/rn-tajweed-verse`](file:///home/ma-sum/Projects/Node/Mobile/Library/react-native-library/packages/rn-tajweed-verse)**
  - **Description**: A highly customizable React Native component (`TajweedVerse`) designed to parse Quranic verses containing Tajweed markup tags (e.g. `[q[خَلَقَ]`, `[h:1[ٱ]`) and render them with custom color schemes.
  - **Key Features**:
    - **Interactive Tooltips**: Tapping a colored word reveals linguistic explanations and pronunciation guides.
    - **Multiple Theme Presets**: Built-in themes (`classic`, `dark`, `pastel`, and `accessible`).
    - **Plain Reading Mode**: Easily toggle colors off to show clean, unstyled Arabic text.
    - **Custom Rule Injection**: Inject custom RegExp patterns and styles (e.g. highlights).
    - **Performance Memoization**: Uses `React.memo` with custom shallow comparison checks to prevent redundant parsing cycles.
    - **Style Inheritance Fix**: Automatically resolves the React Native nested text bug where custom font family values fail to inherit down on Android/iOS.
- **[`@masumdev/react-native-qr-code-gen`](file:///home/ma-sum/Projects/Node/Mobile/Library/react-native-library/packages/react-native-qr-code-gen)**
  - **Description**: A modern, customizable QR code generator for React Native and Expo utilizing SVG with custom color gradients, logos, and custom eye shapes.
- **`typescript-config`**
  - **Description**: Shared TypeScript compiler configs used across packages.

### Applications (`apps/`)

- **[`native`](file:///home/ma-sum/Projects/Node/Mobile/Library/react-native-library/apps/native)**: An **Expo** app with **Expo Router** stack navigation that serves as an interactive playground.
  - **Home / Dashboard**: An elegant card-based menu to navigate between screen packages.
  - **QR Code Screen (`/qr-code`)**: Showcases QR code generator layouts.
  - **Tajweed Verse Screen (`/tajweed-verse`)**: Demonstrates the `TajweedVerse` component with live configurations:
    - **Quran Database Samples**: Select from 7 real Quran database verses (e.g. Al-Fatihah, Al-Baqarah) to test parsing behavior.
    - **10 Premium Quranic Arabic Fonts**: Instantly switch between **Amiri**, **Amiri Quran**, **Noto Naskh Arabic**, **Scheherazade New**, **Mirza**, **Harmattan**, **Katibeh**, **Handjet**, **Reem Kufi Fun**, **Reem Kufi Ink**, and **System Default**.
    - **Live Controls**: Toggles for plain reading mode, interactive popups, color-coding, theme presets, custom rules, and a render-counter checking memoization efficiency.
- **[`web`](file:///home/ma-sum/Projects/Node/Mobile/Library/react-native-library/apps/web)**: A **Next.js** web application configured with **react-native-web**.

---

## 🚀 Getting Started

### 1. Install Dependencies

Run the install command from the root directory:

```bash
bun install
```

### 2. Run the Expo Playground

Launch the native Expo playground with Metro Bundler:

```bash
bun dev:native
```

- Press **`a`** to open in an Android Emulator.
- Press **`i`** to open in an iOS Simulator.
- Scan the QR code with your Expo Go app to test on physical devices.

### 3. Build Libraries

To build the packages using `tsup` compilers:

```bash
bun run build
```

### 4. Clean Workspace

Clear build outputs and `node_modules`:

```bash
bun run clean
```

---

## 🔤 Custom Quranic Fonts in Expo

This monorepo comes pre-configured with **10 custom Arabic fonts** inside the `native` app. Here is how they are configured:

### 1. Loading Fonts in Root Layout (`apps/native/app/_layout.tsx`)

We use `expo-font` to register the `.ttf` assets located in `assets/fonts/`:

```typescript
import { useFonts } from "expo-font";

const [loaded, error] = useFonts({
  "Amiri-Regular": require("../assets/fonts/Amiri-Regular.ttf"),
  "NotoNaskhArabic-Regular": require("../assets/fonts/NotoNaskhArabic-Regular.ttf"),
  "ScheherazadeNew-Regular": require("../assets/fonts/ScheherazadeNew-Regular.ttf"),
  // Mirza, Harmattan, Katibeh, AmiriQuran, Handjet, ReemKufi
});
```

### 2. Styling Component

To apply a font, simply pass the `fontFamily` under the base text configuration:

```tsx
<TajweedVerse
  verse={verseText}
  config={{
    style: {
      fontSize: 28,
      fontFamily: "NotoNaskhArabic-Regular",
      lineHeight: 60,
      direction: "rtl",
    },
  }}
/>
```

### 3. The React Native Nested Style Inheritance Fix

In React Native, nested `<Text>` components that have their own styling (e.g. different colors for Tajweed rules) fail to inherit `fontFamily` from their parent on Android and iOS.

Our `@masumdev/rn-tajweed-verse` package fixes this out-of-the-box by merging the base styling properties directly into the parsed sub-elements:

```typescript
const getRuleStyle = (ruleStyle: StyleProp<TextStyle>) => {
  return [mergedConfig.style, ruleStyle];
};
```

This ensures consistent rendering of custom fonts across both plain text and colored tokens!
