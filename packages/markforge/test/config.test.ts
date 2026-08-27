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

  it("loadConfig returns default config when no custom path or file exists", async () => {
    const { config, configPath } = await loadConfig();
    expect(config.to).toEqual(["docx", "pdf"]);
    expect(config.theme).toBe("default");
    expect(configPath).toBeNull();
  });

  it("loadConfig loads JSON and YAML configuration files", async () => {
    const tmpDir = path.resolve(process.cwd(), ".temp/markforge-cfg-test");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const jsonPath = path.join(tmpDir, "markforge.config.json");
    fs.writeFileSync(jsonPath, JSON.stringify({ theme: "corporate", to: ["html"] }));

    const { config } = await loadConfig(jsonPath);
    expect(config.theme).toBe("corporate");
    expect(config.to).toEqual(["html"]);

    const yamlPath = path.join(tmpDir, "markforge.config.yaml");
    fs.writeFileSync(yamlPath, "theme: academic\ntoc: true\n");

    const yamlRes = await loadConfig(yamlPath);
    expect(yamlRes.config.theme).toBe("academic");
    expect(yamlRes.config.toc).toBe(true);

    // cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("loadConfig throws error if explicit file path does not exist", async () => {
    expect(loadConfig("/non/existent/path/markforge.json")).rejects.toThrow();
  });
});
