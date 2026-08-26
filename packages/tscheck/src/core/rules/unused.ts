import * as ts from "typescript";
import type { UnusedItem } from "../../config/types.js";
import type { CommentSuppressionMap } from "../suppression.js";

/**
 * Checks TypeScript compiler diagnostics for unused variables, parameters, and imports.
 */
export function checkUnusedDiagnostics(
  program: ts.Program,
  sourceFile: ts.SourceFile,
  packageName: string,
  suppression?: CommentSuppressionMap
): { items: UnusedItem[]; suppressedCount: number } {
  const unusedItems: UnusedItem[] = [];
  let suppressedCount = 0;

  const UNUSED_CODES = new Set([6133, 6138, 6192, 6196, 6198, 6199]);
  const diagnostics = program.getSemanticDiagnostics(sourceFile);

  for (const diag of diagnostics) {
    if (UNUSED_CODES.has(diag.code)) {
      if (diag.start !== undefined) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start);
        const lineNum = line + 1;
        const colNum = character + 1;

        if (suppression?.isSuppressed(lineNum, "unused")) {
          suppressedCount++;
          continue;
        }

        const messageText =
          typeof diag.messageText === "string"
            ? diag.messageText
            : diag.messageText.messageText;

        let type: UnusedItem["type"] = "other";
        if (diag.code === 6192 || messageText.toLowerCase().includes("import")) {
          type = "unused-import";
        } else if (messageText.toLowerCase().includes("parameter")) {
          type = "unused-parameter";
        } else {
          type = "unused-variable";
        }

        const match = messageText.match(/'([^']+)'/);
        const name = match ? match[1] : "unknown";

        // Ignore unused variables that are prefixed with underscore e.g. `_unused`
        if (name.startsWith("_")) {
          continue;
        }

        const suggestedFix =
          type === "unused-import"
            ? `Remove unused import '${name}'`
            : `Prefix with underscore '_${name}' or remove`;

        unusedItems.push({
          file: sourceFile.fileName,
          line: lineNum,
          column: colNum,
          name,
          type,
          message: messageText,
          package: packageName,
          suggestedFix,
        });
      }
    }
  }

  return { items: unusedItems, suppressedCount };
}
