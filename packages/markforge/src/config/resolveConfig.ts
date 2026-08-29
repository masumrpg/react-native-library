import type {
  MarkforgeConfig,
  MarkforgeTheme,
  DocumentOrientation,
  PaperSize,
  PageMargins,
  HeaderFooterItem,
  HeaderFooterSlot,
  WatermarkOptions,
  SignatureAlign,
  SignatureStyle,
  SignatureItem,
  SignatureBlockConfig,
} from "./types.js";
import { DEFAULT_CONFIG } from "./loadConfig.js";

/**
 * Standard paper dimensions in Word Twips (1/20th of a point, 1440 twips = 1 inch).
 */
export const PAPER_DIMENSIONS_TWIP: Record<PaperSize, { width: number; height: number }> = {
  A4: { width: 11906, height: 16838 }, // 210mm x 297mm
  Letter: { width: 12240, height: 15840 }, // 8.5in x 11in
  Legal: { width: 12240, height: 20160 }, // 8.5in x 14in
  A3: { width: 16838, height: 23811 }, // 297mm x 420mm
  A5: { width: 8390, height: 11906 }, // 148mm x 210mm
};

/**
 * Converts CSS margin string (e.g. "2.5cm", "1in", "20mm", "20pt", 1440) to Word Twips.
 */
export function parseMarginToTwip(margin?: string | number, defaultTwip: number = 1440): number {
  if (typeof margin === "number") return margin;
  if (!margin) return defaultTwip;

  const str = margin.trim().toLowerCase();
  if (str.endsWith("cm")) {
    const cm = parseFloat(str);
    return isNaN(cm) ? defaultTwip : Math.round(cm * 566.929);
  }
  if (str.endsWith("mm")) {
    const mm = parseFloat(str);
    return isNaN(mm) ? defaultTwip : Math.round(mm * 56.6929);
  }
  if (str.endsWith("in") || str.endsWith("inch")) {
    const inch = parseFloat(str);
    return isNaN(inch) ? defaultTwip : Math.round(inch * 1440);
  }
  if (str.endsWith("pt")) {
    const pt = parseFloat(str);
    return isNaN(pt) ? defaultTwip : Math.round(pt * 20);
  }
  const val = parseFloat(str);
  return isNaN(val) ? defaultTwip : Math.round(val);
}

/**
 * Normalizes a margin value into a valid CSS unit string.
 */
export function formatMarginCss(margin?: string | number, defaultCss: string = "2.5cm"): string {
  if (margin === undefined || margin === null) return defaultCss;
  if (typeof margin === "number") return `${margin}pt`;
  const str = margin.trim();
  if (!str) return defaultCss;
  // If it's a raw number without unit, default to pt
  if (/^[0-9.]+$/.test(str)) return `${str}pt`;
  return str;
}

export interface NormalizedMargins {
  top: string;
  bottom: string;
  left: string;
  right: string;
  topTwip: number;
  bottomTwip: number;
  leftTwip: number;
  rightTwip: number;
}

export interface NormalizedWatermark {
  text: string;
  color: string;
  opacity: number;
  fontSize: number;
  rotate: number;
  position: "diagonal" | "center" | "top-right" | "bottom-right";
}

export interface NormalizedHeaderFooterZone {
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
}

export interface NormalizedHeaderFooter {
  left?: NormalizedHeaderFooterZone;
  center?: NormalizedHeaderFooterZone;
  right?: NormalizedHeaderFooterZone;
  font: string;
  size: number;
  color: string;
  divider: boolean;
  dividerColor: string;
}

export interface NormalizedSignatureItem {
  title?: string;
  name: string;
  role?: string;
  date?: string;
  image?: string;
  signatureHeight: number;
}

export interface NormalizedSignatureBlock {
  items: NormalizedSignatureItem[];
  align: SignatureAlign;
  style: SignatureStyle;
  borderColor: string;
  titleColor: string;
  nameColor: string;
  roleColor: string;
  spacingBefore: string;
  spacingBeforeTwip: number;
}

export interface ResolvedDocumentConfig {
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  version?: string;
  company?: string;
  lang: string;
  theme: MarkforgeTheme;
  orientation: DocumentOrientation;
  paperSize: PaperSize;
  paperDimensions: {
    widthTwip: number;
    heightTwip: number;
  };
  margins: NormalizedMargins;
  header?: NormalizedHeaderFooter;
  footer?: NormalizedHeaderFooter;
  toc: boolean;
  signatures?: NormalizedSignatureBlock;
  watermark?: NormalizedWatermark;
  css: string[];
  embedImages: boolean;
  bundleHtml: boolean;
  syntaxTheme: string;
}

/**
 * Replaces dynamic variables ({title}, {subtitle}, {author}, {version}, {date}, {company}) in text templates.
 */
export function replaceDocumentTokens(
  template: string = "",
  meta: {
    title?: string;
    subtitle?: string;
    author?: string;
    version?: string;
    date?: string;
    company?: string;
  }
): string {
  return template
    .replace(/\{title\}/gi, meta.title || "")
    .replace(/\{subtitle\}/gi, meta.subtitle || "")
    .replace(/\{author\}/gi, meta.author || "")
    .replace(/\{version\}/gi, meta.version || "")
    .replace(/\{date\}/gi, meta.date || "")
    .replace(/\{company\}/gi, meta.company || "");
}

/**
 * Normalizes watermark configuration into a consistent structured object.
 */
export function normalizeWatermark(
  rawWatermark?: string | WatermarkOptions | false
): NormalizedWatermark | undefined {
  if (!rawWatermark) {
    return undefined;
  }

  if (typeof rawWatermark === "string") {
    const text = rawWatermark.trim();
    if (!text) return undefined;
    return {
      text,
      color: "#94a3b8",
      opacity: 0.08,
      fontSize: 54,
      rotate: -45,
      position: "diagonal",
    };
  }

  if (typeof rawWatermark === "object") {
    if (!rawWatermark.text || !rawWatermark.text.trim()) return undefined;
    return {
      text: rawWatermark.text.trim(),
      color: rawWatermark.color || "#94a3b8",
      opacity: typeof rawWatermark.opacity === "number" ? rawWatermark.opacity : 0.08,
      fontSize: rawWatermark.fontSize || 54,
      rotate: typeof rawWatermark.rotate === "number" ? rawWatermark.rotate : -45,
      position: rawWatermark.position || "diagonal",
    };
  }

  return undefined;
}

/**
 * Normalizes an individual left, center, or right header/footer zone slot.
 */
export function normalizeHeaderFooterSlot(
  rawSlot: string | HeaderFooterSlot | undefined,
  parent: HeaderFooterItem | undefined,
  meta: {
    title?: string;
    subtitle?: string;
    author?: string;
    version?: string;
    date?: string;
    company?: string;
  }
): NormalizedHeaderFooterZone | undefined {
  if (!rawSlot) return undefined;

  if (typeof rawSlot === "string") {
    const text = replaceDocumentTokens(rawSlot, meta).trim();
    if (!text) return undefined;
    return {
      text,
      color: parent?.color || "#94A3B8",
      fontSize: parent?.size || 9,
      fontFamily: parent?.font || "Segoe UI",
      bold: false,
      italic: false,
    };
  }

  if (typeof rawSlot === "object") {
    const text = replaceDocumentTokens(rawSlot.text || "", meta).trim();
    if (!text) return undefined;
    return {
      text,
      color: rawSlot.color || parent?.color || "#94A3B8",
      fontSize: rawSlot.fontSize || parent?.size || 9,
      fontFamily: rawSlot.fontFamily || parent?.font || "Segoe UI",
      bold: Boolean(rawSlot.bold),
      italic: Boolean(rawSlot.italic),
    };
  }

  return undefined;
}

/**
 * Normalizes a header or footer item into a structured NormalizedHeaderFooter object.
 */
export function normalizeHeaderFooter(
  raw: HeaderFooterItem | undefined,
  meta: {
    title?: string;
    subtitle?: string;
    author?: string;
    version?: string;
    date?: string;
    company?: string;
  }
): NormalizedHeaderFooter | undefined {
  if (!raw) return undefined;

  const left = normalizeHeaderFooterSlot(raw.left, raw, meta);
  const center = normalizeHeaderFooterSlot(raw.center, raw, meta);
  const right = normalizeHeaderFooterSlot(raw.right, raw, meta);

  if (!left && !center && !right) return undefined;

  return {
    left,
    center,
    right,
    font: raw.font || "Segoe UI",
    size: raw.size || 9,
    color: raw.color || "#94A3B8",
    divider: Boolean(raw.divider),
    dividerColor: raw.dividerColor || "#E2E8F0",
  };
}

/**
 * Normalizes signature and approval block configuration.
 */
export function normalizeSignatures(
  raw?: SignatureBlockConfig | SignatureItem[],
  meta: Record<string, unknown> = {}
): NormalizedSignatureBlock | undefined {
  if (!raw) return undefined;

  let rawItems: SignatureItem[] = [];
  let rawConfig: Partial<SignatureBlockConfig> = {};

  if (Array.isArray(raw)) {
    rawItems = raw;
  } else if (typeof raw === "object" && Array.isArray(raw.items)) {
    rawItems = raw.items;
    rawConfig = raw;
  }

  if (rawItems.length === 0) return undefined;

  // Max 4 items supported in signature row/grid
  const cappedItems = rawItems.slice(0, 4);

  const items: NormalizedSignatureItem[] = cappedItems.map((item) => {
    const tokenCtx = meta as {
      title?: string;
      subtitle?: string;
      author?: string;
      version?: string;
      date?: string;
      company?: string;
    };
    const rawName = typeof item.name === "string" ? item.name : "";
    const name = replaceDocumentTokens(rawName, tokenCtx).trim();

    const title = item.title ? replaceDocumentTokens(item.title, tokenCtx).trim() : undefined;
    const role = item.role ? replaceDocumentTokens(item.role, tokenCtx).trim() : undefined;

    let dateStr: string | undefined;
    if (typeof item.date === "string") {
      dateStr = replaceDocumentTokens(item.date, tokenCtx).trim();
    } else if (item.date === true) {
      dateStr = (meta.date as string) || new Date().toISOString().split("T")[0];
    }

    let signatureHeight = 60;
    if (typeof item.signatureHeight === "number") {
      signatureHeight = item.signatureHeight;
    } else if (typeof item.signatureHeight === "string") {
      const parsed = parseFloat(item.signatureHeight);
      if (!isNaN(parsed)) signatureHeight = parsed;
    }

    return {
      title,
      name: name || "Authorized Signatory",
      role,
      date: dateStr,
      image: item.image,
      signatureHeight,
    };
  });

  const align: SignatureAlign =
    rawConfig.align || (items.length === 1 ? "right" : "space-between");
  const style: SignatureStyle = rawConfig.style || "line";
  const borderColor = rawConfig.borderColor || "#CBD5E1";
  const titleColor = rawConfig.titleColor || "#64748B";
  const nameColor = rawConfig.nameColor || "#0F172A";
  const roleColor = rawConfig.roleColor || "#64748B";

  const spacingBeforeRaw = rawConfig.spacingBefore ?? "2.5rem";
  const spacingBefore = formatMarginCss(spacingBeforeRaw, "2.5rem");
  const spacingBeforeTwip = parseMarginToTwip(spacingBeforeRaw, 600);

  return {
    items,
    align,
    style,
    borderColor,
    titleColor,
    nameColor,
    roleColor,
    spacingBefore,
    spacingBeforeTwip,
  };
}

/**
 * Centralized Single Source of Truth for resolving document configuration.
 * Priority hierarchy: Frontmatter metadata > Project Config File / User Config > DEFAULT_CONFIG
 */
export function resolveDocumentConfig(
  frontmatter: Record<string, unknown> = {},
  userConfig: MarkforgeConfig = {}
): ResolvedDocumentConfig {
  // 1. Merge metadata defaults from config with document frontmatter
  const configMeta = userConfig.metadata || {};
  const mergedMeta = { ...configMeta, ...frontmatter };

  const title = (mergedMeta.title as string) || "MarkForge Document";
  const subtitle = (mergedMeta.subtitle as string) || undefined;
  const author = Array.isArray(mergedMeta.author)
    ? (mergedMeta.author as string[]).join(", ")
    : (mergedMeta.author as string) || undefined;
  const date = (mergedMeta.date as string) || undefined;
  const version = (mergedMeta.version as string) || undefined;
  const company = (mergedMeta.company as string) || undefined;
  const lang = (mergedMeta.lang as string) || "en";

  const tokenContext = { title, subtitle, author, version, date, company };

  // 2. Visual Theme & Layout (Frontmatter > Config > Default)
  const theme = (mergedMeta.theme as MarkforgeTheme) || userConfig.theme || DEFAULT_CONFIG.theme;
  const orientation = (mergedMeta.orientation as DocumentOrientation) || userConfig.orientation || DEFAULT_CONFIG.orientation;
  const paperSize = ((mergedMeta.paperSize as PaperSize) || userConfig.paperSize || DEFAULT_CONFIG.paperSize) as PaperSize;

  // Paper Dimensions
  const baseDim = PAPER_DIMENSIONS_TWIP[paperSize] || PAPER_DIMENSIONS_TWIP.A4;
  const paperDimensions = orientation === "landscape"
    ? { widthTwip: baseDim.height, heightTwip: baseDim.width }
    : { widthTwip: baseDim.width, heightTwip: baseDim.height };

  // 3. Margins (Frontmatter.margins > userConfig.margins > DEFAULT_CONFIG.margins)
  const fmMargin = (mergedMeta.margins as PageMargins) || {};
  const cfgMargin = userConfig.margins || {};
  const defMargin = DEFAULT_CONFIG.margins || {};

  const topRaw = fmMargin.top ?? cfgMargin.top ?? defMargin.top ?? "2.5cm";
  const bottomRaw = fmMargin.bottom ?? cfgMargin.bottom ?? defMargin.bottom ?? "2.5cm";
  const leftRaw = fmMargin.left ?? cfgMargin.left ?? defMargin.left ?? "2.5cm";
  const rightRaw = fmMargin.right ?? cfgMargin.right ?? defMargin.right ?? "2.5cm";

  const margins: NormalizedMargins = {
    top: formatMarginCss(topRaw),
    bottom: formatMarginCss(bottomRaw),
    left: formatMarginCss(leftRaw),
    right: formatMarginCss(rightRaw),
    topTwip: parseMarginToTwip(topRaw),
    bottomTwip: parseMarginToTwip(bottomRaw),
    leftTwip: parseMarginToTwip(leftRaw),
    rightTwip: parseMarginToTwip(rightRaw),
  };

  // 4. Header & Footer (with token substitution)
  const rawHeader = (mergedMeta.header as HeaderFooterItem) || userConfig.header || DEFAULT_CONFIG.header;
  const rawFooter = (mergedMeta.footer as HeaderFooterItem) || userConfig.footer || DEFAULT_CONFIG.footer;

  const header = normalizeHeaderFooter(rawHeader, tokenContext);
  const footer = normalizeHeaderFooter(rawFooter, tokenContext);

  // 5. Table of Contents & Watermark
  const toc = typeof mergedMeta.toc === "boolean"
    ? mergedMeta.toc
    : typeof userConfig.toc === "boolean"
    ? userConfig.toc
    : DEFAULT_CONFIG.toc;

  const rawWatermark = mergedMeta.watermark !== undefined
    ? (mergedMeta.watermark as string | WatermarkOptions | false)
    : userConfig.watermark !== undefined
    ? userConfig.watermark
    : DEFAULT_CONFIG.watermark;

  const watermark = normalizeWatermark(rawWatermark);

  // 5.5 Signatures and Approval Block
  const rawSignatures = (mergedMeta.signatures as SignatureBlockConfig | SignatureItem[]) ||
    userConfig.signatures;
  const signatures = normalizeSignatures(rawSignatures, tokenContext);

  // 6. Custom CSS (Combine frontmatter.css + userConfig.css)
  const cssList: string[] = [];
  const addCss = (item?: string | string[]) => {
    if (!item) return;
    if (Array.isArray(item)) cssList.push(...item);
    else cssList.push(item);
  };
  addCss(userConfig.css);
  addCss(mergedMeta.css as string | string[] | undefined);

  // 7. Engine Flags
  const embedImages = typeof userConfig.embedImages === "boolean" ? userConfig.embedImages : DEFAULT_CONFIG.embedImages;
  const bundleHtml = typeof userConfig.bundleHtml === "boolean" ? userConfig.bundleHtml : DEFAULT_CONFIG.bundleHtml;
  const syntaxTheme = userConfig.syntaxTheme || DEFAULT_CONFIG.syntaxTheme || "github-dark";

  return {
    title,
    subtitle,
    author,
    date,
    version,
    company,
    lang,
    theme,
    orientation,
    paperSize,
    paperDimensions,
    margins,
    header,
    footer,
    toc,
    signatures,
    watermark,
    css: cssList,
    embedImages,
    bundleHtml,
    syntaxTheme,
  };
}
