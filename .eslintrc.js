module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    // 'plugin:@typescript-eslint/naming-convention',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // '@typescript-eslint/max-len' : [
    //   'warn', {'code': 120}],"
    "max-len": ["error", {"code": 100, "ignoreUrls": true}],
    // '@typescript-eslint/naming-convention': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
    // '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: false }
    ],
    curly: ['error', 'all'],
    eqeqeq: 'error',
    'prefer-arrow-callback': 'error',
  }
};