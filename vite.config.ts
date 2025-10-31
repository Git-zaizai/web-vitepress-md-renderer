import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: './visualizer/dist_demo.html',
      gzipSize: true,
      brotliSize: true
    })
  ],
  server: {
    port: 10086
  },
  build: {
    outDir: 'dist-vite'
  }
})
