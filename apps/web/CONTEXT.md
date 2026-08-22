# @masumdev Documentation Site — AI Context

> This file gives AI assistants and contributors a full mental model of this project.
> Updated: Aug 2026

---

## Monorepo Overview

**Stack**: Bun + Turborepo + Next.js 16 + Fumadocs UI

```
react-native-library/
├── apps/
│   ├── native/          ← Expo app (development playground)
│   └── web/             ← Next.js 16 docs site (THIS PROJECT)
├── packages/
│   ├── rn-ui/           ← @masumdev/rn-ui       v0.1.6
│   ├── rn-tajweed-verse/ ← @masumdev/rn-tajweed-verse  v0.1.1
│   └── react-native-qr-code-gen/ ← @masumdev/react-native-qr-code-gen v0.1.3
├── bunfig.toml          ← Bun linker = "hoisted" (single root node_modules)
└── package.json         ← root overrides for native RN packages
```

---

## Library 1: `@masumdev/rn-ui` (v0.1.6)

A React Native + Expo UI kit with typed theme tokens, light/dark mode, and composable components.

**Build**: `react-native-builder-bob` (not tsup) — required for Reanimated worklets pre-compilation.

**Peer deps**: `react-native`, `react-native-reanimated`, `react-native-gesture-handler`, `react-native-worklets`, `react-native-calendars`, `@gorhom/bottom-sheet`

### Theme System

```ts
import { ThemeProvider, useTheme } from '@masumdev/rn-ui';

// ThemeProviderProps
interface ThemeProviderProps {
  children: ReactNode;
  colorScheme?: 'light' | 'dark' | 'system';     // controlled
  defaultColorScheme?: 'light' | 'dark' | 'system'; // uncontrolled, default: 'system'
  themes?: { light?: Partial<Theme>; dark?: Partial<Theme> }; // custom theme tokens
  storage?: { getItem: (key: string) => ...; setItem: ... }; // AsyncStorage etc.
  storageKey?: string;                            // default: 'rn-ui-color-scheme'
  waitForStorage?: boolean;                       // default: true
  fallback?: ReactNode;                           // shown while hydrating
  onColorSchemeChange?: (scheme: 'light' | 'dark') => void;
}

// useTheme() returns:
const { colors, typography, spacing, isDark, colorScheme, setColorScheme, toggleColorScheme } = useTheme();
```

### Components (55 total)

| Component | Description |
|-----------|-------------|
| `Button` | variants: filled/outline/ghost/soft/danger; sizes: xs/sm/md/lg/xl; tones: primary/secondary/accent/success/warning/danger/info; shapes: rounded/pill/square |
| `IconButton` | Square button with icon only |
| `ButtonGroup` | Group of related buttons |
| `Badge` | Status/count indicator |
| `Avatar` | User avatar with fallback |
| `Alert` | Inline alert/notification |
| `AlertDialog` | Modal confirmation dialog |
| `Toast` | Temporary notification |
| `Card` | Content container |
| `MetricCard` | Stats/metric display card |
| `Box` | Flexible layout container |
| `Text` | Themed text with typography tokens |
| `Input` | Text input field |
| `InputGroup` | Input with prefix/suffix |
| `InputOTP` | OTP/PIN input |
| `Textarea` | Multi-line text input |
| `Label` | Form field label |
| `FormField` | Complete form field with label/error |
| `Select` | Dropdown select |
| `Combobox` | Searchable select |
| `Checkbox` | Boolean checkbox |
| `RadioGroup` | Radio button group |
| `Switch` | Toggle switch |
| `Slider` | Value range slider |
| `Progress` | Progress bar/circle |
| `Stepper` | Step-by-step numeric input |
| `Rating` | Star rating |
| `Tabs` | Tab navigation |
| `Accordion` | Expandable accordion |
| `Collapsible` | Single collapse panel |
| `Sheet` | Bottom/side drawer sheet |
| `BottomSheet` | @gorhom/bottom-sheet wrapper |
| `Popover` | Floating popover |
| `HoverCard` | Hover-triggered card |
| `DropdownMenu` | Dropdown menu |
| `ContextMenu` | Long-press context menu |
| `Command` | Command palette |
| `Divider` | Horizontal/vertical divider |
| `Breadcrumb` | Navigation breadcrumb |
| `Pagination` | Page navigation |
| `Skeleton` | Loading placeholder |
| `Empty` | Empty state display |
| `DataList` | Key-value data list |
| `Table` | Data table |
| `Timeline` | Chronological timeline |
| `Calendar` | Date picker calendar |
| `Carousel` | Swipeable carousel |
| `AspectRatio` | Aspect ratio container |
| `FloatingActionButton` | FAB button |
| `KeyboardAvoiding` | Keyboard avoidance wrapper |
| `Attachment` | File attachment display |
| `Item` | List item row |
| `Bubble` | Chat bubble |

### Icon System
```ts
type RenderIcon = ReactNode | ((props: { color: string; size: number }) => ReactNode);
// Used in: Button (leftIcon/rightIcon), IconButton, Item, etc.
```

---

## Library 2: `@masumdev/rn-tajweed-verse` (v0.1.1)

Parses and renders Quranic verses with Tajweed color-coding and interactive tooltips.

**Build**: tsup (no Reanimated, no worklets needed)

**Peer deps**: `react`, `react-native`, `expo`

**Dependencies**: `react-native-parsed-text`

### Main Component

```ts
import TajweedVerse from '@masumdev/rn-tajweed-verse';
```

### Props

```ts
// TajweedRuleConfig — per-rule style and interaction
interface TajweedRuleConfig {
  style?: StyleProp<TextStyle>;
  onPress?: (text: string, index: number) => void;
}

// TajweedConfig — all 20+ supported tajweed rules
interface TajweedConfig {
  ham_wasl?: TajweedRuleConfig;   // Hamzatul Wasl [h[...]]
  slnt?: TajweedRuleConfig;       // Silent letter [s[...]] [l[...]]
  madda_normal?: TajweedRuleConfig;
  madda_permissible?: TajweedRuleConfig;
  madda_necessary?: TajweedRuleConfig;
  qlq?: TajweedRuleConfig;        // Qalqalah
  madda_obligatory?: TajweedRuleConfig;
  ikhf_shfw?: TajweedRuleConfig;  // Ikhfa' Syafawi
  ikhf?: TajweedRuleConfig;       // Ikhfa'
  idghm_shfw?: TajweedRuleConfig; // Idgham Syafawi
  iqlb?: TajweedRuleConfig;       // Iqlb
  // ...and more
}

// Main component props
interface TajweedVerseProps {
  text: string;                    // Raw verse string with tajweed markup
  config?: TajweedConfig;          // Override per-rule styles/handlers
  style?: StyleProp<TextStyle>;    // Container text style
}
```

---

## Library 3: `@masumdev/react-native-qr-code-gen` (v0.1.3)

Customizable QR code generator for React Native & Expo using SVG.

**Build**: tsup

**Peer deps**: `react`, `react-native`, `react-native-svg`

**Dependencies**: `qrcode`

### Key Types

```ts
// Eye shape options (the 3 corner squares)
type EyeOptions = 
  | { shape: 'square'; radius?: SquareRadius; size?: EyeSize; color?; innerColor?; backgroundColor? }
  | { shape: 'circle'; size?: EyeSize; color?; innerColor?; backgroundColor? }
  | { shape?: 'dot' | 'triangle' | 'heart'; color?; innerColor?; backgroundColor? };

// Data module (dots) options  
type PieceOptions = {
  shape?: 'square' | 'dot' | 'rounded' | 'heart' | 'triangle' | 'rain';
  color?: string;
  size?: number; // multiplier, 1 = full cell
};

// Logo in center
type LogoOptions = {
  src: ImageProps['href'];        // image source
  size?: number;                  // logo size (default: 20% of QR)
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;
};

// Error correction
type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

// Built-in presets (from QR_CODE_CONFIGS constant)
// Available via: import { QR_CODE_CONFIGS } from '@masumdev/react-native-qr-code-gen'
```

---

## Docs Site (`apps/web`)

**Framework**: Next.js 16 (App Router) with Turbopack  
**Docs Engine**: Fumadocs UI + Fumadocs MDX  
**Deployed to**: Vercel or Netlify  
**Content language**: English

### Key Fumadocs Features Used
- `fumadocs-ui` — pre-built doc page components, sidebar, TOC
- `fumadocs-mdx` — MDX pipeline with Next.js, source.config.ts
- `fumadocs-docgen` — auto-generate TypeScript props tables
- `fumadocs-twoslash` — TypeScript hover types in code blocks
- `lucide-react` — icons throughout (sidebar, cards, callouts)
- Built-in full-text search (Orama)
- Dark mode (CSS variables)
- OpenGraph image generation (`/api/og`)
- `llms.txt` + `llms-full.txt` auto-generation for AI

### Content Structure

```
apps/web/content/docs/
├── meta.json
├── index.mdx                      ← docs home
├── rn-ui/                         ← @masumdev/rn-ui
│   ├── meta.json
│   ├── index.mdx
│   ├── installation.mdx
│   ├── theming.mdx
│   ├── changelog.mdx
│   └── components/
│       ├── meta.json
│       └── [one .mdx per component]
├── rn-tajweed-verse/              ← @masumdev/rn-tajweed-verse
│   ├── meta.json
│   ├── index.mdx
│   ├── installation.mdx
│   ├── usage.mdx
│   ├── tajweed-rules.mdx
│   ├── customization.mdx
│   └── changelog.mdx
└── react-native-qr-code-gen/     ← @masumdev/react-native-qr-code-gen
    ├── meta.json
    ├── index.mdx
    ├── installation.mdx
    ├── usage.mdx
    ├── customization.mdx
    ├── presets.mdx
    └── changelog.mdx
```

---

## Important Config Files

| File | Purpose |
|------|---------|
| `bunfig.toml` | `linker = "hoisted"` — all deps in root `node_modules` |
| `package.json` (root) | `overrides` for native RN packages, pins `@babel/core ^7` |
| `packages/rn-ui/babel.config.js` | Reanimated Babel plugin for worklet pre-compilation |
| `apps/native/app.json` | Expo config — splash via `expo-splash-screen` plugin |

---

## Commands

```bash
# Install all packages
bun install

# Run everything (docs + native + library watchers)
bun dev

# Run only docs site
bun dev --filter=web

# Build everything
bun run build

# Add package to specific workspace
bun add <pkg> --filter=web
```
