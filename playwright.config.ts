import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 8000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'off',
    screenshot: 'only-on-failure',
    channel: 'chrome',
    headless: true,
  },
  projects: [
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter @akaytheory/api dev',
      port: 4000,
      timeout: 30000,
      reuseExistingServer: true,
    },
    {
      command: 'pnpm --filter @akaytheory/web dev',
      port: 5173,
      timeout: 30000,
      reuseExistingServer: true,
    },
  ],
});
