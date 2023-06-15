module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  plugins: ["react", "import"],
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
    "prefer-const": "error",
    curly: "error",
    "import/no-cycle": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
      },
    ],
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
        },
        groups: [["builtin", "external"], "internal", "parent", ["sibling", "index"]],
        "newlines-between": "always",
      },
    ],
    "import/no-default-export": "warn",
    "react-hooks/exhaustive-deps": "error",
    "no-console": "error",
  },
  overrides: [
    {
      files: ["webpack.config.ts"],
      rules: {
        "import/no-extraneous-dependencies": "off",
        "import/no-default-export": "off",
      },
    },
    {
      files: ["./**/*.{ts,tsx}"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      plugins: ["@typescript-eslint"],
    },
  ],
};
