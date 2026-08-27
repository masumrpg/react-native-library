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
    .option("-t, --to <formats>", "Target formats to compile to (comma-separated: docx,pdf,html)", "docx,pdf")
    .option("-o, --output <dir>", "Output directory for generated documents")
    .option("--theme <theme>", "Built-in theme name (default, academic, github, corporate, minimal)")
    .option("--css <path...>", "Custom CSS stylesheet(s) to inject")
    .option("-c, --config <path>", "Path to custom markforge configuration file")
    .option("--toc", "Force Table of Contents generation")
    .option("-w, --watch", "Watch input file for changes and recompile", false)
    .option("-s, --serve [port]", "Start local HTTP preview server", false)
    .option("-O, --open", "Open compiled document in default browser", false);

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

  // Parse --to formats
  const rawFormats = (options.to as string || "docx,pdf")
    .split(",")
    .map((f: string) => f.trim().toLowerCase())
    .filter(Boolean) as MarkforgeFormat[];

  // Dynamically import App, Ink, and loadConfig so localStorage stub runs first
  const [{ render }, { App }, { loadConfig }] = await Promise.all([
    import("ink"),
    import("./ui/App.js"),
    import("./config/loadConfig.js"),
  ]);

  // Load config (auto-discover or explicit path)
  const fileConfig = await loadConfig(options.config as string | undefined, path.dirname(resolvedInputPath));

  // CLI options override config file
  const mergedConfig = {
    ...fileConfig,
    to: rawFormats.length > 0 ? rawFormats : (fileConfig.to ?? ["docx", "pdf"]),
    ...(options.output ? { outputDir: options.output as string } : {}),
    ...(options.theme ? { theme: options.theme as string } : {}),
    ...(options.css ? { css: options.css as string[] } : {}),
    ...(options.toc ? { toc: true } : {}),
  };

  render(
    <App
      inputFile={resolvedInputPath}
      config={mergedConfig}
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


