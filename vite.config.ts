import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/tango',
  server: {
    host: '0.0.0.0',
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': `${pathResolve('src')}/`,
    },
  },
})
