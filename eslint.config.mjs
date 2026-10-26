import { defineConfig } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default defineConfig([
  { ignores: ["node_modules", "main.js", "coverage", "src/data/*.generated.ts"] },
  ...obsidianmd.configs.recommended,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ["*.mjs", "scripts/*.mjs"] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Build scripts run on Node; the Obsidian runtime rules only apply to src/.
    files: ["**/*.mjs"],
    languageOptions: { globals: globals.node },
    rules: { "obsidianmd/no-nodejs-modules": "off", "obsidianmd/rule-custom-message": "off" },
  },
  {
    // The declarative settings API needs Obsidian 1.13+, but minAppVersion is 1.5.0.
    rules: { "obsidianmd/settings-tab/prefer-setting-definitions": "off" },
  },
  {
    files: ["src/core/**", "src/providers/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [{ name: "obsidian", message: "Core and providers must not depend on Obsidian." }],
        },
      ],
    },
  },
]);
