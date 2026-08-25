import type React from "react";
import { Box, Text } from "ink";

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  align?: "left" | "right" | "center";
  width?: number;
}

export interface TableProps<T extends Record<string, unknown>> {
  data: T[];
  columns?: TableColumn<T>[];
  padding?: number;
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  padding = 1,
}: TableProps<T>): React.JSX.Element {
  if (data.length === 0) {
    return <Box />;
  }

  // Derive columns if not provided
  const cols: TableColumn<T>[] =
    columns ||
    (Object.keys(data[0] || {}) as (keyof T)[]).map((key) => ({
      key,
      header: String(key).toUpperCase(),
      align: "left",
    }));

  // Calculate column widths
  const colWidths = cols.map((col) => {
    let max = col.header.length;
    for (const row of data) {
      const val = String(row[col.key] ?? "");
      if (val.length > max) {
        max = val.length;
      }
    }
    return Math.max(col.width || 0, max + padding * 2);
  });

  const padCell = (text: string, width: number, align: "left" | "right" | "center" = "left"): string => {
    const rawLen = text.length;
    const diff = Math.max(0, width - rawLen);
    if (align === "right") {
      return " ".repeat(diff) + text;
    }
    if (align === "center") {
      const leftPad = Math.floor(diff / 2);
      const rightPad = diff - leftPad;
      return " ".repeat(leftPad) + text + " ".repeat(rightPad);
    }
    return text + " ".repeat(diff);
  };

  // Border characters
  const topBorder = "┌" + colWidths.map((w) => "─".repeat(w)).join("┬") + "┐";
  const headerDivider = "├" + colWidths.map((w) => "─".repeat(w)).join("┼") + "┤";
  const bottomBorder = "└" + colWidths.map((w) => "─".repeat(w)).join("┴") + "┘";

  return (
    <Box flexDirection="column">
      {/* Top Border */}
      <Text color="gray">{topBorder}</Text>

      {/* Header Row */}
      <Box flexDirection="row">
        <Text color="gray">│</Text>
        {cols.map((col, idx) => (
          <Box key={String(col.key)} flexDirection="row">
            <Text bold color="cyan">
              {padCell(` ${col.header} `, colWidths[idx] || 0, col.align)}
            </Text>
            <Text color="gray">│</Text>
          </Box>
        ))}
      </Box>

      {/* Header Divider */}
      <Text color="gray">{headerDivider}</Text>

      {/* Data Rows */}
      {data.map((row, rowIdx) => (
        <Box key={rowIdx} flexDirection="row">
          <Text color="gray">│</Text>
          {cols.map((col, colIdx) => {
            const val = String(row[col.key] ?? "");
            let valColor = "white";
            if (val.includes("[PASSED]") || val.includes("[OK]")) {
              valColor = "green";
            } else if (val.includes("[WARN]")) {
              valColor = "yellow";
            } else if (val.includes("[FAILED]")) {
              valColor = "red";
            }

            return (
              <Box key={String(col.key)} flexDirection="row">
                <Text color={valColor}>
                  {padCell(` ${val} `, colWidths[colIdx] || 0, col.align)}
                </Text>
                <Text color="gray">│</Text>
              </Box>
            );
          })}
        </Box>
      ))}

      {/* Bottom Border */}
      <Text color="gray">{bottomBorder}</Text>
    </Box>
  );
}
