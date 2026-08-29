import {
  defineConfig,
  OutputFormat,
  Theme,
  Orientation,
  PaperSizeEnum,
  SyntaxTheme,
  WatermarkPosition,
} from "@masumdev/markforge";

/**
 * MarkForge Complete Specification Configuration Sample
 * Demonstrates 100% of all configurable properties in MarkforgeConfig with full Enum autocompletion.
 */
export default defineConfig({
  // Target output formats (using OutputFormat enum or strings)
  to: [OutputFormat.DOCX, OutputFormat.PDF, OutputFormat.HTML],

  // Output directory
  outputDir: ".temp/output-full-spec",

  // Visual document theme (using Theme.CORPORATE preset or a custom ThemeProps object)
  theme: Theme.CORPORATE,

  // Page orientation (using Orientation enum or strings)
  orientation: Orientation.PORTRAIT,

  // Standard paper size (using PaperSizeEnum or strings)
  paperSize: PaperSizeEnum.A4,

  // Page margins with CSS unit or pt numbers
  margins: {
    top: "3cm",
    bottom: "2.5cm",
    left: "2.5cm",
    right: "2.5cm",
  },

  // Document running headers with dynamic variable substitution & per-zone slot styling
  header: {
    // Left slot: Can be a plain string template OR a rich HeaderFooterSlot object
    left: {
      text: "{company}",
      color: "#0D998D",
      fontSize: 9,
      fontFamily: "Inter, Segoe UI, sans-serif",
      bold: true,
    },
    // Center slot: Plain string template using default header styles
    center: "Internal",
    // Right slot: Custom colored and italicized version tag
    right: {
      text: "v{version}",
      color: "#94A3B8",
      fontSize: 8.5,
      italic: true,
    },
    // Horizontal separator line under header
    divider: false,
  },

  // Document running footers with dynamic page numbering & per-zone slot styling
  footer: {
    // Left slot: Author metadata token
    left: {
      text: "Author: {author}",
      color: "#64748B",
      fontSize: 8.5,
    },
    // Center slot: Document generation date token
    center: {
      text: "{date}",
      color: "#94A3B8",
      fontSize: 8.5,
      italic: true,
    },
    // Right slot: Dynamic page numbering token with custom brand color
    right: {
      text: "Page {page} of {pages}",
      color: "#0D998D",
      fontSize: 9,
      bold: true,
    },
    // Horizontal separator line above footer
    divider: false,
  },

  // Automatic Table of Contents generation
  toc: true,

  // Watermark configuration (using WatermarkPosition enum or strings)
  watermark: {
    text: "CONFIDENTIAL DRAFT",
    color: "#E11D48",
    opacity: 0.1,
    fontSize: 52,
    rotate: -45,
    position: WatermarkPosition.DIAGONAL,
  },

  // Code block syntax highlighting theme (using SyntaxTheme enum or strings)
  syntaxTheme: SyntaxTheme.DRACULA,

  // Assets and bundling flags
  embedImages: true,
  bundleHtml: true,

  // Document signature & approval blocks (1 to 4 signatory slots with customizable style and alignment)
  signatures: {
    align: "space-between",
    style: "line",
    items: [
      {
        title: "Prepared by",
        name: "{author}",
        role: "Lead Platform Architect",
        date: "{date}",
      },
      {
        title: "Reviewed by",
        name: "Sarah Jenkins",
        role: "Head of Engineering",
        date: "{date}",
      },
      {
        title: "Approved by",
        name: "Dr. Alexander Wright",
        role: "Chief Technology Officer",
        date: "{date}",
      },
    ],
  },

  // Fallback metadata dictionary
  metadata: {
    title: "Complete MarkForge Reference Manual",
    subtitle: "Enterprise Document Compiler & Visual Architecture",
    author: "Ma'sum",
    company: "Masum Dev Technologies",
    version: "1.0.0",
    date: "2026-08-29",
    lang: "en",
  },
});
