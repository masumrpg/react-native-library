import React from "react";
import * as path from "node:path";
import { Box, Text } from "ink";
import { MARKFORGE_VERSION } from "../version.js";
import type { MarkforgeConfig, MarkforgeTheme } from "../config/types.js";

export interface HeaderProps {
  inputFile?: string;
  configPath?: string | null;
  config?: MarkforgeConfig;
  theme?: MarkforgeTheme;
  targetFormats?: string[];
}

function formatDisplayPath(p?: string | null): string {
  if (!p) return "";
  try {
    const rel = path.relative(process.cwd(), p);
    return rel && !rel.startsWith("..") && rel.length < p.length ? `./${rel}` : p;
  } catch {
    return p;
  }
}

export const Header: React.FC<HeaderProps> = ({
  inputFile,
  configPath,
  config,
  theme = "corporate",
  targetFormats = ["docx", "pdf"],
}) => {
  const resolvedTheme = config?.theme || theme;
  const themeLabel =
    typeof resolvedTheme === "object" ? "Custom (ThemeProps)" : String(resolvedTheme || "corporate");

  // Collect enabled active features
  const activeFeatures: string[] = [];
  if (config?.toc) activeFeatures.push("TOC");
  if (config?.numberHeadings) {
    if (typeof config.numberHeadings === "object") {
      const isNumEnabled = config.numberHeadings.enabled ?? true;
      if (isNumEnabled) {
        activeFeatures.push(`Numbering (depth ${config.numberHeadings.depth ?? 3})`);
      }
    } else if (config.numberHeadings === true) {
      activeFeatures.push("Numbering (depth 3)");
    }
  }
  if (config?.coverPage) {
    if (typeof config.coverPage === "object" && config.coverPage.enabled !== false) {
      activeFeatures.push(`Cover (${config.coverPage.preset || "corporate"})`);
    } else if (config.coverPage === true) {
      activeFeatures.push("Cover (corporate)");
    }
  }
  if (config?.backCover) {
    if (typeof config.backCover === "object" && config.backCover.enabled !== false) {
      activeFeatures.push(`BackCover (${config.backCover.preset || "corporate"})`);
    } else if (config.backCover === true) {
      activeFeatures.push("BackCover (corporate)");
    }
  }
  if (config?.watermark) {
    const wmText = typeof config.watermark === "object" ? config.watermark.text : config.watermark;
    if (wmText) {
      activeFeatures.push(`Watermark ("${wmText}")`);
    }
  }
  if (config?.security && (config.security.userPassword || config.security.ownerPassword)) {
    activeFeatures.push("AES-256 Security");
  }
  if (config?.math !== false) activeFeatures.push("KaTeX Math");
  if (config?.syntaxTheme) activeFeatures.push(`Syntax (${config.syntaxTheme})`);

  const paperLabel = `${config?.paperSize || "A4"} (${config?.orientation || "portrait"})`;
  const outputLabel = config?.outputDir ? formatDisplayPath(config.outputDir) : "./ (default)";
  const configLabel = configPath ? formatDisplayPath(configPath) : "(default auto-discovery)";

  return (
    <Box flexDirection="column" marginY={1}>
      <Box
        borderStyle="round"
        borderColor="cyan"
        paddingX={2}
        paddingY={1}
        flexDirection="column"
      >
        {/* Top Header Row */}
        <Box justifyContent="space-between" alignItems="center">
          <Box>
            <Text bold color="cyan">
              MARKFORGE
            </Text>
            <Text color="gray"> | Document Publishing Engine</Text>
          </Box>
          <Box>
            <Text color="black" backgroundColor="cyan" bold>
              {" "}v{MARKFORGE_VERSION}{" "}
            </Text>
          </Box>
        </Box>

        {/* Source & Configuration Info */}
        <Box flexDirection="column" marginTop={1}>
          {/* Row 1: Source & Config */}
          <Box justifyContent="space-between">
            <Box>
              <Text color="gray">Source:  </Text>
              <Text color="white" bold>
                {formatDisplayPath(inputFile)}
              </Text>
            </Box>
            <Box>
              <Text color="gray">Config:  </Text>
              <Text color="cyan">
                {configLabel}
              </Text>
            </Box>
          </Box>

          {/* Row 2: Theme & Targets */}
          <Box justifyContent="space-between" marginTop={0}>
            <Box>
              <Text color="gray">Theme:   </Text>
              <Text color="magenta" bold>
                {themeLabel}
              </Text>
            </Box>
            {targetFormats && targetFormats.length > 0 && (
              <Box>
                <Text color="gray">Targets: </Text>
                <Text color="yellow" bold>
                  {targetFormats.map((f) => f.toUpperCase()).join(", ")}
                </Text>
              </Box>
            )}
          </Box>

          {/* Row 3: Paper Layout & Output Directory */}
          <Box justifyContent="space-between" marginTop={0}>
            <Box>
              <Text color="gray">Layout:  </Text>
              <Text color="green">
                {paperLabel}
              </Text>
            </Box>
            <Box>
              <Text color="gray">Output:  </Text>
              <Text color="white">
                {outputLabel}
              </Text>
            </Box>
          </Box>

          {/* Row 4: Active Features List */}
          {activeFeatures.length > 0 && (
            <Box marginTop={0}>
              <Text color="gray">Modules: </Text>
              <Text color="blue">
                {activeFeatures.join(" | ")}
              </Text>
            </Box>
          )}
        </Box>

        {/* Author & GitHub Footer in Header Box */}
        <Box marginTop={1} justifyContent="space-between">
          <Box>
            <Text color="gray">Author: </Text>
            <Text color="cyan" bold>
              Ma'sum
            </Text>
            <Text color="gray"> (@masumrpg)</Text>
          </Box>
          <Box>
            <Text color="gray">GitHub: </Text>
            <Text color="blue" underline>
              https://github.com/masumrpg
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

