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

  // Optional enterprise features (uncomment to activate):
  // coverPage: { enabled: true, preset: "modern", logo: "./assets/company-logo.png", badge: "SPECIFICATION" },
  // backCover: { enabled: true, preset: "corporate", logo: "./assets/company-logo.png" },
  // numberHeadings: { enabled: true, depth: 3 },
  // watermark: "CONFIDENTIAL",
  // security: { userPassword: "open_password", ownerPassword: "admin_password", permissions: { modifying: false, copying: false } },
  // math: true,
});
