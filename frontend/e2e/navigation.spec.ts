import { test, expect } from '@playwright/test';
import { login, mockApi } from './helpers';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await login(page);
  });

  test('home page shows the navigation bar', async ({ page }) => {
    await expect(page.locator('app-shell')).toBeVisible();
  });

  test('nav bar has Bus, Route and Tracking links', async ({ page }) => {
    const nav = page.locator('.nav-center');
    await expect(nav.locator('button', { hasText: 'Bus' })).toBeVisible();
    await expect(nav.locator('button', { hasText: 'Route' })).toBeVisible();
    await expect(nav.locator('button', { hasText: 'Tracking' })).toBeVisible();
  });

  test('navigates to Bus page via nav link', async ({ page }) => {
    await page.click('.nav-center button:has-text("Bus")');
    await page.waitForURL('**/bus');
    await expect(page.locator('h1')).toContainText('Bus Management');
  });

  test('navigates to Route page via nav link', async ({ page }) => {
    await page.click('.nav-center button:has-text("Route")');
    await page.waitForURL('**/route');
    await expect(page.locator('h1')).toContainText('Route Management');
  });

  test('navigates to Tracking page via nav link', async ({ page }) => {
    await page.click('.nav-center button:has-text("Tracking")');
    await page.waitForURL('**/tracking');
    await expect(page.locator('#tracking-map')).toBeVisible();
  });
});
