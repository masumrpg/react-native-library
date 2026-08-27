import * as fs from "node:fs";
import * as path from "node:path";
import { parseMarkdownDocument } from "./parser.js";
import { buildDocxDocument } from "./docx/docxBuilder.js";
import { buildHtmlDocument } from "./html/htmlBuilder.js";
import { buildPdfDocument } from "./pdf/pdfBuilder.js";
import type {
  MarkforgeConfig,
  MarkforgeFormat,
  CompilationResult,
  GeneratedOutputFile,
} from "../config/types.js";
import { DEFAULT_CONFIG } from "../config/loadConfig.js";

/**
 * Formats local timestamp with timezone offset.
 */
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
  const absOffsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const absOffsetMinutes = pad(Math.abs(offsetMinutes) % 60);
  const tzString = `GMT${sign}${absOffsetHours}:${absOffsetMinutes}`;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} (${tzString})`;
}

/**
 * Compiles a markdown or MDX file into the specified document formats.
 */
export async function compileMarkdown(
  inputFilePathOrContent: string,
  userConfig: MarkforgeConfig = {},
  onProgress?: (msg: string) => void
): Promise<CompilationResult> {
  const startTime = Date.now();
  const config: MarkforgeConfig = { ...DEFAULT_CONFIG, ...userConfig };

  let rawMarkdown = "";
  let baseDir = process.cwd();
  let inputFileName = "document.md";
  let isFilePath = false;

  if (fs.existsSync(inputFilePathOrContent)) {
    isFilePath = true;
    rawMarkdown = fs.readFileSync(inputFilePathOrContent, "utf-8");
    baseDir = path.dirname(path.resolve(inputFilePathOrContent));
    inputFileName = path.basename(inputFilePathOrContent);
  } else {
    rawMarkdown = inputFilePathOrContent;
  }

  onProgress?.(`Parsing markdown AST: ${inputFileName}...`);
  const parsedDoc = parseMarkdownDocument(rawMarkdown);

  const baseName = inputFileName.replace(/\.(md|mdx|markdown)$/i, "");
  const outputDir = config.outputDir
    ? path.isAbsolute(config.outputDir)
      ? config.outputDir
      : path.resolve(process.cwd(), config.outputDir)
    : baseDir;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const formats: MarkforgeFormat[] = Array.isArray(config.to)
    ? config.to
    : [config.to || "docx", "pdf"];

  const generatedFiles: GeneratedOutputFile[] = [];
  const errors: string[] = [];

  for (const fmt of formats) {
    try {
      if (fmt === "docx") {
        onProgress?.(`Generating DOCX document: ${baseName}.docx...`);
        const docxBuffer = await buildDocxDocument(parsedDoc, config, baseDir);
        const docxPath = path.join(outputDir, `${baseName}.docx`);
        fs.writeFileSync(docxPath, docxBuffer);

        generatedFiles.push({
          format: "docx",
          filePath: docxPath,
          fileName: `${baseName}.docx`,
          sizeBytes: docxBuffer.length,
        });
      } else if (fmt === "html") {
        onProgress?.(`Generating HTML document: ${baseName}.html...`);
        const htmlString = await buildHtmlDocument(parsedDoc, config, baseDir);
        const htmlPath = path.join(outputDir, `${baseName}.html`);
        fs.writeFileSync(htmlPath, htmlString, "utf-8");

        generatedFiles.push({
          format: "html",
          filePath: htmlPath,
          fileName: `${baseName}.html`,
          sizeBytes: Buffer.byteLength(htmlString, "utf-8"),
        });
      } else if (fmt === "pdf") {
        onProgress?.(`Generating PDF document: ${baseName}.pdf...`);
        const pdfBuffer = await buildPdfDocument(parsedDoc, config, baseDir);
        const pdfPath = path.join(outputDir, `${baseName}.pdf`);
        fs.writeFileSync(pdfPath, pdfBuffer);

        generatedFiles.push({
          format: "pdf",
          filePath: pdfPath,
          fileName: `${baseName}.pdf`,
          sizeBytes: pdfBuffer.length,
        });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      errors.push(`Failed to generate ${fmt}: ${errMsg}`);
    }
  }

  const durationMs = Date.now() - startTime;

  return {
    inputFile: isFilePath ? inputFilePathOrContent : "inline-string",
    durationMs,
    metadata: parsedDoc.metadata,
    files: generatedFiles,
    errors,
  };
}
