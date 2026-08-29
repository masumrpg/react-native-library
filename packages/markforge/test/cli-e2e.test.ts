import { describe, it, expect } from "bun:test";
import * as path from "node:path";
import * as fs from "node:fs";

describe("CLI E2E", () => {
  const cliPath = path.resolve(__dirname, "../dist/cli.mjs");

  it("outputs help screen on --help", async () => {
    const proc = Bun.spawn([process.execPath, cliPath, "--help"], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = await new Response(proc.stdout).text();
    await proc.exited;

    expect(stdout).toContain("markforge");
    expect(stdout).toContain("--to");
    expect(stdout).toContain("--output");
    expect(stdout).toContain("--theme");
  });

  it("outputs version number on -V", async () => {
    const proc = Bun.spawn([process.execPath, cliPath, "-V"], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = await new Response(proc.stdout).text();
    await proc.exited;

    const pkgJson = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf-8")
    );
    expect(stdout.trim()).toBe(pkgJson.version);
  });


  it("compiles a markdown file via CLI command", async () => {
    const tmpDir = path.resolve(process.cwd(), ".temp/markforge-cli-test");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const mdFile = path.join(tmpDir, "doc.md");
    fs.writeFileSync(mdFile, "# CLI Test\nHello from CLI test!");

    const proc = Bun.spawn([process.execPath, cliPath, mdFile, "-t", "docx,html", "-o", tmpDir], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const stdout = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;

    expect(exitCode).toBe(0);
    expect(stdout).toBeDefined();
    expect(fs.existsSync(path.join(tmpDir, "doc.docx"))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, "doc.html"))).toBe(true);

    // cleanup
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
