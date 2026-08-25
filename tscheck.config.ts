import { defineConfig } from "./packages/tscheck/src/index.js";

export default defineConfig({
  rootDir: process.cwd(),
  workspaces: ["packages/*", "apps/*"],
  exclude: ["node_modules", "dist", "build", ".expo", ".turbo", ".temp"],
  rules: {
    deprecated: true,
    unused: true,
    noExplicitAny: true,
  },
  reporters: {
    outputDir: ".temp/tscheck",
    json: true,
    markdown: true,
    jsonFileName: "audit-report.json",
    markdownFileName: "audit-report.md",
  },
  failOnWarning: false,
});
