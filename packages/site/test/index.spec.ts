import { test, expect } from '@playwright/test';

test('meta is correct', async ({ page }) => {
  await page.goto('http://localhost:3000/oulu-dev-meetups/');

  await expect(page).toHaveTitle('Oulu developer meetups');
});

test('main heading is set', async ({ page }) => {
  await page.goto('http://localhost:3000/oulu-dev-meetups/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Oulu developer meetups',
    }),
  ).toBeVisible();
});
