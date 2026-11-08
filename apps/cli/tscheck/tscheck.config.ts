import { defineConfig, Editor } from "@masumdev/tscheck";

export default defineConfig({
  rootDir: process.cwd(),
  workspaces: ["."],
  exclude: ["node_modules", "dist", ".temp"],
  editor: Editor.VSCODE,
  rules: {
    deprecated: true,
    unused: true,
    noExplicitAny: true,
    circular: true,
  },
  reporters: {
    outputDir: ".temp/custom-reports",
    json: true,
    markdown: true,
    html: true,
  },
  failOnWarning: false,
});
