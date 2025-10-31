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

import { visualizer } from 'rollup-plugin-visualizer'

const nodeModules = builtinModules.flatMap((m) =>
  m.includes('punycode') ? [] : [m, `node:${m}`]
)

const esmBuild: RollupOptions = {
  input: './src/index.ts',
  output: {
    format: 'esm',
    dir: './dist/esm',
    chunkFileNames: 'js/[name].[format].[hash].js'
    // preserveModules: true
  },
  plugins: [
    alias({ entries: { 'readable-stream': 'stream' } }),
    commonjs(),
    esbuild(),
    json(),
    nodeResolve({ preferBuiltins: false }),
    visualizer({
      filename: './visualizer/vueBuild.html',
      // open: DEV,
      gzipSize: true,
      brotliSize: true
    })
  ],
  external: [...nodeModules]
}

const tsBuild: RollupOptions = {
  input: './src/index.ts',
  output: {
    format: 'esm',
    file: 'dist/types/index.d.ts',
    entryFileNames: '[name].d.ts', // 入口文件命名（保持原文件名，如 src/a.ts → dist/types/a.d.ts）
    chunkFileNames: '[name].d.ts' // 分块文件命名（可选，用于动态导入的模块）
  },
  plugins: [
    alias({ entries: { 'readable-stream': 'stream' } }),
    nodeResolve({ preferBuiltins: false }),
    dts({
      // 包含第三方插件的类型
      external: (id) => {
        // 排除 Node.js 内置模块
        if (nodeModules.includes(id)) {
          return true
        }
        // 其他所有模块都包含在内
        return false
      },
      // 支持生成类型声明映射文件
      tsconfig: './tsconfig.json',
      // 确保处理所有的导入
      respectExternal: false
    })
  ]
}

export default defineConfig([esmBuild, tsBuild])
