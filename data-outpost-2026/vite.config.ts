import { defineConfig } from 'vite'

// Lets the dev server be previewed over Tailscale (`tailscale serve`).
export default defineConfig({
  server: { allowedHosts: ['.ts.net'] },
})
