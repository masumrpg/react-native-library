import { describe, it, expect } from "bun:test";
import * as ts from "typescript";
import { checkCircularAndBoundaryRules } from "../src/core/rules/circular.js";
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

    const result = checkCircularAndBoundaryRules(
      program,
      "test-pkg",
      suppressionMaps,
      true,
      false
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

    const result = checkCircularAndBoundaryRules(
      program,
      "test-pkg",
      suppressionMaps,
      true,
      false
    );

    expect(result.suppressedCount).toBeGreaterThanOrEqual(1);

    // Test checkCircular: false
    const nonCircResult = checkCircularAndBoundaryRules(
      program,
      "test-pkg",
      suppressionMaps,
      false,
      true
    );
    expect(nonCircResult.circularDependencies.length).toBe(0);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("detects package boundary violations for deep imports and handles suppression", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-bound-"));
    const testFile = path.join(tmpDir, "Component.ts");

    fs.writeFileSync(
      testFile,
      '// tscheck-ignore-next-line boundary\nimport { secret } from "@masumdev/rn-ui/src/internal/secret.js";\nimport { bad } from "@masumdev/rn-ui/src/other.js";\n',
      "utf-8"
    );

    const host = ts.createCompilerHost({});
    const program = ts.createProgram([testFile], { allowJs: true }, host);
    const sf = program.getSourceFile(testFile)!;
    const suppressionMaps = new Map<string, CommentSuppressionMap>([
      [testFile, new CommentSuppressionMap(sf)],
    ]);

    const result = checkCircularAndBoundaryRules(
      program,
      "test-pkg",
      suppressionMaps,
      false,
      true
    );

    expect(result.boundaryViolations.length).toBe(1);
    expect(result.suppressedCount).toBe(1);
    expect(result.boundaryViolations[0].importPath).toContain("@masumdev/rn-ui/src/other.js");
    expect(result.boundaryViolations[0].targetPackage).toBe("@masumdev/rn-ui");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
