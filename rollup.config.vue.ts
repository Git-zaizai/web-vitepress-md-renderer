import { builtinModules, createRequire } from 'node:module'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'

import { type RollupOptions, defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'

import vuePlugin from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import postcss from 'rollup-plugin-postcss'
import postcssImport from 'postcss-import' // 添加这一行

import path from 'node:path' // 导入 path 模块

// 定义项目根目录
const ROOT_DIR = path.resolve()
const SRC_DIR = path.join(ROOT_DIR, 'src')
const COMPONENTS_DIR = path.join(SRC_DIR, 'components')

const require = createRequire(import.meta.url)
const pkg = require('./package.json')
const DEV = !!process.env.DEV
const PROD = !DEV

const vueBuild: RollupOptions = {
  input: './src/components/index.ts',
  output: {
    format: 'esm',
    file: 'dist/esm/components/VPDoc.js',
    chunkFileNames: 'js/[name].[format].[hash].js', // 动态导入的文件存放到 dist/async 目录下
    sourcemap: process.env.NODE_ENV === 'production'
  },
  onwarn(warning, warn) {
    if (warning.code !== 'EVAL') warn(warning)
  },
  plugins: [
    alias({
      entries: {
        'readable-stream': 'stream',
        // 设置根目录别名
        '@': SRC_DIR,
        '@components': COMPONENTS_DIR,
        '@styles': path.resolve(COMPONENTS_DIR, 'styles'),
        // 修复原有的相对路径问题
        '../styles': path.resolve(COMPONENTS_DIR, 'styles')
      }
    }),
    vuePlugin(),
    nodeResolve(),
    esbuild(),
    json(),
    postcss({
      extract: true, // 确保 CSS 被提取到单独的文件
      minimize: false, // 压缩 CSS
      plugins: [
        postcssImport({
          // 配置 postcss-import 插件
          resolve(id, basedir) {
            // 处理相对路径导入
            if (id.startsWith('./') || id.startsWith('../')) {
              return path.join(path.dirname(basedir), 'styles', id)
            }
            // 对于 url() 导入，让浏览器自行处理或根据需要进行配置
            return id
          }
        })
      ]
    }),
    visualizer({
      filename: './visualizer/vueBuild.html',
      // open: DEV,
      gzipSize: true,
      brotliSize: true
    })
  ],
  external: [
    ...Object.keys(pkg.devDependencies),
    ...Object.keys(pkg.peerDependencies),
    ...Object.keys(pkg.dependencies)
  ]
}

const vueTsBuild: RollupOptions = {
  input: './dist/types/components/index.d.ts',
  output: {
    format: 'esm',
    file: 'dist/types/components.d.ts'
  },
  plugins: [
    dts({
      respectExternal: true,
      tsconfig: './tsconfig.web.json',
      compilerOptions: { preserveSymlinks: false }
    })
  ],
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
    ...Object.keys(pkg.peerDependencies)
  ]
}

export default defineConfig([vueBuild, vueTsBuild])
