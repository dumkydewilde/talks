import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:3040',
    viewport: { width: 1440, height: 900 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npx vite preview --host 127.0.0.1 --port 3040 --strictPort',
    url: 'http://127.0.0.1:3040',
    reuseExistingServer: !process.env.CI,
  },
})
