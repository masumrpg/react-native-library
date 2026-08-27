import { render } from "ink";
import { Command } from "commander";
import * as path from "node:path";
import * as fs from "node:fs";
import { App } from "./ui/App.js";
import { loadConfig } from "./config/loadConfig.js";
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
    // If user provided a non-existent file, create a nice fallback or error
    console.error(`[ERROR] File not found: ${resolvedInputPath}`);
    process.exit(1);
  }

  const { config } = await loadConfig(options.config, path.dirname(resolvedInputPath));

  if (options.to) {
    config.to = options.to.split(",").map((s: string) => s.trim()) as MarkforgeFormat[];
  }
  if (options.output) config.outputDir = options.output;
  if (options.theme) config.theme = options.theme;
  if (options.css) config.css = options.css;
  if (options.toc) config.toc = true;
  if (options.watch) config.watch = true;

  const app = render(
    <App
      inputFile={resolvedInputPath}
      config={config}
      onComplete={(res) => {
        if (res.errors.length > 0) {
          process.exitCode = 1;
        }
      }}
    />
  );

  await app.waitUntilExit();
}

main().catch((err) => {
  console.error("[FATAL ERROR]", err);
  process.exit(1);
});
