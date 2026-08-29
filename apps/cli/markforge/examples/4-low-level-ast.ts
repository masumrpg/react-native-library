/**
 * Example 4: Low-Level AST & In-Memory Buffer Builders
 *
 * Demonstrates direct low-level document compilation without writing files to disk.
 * Returns raw binary Buffers (DOCX, PDF) and HTML markup strings.
 */
import * as fs from "node:fs";
import {
  parseMarkdownDocument,
  buildDocxDocument,
  buildPdfDocument,
  buildHtmlDocument,
  resolveDocumentConfig,
  Theme,
} from "@masumdev/markforge";

async function run() {
  console.log("=== MarkForge: Low-Level AST & Buffer Pipeline ===");

  const rawMarkdown = `
# Low-Level In-Memory Compilation

This markdown is ingested directly into an AST node tree.

- Node parsing
- In-memory binary generation
- Direct buffer retrieval
`;

  // 1. Parse Markdown into structured AST
  const parsedDoc = parseMarkdownDocument(rawMarkdown);
  console.log(`- AST generated with ${parsedDoc.nodes.length} nodes and ${parsedDoc.tocEntries.length} TOC entries`);

  // 2. Resolve document configuration
  const resolvedConfig = resolveDocumentConfig(parsedDoc.metadata, {
    theme: Theme.CORPORATE,
    toc: true,
    metadata: {
      title: "In-Memory Buffer Spec",
      author: "Ma'sum",
    },
  });

  // 3. Build documents independently in parallel
  const [docxBuffer, pdfBuffer, htmlString] = await Promise.all([
    buildDocxDocument(parsedDoc, resolvedConfig),
    buildPdfDocument(parsedDoc, resolvedConfig),
    buildHtmlDocument(parsedDoc, resolvedConfig),
  ]);

  console.log(`- DOCX Buffer generated : ${docxBuffer.byteLength} bytes (PK header: ${docxBuffer.subarray(0, 4).toString("hex")})`);
  console.log(`- PDF Buffer generated  : ${pdfBuffer.byteLength} bytes (PDF header: ${pdfBuffer.subarray(0, 5).toString("utf-8")})`);
  console.log(`- HTML String generated : ${Buffer.byteLength(htmlString, "utf-8")} bytes`);

  // Optional: write to disk
  fs.mkdirSync("./.temp/example-ast", { recursive: true });
  fs.writeFileSync("./.temp/example-ast/in-memory-doc.docx", docxBuffer);
  fs.writeFileSync("./.temp/example-ast/in-memory-doc.pdf", pdfBuffer);
  fs.writeFileSync("./.temp/example-ast/in-memory-doc.html", htmlString, "utf-8");

  console.log("All in-memory buffers saved to ./.temp/example-ast/");
}

run().catch(console.error);
