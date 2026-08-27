import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("expo-package", {
    description: "Generate new Expo module package and install to native app",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the new package?",
        validate: (input) => {
          if (!input) return "Package name is required";
          if (input.includes(" ")) return "Package name cannot contain spaces";
          return true;
        },
      },
    ],
    actions: [
      // Buat package baru
      {
        type: "add",
        path: "packages/{{kebabCase name}}/package.json",
        templateFile: "templates/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/tsconfig.json",
        templateFile: "templates/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/tsconfig.build.json",
        templateFile: "templates/tsconfig.build.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/tsup.config.ts",
        templateFile: "templates/tsup.config.ts.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/src/{{pascalCase name}}.tsx",
        templateFile: "templates/component.tsx.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/src/index.tsx",
        templateFile: "templates/index.ts.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/README.md",
        templateFile: "templates/README.md.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/LICENSE",
        templateFile: "templates/LICENSE.hbs",
      },
      // Install package ke native app
      {
        type: "modify",
        path: "apps/native/package.json",
        pattern: /("dependencies":\s*\{[\s\S]*?)(\n\s*\})/,
        template: '$1,\n    "@masumdev/{{kebabCase name}}": "workspace:*"$2',
      },
      {
        type: "modify",
        path: "apps/native/tsconfig.json",
        pattern: /("paths":\s*\{[\s\S]*?)(\n\s*\})/,
        template: '$1,\n      "@masumdev/{{kebabCase name}}": ["../../packages/{{kebabCase name}}/src"]$2',
      },
    ],
  });

  plop.setGenerator("cli-package", {
    description: "Generate new Node/CLI package and create playground in apps/cli",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the new CLI package?",
        validate: (input) => {
          if (!input) return "Package name is required";
          if (input.includes(" ")) return "Package name cannot contain spaces";
          return true;
        },
      },
    ],
    actions: [
      // Create package in packages/
      {
        type: "add",
        path: "packages/{{kebabCase name}}/package.json",
        templateFile: "templates/package.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/tsconfig.json",
        templateFile: "templates/tsconfig.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/tsconfig.build.json",
        templateFile: "templates/tsconfig.build.json.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/tsup.config.ts",
        templateFile: "templates/tsup.config.ts.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/src/index.ts",
        templateFile: "templates/index.ts.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/README.md",
        templateFile: "templates/README.md.hbs",
      },
      {
        type: "add",
        path: "packages/{{kebabCase name}}/LICENSE",
        templateFile: "templates/LICENSE.hbs",
      },
      // Create playground in apps/cli/
      {
        type: "add",
        path: "apps/cli/{{kebabCase name}}/package.json",
        template: JSON.stringify(
          {
            name: "{{kebabCase name}}-playground",
            version: "1.0.0",
            private: true,
            type: "module",
            scripts: {
              run: "bun ../../../packages/{{kebabCase name}}/dist/cli.mjs",
            },
            dependencies: {
              "@masumdev/{{kebabCase name}}": "workspace:*",
            },
            devDependencies: {
              typescript: "^5.7.3",
            },
          },
          null,
          2
        ),
      },
    ],
  });
}
