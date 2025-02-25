import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByText('Forms').click();
  await page.getByText('Form Layouts').click();
});

test('Locator syntax rules', async ({ page }) => {
  // by Tag name
  await page.locator('input').first().click();

  // by ID
  page.locator('#inputEmail1');

  // by class name
  page.locator('.shape-rectangle');

  // by attribute
  page.locator('[placeholder="Email"]');

  // by Class value (full)
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

  // combine different selectors
  page.locator('input[placeholder="Email"]');
  page.locator('input[placeholder="Email"].shape-rectangle');
  page.locator('input[placeholder="Email"].shape-rectangle#inputEmail1');

  // by XPath (not recommended)
  page.locator('//*[@id="inputEmail1"]');

  // by partial text match
  page.locator(':text("Using")');

  // by exact text match
  page.locator(':text-is("Using the Grid")');
});


test('User facing locators', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Email' }).first().click();
  await page.getByRole('button', { name: 'Sign in' }).first().click();

  await page.getByLabel('Email').first().click();

  await page.getByPlaceholder('Jane Doe').click();

  await page.getByText('Using the Grid').click();

  await page.getByTestId('SignIn').click();

  // await page.getByTitle('IoT Dashboard').click();
});

test('locating child elements', async ({ page }) => {
  // by locator chain
  await page.locator('nb-card nb-radio :text-is("Option 1")').click();
  await page.locator('nb-card')
    .locator('nb-radio')
    .locator(':text-is("Option 2")').click();

  // by locator chain with getByRole
  await page.locator('nb-card').getByRole('button', { name: 'Sign in' }).first().click();

  // by locator chain with nth and getByRole
  await page.locator('nb-card').nth(3).getByRole('button').click();
});

test('locating parent elements', async ({ page }) => {
  const card = await page.locator('nb-card', { hasText: 'Using the Grid' });
  await card.click();
  await card.getByRole('textbox', { name: 'Email' }).click();

  await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: 'Email' }).click();

  await page.locator('nb-card').filter({ hasText: 'Basic form' }).getByRole('textbox', { name: 'Email' }).click();
  await page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: 'Password' }).click();

  await page.locator('nb-card').filter({ has: page.locator('nb-checkbox') })
    .filter({ hasText: 'Sign in' }).getByRole('textbox', { name: 'Email' }).click();

  await page.locator(':text-is("Using the Grid")')
    .locator('..')
    .getByRole('textbox', { name: 'Email' }).click();

});

test('Reusing locators', async ({ page }) => {
  const basicForm = page.locator('nb-card').filter({ hasText: 'Basic Form' });
  const emailField = basicForm.getByRole('textbox', { name: 'Email' });
  const passwordField = basicForm.getByRole('textbox', { name: 'Password' });
  const signInButton = basicForm.getByRole('button');

  await emailField.fill('test@test.com');
  await passwordField.fill('123456');
  await signInButton.click();

  await expect(emailField).toHaveValue('test@test.com');
  await expect(passwordField).toHaveValue('123456');
});

test('extracting values', async ({ page }) => {
  // single test value
  const basicForm = page.locator('nb-card').filter({ hasText: 'Basic Form' });
  const buttonText = await basicForm.locator('button').textContent();
  expect(buttonText).toEqual('Submit');

  // all test values
  const allRadioButtonLabels = await page.locator('nb-radio').allTextContents();
  console.log(allRadioButtonLabels);
  expect(allRadioButtonLabels).toContain('Option 1');

  //input value
  const emailField = basicForm.getByRole('textbox', { name: 'Email' });
  await emailField.fill('test@test.com');;
  const emailValue = await emailField.inputValue();
  expect(emailValue).toEqual('test@test.com');

  // attribute value
  const emailFieldPlaceholder = await emailField.getAttribute('placeholder');
  expect(emailFieldPlaceholder).toEqual('Email');
});
