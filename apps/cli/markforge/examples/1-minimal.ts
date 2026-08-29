/**
 * Example 1: Minimal Programmatic Usage
 *
 * Compiles a Markdown string or file with zero configuration.
 * Uses default corporate styling and outputs to .temp/example-minimal/
 */
import { compileMarkdown } from "@masumdev/markforge";

async function run() {
  console.log("=== MarkForge: Minimal Programmatic Compilation ===");

  const markdown = `
# Minimal Programmatic Document

This document was generated programmatically with **MarkForge** using minimal configuration.

- Zero configuration required
- Auto-detects paper size and margins
- Generates Word DOCX, PDF, and HTML
`;

  const result = await compileMarkdown(markdown, {
    to: ["docx", "pdf", "html"],
    outputDir: "./.temp/example-minimal",
    metadata: {
      title: "Minimal Example Document",
      author: "Ma'sum",
    },
  });

  console.log(`Compilation completed in ${result.durationMs}ms:`);
  for (const file of result.files) {
    console.log(`- [${file.format.toUpperCase()}] ${file.fileName} (${file.sizeBytes} bytes)`);
  }
}

run().catch(console.error);
