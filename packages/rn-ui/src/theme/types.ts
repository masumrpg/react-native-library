import type { ReactNode } from 'react';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';

export type ThemeMode = 'light' | 'dark';
export type ColorSchemePreference = ThemeMode | 'system';

export type ThemeStyle = ViewStyle | TextStyle | ImageStyle;
export type ThemeNamedStyles<T> = { [P in keyof T]: ThemeStyle };
export type ThemeStyleFactory<T extends ThemeNamedStyles<T>> = (theme: Theme) => T;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface ThemeColors {
  background: string;
  backgroundMuted: string;
  backgroundSubtle: string;
  surface: string;
  surfaceRaised: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  textInverse: string;
  primary: string;
  primarySoft: string;
  primaryStrong: string;
  onPrimary: string;
  secondary: string;
  secondarySoft: string;
  onSecondary: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  success: string;
  successSoft: string;
  onSuccess: string;
  warning: string;
  warningSoft: string;
  onWarning: string;
  danger: string;
  dangerSoft: string;
  onDanger: string;
  info: string;
  infoSoft: string;
  onInfo: string;
  border: string;
  borderMuted: string;
  divider: string;
  input: string;
  placeholder: string;
  disabled: string;
  disabledText: string;
  overlay: string;
  transparent: string;
}

export interface TypographyVariant {
  fontFamily?: string;
  fontSize: number;
  lineHeight: number;
  fontWeight?: TextStyle['fontWeight'];
  letterSpacing?: number;
}

export interface ThemeTypography {
  display: TypographyVariant;
  h1: TypographyVariant;
  h2: TypographyVariant;
  h3: TypographyVariant;
  title: TypographyVariant;
  subtitle: TypographyVariant;
  body: TypographyVariant;
  bodySmall: TypographyVariant;
  label: TypographyVariant;
  labelSmall: TypographyVariant;
  caption: TypographyVariant;
}

export interface ThemeSpacing {
  none: number;
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface ThemeRadii {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  full: number;
}

export interface ThemeShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ThemeShadows {
  none: ThemeShadow;
  sm: ThemeShadow;
  md: ThemeShadow;
  lg: ThemeShadow;
}

export interface ThemeComponents {
  button: {
    height: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>;
    paddingX: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>;
    iconSize: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>;
  };
  iconButton: {
    size: Record<'sm' | 'md' | 'lg', number>;
    iconSize: Record<'sm' | 'md' | 'lg', number>;
  };
}

export interface Theme {
  mode: ThemeMode;
  dark: boolean;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  shadows: ThemeShadows;
  components: ThemeComponents;
}

export type ThemeInput = DeepPartial<Omit<Theme, 'mode' | 'dark'>>;

export interface ThemeStorage {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
}

export interface ThemeProviderProps {
  children: ReactNode;
  colorScheme?: ColorSchemePreference;
  defaultColorScheme?: ColorSchemePreference;
  themes?: Partial<Record<ThemeMode, ThemeInput>>;
  storage?: ThemeStorage;
  storageKey?: string;
  waitForStorage?: boolean;
  fallback?: ReactNode;
  onColorSchemeChange?: (scheme: ColorSchemePreference) => void;
}

export interface ThemeContextValue {
  theme: Theme;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radii: ThemeRadii;
  shadows: ThemeShadows;
  components: ThemeComponents;
  colorScheme: ColorSchemePreference;
  resolvedColorScheme: ThemeMode;
  isDark: boolean;
  isHydrated: boolean;
  setColorScheme: (scheme: ColorSchemePreference) => void;
  toggleColorScheme: () => void;
}
