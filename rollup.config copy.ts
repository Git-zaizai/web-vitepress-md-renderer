import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import * as fs from 'node:fs/promises'
import { builtinModules, createRequire } from 'node:module'
import { type RollupOptions, defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const DEV = !!process.env.DEV
const PROD = !DEV

const external = [
  // ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
  ...builtinModules.flatMap((m) =>
    m.includes('punycode') ? [] : [m, `node:${m}`]
  )
]
console.log(`🚀 ~ external:`, external)

const plugins = [
  alias({ entries: { 'readable-stream': 'stream' } }),
  replace({
    // polyfill broken browser check from bundled deps
    'navigator.userAgentData': 'undefined',
    'navigator.userAgent': 'undefined',
    preventAssignment: true
  }),
  commonjs(),
  nodeResolve({ preferBuiltins: false }),
  esbuild(),
  json()
]

const manual = {}
const exts = ['shiki']
Object.keys(pkg.dependencies).forEach((key) => {
  if (!exts.includes(key)) {
    manual[key] = [key]
  }
})

const esmBuild: RollupOptions = {
  input: ['src/index.ts'],
  output: {
    format: 'esm',
    // entryFileNames: `[name].js`,
    // chunkFileNames: 'chunk-[hash].js',
    chunkFileNames: 'js/[name].[format].[hash].js',
    dir: './dist/esm',
    sourcemap: DEV
    // 该选项将使用原始模块名作为文件名，为所有模块创建单独的 chunk
    // preserveModules: true,
    // 允许代码分割，但主入口保持统一
    // manualChunks: undefined
    // manualChunks: manual
  },
  external,
  plugins,
  onwarn(warning, warn) {
    if (warning.code !== 'EVAL') warn(warning)
  }
}

export default defineConfig([esmBuild])
