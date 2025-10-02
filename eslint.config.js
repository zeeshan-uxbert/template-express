import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import securityPlugin from 'eslint-plugin-security';
import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import nodePlugin from 'eslint-plugin-n';
import globals from 'globals';

/**
 * Comprehensive ESLint configuration for Express.js/Node.js boilerplate
 *
 * Features:
 * - Modern JavaScript/ES6+ standards
 * - Node.js best practices
 * - Import/export management
 * - Promise/async best practices
 * - Security vulnerability detection
 * - Bug prevention rules
 *
 * This configuration provides a solid foundation while remaining extensible.
 * Teams can customize rules based on their specific requirements.
 */
export default [
  // Base recommended configurations
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  promisePlugin.configs['flat/recommended'],
  securityPlugin.configs.recommended,

  // Main configuration
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },

    plugins: {
      n: nodePlugin,
    },

    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.json'],
        },
      },
    },

    rules: {
      // ============================================
      // Modern JavaScript (ES6+)
      // ============================================
      'no-var': 'error',
      'prefer-const': 'warn',
      'prefer-arrow-callback': ['warn', { allowNamedFunctions: true }],
      'prefer-template': 'warn',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'object-shorthand': ['warn', 'always'],
      'no-useless-constructor': 'warn',

      // ============================================
      // Bug Prevention
      // ============================================
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-debugger': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-inner-declarations': 'error',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'warn',
      'require-atomic-updates': 'warn',
      'array-callback-return': 'error',
      'no-constructor-return': 'error',
      'no-duplicate-imports': 'error',
      'no-promise-executor-return': 'error',

      // ============================================
      // Best Practices
      // ============================================
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['warn', 'all'],
      'default-case-last': 'error',
      'no-else-return': ['warn', { allowElseIf: false }],
      'no-lonely-if': 'warn',
      'no-useless-return': 'warn',
      'no-useless-concat': 'warn',
      'prefer-promise-reject-errors': 'error',
      'no-throw-literal': 'error',
      'no-shadow': ['warn', { builtinGlobals: false, hoist: 'all' }],
      'no-param-reassign': ['warn', { props: false }],
      'consistent-return': 'off', // Disabled for Express middleware patterns

      // ============================================
      // Async/Await & Promises
      // ============================================
      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'warn',
      'require-await': 'warn',
      'promise/always-return': 'off', // Too strict for Express handlers
      'promise/catch-or-return': ['warn', { allowFinally: true }],

      // ============================================
      // Node.js Specific
      // ============================================
      'n/no-deprecated-api': 'error',
      'n/no-missing-import': 'off', // Handled by import plugin
      'n/no-missing-require': 'off', // Using ES modules
      'n/no-unpublished-import': 'off', // Common in boilerplates
      'n/no-unsupported-features/es-syntax': 'off', // Using modern Node.js
      'n/prefer-global/buffer': ['error', 'always'],
      'n/prefer-global/console': ['error', 'always'],
      'n/prefer-global/process': ['error', 'always'],
      'n/prefer-promises/dns': 'error',
      'n/prefer-promises/fs': 'error',

      // ============================================
      // Import/Export Management
      // ============================================
      'import/no-unresolved': 'off', // Too strict, handled by Node.js resolution
      'import/named': 'off',
      'import/namespace': 'off',
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/order': [
        'warn',
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
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'error',
      'import/no-cycle': 'warn',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'warn',
      'sort-imports': [
        'warn',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      // ============================================
      // Security
      // ============================================
      'security/detect-object-injection': 'off', // Too many false positives
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-non-literal-fs-filename': 'off', // Common in backend
      'security/detect-unsafe-regex': 'warn',

      // ============================================
      // Console & Debugging (allowed for server)
      // ============================================
      'no-console': 'off',
    },
  },

  // Prettier must be last to override conflicting rules
  prettier,

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      '.husky/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.config.js',
      'swagger.json',
      'logs/**',
      '.git/**',
    ],
  },
];
