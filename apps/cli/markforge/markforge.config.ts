import { defineConfig } from "@masumdev/markforge";

export default defineConfig({
  to: ["docx", "pdf", "html"],
  outputDir: ".temp/output",
  theme: "academic",
  orientation: "portrait",
  paperSize: "A4",
  margins: {
    top: "2.5cm",
    bottom: "2.5cm",
    left: "3cm",
    right: "3cm",
  },
  header: {
    right: "{title}",
  },
  footer: {
    right: "Page {page} of {pages}",
  },
  toc: true,
  embedImages: true,
});
