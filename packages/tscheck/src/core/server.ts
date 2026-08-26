import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { exec } from "node:child_process";

export interface ReportServerInstance {
  server: http.Server;
  port: number;
  url: string;
  close: () => Promise<void>;
}

/**
 * Cross-platform browser launcher.
 */
export function openInBrowser(url: string): void {
  const platform = process.platform;
  let command = "";

  if (platform === "darwin") {
    command = `open "${url}"`;
  } else if (platform === "win32") {
    command = `start "" "${url}"`;
  } else {
    // Linux and others
    command = `xdg-open "${url}" || sensible-browser "${url}" || google-chrome "${url}" || chromium "${url}" || firefox "${url}"`;
  }

  try {
    exec(command, () => {});
  } catch {
    // Graceful fallback in headless environments
  }
}

/**
 * Starts a lightweight local HTTP server to serve the interactive HTML report.
 */
export async function startReportServer(
  htmlFilePath: string,
  preferredPort: number = 5500
): Promise<ReportServerInstance> {
  const resolvedPath = path.resolve(htmlFilePath);

  function tryListen(port: number): Promise<ReportServerInstance> {
    return new Promise((resolve, reject) => {
      const server = http.createServer((_req, res) => {
        if (!fs.existsSync(resolvedPath)) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Audit report HTML file not found.");
          return;
        }

        const htmlContent = fs.readFileSync(resolvedPath, "utf-8");
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        });
        res.end(htmlContent);
      });

      server.on("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE" && port < preferredPort + 20) {
          server.close();
          resolve(tryListen(port + 1));
        } else {
          reject(err);
        }
      });

      server.listen(port, "127.0.0.1", () => {
        const url = `http://localhost:${port}`;
        resolve({
          server,
          port,
          url,
          close: () =>
            new Promise<void>((resClose) => {
              server.close(() => resClose());
            }),
        });
      });
    });
  }

  return tryListen(preferredPort);
}
