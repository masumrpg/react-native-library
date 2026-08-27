import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { compileMarkdown, formatServerTimestamp } from "../src/core/engine.js";

describe("engine > formatServerTimestamp", () => {
  it("formats server timestamp with timezone offset", () => {
    const str = formatServerTimestamp();
    expect(str).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \(GMT[+-]\d{2}:\d{2}\)$/);
  });
});

describe("engine > compileMarkdown", () => {
  it("compiles markdown content into DOCX, PDF, and HTML files", async () => {
    const tmpDir = path.resolve(process.cwd(), ".temp/markforge-engine-test");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const mdFile = path.join(tmpDir, "report.md");
    fs.writeFileSync(
      mdFile,
      `---
title: "Sample Report"
author: "Ma'sum"
date: "2026-08-27"
---

# Heading 1

This is a **test document** compiled via *MarkForge*.

> [!NOTE]
> Compilation should produce 3 files.

| Item | Value |
| :--- | ---: |
| A | 100 |
`
    );

    const progressMessages: string[] = [];
    const result = await compileMarkdown(
      mdFile,
      {
        to: ["docx", "pdf", "html"],
        outputDir: tmpDir,
      },
      (msg) => progressMessages.push(msg)
    );

    expect(result.errors).toHaveLength(0);
    expect(result.files).toHaveLength(3);
    expect(result.files.some((f) => f.format === "docx" && fs.existsSync(f.filePath))).toBe(true);
    expect(result.files.some((f) => f.format === "pdf" && fs.existsSync(f.filePath))).toBe(true);
    expect(result.files.some((f) => f.format === "html" && fs.existsSync(f.filePath))).toBe(true);
    expect(progressMessages.length).toBeGreaterThan(0);

    // cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
