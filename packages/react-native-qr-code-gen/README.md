# @masumdev/react-native-qr-code-gen

A powerful and highly customizable QR code generation library for React Native and Expo applications, built with `react-native-svg`.

[![npm version](https://img.shields.io/npm/v/@masumdev/react-native-qr-code-gen.svg)](https://www.npmjs.com/package/@masumdev/react-native-qr-code-gen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<div style="display: flex; gap: 8px;">
  <img src="https://img.shields.io/npm/v/@masumdev/react-native-qr-code-gen" alt="npm version" />
  <img src="https://img.shields.io/npm/dt/@masumdev/react-native-qr-code-gen" alt="npm downloads" />
  <img src="https://img.shields.io/badge/platforms-android%20|%20ios-lightgrey.svg" alt="platforms" />
  <img src="https://img.shields.io/badge/Expo-compatible-9cf.svg" alt="expo compatible" />
</div>

## Features

- 🎨 **Rich QR Code styling** with fully customizable:
  - Colors and gradients (Linear & Radial)
  - Patterns and shapes (Square, Dot, Triangle, Heart, Rain)
  - Corner styles (Eyes) and dot designs
  - Background effects
- 🖼️ **Custom logo placement** with adjustable size, padding, and border radius.
- 🌈 **Beautiful preset templates** (`HEART`, `RAIN`, `LINEAR_GRADIENT`, etc.)
- 🎯 **Adjustable error correction levels** (L, M, Q, H)
- 📦 **Seamless integration** with React Native & Expo.
- ⚡ **High-performance** SVG rendering.

## Installation

### 1. Install the package

```bash
npm install @masumdev/react-native-qr-code-gen react-native-svg
```
*Or using yarn/bun:*
```bash
bun add @masumdev/react-native-qr-code-gen react-native-svg
```

### 2. Expo Users
Make sure to install the compatible SVG library:
```bash
npx expo install react-native-svg
```

## Usage

### Basic Usage

```tsx
import { QRCode } from '@masumdev/react-native-qr-code-gen';

const MyComponent = () => {
  return (
    <QRCode 
      variant="BASIC" 
      value="https://github.com/masumrpg" 
      size={300} 
    />
  );
};
```

### Using Presets (Variants)

```tsx
import { QRCode } from '@masumdev/react-native-qr-code-gen';

// Just change the variant prop
<QRCode variant="HEART" value="Love QR" size={250} />
<QRCode variant="RAIN" value="Rainy QR" size={250} />
<QRCode variant="LINEAR_GRADIENT" value="Modern QR" size={250} />
```

## API Reference

### QRCodeProps

| Prop                 | Type                     | Default | Description                  |
| -------------------- | ------------------------ | ------- | ---------------------------- |
| value                | string                   | -       | The content to be encoded. |
| variant              | QRCodeVariant            | 'BASIC' | Predefined templates. |
| size                 | number                   | 256     | Size in pixels. |
| color                | string                   | '#000'  | Main color. |
| backgroundColor      | string                   | 'transparent' | Background color. |
| logo                 | LogoOptions              | -       | Center logo configuration. |
| gradient             | QRCodeGradientConfig     | -       | Gradient configuration. |
| piece                | PieceOptions             | -       | Customizing QR dots. |
| eye                  | EyeOptions               | -       | Customizing corner squares. |

#### QRCodeVariant
`'BASIC'` | `'TRIANGLE'` | `'HEART'` | `'DOT'` | `'WITH_LOGO'` | `'RAIN'` | `'LINEAR_GRADIENT'` | `'RADIAL_GRADIENT'` | `'IMAGE_BACKGROUND'`

---

## License

MIT © [Ma'sum](https://github.com/masumrpg)
