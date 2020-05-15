import autoExternal from 'rollup-plugin-auto-external';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'server/init.ts',
  output: {
    file: 'dist/server.js',
    format: 'cjs',
  },
  plugins: [
    typescript({
      tsconfig: 'server/tsconfig.json',
      module: 'esnext',
    }),
    autoExternal(),
  ],
};
