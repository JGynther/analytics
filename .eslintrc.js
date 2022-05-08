module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-base",
    "airbnb-typescript/base",
  ],
  env: { node: true },
  parserOptions: {
    project: ["trackers/*/tsconfig.json"],
  },
  ignorePatterns: [".eslintrc.js"],
};
