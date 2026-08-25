import type { TsCheckConfig } from "./types.js";

/**
 * Type-safe configuration helper for `@masumdev/tscheck`.
 *
 * Provides IDE autocompletion, type checking, and documentation for all config properties.
 *
 * @example
 * ```ts
 * import { defineConfig } from "@masumdev/tscheck";
 *
 * export default defineConfig({
 *   rules: {
 *     deprecated: true,
 *     unused: true,
 *     noExplicitAny: true,
 *   },
 *   reporters: {
 *     outputDir: ".temp/tscheck",
 *     json: true,
 *     markdown: true,
 *   },
 * });
 * ```
 */
export function defineConfig(config: TsCheckConfig): TsCheckConfig {
  return config;
}
