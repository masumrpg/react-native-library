import type { ThemeProps, MermaidConfig } from "../../config/types.js";

/**
 * Determines if a hex color code represents a dark background.
 */
export function isDarkHex(hex?: string): boolean {
  if (!hex || typeof hex !== "string") return false;
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  }
  return false;
}

/**
 * Generates comprehensive, theme-adaptive Mermaid initialization options.
 * Synchronizes node fills, border accents, arrow lines, cluster backgrounds,
 * typography, and smooth Bezier curve interpolation with the active document theme.
 */
export function resolveMermaidConfig(
  themeProps: ThemeProps,
  userOptions?: MermaidConfig
): Record<string, unknown> {
  const isDark = isDarkHex(themeProps.backgroundColor);
  const primaryMain = themeProps.primaryDark || themeProps.primaryColor || "#009DA0";
  const primaryTint = themeProps.primaryLight || (isDark ? "#1E293B" : "#F0FDFA");
  const textColor = themeProps.textColor || (isDark ? "#F8FAFC" : "#0F172A");
  const borderColor = themeProps.borderColor || (isDark ? "#334155" : "#CBD5E1");
  const cardBg = themeProps.cardBackground || (isDark ? "#1E293B" : "#F8FAFC");
  const font =
    userOptions?.fontFamily ||
    themeProps.fontFamily ||
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const fontSize = `${userOptions?.fontSize ?? 13}px`;
  const curve = userOptions?.curve ?? "basis";

  const baseVariables: Record<string, string | number | boolean> = {
    fontFamily: font,
    fontSize,
    darkMode: isDark,

    // Primary nodes (flowchart, state, class)
    primaryColor: primaryTint,
    primaryTextColor: textColor,
    primaryBorderColor: primaryMain,
    nodeBorder: primaryMain,
    nodeTextColor: textColor,

    // Lines & Connectors
    lineColor: primaryMain,
    edgeLabelBackground: isDark ? "#0F172A" : "#FFFFFF",

    // Secondary & Backgrounds / Subgraphs / Clusters
    secondaryColor: cardBg,
    secondaryTextColor: textColor,
    secondaryBorderColor: borderColor,
    tertiaryColor: themeProps.backgroundColor || (isDark ? "#0F172A" : "#FFFFFF"),
    tertiaryTextColor: themeProps.textMuted || (isDark ? "#94A3B8" : "#64748B"),
    tertiaryBorderColor: borderColor,
    clusterBkg: cardBg,
    clusterBorder: primaryMain,

    // Sequence Diagrams
    actorBkg: primaryTint,
    actorBorder: primaryMain,
    actorTextColor: textColor,
    actorLineColor: primaryMain,
    signalColor: primaryMain,
    signalTextColor: textColor,
    labelBoxBkgColor: primaryTint,
    labelBoxBorderColor: primaryMain,
    labelTextColor: textColor,
    loopTextColor: textColor,
    activationBorderColor: primaryMain,
    activationBkgColor: primaryTint,
    sequenceNumberColor: "#FFFFFF",

    // Notes
    noteBkgColor: isDark ? "#422006" : "#FEF9C3",
    noteTextColor: isDark ? "#FEF08A" : "#713F12",
    noteBorderColor: isDark ? "#A16207" : "#FACC15",

    // State & ER
    stateLabelColor: textColor,
    stateBkg: primaryTint,
    labelColor: textColor,
    altBackground: cardBg,
  };

  // Merge any custom user variables
  if (userOptions?.themeVariables) {
    Object.assign(baseVariables, userOptions.themeVariables);
  }

  const selectedTheme = userOptions?.theme || (isDark ? "dark" : "default");

  return {
    startOnLoad: true,
    theme: selectedTheme,
    themeVariables: baseVariables,
    flowchart: {
      curve,
      htmlLabels: true,
      padding: 16,
      nodeSpacing: 45,
      rankSpacing: 45,
    },
    sequence: {
      actorFontSize: userOptions?.fontSize ?? 13,
      messageFontSize: userOptions?.fontSize ?? 13,
      showSequenceNumbers: userOptions?.showSequenceNumbers ?? true,
      boxMargin: 10,
      useMaxWidth: true,
    },
    state: {
      sizeUnit: 5,
    },
    er: {
      useMaxWidth: true,
    },
  };
}

