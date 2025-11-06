import FastGlob from 'fast-glob'
const fileJs = FastGlob.sync(['src/**'], {
  ignore: ['**/components', '**/types', '**/snippet.ts']
})
console.log(`🚀 ~ fileJs:`, fileJs)
