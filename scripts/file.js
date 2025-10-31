import fs from 'fs-extra'
import path from 'path'
import { sync as rimrafSync } from 'rimraf'

const srcDir = path.resolve(import.meta.dirname, '../src/components/fonts')
const distDir = path.resolve(import.meta.dirname, '../dist/esm/fonts')
fs.copySync(srcDir, distDir)

rimrafSync(path.resolve(import.meta.dirname, '../dist/types/components'))
