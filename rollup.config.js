import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { readFileSync } from 'fs'
import typescript from 'rollup-plugin-typescript2'

const tsConfig = readFileSync('./tsconfig.json', 'utf-8')

export default {
  input: './index.ts',
  output: [
    {
      preserveModules: true,
      dir: 'dist/cjs',
      format: 'cjs',
      entryFileNames: '[name].cjs',
    },
    {
      preserveModules: true,
      dir: 'dist/esm',
      format: 'esm',
    },
    {
      format: 'es',
      file: 'dist/browser/index.js',
    },
  ],
  plugins: [resolve(), commonjs(), typescript(tsConfig)],
}
