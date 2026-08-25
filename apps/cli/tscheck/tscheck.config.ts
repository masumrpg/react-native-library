import { defineConfig } from "@masumdev/tscheck";

export default defineConfig({
  rootDir: process.cwd(),
  workspaces: ["."],
  exclude: ["node_modules", "dist", ".temp"],
  rules: {
    deprecated: true,
    unused: true,
    noExplicitAny: true,
  },
  reporters: {
    outputDir: ".temp/custom-reports",
    json: true,
    markdown: true,
  },
  failOnWarning: false,
});
