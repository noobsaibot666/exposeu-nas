import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  cacheDir: join(tmpdir(), 'exposeu-vite-cache'),
  plugins: [
    react(),
    sitemap({
      hostname: 'https://expose-u.com',
      dynamicRoutes: [
        '/',
        '/about',
        '/contact',
        '/services/concerts-events',
        '/services/exhibition-gallery',
        '/services/artist-sessions',
        '/services/brand-agency',
      ],
    }),
  ],
})
