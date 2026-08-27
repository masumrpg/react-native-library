import { describe, it, expect } from "bun:test";
import {
  tokenizeCodeLine,
  highlightCodeToHtml,
  SYNTAX_COLORS,
} from "../src/core/syntax/syntaxHighlighter.js";

describe("syntaxHighlighter", () => {
  it("tokenizes JavaScript / TypeScript keywords and strings", () => {
    const tokens = tokenizeCodeLine('import { markforge } from "@masumdev/markforge";', "typescript");
    
    expect(tokens.length).toBeGreaterThan(3);
    const importToken = tokens.find((t) => t.text === "import");
    expect(importToken?.type).toBe("keyword");
    expect(importToken?.colorHex).toBe(SYNTAX_COLORS.keyword);

    const strToken = tokens.find((t) => t.text.includes("@masumdev/markforge"));
    expect(strToken?.type).toBe("string");
    expect(strToken?.colorHex).toBe(SYNTAX_COLORS.string);
  });

  it("tokenizes comments with italic styling", () => {
    const tokens = tokenizeCodeLine("// Compile markdown to DOCX", "ts");
    const comment = tokens.find((t) => t.type === "comment");
    expect(comment).toBeDefined();
    expect(comment?.italic).toBe(true);
    expect(comment?.colorHex).toBe(SYNTAX_COLORS.comment);
  });

  it("converts multi-line code block to styled HTML spans", () => {
    const code = `const count = 42;\n// comment\nreturn true;`;
    const html = highlightCodeToHtml(code, "js");

    expect(html).toContain(`style="color: #${SYNTAX_COLORS.keyword}; font-weight: bold;"`);
    expect(html).toContain(`style="color: #${SYNTAX_COLORS.number};"`);
    expect(html).toContain(`style="color: #${SYNTAX_COLORS.comment}; font-style: italic;"`);
    expect(html).toContain(`style="color: #${SYNTAX_COLORS.boolean}; font-weight: bold;"`);
  });
});
