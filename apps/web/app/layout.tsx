import type { ReactNode } from "react";
import type { Metadata } from "next";
import { RootProvider } from "fumadocs-ui/provider/next";
import "../styles/global.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    template: "%s | Masum Dev",
    default: "Masum Dev — React Native Libraries",
  },
  description:
    "Open source React Native & Expo UI libraries: rn-ui, rn-tajweed-verse, react-native-qr-code-gen.",
  keywords: ["react-native", "expo", "ui-kit", "quran", "qr-code"],
  icons: {
    icon: "/logo.webp",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
