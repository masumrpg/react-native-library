import * as ts from "typescript";

export interface DeprecatedCheckResult {
  deprecated: boolean;
  reason: string;
  origin?: string;
  suggestedFix?: string;
}

/**
 * Resolves the origin library/package of a TypeScript declaration.
 */
export function resolveDeclarationOrigin(decl?: ts.Declaration): string {
  if (!decl) return "Local Workspace";
  const sourceFile = decl.getSourceFile();
  if (!sourceFile) return "Local Workspace";
  const fileName = sourceFile.fileName.replace(/\\/g, "/");

  if (/\/node_modules\/@types\/([^/]+)/.test(fileName)) {
    const match = fileName.match(/\/node_modules\/@types\/([^/]+)/);
    return match ? `@types/${match[1]}` : "External Types";
  }
  if (/\/node_modules\/(@[^/]+\/[^/]+|[^/]+)/.test(fileName)) {
    const match = fileName.match(/\/node_modules\/(@[^/]+\/[^/]+|[^/]+)/);
    return match ? match[1] : "node_modules";
  }
  if (/lib\.([a-z0-9_.-]+)\.d\.ts$/i.test(fileName)) {
    const match = fileName.match(/lib\.([a-z0-9_.-]+)\.d\.ts$/i);
    return `Built-in JS (${match ? match[1] : "lib"})`;
  }
  if (fileName.includes("typescript/lib/")) {
    return "Built-in TypeScript Lib";
  }
  return "Local Code";
}

/**
 * Parses or infers a suggested replacement fix for deprecated symbols.
 */
export function inferSuggestedFix(symbol: string, reason: string): string {
  const cleanSym = symbol.trim();
  if (cleanSym.endsWith(".substr") || cleanSym === "substr") {
    return "Use .slice(start, end) or .substring(start, end)";
  }
  if (cleanSym.includes("componentWillMount")) {
    return "Use componentDidMount() or React.useEffect()";
  }
  if (cleanSym.includes("componentWillReceiveProps")) {
    return "Use getDerivedStateFromProps() or React.useEffect()";
  }
  if (cleanSym.includes("componentWillUpdate")) {
    return "Use getSnapshotBeforeUpdate() or React.useEffect()";
  }

  // Extract from JSDoc text patterns: "Use X instead", "prefer X", "replaced by X", "migrate to X"
  const match = reason.match(/(?:use|prefer|replaced by|migrate to)\s+[`'"]?([^`'"\n.,;]+?)(?:\s+instead)?[`'"]?(?:$|[.,;\n])/i);
  if (match && match[1]) {
    let target = match[1].trim();
    if (target.toLowerCase().endsWith(" instead")) {
      target = target.slice(0, -8).trim();
    }
    if (target.length > 1 && !target.toLowerCase().startsWith("this") && !target.toLowerCase().startsWith("the")) {
      return `Use ${target} instead`;
    }
  }

  return "";
}

function extractTagDeprecation(
  tags: readonly ts.JSDocTag[],
  decl?: ts.Declaration,
  symbolName: string = ""
): DeprecatedCheckResult {
  const depTag = tags.find((t) => t.tagName.text === "deprecated");
  if (!depTag) {
    return { deprecated: false, reason: "" };
  }
  const comment = depTag.comment;
  const reasonText = typeof comment === "string" ? comment : (comment ? String(comment) : "");
  const finalReason = reasonText || "Marked as deprecated";
  const origin = resolveDeclarationOrigin(decl);
  const suggestedFix = inferSuggestedFix(symbolName, finalReason);

  return {
    deprecated: true,
    reason: finalReason,
    origin,
    suggestedFix: suggestedFix || undefined,
  };
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
    let firstResult: DeprecatedCheckResult | undefined;

    for (const decl of declarations) {
      const res = extractTagDeprecation(ts.getJSDocTags(decl), decl, symbol.name);
      if (res.deprecated) {
        if (!firstResult) firstResult = res;
      } else {
        allDeprecated = false;
      }
    }

    if (allDeprecated && firstResult) {
      return firstResult;
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
      const nodeText = node.getText();
      const res = extractTagDeprecation(ts.getJSDocTags(decl), decl, nodeText);
      if (res.deprecated) return res;
    }
  }

  // 2. Fallback to symbol at location
  const symbol = checker.getSymbolAtLocation(node);
  if (symbol) {
    return getJSDocDeprecatedTag(symbol, checker);
  }

  return { deprecated: false, reason: "" };
}
