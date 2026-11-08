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
 * Configured specifically for high-fidelity Enterprise PDF publication.
 */
export default defineConfig({
  // Global document metadata defaults
  title: "Enterprise Architecture Specification",
  subtitle: "Sistem Terdistribusi Berkeandalan Tinggi 2026",
  company: "PT Masum Teknologi Indonesia",
  author: "Ma'sum",
  version: "3.2.0",
  date: "2026-11-07",
  lang: "id",

  // Target compilation format: Exclusively PDF
  to: [OutputFormat.PDF],

  // Destination directory for generated PDF
  outputDir: ".temp/output",

  // Visual theme preset
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
    left: "DOKUMEN RAHASIA & BERHAK CIPTA",
    right: "Halaman {page} dari {pages}",
    divider: true,
    dividerColor: "#CBD5E1",
  },

  // Document formatting options
  toc: true,          // Automatic Table of Contents
  embedImages: true,  // Inline images directly into self-contained PDF
  math: true,         // KaTeX math rendering ($inline$ and $$block$$)
  numberHeadings: {
    enabled: true,
    depth: 3,
    skipH1: false,
  },

  // Advanced typography & page break control
  pageBreaks: {
    beforeH1: false,            // Set true to start every major chapter on a fresh page
    avoidOrphanHeadings: true,  // Prevent isolated headings at page bottom
    avoidInsideBlocks: true,    // Keep code blocks, callouts, and signatures intact
    repeatTableHeaders: true,   // Repeat <thead> on subsequent pages for long tables
    orphans: 3,                 // Minimum lines left at bottom of page
    widows: 3,                  // Minimum lines carried over to top of page
  },
});
