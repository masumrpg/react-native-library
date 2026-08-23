# @masumdev/rn-ui Architectural Rules & Design System Guidelines

This document outlines the mandatory architectural rules and design system guidelines for maintaining and extending `@masumdev/rn-ui`.

---

## 1. Orthogonal Color (`tone`) vs Structure (`variant`)

All component props must maintain a strict 2-dimensional separation between semantic color palettes and visual fill structures:

- **`tone`**: Specifies **semantic color intent** (`'primary'`, `'secondary'`, `'accent'`, `'success'`, `'warning'`, `'danger'`, `'info'`, `'default'`).
- **`variant`**: Specifies **visual structure and fill style** (`'filled'`, `'outline'`, `'ghost'`, `'soft'`, `'solid'`).

### ❌ Incorrect (Polluted Variant Combinations)
```tsx
// DO NOT combine color names directly into variant strings
<Button variant="danger-outline" />
<Badge variant="success-soft" />
```

### ✅ Correct (2-Dimensional Orthogonal Props)
```tsx
// DO separate semantic tone from visual variant fill
<Button tone="danger" variant="outline" />
<Badge tone="success" variant="soft" />
```

---

## 2. Base Interface Extension Rules

All component prop interfaces exported in `src/components/` must adhere to selective base interface inheritance:

### A. Interactive Action Controls
Components that accept semantic colors, variants, sizes, shapes, or icons (`Button`, `IconButton`, `Badge`, `Alert`, `AlertDialog`, `Switch`, `Slider`, `Rating`, `FloatingActionButton`, `Progress`) **MUST** extend the shared base interfaces exported from `./types`:

```tsx
import {
  type ToneProps,
  type VariantProps,
  type SizeProps,
  type ShapeProps,
  type IconSlotsProps,
  type BaseUIComponentProps,
} from "./types";

export interface ButtonProps
  extends Omit<PressableProps, "children" | "style">,
    VariantProps<ButtonVariant>,
    ToneProps<ButtonTone>,
    SizeProps<ButtonSize>,
    ShapeProps<ButtonShape>,
    IconSlotsProps {
  // Component specific props
}
```

### B. Layout & Structure Primitives
Layout primitives (`Box`, `Divider`, `AspectRatio`, `Table`, `Timeline`) and complex structural components (`Calendar`, `Accordion`, `Carousel`) **MUST NOT** extend `BaseUIComponentProps` unnecessarily. Keep their prop interfaces clean and lean to avoid IDE Intellisense pollution (e.g., preventing irrelevant props like `loading` or `leftIcon` on a `<Divider />`).

---

## 3. Strict Type Safety (Zero `any` Types Allowed)

Using `any` type casting or `any` parameter types is **strictly forbidden** across the codebase.

- ❌ Never use `as any` or `(: any)` for props, state, event handlers, or `React.cloneElement`.
- ✅ Always use precise React Native event types (e.g. `NativeSyntheticEvent<ImageLoadEventData>`, `LayoutChangeEvent`, `StyleProp<ViewStyle>`).
- ✅ Use type guards or generics when cloning children: `if (React.isValidElement<{ style?: StyleProp<ViewStyle> }>(child)) { ... }`.

---

## 4. Dynamic Theme Token Consumption

- **Theme Hooks**: Always dereference theme tokens via `useTheme()` inside components (`const { colors, radii, spacing, components } = useTheme()`).
- **Zero Hardcoded Offsets**: Avoid hardcoded hex colors or magic pixel numbers. Always map to design tokens in `ThemeColors` or `ThemeTokens`.
- **Light & Dark Mode Support**: Ensure all color mapping logic resolves both standard fill and soft/inverse token pairs (e.g. `colors.primarySoft`, `colors.onPrimary`, `colors.dangerSoft`, `colors.onDanger`).

---

## 5. Type-Safe Custom Themes (`ThemeInput` / `ThemeColors` / `Theme`)

When defining or overriding custom themes in user applications, developers MUST use exported library types to ensure 100% type safety and autocompletion:

- `ThemeInput`: Type for custom theme overrides passed to `<ThemeProvider themes={{ light, dark }}>`.
- `ThemeColors`: Type contract for color palette definitions.
- `Theme`: Full resolved theme object passed to `useTheme()` and `useThemeStyles((theme) => ...)`.

```tsx
import { ThemeProvider, type ThemeInput, type ThemeColors } from "@masumdev/rn-ui";

const customColors: Partial<ThemeColors> = {
  primary: "#06B6D4",
  primarySoft: "#CFFAFE",
  onPrimary: "#06202A",
};

const customLight: ThemeInput = {
  colors: customColors,
};
```

---

## 6. Pluggable Icons via `renderIcon`

- Icon slots (`icon`, `leftIcon`, `rightIcon`, `closeIcon`) must accept `RenderIcon` from `./types`.
- Components must render icon slots via the `renderIcon(icon, color, size)` helper to seamlessly support both JSX nodes (`<Icon />`) and function renderers (`({ color, size }) => <Icon color={color} size={size} />`).

```tsx
import { renderIcon, type RenderIcon } from "./types";

// Inside component render:
{renderIcon(icon, iconColor, iconSize)}
```

---

## 7. Backward Compatibility Policy

- Existing component props must never be broken or removed in minor updates.
- If legacy aliases exist (such as `ButtonVariant = "filled" | "outline" | "ghost" | "soft" | "danger"`), maintain backward compatibility while mapping legacy options to the new `tone` and `variant` architecture.
