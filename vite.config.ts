import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { VitePWA, type VitePWAOptions } from 'vite-plugin-pwa'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  strategies: 'generateSW',
  devOptions: {
    enabled: true,
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
    runtimeCaching: [
      {
        urlPattern: ({ url }) => url.pathname.includes('/recommended-packs/'),
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'recommended-packs-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
        },
      },
    ],
    navigateFallback: 'index.html',
    skipWaiting: true,
    clientsClaim: true,
  },
  manifest: {
    name: 'TanGo',
    short_name: 'tango',
    description: '一緒に単語を覚えましょう',
    theme_color: '#FFF',
    background_color: '#EEF4FF',
    display: 'standalone',
    start_url: '/tango/',
    scope: '/tango/',
    icons: [
      {
        src: 'logos/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'logos/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA(pwaOptions)],
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
