import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

/**** Note: keep externals lean to avoid bundling react ****/
const external = ['react', 'react-dom'];

export default {
  input: 'src/index.ts',
  external,
  output: [
    { file: 'dist/index.esm.js', format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs', format: 'cjs', sourcemap: true }
  ],
  plugins: [nodeResolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' })]
};