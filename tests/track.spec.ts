import { test, expect } from '@playwright/test';

test('tracking number validation', async ({ page }) => {
  await page.goto('/track');

  // Test with an invalid tracking number
  await page.fill('input[name="trackingNumber"]', 'SC123');
  await page.click('button[type="submit"]');

  // Check for the error message
  const errorMessage = await page.textContent('p[role="alert"]');
  expect(errorMessage).toContain('Please enter a valid 12-character Swift Courier tracking number');

  // Test with a valid tracking number
  await page.fill('input[name="trackingNumber"]', 'SC1234567890');
  await page.click('button[type="submit"]');

  // Check that the error message is gone and the tracking information is displayed
  const trackingInfo = await page.waitForSelector('div.tracking-info');
  expect(trackingInfo).toBeTruthy();
});
