import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    outDir: "dist",
    tsconfig: "tsconfig.build.json",
  },
  {
    entry: { cli: "src/cli.tsx" },
    format: ["esm"],
    banner: {
      js: "#!/usr/bin/env node",
    },
    outDir: "dist",
    tsconfig: "tsconfig.build.json",
  },
]);
