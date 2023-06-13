module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  plugins: ["react"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "no-unused-vars": ["error", { varsIgnorePattern: "Window" }],
  },
  overrides: [
    {
      files: ["./**/*.{ts,tsx}"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      extends: ["plugin:@typescript-eslint/recommended-requiring-type-checking"],
      plugins: ["@typescript-eslint"],
    },
  ],
};
