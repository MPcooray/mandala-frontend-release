import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', // Look for tests in the 'e2e' directory
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
    // Set the base URL for your application
    baseURL: 'http://localhost:3000', // Adjust if your app runs on a different port or domain
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // You can add other browsers like Firefox and WebKit here
    // { 
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // { 
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  webServer: {
    command: 'npm run dev', // Command to start your development server
    url: 'http://localhost:3000', // URL to wait for before running tests
    reuseExistingServer: !process.env.CI,
  },
}); 