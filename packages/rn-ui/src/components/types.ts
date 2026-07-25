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
