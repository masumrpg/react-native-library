import { describe, it, expect } from "bun:test";
import { Theme, THEME_PRESETS } from "../src/config/types.js";
import { generateThemeCss, THEMES, THEME_COMPONENTS } from "../src/core/html/htmlThemes.js";

describe("Theme presets and CSS generation", () => {
  it("defines all 5 Theme enum values", () => {
    expect(Theme.CORPORATE).toBe(Theme.CORPORATE);
    expect(Theme.DEFAULT).toBe(Theme.DEFAULT);
    expect(Theme.ACADEMIC).toBe(Theme.ACADEMIC);
    expect(Theme.GITHUB).toBe(Theme.GITHUB);
    expect(Theme.MINIMAL).toBe(Theme.MINIMAL);
  });

  it("provides comprehensive styling properties in THEME_PRESETS", () => {
    const requiredKeys = ["corporate", "default", "academic", "github", "minimal"];
    for (const key of requiredKeys) {
      const preset = THEME_PRESETS[key];
      expect(preset).toBeDefined();
      expect(preset.primaryColor).toBeDefined();
      expect(preset.textColor).toBeDefined();
      expect(preset.fontFamily).toBeDefined();
    }
  });

  it("registers all themes in THEMES dictionary", () => {
    expect(THEMES.corporate).toBeDefined();
    expect(THEMES.default).toBeDefined();
    expect(THEMES.academic).toBeDefined();
    expect(THEMES.github).toBeDefined();
    expect(THEMES.minimal).toBeDefined();
  });

  it("generates authentic theme CSS for academic, github, and minimal", () => {
    const academicCss = generateThemeCss("academic");
    expect(academicCss.toLowerCase()).toMatch(/georgia|cambria|serif/);
    expect(academicCss).toContain("--mf-primary: #1e3a8a;");

    const githubCss = generateThemeCss("github");
    expect(githubCss.toLowerCase()).toMatch(/segoe ui|blinkmacsystemfont|apple-system/);
    expect(githubCss).toContain("--mf-primary: #0969da;");

    const minimalCss = generateThemeCss("minimal");
    expect(minimalCss).toContain("--mf-primary: #18181b;");
  });

  it("supports Theme enum values in generateThemeCss", () => {
    expect(generateThemeCss(Theme.ACADEMIC)).toBe(THEMES.academic);
    expect(generateThemeCss(Theme.GITHUB)).toBe(THEMES.github);
    expect(generateThemeCss(Theme.MINIMAL)).toBe(THEMES.minimal);
  });

  it("fixes @media print pre/code word-break rule", () => {
    // Should NOT contain word-break: break-all
    expect(THEME_COMPONENTS).not.toContain("word-break: break-all;");
    // Should contain word-break: break-word or overflow-wrap: break-word
    expect(THEME_COMPONENTS).toMatch(/overflow-wrap:\s*break-word;\s*word-break:\s*break-word;/);
  });
});
