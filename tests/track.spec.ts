import { test, expect } from '@playwright/test';

test('tracking number validation', async ({ page }) => {
  await page.goto('/tracking');

  // Test with an invalid tracking number
  await page.fill('input[id="tracking-input"]', 'SC123');
  await page.click('button:has-text("Track Package")');

  // Check for the error message
  const errorMessage = await page.textContent('div[role="alert"]');
  expect(errorMessage).toContain('Please enter a valid 12-character Swift Courier tracking number');

  // Test with a valid tracking number
  await page.fill('input[id="tracking-input"]', 'SC1234567890');
  await page.click('button:has-text("Track Package")');

  // Check that the error message is gone and the tracking information is displayed
  const trackingInfo = await page.waitForSelector('text=/Tracking Number: SC1234567890/i');
  expect(trackingInfo).toBeTruthy();
});
