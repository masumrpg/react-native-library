import * as ts from "typescript";
import type { AnyTypeUsage } from "../../config/types.js";
import type { CommentSuppressionMap } from "../suppression.js";

/**
 * Traverses an AST source file and records explicit `any` type usages.
 */
export function checkExplicitAnyUsages(
  sourceFile: ts.SourceFile,
  packageName: string,
  suppression?: CommentSuppressionMap
): { items: AnyTypeUsage[]; suppressedCount: number } {
  const anyUsages: AnyTypeUsage[] = [];
  let suppressedCount = 0;

  function visit(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      const lineNum = line + 1;
      const colNum = character + 1;

      if (suppression?.isSuppressed(lineNum, "noExplicitAny")) {
        suppressedCount++;
      } else {
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
          line: lineNum,
          column: colNum,
          context,
          codeSnippet: lineText,
          package: packageName,
          suggestedFix: "Specify a concrete type interface or 'unknown' instead of 'any'",
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { items: anyUsages, suppressedCount };
}
