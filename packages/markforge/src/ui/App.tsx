import React, { useState, useEffect } from "react";
import { Box } from "ink";
import { Header } from "./Header.js";
import { LiveProgress } from "./LiveProgress.js";
import { SummaryTable } from "./SummaryTable.js";
import type { MarkforgeConfig, CompilationResult } from "../config/types.js";
import { compileMarkdown } from "../core/engine.js";

export interface AppProps {
  inputFile: string;
  config: MarkforgeConfig;
  configPath?: string | null;
  onComplete?: (result: CompilationResult) => void;
}

export const App: React.FC<AppProps> = ({ inputFile, config, configPath, onComplete }) => {
  const [status, setStatus] = useState<string>("Initializing...");
  const [isCompiling, setIsCompiling] = useState<boolean>(true);
  const [result, setResult] = useState<CompilationResult | null>(null);

  useEffect(() => {
    async function run() {
      try {
        const res = await compileMarkdown(inputFile, config, (msg) => setStatus(msg));
        setResult(res);
        setIsCompiling(false);
        onComplete?.(res);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        const errResult: CompilationResult = {
          inputFile,
          durationMs: 0,
          metadata: {},
          files: [],
          errors: [errMsg],
        };
        setResult(errResult);
        setIsCompiling(false);
        onComplete?.(errResult);
      }
    }
    run();
  }, [inputFile, config, onComplete]);

  const targetFormats = Array.isArray(config.to)
    ? (config.to as string[])
    : config.to
    ? [String(config.to)]
    : ["docx", "pdf"];

  return (
    <Box flexDirection="column">
      <Header
        inputFile={inputFile}
        configPath={configPath}
        config={config}
        theme={config.theme}
        targetFormats={targetFormats}
      />
      <LiveProgress status={status} isCompiling={isCompiling} />
      <SummaryTable result={result} />
    </Box>
  );
};
