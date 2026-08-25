import * as ts from "typescript";
import type { AnyTypeUsage } from "../../config/types.js";

/**
 * Traverses an AST source file and records explicit `any` type usages.
 */
export function checkExplicitAnyUsages(
  sourceFile: ts.SourceFile,
  packageName: string
): AnyTypeUsage[] {
  const anyUsages: AnyTypeUsage[] = [];

  function visit(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      const lineStart = sourceFile.getPositionOfLineAndCharacter(line, 0);
      const lineEnd = sourceFile.getLineEndOfPosition(node.getStart());
      const lineText = sourceFile.text.substring(lineStart, lineEnd).trim();

      // Determine context description
      let context = "any type annotation";
      const parent = node.parent;
      if (parent) {
        if (ts.isTypeReferenceNode(parent)) {
          context = "generic type argument";
        } else if (ts.isTypeAssertionExpression(parent) || ts.isAsExpression(parent)) {
          context = "type assertion (as any)";
        } else if (ts.isParameter(parent)) {
          context = `parameter '${parent.name.getText(sourceFile)}'`;
        } else if (ts.isPropertyDeclaration(parent) || ts.isPropertySignature(parent)) {
          context = `property '${parent.name.getText(sourceFile)}'`;
        } else if (ts.isVariableDeclaration(parent)) {
          context = `variable '${parent.name.getText(sourceFile)}'`;
        } else if (ts.isFunctionDeclaration(parent) || ts.isMethodDeclaration(parent)) {
          context = "return type";
        }
      }

      anyUsages.push({
        file: sourceFile.fileName,
        line: line + 1,
        column: character + 1,
        context,
        codeSnippet: lineText,
        package: packageName,
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return anyUsages;
}
