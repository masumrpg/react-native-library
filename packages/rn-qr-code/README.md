# @masumdev/rn-qr-code

A high-performance, single-path SVG QR code generator library for React Native and Expo applications, built with `react-native-svg`.

<div style="display: flex; gap: 8px;">
  <img src="https://img.shields.io/npm/v/@masumdev/rn-qr-code" alt="npm version" />
  <img src="https://img.shields.io/npm/dt/@masumdev/rn-qr-code" alt="npm downloads" />
  <img src="https://img.shields.io/badge/platforms-android%20|%20ios%20|%20web-lightgrey.svg" alt="platforms" />
  <img src="https://img.shields.io/badge/Expo-compatible-9cf.svg" alt="expo compatible" />
</div>

## Features

- ⚡ **Optimized Single-Path SVG**: 50x–100x faster native rendering by merging QR modules into one native path node.
- 🚀 **Non-Blocking Asynchronous Mode**: Generate complex QR codes asynchronously without dropping UI frames (`isAsync`).
- 🎨 **Rich QR Code Styling**:
  - Linear and Radial Gradients
  - Modular shapes: `square`, `dot`, `triangle`, `heart`, `rain`, `rounded`, `star`, etc.
  - Granular eye corner styling (independent outer, inner, and center radii)
  - Logo embedding with background padding & border radius
- 🌈 **16+ Built-in Presets** (`BASIC`, `HEART`, `RAIN`, `LINEAR_GRADIENT`, `RADIAL_GRADIENT`, `WITH_LOGO`, etc.)
- 🎯 **Dynamic Auto-Fit Versioning**: Automatically expands QR matrix size to fit any text or URL length without overflow errors.
- 📦 **Expo & Bare React Native Ready**.

## Installation

```bash
bun add @masumdev/rn-qr-code react-native-svg
# or
npm install @masumdev/rn-qr-code react-native-svg
```

### Expo Projects

```bash
npx expo install react-native-svg
bun add @masumdev/rn-qr-code
```

## Usage

### Basic Usage

```tsx
import { QRCode } from "@masumdev/rn-qr-code";

export function MyComponent() {
  return (
    <QRCode
      variant="BASIC"
      value="https://react-native-library-docs.netlify.app/rn-qr-code/"
      size={240}
    />
  );
}
```

### Using Built-in Presets

```tsx
import { QRCode, QR_CODE_CONFIGS } from "@masumdev/rn-qr-code";

// Using predefined variant name
<QRCode variant="HEART" value="https://react-native-library-docs.netlify.app" size={200} />
<QRCode variant="RAIN" value="https://react-native-library-docs.netlify.app" size={200} />
<QRCode variant="LINEAR_GRADIENT" value="https://react-native-library-docs.netlify.app" size={200} />
```

### Non-blocking Async Rendering

```tsx
import { QRCode } from "@masumdev/rn-qr-code";
import { Skeleton } from "@masumdev/rn-ui";

<QRCode
  value="https://react-native-library-docs.netlify.app/rn-qr-code/"
  size={200}
  isAsync
  renderLoading={() => <Skeleton style={{ width: 200, height: 200 }} radius="md" />}
/>
```

## API Reference

### QRCodeProps

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `string` | **required** | The payload or URL to encode. |
| `variant` | `keyof typeof QR_CODE_CONFIGS` | `'BASIC'` | Predefined preset configuration. |
| `size` | `number` | `256` | Width and height in pixels. |
| `color` | `string` | `'#000'` | Module color (if gradient not set). |
| `backgroundColor` | `string` | `'transparent'` | Background color. |
| `logo` | `LogoOptions` | - | Center logo options (source, size, padding, borderRadius). |
| `gradient` | `QRCodeGradientConfig` | - | Linear or radial gradient options. |
| `piece` | `PieceOptions` | - | Module piece shape and sizing. |
| `eye` | `EyeOptions` | - | Corner position detection pattern styling. |
| `isAsync` | `boolean` | `false` | Asynchronous non-blocking calculation. |
| `isLoading` | `boolean` | `false` | Force loading state. |
| `renderLoading` | `() => ReactNode` | - | Custom loading / shimmer component. |

---

## License

MIT © [Ma'sum](https://github.com/masumdev)
