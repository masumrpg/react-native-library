import type { NormalizedTsCheckConfig } from "./types.js";

export const DEFAULT_CONFIG_FILENAMES = [
  "tscheck.config.ts",
  "tscheck.config.js",
  "tscheck.config.mjs",
  "tscheck.config.cjs",
];

export const DEFAULT_EXCLUDE = [
  "node_modules",
  "dist",
  "build",
  ".expo",
  ".turbo",
  ".temp",
];

export const DEFAULT_CONFIG: NormalizedTsCheckConfig = {
  rootDir: process.cwd(),
  workspaces: undefined,
  exclude: DEFAULT_EXCLUDE,
  staged: false,
  since: undefined,
  fix: false,
  format: "pretty",
  serve: false,
  open: false,
  port: 5500,
  editor: "vscode",
  failOnWarning: false,
  tsconfigName: "tsconfig.json",
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
    serve: false,
    open: false,
    port: 5500,
    editor: "vscode",
    githubAnnotations: false,
  },
};
