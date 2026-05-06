import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  cacheDir: join(tmpdir(), 'exposeu-vite-cache'),
  plugins: [react()],
})
