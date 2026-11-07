import { describe, it, expect } from "bun:test";
import { injectPagedMediaStyles } from "../src/core/pdf/pdfBuilder.js";
import { DEFAULT_CONFIG } from "../src/config/loadConfig.js";

describe("pdfBuilder CSS escaping and page counter tokens", () => {
  it("escapes backslashes before double quotes in CSS content strings", () => {
    const rawHtml = "<html><head></head><body><h1>Document</h1></body></html>";
    const metadata = {
      header: {
        left: 'Path: C:\\Docs\\"Quarterly Report"',
      },
    };

    const result = injectPagedMediaStyles(rawHtml, DEFAULT_CONFIG, metadata);

    // CSS should contain escaped backslashes followed by escaped quote: \\\\\"
    expect(result).toContain("@top-left");
    expect(result).toContain('content: "Path: C:\\\\Docs\\\\\\"Quarterly Report\\"";');
  });

  it("handles complex strings with multiple quotes and trailing backslashes", () => {
    const rawHtml = "<html><head></head><body></body></html>";
    const metadata = {
      header: {
        center: 'Confidential: "Draft \\ Version 1.0"',
      },
    };

    const result = injectPagedMediaStyles(rawHtml, DEFAULT_CONFIG, metadata);
    expect(result).toContain('content: "Confidential: \\"Draft \\\\ Version 1.0\\"";');
  });

  it("expands single-brace page tokens {page} and {pages}", () => {
    const rawHtml = "<html><head></head><body></body></html>";
    const metadata = {
      footer: {
        right: "Page {page} of {pages}",
      },
    };

    const result = injectPagedMediaStyles(rawHtml, DEFAULT_CONFIG, metadata);
    expect(result).toContain('content: "Page " counter(page) " of " counter(pages);');
  });

  it("expands mustache page tokens {{page}} and {{pages}}", () => {
    const rawHtml = "<html><head></head><body></body></html>";
    const metadata = {
      footer: {
        right: "Page {{page}} of {{pages}}",
      },
    };

    const result = injectPagedMediaStyles(rawHtml, DEFAULT_CONFIG, metadata);
    expect(result).toContain('content: "Page " counter(page) " of " counter(pages);');
  });

  it("supports mustache tokens in non-bottom-right zones (e.g. bottom-center)", () => {
    const rawHtml = "<html><head></head><body></body></html>";
    const metadata = {
      footer: {
        center: "Page {{page}} of {{pages}}",
      },
    };

    const result = injectPagedMediaStyles(rawHtml, DEFAULT_CONFIG, metadata);
    expect(result).toContain("@bottom-center");
    expect(result).toContain('content: "Page " counter(page) " of " counter(pages);');
  });

  it("supports isolated {{page}} counter token without text prefix", () => {
    const rawHtml = "<html><head></head><body></body></html>";
    const metadata = {
      header: {
        right: "{{page}}",
      },
    };

    const result = injectPagedMediaStyles(rawHtml, DEFAULT_CONFIG, metadata);
    expect(result).toContain("@top-right");
    expect(result).toContain("content: counter(page);");
  });

  it("handles case-insensitive mustache tokens {{PAGE}} and {{PAGES}}", () => {
    const rawHtml = "<html><head></head><body></body></html>";
    const metadata = {
      footer: {
        right: "Sheet {{PAGE}} / {{PAGES}}",
      },
    };

    const result = injectPagedMediaStyles(rawHtml, DEFAULT_CONFIG, metadata);
    expect(result).toContain('content: "Sheet " counter(page) " / " counter(pages);');
  });

  it("provides default page counter when footer.right is omitted", () => {
    const rawHtml = "<html><head></head><body></body></html>";
    const result = injectPagedMediaStyles(rawHtml, DEFAULT_CONFIG, {});
    expect(result).toContain("@bottom-right");
    expect(result).toContain('content: "Page " counter(page) " of " counter(pages);');
  });
});
