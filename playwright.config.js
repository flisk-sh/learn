import { defineConfig } from '@playwright/test';

// Runs against the live site by default; set BASE_URL to test a local or preview build.
// Uses the installed Google Chrome, so no browser download is needed.
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: process.env.BASE_URL || 'https://learn.flisk.si', channel: 'chrome', trace: 'on-first-retry' },
});
