import { describe, it, expect } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { defineConfig } from "../src/config/defineConfig.js";
import { loadConfig } from "../src/config/loadConfig.js";

describe("config", () => {
  it("defineConfig returns the exact object passed", () => {
    const cfg = { theme: "academic" as const, to: ["docx" as const] };
    expect(defineConfig(cfg)).toBe(cfg);
  });

  it("loadConfig returns default config when no custom path or file exists in isolated dir", async () => {
    const emptyTmpDir = path.resolve(process.cwd(), ".temp/empty-dir-test");
    if (!fs.existsSync(emptyTmpDir)) fs.mkdirSync(emptyTmpDir, { recursive: true });

    // Passing emptyTmpDir with non-existent filename won't find anything
    const { config } = await loadConfig(undefined, emptyTmpDir);
    expect(config.to).toEqual(["docx", "pdf"]);
    expect(config.theme).toBe("default");

    fs.rmSync(emptyTmpDir, { recursive: true, force: true });
  });

  it("loadConfig loads JSON with $schema without polluting typed config", async () => {
    const tmpDir = path.resolve(process.cwd(), ".temp/schema-cfg-test");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const jsonPath = path.join(tmpDir, "markforge.config.json");
    fs.writeFileSync(
      jsonPath,
      JSON.stringify({
        $schema: "./node_modules/@masumdev/markforge/schema.json",
        theme: "dracula",
        to: ["html", "pdf"],
        margins: { top: "3cm" },
      })
    );

    const { config, configPath } = await loadConfig(jsonPath);
    expect(configPath).toBe(jsonPath);
    expect(config.theme).toBe("dracula");
    expect(config.to).toEqual(["html", "pdf"]);
    expect(config.margins?.top).toBe("3cm");
    expect(config.margins?.bottom).toBe("2.5cm"); // default preserved
    expect((config as Record<string, unknown>).$schema).toBeUndefined();

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("loadConfig loads YAML and .markforgerc files", async () => {
    const tmpDir = path.resolve(process.cwd(), ".temp/yaml-cfg-test");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const yamlPath = path.join(tmpDir, "markforge.config.yaml");
    fs.writeFileSync(yamlPath, "theme: academic\ntoc: true\nto: [docx]\n");

    const yamlRes = await loadConfig(yamlPath);
    expect(yamlRes.config.theme).toBe("academic");
    expect(yamlRes.config.toc).toBe(true);
    expect(yamlRes.config.to).toEqual(["docx"]);

    const rcPath = path.join(tmpDir, ".markforgerc");
    fs.writeFileSync(rcPath, "theme: corporate\n");

    const rcRes = await loadConfig(rcPath);
    expect(rcRes.config.theme).toBe("corporate");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("loadConfig hierarchical auto-discovery discovers config in parent directory", async () => {
    const rootTmpDir = path.resolve(process.cwd(), ".temp/parent-cfg-test");
    const subTmpDir = path.join(rootTmpDir, "nested", "subfolder");
    fs.mkdirSync(subTmpDir, { recursive: true });

    const configPath = path.join(rootTmpDir, "markforge.config.json");
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        theme: "minimal",
        to: ["docx"],
      })
    );

    // Search starting from nested subfolder — should walk up and find config in rootTmpDir
    const { config, configPath: foundPath } = await loadConfig(undefined, subTmpDir);
    expect(foundPath).toBe(configPath);
    expect(config.theme).toBe("minimal");
    expect(config.to).toEqual(["docx"]);

    fs.rmSync(rootTmpDir, { recursive: true, force: true });
  });

  it("loadConfig throws error if explicit file path does not exist", async () => {
    expect(loadConfig("/non/existent/path/markforge.json")).rejects.toThrow();
  });

  it("resolveDocumentConfig correctly resolves priority, replaces tokens, and normalizes margins/watermark", async () => {
    const { resolveDocumentConfig, replaceDocumentTokens, normalizeWatermark } = await import(
      "../src/config/resolveConfig.js"
    );

    // 1. Token replacement test
    const tokenStr = replaceDocumentTokens("{title} by {author} (v{version}) - {company}", {
      title: "API Manual",
      author: "Masum",
      version: "1.2.0",
      company: "Masum Dev",
    });
    expect(tokenStr).toBe("API Manual by Masum (v1.2.0) - Masum Dev");

    // 2. Watermark normalization
    const wmString = normalizeWatermark("CONFIDENTIAL");
    expect(wmString?.text).toBe("CONFIDENTIAL");
    expect(wmString?.rotate).toBe(-45);
    expect(wmString?.opacity).toBe(0.08);

    const wmObj = normalizeWatermark({ text: "INTERNAL", opacity: 0.2, rotate: 0 });
    expect(wmObj?.text).toBe("INTERNAL");
    expect(wmObj?.opacity).toBe(0.2);
    expect(wmObj?.rotate).toBe(0);

    expect(normalizeWatermark(false)).toBeUndefined();
    expect(normalizeWatermark(undefined)).toBeUndefined();

    // 3. Full document resolution (Frontmatter overrides userConfig and DEFAULT_CONFIG)
    const resolved = resolveDocumentConfig(
      {
        title: "Frontmatter Title",
        theme: "academic",
        margins: { top: "3.5cm" },
        watermark: "DRAFT",
      },
      {
        theme: "minimal",
        margins: { top: "2cm", bottom: "1.5cm" },
        metadata: {
          author: "Monorepo Team",
          version: "2.0.0",
        },
        header: {
          left: "{title}",
          right: "{author}",
        },
      }
    );

    expect(resolved.title).toBe("Frontmatter Title");
    expect(resolved.author).toBe("Monorepo Team");
    expect(resolved.version).toBe("2.0.0");
    expect(resolved.theme).toBe("academic"); // Frontmatter overrides userConfig
    expect(resolved.margins.top).toBe("3.5cm"); // Frontmatter overrides
    expect(resolved.margins.bottom).toBe("1.5cm"); // userConfig fallback preserved
    expect(resolved.margins.left).toBe("2.5cm"); // default fallback preserved
    expect(resolved.header?.left?.text).toBe("Frontmatter Title"); // token replaced!
    expect(resolved.header?.right?.text).toBe("Monorepo Team"); // token replaced!
    expect(resolved.watermark?.text).toBe("DRAFT");
  });
});

