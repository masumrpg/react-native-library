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
});
