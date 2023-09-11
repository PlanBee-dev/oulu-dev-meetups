import { Browser, chromium } from 'playwright';
import { afterAll, beforeAll, expect, test } from 'vitest';

let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

afterAll(async () => {
  await browser.close();
});

test('main heading is set', async () => {
  const page = await browser.newPage();
  page.on('console', (msg) => console.log(msg.text()));

  await page.goto('http://localhost:3000/submit');

  expect(
    await page
      .getByRole('heading', {
        level: 1,
        name: 'Submitting your own meetup',
      })
      .isVisible(),
  ).toBeTruthy();
});
