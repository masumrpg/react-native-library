import { defineConfig, Editor } from "@masumdev/tscheck";

export default defineConfig({
  rootDir: process.cwd(),
  workspaces: ["packages/*", "apps/*"],
  exclude: ["node_modules", "dist", "build", ".expo", ".turbo", ".temp"],
  editor: Editor.VSCODE,
  rules: {
    deprecated: true,
    unused: true,
    noExplicitAny: true,
    circular: true,
  },
  reporters: {
    outputDir: ".temp/tscheck",
    json: true,
    markdown: true,
    html: true,
    ai: true,
  },
  failOnWarning: false,
});
