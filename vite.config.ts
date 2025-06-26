import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

export default defineConfig({
  plugins: [react()],
  base: '/tango',
  server: {
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': `${pathResolve('src')}/`,
    },
  },
})
