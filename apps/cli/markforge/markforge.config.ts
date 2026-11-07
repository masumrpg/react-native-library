import {
  defineConfig,
  OutputFormat,
  Theme,
  Orientation,
  PaperSizeEnum,
  SyntaxTheme,
} from "@masumdev/markforge";

/**
 * Single Unified MarkForge Configuration
 * All global settings and document defaults are defined here in one type-safe file.
 */
export default defineConfig({
  // Global document metadata defaults (can be overridden per markdown in frontmatter)
  title: "Enterprise Architecture Specification",
  company: "Masum Dev Technologies",
  author: "Ma'sum",
  version: "1.0.0",
  lang: "en",

  // Target compilation formats: DOCX, PDF, HTML, and Plain Text TXT
  to: [OutputFormat.DOCX, OutputFormat.PDF, OutputFormat.HTML, OutputFormat.TXT],

  // Destination directory for all generated documents
  outputDir: ".temp/output",

  // Visual theme preset: Theme.CORPORATE | Theme.ACADEMIC | Theme.GITHUB | Theme.MINIMAL
  theme: Theme.CORPORATE,

  // Syntax highlighting theme for code blocks
  syntaxTheme: SyntaxTheme.GITHUB_DARK,

  // Page geometry and layout
  orientation: Orientation.PORTRAIT,
  paperSize: PaperSizeEnum.A4,
  margins: {
    top: "3cm",
    bottom: "2.8cm",
    left: "2.5cm",
    right: "2.5cm",
  },

  // Running headers across pages with dynamic token interpolation & divider line
  header: {
    left: "{company}",
    center: "{title}",
    right: "v{version}",
    divider: true,
    dividerColor: "#009DA0",
  },

  // Running footers with automated page counter & divider line
  footer: {
    left: "Confidential & Proprietary",
    right: "Page {page} of {pages}",
    divider: true,
    dividerColor: "#E2E8F0",
  },

  // Document formatting options
  toc: true,          // Automatic Table of Contents
  embedImages: true,  // Inline images directly into self-contained files
  math: true,         // KaTeX math rendering ($inline$ and $$block$$)

  // ---------------------------------------------------------------------------
  // Optional Enterprise Features (can also be configured directly in .md frontmatter):
  // ---------------------------------------------------------------------------
  // watermark: {
  //   text: "STRICTLY CONFIDENTIAL",
  //   color: "#E11D48",
  //   opacity: 0.08,
  //   fontSize: 48,
  //   rotate: -45,
  // },
  // coverPage: {
  //   enabled: true,
  //   preset: "modern", // "modern" | "corporate-split" | "minimal" | "card"
  //   logo: "./assets/company-logo.png",
  //   logoWidth: 160,
  //   badge: "OFFICIAL MASTER SPECIFICATION",
  // },
  // backCover: {
  //   enabled: true,
  //   preset: "corporate",
  //   company: "Masum Global Cloud Technologies, Inc.",
  //   website: "https://react-native-library-docs.vercel.app/markforge/",
  //   copyright: "© 2026 Masum Global Cloud Technologies, Inc.",
  // },
  // numberHeadings: {
  //   enabled: true,
  //   depth: 3,
  //   skipH1: false,
  // },
});
