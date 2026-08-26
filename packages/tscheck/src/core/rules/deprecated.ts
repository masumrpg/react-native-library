import * as ts from "typescript";

export interface DeprecatedCheckResult {
  deprecated: boolean;
  reason: string;
}

function extractTagDeprecation(tags: readonly ts.JSDocTag[]): DeprecatedCheckResult {
  const depTag = tags.find((t) => t.tagName.text === "deprecated");
  if (!depTag) {
    return { deprecated: false, reason: "" };
  }
  const comment = depTag.comment;
  const reasonText = typeof comment === "string" ? comment : (comment ? String(comment) : "");
  return { deprecated: true, reason: reasonText || "Marked as deprecated" };
}

/**
 * Extracts the JSDoc `@deprecated` tag from a TypeScript symbol's declarations.
 */
export function getJSDocDeprecatedTag(
  symbol: ts.Symbol,
  checker: ts.TypeChecker
): DeprecatedCheckResult {
  const declarations = symbol.getDeclarations();
  if (declarations && declarations.length > 0) {
    let allDeprecated = true;
    let firstReason = "";

    for (const decl of declarations) {
      const res = extractTagDeprecation(ts.getJSDocTags(decl));
      if (res.deprecated) {
        if (!firstReason) firstReason = res.reason;
      } else {
        allDeprecated = false;
      }
    }

    if (allDeprecated && firstReason) {
      return { deprecated: true, reason: firstReason };
    }
  }

  // Check aliased symbol if imported
  if (symbol.flags & ts.SymbolFlags.Alias) {
    const aliased = checker.getAliasedSymbol(symbol);
    if (aliased) {
      return getJSDocDeprecatedTag(aliased, checker);
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
  if (node.parent && ts.isCallExpression(node.parent) && node.parent.expression === node) {
    callExpr = node.parent;
  } else if (
    node.parent &&
    ts.isPropertyAccessExpression(node.parent) &&
    node.parent.name === node &&
    node.parent.parent &&
    ts.isCallExpression(node.parent.parent) &&
    node.parent.parent.expression === node.parent
  ) {
    callExpr = node.parent.parent;
  }

  if (callExpr) {
    const signature = checker.getResolvedSignature(callExpr);
    const decl = signature?.getDeclaration();
    if (decl) {
      return extractTagDeprecation(ts.getJSDocTags(decl));
    }
  }

  // 2. Fallback to symbol at location
  const symbol = checker.getSymbolAtLocation(node);
  if (symbol) {
    return getJSDocDeprecatedTag(symbol, checker);
  }

  return { deprecated: false, reason: "" };
}
