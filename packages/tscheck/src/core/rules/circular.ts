import * as ts from "typescript";
import * as path from "node:path";
import * as fs from "node:fs";
import type { CircularDependency } from "../../config/types.js";
import type { CommentSuppressionMap } from "../suppression.js";

const TS_EXTENSIONS = [".ts", ".tsx", ".d.ts", ".js", ".jsx", "/index.ts", "/index.tsx", "/index.js"];

function resolveRelativeImport(sourceFilePath: string, moduleSpecifier: string): string | null {
  const dir = path.dirname(sourceFilePath);
  const targetBase = path.resolve(dir, moduleSpecifier);
  const strippedBase = targetBase.replace(/\.(m|c)?js$/, "");

  const candidates = [
    targetBase,
    strippedBase,
    ...TS_EXTENSIONS.map((ext) => strippedBase + ext),
    ...TS_EXTENSIONS.map((ext) => targetBase + ext),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

export function checkCircularDependencies(
  program: ts.Program,
  workspaceName: string,
  suppressionMaps: Map<string, CommentSuppressionMap>,
  checkCircular: boolean = true
): {
  circularDependencies: CircularDependency[];
  suppressedCount: number;
} {
  const circularDependencies: CircularDependency[] = [];
  let suppressedCount = 0;

  if (!checkCircular) {
    return { circularDependencies, suppressedCount };
  }

  const sourceFiles = program
    .getSourceFiles()
    .filter((sf) => !sf.isDeclarationFile && !sf.fileName.includes("node_modules"));

  // Build adjacency list: file -> Array<{ target: string; line: number; col: number; snippet: string }>
  const graph = new Map<string, Array<{ target: string; line: number; col: number; snippet: string }>>();
  const fileToSf = new Map<string, ts.SourceFile>();

  for (const sf of sourceFiles) {
    fileToSf.set(sf.fileName, sf);
    const edges: Array<{ target: string; line: number; col: number; snippet: string }> = [];

    const visit = (node: ts.Node) => {
      let moduleSpecifierText: string | null = null;
      let specifierNode: ts.Node | null = null;

      if (ts.isImportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        moduleSpecifierText = node.moduleSpecifier.text;
        specifierNode = node.moduleSpecifier;
      } else if (
        ts.isExportDeclaration(node) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        moduleSpecifierText = node.moduleSpecifier.text;
        specifierNode = node.moduleSpecifier;
      }

      if (moduleSpecifierText && specifierNode) {
        const { line, character } = sf.getLineAndCharacterOfPosition(specifierNode.getStart(sf));
        const lineNum = line + 1;
        const colNum = character + 1;
        const snippet = node.getText(sf).trim();

        // Resolve relative path for circular dependency check
        if (moduleSpecifierText.startsWith("./") || moduleSpecifierText.startsWith("../")) {
          const resolved = resolveRelativeImport(sf.fileName, moduleSpecifierText);
          if (resolved) {
            edges.push({
              target: resolved,
              line: lineNum,
              col: colNum,
              snippet,
            });
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sf);
    graph.set(sf.fileName, edges);
  }

  // Detect Cycles using DFS Cycle Detection
  const visited = new Set<string>();
  const inStack = new Set<string>();
  const stack: string[] = [];

  // Track discovered unique cycle signatures to avoid reporting duplicates
  const reportedCycles = new Set<string>();

  function dfs(currentFile: string) {
    visited.add(currentFile);
    inStack.add(currentFile);
    stack.push(currentFile);

    const edges = graph.get(currentFile) || [];
    for (const edge of edges) {
      if (!visited.has(edge.target)) {
        dfs(edge.target);
      } else if (inStack.has(edge.target)) {
        // Cycle detected from edge.target to currentFile
        const cycleStartIndex = stack.indexOf(edge.target);
        if (cycleStartIndex !== -1) {
          const rawCycle = stack.slice(cycleStartIndex);
          const fullCycle = [...rawCycle, edge.target];

          // Normalize cycle representation (start with lowest alphabetically for deduplication)
          const minItem = rawCycle.reduce((min, cur) => (cur < min ? cur : min), rawCycle[0]);
          const minIdx = rawCycle.indexOf(minItem);
          const normalized = [...rawCycle.slice(minIdx), ...rawCycle.slice(0, minIdx)].join(" -> ");

          if (!reportedCycles.has(normalized)) {
            reportedCycles.add(normalized);

            // Check if any file in cycle suppresses 'circular'
            let isAnySuppressed = false;
            for (const fileInCycle of rawCycle) {
              const fileSup = suppressionMaps.get(fileInCycle);
              if (fileSup?.isSuppressed(1, "circular") || fileSup?.isSuppressed(edge.line, "circular")) {
                isAnySuppressed = true;
                break;
              }
            }

            if (isAnySuppressed) {
              suppressedCount++;
            } else {
              circularDependencies.push({
                package: workspaceName,
                file: currentFile,
                cycle: fullCycle,
                line: edge.line,
                column: edge.col,
                codeSnippet: edge.snippet,
              });
            }
          }
        }
      }
    }

    stack.pop();
    inStack.delete(currentFile);
  }

  for (const file of graph.keys()) {
    if (!visited.has(file)) {
      dfs(file);
    }
  }

  return { circularDependencies, suppressedCount };
}

// Alias for backwards compatibility
export const checkCircularAndBoundaryRules = checkCircularDependencies;
