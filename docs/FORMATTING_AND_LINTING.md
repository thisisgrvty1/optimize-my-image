# Formatting, Linting, and Coding Standards

This document describes the coding standards, formatting guidelines, and linting practices for the "Optimize my Image" project. Adhering to these standards ensures code consistency, readability, and maintainability.

## General Style Guide

-   **Language**: The project is written in **TypeScript**. Use modern JavaScript features (ES6+) where appropriate.
-   **Framework**: **React 19** with functional components and hooks is used exclusively. Avoid class components.
-   **Component Naming**: Component files and the components themselves should use **PascalCase** (e.g., `ImageEditor.tsx`).
-   **File Naming**: Non-component files (hooks, utils, services) should use **camelCase** (e.g., `imageService.ts`).
-   **Imports**: Organize imports at the top of the file in the following order:
    1.  React imports (`import React from 'react'`).
    2.  External library imports.
    3.  Internal absolute imports (components, types, etc.).
    4.  Relative imports (`./`, `../`).

## Formatting

While a `prettierrc` file is not included in the project, we recommend using **Prettier** with its default settings to automatically format the code. This eliminates debates over style and keeps the codebase uniform.

A typical Prettier configuration would look like this (`.prettierrc`):

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always"
}
```

## Linting

We recommend using **ESLint** to identify and fix problems in the code. A good ESLint setup would include the following plugins:

-   `eslint-plugin-react`: Enforces React best practices.
-   `eslint-plugin-react-hooks`: Enforces the Rules of Hooks.
-   `@typescript-eslint/eslint-plugin`: Provides TypeScript-specific linting rules.
-   `eslint-plugin-jsx-a11y`: Checks for accessibility issues in JSX.

An example `.eslintrc.js` configuration:

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'jsx-a11y'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Add custom rules here
  },
};
```

## CSS and Styling

-   **Utility-First CSS**: The project primarily uses **Tailwind CSS** for styling. Use Tailwind's utility classes directly in the JSX.
-   **Custom CSS**: For complex styles, animations, and theming, custom CSS is placed within the `<style>` tag in `index.html`.
-   **Theming**: All custom styles should use the CSS variables defined for the theming system (e.g., `color: rgb(var(--color-primary-light))`) to ensure they adapt to theme and mode changes.