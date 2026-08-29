/**
 * Example 5: Interactive Live-Reload Preview Server
 * Demonstrates starting the programmatic preview server with SSE auto-reload.
 *
 * Author: Ma'sum (@masumrpg)
 */
import * as path from "node:path";
import { startPreviewServer } from "@masumdev/markforge";

async function main() {
  const filePath = path.resolve(__dirname, "../docs/full-all-properties.md");
  const port = 3000;

  console.log("Starting MarkForge Live-Reload Preview Server...");
  const server = await startPreviewServer({
    filePath,
    port,
    open: true, // Automatically opens your default web browser
  });

  console.log(`Server is running at: ${server.url}`);
  console.log(`Watching file: ${filePath}`);
  console.log("Press Ctrl+C to terminate the server.");
}

main().catch((err) => {
  console.error("Failed to start preview server:", err);
  process.exit(1);
});
