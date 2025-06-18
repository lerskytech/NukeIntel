import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Fix platform compatibility issues
      external: [
        '@rollup/rollup-android-arm-eabi',
        '@rollup/rollup-android-arm64',
        '@rollup/rollup-darwin-arm64',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-linux-arm-gnueabihf',
        '@rollup/rollup-linux-arm64-gnu',
        '@rollup/rollup-linux-arm64-musl',
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-linux-x64-musl',
        '@rollup/rollup-win32-arm64-msvc',
        '@rollup/rollup-win32-ia32-msvc',
        '@rollup/rollup-win32-x64-msvc'
      ]
    }
  }
})
