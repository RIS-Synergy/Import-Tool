import globals from "globals";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";

export default [
  // Base configurations
  ...tseslint.configs.recommended,
  pluginImport.configs.typescript,

  // Configuration for your TypeScript files
  {
    // This is the most important part:
    // It tells ESLint to apply the following rules to all .ts files in the src folder.
    files: ["src/**/*.ts"],

    languageOptions: {
      globals: {
        ...globals.node, // Use Node.js global variables
      },
    },

    plugins: {
      import: pluginImport,
    },

    rules: {
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          // Always require .js extensions for these files
          js: 'always',
          jsx: 'always',
          // NEVER allow .ts or .tsx extensions in imports
          ts: 'never',
          tsx: 'never',
        },
      ],
      // ... other rules if you have them
    },
  },
];
