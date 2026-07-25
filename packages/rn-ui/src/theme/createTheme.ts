import { darkTheme, lightTheme } from "./tokens";
import type {
  DeepPartial,
  Theme,
  ThemeInput,
  ThemeMode,
  TypographyVariant,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

export function mergeTheme<T extends object>(
  base: T,
  override?: DeepPartial<T>,
): T {
  if (!override) return base;

  const output: Record<string, unknown> = {
    ...(base as Record<string, unknown>),
  };

  Object.entries(override).forEach(([key, value]) => {
    const baseValue = output[key];
    if (isRecord(baseValue) && isRecord(value)) {
      output[key] = mergeTheme(
        baseValue,
        value as DeepPartial<typeof baseValue>,
      );
    } else if (value !== undefined) {
      output[key] = value;
    }
  });

  return output as T;
}

export function createTheme(mode: ThemeMode, override?: ThemeInput): Theme {
  const base = mode === "dark" ? darkTheme : lightTheme;
  const merged = mergeTheme(base, override as DeepPartial<Theme>);

  return {
    ...merged,
    mode,
    dark: mode === "dark",
    typography: applyFontTokens(merged),
  };
}

function withFont(
  variant: TypographyVariant,
  fontFamily: string | undefined,
): TypographyVariant {
  return {
    ...variant,
    fontFamily: variant.fontFamily ?? fontFamily,
  };
}

function applyFontTokens(theme: Theme) {
  const { fonts, typography } = theme;

  return {
    display: withFont(typography.display, fonts.bold),
    h1: withFont(typography.h1, fonts.bold),
    h2: withFont(typography.h2, fonts.bold),
    h3: withFont(typography.h3, fonts.semibold),
    title: withFont(typography.title, fonts.semibold),
    subtitle: withFont(typography.subtitle, fonts.semibold),
    body: withFont(typography.body, fonts.regular),
    bodySmall: withFont(typography.bodySmall, fonts.regular),
    label: withFont(typography.label, fonts.semibold ?? fonts.medium),
    labelSmall: withFont(typography.labelSmall, fonts.semibold ?? fonts.medium),
    caption: withFont(typography.caption, fonts.regular),
  };
}
