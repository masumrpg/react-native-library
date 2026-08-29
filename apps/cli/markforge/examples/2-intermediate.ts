/**
 * Example 2: Intermediate Programmatic Usage
 *
 * Demonstrates themes, syntax highlighting palettes, TOC, custom margins,
 * and live progress logging callback.
 */
import {
  compileMarkdown,
  OutputFormat,
  Theme,
  SyntaxTheme,
  PaperSizeEnum,
} from "@masumdev/markforge";

async function run() {
  console.log("=== MarkForge: Intermediate Programmatic Compilation ===");

  const markdownContent = `
# Technical Architecture Overview

Welcome to the intermediate programmatic specification.

## Core Microservices

Here is the TypeScript microservice interface:

\`\`\`typescript
export interface ServiceNode {
  id: string;
  endpoint: string;
  activeConnections: number;
}
\`\`\`

> [!NOTE]
> All network traffic across nodes is encrypted via mTLS.
`;

  const result = await compileMarkdown(
    markdownContent,
    {
      to: [OutputFormat.DOCX, OutputFormat.PDF, OutputFormat.HTML],
      outputDir: "./.temp/example-intermediate",
      theme: Theme.CORPORATE,
      syntaxTheme: SyntaxTheme.DRACULA,
      paperSize: PaperSizeEnum.A4,
      toc: true,
      margins: {
        top: "2.5cm",
        bottom: "2.5cm",
        left: "2.5cm",
        right: "2.5cm",
      },
      metadata: {
        title: "Technical Architecture Overview",
        subtitle: "Microservices & Edge Network",
        author: "Ma'sum",
        company: "Masum Dev Technologies",
        version: "1.2.0",
      },
    },
    (status) => {
      console.log(`[PROGRESS] ${status}`);
    }
  );

  console.log(`\nCompiled ${result.files.length} documents in ${result.durationMs}ms:`);
  for (const file of result.files) {
    console.log(`- [${file.format.toUpperCase()}] ${file.fileName} (${file.sizeBytes} bytes)`);
  }
}

run().catch(console.error);
