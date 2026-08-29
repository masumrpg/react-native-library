/**
 * Example 6: Bulk & Batch Document Generation
 * Demonstrates compiling multiple documents in parallel from dynamic data and templates.
 *
 * Author: Ma'sum (@masumrpg)
 */
import * as path from "node:path";
import * as fs from "node:fs";
import { compileMarkdown, Theme, OutputFormat } from "@masumdev/markforge";

// Sample dataset: 5 enterprise quarterly department reports
const departmentReports = [
  {
    dept: "Engineering",
    lead: "Alexander Wright",
    budget: "$1,450,000",
    status: "On Track",
    kpis: ["99.99% Uptime", "38 Releases Shipped", "0 Security Breaches"],
  },
  {
    dept: "Product Design",
    lead: "Sarah Jenkins",
    budget: "$620,000",
    status: "Completed",
    kpis: ["Design System 2.0", "14 Usability Labs", "NPS Score 78"],
  },
  {
    dept: "Infrastructure & Security",
    lead: "David Chen",
    budget: "$890,000",
    status: "On Track",
    kpis: ["Multi-Region Failover", "Zero-Trust mTLS", "SOC2 Compliance"],
  },
  {
    dept: "Finance & Operations",
    lead: "Ma'sum",
    budget: "$2,100,000",
    status: "Reviewed",
    kpis: ["18% Cost Optimization", "Clean Audit Report", "Automated Payroll"],
  },
  {
    dept: "Customer Success",
    lead: "Elena Rostova",
    budget: "$480,000",
    status: "Exceeded",
    kpis: ["< 15min SLA Response", "96% CSAT Score", "Zero Churn Key Accounts"],
  },
];

async function main() {
  const outputDir = path.resolve(__dirname, "../.temp/bulk-reports");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Starting bulk compilation of ${departmentReports.length} department reports...`);
  const startTime = Date.now();

  // Parallel Batch Compilation using Promise.all
  const results = await Promise.all(
    departmentReports.map(async (data, index) => {
      // 1. Construct dynamic Markdown template for each record
      const markdown = `---
title: "${data.dept} - Quarterly Performance Report"
subtitle: "Executive Summary & Operational Review — Q3 2026"
author: "${data.lead}"
company: "Enterprise Global Holdings"
version: "1.0.${index + 1}"
date: "${new Date().toISOString().split("T")[0]}"
theme: "corporate"
toc: true
coverPage:
  enabled: true
  preset: "modern"
  badge: "${data.status.toUpperCase()}"
  badgeColor: "#ECFDFD"
  badgeTextColor: "#0D998D"
  footerText: "Confidential Internal Report — Masum Dev Monorepo"
numberHeadings:
  enabled: true
  depth: 2
---

# Executive Summary

This document presents the Q3 operational review for the **${data.dept}** division. Under the leadership of **${data.lead}**, the department maintained an allocated operating budget of **${data.budget}**.

> [!NOTE]
> Operational status for this period is verified as **${data.status}**.

---

# Key Performance Indicators

Below is the summary table of verified achievements for Q3:

| Metric Indicator | Status | Quarter Goal |
| :--- | :---: | ---: |
${data.kpis.map((kpi, i) => `| KPI #${i + 1}: ${kpi} | Passed | 100% |`).join("\n")}

---

# Strategic Architecture & Workflow

\`\`\`mermaid
graph LR
    A[Planning] --> B(${data.dept} Pipeline)
    B --> C{Review}
    C -->|Approved| D[Execution]
    C -->|Revisions| B
\`\`\`

---

:::columns 2
:::col
### Department Lead
- Name: ${data.lead}
- Role: Division Principal
- Office: Global HQ
:::
:::col
### Operational Metrics
- Budget: ${data.budget}
- Fiscal Period: Q3 2026
- Compliance: ISO 27001
:::
:::

---

# Signatures & Verification

Academic and administrative sign-off verification[^audit].

[^audit]: Verified by independent internal audit procedures pursuant to enterprise bylaws.
`;

      const fileBaseName = `Report-${data.dept.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`;
      const tempMdPath = path.join(outputDir, fileBaseName);
      fs.writeFileSync(tempMdPath, markdown, "utf-8");

      // 2. Compile directly to DOCX, PDF, and HTML
      const compileRes = await compileMarkdown(tempMdPath, {
        to: [OutputFormat.DOCX, OutputFormat.PDF, OutputFormat.HTML],
        outputDir,
        theme: Theme.CORPORATE,
      });

      console.log(`[OK] Generated: ${data.dept} (${compileRes.files.length} files in ${compileRes.durationMs}ms)`);
      return compileRes;
    })
  );

  const totalDuration = Date.now() - startTime;
  const totalFiles = results.reduce((acc, r) => acc + r.files.length, 0);

  console.log("======================================================");
  console.log(`Bulk generation completed successfully!`);
  console.log(`Total Documents : ${departmentReports.length}`);
  console.log(`Total Files     : ${totalFiles} files (.docx, .pdf, .html)`);
  console.log(`Total Time      : ${totalDuration}ms (average ${Math.round(totalDuration / departmentReports.length)}ms/doc)`);
  console.log(`Output Folder   : ${outputDir}`);
  console.log("======================================================");
}

main().catch((err) => {
  console.error("Bulk generation error:", err);
  process.exit(1);
});
