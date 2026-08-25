import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

interface DeprecatedUsage {
  file: string;
  line: number;
  column: number;
  symbol: string;
  reason: string;
  codeSnippet: string;
  package: string;
}

interface UnusedItem {
  file: string;
  line: number;
  column: number;
  name: string;
  type: "unused-variable" | "unused-parameter" | "unused-import" | "other";
  message: string;
  package: string;
}

interface AnyTypeUsage {
  file: string;
  line: number;
  column: number;
  context: string;
  codeSnippet: string;
  package: string;
}

interface AuditReport {
  timestamp: string;
  summary: {
    totalDeprecatedUsages: number;
    totalUnusedItems: number;
    totalAnyUsages: number;
    filesScanned: number;
    cleanFilesCount: number;
  };
  deprecatedUsages: DeprecatedUsage[];
  unusedItems: UnusedItem[];
  anyUsages: AnyTypeUsage[];
}

const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT_DIR, ".temp", "tscheck");

/**
 * Dynamically discover all projects inside `packages/*` and `apps/*`
 */
function discoverProjects(): { name: string; tsconfig: string }[] {
  const targetDirs = [path.join(ROOT_DIR, "packages"), path.join(ROOT_DIR, "apps")];
  const discovered: { name: string; tsconfig: string }[] = [];

  for (const baseDir of targetDirs) {
    if (!fs.existsSync(baseDir)) continue;
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const projDir = path.join(baseDir, entry.name);
        const tsconfigPath = path.join(projDir, "tsconfig.json");
        const pkgJsonPath = path.join(projDir, "package.json");

        if (fs.existsSync(tsconfigPath)) {
          let name = path.relative(ROOT_DIR, projDir);
          if (fs.existsSync(pkgJsonPath)) {
            try {
              const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
              if (pkg.name) {
                name = pkg.name;
              }
            } catch {
              // fallback to relative path
            }
          }
          discovered.push({ name, tsconfig: tsconfigPath });
        }
      }
    }
  }

  return discovered;
}

function getJSDocDeprecatedTag(symbol: ts.Symbol, checker: ts.TypeChecker): { deprecated: boolean; reason: string } {
  const declarations = symbol.getDeclarations() ?? [];

  // If there are multiple declarations (overloads), don't flag if it's an overloaded method unless all or the called one is deprecated
  for (const decl of declarations) {
    const tags = ts.getJSDocTags(decl);
    const depTag = tags.find((t) => t.tagName.text === "deprecated");
    if (depTag && declarations.length === 1) {
      const reasonText = typeof depTag.comment === "string"
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

function checkNodeDeprecation(node: ts.Node, checker: ts.TypeChecker): { deprecated: boolean; reason: string } {
  // 1. If part of a CallExpression (e.g. fn() or obj.fn()), check exact resolved signature
  let callExpr: ts.CallExpression | undefined;
  if (ts.isCallExpression(node.parent) && (node.parent.expression === node || (ts.isPropertyAccessExpression(node.parent.expression) && node.parent.expression.name === node))) {
    callExpr = node.parent;
  } else if (ts.isPropertyAccessExpression(node) && ts.isCallExpression(node.parent) && node.parent.expression === node) {
    callExpr = node.parent;
  }

  if (callExpr) {
    const signature = checker.getResolvedSignature(callExpr);
    const decl = signature?.getDeclaration();
    if (decl) {
      const tags = ts.getJSDocTags(decl);
      const depTag = tags.find((t) => t.tagName.text === "deprecated");
      if (depTag) {
        const reasonText = typeof depTag.comment === "string"
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

/**
 * Checks if a node is an explicit `any` type annotation written by the developer.
 * Skips catch clause variables (which default to `unknown`/`any`).
 */
function isExplicitAnyKeyword(node: ts.Node): boolean {
  return node.kind === ts.SyntaxKind.AnyKeyword;
}

function getAnyContext(node: ts.Node): string {
  const parent = node.parent;

  if (ts.isParameter(parent)) {
    const paramName = parent.name.getText();
    return `Parameter '${paramName}' typed as any`;
  }

  if (ts.isVariableDeclaration(parent) && parent.type === node) {
    const varName = parent.name.getText();
    return `Variable '${varName}' typed as any`;
  }

  if (ts.isPropertyDeclaration(parent) && parent.type === node) {
    const propName = parent.name.getText();
    return `Property '${propName}' typed as any`;
  }

  if (ts.isPropertySignature(parent) && parent.type === node) {
    const propName = parent.name.getText();
    return `Property signature '${propName}' typed as any`;
  }

  if ((ts.isFunctionDeclaration(parent) || ts.isMethodDeclaration(parent) || ts.isArrowFunction(parent) || ts.isFunctionExpression(parent)) && parent.type === node) {
    return "Function return type is any";
  }

  if (ts.isAsExpression(parent)) {
    return "Type assertion to any";
  }

  if (ts.isArrayTypeNode(parent)) {
    return "Array element typed as any";
  }

  if (ts.isTypeReferenceNode(parent)) {
    return "Generic type argument is any";
  }

  if (ts.isIndexSignatureDeclaration(parent)) {
    return "Index signature typed as any";
  }

  return "Explicit any type annotation";
}

function isCatchClauseVariable(node: ts.Node): boolean {
  // Walk up to see if this `any` is part of a catch clause variable declaration
  let current = node.parent;
  while (current) {
    if (ts.isCatchClause(current)) return true;
    if (ts.isSourceFile(current) || ts.isFunctionDeclaration(current) || ts.isBlock(current)) break;
    current = current.parent;
  }
  return false;
}

function auditProject(project: { name: string; tsconfig: string }) {
  if (!fs.existsSync(project.tsconfig)) {
    console.warn(`[WARN] Config file not found: ${project.tsconfig}`);
    return { deprecated: [], unused: [], anyUsages: [], filesScanned: 0 };
  }

  const configFile = ts.readConfigFile(project.tsconfig, ts.sys.readFile);
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(project.tsconfig),
    {
      noUnusedLocals: true,
      noUnusedParameters: true,
    },
  );

  const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
  const checker = program.getTypeChecker();

  const deprecatedResults: DeprecatedUsage[] = [];
  const unusedResults: UnusedItem[] = [];
  const anyResults: AnyTypeUsage[] = [];

  const projectDir = path.dirname(project.tsconfig);
  const sourceFiles = program.getSourceFiles().filter(
    (sf) => !sf.isDeclarationFile && !sf.fileName.includes("node_modules") && !sf.fileName.includes(".turbo") && sf.fileName.startsWith(projectDir),
  );

  // 1. Scan for Deprecated API Usages & Explicit `any` Types
  for (const sourceFile of sourceFiles) {
    const relativeFilePath = path.relative(ROOT_DIR, sourceFile.fileName);

    const visit = (node: ts.Node) => {
      // Check deprecated
      if (ts.isIdentifier(node) || ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const { deprecated, reason } = checkNodeDeprecation(node, checker);
        if (deprecated) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          const lineStart = sourceFile.getPositionOfLineAndCharacter(line, 0);
          const lineEnd = sourceFile.getLineEndOfPosition(lineStart);
          const codeSnippet = sourceFile.text.substring(lineStart, lineEnd).trim();

          deprecatedResults.push({
            file: relativeFilePath,
            line: line + 1,
            column: character + 1,
            symbol: node.getText(),
            reason: reason.trim(),
            codeSnippet,
            package: project.name,
          });
        }
      }

      // Check explicit `any` type annotations
      if (isExplicitAnyKeyword(node) && !isCatchClauseVariable(node)) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        const lineStart = sourceFile.getPositionOfLineAndCharacter(line, 0);
        const lineEnd = sourceFile.getLineEndOfPosition(lineStart);
        const codeSnippet = sourceFile.text.substring(lineStart, lineEnd).trim();

        // Skip lines with explicit suppression comments
        if (!codeSnippet.includes("// eslint-disable") && !codeSnippet.includes("// @ts-ignore") && !codeSnippet.includes("// @ts-expect-error")) {
          anyResults.push({
            file: relativeFilePath,
            line: line + 1,
            column: character + 1,
            context: getAnyContext(node),
            codeSnippet,
            package: project.name,
          });
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  // 2. Scan for Unused Variables & Imports (Diagnostics)
  const diagnostics = ts.getPreEmitDiagnostics(program);
  for (const diag of diagnostics) {
    if (!diag.file) continue;
    if (diag.file.isDeclarationFile || diag.file.fileName.includes("node_modules") || !diag.file.fileName.startsWith(projectDir)) continue;

    // TS Diagnostic codes for unused items
    // 6133: 'x' is declared but its value is never read.
    // 6192: All imports in import declaration are unused.
    // 6196: 'x' is declared but never used.
    // 6198: All destructured elements are unused.
    if ([6133, 6192, 6196, 6198, 6199, 6205].includes(diag.code)) {
      const pos = diag.file.getLineAndCharacterOfPosition(diag.start ?? 0);
      const message = ts.flattenDiagnosticMessageText(diag.messageText, "\n");
      const relativeFilePath = path.relative(ROOT_DIR, diag.file.fileName);

      let type: UnusedItem["type"] = "other";
      if (diag.code === 6192) type = "unused-import";
      else if (message.includes("parameter")) type = "unused-parameter";
      else if (message.includes("declared but") || message.includes("never read")) type = "unused-variable";

      // Extract symbol name from quotes
      const match = message.match(/'([^']+)'/);
      const name = match ? match[1] : "unknown";

      unusedResults.push({
        file: relativeFilePath,
        line: pos.line + 1,
        column: pos.character + 1,
        name: name ?? "unknown",
        type,
        message,
        package: project.name,
      });
    }
  }

  return {
    deprecated: deprecatedResults,
    unused: unusedResults,
    anyUsages: anyResults,
    filesScanned: sourceFiles.length,
  };
}

function runAudit() {
  console.log("\n========================================================");
  console.log(" CODEBASE AUDIT: DEPRECATED USAGES, UNUSED ITEMS & ANY TYPES");
  console.log("========================================================\n");

  const allDeprecated: DeprecatedUsage[] = [];
  const allUnused: UnusedItem[] = [];
  const allAny: AnyTypeUsage[] = [];
  let totalFiles = 0;

  const projects = discoverProjects();
  console.log(`Discovered ${projects.length} workspaces in packages/ and apps/:\n${projects.map((p) => `  - ${p.name} (${path.relative(ROOT_DIR, p.tsconfig)})`).join("\n")}\n`);

  for (const proj of projects) {
    console.log(`Scanning [${proj.name}]...`);
    const { deprecated, unused, anyUsages, filesScanned } = auditProject(proj);
    allDeprecated.push(...deprecated);
    allUnused.push(...unused);
    allAny.push(...anyUsages);
    totalFiles += filesScanned;
    console.log(`  -> Scanned ${filesScanned} files | Deprecated: ${deprecated.length} | Unused: ${unused.length} | Any: ${anyUsages.length}`);
  }

  const dirtyFiles = new Set([
    ...allDeprecated.map((d) => d.file),
    ...allUnused.map((u) => u.file),
    ...allAny.map((a) => a.file),
  ]);

  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalDeprecatedUsages: allDeprecated.length,
      totalUnusedItems: allUnused.length,
      totalAnyUsages: allAny.length,
      filesScanned: totalFiles,
      cleanFilesCount: totalFiles - dirtyFiles.size,
    },
    deprecatedUsages: allDeprecated,
    unusedItems: allUnused,
    anyUsages: allAny,
  };

  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 1. Write JSON Report
  const jsonPath = path.join(OUTPUT_DIR, "audit-report.json");
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf-8");

  // 2. Write Markdown Report
  const mdPath = path.join(OUTPUT_DIR, "audit-report.md");
  let mdContent = `# Codebase Audit Report\n\n`;
  mdContent += `**Generated At**: ${report.timestamp}\n\n`;
  mdContent += `## Summary\n\n`;
  mdContent += `- **Total Files Scanned**: ${report.summary.filesScanned}\n`;
  mdContent += `- **Deprecated Usages Found**: ${report.summary.totalDeprecatedUsages}\n`;
  mdContent += `- **Unused Items Found**: ${report.summary.totalUnusedItems}\n`;
  mdContent += `- **Explicit \`any\` Usages Found**: ${report.summary.totalAnyUsages}\n`;
  mdContent += `- **Clean Files Count**: ${report.summary.cleanFilesCount}\n\n`;

  mdContent += `## Deprecated API Usages\n\n`;
  if (allDeprecated.length === 0) {
    mdContent += `*No deprecated API usages found in codebase!*\n\n`;
  } else {
    mdContent += `| Package | File:Line | Symbol | Reason / Migration |\n`;
    mdContent += `| :--- | :--- | :--- | :--- |\n`;
    for (const item of allDeprecated) {
      mdContent += `| \`${item.package}\` | [\`${item.file}:${item.line}\`](file://${path.join(ROOT_DIR, item.file)}#L${item.line}) | \`${item.symbol}\` | ${item.reason || "N/A"} |\n`;
    }
    mdContent += `\n`;
  }

  mdContent += `## Unused Variables & Imports\n\n`;
  if (allUnused.length === 0) {
    mdContent += `*No unused variables or imports found!*\n\n`;
  } else {
    mdContent += `| Package | File:Line | Type | Name | Message |\n`;
    mdContent += `| :--- | :--- | :--- | :--- | :--- |\n`;
    for (const item of allUnused) {
      mdContent += `| \`${item.package}\` | [\`${item.file}:${item.line}\`](file://${path.join(ROOT_DIR, item.file)}#L${item.line}) | \`${item.type}\` | \`${item.name}\` | ${item.message} |\n`;
    }
    mdContent += `\n`;
  }

  mdContent += `## Explicit \`any\` Type Usages\n\n`;
  if (allAny.length === 0) {
    mdContent += `*No explicit \`any\` type annotations found!*\n\n`;
  } else {
    mdContent += `| Package | File:Line | Context | Code Snippet |\n`;
    mdContent += `| :--- | :--- | :--- | :--- |\n`;
    for (const item of allAny) {
      const escapedSnippet = item.codeSnippet.replace(/\|/g, "\\|").replace(/\n/g, " ");
      mdContent += `| \`${item.package}\` | [\`${item.file}:${item.line}\`](file://${path.join(ROOT_DIR, item.file)}#L${item.line}) | ${item.context} | \`${escapedSnippet}\` |\n`;
    }
    mdContent += `\n`;
  }

  fs.writeFileSync(mdPath, mdContent, "utf-8");

  // Output terminal summary
  console.log("\n--------------------------------------------------------");
  console.log(" AUDIT SUMMARY");
  console.log("--------------------------------------------------------");
  console.log(`Files Scanned          : ${report.summary.filesScanned}`);
  console.log(`Deprecated Usages      : ${report.summary.totalDeprecatedUsages}`);
  console.log(`Unused Variables/Imports: ${report.summary.totalUnusedItems}`);
  console.log(`Explicit any Usages    : ${report.summary.totalAnyUsages}`);
  console.log(`JSON Report            : ${path.relative(ROOT_DIR, jsonPath)}`);
  console.log(`Markdown Report        : ${path.relative(ROOT_DIR, mdPath)}`);
  console.log("--------------------------------------------------------\n");

  if (allDeprecated.length > 0) {
    console.log("Deprecated Usages Preview:");
    for (const d of allDeprecated.slice(0, 5)) {
      console.log(`  - ${d.file}:${d.line} -> '${d.symbol}' (${d.reason})`);
    }
    if (allDeprecated.length > 5) {
      console.log(`  ... and ${allDeprecated.length - 5} more (see report).`);
    }
  }

  if (allUnused.length > 0) {
    console.log("\nUnused Items Preview:");
    for (const u of allUnused.slice(0, 5)) {
      console.log(`  - ${u.file}:${u.line} -> [${u.type}] '${u.name}'`);
    }
    if (allUnused.length > 5) {
      console.log(`  ... and ${allUnused.length - 5} more (see report).`);
    }
  }

  if (allAny.length > 0) {
    console.log("\nExplicit any Usages Preview:");
    for (const a of allAny.slice(0, 10)) {
      console.log(`  - ${a.file}:${a.line} -> ${a.context}`);
    }
    if (allAny.length > 10) {
      console.log(`  ... and ${allAny.length - 10} more (see report).`);
    }
  }
}

runAudit();
