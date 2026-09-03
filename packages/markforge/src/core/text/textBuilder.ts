import type {
  ParsedMarkdownDocument,
  MarkdownASTNode,
  MarkdownInlineSpan,
} from "../parser.js";
import { applyHeadingNumbering } from "../parser.js";
import {
  resolveDocumentConfig,
  replaceDocumentTokens,
} from "../../config/resolveConfig.js";
import type { MarkforgeConfig } from "../../config/types.js";

const LINE_WIDTH = 80;
const HR_DOUBLE = "=".repeat(LINE_WIDTH);
const HR_SINGLE = "-".repeat(LINE_WIDTH);

/**
 * Helper to center text within a given width.
 */
function centerText(text: string, width: number = LINE_WIDTH): string {
  if (text.length >= width) return text;
  const leftPad = Math.floor((width - text.length) / 2);
  return " ".repeat(leftPad) + text;
}

/**
 * Converts inline AST spans into clean, readable plain text.
 */
export function renderInlinesToText(
  spans: MarkdownInlineSpan[] = [],
  meta: Record<string, unknown> = {}
): string {
  let result = "";

  for (const span of spans) {
    switch (span.type) {
      case "text": {
        const content = replaceDocumentTokens(span.content, meta);
        result += content;
        break;
      }
      case "bold": {
        const inner = span.children ? renderInlinesToText(span.children, meta) : replaceDocumentTokens(span.content, meta);
        result += `**${inner}**`;
        break;
      }
      case "italic": {
        const inner = span.children ? renderInlinesToText(span.children, meta) : replaceDocumentTokens(span.content, meta);
        result += `*${inner}*`;
        break;
      }
      case "code": {
        result += `\`${span.content}\``;
        break;
      }
      case "link": {
        const inner = span.children ? renderInlinesToText(span.children, meta) : replaceDocumentTokens(span.content, meta);
        result += span.url && span.url !== inner ? `${inner} (${span.url})` : inner;
        break;
      }
      case "image": {
        result += `[Image: ${span.alt || "image"} (${span.url || ""})]`;
        break;
      }
      case "strikethrough": {
        const inner = span.children ? renderInlinesToText(span.children, meta) : replaceDocumentTokens(span.content, meta);
        result += `~${inner}~`;
        break;
      }
      case "mathInline": {
        result += `$${span.content}$`;
        break;
      }
      case "footnoteRef": {
        const id = span.footnoteId || span.content;
        result += `[${id}]`;
        break;
      }
      case "htmlInline": {
        result += span.content.replace(/<[^>]+>/g, "");
        break;
      }
      default: {
        result += span.content || "";
        break;
      }
    }
  }

  return result;
}

/**
 * Builds a structured, beautifully formatted plain text (.txt) document from markdown AST.
 */
export async function buildTextDocument(
  doc: ParsedMarkdownDocument,
  config: MarkforgeConfig = {},
  _baseDir: string = process.cwd()
): Promise<string> {
  const resolved = resolveDocumentConfig(doc.metadata, config);
  const meta: Record<string, unknown> = {
    ...doc.metadata,
    ...config.metadata,
    title: resolved.title,
    subtitle: resolved.subtitle,
    author: resolved.author,
    company: resolved.company,
    version: resolved.version,
    date: resolved.date,
  };

  // Clone AST nodes to allow safe in-place mutations for numbering
  const nodes: MarkdownASTNode[] = JSON.parse(JSON.stringify(doc.nodes));
  const tocEntries = JSON.parse(JSON.stringify(doc.tocEntries));

  if (resolved.numberHeadings && resolved.numberHeadings.enabled) {
    applyHeadingNumbering(nodes, tocEntries, resolved.numberHeadings);
  }

  const lines: string[] = [];

  // 1. Front Cover Title Page
  if (resolved.coverPage && resolved.coverPage.enabled) {
    const cover = resolved.coverPage;
    const coverTitle = (cover.title || (meta.title as string) || "DOCUMENT").toUpperCase();
    const coverSubtitle = cover.subtitle || (meta.subtitle as string) || "";
    const coverAuthor = cover.author || (meta.author as string) || "";
    const coverCompany = cover.company || (meta.company as string) || "";
    const coverDate = cover.date || (meta.date as string) || "";
    const coverVersion = cover.version || (meta.version as string) || "";
    const coverBadge = cover.badge || "";
    const coverFooter = cover.footerText || "";

    lines.push(HR_DOUBLE);
    lines.push(centerText(coverTitle));
    if (coverSubtitle) {
      lines.push(centerText(coverSubtitle));
    }
    lines.push(HR_DOUBLE);

    if (coverBadge) {
      lines.push(`[${coverBadge}]`);
      lines.push("");
    }
    if (coverAuthor) lines.push(`Author:     ${coverAuthor}`);
    if (coverCompany) lines.push(`Company:    ${coverCompany}`);
    if (coverDate) lines.push(`Date:       ${coverDate}`);
    if (coverVersion) lines.push(`Version:    ${coverVersion}`);
    if (coverFooter) lines.push(`Notice:     ${coverFooter}`);

    lines.push(HR_DOUBLE);
    lines.push("");
    lines.push("");
  }

  // 2. Table of Contents
  if (resolved.toc) {
    const headings = nodes.filter(
      (n) => n.type === "heading" && (n.level || 1) <= 3
    );

    if (headings.length > 0) {
      const tocTitle = "TABLE OF CONTENTS";
      lines.push(HR_DOUBLE);
      lines.push(centerText(tocTitle));
      lines.push(HR_DOUBLE);

      for (const h of headings) {
        const level = h.level || 1;
        const indent = "  ".repeat(level - 1);
        const headingText = renderInlinesToText(h.inlines, meta);
        const prefix = level === 1 ? "* " : "- ";
        lines.push(`${indent}${prefix}${headingText}`);
      }

      lines.push(HR_DOUBLE);
      lines.push("");
      lines.push("");
    }
  }

  // 3. Document Body Node Processor
  function renderNode(node: MarkdownASTNode, listLevel: number = 0): void {
    switch (node.type) {
      case "heading": {
        const level = node.level || 1;
        const text = renderInlinesToText(node.inlines, meta);
        lines.push("");
        if (level === 1) {
          lines.push(HR_DOUBLE);
          lines.push(text.toUpperCase());
          lines.push(HR_DOUBLE);
        } else if (level === 2) {
          lines.push(HR_SINGLE);
          lines.push(text);
          lines.push(HR_SINGLE);
        } else {
          const hashes = "#".repeat(level);
          lines.push(`${hashes} ${text}`);
        }
        lines.push("");
        break;
      }

      case "paragraph": {
        const text = renderInlinesToText(node.inlines, meta);
        if (text.trim()) {
          lines.push(text);
          lines.push("");
        }
        break;
      }

      case "callout": {
        const calloutType = (node.calloutType || "NOTE").toUpperCase();
        lines.push(`| [${calloutType}]`);
        if (node.inlines && node.inlines.length > 0) {
          const text = renderInlinesToText(node.inlines, meta);
          text.split("\n").forEach((l) => lines.push(`| ${l}`));
        }
        lines.push("");
        break;
      }

      case "blockquote": {
        if (node.inlines && node.inlines.length > 0) {
          const text = renderInlinesToText(node.inlines, meta);
          text.split("\n").forEach((l) => lines.push(`> ${l}`));
          lines.push("");
        }
        break;
      }

      case "codeBlock": {
        const lang = node.language ? `[Language: ${node.language}]` : "[Code]";
        lines.push(HR_SINGLE);
        lines.push(lang);
        lines.push(HR_SINGLE);
        const codeText = node.text || "";
        lines.push(codeText);
        lines.push(HR_SINGLE);
        lines.push("");
        break;
      }

      case "list": {
        if (node.children) {
          let itemIndex = 1;
          for (const item of node.children) {
            const indent = "  ".repeat(listLevel);
            let prefix = node.ordered ? `${itemIndex}. ` : "* ";
            itemIndex++;

            if (item.checked !== undefined) {
              prefix = item.checked ? "[x] " : "[ ] ";
            }

            if (item.inlines && item.inlines.length > 0) {
              const text = renderInlinesToText(item.inlines, meta);
              lines.push(`${indent}${prefix}${text}`);
            }

            if (item.children && item.children.length > 0) {
              for (const subChild of item.children) {
                if (subChild.type === "list") {
                  renderNode(subChild, listLevel + 1);
                } else if (subChild.type === "paragraph") {
                  const text = renderInlinesToText(subChild.inlines, meta);
                  lines.push(`${indent}  ${text}`);
                } else {
                  renderNode(subChild, listLevel + 1);
                }
              }
            }
          }
          lines.push("");
        }
        break;
      }

      case "table": {
        const rows = node.children || [];
        if (rows.length === 0) break;

        // Extract cells for each row
        const rowCells: { isHeader: boolean; texts: string[] }[] = [];
        let maxCols = 0;

        for (const row of rows) {
          const cells = row.children || [];
          const texts = cells.map((c) => renderInlinesToText(c.inlines, meta));
          const isHeader = cells.some((c) => c.isHeader);
          maxCols = Math.max(maxCols, texts.length);
          rowCells.push({ isHeader, texts });
        }

        if (maxCols === 0) break;

        // Calculate maximum width for each column
        const colWidths: number[] = new Array(maxCols).fill(3);
        for (const r of rowCells) {
          for (let col = 0; col < maxCols; col++) {
            const cellText = r.texts[col] || "";
            colWidths[col] = Math.max(colWidths[col] ?? 3, cellText.length);
          }
        }

        // Helpers to format table border lines and cell rows
        const separatorLine =
          "+" + colWidths.map((w) => "-".repeat(w + 2)).join("+") + "+";

        const formatRow = (texts: string[]): string => {
          const paddedCells = colWidths.map((width, colIdx) => {
            const text = texts[colIdx] || "";
            return " " + text.padEnd(width, " ") + " ";
          });
          return "|" + paddedCells.join("|") + "|";
        };

        lines.push(separatorLine);
        for (const r of rowCells) {
          lines.push(formatRow(r.texts));
          if (r.isHeader) {
            lines.push(separatorLine);
          }
        }
        if (!rowCells[rowCells.length - 1]?.isHeader) {
          lines.push(separatorLine);
        }
        lines.push("");
        break;
      }

      case "mathBlock": {
        lines.push("[Equation]");
        lines.push(`  $$${node.text || ""} $$`);
        lines.push("");
        break;
      }

      case "mermaid": {
        lines.push("[Diagram: Mermaid]");
        lines.push(node.text || "");
        lines.push("");
        break;
      }

      case "thematicBreak": {
        lines.push(HR_SINGLE);
        lines.push("");
        break;
      }

      case "columns": {
        if (node.children) {
          for (const col of node.children) {
            if (col.children) {
              for (const child of col.children) {
                renderNode(child, listLevel);
              }
            }
          }
        }
        break;
      }

      default: {
        if (node.children && node.children.length > 0) {
          for (const child of node.children) {
            renderNode(child, listLevel);
          }
        }
        break;
      }
    }
  }

  for (const node of nodes) {
    renderNode(node);
  }

  // 4. Footnotes
  if (doc.footnoteDefs && doc.footnoteDefs.length > 0) {
    lines.push(HR_SINGLE);
    lines.push("FOOTNOTES");
    lines.push(HR_SINGLE);
    for (const fn of doc.footnoteDefs) {
      const text = renderInlinesToText(fn.inlines, meta);
      lines.push(`[${fn.id}] ${text}`);
    }
    lines.push("");
  }

  // 5. Signatures & Approval Block
  if (resolved.signatures && resolved.signatures.items && resolved.signatures.items.length > 0) {
    lines.push(HR_SINGLE);
    lines.push("SIGNATURES & APPROVALS");
    lines.push(HR_SINGLE);
    lines.push("");

    for (const item of resolved.signatures.items) {
      const title = item.title || "Signatory";
      const name = item.name ? replaceDocumentTokens(item.name, meta) : "";
      const role = item.role ? replaceDocumentTokens(item.role, meta) : "";
      const date = item.date ? replaceDocumentTokens(item.date, meta) : "";

      lines.push(`[${title}]`);
      lines.push("____________________________________");
      if (name) lines.push(`Name: ${name}`);
      if (role) lines.push(`Role: ${role}`);
      if (date) lines.push(`Date: ${date}`);
      lines.push("");
    }
  }

  // 6. Back Cover / Closing Page
  if (resolved.backCover && resolved.backCover.enabled) {
    const back = resolved.backCover;
    const backTitle = (back.title || "THANK YOU").toUpperCase();
    const backSubtitle = back.subtitle || "";
    const backCompany = back.company ? replaceDocumentTokens(back.company, meta) : "";
    const backAddress = back.address ? replaceDocumentTokens(back.address, meta) : "";
    const backEmail = back.email ? replaceDocumentTokens(back.email, meta) : "";
    const backPhone = back.phone ? replaceDocumentTokens(back.phone, meta) : "";
    const backWebsite = back.website ? replaceDocumentTokens(back.website, meta) : "";
    const backCopyright = back.copyright ? replaceDocumentTokens(back.copyright, meta) : "";

    lines.push(HR_DOUBLE);
    lines.push(centerText(backTitle));
    if (backSubtitle) {
      lines.push(centerText(backSubtitle));
    }
    lines.push(HR_DOUBLE);

    if (backCompany) lines.push(`Company:   ${backCompany}`);
    if (backAddress) lines.push(`Address:   ${backAddress}`);
    if (backEmail) lines.push(`Email:     ${backEmail}`);
    if (backPhone) lines.push(`Phone:     ${backPhone}`);
    if (backWebsite) lines.push(`Website:   ${backWebsite}`);
    if (back.social && back.social.github) {
      lines.push(`GitHub:    ${back.social.github}`);
    }
    if (backCopyright) {
      lines.push("");
      lines.push(backCopyright);
    }
    lines.push(HR_DOUBLE);
    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}
