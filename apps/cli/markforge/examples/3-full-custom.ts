/**
 * Example 3: Full Enterprise Programmatic Usage
 *
 * Demonstrates 100% of all properties:
 * - Dynamic metadata tokens ({title}, {author}, {company}, {version}, {date}, {page}, {pages})
 * - Per-zone header and footer customization (left, center, right, dividers)
 * - 100% unselectable vector watermark (Canvas-to-PNG raster)
 * - Signatures and approval blocks (Lembar Pengesahan)
 * - Custom ThemeProps color tokens
 * - Live progress callback
 */
import {
  compileMarkdown,
  OutputFormat,
  Orientation,
  PaperSizeEnum,
  SyntaxTheme,
  type MarkforgeConfig,
} from "@masumdev/markforge";

async function run() {
  console.log("=== MarkForge: Full Enterprise Programmatic Compilation ===");

  const markdown = `---
title: "Enterprise Cloud Infrastructure Agreement"
subtitle: "High-Availability Multi-Region Architecture"
author: "Ma'sum"
company: "Masum Dev Technologies"
version: "2.0.0"
date: "2026-08-29"
lang: "en"
---

# Executive Summary

This formal document verifies all enterprise capabilities of the MarkForge engine.

## Infrastructure Diagram

\`\`\`mermaid
flowchart LR
  Client[Web Client] --> Gateway[API Gateway]
  Gateway --> ServiceA[Auth Service]
  Gateway --> ServiceB[Billing Service]
\`\`\`

## Configuration Code

\`\`\`typescript
export const clusterConfig = {
  region: "ap-southeast-1",
  nodes: 12,
  ha: true,
};
\`\`\`

> [!IMPORTANT]
> Formal authorization signatures are attached at the end of this document.
`;

  const config: MarkforgeConfig = {
    to: [OutputFormat.DOCX, OutputFormat.PDF, OutputFormat.HTML],
    outputDir: "./.temp/example-full",
    orientation: Orientation.PORTRAIT,
    paperSize: PaperSizeEnum.A4,
    toc: true,
    syntaxTheme: SyntaxTheme.GITHUB_DARK,
    embedImages: true,
    bundleHtml: true,

    // Custom Theme Props Palette
    theme: {
      primaryColor: "#0D998D",
      primaryDark: "#008073",
      primaryLight: "#D9F1F0",
      backgroundColor: "#FFFFFF",
      textColor: "#0F172A",
      textMuted: "#64748B",
      borderColor: "#E2E8F0",
      cardBackground: "#F8FAFC",
      codeBackground: "#0F172A",
      codeText: "#F8FAFC",
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      fontMono: "'Cascadia Code', Consolas, monospace",
    },

    margins: {
      top: "3cm",
      bottom: "3cm",
      left: "2.5cm",
      right: "2.5cm",
    },

    // 100% Unselectable PDF & Visual Watermark
    watermark: {
      text: "CONFIDENTIAL DRAFT",
      color: "#E11D48",
      opacity: 0.08,
      fontSize: 52,
      rotate: -45,
    },

    // Custom Header Zones with Dynamic Tokens
    header: {
      left: {
        text: "{company} | {title}",
        color: "#0D998D",
        fontSize: 9,
        bold: true,
      },
      center: "Confidential Reference",
      right: {
        text: "v{version}",
        color: "#94A3B8",
        fontSize: 8.5,
        italic: true,
      },
      divider: true,
      dividerColor: "#CBD5E1",
    },

    // Custom Footer Zones with Dynamic Tokens & Page Numbering
    footer: {
      left: {
        text: "Author: {author}",
        color: "#64748B",
        fontSize: 8.5,
      },
      center: "{date}",
      right: {
        text: "Page {page} of {pages}",
        color: "#0D998D",
        fontSize: 9,
        bold: true,
      },
      divider: true,
      dividerColor: "#CBD5E1",
    },

    // Formal Signatures & Approval Block (Lembar Pengesahan)
    signatures: {
      align: "space-between",
      style: "line",
      borderColor: "#CBD5E1",
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
          role: "Head of Infrastructure",
          date: "{date}",
        },
        {
          title: "Approved by",
          name: "Dr. Alexander Wright",
          role: "Chief Technology Officer",
          date: true,
        },
      ],
    },
  };

  const result = await compileMarkdown(markdown, config, (msg) => {
    console.log(`[COMPILING] ${msg}`);
  });

  console.log(`\nCompilation successful in ${result.durationMs}ms:`);
  for (const f of result.files) {
    console.log(`- [${f.format.toUpperCase()}] ${f.filePath} (${f.sizeBytes} bytes)`);
  }
}

run().catch(console.error);
