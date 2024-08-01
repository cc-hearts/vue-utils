import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { readFileSync } from 'fs'
import typescript from 'rollup-plugin-typescript2'

const tsConfig = readFileSync('./tsconfig.json', 'utf-8')

export default {
  input: './index.ts',
  output: [
    {
      dir: 'dist/cjs',
      format: 'cjs',
    },
    {
      dir: 'dist/esm',
      format: 'esm',
    },
    {
      format: 'es',
      file: 'dist/browser/index.js',
    },
  ],
  external: ['vue'],
  plugins: [resolve(), commonjs(), typescript(tsConfig)],
}
