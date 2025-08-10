// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      // Import sorting and organization rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-in modules
            'external', // Third-party modules
            'internal', // Internal modules (relative imports)
            'parent', // Parent directory imports
            'sibling', // Sibling directory imports
            'index', // Index imports
            'object', // Object imports
            'type', // Type imports
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            // React imports first
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            // React Native imports
            {
              pattern: 'react-native',
              group: 'external',
              position: 'after',
            },
            {
              pattern: 'react-native/**',
              group: 'external',
              position: 'after',
            },
            // Expo imports
            {
              pattern: 'expo/**',
              group: 'external',
              position: 'after',
            },
            // Navigation imports
            {
              pattern: '@react-navigation/**',
              group: 'external',
              position: 'after',
            },
            // Internal absolute imports (your project structure)
            {
              pattern: '@/app/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/components/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/hooks/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/constants/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/scripts/**',
              group: 'internal',
              position: 'after',
            },
            // Relative imports
            {
              pattern: './**',
              group: 'sibling',
              position: 'after',
            },
            {
              pattern: '../**',
              group: 'parent',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'react-native'],
        },
      ],
      // Prevent duplicate imports
      'import/no-duplicates': 'error',
      // Ensure imports are at the top of the file
      'import/first': 'error',
      // Ensure newlines after import statements
      'import/newline-after-import': 'error',
      // Prevent importing from the same module multiple times
      'import/no-useless-path-segments': 'error',
      // Ensure consistent file extensions
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      // Prevent importing default as named import
      'import/no-named-as-default': 'warn',
      // Prevent importing default as default
      'import/no-named-as-default-member': 'warn',
      // Ensure proper import/export syntax
      'import/no-mutable-exports': 'error',
      // Additional formatting rules
      'import/no-absolute-path': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-unresolved': 'error',

      // Disable react-hooks/exhaustive-deps rule
      'react-hooks/exhaustive-deps': 'off',
    },
    ignores: ['dist/*', 'node_modules/*'],
  },
]);
