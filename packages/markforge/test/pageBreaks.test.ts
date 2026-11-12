import { describe, it, expect } from "bun:test";
import { resolveDocumentConfig, normalizePageBreaks, DEFAULT_PAGE_BREAKS } from "../src/config/resolveConfig.js";
import { parseMarkdownDocument } from "../src/core/parser.js";
import { buildHtmlDocument } from "../src/core/html/htmlBuilder.js";
import { injectPagedMediaStyles } from "../src/core/pdf/pdfBuilder.js";

describe("PageBreaks & Pagination Module", () => {
  it("normalizes default pageBreaks when omitted", () => {
    const resolved = normalizePageBreaks(undefined);
    expect(resolved.avoidOrphanHeadings).toBe(DEFAULT_PAGE_BREAKS.avoidOrphanHeadings);
    expect(resolved.avoidInsideBlocks).toBe(DEFAULT_PAGE_BREAKS.avoidInsideBlocks);
    expect(resolved.repeatTableHeaders).toBe(DEFAULT_PAGE_BREAKS.repeatTableHeaders);
    expect(resolved.avoidInsideTableRows).toBe(DEFAULT_PAGE_BREAKS.avoidInsideTableRows);
    expect(resolved.orphans).toBe(DEFAULT_PAGE_BREAKS.orphans);
    expect(resolved.widows).toBe(DEFAULT_PAGE_BREAKS.widows);
    expect(resolved.beforeH1).toBe(DEFAULT_PAGE_BREAKS.beforeH1);
    expect(resolved.allowManualBreaks).toBe(DEFAULT_PAGE_BREAKS.allowManualBreaks);
  });

  it("normalizes custom pageBreaks from user config", () => {
    const resolved = normalizePageBreaks({
      beforeH1: true,
      beforeH2: true,
      orphans: 4,
      widows: 4,
    });
    expect(resolved.beforeH1).toBe(true);
    expect(resolved.beforeH2).toBe(true);
    expect(resolved.orphans).toBe(4);
    expect(resolved.widows).toBe(4);
    expect(resolved.avoidOrphanHeadings).toBe(true);
  });

  it("handles pageBreaks: false gracefully", () => {
    const resolved = normalizePageBreaks(false);
    expect(resolved.avoidOrphanHeadings).toBe(false);
    expect(resolved.avoidInsideBlocks).toBe(false);
    expect(resolved.repeatTableHeaders).toBe(false);
    expect(resolved.allowManualBreaks).toBe(false);
  });

  it("parses manual page break directives in markdown", () => {
    const md = `
# Section 1
Content 1

<!-- pagebreak -->

# Section 2
Content 2

\\pagebreak

:::pagebreak

<div class="pagebreak"></div>
`;
    const doc = parseMarkdownDocument(md);
    const pageBreakNodes = doc.nodes.filter((n) => n.type === "pageBreak");
    expect(pageBreakNodes.length).toBe(4);
  });

  it("renders manual pageBreak to html with print page-break style", async () => {
    const md = `
# Title
<!-- pagebreak -->
Next page content
`;
    const doc = parseMarkdownDocument(md);
    const resolved = resolveDocumentConfig(doc.metadata as Record<string, unknown>, {});
    const html = await buildHtmlDocument(doc, resolved);
    expect(html).toContain('class="markforge-page-break"');
    expect(html).toContain("break-before: page");
  });

  it("injects orphan heading prevention and repeating table headers into PDF styles", () => {
    const resolved = resolveDocumentConfig(
      {
        pageBreaks: {
          beforeH1: true,
          avoidOrphanHeadings: true,
          repeatTableHeaders: true,
        },
      },
      {}
    );
    const pagedHtml = injectPagedMediaStyles("<html><head></head><body><h1>Test</h1></body></html>", resolved);
    expect(pagedHtml).toContain("break-after: avoid !important");
    expect(pagedHtml).toContain("display: table-header-group !important");
    expect(pagedHtml).toContain(".markforge-content-body > h1 ~ h1");
  });
});
