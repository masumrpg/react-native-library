import { describe, it, expect } from "bun:test";
import { startReportServer, openInBrowser } from "../src/core/server.js";
import * as http from "node:http";
import * as os from "node:os";
import * as fs from "node:fs";
import * as path from "node:path";

describe("server", () => {
  it("starts report server, serves HTML, and closes cleanly", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-srv-"));
    const htmlFile = path.join(tmpDir, "audit-report.html");
    fs.writeFileSync(htmlFile, "<html><body><h1>Audit Report</h1></body></html>", "utf-8");

    const instance = await startReportServer(htmlFile, 61234);
    expect(instance.port).toBe(61234);
    expect(instance.url).toBe("http://localhost:61234");

    const res = await fetch("http://localhost:61234");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Audit Report");

    await instance.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("handles port collision by falling back to port + 1", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-srv-col-"));
    const htmlFile = path.join(tmpDir, "audit-report.html");
    fs.writeFileSync(htmlFile, "<html><body><h1>Port Test</h1></body></html>", "utf-8");

    // Occupy port 61240 with dummy server
    const dummyServer = http.createServer((_, res) => res.end("dummy"));
    await new Promise<void>((resolve) => dummyServer.listen(61240, "127.0.0.1", () => resolve()));

    try {
      const instance = await startReportServer(htmlFile, 61240);
      expect(instance.port).toBe(61241);
      expect(instance.url).toBe("http://localhost:61241");

      const res = await fetch("http://localhost:61241");
      expect(res.status).toBe(200);

      await instance.close();
    } finally {
      await new Promise<void>((resolve) => dummyServer.close(() => resolve()));
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("handles missing HTML file gracefully with 404", async () => {
    const nonExistentFile = path.join(os.tmpdir(), "non-existent-report-12345.html");
    const instance = await startReportServer(nonExistentFile, 61235);

    const res = await fetch("http://localhost:61235");
    expect(res.status).toBe(404);
    const text = await res.text();
    expect(text).toContain("Audit report HTML file not found");

    await instance.close();
  });

  it("invokes openInBrowser without throwing across environments", () => {
    expect(() => {
      openInBrowser("http://localhost:5500");
    }).not.toThrow();
  });
});
