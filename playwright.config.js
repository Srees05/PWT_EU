// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  // Test Location
  testDir: './tests',

  // Test Execution
  fullyParallel: true,
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },

  // CI Settings
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporting
reporter: [
  ['html', {
    outputFolder: 'reports/html-report',
    open: 'never'
  }]
],

// Common Browser Settings
use: {

  // Application URL
  baseURL: 'https://www.saucedemo.com',

  // Execution Mode
  headless: true,

  // Failure Evidence
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'on-first-retry',
},

  // Browser Projects
  projects: [

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },

  ],

  // Raw Test Results
  outputDir: 'results/',
});