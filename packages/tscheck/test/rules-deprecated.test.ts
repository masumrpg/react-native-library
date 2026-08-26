import { describe, it, expect } from "bun:test";
import * as ts from "typescript";
import { checkNodeDeprecation, getJSDocDeprecatedTag } from "../src/core/rules/deprecated.js";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

describe("rules/deprecated", () => {
  it("detects JSDoc @deprecated tag on functions, classes, methods, properties, and types", () => {
    const code = `
      /** @deprecated Use NewClass instead */
      class OldClass {
        /** @deprecated Use newMethod instead */
        oldMethod() {}

        /** @deprecated Use newProp instead */
        oldProp: string = "val";
      }

      /** @deprecated Use NewType instead */
      type OldType = string;

      /** @deprecated Use NewInterface instead */
      interface OldInterface {
        foo: string;
      }

      function caller() {
        const instance = new OldClass();
        instance.oldMethod();
        const p = instance.oldProp;
        const t: OldType = "a";
        const i: OldInterface = { foo: "b" };
        return { instance, p, t, i };
      }
    `;

    const sourceFile = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const host = ts.createCompilerHost({});
    const program = ts.createProgram(["test.ts"], {}, {
      ...host,
      getSourceFile: (f) => (f === "test.ts" ? sourceFile : host.getSourceFile(f, ts.ScriptTarget.Latest)),
    });
    const checker = program.getTypeChecker();

    const deprecatedSymbols: string[] = [];

    function visit(node: ts.Node) {
      const result = checkNodeDeprecation(node, checker);
      if (result.deprecated) {
        deprecatedSymbols.push(node.getText(sourceFile));
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    expect(deprecatedSymbols.length).toBeGreaterThanOrEqual(4);
    expect(deprecatedSymbols).toContain("OldClass");
    expect(deprecatedSymbols).toContain("oldMethod");
    expect(deprecatedSymbols).toContain("oldProp");
  });

  it("detects deprecated imports through aliases and multi-token comments", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tscheck-dep-alias-"));
    const fileA = path.join(tmpDir, "a.ts");
    const fileB = path.join(tmpDir, "b.ts");

    fs.writeFileSync(fileA, "/** @deprecated Legacy API */\nexport function legacyFn() {}\nexport function activeFn() {}\n");
    fs.writeFileSync(fileB, 'import { legacyFn as myAliasedFn, activeFn as myActiveFn } from "./a.js";\nmyAliasedFn();\nmyActiveFn();\n');

    const host = ts.createCompilerHost({});
    const program = ts.createProgram([fileA, fileB], { moduleResolution: ts.ModuleResolutionKind.Node10 }, host);
    const checker = program.getTypeChecker();
    const sfB = program.getSourceFile(fileB)!;

    let found = false;
    let reason = "";

    function visit(node: ts.Node) {
      const result = checkNodeDeprecation(node, checker);
      if (result.deprecated) {
        found = true;
        reason = result.reason;
      }
      ts.forEachChild(node, visit);
    }

    visit(sfB);
    expect(found).toBe(true);
    expect(reason).toContain("Legacy API");

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("handles getJSDocDeprecatedTag directly for empty declarations and non-deprecated symbols", () => {
    const code = "const normalVar = 1;\nexport { normalVar as aliasedNormal };";
    const sourceFile = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const host = ts.createCompilerHost({});
    const program = ts.createProgram(["test.ts"], {}, {
      ...host,
      getSourceFile: (f) => (f === "test.ts" ? sourceFile : host.getSourceFile(f, ts.ScriptTarget.Latest)),
    });
    const checker = program.getTypeChecker();
    const symbol = checker.getSymbolAtLocation((sourceFile.statements[0] as ts.VariableStatement).declarationList.declarations[0].name)!;

    const result = getJSDocDeprecatedTag(symbol, checker);
    expect(result.deprecated).toBe(false);

    const exportSpec = (sourceFile.statements[1] as ts.ExportDeclaration).exportClause as ts.NamedExports;
    const aliasedSymbol = checker.getSymbolAtLocation(exportSpec.elements[0].name)!;
    const aliasedResult = getJSDocDeprecatedTag(aliasedSymbol, checker);
    expect(aliasedResult.deprecated).toBe(false);
  });

  it("does not report non-deprecated functions", () => {
    const code = `
      /** Normal function documentation */
      function modernApi() {}

      function caller() {
        modernApi();
      }
    `;

    const sourceFile = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const host = ts.createCompilerHost({});
    const program = ts.createProgram(["test.ts"], {}, {
      ...host,
      getSourceFile: (f) => (f === "test.ts" ? sourceFile : host.getSourceFile(f, ts.ScriptTarget.Latest)),
    });
    const checker = program.getTypeChecker();

    let found = false;

    function visit(node: ts.Node) {
      const result = checkNodeDeprecation(node, checker);
      if (result.deprecated) {
        found = true;
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    expect(found).toBe(false);
  });
});
