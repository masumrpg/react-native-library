import * as fs from "node:fs";
import type { UnusedItem } from "../config/types.js";

export interface FixResult {
  fixedCount: number;
  modifiedFiles: string[];
}

/**
 * Applies safe automatic code fixes for unused variables and parameters
 * by prefixing them with an underscore `_` to satisfy TypeScript compiler standards.
 */
export function applyAutoFixes(unusedItems: UnusedItem[]): FixResult {
  let fixedCount = 0;
  const modifiedFiles = new Set<string>();

  // Group unused items by file
  const fileMap = new Map<string, UnusedItem[]>();
  for (const item of unusedItems) {
    // Only fix variables and parameters that do NOT already start with _
    if (
      (item.type === "unused-variable" || item.type === "unused-parameter") &&
      !item.name.startsWith("_")
    ) {
      const list = fileMap.get(item.file) || [];
      list.push(item);
      fileMap.set(item.file, list);
    }
  }

  for (const [filePath, items] of fileMap.entries()) {
    if (!fs.existsSync(filePath)) continue;

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n");
      let fileModified = false;

      // Sort items descending by line and column so edits do not shift earlier offsets
      items.sort((a, b) => b.line - a.line || b.column - a.column);

      for (const item of items) {
        const lineIdx = item.line - 1;
        if (lineIdx >= 0 && lineIdx < lines.length) {
          const line = lines[lineIdx];
          const targetName = item.name;

          // Check if identifier exists at line
          const regex = new RegExp(`\\b${targetName}\\b`);
          const match = regex.exec(line);
          if (match) {
            // Replace first matching instance on the specified line
            lines[lineIdx] = line.slice(0, match.index) + `_${targetName}` + line.slice(match.index + targetName.length);
            fixedCount++;
            fileModified = true;
          }
        }
      }

      if (fileModified) {
        fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
        modifiedFiles.add(filePath);
      }
    } catch {
      // Ignore file write errors
    }
  }

  return {
    fixedCount,
    modifiedFiles: Array.from(modifiedFiles),
  };
}
