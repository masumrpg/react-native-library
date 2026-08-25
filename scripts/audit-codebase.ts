import { spawnSync } from "node:child_process";
import * as path from "node:path";

const cliPath = path.resolve(__dirname, "..", "packages", "tscheck", "dist", "cli.mjs");
const args = process.argv.slice(2);

const result = spawnSync("bun", [cliPath, ...args], {
  stdio: "inherit",
  cwd: path.resolve(__dirname, ".."),
});

process.exit(result.status ?? 0);
