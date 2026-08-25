import * as ts from "typescript";

export interface DeprecatedCheckResult {
  deprecated: boolean;
  reason: string;
}

/**
 * Extracts the JSDoc `@deprecated` tag from a TypeScript symbol's declarations.
 */
export function getJSDocDeprecatedTag(
  symbol: ts.Symbol,
  checker: ts.TypeChecker
): DeprecatedCheckResult {
  const declarations = symbol.getDeclarations() ?? [];

  for (const decl of declarations) {
    const tags = ts.getJSDocTags(decl);
    const depTag = tags.find((t) => t.tagName.text === "deprecated");
    if (depTag && declarations.length === 1) {
      const reasonText =
        typeof depTag.comment === "string"
          ? depTag.comment
          : Array.isArray(depTag.comment)
            ? depTag.comment.map((c) => c.text).join("")
            : "";
      return { deprecated: true, reason: reasonText || "Marked as deprecated" };
    }
  }

  // Check aliased symbol if imported
  if (symbol.flags & ts.SymbolFlags.Alias) {
    try {
      const aliased = checker.getAliasedSymbol(symbol);
      if (aliased && aliased !== symbol) {
        return getJSDocDeprecatedTag(aliased, checker);
      }
    } catch {
      // ignore alias resolution error
    }
  }

  return { deprecated: false, reason: "" };
}

/**
 * Checks whether an AST node is invoking or referencing a deprecated member.
 */
export function checkNodeDeprecation(
  node: ts.Node,
  checker: ts.TypeChecker
): DeprecatedCheckResult {
  // 1. If part of a CallExpression (e.g. fn() or obj.fn()), check exact resolved signature
  let callExpr: ts.CallExpression | undefined;
  if (
    ts.isCallExpression(node.parent) &&
    (node.parent.expression === node ||
      (ts.isPropertyAccessExpression(node.parent.expression) &&
        node.parent.expression.name === node))
  ) {
    callExpr = node.parent;
  } else if (
    ts.isPropertyAccessExpression(node) &&
    ts.isCallExpression(node.parent) &&
    node.parent.expression === node
  ) {
    callExpr = node.parent;
  }

  if (callExpr) {
    const signature = checker.getResolvedSignature(callExpr);
    const decl = signature?.getDeclaration();
    if (decl) {
      const tags = ts.getJSDocTags(decl);
      const depTag = tags.find((t) => t.tagName.text === "deprecated");
      if (depTag) {
        const reasonText =
          typeof depTag.comment === "string"
            ? depTag.comment
            : Array.isArray(depTag.comment)
              ? depTag.comment.map((c) => c.text).join("")
              : "";
        return { deprecated: true, reason: reasonText || "Marked as deprecated" };
      }
    }
  }

  // 2. Fallback to symbol at location
  const symbol = checker.getSymbolAtLocation(node);
  if (symbol) {
    return getJSDocDeprecatedTag(symbol, checker);
  }

  return { deprecated: false, reason: "" };
}
