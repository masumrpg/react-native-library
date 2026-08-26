import { describe, it, expect } from "bun:test";
import * as ts from "typescript";
import { CommentSuppressionMap } from "../src/core/suppression.js";

describe("CommentSuppressionMap", () => {
  it("suppresses next line violations for single rule", () => {
    const code = `
      // tscheck-ignore-next-line any
      const x: any = 1;
      const y: any = 2;
    `;
    const sf = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const map = new CommentSuppressionMap(sf);

    expect(map.isSuppressed(3, "noExplicitAny")).toBe(true);
    expect(map.isSuppressed(4, "noExplicitAny")).toBe(false);
  });

  it("suppresses next line violations for multiple comma-separated rules", () => {
    const code = `
      // tscheck-disable-next-line any, deprecated, unused
      const x: any = oldApi();
    `;
    const sf = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const map = new CommentSuppressionMap(sf);

    expect(map.isSuppressed(3, "noExplicitAny")).toBe(true);
    expect(map.isSuppressed(3, "deprecated")).toBe(true);
    expect(map.isSuppressed(3, "unused")).toBe(true);
    expect(map.isSuppressed(3, "circular")).toBe(false);
  });

  it("suppresses same-line violations via // tscheck-ignore", () => {
    const code = `
      const x: any = 1; // tscheck-ignore any
      const y: any = 2;
    `;
    const sf = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const map = new CommentSuppressionMap(sf);

    expect(map.isSuppressed(2, "noExplicitAny")).toBe(true);
    expect(map.isSuppressed(3, "noExplicitAny")).toBe(false);
  });

  it("suppresses ranges via /* tscheck-disable */ and /* tscheck-enable */", () => {
    const code = `
      /* tscheck-disable any */
      const x: any = 1;
      const y: any = 2;
      /* tscheck-enable */
      const z: any = 3;
    `;
    const sf = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const map = new CommentSuppressionMap(sf);

    expect(map.isSuppressed(3, "noExplicitAny")).toBe(true);
    expect(map.isSuppressed(4, "noExplicitAny")).toBe(true);
    expect(map.isSuppressed(6, "noExplicitAny")).toBe(false);
  });

  it("suppresses until EOF if /* tscheck-disable */ is unclosed", () => {
    const code = `
      /* tscheck-disable */
      const x: any = 1;
      const y: any = 2;
    `;
    const sf = ts.createSourceFile("test.ts", code, ts.ScriptTarget.Latest, true);
    const map = new CommentSuppressionMap(sf);

    expect(map.isSuppressed(3, "noExplicitAny")).toBe(true);
    expect(map.isSuppressed(4, "deprecated")).toBe(true);
  });
});
