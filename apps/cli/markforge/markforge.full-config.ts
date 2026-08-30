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
 * Any property that is optional or alternative is also presented as a commented line for quick toggling.
 */
export default defineConfig({
  // Target output formats (using OutputFormat enum or strings: "docx" | "pdf" | "html" | "png")
  to: [OutputFormat.DOCX, OutputFormat.PDF, OutputFormat.HTML],
  // to: [OutputFormat.PDF], // Single target compilation

  // Output directory where compiled documents will be saved
  outputDir: ".temp/output-full-spec",

  // Visual document theme (preset enum: CORPORATE, ACADEMIC, MODERN, MINIMAL, DRACULA, NORD, etc. or custom ThemeProps object)
  theme: Theme.CORPORATE,
  // Custom theme palette example (uncomment to override completely):
  // theme: {
  //   primaryColor: "#0D998D",
  //   primaryDark: "#0B7A70",
  //   primaryLight: "#ECFDFD",
  //   backgroundColor: "#FFFFFF",
  //   textColor: "#0F172A",
  //   textMuted: "#64748B",
  //   borderColor: "#E2E8F0",
  //   cardBackground: "#F8FAFC",
  //   codeBackground: "#1E293B",
  //   codeText: "#38BDF8",
  //   fontFamily: "Inter, -apple-system, sans-serif",
  //   fontMono: "Fira Code, monospace",
  // },

  // Page orientation (Orientation.PORTRAIT or Orientation.LANDSCAPE)
  orientation: Orientation.PORTRAIT,
  // orientation: Orientation.LANDSCAPE,

  // Standard paper size (A4, Letter, Legal, A3, A5)
  paperSize: PaperSizeEnum.A4,

  // Page margins (supports CSS units: "3cm", "25mm", "1in", or numbers in pt)
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

  // Dedicated Standalone Front Cover Page Builder
  coverPage: {
    enabled: true,
    preset: "modern", // Options: "modern" | "corporate-split" | "minimal" | "card"
    title: "{title}",
    subtitle: "{subtitle}",
    author: "{author}",
    company: "{company}",
    version: "v{version}",
    date: "{date}",
    badge: "CONFIDENTIAL SPECIFICATION",
    badgeColor: "#ECFDFD",
    badgeTextColor: "#0D998D",
    logo: "./assets/company-logo.png", // Company logo path or Base64 data URI
    logoWidth: 120, // Logo display width in px
    footerText: "Proprietary & Confidential — Masum Dev Technologies",
  },
  // coverPage: false, // Set to false to disable front cover page entirely

  // Hierarchical decimal section numbering (e.g. 1., 1.1, 1.1.1)
  numberHeadings: {
    enabled: true,
    depth: 3, // Max heading depth to number (H1..H3)
    skipH1: false, // Number from H1 downwards (set true if H1 is document title)
    prefix: "", // Optional prefix (e.g. "Section ")
  },
  // numberHeadings: false, // Set to false to disable section numbering

  // LaTeX Math Equation rendering ($inline$ and $$block$$)
  math: true,

  // PDF Document Security & Password Encryption
  // security: {
  //   userPassword: "masumdev_secret", // Password required to open document
  //   ownerPassword: "masumdev_admin", // Master password required to modify permissions
  //   permissions: {
  //     printing: "highResolution", // "highResolution" | "lowResolution" | false
  //     modifying: false,
  //     copying: true,
  //     annotating: true,
  //     fillingForms: true,
  //     contentAccessibility: true,
  //     documentAssembly: false,
  //   },
  // },
  // security: undefined, // Omit or leave undefined for unrestricted standard PDF

  // Watermark configuration (using WatermarkPosition enum or strings)
  watermark: {
    text: "{metakuda}",
    color: "#E11D48",
    opacity: 0.1,
    fontSize: 52,
    rotate: -45,
    position: WatermarkPosition.DIAGONAL, // "diagonal" | "center" | "top-right" | "bottom-right"
  },
  // watermark: false, // Set to false to disable watermark

  // Code block syntax highlighting theme (using SyntaxTheme enum or strings)
  syntaxTheme: SyntaxTheme.DRACULA,
  // syntaxTheme: "github-dark", // "github-dark" | "github-light" | "dracula" | "monokai" | "nord"

  // Assets and bundling flags
  embedImages: true,
  bundleHtml: true,

  // Document signature & approval blocks (1 to 4 signatory slots with customizable style and alignment)
  signatures: {
    align: "space-between", // "space-between" | "center" | "left" | "right"
    style: "line", // "line" | "box" | "clean"
    items: [
      {
        title: "Prepared by",
        name: "{author}",
        role: "Lead Platform Architect",
        date: "{date}",
        // signatureImage: "./assets/signatures/author.png", // Optional signature image
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
  // signatures: undefined, // Omit or set to undefined if no approval blocks required

  // Dedicated Standalone Back Cover / Closing Page
  backCover: {
    enabled: true,
    preset: "corporate", // Options: "modern" | "corporate" | "minimal" | "contact-card"
    title: "Thank You",
    subtitle: "Masum Dev Technologies — Next-Gen Cross-Platform Engineering",
    logo: "./assets/company-logo.png",
    logoWidth: 120,
    company: "{company}",
    address: "Jakarta, Indonesia",
    email: "contact@masumdev.com",
    // phone: "+62 812 3456 7890",
    website: "https://react-native-library-docs.netlify.app",
    // social: {
    //   github: "https://github.com/masumrpg",
    //   // twitter: "https://x.com/masumdev",
    //   // linkedin: "https://linkedin.com/in/masumdev",
    // },
    copyright: "Copyright (c) {year} {company}. All Rights Reserved.",
    // bgGradient: "#fff",
  },
  // backCover: false, // Set to false to disable back cover closing page

  // Fallback metadata dictionary
  metadata: {
    title: "Complete MarkForge Reference Manual",
    subtitle: "Enterprise Document Compiler & Visual Architecture",
    author: "Ma'sum",
    company: "Masum Dev Technologies",
    version: "1.0.0",
    date: "2026-08-29",
    lang: "en",
    metakuda: "Kuda"
  },

  // Custom external stylesheet path(s) to inject into HTML and PDF documents
  // css: ["./custom-styles.css"],

  // Live preview & watch development options
  watch: false, // Set to true to automatically re-compile when markdown files change
  serve: false, // Set to true to start the interactive Web Studio Preview server
  port: 4000,   // Custom port for live studio (default: 4000)
  open: false,  // Set to true to automatically launch the default browser
});
