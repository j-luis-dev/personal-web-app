import { test, expect } from '@playwright/test';

test('homepage has title and hero headline', async ({ page }) => {
  await page.goto('.');

  await expect(page).toHaveTitle(/José Luis Jiménez/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('José Luis');
});

test('skip link targets main content', async ({ page }) => {
  await page.goto('.');

  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toHaveAttribute('href', '#content');
});

test('contact form validates required fields', async ({ page }) => {
  await page.goto('.');

  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('#contact-form .field.is-invalid')).toHaveCount(3);
});

test('navigation scrolls to work section', async ({ page }) => {
  await page.goto('.');

  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page.locator('#work')).toBeInViewport();
});
