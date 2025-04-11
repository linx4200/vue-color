import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import pluginVueA11y from "eslint-plugin-vuejs-accessibility";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["src/**/*.{js,mjs,cjs,ts,vue}","demo/**/*.{js,mjs,cjs,ts,vue}"]},
  {ignores: ["node_modules", "dist", "coverage", "demo/dist"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  ...pluginVueA11y.configs["flat/recommended"],
  {files: ["**/*.vue"], languageOptions: {parserOptions: {parser: tseslint.parser}}},
  { "rules": {
    "vuejs-accessibility/label-has-for": [
      "error",
      {
        "components": ["VLabel"],
        "controlComponents": ["VInput"],
        "required": {
          "some": ["nesting", "id"]
        },
      }
    ]
  }
  }
];