import Link from "next/link";
import Image from "next/image";
import {
  Smartphone,
  BookOpen,
  QrCode,
  ArrowRight,
  Package,
  CheckCircle2,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

function GithubIcon({
  size = 18,
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const libraries = [
  {
    icon: Smartphone,
    name: "@masumdev/rn-ui",
    version: "v0.1.6",
    description:
      "A complete React Native UI kit featuring 55+ production-grade components, typed theme tokens, and native light/dark mode.",
    href: "/docs/rn-ui",
    command: "bun add @masumdev/rn-ui",
    badge: "55+ Components",
    accent: "border-blue-500/30 bg-blue-500/5 hover:border-blue-500/60",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    features: ["Reanimated Worklets", "Gesture Handler", "Theme Hydration"],
  },
  {
    icon: BookOpen,
    name: "@masumdev/rn-tajweed-verse",
    version: "v0.1.1",
    description:
      "Parser & renderer for Quranic verses with 20+ color-coded Tajweed rules, interactive tooltips, and custom RTL typography.",
    href: "/docs/rn-tajweed-verse",
    command: "bun add @masumdev/rn-tajweed-verse",
    badge: "Quranic Tajweed",
    accent: "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    features: ["20+ Tajweed Rules", "Interactive Press", "Pure TS"],
  },
  {
    icon: QrCode,
    name: "@masumdev/react-native-qr-code-gen",
    version: "v0.1.3",
    description:
      "Vector SVG QR code generator with customizable eye corner shapes, data module patterns, center logo overlay, and presets.",
    href: "/docs/react-native-qr-code-gen",
    command: "bun add @masumdev/react-native-qr-code-gen",
    badge: "Vector SVG",
    accent: "border-purple-500/30 bg-purple-500/5 hover:border-purple-500/60",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    features: ["Custom Eye Shapes", "Logo Support", "Preset Styles"],
  },
];

const highlights = [
  {
    icon: Sparkles,
    title: "Pre-compiled Worklets",
    description:
      "Built with react-native-builder-bob. Reanimated worklets work out of the box with zero complex Babel setup.",
  },
  {
    icon: ShieldCheck,
    title: "100% Typed & Modern",
    description:
      "Strict TypeScript types for every prop, hook, and theme token. Fully compatible with Expo SDK 50+ and RN 0.73+.",
  },
  {
    icon: Layers,
    title: "Theme Engine & Storage",
    description:
      "Built-in light and dark mode with persistent AsyncStorage sync and native device color-scheme detection.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-fd-background text-fd-foreground font-sans selection:bg-fd-primary selection:text-fd-primary-foreground">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-fd-background/80 border-b border-fd-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-base sm:text-lg">
            <Image
              src="/logo.webp"
              alt="Masum Dev Logo"
              width={32}
              height={32}
              className="rounded-lg object-contain"
            />
            <span>Masum Dev</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-fd-muted-foreground">
            <Link href="/docs/rn-ui" className="hover:text-fd-foreground transition-colors">
              RN UI
            </Link>
            <Link href="/docs/rn-tajweed-verse" className="hover:text-fd-foreground transition-colors">
              RN Tajweed Verse
            </Link>
            <Link href="/docs/react-native-qr-code-gen" className="hover:text-fd-foreground transition-colors">
              RN QR Code Gen
            </Link>
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 hover:text-fd-foreground transition-colors cursor-pointer py-2"
              >
                <span>More</span>
                <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full right-0 hidden group-hover:flex flex-col min-w-[210px] p-2 rounded-xl border border-fd-border bg-fd-card shadow-xl backdrop-blur-md z-50">
                <Link
                  href="/docs"
                  className="px-3 py-2 text-xs font-semibold rounded-lg hover:bg-fd-accent text-fd-foreground transition-colors flex items-center justify-between"
                >
                  <span>All Packages &amp; Guides</span>
                  <ArrowRight size={12} />
                </Link>
                <div className="h-px bg-fd-border/50 my-1" />
                <Link
                  href="/docs/rn-ui/components"
                  className="px-3 py-2 text-xs rounded-lg hover:bg-fd-accent text-fd-foreground transition-colors"
                >
                  RN UI Components (55+)
                </Link>
                <Link
                  href="/docs/rn-tajweed-verse/tajweed-rules"
                  className="px-3 py-2 text-xs rounded-lg hover:bg-fd-accent text-fd-foreground transition-colors"
                >
                  Tajweed Rules
                </Link>
                <Link
                  href="/docs/react-native-qr-code-gen/presets"
                  className="px-3 py-2 text-xs rounded-lg hover:bg-fd-accent text-fd-foreground transition-colors"
                >
                  QR Code Presets
                </Link>
              </div>
            </div>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/masumrpg/react-native-library"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border border-fd-border hover:bg-fd-accent transition-colors"
              aria-label="GitHub Repository"
            >
              <GithubIcon size={18} />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-fd-primary text-fd-primary-foreground shadow-sm hover:opacity-95 transition-all"
            >
              Docs <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-fd-border">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-fd-border bg-fd-card text-fd-card-foreground text-xs font-medium mb-8 shadow-xs">
            <Package size={14} className="text-fd-primary" />
            <span>Production-Ready React Native &amp; Expo Monorepo</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Build Mobile Apps Faster with{" "}
            <span className="text-fd-primary">Masum Dev</span> Libraries
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-fd-muted-foreground mb-10 leading-relaxed">
            High-performance UI components, Quranic Tajweed parser, and custom SVG QR code generator — engineered for Expo SDK 50+ and React Native.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-semibold rounded-xl bg-fd-primary text-fd-primary-foreground shadow-lg shadow-fd-primary/20 hover:opacity-95 transition-all"
            >
              Explore Documentation <ArrowRight size={18} />
            </Link>
            <Link
              href="https://github.com/masumrpg/react-native-library"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-semibold rounded-xl border border-fd-border bg-fd-card hover:bg-fd-accent transition-all"
            >
              <GithubIcon size={18} /> View on GitHub
            </Link>
          </div>

          {/* Terminal Window Mockup */}
          <div className="max-w-xl mx-auto rounded-xl border border-fd-border bg-fd-card shadow-2xl overflow-hidden text-left font-mono text-xs sm:text-sm">
            <div className="bg-fd-muted/60 px-4 py-3 border-b border-fd-border flex items-center gap-2">
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-yellow-500/80" />
              <div className="size-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-fd-muted-foreground text-xs font-sans">Terminal</span>
            </div>
            <div className="p-5 space-y-2 text-fd-foreground">
              <div className="flex items-center gap-2">
                <span className="text-fd-primary">$</span>
                <span>bun add @masumdev/rn-ui</span>
              </div>
              <div className="text-fd-muted-foreground pl-4">
                Installed 55+ UI components &amp; theme engine
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-fd-primary">$</span>
                <span>bun add @masumdev/rn-tajweed-verse</span>
              </div>
              <div className="text-fd-muted-foreground pl-4">
                Added Tajweed rule parser &amp; renderer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-fd-border bg-fd-card/40 py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold text-fd-primary">55+</div>
            <div className="text-xs text-fd-muted-foreground font-medium mt-1">UI Components</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-fd-primary">20+</div>
            <div className="text-xs text-fd-muted-foreground font-medium mt-1">Tajweed Rules</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-fd-primary">100%</div>
            <div className="text-xs text-fd-muted-foreground font-medium mt-1">TypeScript Typed</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-fd-primary">0 Config</div>
            <div className="text-xs text-fd-muted-foreground font-medium mt-1">Pre-compiled Worklets</div>
          </div>
        </div>
      </section>

      {/* Libraries Grid */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Packages</h2>
          <p className="text-fd-muted-foreground">
            Independently versioned and published on npm. Install only what you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {libraries.map((lib) => (
            <Link
              key={lib.name}
              href={lib.href}
              className={`group flex flex-col justify-between rounded-2xl border p-7 transition-all duration-300 shadow-sm hover:shadow-xl ${lib.accent}`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-xl border ${lib.iconColor}`}>
                    <lib.icon size={24} />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${lib.badgeColor}`}>
                    {lib.version}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-mono font-bold text-base mb-2 group-hover:text-fd-primary transition-colors">
                  {lib.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-fd-muted-foreground mb-6 leading-relaxed">
                  {lib.description}
                </p>

                {/* Feature Pills */}
                <div className="space-y-2 mb-6">
                  {lib.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-fd-foreground font-medium">
                      <CheckCircle2 size={14} className="text-fd-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Link */}
              <div className="pt-4 border-t border-fd-border/50 flex items-center justify-between text-sm font-semibold text-fd-primary">
                <span>View Documentation</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="border-t border-fd-border bg-fd-card/30 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why @masumdev?</h2>
            <p className="text-fd-muted-foreground">
              Designed from the ground up for modern React Native &amp; Expo monorepo workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl border border-fd-border bg-fd-card shadow-xs"
              >
                <div className="size-10 rounded-xl bg-fd-primary/10 text-fd-primary flex items-center justify-center mb-4">
                  <item.icon size={20} />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-fd-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fd-border py-12 text-sm text-fd-muted-foreground">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-fd-foreground">@masumdev</span>
            <span>— Open source React Native monorepo</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="hover:text-fd-foreground transition-colors">
              Docs
            </Link>
            <Link
              href="https://github.com/masumrpg/react-native-library"
              target="_blank"
              rel="noreferrer"
              className="hover:text-fd-foreground transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
