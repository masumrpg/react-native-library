import * as ts from "typescript";
import type { UnusedItem } from "../../config/types.js";

/**
 * Checks TypeScript compiler diagnostics for unused variables, parameters, and imports.
 */
export function checkUnusedDiagnostics(
  program: ts.Program,
  sourceFile: ts.SourceFile,
  packageName: string
): UnusedItem[] {
  const unusedItems: UnusedItem[] = [];

  // TS diagnostic codes for unused items
  // 6133: 'x' is declared but its value is never read.
  // 6138: Property 'x' is declared but its value is never read.
  // 6192: All imports in import declaration are unused.
  // 6196: 'x' is declared but never used.
  // 6198: All destructured elements are unused.
  // 6199: All variables in a destructuring declaration are unused.
  // 6205: Parameter 'x' implicitly has an 'any' type, but a better type may be inferred from usage.
  const UNUSED_CODES = new Set([6133, 6138, 6192, 6196, 6198, 6199]);

  const diagnostics = program.getSemanticDiagnostics(sourceFile);

  for (const diag of diagnostics) {
    if (UNUSED_CODES.has(diag.code)) {
      if (diag.start !== undefined) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(diag.start);
        const messageText =
          typeof diag.messageText === "string"
            ? diag.messageText
            : diag.messageText.messageText;

        let type: UnusedItem["type"] = "other";
        if (diag.code === 6133) {
          if (messageText.includes("parameter") || messageText.includes("Parameter")) {
            type = "unused-parameter";
          } else if (messageText.includes("import") || messageText.includes("Import")) {
            type = "unused-import";
          } else {
            type = "unused-variable";
          }
        } else if (diag.code === 6192) {
          type = "unused-import";
        } else if (diag.code === 6196) {
          type = "unused-variable";
        }

        const match = messageText.match(/'([^']+)'/);
        const name = match ? match[1] : "unknown";

        // Ignore unused variables that are prefixed with underscore e.g. `_unused`
        if (name.startsWith("_")) {
          continue;
        }

        unusedItems.push({
          file: sourceFile.fileName,
          line: line + 1,
          column: character + 1,
          name,
          type,
          message: messageText,
          package: packageName,
        });
      }
    }
  }

  return unusedItems;
}
