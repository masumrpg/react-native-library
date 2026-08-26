import { describe, it, expect } from "bun:test";
import * as ts from "typescript";
import { checkExplicitAnyUsages } from "../src/core/rules/anyType.js";
import { CommentSuppressionMap } from "../src/core/suppression.js";

describe("rules/anyType", () => {
  it("detects explicit any in variables, parameters, return types, properties, and assertions", () => {
    const code = `
      const x: any = 10;
      class Sample {
        prop: any = "val";
      }
      function foo(param: any): any {
        const cast = "hello" as any;
        const list: Array<any> = [];
        return cast;
      }
    `;

    const sourceFile = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const { items, suppressedCount } = checkExplicitAnyUsages(sourceFile, "test-pkg");

    expect(suppressedCount).toBe(0);
    expect(items.length).toBe(6);

    const contexts = items.map((i) => i.context);
    expect(contexts.some((c) => c.includes("variable"))).toBe(true);
    expect(contexts.some((c) => c.includes("property"))).toBe(true);
    expect(contexts.some((c) => c.includes("parameter"))).toBe(true);
    expect(contexts.some((c) => c.includes("return type"))).toBe(true);
    expect(contexts.some((c) => c.includes("type assertion"))).toBe(true);
    expect(contexts.some((c) => c.includes("generic type argument"))).toBe(true);
  });

  it("handles suppressed explicit any usages", () => {
    const code = `
      // tscheck-ignore-next-line any
      const x: any = 10;
    `;
    const sourceFile = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const suppression = new CommentSuppressionMap(sourceFile);
    const { items, suppressedCount } = checkExplicitAnyUsages(sourceFile, "test-pkg", suppression);

    expect(items.length).toBe(0);
    expect(suppressedCount).toBe(1);
  });

  it("does not report typed variables", () => {
    const code = `
      const x: number = 10;
      function foo(param: string): string {
        return param;
      }
    `;

    const sourceFile = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const { items } = checkExplicitAnyUsages(sourceFile, "test-pkg");
    expect(items.length).toBe(0);
  });
});
