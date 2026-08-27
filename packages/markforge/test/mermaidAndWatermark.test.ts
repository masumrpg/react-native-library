import { describe, it, expect } from "bun:test";
import { parseMarkdownDocument } from "../src/core/parser.js";
import { buildHtmlDocument } from "../src/core/html/htmlBuilder.js";
import { buildDocxDocument } from "../src/core/docx/docxBuilder.js";

describe("Mermaid & Watermark Engine", () => {
  it("parses mermaid code blocks into mermaid AST nodes", () => {
    const md = "```mermaid\nflowchart TD\nA --> B\n```";
    const doc = parseMarkdownDocument(md);
    expect(doc.nodes.length).toBe(1);
    expect(doc.nodes[0].type).toBe("mermaid");
    expect(doc.nodes[0].text).toContain("A --> B");
  });

  it("does not render watermark by default", async () => {
    const doc = parseMarkdownDocument("# Normal Doc\nContent without watermark.");
    const html = await buildHtmlDocument(doc, {});
    expect(html).not.toContain("document-watermark");
  });

  it("renders watermark when explicitly configured", async () => {
    const doc = parseMarkdownDocument("# Secret Doc\nContent with watermark.");
    const html = await buildHtmlDocument(doc, {
      watermark: {
        text: "INTERNAL ONLY",
        color: "#33CDCF",
        opacity: 0.15,
        rotate: -30,
      },
    });
    expect(html).toContain("document-watermark");
    expect(html).toContain("INTERNAL ONLY");
    expect(html).toContain("#33CDCF");
    expect(html).toContain("rotate(-30deg)");
  });

  it("renders mermaid in HTML with mermaid script loader", async () => {
    const md = "```mermaid\nflowchart LR\nA --> B\n```";
    const doc = parseMarkdownDocument(md);
    const html = await buildHtmlDocument(doc, {});
    expect(html).toContain('class="mermaid"');
    expect(html).toContain("mermaid.min.js");
  });

  it("builds DOCX with mermaid diagram and fixed blockquote text", async () => {
    const md = `# Sample\n> "A document compiler should treat formatting as code."\n\n\`\`\`mermaid\nflowchart TD\nX --> Y\n\`\`\``;
    const doc = parseMarkdownDocument(md);
    const docxBuf = await buildDocxDocument(doc, {});
    expect(docxBuf).toBeInstanceOf(Buffer);
    expect(docxBuf.length).toBeGreaterThan(1000);
  });
});
