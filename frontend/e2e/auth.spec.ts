import { test, expect } from '@playwright/test';
import { mockApi } from './helpers';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test('login page loads and shows title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('mat-card-title')).toBeVisible();
    await expect(page.locator('mat-card-title')).toContainText('BusNet');
  });

  test('login page has username, password fields and submit button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('input[formControlName="userName"]')).toBeVisible();
    await expect(page.locator('input[formControlName="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('successful login redirects to home', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[formControlName="userName"]', 'admin');
    await page.fill('input[formControlName="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/home');
    await expect(page).toHaveURL(/\/home/);
  });

  test('unauthenticated access redirects to login', async ({ page }) => {
    await page.goto('/buses');
    await expect(page).toHaveURL(/\/login/);
  });

  test('submit button is disabled while form is invalid', async ({ page }) => {
    await page.goto('/');
    // Leave fields empty
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});
