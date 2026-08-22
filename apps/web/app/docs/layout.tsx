import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import Image from "next/image";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      githubUrl="https://github.com/masumrpg/react-native-library"
      nav={{
        title: (
          <span className="flex items-center gap-2.5 font-bold text-base">
            <Image
              src="/logo.webp"
              alt="Masum Dev Logo"
              width={26}
              height={26}
              className="rounded-md object-contain"
            />
            Masum Dev
          </span>
        ),
        url: "/",
      }}
    >
      {children}
    </DocsLayout>
  );
}
