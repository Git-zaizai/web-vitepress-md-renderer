import FastGlob from 'fast-glob'
const fileJs = FastGlob.sync(['src/**'], {
  ignore: ['**/components', '**/types', '**/snippet.ts']
}).map((item) => item.replaceAll('/', '\\'))
console.log(`🚀 ~ fileJs:`, fileJs)
