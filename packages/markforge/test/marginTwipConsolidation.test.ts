import { describe, it, expect } from "bun:test";
import { parseMarginToTwip } from "../src/config/resolveConfig.js";
import { parseMarginToTwip as docxParseMarginToTwip } from "../src/core/docx/docxBuilder.js";
import { parseMarginToTwip as indexParseMarginToTwip } from "../src/index.js";

describe("parseMarginToTwip consolidation and conversions", () => {
  it("re-exports identical parseMarginToTwip across modules", () => {
    expect(docxParseMarginToTwip).toBe(parseMarginToTwip);
    expect(indexParseMarginToTwip).toBe(parseMarginToTwip);
  });

  it("converts standard measurement units to twip accurately", () => {
    // 1 inch = 1440 twip
    expect(parseMarginToTwip("1in")).toBe(1440);
    expect(parseMarginToTwip("0.5inch")).toBe(720);
    expect(parseMarginToTwip("2in")).toBe(2880);

    // Millimeters: 25.4mm = 1 inch = 1440 twip
    expect(parseMarginToTwip("25.4mm")).toBe(1440);

    // Centimeters: 2.54cm = 1 inch = 1440 twip
    expect(parseMarginToTwip("2.54cm")).toBe(1440);

    // Points: 72pt = 1 inch = 1440 twip (1pt = 20 twip)
    expect(parseMarginToTwip("72pt")).toBe(1440);
    expect(parseMarginToTwip("12pt")).toBe(240);

    // Raw numbers
    expect(parseMarginToTwip(1440)).toBe(1440);
    expect(parseMarginToTwip("1440")).toBe(1440);
  });

  it("handles fallback and default twip values gracefully", () => {
    expect(parseMarginToTwip(undefined, 1440)).toBe(1440);
    expect(parseMarginToTwip("", 720)).toBe(720);
    expect(parseMarginToTwip("invalid-unit", 1440)).toBe(1440);
  });
});
