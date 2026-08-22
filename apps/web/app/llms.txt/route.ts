import { source } from "@/lib/source";

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    "# @masumdev Documentation",
    "> Open-source React Native & Expo component libraries",
    "",
  ];

  for (const page of source.getPages()) {
    lines.push(
      `## [${page.data.title}](https://masumdev.vercel.app${page.url})`
    );
    if (page.data.description) {
      lines.push(`> ${page.data.description}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
