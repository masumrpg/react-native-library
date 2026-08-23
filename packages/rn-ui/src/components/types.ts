import type { ReactNode } from "react";
import type { ThemeColors } from "../theme";

export type ThemeColorName = keyof ThemeColors;

export type RenderIcon =
  | ReactNode
  | ((props: { color: string; size: number }) => ReactNode);

export function renderIcon(
  icon: RenderIcon | undefined,
  color: string,
  size: number,
) {
  if (!icon) return null;
  return typeof icon === "function" ? icon({ color, size }) : icon;
}

/**
 * Standard semantic color tones across the design system.
 */
export type ComponentTone =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default";

/**
 * Standard component dimension scaling sizes.
 */
export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Standard border radius shape styles.
 */
export type ComponentShape = "rounded" | "pill" | "square";

/**
 * Base props interface for components that accept a semantic color tone.
 */
export interface ToneProps<T extends string = ComponentTone> {
  /**
   * Semantic color tone (e.g. 'primary', 'success', 'danger').
   */
  tone?: T;
}

/**
 * Base props interface for components that accept visual style variants.
 */
export interface VariantProps<V extends string = string> {
  /**
   * Visual fill or structure variant (e.g. 'filled', 'outline', 'ghost', 'soft').
   */
  variant?: V;
}

/**
 * Base props interface for components that scale size.
 */
export interface SizeProps<S extends string = ComponentSize> {
  /**
   * Size dimension scaling (e.g. 'sm', 'md', 'lg').
   */
  size?: S;
}

/**
 * Base props interface for components that support border radius shapes.
 */
export interface ShapeProps<S extends string = ComponentShape> {
  /**
   * Border radius shape style (e.g. 'rounded', 'pill', 'square').
   */
  shape?: S;
}

/**
 * Base props interface for components with left and right icon slots.
 */
export interface IconSlotsProps {
  /**
   * Icon element or render function positioned on the left side.
   */
  leftIcon?: RenderIcon;
  /**
   * Icon element or render function positioned on the right side.
   */
  rightIcon?: RenderIcon;
}

/**
 * Composite base interface for general interactive UI components.
 * Can be extended by internal components or external user components.
 */
export interface BaseUIComponentProps<
  V extends string = string,
  T extends string = ComponentTone,
  S extends string = ComponentSize
> extends VariantProps<V>, ToneProps<T>, SizeProps<S> {
  /**
   * Whether user interaction is disabled.
   */
  disabled?: boolean;
  /**
   * Whether the component is in a loading state.
   */
  loading?: boolean;
}

/**
 * Base props interface for components that support glassmorphism styling.
 */
export interface BaseGlassProps {
  /**
   * Enables translucent glassmorphism styling with soft highlight borders.
   * Default: false
   */
  glass?: boolean;
}

/**
 * Base props interface for components that support tactile haptic feedback.
 */
export interface BaseHapticProps {
  /**
   * Enables tactile haptic feedback on press interactions.
   * Default: true
   */
  haptic?: boolean;
}

/**
 * Base props interface for components that support micro press scale animations.
 */
export interface BaseAnimatedProps {
  /**
   * Enables micro spring scale down animation on press.
   * Default: true
   */
  animated?: boolean;
}

/**
 * Combined base interface for universal component capabilities.
 */
export interface BaseComponentProps
  extends BaseGlassProps,
    BaseHapticProps,
    BaseAnimatedProps {}

