import { describe, it, expect } from "bun:test";
import { resolveDocumentConfig } from "../src/config/resolveConfig.js";
import { compileMarkdown } from "../src/core/engine.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

describe("Unified Symmetrical Configuration & Frontmatter Routing", () => {
  it("resolves top-level root metadata directly in userConfig without needing metadata wrapper", () => {
    const resolved = resolveDocumentConfig(
      {},
      {
        title: "Root Title",
        subtitle: "Root Subtitle",
        author: "Root Author",
        company: "Root Company",
        version: "2.1.0",
        date: "2026-11-07",
        lang: "id-ID",
      }
    );

    expect(resolved.title).toBe("Root Title");
    expect(resolved.subtitle).toBe("Root Subtitle");
    expect(resolved.author).toBe("Root Author");
    expect(resolved.company).toBe("Root Company");
    expect(resolved.version).toBe("2.1.0");
    expect(resolved.date).toBe("2026-11-07");
    expect(resolved.lang).toBe("id-ID");
  });

  it("frontmatter overrides root-level userConfig metadata seamlessly", () => {
    const resolved = resolveDocumentConfig(
      {
        title: "Frontmatter Title",
        version: "3.0.0",
      },
      {
        title: "Root Title",
        company: "Shared Company",
        version: "1.0.0",
      }
    );

    expect(resolved.title).toBe("Frontmatter Title");
    expect(resolved.company).toBe("Shared Company");
    expect(resolved.version).toBe("3.0.0");
  });

  it("supports legacy nested metadata: { ... } with root-level precedence", () => {
    const resolved = resolveDocumentConfig(
      {},
      {
        title: "Explicit Root Title",
        metadata: {
          title: "Legacy Nested Title",
          company: "Legacy Company",
        },
      }
    );

    expect(resolved.title).toBe("Explicit Root Title");
    expect(resolved.company).toBe("Legacy Company");
  });

  it("frontmatter 'to' and 'outputDir' take precedence in compileMarkdown", async () => {
    const tmpDir = path.join(os.tmpdir(), `markforge-test-${Date.now()}`);
    fs.mkdirSync(tmpDir, { recursive: true });

    const mdContent = `---
title: Target Routing Spec
to:
  - txt
outputDir: ${tmpDir}
---

# Hello Target Routing
This document specifies outputDir and to in frontmatter.
`;

    // Global config has to: ["docx", "pdf"], but frontmatter specifies to: ["txt"]
    const result = await compileMarkdown(mdContent, {
      to: ["docx", "pdf"],
    });

    expect(result.files.length).toBe(1);
    expect(result.files[0].format).toBe("txt");
    expect(fs.existsSync(result.files[0].filePath)).toBe(true);

    // Clean up
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
