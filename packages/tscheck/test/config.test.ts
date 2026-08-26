import { describe, it, expect } from "bun:test";
import { defineConfig } from "../src/config/defineConfig.js";
import { loadConfig } from "../src/config/loadConfig.js";
import type { TsCheckConfig } from "../src/config/types.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

describe("defineConfig", () => {
  it("returns the exact configuration object provided", () => {
    const config: TsCheckConfig = {
      rootDir: "/test/root",
      workspaces: ["packages/*"],
      rules: {
        deprecated: true,
        unused: false,
        noExplicitAny: true,
      },
    };

    const result = defineConfig(config);
    expect(result).toBe(config);
    expect(result.rootDir).toBe("/test/root");
    expect(result.rules?.unused).toBe(false);
  });
});

describe("loadConfig", () => {
  it("loads config from explicit JSON file path", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-cfg-"));
    const jsonPath = path.join(tmpDir, "custom.json");
    fs.writeFileSync(
      jsonPath,
      JSON.stringify({
        rootDir: "/custom/dir",
        failOnWarning: true,
        rules: { deprecated: false },
      }),
      "utf-8"
    );

    const { config, configPath } = await loadConfig(jsonPath);
    expect(configPath).toBe(jsonPath);
    expect(config.rootDir).toBe("/custom/dir");
    expect(config.failOnWarning).toBe(true);
    expect(config.rules?.deprecated).toBe(false);
    expect(config.rules?.unused).toBe(true); // default merged

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("loads config from explicit YAML file path", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-cfg-"));
    const yamlPath = path.join(tmpDir, "custom.yaml");
    fs.writeFileSync(
      yamlPath,
      "rootDir: /yaml/dir\nrules:\n  noExplicitAny: false\n",
      "utf-8"
    );

    const { config, configPath } = await loadConfig(yamlPath);
    expect(configPath).toBe(yamlPath);
    expect(config.rootDir).toBe("/yaml/dir");
    expect(config.rules?.noExplicitAny).toBe(false);
    expect(config.rules?.deprecated).toBe(true);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("loads config from JavaScript / TypeScript file path", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-cfg-ts-"));
    const jsPath = path.join(tmpDir, "tscheck.config.js");
    fs.writeFileSync(
      jsPath,
      `export default { rootDir: "/ts-config/dir", rules: { circular: false } };\n`,
      "utf-8"
    );

    const { config, configPath } = await loadConfig(jsPath);
    expect(configPath).toBe(jsPath);
    expect(config.rootDir).toBe("/ts-config/dir");
    expect(config.rules?.circular).toBe(false);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("throws error when explicit custom config path does not exist", async () => {
    expect(loadConfig("/non/existent/tscheck.config.json")).rejects.toThrow(
      "Configuration file not found"
    );
  });

  it("auto-discovers .tscheckrc.json in cwd", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-cfg-"));
    const rcPath = path.join(tmpDir, ".tscheckrc.json");
    fs.writeFileSync(
      rcPath,
      JSON.stringify({ rootDir: "/discovered/dir" }),
      "utf-8"
    );

    const { config, configPath } = await loadConfig(undefined, tmpDir);
    expect(configPath).toBe(rcPath);
    expect(config.rootDir).toBe("/discovered/dir");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("returns default config when no config file is found", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-cfg-empty-"));
    const { config, configPath } = await loadConfig(undefined, tmpDir);

    expect(configPath).toBeNull();
    expect(config.rules?.deprecated).toBe(true);
    expect(config.rules?.unused).toBe(true);
    expect(config.rules?.noExplicitAny).toBe(true);
    expect(config.rules?.circular).toBe(true);
    expect(config.reporters?.json).toBe(true);
    expect(config.reporters?.markdown).toBe(true);
    expect(config.reporters?.html).toBe(true);
    expect(config.serve).toBe(true);
    expect(config.reporters?.serve).toBe(true);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
