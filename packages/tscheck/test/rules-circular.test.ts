import { describe, it, expect } from "bun:test";
import * as ts from "typescript";
import { checkCircularDependencies } from "../src/core/rules/circular.js";
import { CommentSuppressionMap } from "../src/core/suppression.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

describe("rules/circular", () => {
  it("detects circular dependency cycles between files and export declarations", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-circ-"));
    const fileA = path.join(tmpDir, "A.ts");
    const fileB = path.join(tmpDir, "B.ts");

    fs.writeFileSync(fileA, 'export * from "./B.js";\nexport const a = 1;\n', "utf-8");
    fs.writeFileSync(fileB, 'import { a } from "./A.js";\nexport const b = 2;\n', "utf-8");

    const host = ts.createCompilerHost({});
    const program = ts.createProgram([fileA, fileB], { allowJs: true }, host);

    const sfA = program.getSourceFile(fileA)!;
    const sfB = program.getSourceFile(fileB)!;
    const suppressionMaps = new Map<string, CommentSuppressionMap>([
      [fileA, new CommentSuppressionMap(sfA)],
      [fileB, new CommentSuppressionMap(sfB)],
    ]);

    const result = checkCircularDependencies(
      program,
      "test-pkg",
      suppressionMaps,
      true
    );

    expect(result.circularDependencies.length).toBeGreaterThanOrEqual(1);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("handles suppressed circular dependency cycles and unresolvable relative imports", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-circ-sup-"));
    const fileA = path.join(tmpDir, "A.ts");
    const fileB = path.join(tmpDir, "B.ts");

    fs.writeFileSync(fileA, '// tscheck-ignore-next-line circular\nexport * from "./B.js";\nimport "./non-existent-module-xyz.js";\n', "utf-8");
    fs.writeFileSync(fileB, 'import { a } from "./A.js";\nexport const b = 2;\n', "utf-8");

    const host = ts.createCompilerHost({});
    const program = ts.createProgram([fileA, fileB], { allowJs: true }, host);

    const sfA = program.getSourceFile(fileA)!;
    const sfB = program.getSourceFile(fileB)!;
    const suppressionMaps = new Map<string, CommentSuppressionMap>([
      [fileA, new CommentSuppressionMap(sfA)],
      [fileB, new CommentSuppressionMap(sfB)],
    ]);

    const result = checkCircularDependencies(
      program,
      "test-pkg",
      suppressionMaps,
      true
    );

    expect(result.suppressedCount).toBeGreaterThanOrEqual(1);

    // Test checkCircular: false
    const nonCircResult = checkCircularDependencies(
      program,
      "test-pkg",
      suppressionMaps,
      false
    );
    expect(nonCircResult.circularDependencies.length).toBe(0);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
