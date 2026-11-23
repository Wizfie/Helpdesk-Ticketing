import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Browser Testing Configuration
 * PT Global Transformasi Teknologi (GTT) - Helpdesk & Ticketing System
 */
export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './tests/e2e-artifacts',
  timeout: 30 * 1000,
  expect: {
    timeout: 7000
  },
  fullyParallel: false,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/e2e-report', open: 'never' }]
  ],
  use: {
    baseURL: 'http://localhost:5176',
    channel: 'chrome',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'off',
    headless: true
  },
  projects: [
    {
      name: 'Google Chrome Desktop',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      }
    }
  ],
  webServer: {
    command: 'npm --prefix frontend run preview -- --port 5176',
    port: 5176,
    reuseExistingServer: true,
    timeout: 60 * 1000
  }
});
