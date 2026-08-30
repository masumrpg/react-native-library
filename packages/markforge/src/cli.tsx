// Stub globalThis.localStorage to prevent Node.js 22+ internal webstorage warning
// when third-party libraries (e.g. docx) check for localStorage availability.
try {
  if (
    typeof globalThis !== "undefined" &&
    (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== "function")
  ) {
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0,
      },
      configurable: true,
      writable: true,
    });
  }
} catch {
  // ignore
}

// Suppress any remaining warning
process.removeAllListeners("warning");
process.on("warning", (w) => {
  if (w.message.includes("localstorage-file") || w.message.includes("localStorage")) return;
  process.stderr.write(`(node:${process.pid}) ${w.name}: ${w.message}\n`);
});

import { Command } from "commander";
import * as path from "node:path";
import * as fs from "node:fs";
import { MARKFORGE_VERSION } from "./version.js";
import type { MarkforgeFormat } from "./config/types.js";

async function main() {
  const program = new Command();

  program
    .name("markforge")
    .description("Modern Markdown & MDX multi-format publishing engine & CLI (DOCX, PDF, HTML, Images)")
    .version(MARKFORGE_VERSION, "-V, --version", "Output current markforge version")
    .argument("[input-file]", "Markdown or MDX source file to compile", "README.md")
    .option("-t, --to <formats>", "Target formats to compile to (comma-separated: docx,pdf,html)")
    .option("-o, --output <dir>", "Output directory for generated documents")
    .option("--theme <theme>", "Built-in theme name (default, academic, github, corporate, minimal)")
    .option("--css <path...>", "Custom CSS stylesheet(s) to inject")
    .option("-c, --config <path>", "Path to custom markforge configuration file")
    .option("--toc", "Force Table of Contents generation")
    .option("-w, --watch", "Watch input file for changes and recompile", false)
    .option("-s, --serve [port]", "Start interactive live-reload preview server")
    .option("-O, --open", "Open preview or compiled document in default browser", false);

  program.parse(process.argv);

  const options = program.opts();
  const inputArg = program.args[0] || "README.md";

  const resolvedInputPath = path.isAbsolute(inputArg)
    ? inputArg
    : path.resolve(process.cwd(), inputArg);

  if (!fs.existsSync(resolvedInputPath)) {
    console.error(`[ERROR] File not found: ${resolvedInputPath}`);
    process.exit(1);
  }

  // Parse --to formats if explicitly provided on CLI
  const cliFormats = options.to
    ? (options.to as string)
        .split(",")
        .map((f: string) => f.trim().toLowerCase())
        .filter(Boolean) as MarkforgeFormat[]
    : undefined;

  // Dynamically import loadConfig so localStorage stub runs first
  const { loadConfig } = await import("./config/loadConfig.js");

  // Load config (auto-discover starting from input file's dir or explicit -c path)
  const { config: fileConfig, configPath } = await loadConfig(
    options.config as string | undefined,
    path.dirname(resolvedInputPath)
  );

  // CLI options override config file
  const mergedConfig = {
    ...fileConfig,
    to: cliFormats && cliFormats.length > 0 ? cliFormats : (fileConfig.to ?? ["docx", "pdf"]),
    ...(options.output ? { outputDir: options.output as string } : {}),
    ...(options.theme ? { theme: options.theme as string } : {}),
    ...(options.css ? { css: options.css as string[] } : {}),
    ...(options.toc ? { toc: true } : {}),
  };

  // If --serve is active, start live preview HTTP server
  if (options.serve !== false && options.serve !== undefined) {
    const rawPort = options.serve === true ? 3000 : parseInt(String(options.serve), 10);
    const port = isNaN(rawPort) ? 3000 : rawPort;

    const { startPreviewServer } = await import("./server/previewServer.js");
    const instance = await startPreviewServer({
      filePath: resolvedInputPath,
      port,
      open: Boolean(options.open),
      config: mergedConfig,
    });

    const themeLabel =
      typeof mergedConfig.theme === "object" ? "Custom (ThemeProps)" : String(mergedConfig.theme || "corporate");

    console.log(`\n======================================================`);
    console.log(`  MarkForge Live Reload Preview Server        v${MARKFORGE_VERSION}`);
    console.log(`======================================================`);
    console.log(`  Target File : ${resolvedInputPath}`);
    console.log(`  Config File : ${configPath || "(default auto-discovery)"}`);
    console.log(`  Theme       : ${themeLabel} | Syntax: ${mergedConfig.syntaxTheme || "github-dark"}`);
    console.log(`  Layout      : ${mergedConfig.paperSize || "A4"} (${mergedConfig.orientation || "portrait"})`);
    console.log(`  Server URL  : ${instance.url}`);
    console.log(`  Auto-Open   : ${Boolean(options.open) ? "Enabled" : "Disabled"}`);
    console.log(`  Author      : Ma'sum (@masumrpg)`);
    console.log(`  GitHub      : https://github.com/masumrpg`);
    console.log(`======================================================\n`);
    console.log(`[READY] Watching for markdown and style changes. Press Ctrl+C to exit.\n`);
    return;
  }

  // Otherwise, run the Ink CLI Terminal UI
  const [{ render }, { App }] = await Promise.all([
    import("ink"),
    import("./ui/App.js"),
  ]);

  render(
    <App
      inputFile={resolvedInputPath}
      config={mergedConfig}
      configPath={configPath}
      onComplete={(res) => {
        if (res.errors && res.errors.length > 0) {
          process.exitCode = 1;
        }
      }}
    />
  );
}

main().catch((err: unknown) => {
  console.error("[FATAL]", err instanceof Error ? err.message : err);
  process.exit(1);
});
