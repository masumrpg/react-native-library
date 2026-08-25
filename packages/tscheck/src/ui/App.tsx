import type React from "react";
import { useEffect, useState } from "react";
import { Box, Text } from "ink";
import type {
  TsCheckConfig,
  AuditReport,
  WorkspaceScanResult,
} from "../config/types.js";
import { runAuditEngine } from "../core/engine.js";
import { writeAuditReports } from "../core/reporter.js";
import { Header } from "./Header.js";
import { WorkspaceCard } from "./WorkspaceCard.js";
import { SummaryTable } from "./SummaryTable.js";
import { LiveProgress } from "./LiveProgress.js";
import { InteractiveExplorer } from "./InteractiveExplorer.js";

interface AppProps {
  config: TsCheckConfig;
  configPath: string | null;
  version: string;
  interactive?: boolean;
  onDone?: (report: AuditReport) => void;
}

export const App: React.FC<AppProps> = ({
  config,
  configPath,
  version,
  interactive,
  onDone,
}) => {
  const [completedWorkspaces, setCompletedWorkspaces] = useState<
    WorkspaceScanResult[]
  >([]);
  const [activeWorkspaceName, setActiveWorkspaceName] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [fileIndex, setFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [totalWorkspaces, setTotalWorkspaces] = useState(0);
  const [recentLogs, setRecentLogs] = useState<string[]>([]);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function execute() {
      try {
        const auditReport = await runAuditEngine(config, (event) => {
          if (!isMounted) return;

          if (event.type === "start") {
            setTotalWorkspaces(event.totalWorkspaces);
          } else if (event.type === "workspace-start" && event.workspace) {
            setActiveWorkspaceName(event.workspace.name);
          } else if (event.type === "file-progress") {
            setCurrentFile(event.currentFile);
            setFileIndex(event.fileIndex);
            setTotalFiles(event.totalFiles);
          } else if (event.type === "log") {
            setRecentLogs((prev) => [...prev.slice(-4), event.message]);
          } else if (event.type === "workspace-done" && event.workspace) {
            setCompletedWorkspaces((prev) => [...prev, event.workspace]);
            setActiveWorkspaceName(null);
            setCurrentFile(null);
          }
        });

        // Save report files
        const reportFiles = writeAuditReports(auditReport, config);
        auditReport.reportFiles = reportFiles;

        if (isMounted) {
          setReport(auditReport);
          setIsScanning(false);
          onDone?.(auditReport);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
          setIsScanning(false);
        }
      }
    }

    execute();

    return () => {
      isMounted = false;
    };
  }, [config, onDone]);

  return (
    <Box flexDirection="column" padding={1}>
      <Header
        version={version}
        rootDir={config.rootDir || process.cwd()}
        configPath={configPath}
      />

      {isScanning && (
        <LiveProgress
          activeWorkspace={activeWorkspaceName}
          currentFile={currentFile}
          fileIndex={fileIndex}
          totalFiles={totalFiles}
          completedWorkspaces={completedWorkspaces.length}
          totalWorkspaces={totalWorkspaces}
          recentLogs={recentLogs}
        />
      )}

      {!isScanning && completedWorkspaces.length > 0 && (
        <Box flexDirection="column" marginY={1}>
          <Text bold color="cyan">
            [COMPLETED WORKSPACES]
          </Text>
          {completedWorkspaces.map((ws, idx) => (
            <WorkspaceCard key={idx} workspace={ws} status="completed" />
          ))}
        </Box>
      )}

      {error && (
        <Box
          borderStyle="single"
          borderColor="red"
          paddingX={1}
          marginTop={1}
        >
          <Text color="red" bold>
            [ERROR] {error}
          </Text>
        </Box>
      )}

      {report && (
        <SummaryTable
          report={report}
          failOnWarning={config.failOnWarning}
        />
      )}

      {report && interactive && (
        <InteractiveExplorer report={report} />
      )}
    </Box>
  );
};
