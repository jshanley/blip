import pkg from './package.json';

export default {
  input: 'tmp/blip.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
    { file: pkg.browser, format: 'umd', name: 'blip' },
  ],
  sourcemap: true,
}
