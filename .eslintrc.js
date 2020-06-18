module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
    ecmaFeatures: {
      modules: true
    },
  },
  plugins: [
    '@typescript-eslint',
    'eslint-plugin-node',
  ],
  env: {
    node: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:node/recommended',
  ],
  ignorePatterns: [
    "**/dist/*.js",
  ],
};
