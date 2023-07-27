import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  reporter: 'list',
  webServer: {
    url: 'http://localhost:3000/oulu-dev-meetups/',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,

    // Run tests against actual production build
    command: 'pnpm build && pnpm preview',
  },
  use: {
    baseURL: 'http://localhost:3000/',
  },
});
