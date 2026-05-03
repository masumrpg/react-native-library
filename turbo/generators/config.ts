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
        path: "packages/{{kebabCase name}}/src/index.ts",
        templateFile: "templates/index.ts.hbs",
      },
      // Install package ke native app
      {
        type: "modify",
        path: "apps/native/package.json",
        pattern: /(\"dependencies\": \{[^}]*)(})/,
        template: '$1,\n    "@masumdev/{{kebabCase name}}": "workspace:*"$2',
      },
    ],
  });
}
