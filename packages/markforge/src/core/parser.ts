import matter from "gray-matter";
import type { FrontmatterMetadata } from "../config/types.js";

export type MarkdownNodeType =
  | "heading"
  | "paragraph"
  | "blockquote"
  | "callout"
  | "list"
  | "listItem"
  | "table"
  | "tableRow"
  | "tableCell"
  | "codeBlock"
  | "mermaid"
  | "htmlBlock"
  | "thematicBreak"
  | "image"
  | "toc";

export interface MarkdownInlineSpan {
  type: "text" | "bold" | "italic" | "code" | "link" | "strikethrough" | "image" | "htmlInline";
  content: string;
  url?: string;
  title?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  children?: MarkdownInlineSpan[];
  style?: Record<string, string>;
}

export interface MarkdownASTNode {
  type: MarkdownNodeType;
  level?: number; // For headings (1-6)
  ordered?: boolean; // For lists
  checked?: boolean; // For task items
  language?: string; // For code blocks
  calloutType?: "NOTE" | "TIP" | "IMPORTANT" | "WARNING" | "CAUTION";
  align?: ("left" | "center" | "right" | null)[]; // For table columns
  isHeader?: boolean; // For table rows/cells
  inlines?: MarkdownInlineSpan[];
  text?: string;
  children?: MarkdownASTNode[];
  rawHtml?: string;
  id?: string;
  style?: Record<string, string>;
}

export interface ParsedMarkdownDocument {
  metadata: FrontmatterMetadata;
  content: string;
  nodes: MarkdownASTNode[];
  tocEntries: { id: string; text: string; level: number }[];
  inlinedStyles: string[];
}

/**
 * Parses inline formatting (bold, italic, code, links, images, HTML spans)
 */
export function parseInlineSpans(text: string): MarkdownInlineSpan[] {
  const spans: MarkdownInlineSpan[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // 1. Image: ![alt](url "title"){width=... height=...}
    const imgMatch = remaining.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)(?:\{([^}]+)\})?/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const url = imgMatch[2];
      const title = imgMatch[3];
      const attrStr = imgMatch[4] || "";

      let width: string | undefined;
      let height: string | undefined;
      if (attrStr) {
        const wMatch = attrStr.match(/width=([^\s}]+)/i);
        const hMatch = attrStr.match(/height=([^\s}]+)/i);
        if (wMatch) width = wMatch[1];
        if (hMatch) height = hMatch[1];
      }

      spans.push({
        type: "image",
        content: alt,
        url,
        alt,
        title,
        width,
        height,
      });
      remaining = remaining.slice(imgMatch[0].length);
      continue;
    }

    // 2. Link: [text](url "title")
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/);
    if (linkMatch) {
      spans.push({
        type: "link",
        content: linkMatch[1],
        url: linkMatch[2],
        title: linkMatch[3],
        children: parseInlineSpans(linkMatch[1]),
      });
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // 3. Bold + Italic: ***text*** or ___text___
    const boldItalicMatch = remaining.match(/^(\*\*\*|___)(.+?)\1/);
    if (boldItalicMatch) {
      spans.push({
        type: "bold",
        content: boldItalicMatch[2],
        children: [
          {
            type: "italic",
            content: boldItalicMatch[2],
            children: parseInlineSpans(boldItalicMatch[2]),
          },
        ],
      });
      remaining = remaining.slice(boldItalicMatch[0].length);
      continue;
    }

    // 4. Bold: **text** or __text__
    const boldMatch = remaining.match(/^(\*\*|__)(.+?)\1/);
    if (boldMatch) {
      spans.push({
        type: "bold",
        content: boldMatch[2],
        children: parseInlineSpans(boldMatch[2]),
      });
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // 5. Italic: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)([^*_]+?)\1/);
    if (italicMatch) {
      spans.push({
        type: "italic",
        content: italicMatch[2],
        children: parseInlineSpans(italicMatch[2]),
      });
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // 6. Strikethrough: ~~text~~
    const strikeMatch = remaining.match(/^~~(.+?)~~/);
    if (strikeMatch) {
      spans.push({
        type: "strikethrough",
        content: strikeMatch[1],
        children: parseInlineSpans(strikeMatch[1]),
      });
      remaining = remaining.slice(strikeMatch[0].length);
      continue;
    }

    // 7. Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      spans.push({
        type: "code",
        content: codeMatch[1],
      });
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // 8. Raw HTML Tag: <span ...>...</span> or <img ... /> or <br/>
    const htmlTagMatch = remaining.match(/^<(\w+)([^>]*)>(.*?)<\/\1>/i) || remaining.match(/^<(\w+)([^>]*)\/?>/i);
    if (htmlTagMatch) {
      const fullTag = htmlTagMatch[0];
      const tag = htmlTagMatch[1].toLowerCase();
      const attrs = htmlTagMatch[2] || "";
      const innerText = htmlTagMatch[3] || "";

      if (tag === "img") {
        const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
        const altMatch = attrs.match(/alt=["']([^"']+)["']/i);
        const widthMatch = attrs.match(/width=["']?(\d+%?|\d+px)?["']?/i);
        const heightMatch = attrs.match(/height=["']?(\d+%?|\d+px)?["']?/i);

        if (srcMatch) {
          spans.push({
            type: "image",
            content: altMatch ? altMatch[1] : "",
            url: srcMatch[1],
            alt: altMatch ? altMatch[1] : "",
            width: widthMatch ? widthMatch[1] : undefined,
            height: heightMatch ? heightMatch[1] : undefined,
          });
          remaining = remaining.slice(fullTag.length);
          continue;
        }
      }

      spans.push({
        type: "htmlInline",
        content: innerText || fullTag,
        children: innerText ? parseInlineSpans(innerText) : undefined,
      });
      remaining = remaining.slice(fullTag.length);
      continue;
    }

    // 9. Plain text up to next special character
    const nextSpecial = remaining.search(/[\*\_\[\!`~<]/);
    if (nextSpecial === -1) {
      spans.push({
        type: "text",
        content: remaining,
      });
      break;
    } else if (nextSpecial === 0) {
      // Escaped or single special char
      spans.push({
        type: "text",
        content: remaining[0],
      });
      remaining = remaining.slice(1);
    } else {
      spans.push({
        type: "text",
        content: remaining.slice(0, nextSpecial),
      });
      remaining = remaining.slice(nextSpecial);
    }
  }

  return spans;
}

/**
 * Extracts slug from heading text for TOC & anchor links.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Parses raw markdown string into rich structured AST nodes.
 */
export function parseMarkdownDocument(rawMarkdown: string): ParsedMarkdownDocument {
  const { data: frontmatter, content } = matter(rawMarkdown);
  const metadata: FrontmatterMetadata = (frontmatter || {}) as FrontmatterMetadata;

  const inlinedStyles: string[] = [];
  // Extract and strip <style>...</style> blocks
  const cleanContent = content.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => {
    inlinedStyles.push(css.trim());
    return "";
  });

  const lines = cleanContent.split(/\r?\n/);
  const nodes: MarkdownASTNode[] = [];
  const tocEntries: { id: string; text: string; level: number }[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // 1. Empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // 2. Headings (# Heading to ###### Heading)
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugify(text);

      nodes.push({
        type: "heading",
        level,
        id,
        text,
        inlines: parseInlineSpans(text),
      });
      tocEntries.push({ id, text, level });
      i++;
      continue;
    }

    // 3. Thematic break (--- or *** or ___)
    if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line)) {
      nodes.push({ type: "thematicBreak" });
      i++;
      continue;
    }

    // 4. Code block (```lang ... ```)
    const codeBlockMatch = line.match(/^```(\w+)?/);
    if (codeBlockMatch) {
      const language = (codeBlockMatch[1] || "text").trim().toLowerCase();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // consume closing ```

      const codeText = codeLines.join("\n");
      if (language === "mermaid") {
        nodes.push({
          type: "mermaid",
          language: "mermaid",
          text: codeText,
        });
      } else {
        nodes.push({
          type: "codeBlock",
          language,
          text: codeText,
        });
      }
      continue;
    }

    // 5. Alert / Callout Block (> [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT], > [!CAUTION])
    const calloutMatch = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/i);
    if (calloutMatch) {
      const calloutType = calloutMatch[1].toUpperCase() as MarkdownASTNode["calloutType"];
      const blockLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].startsWith(">")) {
        blockLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const blockText = blockLines.join("\n");
      nodes.push({
        type: "callout",
        calloutType,
        text: blockText,
        inlines: parseInlineSpans(blockText),
      });
      continue;
    }

    // 6. Blockquote (> quote)
    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const quoteText = quoteLines.join("\n");
      nodes.push({
        type: "blockquote",
        text: quoteText,
        inlines: parseInlineSpans(quoteText),
      });
      continue;
    }

    // 7. GFM Tables (| Header | Header |)
    if (line.trim().startsWith("|") && line.includes("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        const alignRow = tableLines[1]
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());

        const align: ("left" | "center" | "right" | null)[] = alignRow.map((col) => {
          if (col.startsWith(":") && col.endsWith(":")) return "center";
          if (col.endsWith(":")) return "right";
          if (col.startsWith(":")) return "left";
          return null;
        });

        const rows: MarkdownASTNode[] = [];

        // Header node
        rows.push({
          type: "tableRow",
          isHeader: true,
          children: headerRow.map((cellText) => ({
            type: "tableCell",
            isHeader: true,
            text: cellText,
            inlines: parseInlineSpans(cellText),
          })),
        });

        // Data rows
        for (let r = 2; r < tableLines.length; r++) {
          const cells = tableLines[r]
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());
          rows.push({
            type: "tableRow",
            isHeader: false,
            children: cells.map((cellText) => ({
              type: "tableCell",
              isHeader: false,
              text: cellText,
              inlines: parseInlineSpans(cellText),
            })),
          });
        }

        nodes.push({
          type: "table",
          align,
          children: rows,
        });
        continue;
      }
    }

    // 8. Lists (Unordered & Ordered & Tasks)
    const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const listItems: MarkdownASTNode[] = [];
      const isOrdered = /^\d+\./.test(listMatch[2]);

      while (i < lines.length) {
        const itemMatch = lines[i].match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
        if (!itemMatch) break;

        let itemText = itemMatch[3].trim();
        let checked: boolean | undefined = undefined;

        // Task check: [ ] or [x]
        const taskMatch = itemText.match(/^\[([ xX])\]\s+(.*)$/);
        if (taskMatch) {
          checked = taskMatch[1].toLowerCase() === "x";
          itemText = taskMatch[2];
        }

        listItems.push({
          type: "listItem",
          checked,
          text: itemText,
          inlines: parseInlineSpans(itemText),
        });
        i++;
      }

      nodes.push({
        type: "list",
        ordered: isOrdered,
        children: listItems,
      });
      continue;
    }

    // 9. Raw HTML Block (e.g. <div class="...">...</div> or <table ...>)
    if (line.trim().startsWith("<") && !line.trim().startsWith("<!--")) {
      const htmlLines: string[] = [];
      while (i < lines.length && lines[i].trim().length > 0) {
        htmlLines.push(lines[i]);
        i++;
      }
      const rawHtml = htmlLines.join("\n");
      nodes.push({
        type: "htmlBlock",
        rawHtml,
        text: rawHtml,
      });
      continue;
    }

    // 10. Normal Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].match(/^#{1,6}\s+/) &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith(">") &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].match(/^(\s*)([-*+]|\d+\.)\s+/)
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    const paraText = paraLines.join(" ");
    nodes.push({
      type: "paragraph",
      text: paraText,
      inlines: parseInlineSpans(paraText),
    });
  }

  return {
    metadata,
    content: cleanContent,
    nodes,
    tocEntries,
    inlinedStyles,
  };
}
