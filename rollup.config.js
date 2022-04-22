import pluginTypescript from '@rollup/plugin-typescript';

const common = {
  input: 'src/index.ts',
  external: ['vitest', 'fs', 'path', 'js-yaml', 'os', '@actions/github', '@actions/core'],
  plugins: [
    pluginTypescript(),
  ],
};

export default [
  {
    ...common,
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
  },
  {
    ...common,
    output: {
      file: 'dist/index.mjs',
      format: 'es',
    },
  },
];
