import { describe, it, expect } from "bun:test";
import { defineConfig } from "../src/config/defineConfig.js";
import { loadConfig } from "../src/config/loadConfig.js";
import { resolveTsCheckConfig } from "../src/config/resolveConfig.js";
import { Editor, AuditFormat } from "../src/config/types.js";
import type { TsCheckConfig } from "../src/config/types.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

describe("defineConfig", () => {
  it("returns the exact configuration object provided", () => {
    const config: TsCheckConfig = {
      rootDir: "/test/root",
      workspaces: ["packages/*"],
      editor: Editor.CURSOR,
      format: AuditFormat.JSON,
      rules: {
        deprecated: true,
        unused: false,
        noExplicitAny: true,
      },
    };

    const result = defineConfig(config);
    expect(result).toBe(config);
    expect((result as TsCheckConfig).rootDir).toBe("/test/root");
    expect((result as TsCheckConfig).editor).toBe("cursor");
    expect((result as TsCheckConfig).rules?.unused).toBe(false);
  });
});

describe("resolveTsCheckConfig", () => {
  it("normalizes flat root options and symmetrical reporters options", () => {
    const normalized = resolveTsCheckConfig({
      rootDir: "/app/root",
      editor: Editor.CURSOR,
      port: 8080,
      serve: true,
      open: true,
      reporters: {
        outputDir: ".temp/custom-out",
      },
    });

    expect(normalized.rootDir).toBe("/app/root");
    expect(normalized.editor).toBe("cursor");
    expect(normalized.reporters.editor).toBe("cursor");
    expect(normalized.port).toBe(8080);
    expect(normalized.reporters.port).toBe(8080);
    expect(normalized.serve).toBe(true);
    expect(normalized.reporters.serve).toBe(true);
    expect(normalized.open).toBe(true);
    expect(normalized.reporters.open).toBe(true);
    expect(normalized.reporters.outputDir).toBe("/app/root/.temp/custom-out");
  });

  it("applies CLI overrides over user config", () => {
    const normalized = resolveTsCheckConfig(
      {
        editor: Editor.VSCODE,
        rules: { deprecated: true, unused: true },
      },
      {
        editor: Editor.WINDSURF,
        rules: { deprecated: false },
        format: AuditFormat.AI,
      }
    );

    expect(normalized.editor).toBe("windsurf");
    expect(normalized.rules.deprecated).toBe(false);
    expect(normalized.rules.unused).toBe(true);
    expect(normalized.format).toBe("ai");
  });
});

describe("loadConfig (100% Pure TypeScript / JavaScript)", () => {
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

  it("throws clear error when user tries to pass unsupported JSON or YAML file", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-cfg-legacy-"));
    const jsonPath = path.join(tmpDir, "legacy.json");
    fs.writeFileSync(jsonPath, "{}", "utf-8");

    expect(loadConfig(jsonPath)).rejects.toThrow("Unsupported configuration file format");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("throws error when explicit custom config path does not exist", async () => {
    expect(loadConfig("/non/existent/tscheck.config.ts")).rejects.toThrow(
      "Configuration file not found"
    );
  });

  it("auto-discovers tscheck.config.js / tscheck.config.ts in directory tree via walk-up", async () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-walkup-"));
    const cfgPath = path.join(tmpRoot, "tscheck.config.js");
    fs.writeFileSync(cfgPath, `export default { rootDir: "/discovered/root" };\n`, "utf-8");

    const subDir = path.join(tmpRoot, "packages", "sub-pkg");
    fs.mkdirSync(subDir, { recursive: true });

    const { config, configPath } = await loadConfig(undefined, subDir);
    expect(configPath).toBe(cfgPath);
    expect(config.rootDir).toBe("/discovered/root");

    fs.rmSync(tmpRoot, { recursive: true, force: true });
  });

  it("returns default normalized config when no config file is found", async () => {
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
    expect(config.serve).toBe(false);
    expect(config.open).toBe(false);
    expect(config.editor).toBe("vscode");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
