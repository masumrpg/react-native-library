import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import {
  parseMarkdown,
  buildHtmlDocument,
  buildDocxDocument,
  buildPdfDocument,
  startPreviewServer,
  renderMathToHtml,
  resolveDocumentConfig,
  normalizeCoverPage,
  normalizeBackCover,
  normalizeNumberHeadings,
  normalizeSecurity,
} from "../src/index.js";

describe("MarkForge Enterprise Features", () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "markforge_test_"));

  it("Feature 1: Cover Page Builder (Resolution & HTML/DOCX)", async () => {
    const directCover = normalizeCoverPage({ enabled: true, preset: "card", title: "Direct Title" });
    expect(directCover?.preset).toBe("card");
    expect(directCover?.title).toBe("Direct Title");

    const md = `---
title: "Quarterly Financial Report"
subtitle: "Q3 Executive Summary"
author: "Ma'sum"
company: "Enterprise Corp"
coverPage:
  enabled: true
  preset: "modern"
  badge: "CONFIDENTIAL"
  footerText: "Proprietary & Confidential - 2026"
---
# Executive Summary
Document contents after cover page.
`;
    const doc = parseMarkdown(md);
    const resolved = resolveDocumentConfig(doc.metadata as Record<string, unknown>, {});

    expect(resolved.coverPage).toBeDefined();
    expect(resolved.coverPage?.preset).toBe("modern");
    expect(resolved.coverPage?.badge).toBe("CONFIDENTIAL");
    expect(resolved.coverPage?.company).toBe("Enterprise Corp");

    const html = await buildHtmlDocument(doc, {});
    expect(html).toContain("markforge-cover cover-modern");
    expect(html).toContain("CONFIDENTIAL");
    expect(html).toContain("Quarterly Financial Report");
    expect(html).toContain("Executive Summary");

    const docxBuf = await buildDocxDocument(doc, {});
    expect(docxBuf.length).toBeGreaterThan(500);
  });

  it("Feature 2: Math & LaTeX Equation Rendering ($inline$ and $$block$$)", async () => {
    const inlineRes = renderMathToHtml("E = mc^2", false);
    expect(inlineRes).toContain("katex");

    const blockRes = renderMathToHtml("\\int_0^\\infty e^{-x} dx = 1", true);
    expect(blockRes).toContain("katex-display");

    const md = `# Physics Formula\n\nThe mass-energy equivalence is $E = mc^2$.\n\n$$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n`;
    const doc = parseMarkdown(md);
    expect(doc.nodes.some((n) => n.type === "mathBlock")).toBe(true);

    const html = await buildHtmlDocument(doc, {});
    expect(html).toContain("katex");
  });

  it("Feature 3: Multi-Column Container Directives (:::columns / :::col)", async () => {
    const md = `# Multi Column Section

:::columns 2
:::col
### Column Left
This is the left column content.
:::
:::col
### Column Right
This is the right column content.
:::
:::
`;
    const doc = parseMarkdown(md);
    const colNode = doc.nodes.find((n) => n.type === "columns");
    expect(colNode).toBeDefined();
    expect(colNode?.columnsCount).toBe(2);
    expect(colNode?.children?.length).toBe(2);

    const html = await buildHtmlDocument(doc, {});
    expect(html).toContain("markforge-columns");
    expect(html).toContain("Column Left");
    expect(html).toContain("Column Right");

    const docxBuf = await buildDocxDocument(doc, {});
    expect(docxBuf.length).toBeGreaterThan(500);
  });

  it("Feature 4: Interactive Live-Reload Preview Server", async () => {
    const sampleMdPath = path.join(tmpDir, "server-test.md");
    fs.writeFileSync(sampleMdPath, "# Hello Preview Server\nLive preview content.", "utf-8");

    const serverInstance = await startPreviewServer({
      filePath: sampleMdPath,
      port: 39123,
      open: false,
    });

    expect(serverInstance.port).toBe(39123);
    expect(serverInstance.url).toBe("http://localhost:39123");

    // Fetch index Studio UI
    const indexRes = await fetch("http://localhost:39123/");
    expect(indexRes.status).toBe(200);
    const indexHtml = await indexRes.text();
    expect(indexHtml).toContain("MARKFORGE STUDIO");
    expect(indexHtml).toContain("Ma'sum");
    expect(indexHtml).toContain("code-editor");

    // Test API: Get File Content
    const getRes = await fetch("http://localhost:39123/api/file-content");
    expect(getRes.status).toBe(200);
    const getData = (await getRes.json()) as { content: string; fileName: string };
    expect(getData.content).toContain("Hello Preview Server");

    // Test API: Save File Content
    const saveRes = await fetch("http://localhost:39123/api/save-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: "# Updated Content\n\nLive updated content." }),
    });
    expect(saveRes.status).toBe(200);
    const saveData = (await saveRes.json()) as { success: boolean };
    expect(saveData.success).toBe(true);

    // Fetch document content frame
    const docRes = await fetch("http://localhost:39123/document-content");
    expect(docRes.status).toBe(200);
    const docHtml = await docRes.text();
    expect(docHtml).toContain("Updated Content");
    expect(docHtml).toContain("Live updated content.");

    await serverInstance.close();
  });

  it("Feature 5: Hierarchical Section Numbering (numberHeadings)", () => {
    const directHeadings = normalizeNumberHeadings({ enabled: true, depth: 2, skipH1: true });
    expect(directHeadings?.enabled).toBe(true);
    expect(directHeadings?.skipH1).toBe(true);

    const md = `---
numberHeadings:
  enabled: true
  depth: 3
  skipH1: false
---
# Introduction
## Background
### Details
# Methodology
## Approach
`;
    const doc = parseMarkdown(md);
    const headings = doc.nodes.filter((n) => n.type === "heading");

    expect(headings[0].text).toBe("1. Introduction");
    expect(headings[1].text).toBe("1.1. Background");
    expect(headings[2].text).toBe("1.1.1. Details");
    expect(headings[3].text).toBe("2. Methodology");
    expect(headings[4].text).toBe("2.1. Approach");

    // Check TOC entries match numbering
    expect(doc.tocEntries[0].text).toBe("1. Introduction");
    expect(doc.tocEntries[1].text).toBe("1.1. Background");
  });

  it("Feature 6: Footnotes & Endnotes ([^1] and [^1]: text)", async () => {
    const md = `Here is a statement with a footnote[^alpha] and another one[^beta].

[^alpha]: This is the first footnote explanation.
[^beta]: This is the second footnote explanation with **bold** text.
`;
    const doc = parseMarkdown(md);
    expect(doc.footnoteDefs.length).toBe(2);
    expect(doc.footnoteDefs[0].id).toBe("alpha");
    expect(doc.footnoteDefs[1].id).toBe("beta");

    const html = await buildHtmlDocument(doc, {});
    expect(html).toContain('class="markforge-fnref"');
    expect(html).toContain('class="markforge-footnotes"');
    expect(html).toContain("first footnote explanation");
    expect(html).toContain("second footnote explanation");

    const docxBuf = await buildDocxDocument(doc, {});
    expect(docxBuf.length).toBeGreaterThan(500);
  });

  it("Feature 7: PDF Security & Metadata Normalization", async () => {
    const sec = normalizeSecurity({
      userPassword: "user123",
      ownerPassword: "owner123",
      permissions: { printing: "highResolution", copying: false },
    });

    expect(sec).toBeDefined();
    expect(sec?.userPassword).toBe("user123");
    expect(sec?.permissions?.copying).toBe(false);

    const md = `# Document Security Test\nContent protected by policy.\n`;
    const doc = parseMarkdown(md);
    const pdfBuf = await buildPdfDocument(doc, {
      metadata: { title: "Secure Doc", author: "Ma'sum" },
      security: sec,
    });

    expect(pdfBuf.length).toBeGreaterThan(500);
  });

  it("Feature 8: Back Cover / Closing Page Builder (Resolution & HTML/DOCX)", async () => {
    const directBack = normalizeBackCover({
      enabled: true,
      preset: "corporate",
      title: "Contact & Legal Disclosures",
      email: "contact@masumdev.com",
      website: "https://masumdev.com",
      company: "Masum Dev Technologies",
      social: { github: "https://github.com/masumrpg" },
    });

    expect(directBack).toBeDefined();
    expect(directBack?.preset).toBe("corporate");
    expect(directBack?.title).toBe("Contact & Legal Disclosures");
    expect(directBack?.email).toBe("contact@masumdev.com");
    expect(directBack?.social?.github).toBe("https://github.com/masumrpg");
    expect(directBack?.copyright).toContain("Masum Dev Technologies");

    const md = `---
title: "Project Alpha Final Proposal"
author: "Ma'sum"
company: "Masum Dev Technologies"
backCover:
  enabled: true
  preset: "modern"
  title: "Thank You For Your Partnership"
  subtitle: "We look forward to transforming mobile experiences together."
  email: "hello@masumdev.com"
  phone: "+62 812 3456 7890"
  address: "Jakarta, Indonesia"
  website: "https://masumdev.com"
  social:
    github: "https://github.com/masumrpg"
    twitter: "https://twitter.com/masumrpg"
---
# Main Content
Body paragraph before closing page.
`;
    const doc = parseMarkdown(md);
    const resolved = resolveDocumentConfig(doc.metadata as Record<string, unknown>, {});

    expect(resolved.backCover).toBeDefined();
    expect(resolved.backCover?.enabled).toBe(true);
    expect(resolved.backCover?.preset).toBe("modern");
    expect(resolved.backCover?.email).toBe("hello@masumdev.com");

    const html = await buildHtmlDocument(doc, {});
    expect(html).toContain('class="markforge-back-cover back-modern"');
    expect(html).toContain("Thank You For Your Partnership");
    expect(html).toContain("hello@masumdev.com");
    expect(html).toContain("https://github.com/masumrpg");

    const docxBuf = await buildDocxDocument(doc, {});
    expect(docxBuf.length).toBeGreaterThan(1000);
  });

  it("Metadata Cascading Priority: Frontmatter vs Config File", () => {
    const configFromDisk = {
      title: "Config Default Title",
      author: "Config Author",
      company: "Masum Dev Technologies Corp",
      version: "1.0.0",
      lang: "en",
    };

    const frontmatterFromDoc = {
      title: "Overridden Frontmatter Title",
      author: "Ma'sum RPG",
      // Notice: company, version, and lang are omitted from frontmatter
    };

    const resolved = resolveDocumentConfig(frontmatterFromDoc, {
      metadata: configFromDisk,
    });

    // 1. Frontmatter overrides config title & author
    expect(resolved.title).toBe("Overridden Frontmatter Title");
    expect(resolved.author).toBe("Ma'sum RPG");

    // 2. Config fills in omitted company, version, and lang
    expect(resolved.company).toBe("Masum Dev Technologies Corp");
    expect(resolved.version).toBe("1.0.0");
    expect(resolved.lang).toBe("en");
  });
});
