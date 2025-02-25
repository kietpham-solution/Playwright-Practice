import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto('http://uitestingplayground.com/ajax');
  await page.getByText('Button Triggering AJAX Request').click();
  testInfo.setTimeout(testInfo.timeout + 8000);
});

test('auto waiting', async ({ page }) => {
  const successButton = page.locator('.bg-success');

  await successButton.click();

  // const text = await successButton.textContent();
  // await successButton.waitFor({ state: 'attached' });
  // const text = await successButton.allTextContents();

  // expect(text).toContain('Data loaded with AJAX get request.');

  await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 });
});

test('alternative waits', async ({ page }) => {
  const successButton = page.locator('.bg-success');

  //___ wait for element
  await page.waitForSelector('.bg-success');

  //___ wait for particular response
  // await page.waitForResponse('http://uitestingplayground.com/ajaxdata');

  //___ wait for network calls to be completed ('NOT RECOMMENDED')
  // await page.waitForLoadState('networkidle');


  const text = await successButton.allTextContents();
  expect(text).toContain('Data loaded with AJAX get request.');
});

test('timeouts', async ({ page }) => {
  // test.setTimeout(20000);
  // test.slow();
  const successButton = page.locator('.bg-success');
  await successButton.click();
});
