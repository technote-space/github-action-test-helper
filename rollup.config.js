import pluginTypescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.mjs',
    format: 'es',
  },
  external: ['vitest', 'fs', 'path', 'js-yaml', 'os', '@actions/github', '@actions/core'],
  plugins: [
    pluginTypescript(),
  ],
};
