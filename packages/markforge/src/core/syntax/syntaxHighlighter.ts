/**
 * MarkForge Syntax Highlighter Engine
 * Provides tokenizer & styling for Markdown code blocks across DOCX, HTML, and PDF.
 */

export interface SyntaxToken {
  text: string;
  type:
    | "keyword"
    | "string"
    | "comment"
    | "number"
    | "boolean"
    | "function"
    | "type"
    | "operator"
    | "punctuation"
    | "plain";
  colorHex: string; // 6-digit hex without # for DOCX & CSS
  bold?: boolean;
  italic?: boolean;
}

export const SYNTAX_COLORS = {
  keyword:     "FF7B72", // Bright coral-red  — keywords (import, def, return...)
  string:      "E07C4F", // Warm orange       — strings (visible on dark bg)
  comment:     "8B949E", // Muted gray        — comments (italic)
  number:      "79C0FF", // Sky blue          — numbers
  boolean:     "FF9580", // Salmon            — true / false / None
  function:    "D2A8FF", // Soft purple       — function names
  type:        "7EE787", // Bright green      — Types / Classes
  operator:    "FF7B72", // Same as keyword   — = + - * / > <
  punctuation: "8B9AC0", // Steel blue-gray   — () [] {} , . ;
  plain:       "E2E8F0", // Light gray        — identifiers / plain text
};

/**
 * Light-background palette — for DOCX (white/light code block backgrounds).
 * Based on GitHub Light / VS Code Light+ theme.
 */
export const SYNTAX_COLORS_LIGHT = {
  keyword:     "D73A49", // Crimson red       — keywords
  string:      "0A7E5C", // Forest teal       — strings (readable on white)
  comment:     "6A737D", // Muted gray        — comments
  number:      "005CC5", // Cobalt blue       — numbers
  boolean:     "D73A49", // Crimson           — true/false/None
  function:    "6F42C1", // Purple            — function names
  type:        "22863A", // Forest green      — Types / Classes
  operator:    "D73A49", // Crimson           — operators
  punctuation: "586069", // Dark gray         — punctuation
  plain:       "24292E", // Near-black        — identifiers
};

const JS_KEYWORDS = new Set([
  "import", "from", "export", "default", "const", "let", "var", "function",
  "async", "await", "return", "if", "else", "for", "while", "switch", "case",
  "break", "continue", "new", "this", "typeof", "instanceof", "class",
  "extends", "implements", "interface", "type", "enum", "as", "try", "catch",
  "finally", "throw", "void", "yield", "static", "readonly", "private", "public", "protected"
]);

const PYTHON_KEYWORDS = new Set([
  "def", "class", "import", "from", "as", "return", "if", "elif", "else",
  "for", "while", "in", "is", "not", "and", "or", "try", "except", "finally",
  "raise", "with", "yield", "lambda", "global", "nonlocal", "pass", "break", "continue"
]);

const BASH_KEYWORDS = new Set([
  "echo", "cd", "ls", "mkdir", "rm", "cp", "mv", "cat", "grep", "find",
  "curl", "wget", "npm", "bun", "pnpm", "yarn", "git", "export", "source",
  "if", "then", "else", "elif", "fi", "for", "do", "done", "case", "esac",
  "sudo", "chmod", "chown", "exit"
]);

const SQL_KEYWORDS = new Set([
  "select", "from", "where", "insert", "into", "values", "update", "set",
  "delete", "create", "table", "drop", "alter", "join", "inner", "left",
  "right", "on", "group", "by", "order", "asc", "desc", "having", "limit",
  "and", "or", "not", "null", "primary", "key", "foreign", "references"
]);

/**
 * Tokenizes a single line of code into styled tokens based on language.
 */
export function tokenizeCodeLine(line: string, lang: string = "", theme: "dark" | "light" = "dark"): SyntaxToken[] {
  const COLORS = theme === "light" ? SYNTAX_COLORS_LIGHT : SYNTAX_COLORS;
  if (!line) {
    return [{ text: " ", type: "plain", colorHex: COLORS.plain }];
  }

  const normalizedLang = (lang || "").toLowerCase().trim();
  const tokens: SyntaxToken[] = [];
  let pos = 0;

  // Single-line comment check
  if (
    line.trimStart().startsWith("//") ||
    line.trimStart().startsWith("#") ||
    line.trimStart().startsWith("--")
  ) {
    const leadWs = line.match(/^\s*/)?.[0] || "";
    if (leadWs) {
      tokens.push({ text: leadWs, type: "plain", colorHex: COLORS.plain });
    }
    tokens.push({
      text: line.slice(leadWs.length),
      type: "comment",
      colorHex: COLORS.comment,
      italic: true,
    });
    return tokens;
  }

  while (pos < line.length) {
    // Whitespace
    if (/\s/.test(line[pos])) {
      let ws = "";
      while (pos < line.length && /\s/.test(line[pos])) {
        ws += line[pos++];
      }
      tokens.push({ text: ws, type: "plain", colorHex: COLORS.plain });
      continue;
    }

    // Inline comments (e.g. // or #)
    if (line.slice(pos, pos + 2) === "//") {
      tokens.push({
        text: line.slice(pos),
        type: "comment",
        colorHex: COLORS.comment,
        italic: true,
      });
      break;
    }

    // Strings: single, double quotes or backticks
    if (line[pos] === '"' || line[pos] === "'" || line[pos] === "`") {
      const quote = line[pos];
      let str = quote;
      pos++;
      while (pos < line.length) {
        if (line[pos] === "\\" && pos + 1 < line.length) {
          str += line[pos] + line[pos + 1];
          pos += 2;
          continue;
        }
        str += line[pos];
        if (line[pos] === quote) {
          pos++;
          break;
        }
        pos++;
      }
      tokens.push({ text: str, type: "string", colorHex: COLORS.string });
      continue;
    }

    // Numbers
    if (/\d/.test(line[pos])) {
      let num = "";
      while (pos < line.length && /[\d.a-fA-FxX]/.test(line[pos])) {
        num += line[pos++];
      }
      tokens.push({ text: num, type: "number", colorHex: COLORS.number });
      continue;
    }

    // Word / Identifiers
    if (/[a-zA-Z_$]/.test(line[pos])) {
      let word = "";
      while (pos < line.length && /[a-zA-Z0-9_$]/.test(line[pos])) {
        word += line[pos++];
      }

      // Check booleans / null
      if (
        word === "true" ||
        word === "false" ||
        word === "null" ||
        word === "undefined" ||
        word === "True" ||
        word === "False" ||
        word === "None"
      ) {
        tokens.push({ text: word, type: "boolean", colorHex: COLORS.boolean, bold: true });
        continue;
      }

      // Check keywords
      const isJsKeyword =
        (!normalizedLang ||
          ["ts", "typescript", "js", "javascript", "tsx", "jsx"].includes(normalizedLang)) &&
        JS_KEYWORDS.has(word);

      const isPyKeyword =
        ["py", "python"].includes(normalizedLang) && PYTHON_KEYWORDS.has(word);

      const isBashKeyword =
        ["sh", "bash", "shell", "zsh"].includes(normalizedLang) && BASH_KEYWORDS.has(word);

      const isSqlKeyword =
        ["sql"].includes(normalizedLang) && SQL_KEYWORDS.has(word.toLowerCase());

      if (isJsKeyword || isPyKeyword || isBashKeyword || isSqlKeyword) {
        tokens.push({ text: word, type: "keyword", colorHex: COLORS.keyword, bold: true });
        continue;
      }

      // Check function call: word followed by (
      let nextNonWs = pos;
      while (nextNonWs < line.length && /\s/.test(line[nextNonWs])) {
        nextNonWs++;
      }
      if (line[nextNonWs] === "(") {
        tokens.push({ text: word, type: "function", colorHex: COLORS.function });
        continue;
      }

      // Check Types / Classes (starts with Capital letter)
      if (/^[A-Z][a-zA-Z0-9_$]*$/.test(word)) {
        tokens.push({ text: word, type: "type", colorHex: COLORS.type });
        continue;
      }

      // Plain identifier
      tokens.push({ text: word, type: "plain", colorHex: COLORS.plain });
      continue;
    }

    // Punctuation & Operators
    const char = line[pos++];
    if (["=", "+", "-", "*", "/", "!", ">", "<", "&", "|", "?", ":"].includes(char)) {
      tokens.push({ text: char, type: "operator", colorHex: COLORS.operator });
    } else {
      tokens.push({ text: char, type: "punctuation", colorHex: COLORS.punctuation });
    }
  }

  return tokens;
}

/**
 * Converts a code snippet to syntax-highlighted HTML with colored span tokens.
 */
export function highlightCodeToHtml(code: string, lang: string = ""): string {
  const lines = (code || "").split("\n");
  const htmlLines = lines.map((line) => {
    const tokens = tokenizeCodeLine(line, lang);
    return tokens
      .map((t) => {
        const escaped = t.text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");

        if (t.type === "plain") return escaped;
        return `<span style="color: #${t.colorHex};${t.bold ? " font-weight: bold;" : ""}${
          t.italic ? " font-style: italic;" : ""
        }">${escaped}</span>`;
      })
      .join("");
  });

  return htmlLines.join("\n");
}
