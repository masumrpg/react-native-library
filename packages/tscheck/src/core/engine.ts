import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";
import type {
  TsCheckConfig,
  AuditReport,
  DeprecatedUsage,
  UnusedItem,
  AnyTypeUsage,
  CircularDependency,
  WorkspaceScanResult,
} from "../config/types.js";
import { checkNodeDeprecation } from "./rules/deprecated.js";
import { checkUnusedDiagnostics } from "./rules/unused.js";
import { checkExplicitAnyUsages } from "./rules/anyType.js";
import { checkCircularDependencies } from "./rules/circular.js";
import { CommentSuppressionMap } from "./suppression.js";
import { getStagedFiles, getChangedFilesSince } from "./git.js";
import { applyAutoFixes } from "./fixer.js";
import { getTscheckVersion } from "../version.js";

export function formatServerTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = pad(Math.floor(absOffset / 60));
  const offsetMins = pad(absOffset % 60);
  const tzString = offsetMinutes === 0 ? "UTC" : `GMT${sign}${offsetHours}:${offsetMins}`;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} (${tzString})`;
}

export interface EngineProject {
  name: string;
  tsconfig: string;
  rootDir: string;
}

export type EngineProgressEvent =
  | {
      type: "start";
      totalWorkspaces: number;
      completedWorkspaces: number;
    }
  | {
      type: "workspace-start";
      workspace: WorkspaceScanResult;
      totalWorkspaces: number;
      completedWorkspaces: number;
    }
  | {
      type: "file-progress";
      workspaceName: string;
      currentFile: string;
      fileIndex: number;
      totalFiles: number;
      phase: string;
    }
  | {
      type: "log";
      message: string;
      level?: "info" | "warn" | "error";
    }
  | {
      type: "workspace-done";
      workspace: WorkspaceScanResult;
      totalWorkspaces: number;
      completedWorkspaces: number;
    }
  | {
      type: "complete";
      report: AuditReport;
    };

export type EngineProgressCallback = (event: EngineProgressEvent) => void;

function findSourceFilesRecursively(dir: string, exclude: string[]): string[] {
  const results: string[] = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (exclude.includes(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...findSourceFilesRecursively(fullPath, exclude));
      } else if (/\.(tsx?|jsx?|mts|cts)$/.test(entry.name) && !entry.name.endsWith(".d.ts")) {
        results.push(fullPath);
      }
    }
  } catch {
    // ignore
  }
  return results;
}

/**
 * Discovers TypeScript projects based on configuration.
 */
export function discoverProjects(config: TsCheckConfig): EngineProject[] {
  const rootDir = config.rootDir || process.cwd();
  const projects: EngineProject[] = [];
  const tsconfigName = config.tsconfigName || "tsconfig.json";

  const searchDirs: string[] = [];
  if (config.workspaces && config.workspaces.length > 0) {
    for (const ws of config.workspaces) {
      if (ws.endsWith("/*")) {
        const parentDir = path.resolve(rootDir, ws.slice(0, -2));
        if (fs.existsSync(parentDir)) {
          const entries = fs.readdirSync(parentDir, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.isDirectory()) {
              searchDirs.push(path.join(parentDir, entry.name));
            }
          }
        }
      } else {
        searchDirs.push(path.resolve(rootDir, ws));
      }
    }
  } else {
    // If no workspaces specified, check root tsconfig
    const rootTsconfig = path.resolve(rootDir, tsconfigName);
    if (fs.existsSync(rootTsconfig)) {
      searchDirs.push(rootDir);
    }
  }

  for (const dir of searchDirs) {
    const tsconfigPath = path.resolve(dir, tsconfigName);
    if (fs.existsSync(tsconfigPath)) {
      let pkgName = path.basename(dir);
      const pkgJsonPath = path.resolve(dir, "package.json");
      if (fs.existsSync(pkgJsonPath)) {
        try {
          const pkgData = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8")) as { name?: string };
          if (pkgData.name) {
            pkgName = pkgData.name;
          }
        } catch {
          // ignore
        }
      }

      projects.push({
        name: pkgName,
        tsconfig: tsconfigPath,
        rootDir: dir,
      });
    }
  }

  // Fallback: If no tsconfig.json exists, discover raw TypeScript source files
  if (projects.length === 0) {
    const excludePatterns = config.exclude || ["node_modules", "dist", "build", ".expo", ".turbo", ".temp"];
    const tsFiles = findSourceFilesRecursively(rootDir, excludePatterns);
    if (tsFiles.length > 0) {
      let pkgName = path.basename(rootDir);
      const pkgJsonPath = path.resolve(rootDir, "package.json");
      if (fs.existsSync(pkgJsonPath)) {
        try {
          const pkgData = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8")) as { name?: string };
          if (pkgData.name) {
            pkgName = pkgData.name;
          }
        } catch {
          // ignore
        }
      }
      projects.push({
        name: pkgName,
        tsconfig: "",
        rootDir,
      });
    }
  }

  return projects;
}

/**
 * Runs the TypeScript AST audit engine.
 */
export async function runAuditEngine(
  config: TsCheckConfig,
  onProgress?: EngineProgressCallback
): Promise<AuditReport> {
  const startTime = Date.now();
  const projects = discoverProjects(config);

  const rules = {
    deprecated: config.rules?.deprecated !== false,
    unused: config.rules?.unused !== false,
    noExplicitAny: config.rules?.noExplicitAny !== false,
    circular: config.rules?.circular !== false,
  };

  const excludePatterns = config.exclude || ["node_modules", "dist", "build", ".expo", ".turbo", ".temp"];

  // Git diff / staged file filtering
  let gitTargetFiles: Set<string> | null = null;
  if (config.staged) {
    gitTargetFiles = new Set<string>();
    for (const f of getStagedFiles(config.rootDir)) {
      gitTargetFiles.add(path.normalize(f));
    }
  } else if (config.since) {
    gitTargetFiles = new Set<string>();
    for (const f of getChangedFilesSince(config.since, config.rootDir)) {
      gitTargetFiles.add(path.normalize(f));
    }
  }

  const allDeprecatedUsages: DeprecatedUsage[] = [];
  const allUnusedItems: UnusedItem[] = [];
  const allAnyUsages: AnyTypeUsage[] = [];
  const allCircularDependencies: CircularDependency[] = [];
  const workspaceResults: WorkspaceScanResult[] = [];
  let totalFilesScanned = 0;
  let totalSuppressedCount = 0;
  const cleanFiles = new Set<string>();

  onProgress?.({
    type: "start",
    totalWorkspaces: projects.length,
    completedWorkspaces: 0,
  });

  for (let i = 0; i < projects.length; i++) {
    const proj = projects[i];

    onProgress?.({
      type: "workspace-start",
      workspace: {
        name: proj.name,
        tsconfig: proj.tsconfig,
        filesScanned: 0,
        deprecatedCount: 0,
        unusedCount: 0,
        anyCount: 0,
        circularCount: 0,
      },
      totalWorkspaces: projects.length,
      completedWorkspaces: i,
    });

    onProgress?.({
      type: "log",
      message: `Loading TypeScript program for ${proj.name}...`,
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    let program: ts.Program;
    if (proj.tsconfig && fs.existsSync(proj.tsconfig)) {
      const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(
        proj.tsconfig,
        {
          noUnusedLocals: true,
          noUnusedParameters: true,
        },
        ts.sys as unknown as ts.ParseConfigFileHost
      );

      const options = parsedCommandLine?.options || {};
      const fileNames = parsedCommandLine?.fileNames || [];
      const host = ts.createCompilerHost(options);
      program = ts.createProgram(fileNames, options, host);
    } else {
      // Fallback: in-memory compiler options for projects without tsconfig.json
      const rawFiles = findSourceFilesRecursively(proj.rootDir, excludePatterns);
      const defaultOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        jsx: ts.JsxEmit.ReactJSX,
        allowJs: true,
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        skipLibCheck: true,
        esModuleInterop: true,
      };
      const host = ts.createCompilerHost(defaultOptions);
      program = ts.createProgram(rawFiles, defaultOptions, host);
    }

    const checker = program.getTypeChecker();
    const allSourceFiles = program.getSourceFiles();

    // Filter valid files first
    const workspaceFiles = allSourceFiles.filter((file) => {
      if (file.isDeclarationFile) return false;
      const normPath = path.normalize(file.fileName);
      const isExcluded = excludePatterns.some((pattern) => normPath.includes(`/${pattern}/`) || normPath.includes(`\\${pattern}\\`));
      if (isExcluded) return false;

      // Check git staged/since filter if active
      if (gitTargetFiles && !gitTargetFiles.has(normPath)) {
        return false;
      }

      return normPath.startsWith(path.normalize(proj.rootDir));
    });

    let projFilesScanned = 0;
    let projDeprecated = 0;
    let projUnused = 0;
    let projAny = 0;

    // Cache comment suppressions per file
    const suppressionMaps = new Map<string, CommentSuppressionMap>();
    for (const sf of workspaceFiles) {
      suppressionMaps.set(sf.fileName, new CommentSuppressionMap(sf));
    }

    // Run circular dependency analysis
    let projCircular = 0;
    if (rules.circular) {
      const graphResult = checkCircularDependencies(
        program,
        proj.name,
        suppressionMaps,
        rules.circular
      );
      allCircularDependencies.push(...graphResult.circularDependencies);
      projCircular += graphResult.circularDependencies.length;
      totalSuppressedCount += graphResult.suppressedCount;
    }

    for (const sourceFile of workspaceFiles) {
      projFilesScanned++;
      totalFilesScanned++;
      let fileHasViolations = false;
      const relPath = path.relative(proj.rootDir, sourceFile.fileName);
      const suppression = suppressionMaps.get(sourceFile.fileName);

      onProgress?.({
        type: "file-progress",
        workspaceName: proj.name,
        currentFile: relPath,
        fileIndex: projFilesScanned,
        totalFiles: workspaceFiles.length,
        phase: "AST Analysis",
      });

      // Yield to the event loop so ink-spinner and terminal rendering can tick smoothly
      await new Promise((resolve) => setTimeout(resolve, 0));

      // 1. Deprecation check
      if (rules.deprecated) {
        const fileDeprecatedNodes: {
          node: ts.Node;
          result: ReturnType<typeof checkNodeDeprecation>;
          lineNum: number;
          colNum: number;
          lineText: string;
        }[] = [];

        const checkNode = (node: ts.Node) => {
          if (
            ts.isIdentifier(node) ||
            ts.isPropertyAccessExpression(node) ||
            ts.isJsxOpeningElement(node) ||
            ts.isJsxSelfClosingElement(node) ||
            ts.isTypeReferenceNode(node)
          ) {
            const result = checkNodeDeprecation(node, checker);
            if (result.deprecated) {
              const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
              const lineNum = line + 1;
              const colNum = character + 1;

              if (suppression?.isSuppressed(lineNum, "deprecated")) {
                totalSuppressedCount++;
              } else {
                const lineStart = sourceFile.getPositionOfLineAndCharacter(line, 0);
                const lineEnd = sourceFile.getLineEndOfPosition(node.getStart());
                const lineText = sourceFile.text.substring(lineStart, lineEnd).trim();

                fileDeprecatedNodes.push({
                  node,
                  result,
                  lineNum,
                  colNum,
                  lineText,
                });
              }
            }
          }
          ts.forEachChild(node, checkNode);
        };
        checkNode(sourceFile);

        // Deduplicate on same line for identical leaf symbols / property calls
        const seenTokensOnLine = new Set<string>();
        for (const item of fileDeprecatedNodes) {
          const rawSymbol = item.node.getText(sourceFile);
          const leafSymbol = rawSymbol.split(".").pop() || rawSymbol;
          const tokenKey = `${item.lineNum}:${leafSymbol}`;

          if (!seenTokensOnLine.has(tokenKey)) {
            seenTokensOnLine.add(tokenKey);
            allDeprecatedUsages.push({
              file: sourceFile.fileName,
              line: item.lineNum,
              column: item.colNum,
              symbol: rawSymbol,
              reason: item.result.reason,
              codeSnippet: item.lineText,
              package: proj.name,
              origin: item.result.origin,
              suggestedFix: item.result.suggestedFix,
            });
            projDeprecated++;
            fileHasViolations = true;
          }
        }
      }

      // 2. Unused items check
      if (rules.unused) {
        const { items: unused, suppressedCount: unusedSuppressed } = checkUnusedDiagnostics(
          program,
          sourceFile,
          proj.name,
          suppression
        );
        totalSuppressedCount += unusedSuppressed;
        if (unused.length > 0) {
          allUnusedItems.push(...unused);
          projUnused += unused.length;
          fileHasViolations = true;
        }
      }

      // 3. Explicit any type check
      if (rules.noExplicitAny) {
        const { items: anyUsages, suppressedCount: anySuppressed } = checkExplicitAnyUsages(
          sourceFile,
          proj.name,
          suppression
        );
        totalSuppressedCount += anySuppressed;
        if (anyUsages.length > 0) {
          allAnyUsages.push(...anyUsages);
          projAny += anyUsages.length;
          fileHasViolations = true;
        }
      }

      if (!fileHasViolations) {
        cleanFiles.add(sourceFile.fileName);
      }
    }

    const wsResult: WorkspaceScanResult = {
      name: proj.name,
      tsconfig: proj.tsconfig,
      filesScanned: projFilesScanned,
      deprecatedCount: projDeprecated,
      unusedCount: projUnused,
      anyCount: projAny,
      circularCount: projCircular,
    };
    workspaceResults.push(wsResult);

    onProgress?.({
      type: "workspace-done",
      workspace: wsResult,
      totalWorkspaces: projects.length,
      completedWorkspaces: i + 1,
    });
  }

  // Auto-Fixer execution
  let fixedCount = 0;
  if (config.fix && allUnusedItems.length > 0) {
    const fixResult = applyAutoFixes(allUnusedItems);
    fixedCount = fixResult.fixedCount;
  }

  const durationMs = Date.now() - startTime;

  const report: AuditReport = {
    version: getTscheckVersion(),
    timestamp: formatServerTimestamp(),
    durationMs,
    summary: {
      totalDeprecatedUsages: allDeprecatedUsages.length,
      totalUnusedItems: allUnusedItems.length,
      totalAnyUsages: allAnyUsages.length,
      totalCircularDependencies: allCircularDependencies.length,
      suppressedCount: totalSuppressedCount,
      fixedCount,
      filesScanned: totalFilesScanned,
      cleanFilesCount: cleanFiles.size,
      workspacesScanned: workspaceResults.length,
    },
    deprecatedUsages: allDeprecatedUsages,
    unusedItems: allUnusedItems,
    anyUsages: allAnyUsages,
    circularDependencies: allCircularDependencies,
    workspaces: workspaceResults,
  };

  onProgress?.({
    type: "complete",
    report,
  });

  return report;
}
