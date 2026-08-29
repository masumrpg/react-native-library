import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ImageRun,
  Header,
  Footer,
  PageNumber,
  Packer,
  PageOrientation,
  convertInchesToTwip,
  convertMillimetersToTwip,
  ShadingType,
  ExternalHyperlink,
  TabStopType,
} from "docx";
import type { ParsedMarkdownDocument, MarkdownInlineSpan } from "../parser.js";
import { parseInlineSpans } from "../parser.js";
import type { MarkforgeConfig, ThemeProps } from "../../config/types.js";
import { resolveImage } from "../imageResolver.js";
import { tokenizeCodeLine } from "../syntax/syntaxHighlighter.js";
import { renderMermaidToPng } from "../mermaid/mermaidRenderer.js";

/**
 * Converts CSS margin string (e.g. "2.5cm", "1in", "20mm", 1440) to Word Twips.
 */
export function parseMarginToTwip(margin?: string | number, defaultTwip: number = 1440): number {
  if (typeof margin === "number") return margin;
  if (!margin) return defaultTwip;

  const str = margin.trim().toLowerCase();
  if (str.endsWith("cm")) {
    const cm = parseFloat(str);
    return Math.round(convertMillimetersToTwip(cm * 10));
  }
  if (str.endsWith("mm")) {
    const mm = parseFloat(str);
    return Math.round(convertMillimetersToTwip(mm));
  }
  if (str.endsWith("in") || str.endsWith("inch")) {
    const inch = parseFloat(str);
    return Math.round(convertInchesToTwip(inch));
  }
  if (str.endsWith("pt")) {
    const pt = parseFloat(str);
    return Math.round(pt * 20);
  }
  const val = parseFloat(str);
  return isNaN(val) ? defaultTwip : Math.round(val);
}

import { resolveDocumentConfig } from "../../config/resolveConfig.js";

export interface InlineRunOptions {
  font?: string;
  size?: number;
  color?: string;
  bold?: boolean;
  italics?: boolean;
}

/**
 * Converts Markdown inline spans into Word TextRuns or Hyperlinks.
 */
export async function convertInlinesToTextRuns(
  spans: MarkdownInlineSpan[] = [],
  baseDir: string = process.cwd(),
  options: InlineRunOptions = {}
): Promise<(TextRun | ExternalHyperlink | ImageRun)[]> {
  const runs: (TextRun | ExternalHyperlink | ImageRun)[] = [];

  for (const span of spans) {
    if (span.type === "image" && span.url) {
      const resolved = await resolveImage(span.url, baseDir);
      if (resolved) {
        let width = 500;
        let height = 300;
        if (span.width) width = parseInt(String(span.width), 10) || 500;
        if (span.height) height = parseInt(String(span.height), 10) || 300;

        runs.push(
          new ImageRun({
            data: resolved.buffer,
            transformation: {
              width: Math.min(width, 550),
              height: Math.min(height, 400),
            },
            type: "png",
          })
        );
      }
      continue;
    }

    if (span.type === "link" && span.url) {
      runs.push(
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: span.content,
              style: "Hyperlink",
              color: "009DA0",
              font: options.font,
              size: options.size,
              bold: options.bold,
              underline: {},
            }),
          ],
          link: span.url,
        })
      );
      continue;
    }

    if (span.type === "bold") {
      runs.push(
        new TextRun({
          text: span.content,
          bold: true,
          font: options.font,
          size: options.size,
          color: options.color,
          italics: options.italics,
        })
      );
      continue;
    }

    if (span.type === "italic") {
      runs.push(
        new TextRun({
          text: span.content,
          italics: true,
          font: options.font,
          size: options.size,
          color: options.color,
          bold: options.bold,
        })
      );
      continue;
    }

    if (span.type === "strikethrough") {
      runs.push(
        new TextRun({
          text: span.content,
          strike: true,
          font: options.font,
          size: options.size,
          color: options.color,
        })
      );
      continue;
    }

    if (span.type === "code") {
      runs.push(
        new TextRun({
          text: span.content,
          font: "Consolas",
          size: options.size ? options.size - 2 : 19,
          color: "0F172A",
          shading: {
            type: ShadingType.CLEAR,
            fill: "F1F5F9",
          },
        })
      );
      continue;
    }

    if (span.type === "htmlInline") {
      let colorHex: string | undefined = options.color;
      let bgHex: string | undefined;
      let isBold = !!options.bold;
      let isItalic = !!options.italics;

      if (span.style) {
        if (span.style.color) {
          colorHex = span.style.color.replace("#", "").trim();
        }
        if (span.style.background || span.style["background-color"]) {
          bgHex = (span.style.background || span.style["background-color"]).replace("#", "").trim();
        }
        if (span.style["font-weight"] === "bold" || span.style["font-weight"] === "700") {
          isBold = true;
        }
        if (span.style["font-style"] === "italic") {
          isItalic = true;
        }
      }

      if (span.children && span.children.length > 0) {
        const childRuns = await convertInlinesToTextRuns(span.children, baseDir, options);
        for (const child of childRuns) {
          runs.push(child);
        }
        continue;
      }

      runs.push(
        new TextRun({
          text: span.content,
          color: colorHex,
          bold: isBold,
          italics: isItalic,
          font: options.font,
          size: options.size,
          shading: bgHex ? { type: ShadingType.CLEAR, fill: bgHex } : undefined,
        })
      );
      continue;
    }

    // Plain text
    runs.push(
      new TextRun({
        text: span.content,
        font: options.font,
        size: options.size,
        color: options.color,
        bold: options.bold,
        italics: options.italics,
      })
    );
  }

  return runs;
}

/**
 * Builds a complete docx.Document from a parsed Markdown document.
 */
export async function buildDocxDocument(
  doc: ParsedMarkdownDocument,
  config: MarkforgeConfig,
  baseDir: string = process.cwd()
): Promise<Buffer> {
  const resolved = resolveDocumentConfig(doc.metadata as Record<string, unknown>, config);
  const docElements: (Paragraph | Table)[] = [];

  // Theme Colors
  const themeProps: ThemeProps = typeof resolved.theme === "object" ? resolved.theme : {};
  const primaryHex = (themeProps.primaryColor || "#33CDCF").replace("#", "");
  const primaryDarkHex = (themeProps.primaryDark || "#009DA0").replace("#", "");
  const textHex = (themeProps.textColor || "#0F172A").replace("#", "");
  const textMutedHex = (themeProps.textMuted || "#64748B").replace("#", "");
  const borderHex = (themeProps.borderColor || "#E2E8F0").replace("#", "");
  const cardBgHex = (themeProps.cardBackground || "#F8FAFC").replace("#", "");
  const defaultFont = themeProps.fontFamily
    ? themeProps.fontFamily.split(",")[0].replace(/['"]/g, "").trim()
    : "Segoe UI";

  // 1. Cover / Title Area if title exists
  if (resolved.title) {
    docElements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resolved.title,
            bold: true,
            size: 44, // 22pt
            color: textHex,
            font: defaultFont,
          }),
        ],
        spacing: { before: 120, after: 80 },
      })
    );

    if (resolved.subtitle) {
      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resolved.subtitle,
              color: textMutedHex,
              size: 24, // 12pt
              font: defaultFont,
            }),
          ],
          spacing: { before: 60, after: 120 },
        })
      );
    }

    if (resolved.author || resolved.date || resolved.version || resolved.company) {
      const metaParts: string[] = [];
      if (resolved.author) metaParts.push(`Author: ${resolved.author}`);
      if (resolved.version) metaParts.push(`Version: ${resolved.version}`);
      if (resolved.date) metaParts.push(`Date: ${resolved.date}`);

      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: metaParts.join("    "),
              color: textMutedHex,
              size: 18, // 9pt
              font: defaultFont,
            }),
          ],
          spacing: { before: 40, after: 240 },
          border: {
            bottom: {
              color: borderHex,
              space: 12,
              style: BorderStyle.SINGLE,
              size: 4,
            },
          },
        })
      );
    }
  }

  // 1.5 Table of Contents (TOC) Card if enabled
  if (resolved.toc) {
    const headingNodes = doc.nodes.filter(
      (n): n is typeof n & { type: "heading"; level: number; text: string } =>
        n.type === "heading" && typeof n.level === "number" && n.level >= 1 && n.level <= 3
    );

    if (headingNodes.length > 0) {
      const tocParagraphs: Paragraph[] = [
        new Paragraph({
          children: [
            new TextRun({
              text: "TABLE OF CONTENTS",
              bold: true,
              size: 18, // 9pt
              color: textMutedHex,
              font: defaultFont,
            }),
          ],
          spacing: { after: 120 },
          border: {
            bottom: {
              color: borderHex,
              space: 6,
              style: BorderStyle.SINGLE,
              size: 4,
            },
          },
        }),
      ];

      for (const h of headingNodes) {
        const indentLeft = (h.level - 1) * 240;
        tocParagraphs.push(
          new Paragraph({
            indent: { left: indentLeft },
            children: [
              new TextRun({
                text: h.text,
                bold: h.level === 1,
                color: primaryDarkHex,
                size: h.level === 1 ? 21 : 20,
                font: defaultFont,
              }),
            ],
            spacing: { before: 20, after: 20 },
          })
        );
      }

      const tocCard = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [9000],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 9000, type: WidthType.DXA },
                shading: { fill: cardBgHex, type: ShadingType.CLEAR },
                margins: { top: 140, bottom: 140, left: 180, right: 180 },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: borderHex },
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: borderHex },
                  left: { style: BorderStyle.SINGLE, size: 4, color: borderHex },
                  right: { style: BorderStyle.SINGLE, size: 4, color: borderHex },
                },
                children: tocParagraphs,
              }),
            ],
          }),
        ],
      });

      docElements.push(tocCard);
      docElements.push(new Paragraph({ spacing: { after: 200 } }));
    }
  }

  // 2. Process AST Nodes
  for (const node of doc.nodes) {
    // Heading Nodes (H1-H6)
    if (node.type === "heading") {
      if (node.level === 1) {
        const runs = await convertInlinesToTextRuns(node.inlines, baseDir, {
          font: defaultFont,
          size: 34, // 17pt
          color: textHex,
          bold: true,
        });

        docElements.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: runs,
            spacing: { before: 360, after: 140 },
            border: {
              bottom: {
                color: primaryHex,
                space: 6,
                style: BorderStyle.SINGLE,
                size: 16,
              },
            },
          })
        );
      } else if (node.level === 2) {
        const runs = await convertInlinesToTextRuns(node.inlines, baseDir, {
          font: defaultFont,
          size: 26, // 13pt
          color: primaryDarkHex,
          bold: true,
        });

        docElements.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: runs,
            spacing: { before: 280, after: 100 },
            border: {
              bottom: {
                color: borderHex,
                space: 4,
                style: BorderStyle.SINGLE,
                size: 4,
              },
            },
          })
        );
      } else {
        const runs = await convertInlinesToTextRuns(node.inlines, baseDir, {
          font: defaultFont,
          size: 22, // 11pt
          color: textHex,
          bold: true,
        });

        docElements.push(
          new Paragraph({
            heading: node.level === 3 ? HeadingLevel.HEADING_3 : HeadingLevel.HEADING_4,
            children: runs,
            spacing: { before: 200, after: 80 },
          })
        );
      }
      continue;
    }

    // Paragraph Nodes
    if (node.type === "paragraph") {
      const runs = await convertInlinesToTextRuns(node.inlines, baseDir, {
        font: defaultFont,
        size: 22, // 11pt
        color: "334155",
      });

      docElements.push(
        new Paragraph({
          children: runs,
          spacing: { before: 40, after: 140, line: 280 },
        })
      );
      continue;
    }

    // Code Block Nodes
    if (node.type === "codeBlock") {
      const codeLines = (node.text || "").split("\n");
      const codeParagraphs = codeLines.map((l) => {
        const tokens = tokenizeCodeLine(l, node.language, "light");
        const textRuns = tokens.map(
          (t) =>
            new TextRun({
              text: t.text,
              font: "Consolas",
              size: 19, // 9.5pt
              color: t.colorHex,
              bold: t.bold,
              italics: t.italic,
            })
        );
        return new Paragraph({
          children: textRuns,
          spacing: { before: 20, after: 20 },
        });
      });

      const codeTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [9000],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 9000, type: WidthType.DXA },
                shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
                margins: { top: 140, bottom: 140, left: 180, right: 180 },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
                  left: { style: BorderStyle.SINGLE, size: 8, color: "33CDCF" },
                  right: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
                },
                children: codeParagraphs,
              }),
            ],
          }),
        ],
      });

      docElements.push(codeTable);
      docElements.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }

    // Callout / Alert Nodes
    if (node.type === "callout") {
      let borderColor = "33CDCF"; // NOTE / Blu by BCA Digital cyan
      let bgFill = "ECFDFD";
      let title = "NOTE";

      if (node.calloutType === "TIP") {
        borderColor = "10B981";
        bgFill = "ECFDF5";
        title = "TIP";
      } else if (node.calloutType === "WARNING") {
        borderColor = "F59E0B";
        bgFill = "FFFBEB";
        title = "WARNING";
      } else if (node.calloutType === "CAUTION") {
        borderColor = "EF4444";
        bgFill = "FEF2F2";
        title = "CAUTION";
      } else if (node.calloutType === "IMPORTANT") {
        borderColor = "8B5CF6";
        bgFill = "F5F3FF";
        title = "IMPORTANT";
      }

      const runs = await convertInlinesToTextRuns(node.inlines, baseDir, {
        font: defaultFont,
        size: 21,
        color: "334155",
      });

      const calloutTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [9000],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 9000, type: WidthType.DXA },
                shading: { fill: bgFill, type: ShadingType.CLEAR },
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.SINGLE, size: 20, color: borderColor },
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `[${title}]`,
                        bold: true,
                        color: borderColor,
                        font: defaultFont,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 40 },
                  }),
                  new Paragraph({
                    children: runs,
                    spacing: { line: 270 },
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      docElements.push(calloutTable);
      docElements.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }

    // Blockquote Nodes
    if (node.type === "blockquote") {
      const quoteParagraphs: Paragraph[] = [];
      const lines = (node.text || "").split("\n\n").filter(Boolean);
      if (lines.length > 0) {
        for (const lineText of lines) {
          const spans = parseInlineSpans(lineText.replace(/^>\s?/, "").trim());
          const lineRuns = await convertInlinesToTextRuns(spans, baseDir, {
            font: defaultFont,
            size: 21,
            color: "475569",
            italics: true,
          });
          quoteParagraphs.push(
            new Paragraph({
              children: lineRuns,
              spacing: { before: 20, after: 20, line: 260 },
            })
          );
        }
      } else {
        const runs = await convertInlinesToTextRuns(node.inlines, baseDir, {
          font: defaultFont,
          size: 21,
          color: "475569",
          italics: true,
        });
        quoteParagraphs.push(new Paragraph({ children: runs, spacing: { line: 260 } }));
      }

      const quoteTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: [9000],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 9000, type: WidthType.DXA },
                shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.SINGLE, size: 16, color: primaryHex },
                },
                children: quoteParagraphs,
              }),
            ],
          }),
        ],
      });

      docElements.push(quoteTable);
      docElements.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }

    // Mermaid Diagram Nodes
    if (node.type === "mermaid") {
      const pngBuffer = await renderMermaidToPng(node.text || "", baseDir);
      if (pngBuffer) {
        docElements.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: pngBuffer,
                transformation: {
                  width: 550,
                  height: 320,
                },
                type: "png",
              }),
            ],
            spacing: { before: 120, after: 120 },
          })
        );
      } else {
        docElements.push(
          new Paragraph({
            children: [
              new TextRun({ text: "[Mermaid Diagram: " + (node.text || "").slice(0, 40) + "...]", bold: true, color: primaryHex }),
            ],
            spacing: { before: 60, after: 60 },
          })
        );
      }
      continue;
    }

    // Table Nodes
    if (node.type === "table" && node.children) {
      const tableRows: TableRow[] = [];
      const numCols = node.children[0]?.children?.length || 1;
      const colWidth = Math.floor(9000 / numCols);

      for (let rowIdx = 0; rowIdx < node.children.length; rowIdx++) {
        const rowNode = node.children[rowIdx];
        const cells: TableCell[] = [];
        const isHeader = rowNode.isHeader;
        const rowBg = isHeader ? "F1F5F9" : rowIdx % 2 === 0 ? "FFFFFF" : "F8FAFC";

        if (rowNode.children) {
          for (let colIdx = 0; colIdx < rowNode.children.length; colIdx++) {
            const cellNode = rowNode.children[colIdx];
            const align = node.align?.[colIdx];
            let alignment: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT;
            if (align === "center") alignment = AlignmentType.CENTER;
            if (align === "right") alignment = AlignmentType.RIGHT;

            const runs = await convertInlinesToTextRuns(cellNode.inlines, baseDir, {
              font: defaultFont,
              size: 20,
              color: isHeader ? "0F172A" : "334155",
              bold: isHeader,
            });

            cells.push(
              new TableCell({
                width: { size: colWidth, type: WidthType.DXA },
                shading: { fill: rowBg, type: ShadingType.CLEAR },
                margins: { top: 100, bottom: 100, left: 140, right: 140 },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
                  bottom: { style: BorderStyle.SINGLE, size: isHeader ? 8 : 4, color: isHeader ? "CBD5E1" : "E2E8F0" },
                  left: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
                  right: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
                },
                children: [
                  new Paragraph({
                    alignment,
                    children: runs,
                  }),
                ],
              })
            );
          }
        }

        tableRows.push(
          new TableRow({
            tableHeader: isHeader,
            children: cells,
          })
        );
      }

      const docxTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        columnWidths: Array(numCols).fill(colWidth),
        rows: tableRows,
      });

      docElements.push(docxTable);
      docElements.push(new Paragraph({ spacing: { after: 140 } }));
      continue;
    }

    // List Item Nodes
    if (node.type === "list" && node.children) {
      for (const item of node.children) {
        const runs = await convertInlinesToTextRuns(item.inlines, baseDir, {
          font: defaultFont,
          size: 21,
          color: "334155",
        });
        let prefix = "";
        if (item.checked !== undefined) {
          prefix = item.checked ? "[X] " : "[ ] ";
        }

        docElements.push(
          new Paragraph({
            bullet: node.ordered ? undefined : { level: 0 },
            children: [
              ...(prefix ? [new TextRun({ text: prefix, bold: true, font: "Consolas" })] : []),
              ...runs,
            ],
            spacing: { before: 20, after: 20, line: 260 },
          })
        );
      }
      docElements.push(new Paragraph({ spacing: { after: 80 } }));
      continue;
    }

    // Thematic Break (Divider)
    if (node.type === "thematicBreak") {
      docElements.push(
        new Paragraph({
          spacing: { before: 180, after: 180 },
          border: {
            bottom: {
              color: "E2E8F0",
              space: 4,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );
      continue;
    }

    // HTML Block Nodes (e.g. <div class="metric-card">...</div>)
    if (node.type === "htmlBlock" && node.rawHtml) {
      const isCard =
        node.rawHtml.includes("card") ||
        node.rawHtml.includes("box") ||
        node.rawHtml.includes("metric");

      // Extract clean text while preserving structural paragraphs
      const cleanInner = node.rawHtml
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<\/div>/gi, "\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s+/g, "\n")
        .trim();

      if (cleanInner) {
        const innerParagraphs = cleanInner.split("\n\n").filter(Boolean);
        const paraElements: Paragraph[] = [];

        for (const p of innerParagraphs) {
          const spans = parseInlineSpans(p.trim());
          const runs = await convertInlinesToTextRuns(spans, baseDir);
          if (runs.length > 0) {
            paraElements.push(
              new Paragraph({
                children: runs,
                spacing: { before: 30, after: 30 },
              })
            );
          }
        }

        if (isCard && paraElements.length > 0) {
          const cardTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [9000],
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 9000, type: WidthType.DXA },
                    shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
                    margins: { top: 140, bottom: 140, left: 180, right: 180 },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
                      bottom: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
                      left: { style: BorderStyle.SINGLE, size: 8, color: "33CDCF" },
                      right: { style: BorderStyle.SINGLE, size: 4, color: "E2E8F0" },
                    },
                    children: paraElements,
                  }),
                ],
              }),
            ],
          });
          docElements.push(cardTable);
          docElements.push(new Paragraph({ spacing: { after: 120 } }));
        } else {
          for (const pe of paraElements) {
            docElements.push(pe);
          }
        }
      }
      continue;
    }
  }

  // 3. Configure Header & Footer using native Word Tab Stops (0% table boundaries, 100% clean)
  const contentWidthTwip = Math.max(
    1000,
    resolved.paperDimensions.widthTwip - resolved.margins.leftTwip - resolved.margins.rightTwip
  );
  const centerPos = Math.round(contentWidthTwip / 2);
  const rightPos = contentWidthTwip;

  const headerRuns: TextRun[] = [];
  if (resolved.header?.left) {
    headerRuns.push(
      new TextRun({
        text: resolved.header.left.text,
        color: resolved.header.left.color.replace("#", ""),
        size: (resolved.header.left.fontSize || 9) * 2,
        font: resolved.header.left.fontFamily || defaultFont,
        bold: resolved.header.left.bold,
        italics: resolved.header.left.italic,
      })
    );
  }
  headerRuns.push(new TextRun({ text: "\t" }));
  if (resolved.header?.center) {
    headerRuns.push(
      new TextRun({
        text: resolved.header.center.text,
        color: resolved.header.center.color.replace("#", ""),
        size: (resolved.header.center.fontSize || 9) * 2,
        font: resolved.header.center.fontFamily || defaultFont,
        bold: resolved.header.center.bold,
        italics: resolved.header.center.italic,
      })
    );
  }
  headerRuns.push(new TextRun({ text: "\t" }));
  if (resolved.header?.right) {
    headerRuns.push(
      new TextRun({
        text: resolved.header.right.text,
        color: resolved.header.right.color.replace("#", ""),
        size: (resolved.header.right.fontSize || 9) * 2,
        font: resolved.header.right.fontFamily || defaultFont,
        bold: resolved.header.right.bold,
        italics: resolved.header.right.italic,
      })
    );
  }

  const docHeader = resolved.header
    ? new Header({
        children: [
          new Paragraph({
            tabStops: [
              {
                type: TabStopType.CENTER,
                position: centerPos,
              },
              {
                type: TabStopType.RIGHT,
                position: rightPos,
              },
            ],
            border: resolved.header.divider
              ? {
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 4,
                    space: 6,
                    color: (resolved.header.dividerColor || "#CBD5E1").replace("#", ""),
                  },
                }
              : undefined,
            children: headerRuns,
            spacing: { after: 120 },
          }),
        ],
      })
    : undefined;

  const footerRuns: TextRun[] = [];
  if (resolved.footer?.left) {
    footerRuns.push(
      new TextRun({
        text: resolved.footer.left.text,
        color: resolved.footer.left.color.replace("#", ""),
        size: (resolved.footer.left.fontSize || 9) * 2,
        font: resolved.footer.left.fontFamily || defaultFont,
        bold: resolved.footer.left.bold,
        italics: resolved.footer.left.italic,
      })
    );
  }
  footerRuns.push(new TextRun({ text: "\t" }));
  if (resolved.footer?.center) {
    footerRuns.push(
      new TextRun({
        text: resolved.footer.center.text,
        color: resolved.footer.center.color.replace("#", ""),
        size: (resolved.footer.center.fontSize || 9) * 2,
        font: resolved.footer.center.fontFamily || defaultFont,
        bold: resolved.footer.center.bold,
        italics: resolved.footer.center.italic,
      })
    );
  }
  footerRuns.push(new TextRun({ text: "\t" }));
  if (resolved.footer?.right) {
    const rZone = resolved.footer.right;
    const rColor = rZone.color.replace("#", "");
    const rSize = (rZone.fontSize || 9) * 2;
    const rFont = rZone.fontFamily || defaultFont;
    const rBold = rZone.bold;
    const rItalics = rZone.italic;

    if (rZone.text.includes("{page}") || rZone.text.includes("{pages}")) {
      const parts = rZone.text.split(/(\{page\}|\{pages\})/gi);
      for (const part of parts) {
        if (part.toLowerCase() === "{page}") {
          footerRuns.push(
            new TextRun({
              children: [PageNumber.CURRENT],
              color: rColor,
              size: rSize,
              font: rFont,
              bold: rBold,
              italics: rItalics,
            })
          );
        } else if (part.toLowerCase() === "{pages}") {
          footerRuns.push(
            new TextRun({
              children: [PageNumber.TOTAL_PAGES],
              color: rColor,
              size: rSize,
              font: rFont,
              bold: rBold,
              italics: rItalics,
            })
          );
        } else if (part) {
          footerRuns.push(
            new TextRun({
              text: part,
              color: rColor,
              size: rSize,
              font: rFont,
              bold: rBold,
              italics: rItalics,
            })
          );
        }
      }
    } else {
      footerRuns.push(
        new TextRun({
          text: rZone.text,
          color: rColor,
          size: rSize,
          font: rFont,
          bold: rBold,
          italics: rItalics,
        })
      );
    }
  }

  const docFooter = resolved.footer
    ? new Footer({
        children: [
          new Paragraph({
            tabStops: [
              {
                type: TabStopType.CENTER,
                position: centerPos,
              },
              {
                type: TabStopType.RIGHT,
                position: rightPos,
              },
            ],
            border: resolved.footer.divider
              ? {
                  top: {
                    style: BorderStyle.SINGLE,
                    size: 4,
                    space: 6,
                    color: (resolved.footer.dividerColor || "#CBD5E1").replace("#", ""),
                  },
                }
              : undefined,
            children: footerRuns,
            spacing: { before: 120 },
          }),
        ],
      })
    : undefined;

  // 4. Page Dimensions & Margins
  const isLandscape = resolved.orientation === "landscape";

  const document = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: defaultFont,
            size: 21, // 10.5pt
            color: textHex,
          },
          paragraph: {
            spacing: {
              line: 276, // 1.15 line spacing
              after: 140,
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: resolved.paperDimensions.widthTwip,
              height: resolved.paperDimensions.heightTwip,
              orientation: isLandscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
            },
            margin: {
              top: resolved.margins.topTwip,
              bottom: resolved.margins.bottomTwip,
              left: resolved.margins.leftTwip,
              right: resolved.margins.rightTwip,
              header: 720,
              footer: 720,
            },
          },
        },
        headers: docHeader ? { default: docHeader } : undefined,
        footers: docFooter ? { default: docFooter } : undefined,
        children: docElements,
      },
    ],
  });

  return await Packer.toBuffer(document);
}
