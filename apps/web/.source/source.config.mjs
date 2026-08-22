// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
import { pageSchema } from "fumadocs-core/source/schema";
import { remarkNpm } from "fumadocs-core/mdx-plugins";
import { z } from "zod";
var docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      icon: z.string().optional()
    })
  }
});
var source_config_default = defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkNpm]
  }
});
export {
  source_config_default as default,
  docs
};
