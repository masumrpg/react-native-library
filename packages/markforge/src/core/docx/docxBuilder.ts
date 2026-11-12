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
  ShadingType,
  ExternalHyperlink,
  TabStopType,
  PageBreak,
  NumberFormat,
  SectionType,
  HorizontalPositionRelativeFrom,
  HorizontalPositionAlign,
  VerticalPositionRelativeFrom,
  VerticalPositionAlign,
  TableOfContents,
  StyleLevel,
  Math as DocxMath,
  MathRun,
  MathFraction,
  MathSuperScript,
  MathSubScript,
  MathSubSuperScript,
  MathRadical,
  type MathComponent,
} from "docx";
import katex from "katex";
import type { ParsedMarkdownDocument, MarkdownInlineSpan } from "../parser.js";
import { parseInlineSpans, applyHeadingNumbering } from "../parser.js";
import type { MarkforgeConfig, ThemeProps } from "../../config/types.js";
import { THEME_PRESETS } from "../../config/types.js";
import { resolveImage } from "../imageResolver.js";
import { tokenizeCodeLine } from "../syntax/syntaxHighlighter.js";
import { renderMermaidToPng } from "../mermaid/mermaidRenderer.js";
import { findChromeExecutable, generateWatermarkPngBuffer } from "../pdf/pdfBuilder.js";

export { parseMarginToTwip } from "../../config/resolveConfig.js";

import {
  resolveDocumentConfig,
  type NormalizedSignatureItem,
  type NormalizedSignatureBlock,
  type NormalizedCoverPage,
  type NormalizedBackCover,
} from "../../config/resolveConfig.js";

export interface InlineRunOptions {
  font?: string;
  size?: number;
  color?: string;
  bold?: boolean;
  italics?: boolean;
}

interface MathMLNode {
  tag: string;
  text?: string;
  children: MathMLNode[];
}

function parseMathML(xml: string): MathMLNode[] {
  const clean = xml.replace(/<annotation[\s\S]*?<\/annotation>/g, "");
  let i = 0;

  function parseChildren(parentTag: string): MathMLNode[] {
    const list: MathMLNode[] = [];
    while (i < clean.length) {
      if (clean[i] === "<") {
        if (clean.startsWith("</", i)) {
          const closeEnd = clean.indexOf(">", i);
          const closeTag = clean.substring(i + 2, closeEnd).trim();
          i = closeEnd + 1;
          if (closeTag === parentTag) break;
          continue;
        }

        const tagEnd = clean.indexOf(">", i);
        if (tagEnd === -1) break;
        const tagContent = clean.substring(i + 1, tagEnd).trim();
        const isSelfClosing = tagContent.endsWith("/") || clean[tagEnd - 1] === "/";
        const tagName = tagContent.split(/[\s/]/)[0];
        i = tagEnd + 1;

        if (isSelfClosing) {
          list.push({ tag: tagName, children: [] });
        } else {
          const children = parseChildren(tagName);
          list.push({ tag: tagName, children });
        }
      } else {
        const nextTag = clean.indexOf("<", i);
        const textEnd = nextTag === -1 ? clean.length : nextTag;
        const text = clean.substring(i, textEnd).trim();
        i = textEnd;
        if (text) {
          list.push({ tag: "#text", text, children: [] });
        }
      }
    }
    return list;
  }

  return parseChildren("");
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&minus;/g, "−")
    .replace(/&plusmn;/g, "±")
    .replace(/&le;/g, "≤")
    .replace(/&ge;/g, "≥")
    .replace(/&times;/g, "×")
    .replace(/&divide;/g, "÷")
    .replace(/&InvisibleTimes;/g, "")
    .replace(/&ApplyFunction;/g, "")
    .replace(/&nbsp;/g, " ");
}

function extractNodeText(node: MathMLNode): string {
  if (node.text) return decodeXmlEntities(node.text);
  let res = "";
  for (const c of node.children) {
    res += extractNodeText(c);
  }
  return decodeXmlEntities(res);
}

function mathNodesToDocx(nodes: MathMLNode[]): MathComponent[] {
  const result: MathComponent[] = [];
  for (const node of nodes) {
    if (node.tag === "#text") {
      const text = decodeXmlEntities(node.text || "");
      if (text.trim()) result.push(new MathRun(text));
    } else if (node.tag === "mi" || node.tag === "mn" || node.tag === "mtext" || node.tag === "mo") {
      const text = extractNodeText(node);
      if (text) result.push(new MathRun(text));
    } else if (node.tag === "mfrac") {
      const num = node.children[0] ? mathNodesToDocx([node.children[0]]) : [];
      const den = node.children[1] ? mathNodesToDocx([node.children[1]]) : [];
      result.push(
        new MathFraction({
          numerator: num.length > 0 ? num : [new MathRun("")],
          denominator: den.length > 0 ? den : [new MathRun("")],
        })
      );
    } else if (node.tag === "msub") {
      const base = node.children[0] ? mathNodesToDocx([node.children[0]]) : [];
      const sub = node.children[1] ? mathNodesToDocx([node.children[1]]) : [];
      result.push(
        new MathSubScript({
          children: base.length > 0 ? base : [new MathRun("")],
          subScript: sub.length > 0 ? sub : [new MathRun("")],
        })
      );
    } else if (node.tag === "msup") {
      const base = node.children[0] ? mathNodesToDocx([node.children[0]]) : [];
      const sup = node.children[1] ? mathNodesToDocx([node.children[1]]) : [];
      result.push(
        new MathSuperScript({
          children: base.length > 0 ? base : [new MathRun("")],
          superScript: sup.length > 0 ? sup : [new MathRun("")],
        })
      );
    } else if (node.tag === "msubsup") {
      const base = node.children[0] ? mathNodesToDocx([node.children[0]]) : [];
      const sub = node.children[1] ? mathNodesToDocx([node.children[1]]) : [];
      const sup = node.children[2] ? mathNodesToDocx([node.children[2]]) : [];
      result.push(
        new MathSubSuperScript({
          children: base.length > 0 ? base : [new MathRun("")],
          subScript: sub.length > 0 ? sub : [new MathRun("")],
          superScript: sup.length > 0 ? sup : [new MathRun("")],
        })
      );
    } else if (node.tag === "msqrt") {
      const children = mathNodesToDocx(node.children);
      result.push(
        new MathRadical({
          children: children.length > 0 ? children : [new MathRun("")],
        })
      );
    } else {
      result.push(...mathNodesToDocx(node.children));
    }
  }
  return result;
}

/**
 * Converts a LaTeX formula string into a native Word Office Math (OMML) element.
 */
export function convertLatexToDocxMath(latex: string): DocxMath {
  try {
    const mathml = katex.renderToString(latex, { output: "mathml" });
    const tree = parseMathML(mathml);
    const components = mathNodesToDocx(tree);
    return new DocxMath({ children: components.length > 0 ? components : [new MathRun(latex)] });
  } catch {
    return new DocxMath({ children: [new MathRun(latex)] });
  }
}

/**
 * Converts Markdown inline spans into Word TextRuns or Hyperlinks.
 */
export async function convertInlinesToTextRuns(
  spans: MarkdownInlineSpan[] = [],
  baseDir: string = process.cwd(),
  options: InlineRunOptions = {}
): Promise<(TextRun | ExternalHyperlink | ImageRun | DocxMath)[]> {
  const runs: (TextRun | ExternalHyperlink | ImageRun | DocxMath)[] = [];

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

    if (span.type === "mathInline") {
      runs.push(convertLatexToDocxMath(span.content));
      continue;
    }

    if (span.type === "footnoteRef") {
      runs.push(
        new TextRun({
          text: `[${span.content}]`,
          superScript: true,
          color: "009DA0",
          bold: true,
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
 * Estimates realistic 1-based page numbers for document headings in DOCX layout.
 */
export function estimateDocxPageNumbers(
  doc: ParsedMarkdownDocument,
  resolved: ReturnType<typeof resolveDocumentConfig>
): Map<string, number> {
  const map = new Map<string, number>();
  const headingNodes = doc.nodes.filter(
    (n): n is typeof n & { type: "heading"; level: number; text: string } =>
      n.type === "heading" && typeof n.level === "number" && n.level >= 1 && n.level <= 3
  );

  if (headingNodes.length === 0) return map;

  // Account for cover page and TOC section pages
  const coverPages = resolved.coverPage?.enabled ? 1 : 0;
  const tocPages = resolved.toc ? Math.max(1, Math.ceil(headingNodes.length / 26)) : 0;
  let currentPage = coverPages + tocPages + 1;

  // Printable page height on A4/Letter minus margins (~660pt usable)
  const PAGE_MAX_HEIGHT_PT = 660;
  let currentHeight = 0;

  for (const node of doc.nodes) {
    if (node.type === "pageBreak") {
      currentPage++;
      currentHeight = 0;
      continue;
    }

    if (node.type === "heading") {
      const isH1 = node.level === 1;
      if (resolved.pageBreaks?.beforeH1 && isH1 && currentHeight > 60) {
        currentPage++;
        currentHeight = 0;
      }

      const hHeight = isH1 ? 58 : node.level === 2 ? 44 : 34;
      if (currentHeight + hHeight > PAGE_MAX_HEIGHT_PT) {
        currentPage++;
        currentHeight = 0;
      }

      const title = (node.text || "").trim();
      if (title) map.set(title, currentPage);
      currentHeight += hHeight;
      continue;
    }

    if (node.type === "paragraph") {
      const textLen = node.text?.length || 60;
      const lines = Math.max(1, Math.ceil(textLen / 75));
      const pHeight = lines * 18 + 12;
      if (currentHeight + pHeight > PAGE_MAX_HEIGHT_PT) {
        const addedPages = Math.floor((currentHeight + pHeight) / PAGE_MAX_HEIGHT_PT);
        currentPage += addedPages;
        currentHeight = (currentHeight + pHeight) % PAGE_MAX_HEIGHT_PT;
      } else {
        currentHeight += pHeight;
      }
    } else if (node.type === "codeBlock") {
      const lines = (node.text || "").split("\n").length;
      const cHeight = lines * 16 + 26;
      if (currentHeight + cHeight > PAGE_MAX_HEIGHT_PT) {
        const addedPages = Math.floor((currentHeight + cHeight) / PAGE_MAX_HEIGHT_PT);
        currentPage += addedPages;
        currentHeight = (currentHeight + cHeight) % PAGE_MAX_HEIGHT_PT;
      } else {
        currentHeight += cHeight;
      }
    } else if (node.type === "table") {
      const rows = (node.children?.length || 2) + 1;
      const tHeight = rows * 28 + 22;
      if (currentHeight + tHeight > PAGE_MAX_HEIGHT_PT) {
        const addedPages = Math.floor((currentHeight + tHeight) / PAGE_MAX_HEIGHT_PT);
        currentPage += addedPages;
        currentHeight = (currentHeight + tHeight) % PAGE_MAX_HEIGHT_PT;
      } else {
        currentHeight += tHeight;
      }
    } else if (node.type === "callout" || node.type === "blockquote") {
      const textLen = node.text?.length || 50;
      const lines = Math.max(1, Math.ceil(textLen / 70));
      const bHeight = 50 + lines * 18;
      if (currentHeight + bHeight > PAGE_MAX_HEIGHT_PT) {
        const addedPages = Math.floor((currentHeight + bHeight) / PAGE_MAX_HEIGHT_PT);
        currentPage += addedPages;
        currentHeight = (currentHeight + bHeight) % PAGE_MAX_HEIGHT_PT;
      } else {
        currentHeight += bHeight;
      }
    } else if (node.type === "list") {
      const items = node.children?.length || 3;
      const lHeight = items * 22 + 10;
      if (currentHeight + lHeight > PAGE_MAX_HEIGHT_PT) {
        const addedPages = Math.floor((currentHeight + lHeight) / PAGE_MAX_HEIGHT_PT);
        currentPage += addedPages;
        currentHeight = (currentHeight + lHeight) % PAGE_MAX_HEIGHT_PT;
      } else {
        currentHeight += lHeight;
      }
    } else if (node.type === "image") {
      const imgHeight = 220;
      if (currentHeight + imgHeight > PAGE_MAX_HEIGHT_PT) {
        currentPage++;
        currentHeight = imgHeight;
      } else {
        currentHeight += imgHeight;
      }
    }
  }

  return map;
}

/**
 * Builds a complete docx.Document from a parsed Markdown document.
 */
export async function buildDocxDocument(
  doc: ParsedMarkdownDocument,
  config: MarkforgeConfig,
  baseDir: string = process.cwd(),
  pageMap?: Map<string, number>
): Promise<Buffer> {
  const resolved = resolveDocumentConfig(doc.metadata as Record<string, unknown>, config);
  const docElements: (Paragraph | Table)[] = [];

  // Theme Resolution
  let themeProps: ThemeProps = {};
  if (typeof resolved.theme === "object" && resolved.theme !== null) {
    themeProps = resolved.theme;
  } else if (typeof resolved.theme === "string") {
    const key = resolved.theme.toLowerCase();
    themeProps = THEME_PRESETS[key] || THEME_PRESETS["corporate"] || {};
  } else {
    themeProps = THEME_PRESETS["corporate"] || {};
  }
  const primaryHex = (themeProps.primaryColor || "#33CDCF").replace("#", "");
  const primaryDarkHex = (themeProps.primaryDark || "#009DA0").replace("#", "");
  const textHex = (themeProps.textColor || "#0F172A").replace("#", "");
  const textMutedHex = (themeProps.textMuted || "#64748B").replace("#", "");
  const borderHex = (themeProps.borderColor || "#E2E8F0").replace("#", "");
  const cardBgHex = (themeProps.cardBackground || "#F8FAFC").replace("#", "");
  const defaultFont = themeProps.fontFamily
    ? themeProps.fontFamily.split(",")[0].replace(/['"]/g, "").trim()
    : "Segoe UI";

  // 1. Cover / Title Area if title exists and NO coverPage
  if (resolved.title && !resolved.coverPage?.enabled) {
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

  // 1.4 Apply heading numbering if enabled
  if (resolved.numberHeadings?.enabled !== false && resolved.numberHeadings) {
    applyHeadingNumbering(doc.nodes, doc.tocEntries, resolved.numberHeadings);
  }

  // 1.5 Table of Contents (TOC) - Native Word TOC with dot leaders & interactive refresh
  if (resolved.toc) {
    const headingNodes = doc.nodes.filter(
      (n): n is typeof n & { type: "heading"; level: number; text: string } =>
        n.type === "heading" && typeof n.level === "number" && n.level >= 1 && n.level <= 3
    );

    if (headingNodes.length > 0) {
      // TOC Section Header
      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "TABLE OF CONTENTS",
              bold: true,
              size: 20, // 10pt
              color: primaryDarkHex,
              font: defaultFont,
            }),
          ],
          spacing: { before: 200, after: 160 },
          border: {
            bottom: {
              color: primaryHex,
              space: 6,
              style: BorderStyle.SINGLE,
              size: 8,
            },
          },
        })
      );

      const normalizeForMatch = (str: string): string =>
        str.replace(/[\s\W_]+/g, "").toLowerCase();

      const estimatedPages = estimateDocxPageNumbers(doc, resolved);
      let lastPage = (resolved.coverPage?.enabled ? 1 : 0) + (resolved.toc ? 1 : 0) + 1;

      const resolvePage = (text: string): number => {
        const clean = text.trim();
        const normH = normalizeForMatch(clean);
        let foundPage: number | undefined;

        if (pageMap) {
          if (pageMap.has(clean)) {
            foundPage = pageMap.get(clean);
          } else {
            pageMap.forEach((p, title) => {
              if (foundPage === undefined && normalizeForMatch(title) === normH) {
                foundPage = p;
              }
            });
          }
        }

        if (foundPage === undefined) {
          foundPage = estimatedPages.get(clean);
        }

        const finalPage = Math.max(lastPage, foundPage ?? lastPage);
        lastPage = finalPage;
        return finalPage;
      };

      // Native Word Table of Contents component (w:sdt field with dot leaders)
      const nativeToc = new TableOfContents("Table of Contents", {
        hyperlink: true,
        headingStyleRange: "1-3",
        stylesWithLevels: [
          new StyleLevel("Heading1", 1),
          new StyleLevel("Heading2", 2),
          new StyleLevel("Heading3", 3),
          new StyleLevel("Heading 1", 1),
          new StyleLevel("Heading 2", 2),
          new StyleLevel("Heading 3", 3),
        ],
        useAppliedParagraphOutlineLevel: true,
        hideTabAndPageNumbersInWebView: true,
        cachedEntries: headingNodes.map((h) => ({
          title: h.text,
          level: h.level,
          page: resolvePage(h.text),
        })),
        beginDirty: true,
      });

      docElements.push(nativeToc);

      // Hard page break after Table of Contents so main content starts on fresh page
      docElements.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
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
          color: primaryDarkHex,
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
          color: primaryDarkHex,
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
      const customBrowser = config.browserPath ?? config.chromiumPath ?? resolved.browserPath;
      const pngBuffer = await renderMermaidToPng(node.text || "", baseDir, customBrowser);
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

    // Manual Page Break
    if (node.type === "pageBreak") {
      docElements.push(new Paragraph({ children: [new PageBreak()] }));
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

    if (node.type === "mathBlock") {
      const mathObj = convertLatexToDocxMath(node.text || "");
      docElements.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [mathObj],
          spacing: { before: 200, after: 200 },
          shading: { fill: cardBgHex, type: ShadingType.CLEAR },
          border: {
            top: { style: BorderStyle.SINGLE, size: 4, color: borderHex },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: borderHex },
            left: { style: BorderStyle.SINGLE, size: 4, color: borderHex },
            right: { style: BorderStyle.SINGLE, size: 4, color: borderHex },
          },
        })
      );
      continue;
    }

    if (node.type === "columns") {
      const cols = node.columnsCount || 2;
      const contentWidth = Math.max(
        1000,
        resolved.paperDimensions.widthTwip - resolved.margins.leftTwip - resolved.margins.rightTwip
      );
      const cellWidthDxa = Math.floor(contentWidth / cols);
      const cells: TableCell[] = [];

      for (const col of node.children || []) {
        const colParagraphs: Paragraph[] = [];
        for (const childNode of col.children || []) {
          if (childNode.type === "heading") {
            const runs = await convertInlinesToTextRuns(childNode.inlines, baseDir, { font: defaultFont, bold: true, size: 24, color: primaryDarkHex });
            colParagraphs.push(new Paragraph({ children: runs, spacing: { before: 120, after: 60 } }));
          } else if (childNode.type === "paragraph") {
            const runs = await convertInlinesToTextRuns(childNode.inlines, baseDir, { font: defaultFont, size: 21, color: textHex });
            colParagraphs.push(new Paragraph({ children: runs, spacing: { after: 100 } }));
          } else if (childNode.type === "list" && childNode.children) {
            for (const item of childNode.children) {
              const runs = await convertInlinesToTextRuns(item.inlines, baseDir, { font: defaultFont, size: 21, color: textHex });
              colParagraphs.push(new Paragraph({ children: [new TextRun({ text: "•  ", font: defaultFont, color: primaryHex }), ...runs], spacing: { after: 40 } }));
            }
          }
        }
        if (colParagraphs.length === 0) colParagraphs.push(new Paragraph({}));
        cells.push(
          new TableCell({
            width: { size: cellWidthDxa, type: WidthType.DXA },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "auto" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
              left: { style: BorderStyle.NONE, size: 0, color: "auto" },
              right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: colParagraphs,
          })
        );
      }

      docElements.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [new TableRow({ children: cells })],
        })
      );
      docElements.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }
  }

  // 2.3 Footnotes List if defined
  if (doc.footnoteDefs && doc.footnoteDefs.length > 0) {
    docElements.push(
      new Paragraph({
        border: {
          top: { style: BorderStyle.SINGLE, size: 4, color: borderHex, space: 8 },
        },
        spacing: { before: 360, after: 120 },
      })
    );

    for (const def of doc.footnoteDefs) {
      const defRuns = await convertInlinesToTextRuns(def.inlines, baseDir, {
        font: defaultFont,
        size: 18, // 9pt
        color: textMutedHex,
      });

      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[${def.id}] `,
              bold: true,
              color: primaryDarkHex,
              font: defaultFont,
              size: 18,
            }),
            ...defRuns,
          ],
          spacing: { after: 60 },
        })
      );
    }
  }

  // 2.5 Signature and Approval Block
  if (resolved.signatures && resolved.signatures.items.length > 0) {
    const sig = resolved.signatures;
    const numItems = sig.items.length;
    const contentWidth = Math.max(
      1000,
      resolved.paperDimensions.widthTwip - resolved.margins.leftTwip - resolved.margins.rightTwip
    );

    // Spacing before signature block
    docElements.push(new Paragraph({ spacing: { before: sig.spacingBeforeTwip } }));

    const sigCells: TableCell[] = [];
    const colWidths: number[] = [];

    if (numItems === 1) {
      const cardWidth = Math.min(3400, Math.floor(contentWidth * 0.42));
      const spacerWidth = contentWidth - cardWidth;

      const cardCell = await buildDocxSignatureCell(sig.items[0], sig, cardWidth, defaultFont, baseDir);

      if (sig.align === "left") {
        colWidths.push(cardWidth, spacerWidth);
        sigCells.push(cardCell, createEmptyDocxCell(spacerWidth));
      } else if (sig.align === "center") {
        const sideWidth = Math.floor(spacerWidth / 2);
        colWidths.push(sideWidth, cardWidth, sideWidth);
        sigCells.push(createEmptyDocxCell(sideWidth), cardCell, createEmptyDocxCell(sideWidth));
      } else {
        // default "right"
        colWidths.push(spacerWidth, cardWidth);
        sigCells.push(createEmptyDocxCell(spacerWidth), cardCell);
      }
    } else {
      // 2, 3, or 4 items in a row
      const colWidth = Math.floor(contentWidth / numItems);
      for (let i = 0; i < numItems; i++) {
        colWidths.push(colWidth);
        const cell = await buildDocxSignatureCell(sig.items[i], sig, colWidth, defaultFont, baseDir);
        sigCells.push(cell);
      }
    }

    const sigTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: colWidths,
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "auto" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
        left: { style: BorderStyle.NONE, size: 0, color: "auto" },
        right: { style: BorderStyle.NONE, size: 0, color: "auto" },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
      },
      rows: [
        new TableRow({
          cantSplit: true,
          children: sigCells,
        }),
      ],
    });

    docElements.push(sigTable);
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

  const headerChildren: Paragraph[] = [];

  // Floating background watermark in Header (displayed across document pages behind text)
  if (resolved.watermark) {
    const customBrowser = config.browserPath ?? config.chromiumPath ?? resolved.browserPath;
    const chromePath = findChromeExecutable(customBrowser);
    let wmPng: Buffer | null = null;
    if (chromePath) {
      try {
        wmPng = generateWatermarkPngBuffer(chromePath, resolved.watermark);
      } catch {
        wmPng = null;
      }
    }

    if (wmPng) {
      headerChildren.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: wmPng,
              transformation: { width: 550, height: 750 },
              type: "png",
              floating: {
                horizontalPosition: {
                  relative: HorizontalPositionRelativeFrom.PAGE,
                  align: HorizontalPositionAlign.CENTER,
                },
                verticalPosition: {
                  relative: VerticalPositionRelativeFrom.PAGE,
                  align: VerticalPositionAlign.CENTER,
                },
                behindDocument: true,
              },
            }),
          ],
        })
      );
    } else {
      headerChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: resolved.watermark.text.toUpperCase(),
              font: defaultFont,
              size: (resolved.watermark.fontSize || 54) * 2,
              bold: true,
              color: (resolved.watermark.color || "#CBD5E1").replace("#", ""),
            }),
          ],
          spacing: { before: 2400, after: 2400 },
        })
      );
    }
  }

  if (resolved.header) {
    headerChildren.push(
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
      })
    );
  }

  const docHeader = headerChildren.length > 0
    ? new Header({ children: headerChildren })
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

    const PAGE_TOKEN_TEST = /(\{\{pages?\}\}|\{pages?\})/i;
    const PAGE_TOKEN_SPLIT = /(\{\{pages?\}\}|\{pages?\})/gi;
    if (PAGE_TOKEN_TEST.test(rZone.text)) {
      const parts = rZone.text.split(PAGE_TOKEN_SPLIT);
      for (const part of parts) {
        const lower = part.toLowerCase();
        if (lower === "{page}" || lower === "{{page}}") {
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
        } else if (lower === "{pages}" || lower === "{{pages}}") {
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

  const docSections = [];

  if (resolved.coverPage && resolved.coverPage.enabled) {
    const coverElements = await buildDocxCoverPageElements(
      resolved.coverPage,
      defaultFont,
      textHex,
      primaryHex,
      primaryDarkHex,
      textMutedHex,
      baseDir
    );

    docSections.push({
      properties: {
        type: SectionType.NEXT_PAGE,
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
          },
        },
      },
      headers: { default: new Header({ children: [] }) },
      footers: { default: new Footer({ children: [] }) },
      children: coverElements,
    });
  }

  docSections.push({
    properties: {
      type: SectionType.NEXT_PAGE,
      page: {
        pageNumbers: {
          start: 1,
          formatType: NumberFormat.DECIMAL,
        },
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
    headers: docHeader ? { default: docHeader } : { default: new Header({ children: [] }) },
    footers: docFooter ? { default: docFooter } : { default: new Footer({ children: [] }) },
    children: docElements,
  });

  if (resolved.backCover && resolved.backCover.enabled) {
    const backElements = await buildDocxBackCoverElements(
      resolved.backCover,
      defaultFont,
      textHex,
      primaryHex,
      primaryDarkHex,
      textMutedHex,
      baseDir
    );

    docSections.push({
      properties: {
        type: SectionType.NEXT_PAGE,
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
          },
        },
      },
      headers: { default: new Header({ children: [] }) },
      footers: { default: new Footer({ children: [] }) },
      children: backElements,
    });
  }

  const document = new Document({
    title: resolved.title,
    description: resolved.subtitle,
    creator: resolved.author,
    features: {
      updateFields: true,
    },
    styles: {
      default: {
        document: {
          run: {
            font: defaultFont,
            size: 21, // 10.5pt
            color: textHex,
            language: { value: resolved.lang || "en" },
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
    sections: docSections,
  });

  return await Packer.toBuffer(document);
}

/**
 * Calculates proportional image dimensions for cover and back cover logos,
 * strictly preserving natural aspect ratio and preventing vertical stretching.
 */
function calculateProportionalLogoDimensions(
  userWidth: number | string | undefined,
  userHeight: number | string | undefined,
  naturalWidth: number | undefined,
  naturalHeight: number | undefined
): { width: number; height: number } {
  const parsedUserW = typeof userWidth === "number" ? userWidth : typeof userWidth === "string" ? parseInt(userWidth, 10) : undefined;
  const parsedUserH = typeof userHeight === "number" ? userHeight : typeof userHeight === "string" ? parseInt(userHeight, 10) : undefined;

  const validUserW = parsedUserW && !isNaN(parsedUserW) && parsedUserW > 0 ? parsedUserW : undefined;
  const validUserH = parsedUserH && !isNaN(parsedUserH) && parsedUserH > 0 ? parsedUserH : undefined;

  const naturalW = naturalWidth && naturalWidth > 0 ? naturalWidth : undefined;
  const naturalH = naturalHeight && naturalHeight > 0 ? naturalHeight : undefined;

  let finalW = 140;
  let finalH = 50;

  if (validUserW !== undefined && validUserH !== undefined) {
    // User explicitly gave both dimensions
    finalW = validUserW;
    finalH = validUserH;
  } else if (validUserW !== undefined) {
    // User gave width: compute height preserving original image ratio
    finalW = validUserW;
    if (naturalW && naturalH) {
      finalH = Math.round(validUserW * (naturalH / naturalW));
    } else {
      finalH = Math.round(validUserW * 0.4);
    }
  } else if (validUserH !== undefined) {
    // User gave height: compute width preserving original image ratio
    finalH = validUserH;
    if (naturalW && naturalH) {
      finalW = Math.round(validUserH * (naturalW / naturalH));
    } else {
      finalW = Math.round(validUserH * 2.5);
    }
  } else if (naturalW && naturalH) {
    // Neither dimension specified: fit naturally within standard bounds (max 160 width, max 70 height)
    // without any vertical stretching
    const maxBoundW = 160;
    const maxBoundH = 70;
    const scale = Math.min(maxBoundW / naturalW, maxBoundH / naturalH, 1);
    finalW = Math.round(naturalW * scale);
    finalH = Math.round(naturalH * scale);
  } else {
    finalW = 140;
    finalH = 50;
  }

  // Constrain upper limits to prevent breaking page layout while preserving aspect ratio
  const maxDocxW = 450;
  const maxDocxH = 180;
  if (finalW > maxDocxW) {
    const scale = maxDocxW / finalW;
    finalW = maxDocxW;
    finalH = Math.round(finalH * scale);
  }
  if (finalH > maxDocxH) {
    const scale = maxDocxH / finalH;
    finalH = maxDocxH;
    finalW = Math.round(finalW * scale);
  }

  return {
    width: Math.max(finalW, 10),
    height: Math.max(finalH, 10),
  };
}

async function buildDocxBackCoverElements(
  backCover: NormalizedBackCover,
  defaultFont: string,
  textHex: string,
  primaryHex: string,
  primaryDarkHex: string,
  textMutedHex: string,
  baseDir: string
): Promise<Paragraph[]> {
  const elements: Paragraph[] = [];
  elements.push(new Paragraph({ spacing: { before: 1800 } }));

  if (backCover.logo) {
    const resolvedLogo = await resolveImage(backCover.logo, baseDir);
    if (resolvedLogo) {
      const dims = calculateProportionalLogoDimensions(
        backCover.logoWidth,
        backCover.logoHeight,
        resolvedLogo.width,
        resolvedLogo.height
      );
      const logoType = resolvedLogo.mimeType?.includes("png") ? "png" : "jpg";
      elements.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: resolvedLogo.buffer,
              transformation: {
                width: dims.width,
                height: dims.height,
              },
              type: logoType,
            }),
          ],
          spacing: { after: 240 },
        })
      );
    }
  }

  if (backCover.badge) {
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `[ ${backCover.badge.toUpperCase()} ]`,
            font: defaultFont,
            size: 20,
            bold: true,
            color: primaryDarkHex,
          }),
        ],
        spacing: { after: 240 },
      })
    );
  }

  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: backCover.title,
          font: defaultFont,
          size: 52, // 26pt
          bold: true,
          color: textHex,
        }),
      ],
      spacing: { after: 140 },
    })
  );

  if (backCover.subtitle) {
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: backCover.subtitle,
            font: defaultFont,
            size: 24, // 12pt
            color: textMutedHex,
          }),
        ],
        spacing: { after: 480 },
      })
    );
  }

  // Accent divider line
  elements.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 16, color: primaryHex, space: 8 },
      },
      spacing: { after: 480 },
    })
  );

  const contactRuns: TextRun[] = [];
  if (backCover.company) contactRuns.push(new TextRun({ text: `Organization:  ${backCover.company}\n`, font: defaultFont, size: 21, color: textHex }));
  if (backCover.address) contactRuns.push(new TextRun({ text: `Address:  ${backCover.address}\n`, font: defaultFont, size: 21, color: textHex }));
  if (backCover.email) contactRuns.push(new TextRun({ text: `Email:  ${backCover.email}\n`, font: defaultFont, size: 21, color: textHex }));
  if (backCover.phone) contactRuns.push(new TextRun({ text: `Phone:  ${backCover.phone}\n`, font: defaultFont, size: 21, color: textHex }));
  if (backCover.website) contactRuns.push(new TextRun({ text: `Website:  ${backCover.website}\n`, font: defaultFont, size: 21, color: textHex }));

  if (backCover.social) {
    for (const [net, url] of Object.entries(backCover.social)) {
      if (url) {
        contactRuns.push(new TextRun({ text: `${net.toUpperCase()}:  ${url}\n`, font: defaultFont, size: 21, color: textHex }));
      }
    }
  }

  if (contactRuns.length > 0) {
    elements.push(
      new Paragraph({
        children: contactRuns,
        spacing: { before: 360, after: 360 },
      })
    );
  }

  if (backCover.copyright) {
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: backCover.copyright,
            font: defaultFont,
            size: 18,
            color: "94A3B8",
          }),
        ],
        spacing: { before: 720 },
      })
    );
  }

  return elements;
}

async function buildDocxCoverPageElements(
  cover: NormalizedCoverPage,
  defaultFont: string,
  textHex: string,
  primaryHex: string,
  primaryDarkHex: string,
  textMutedHex: string,
  baseDir: string
): Promise<Paragraph[]> {
  const elements: Paragraph[] = [];
  elements.push(new Paragraph({ spacing: { before: 1800 } }));

  if (cover.logo) {
    const resolvedLogo = await resolveImage(cover.logo, baseDir);
    if (resolvedLogo) {
      const dims = calculateProportionalLogoDimensions(
        cover.logoWidth,
        cover.logoHeight,
        resolvedLogo.width,
        resolvedLogo.height
      );
      const logoType = resolvedLogo.mimeType?.includes("png") ? "png" : "jpg";
      elements.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: resolvedLogo.buffer,
              transformation: {
                width: dims.width,
                height: dims.height,
              },
              type: logoType,
            }),
          ],
          spacing: { after: 240 },
        })
      );
    }
  }

  if (cover.badge) {
    const badgeColor = cover.badgeTextColor ? cover.badgeTextColor.replace("#", "") : primaryDarkHex;
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `[ ${cover.badge.toUpperCase()} ]`,
            font: defaultFont,
            size: 20,
            bold: true,
            color: badgeColor,
          }),
        ],
        spacing: { after: 240 },
      })
    );
  }

  const titleColor = cover.titleColor ? cover.titleColor.replace("#", "") : textHex;
  elements.push(
    new Paragraph({
      children: [
        new TextRun({
          text: cover.title,
          font: defaultFont,
          size: 56, // 28pt
          bold: true,
          color: titleColor,
        }),
      ],
      spacing: { after: 140 },
    })
  );

  if (cover.subtitle) {
    const subtitleColor = cover.subtitleColor ? cover.subtitleColor.replace("#", "") : textMutedHex;
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cover.subtitle,
            font: defaultFont,
            size: 26, // 13pt
            color: subtitleColor,
          }),
        ],
        spacing: { after: 480 },
      })
    );
  }

  // Accent divider line
  const accentColor = cover.accentColor ? cover.accentColor.replace("#", "") : primaryHex;
  elements.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 16, color: accentColor, space: 8 },
      },
      spacing: { after: 480 },
    })
  );

  if (cover.company || cover.author || cover.version || cover.date) {
    const metaRuns: TextRun[] = [];
    if (cover.company) metaRuns.push(new TextRun({ text: `Organization:  ${cover.company}\n`, font: defaultFont, size: 21, color: textHex }));
    if (cover.author) metaRuns.push(new TextRun({ text: `Author:  ${cover.author}\n`, font: defaultFont, size: 21, color: textHex }));
    if (cover.version) metaRuns.push(new TextRun({ text: `Version:  ${cover.version}\n`, font: defaultFont, size: 21, color: textHex }));
    if (cover.date) metaRuns.push(new TextRun({ text: `Date:  ${cover.date}\n`, font: defaultFont, size: 21, color: textHex }));

    elements.push(
      new Paragraph({
        children: metaRuns,
        spacing: { before: 360, after: 360 },
      })
    );
  }

  if (cover.footerText) {
    elements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cover.footerText,
            font: defaultFont,
            size: 18,
            color: "94A3B8",
          }),
        ],
        spacing: { before: 720 },
      })
    );
  }

  return elements;
}

async function buildDocxSignatureCell(
  item: NormalizedSignatureItem,
  sig: NormalizedSignatureBlock,
  widthDxa: number,
  defaultFont: string,
  baseDir: string
): Promise<TableCell> {
  const cellParagraphs: Paragraph[] = [];

  // Title / Sign-off header
  if (item.title) {
    cellParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: item.title,
            font: defaultFont,
            size: 18, // 9pt
            color: sig.titleColor.replace("#", ""),
            bold: true,
          }),
        ],
        spacing: { after: 60 },
      })
    );
  }

  // Signature image or physical sign blank space
  if (item.image) {
    const resolvedImg = await resolveImage(item.image, baseDir);
    if (resolvedImg) {
      cellParagraphs.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: resolvedImg.buffer,
              transformation: {
                width: 140,
                height: 60,
              },
              type: "png",
            }),
          ],
          spacing: { before: 40, after: 40 },
        })
      );
    } else {
      cellParagraphs.push(new Paragraph({ spacing: { before: 240, after: 240 } }));
    }
  } else {
    // Blank space for handwriting signature
    cellParagraphs.push(new Paragraph({ spacing: { before: 240, after: 240 } }));
  }

  // Underline divider line if style === "line"
  if (sig.style === "line") {
    cellParagraphs.push(
      new Paragraph({
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 6,
            space: 2,
            color: sig.borderColor.replace("#", ""),
          },
        },
        spacing: { after: 60 },
      })
    );
  }

  // Signatory Name
  cellParagraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: item.name,
          font: defaultFont,
          size: 21, // 10.5pt
          bold: true,
          color: sig.nameColor.replace("#", ""),
        }),
      ],
      spacing: { before: sig.style === "line" ? 40 : 20, after: 20 },
    })
  );

  // Role / Job Title
  if (item.role) {
    cellParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: item.role,
            font: defaultFont,
            size: 18, // 9pt
            color: sig.roleColor.replace("#", ""),
          }),
        ],
        spacing: { after: 20 },
      })
    );
  }

  // Date
  if (item.date) {
    cellParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Date: ${item.date}`,
            font: defaultFont,
            size: 17, // 8.5pt
            color: sig.roleColor.replace("#", ""),
          }),
        ],
        spacing: { after: 20 },
      })
    );
  }

  const isBox = sig.style === "box";
  const boxBorder = { style: BorderStyle.SINGLE, size: 4, color: sig.borderColor.replace("#", "") };
  const noneBorder = { style: BorderStyle.NONE, size: 0, color: "auto" };

  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    shading: isBox ? { fill: "F8FAFC", type: ShadingType.CLEAR } : undefined,
    margins: isBox
      ? { top: 140, bottom: 140, left: 160, right: 160 }
      : { top: 60, bottom: 60, left: 60, right: 60 },
    borders: {
      top: isBox ? boxBorder : noneBorder,
      bottom: isBox ? boxBorder : noneBorder,
      left: isBox ? boxBorder : noneBorder,
      right: isBox ? boxBorder : noneBorder,
    },
    children: cellParagraphs,
  });
}

function createEmptyDocxCell(widthDxa: number): TableCell {
  const noneBorder = { style: BorderStyle.NONE, size: 0, color: "auto" };
  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    borders: {
      top: noneBorder,
      bottom: noneBorder,
      left: noneBorder,
      right: noneBorder,
    },
    children: [new Paragraph({})],
  });
}
