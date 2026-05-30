import prettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['src/**/*.js'],
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off'
    }
  },
  {
    ignores: ['dist/', 'node_modules/', 'public/']
  }
];
