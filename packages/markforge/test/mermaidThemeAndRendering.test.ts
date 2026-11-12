import { describe, it, expect } from "bun:test";
import { resolveMermaidConfig, isDarkHex } from "../src/core/mermaid/mermaidTheme.js";
import { THEME_PRESETS } from "../src/config/types.js";
import { parseMarkdownDocument } from "../src/core/parser.js";
import { buildHtmlDocument } from "../src/core/html/htmlBuilder.js";
import { buildDocxDocument } from "../src/core/docx/docxBuilder.js";

describe("Theme-Adaptive Mermaid Engine", () => {
  it("detects dark and light backgrounds accurately with isDarkHex", () => {
    expect(isDarkHex("#000000")).toBe(true);
    expect(isDarkHex("#0F172A")).toBe(true);
    expect(isDarkHex("#1E293B")).toBe(true);
    expect(isDarkHex("#FFFFFF")).toBe(false);
    expect(isDarkHex("#F8FAFC")).toBe(false);
    expect(isDarkHex("#ECFDFD")).toBe(false);
  });

  it("resolves corporate theme variables and sets smooth curve: basis", () => {
    const config = resolveMermaidConfig(THEME_PRESETS.corporate);
    expect(config.theme).toBe("default");
    expect(config.startOnLoad).toBe(true);

    const vars = config.themeVariables as Record<string, unknown>;
    expect(vars.primaryColor).toBe(THEME_PRESETS.corporate.primaryLight);
    expect(vars.primaryBorderColor).toBe(THEME_PRESETS.corporate.primaryDark);
    expect(vars.lineColor).toBe(THEME_PRESETS.corporate.primaryDark);
    expect(vars.nodeTextColor).toBe(THEME_PRESETS.corporate.textColor);

    const flowchart = config.flowchart as Record<string, unknown>;
    expect(flowchart.curve).toBe("basis");
    expect(flowchart.htmlLabels).toBe(true);

    const sequence = config.sequence as Record<string, unknown>;
    expect(sequence.showSequenceNumbers).toBe(true);
  });

  it("supports user-defined curve and custom theme variable overrides", () => {
    const customConfig = resolveMermaidConfig(THEME_PRESETS.academic, {
      curve: "linear",
      fontSize: 14,
      showSequenceNumbers: false,
      themeVariables: {
        primaryColor: "#E0F2FE",
      },
    });

    const vars = customConfig.themeVariables as Record<string, unknown>;
    expect(vars.primaryColor).toBe("#E0F2FE");

    const flowchart = customConfig.flowchart as Record<string, unknown>;
    expect(flowchart.curve).toBe("linear");

    const sequence = customConfig.sequence as Record<string, unknown>;
    expect(sequence.showSequenceNumbers).toBe(false);
  });

  it("wraps diagrams in .markforge-mermaid-container and injects theme-adaptive script in HTML", async () => {
    const md = `
# System Flow
\`\`\`mermaid
flowchart TD
  A[Client] --> B[Server]
\`\`\`
`;
    const doc = parseMarkdownDocument(md);
    const html = await buildHtmlDocument(doc, {
      theme: "corporate",
    });

    expect(html).toContain('class="markforge-mermaid-container"');
    expect(html).toContain('class="mermaid"');
    expect(html).toContain("mermaid.esm.min.mjs");
    expect(html).toContain('"theme": "default"');
    expect(html).toContain('"curve": "basis"');
    expect(html).toContain(THEME_PRESETS.corporate.primaryDark ?? "#009DA0");
  });

  it("builds DOCX containing themed Mermaid diagram without errors", async () => {
    const md = `
# DOCX Architecture
\`\`\`mermaid
sequenceDiagram
  autonumber
  Alice->>Bob: Hello
  Bob-->>Alice: Hi
\`\`\`
`;
    const doc = parseMarkdownDocument(md);
    const docxBuf = await buildDocxDocument(doc, {
      theme: "corporate",
    });

    expect(docxBuf).toBeInstanceOf(Buffer);
    expect(docxBuf.length).toBeGreaterThan(1000);
  });
});
