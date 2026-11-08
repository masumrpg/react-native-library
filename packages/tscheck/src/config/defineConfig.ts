import type { TsCheckConfig } from "./types.js";

export type TsCheckConfigFactory = () => TsCheckConfig | Promise<TsCheckConfig>;

/**
 * Type-safe configuration helper for `tscheck.config.ts`.
 *
 * Provides IDE autocompletion, type checking, and documentation for all config properties.
 *
 * @example
 * ```ts
 * import { defineConfig, Editor } from "@masumdev/tscheck";
 *
 * export default defineConfig({
 *   workspaces: ["packages/*", "apps/*"],
 *   editor: Editor.CURSOR,
 *   rules: {
 *     deprecated: true,
 *     unused: true,
 *     noExplicitAny: true,
 *     circular: true,
 *   },
 *   reporters: {
 *     outputDir: ".temp/tscheck",
 *     json: true,
 *     markdown: true,
 *     html: true,
 *   },
 * });
 * ```
 */
export function defineConfig(
  config: TsCheckConfig | TsCheckConfigFactory
): TsCheckConfig | TsCheckConfigFactory {
  return config;
}
