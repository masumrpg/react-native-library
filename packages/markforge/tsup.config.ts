import { defineConfig } from "tsup";

// localStorage polyfill injected BEFORE any ESM imports execute.
// The `docx` library accesses `globalThis.localStorage` at module evaluation time,
// which triggers a Node.js 22+ warning. Since ESM imports are hoisted above all
// inline code, the ONLY way to run code before them is via the bundler banner.
const LOCALSTORAGE_POLYFILL = `
try {
  if (typeof globalThis !== "undefined" && (!globalThis.localStorage || typeof globalThis.localStorage.getItem !== "function")) {
    Object.defineProperty(globalThis, "localStorage", {
      value: { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {}, key: () => null, length: 0 },
      configurable: true, writable: true,
    });
  }
} catch {}
`.trim();

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    outDir: "dist",
    tsconfig: "tsconfig.build.json",
    banner: {
      js: LOCALSTORAGE_POLYFILL,
    },
  },
  {
    entry: { cli: "src/cli.tsx" },
    format: ["esm"],
    banner: {
      js: `#!/usr/bin/env node\n${LOCALSTORAGE_POLYFILL}`,
    },
    outDir: "dist",
    tsconfig: "tsconfig.build.json",
  },
]);
