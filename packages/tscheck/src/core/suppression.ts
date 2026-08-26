import * as ts from "typescript";

export type RuleCategory =
  | "deprecated"
  | "unused"
  | "noExplicitAny"
  | "circular"
  | "packageBoundary";

interface LineSuppression {
  rules: Set<string>;
}

interface RangeSuppression {
  startLine: number;
  endLine: number;
  rules: Set<string>;
}

export class CommentSuppressionMap {
  private lineDirectives = new Map<number, LineSuppression>();
  private rangeDirectives: RangeSuppression[] = [];

  constructor(sourceFile: ts.SourceFile) {
    this.parseComments(sourceFile);
  }

  private normalizeRule(raw: string): string {
    const lower = raw.trim().toLowerCase();
    if (lower === "any") return "noexplicitany";
    if (lower === "boundary") return "packageboundary";
    return lower;
  }

  private parseComments(sourceFile: ts.SourceFile): void {
    const text = sourceFile.getFullText();
    const lines = text.split("\n");

    let currentDisabledStart: { line: number; rules: Set<string> } | null = null;

    for (let i = 0; i < lines.length; i++) {
      const lineNum = i + 1; // 1-indexed
      const lineContent = lines[i];

      // Check single line comment directives:
      // // tscheck-ignore-next-line [rules...]
      // // tscheck-disable-next-line [rules...]
      const nextLineMatch = lineContent.match(
        /\/\/\s*tscheck-(?:ignore|disable)-next-line(?:\s+([a-zA-Z0-9_,\s-]+))?/i
      );
      if (nextLineMatch) {
        const rules = new Set<string>();
        if (nextLineMatch[1]) {
          nextLineMatch[1]
            .split(/[,\s]+/)
            .filter(Boolean)
            .forEach((r) => rules.add(this.normalizeRule(r)));
        } else {
          rules.add("all");
        }
        this.lineDirectives.set(lineNum + 1, { rules });
      }

      // // tscheck-ignore [rules...] (current line)
      const currentLineMatch = lineContent.match(
        /\/\/\s*tscheck-(?:ignore|disable)(?!-next-line)(?:\s+([a-zA-Z0-9_,\s-]+))?/i
      );
      if (currentLineMatch) {
        const rules = new Set<string>();
        if (currentLineMatch[1]) {
          currentLineMatch[1]
            .split(/[,\s]+/)
            .filter(Boolean)
            .forEach((r) => rules.add(this.normalizeRule(r)));
        } else {
          rules.add("all");
        }
        this.lineDirectives.set(lineNum, { rules });
      }

      // Block disable: /* tscheck-disable [rules...] */
      const blockDisableMatch = lineContent.match(
        /\/\*\s*tscheck-disable(?:\s+([a-zA-Z0-9_,\s-]+))?\s*\*\//i
      );
      if (blockDisableMatch) {
        const rules = new Set<string>();
        if (blockDisableMatch[1]) {
          blockDisableMatch[1]
            .split(/[,\s]+/)
            .filter(Boolean)
            .forEach((r) => rules.add(this.normalizeRule(r)));
        } else {
          rules.add("all");
        }
        currentDisabledStart = { line: lineNum, rules };
      }

      // Block enable: /* tscheck-enable [rules...] */
      const blockEnableMatch = lineContent.match(/\/\*\s*tscheck-enable\s*\*\//i);
      if (blockEnableMatch && currentDisabledStart) {
        this.rangeDirectives.push({
          startLine: currentDisabledStart.line,
          endLine: lineNum,
          rules: currentDisabledStart.rules,
        });
        currentDisabledStart = null;
      }
    }

    if (currentDisabledStart) {
      this.rangeDirectives.push({
        startLine: currentDisabledStart.line,
        endLine: Number.POSITIVE_INFINITY,
        rules: currentDisabledStart.rules,
      });
    }
  }

  /**
   * Checks whether a rule violation on a given line is suppressed by comments.
   */
  public isSuppressed(line: number, rule: RuleCategory): boolean {
    const normalizedRule = this.normalizeRule(rule);

    // 1. Check exact line directives (e.g. from ignore-next-line or same-line ignore)
    const lineDirective = this.lineDirectives.get(line);
    if (lineDirective) {
      if (lineDirective.rules.has("all") || lineDirective.rules.has(normalizedRule)) {
        return true;
      }
    }

    // 2. Check range directives
    for (const range of this.rangeDirectives) {
      if (line >= range.startLine && line <= range.endLine) {
        if (range.rules.has("all") || range.rules.has(normalizedRule)) {
          return true;
        }
      }
    }

    return false;
  }
}
