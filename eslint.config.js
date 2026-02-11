const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },

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

            {
              pattern: 'expo/**',
              group: 'external',
              position: 'after',
            },

            {
              pattern: '@react-navigation/**',
              group: 'external',
              position: 'after',
            },

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

      'import/no-duplicates': 'error',

      'import/first': 'error',

      'import/newline-after-import': 'error',

      'import/no-useless-path-segments': 'error',

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

      'import/no-named-as-default': 'warn',

      'import/no-named-as-default-member': 'warn',

      'import/no-mutable-exports': 'error',

      'import/no-absolute-path': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/no-unresolved': 'error',

      'react-hooks/exhaustive-deps': 'off',
    },
    ignores: ['dist/*', 'node_modules/*'],
  },
]);
