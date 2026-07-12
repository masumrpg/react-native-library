import { darkTheme, lightTheme } from './tokens';
import type { DeepPartial, Theme, ThemeInput, ThemeMode } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

export function mergeTheme<T extends object>(
  base: T,
  override?: DeepPartial<T>,
): T {
  if (!override) return base;

  const output: Record<string, unknown> = { ...(base as Record<string, unknown>) };

  Object.entries(override).forEach(([key, value]) => {
    const baseValue = output[key];
    if (isRecord(baseValue) && isRecord(value)) {
      output[key] = mergeTheme(baseValue, value as DeepPartial<typeof baseValue>);
    } else if (value !== undefined) {
      output[key] = value;
    }
  });

  return output as T;
}

export function createTheme(mode: ThemeMode, override?: ThemeInput): Theme {
  const base = mode === 'dark' ? darkTheme : lightTheme;
  const merged = mergeTheme(base, override as DeepPartial<Theme>);

  return {
    ...merged,
    mode,
    dark: mode === 'dark',
  };
}
