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
import type { MarkforgeConfig } from "../../config/types.js";
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

/**
 * Converts Markdown inline spans into Word TextRuns or Hyperlinks.
 */
export async function convertInlinesToTextRuns(
  spans: MarkdownInlineSpan[] = [],
  baseDir: string = process.cwd()
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
              color: "0969DA",
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
        })
      );
      continue;
    }

    if (span.type === "italic") {
      runs.push(
        new TextRun({
          text: span.content,
          italics: true,
        })
      );
      continue;
    }

    if (span.type === "strikethrough") {
      runs.push(
        new TextRun({
          text: span.content,
          strike: true,
        })
      );
      continue;
    }

    if (span.type === "code") {
      runs.push(
        new TextRun({
          text: ` ${span.content} `,
          font: "Consolas",
          shading: {
            type: ShadingType.CLEAR,
            fill: "F1F5F9",
            color: "0F172A",
          },
        })
      );
      continue;
    }

    if (span.type === "htmlInline") {
      let colorHex: string | undefined;
      let bgHex: string | undefined;
      let isBold = false;
      let isItalic = false;

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
        const childRuns = await convertInlinesToTextRuns(span.children, baseDir);
        for (const child of childRuns) {
          if (child instanceof TextRun) {
            runs.push(child);
          } else {
            runs.push(child);
          }
        }
        continue;
      }

      runs.push(
        new TextRun({
          text: span.content,
          color: colorHex,
          bold: isBold,
          italics: isItalic,
          shading: bgHex ? { type: ShadingType.CLEAR, fill: bgHex } : undefined,
        })
      );
      continue;
    }

    // Default plain text
    runs.push(
      new TextRun({
        text: span.content,
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
  const metadata = { ...config.metadata, ...doc.metadata };
  const docElements: (Paragraph | Table)[] = [];

  // 1. Cover / Title Area if metadata exists
  if (metadata.title) {
    docElements.push(
      new Paragraph({
        text: metadata.title,
        heading: HeadingLevel.TITLE,
        spacing: { before: 200, after: 120 },
      })
    );

    if (metadata.subtitle) {
      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: metadata.subtitle,
              italics: true,
              color: "64748B",
              size: 24, // 12pt
            }),
          ],
          spacing: { after: 180 },
        })
      );
    }

    if (metadata.author || metadata.date) {
      const metaParts: string[] = [];
      if (metadata.author) metaParts.push(`Author: ${Array.isArray(metadata.author) ? metadata.author.join(", ") : metadata.author}`);
      if (metadata.date) metaParts.push(`Date: ${metadata.date}`);

      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: metaParts.join("  |  "),
              color: "94A3B8",
              size: 20, // 10pt
            }),
          ],
          spacing: { after: 360 },
          border: {
            bottom: {
              color: "E2E8F0",
              space: 10,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );
    }
  }

  // 2. Process AST Nodes
  for (const node of doc.nodes) {
    // Heading Nodes (H1-H6)
    if (node.type === "heading") {
      let headingLevel: (typeof HeadingLevel)[keyof typeof HeadingLevel] = HeadingLevel.HEADING_1;
      if (node.level === 2) headingLevel = HeadingLevel.HEADING_2;
      if (node.level === 3) headingLevel = HeadingLevel.HEADING_3;
      if (node.level === 4) headingLevel = HeadingLevel.HEADING_4;
      if (node.level === 5) headingLevel = HeadingLevel.HEADING_5;
      if (node.level === 6) headingLevel = HeadingLevel.HEADING_6;

      const runs = await convertInlinesToTextRuns(node.inlines, baseDir);
      docElements.push(
        new Paragraph({
          heading: headingLevel,
          children: runs,
          spacing: { before: 240, after: 120 },
        })
      );
      continue;
    }

    // Paragraph Nodes
    if (node.type === "paragraph") {
      const runs = await convertInlinesToTextRuns(node.inlines, baseDir);
      docElements.push(
        new Paragraph({
          children: runs,
          spacing: { before: 60, after: 140 },
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

      const runs = await convertInlinesToTextRuns(node.inlines, baseDir);

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
                  left: { style: BorderStyle.SINGLE, size: 16, color: borderColor },
                },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `[${title}]`,
                        bold: true,
                        color: borderColor,
                        size: 20,
                      }),
                    ],
                    spacing: { after: 60 },
                  }),
                  new Paragraph({
                    children: runs,
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
          const lineRuns = await convertInlinesToTextRuns(spans, baseDir);
          quoteParagraphs.push(
            new Paragraph({
              children: lineRuns,
              spacing: { before: 40, after: 40 },
            })
          );
        }
      } else {
        const runs = await convertInlinesToTextRuns(node.inlines, baseDir);
        quoteParagraphs.push(new Paragraph({ children: runs }));
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
                  left: { style: BorderStyle.SINGLE, size: 12, color: "33CDCF" },
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
              new TextRun({ text: "[Mermaid Diagram: " + (node.text || "").slice(0, 40) + "...]", bold: true, color: "33CDCF" }),
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

      for (const rowNode of node.children) {
        const cells: TableCell[] = [];
        if (rowNode.children) {
          for (let colIdx = 0; colIdx < rowNode.children.length; colIdx++) {
            const cellNode = rowNode.children[colIdx];
            const align = node.align?.[colIdx];
            let alignment: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT;
            if (align === "center") alignment = AlignmentType.CENTER;
            if (align === "right") alignment = AlignmentType.RIGHT;

            const runs = await convertInlinesToTextRuns(cellNode.inlines, baseDir);

            cells.push(
              new TableCell({
                width: { size: colWidth, type: WidthType.DXA },
                shading: rowNode.isHeader ? { fill: "F1F5F9", type: ShadingType.CLEAR } : undefined,
                margins: { top: 100, bottom: 100, left: 120, right: 120 },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
                  bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
                  left: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
                  right: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
                },
                children: [
                  new Paragraph({
                    alignment,
                    children: rowNode.isHeader
                      ? runs.map((r) => (r instanceof TextRun ? new TextRun({ ...r, bold: true, color: "0F172A" }) : r))
                      : runs,
                  }),
                ],
              })
            );
          }
        }

        tableRows.push(
          new TableRow({
            tableHeader: rowNode.isHeader,
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
        const runs = await convertInlinesToTextRuns(item.inlines, baseDir);
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
            spacing: { before: 40, after: 40 },
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

  // 3. Configure Header & Footer
  const headerObj = metadata.header || config.header;
  const footerObj = metadata.footer || config.footer;

  // The standard Word header/footer layout uses two tab stops:
  // one center tab at the middle of the page, one right tab at the end.
  // We use 9026 (half of ~18000 twip usable width) for center and 9026*2 for right.
  const headerTabStops = [
    { type: TabStopType.CENTER, position: 4513 },
    { type: TabStopType.RIGHT, position: 9026 },
  ];

  const docHeader = headerObj
    ? new Header({
        children: [
          new Paragraph({
            tabStops: headerTabStops,
            children: [
              // Left zone
              ...(headerObj.left
                ? [
                    new TextRun({
                      text: headerObj.left.replace("{title}", metadata.title || ""),
                      color: "94A3B8",
                      size: 18,
                    }),
                  ]
                : []),
              // Center zone (tab + text)
              ...(headerObj.center
                ? [
                    new TextRun({ text: "\t", color: "94A3B8", size: 18 }),
                    new TextRun({
                      text: headerObj.center.replace("{title}", metadata.title || ""),
                      color: "94A3B8",
                      size: 18,
                    }),
                  ]
                : []),
              // Right zone (tab + text) — skip extra tab if center already used one
              ...(headerObj.right
                ? [
                    new TextRun({
                      text: (headerObj.left || headerObj.center) ? "\t" : "",
                      color: "94A3B8",
                      size: 18,
                    }),
                    new TextRun({
                      text: headerObj.right.replace("{title}", metadata.title || ""),
                      color: "94A3B8",
                      size: 18,
                    }),
                  ]
                : []),
            ],
          }),
        ],
      })
    : undefined;

  const docFooter = footerObj
    ? new Footer({
        children: [
          new Paragraph({
            tabStops: headerTabStops,
            children: [
              // Left zone
              ...(footerObj.left
                ? [
                    new TextRun({
                      text: footerObj.left
                        .replace("{page}", "")
                        .replace("{pages}", "")
                        .trim(),
                      color: "94A3B8",
                      size: 18,
                    }),
                  ]
                : []),
              // Right zone: always includes page number if right is configured or footer exists
              new TextRun({ text: "\t", color: "94A3B8", size: 18 }),
              new TextRun({ text: "Page ", color: "94A3B8", size: 18 }),
              new TextRun({ children: [PageNumber.CURRENT], color: "94A3B8", size: 18 }),
              new TextRun({ text: " of ", color: "94A3B8", size: 18 }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], color: "94A3B8", size: 18 }),
            ],
          }),
        ],
      })
    : undefined;

  // 4. Page Margins & Orientation
  const topMargin = parseMarginToTwip(metadata.margins?.top || config.margins?.top, 1440);
  const bottomMargin = parseMarginToTwip(metadata.margins?.bottom || config.margins?.bottom, 1440);
  const leftMargin = parseMarginToTwip(metadata.margins?.left || config.margins?.left, 1440);
  const rightMargin = parseMarginToTwip(metadata.margins?.right || config.margins?.right, 1440);
  const isLandscape = (metadata.orientation || config.orientation) === "landscape";

  const document = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Segoe UI",
            size: 22, // 11pt
            color: "0F172A",
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: isLandscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
            },
            margin: {
              top: topMargin,
              bottom: bottomMargin,
              left: leftMargin,
              right: rightMargin,
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
