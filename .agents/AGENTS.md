# Masum Dev Monorepo — Agent Guidelines & Directives

Welcome to the **Masum Dev** React Native & Expo Library Workspace. This file serves as the main entry point and directive index for AI agents working in this codebase.

## 🏛️ Monorepo Overview

This workspace is a **Turborepo** monorepo using **Bun** workspaces for high-performance cross-platform mobile library development.

```
.
├── packages/                  # Open-source React Native & Expo libraries (@masumdev/*)
│   ├── rn-ui/                 # Typed flat UI kit (63+ components, design tokens, light/dark mode)
│   ├── rn-tajweed-verse/      # Tajweed Quranic verse parser & renderer with interactive tooltips
│   ├── react-native-qr-code-gen/ # SVG QR code generator with custom eye shapes & presets
│   └── tscheck/               # TypeScript & AST checking module
├── apps/
│   ├── native/                # Interactive Expo playground app (iOS / Android / Web)
│   └── docs/                  # Astro 5 + Starlight documentation portal (https://masum.dev)
├── scripts/                   # Workspace maintenance & audit scripts (e.g. audit-codebase.ts)
└── .agents/                   # Centralized AI rules, skills, and configuration
```

## 📑 Core Rules Index

Agents **MUST** follow all specific rules located in `.agents/rules/`:

1. [Architecture & Stack](file:///.agents/rules/architecture.md): Monorepo layout, tech stack, and branding.
2. [Contribution Workflow](file:///.agents/rules/contribution.md): Mandatory 3-Step Rule for new components/libraries, persona info, and emoji policy.
3. [Animation Guidelines](file:///.agents/rules/animation.md): Zero-bounce animation policy, gesture tracking rules.
4. [Type Safety & Audit](file:///.agents/rules/type-safety.md): Strict Zero `any` policy, 0 unused items, and `bun run audit`.
5. [Component Design System](file:///.agents/rules/component-design.md): Orthogonal `tone` vs `variant`, Base UI Props inheritance, and pluggable `renderIcon`.

---

## 🛠️ Specialized Skills

The following runbooks are available in `.agents/skills/`:

- [Component Workflow](file:///.agents/skills/component-workflow/SKILL.md): 3-step standard pipeline for implementing, showcasing, and documenting new UI components.
- [Codebase Audit](file:///.agents/skills/audit-codebase/SKILL.md): Procedure for executing AST checks and remediating typing or unused item violations.
