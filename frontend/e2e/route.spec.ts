import { test, expect } from '@playwright/test';
import { login, mockApi, MOCK_ROUTES } from './helpers';

test.describe('Route Management', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await login(page);
    await page.click('.nav-center button:has-text("Route")');
    await page.waitForURL('**/route');
  });

  test('displays the route list', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
    for (const r of MOCK_ROUTES) {
      await expect(page.locator(`text=${r.name}`)).toBeVisible();
    }
  });

  test('shows "New Route" button', async ({ page }) => {
    await expect(page.locator('button', { hasText: 'New Route' })).toBeVisible();
  });

  test('paginator is visible', async ({ page }) => {
    await expect(page.locator('mat-paginator')).toBeVisible();
  });

  test('initial API request contains pagination params', async ({ page }) => {
    const requestPromise = page.waitForRequest(
      req => req.url().includes('/api/routes') && req.method() === 'GET'
    );
    await page.reload();
    await page.waitForURL('**/route');
    const req = await requestPromise;
    const params = new URL(req.url()).searchParams;
    expect(params.get('page')).toBe('1');
    expect(params.get('pageSize')).toBeTruthy();
    expect(params.get('sortBy')).toBeTruthy();
    expect(params.get('sortDir')).toBeTruthy();
  });

  test('clicking Name sort header sends sortDir to the API', async ({ page }) => {
    await page.waitForSelector('table');

    const requestPromise = page.waitForRequest(
      req => req.url().includes('/api/routes') && req.method() === 'GET'
    );
    await page.click('th:has-text("Name")');
    const req = await requestPromise;
    const params = new URL(req.url()).searchParams;
    expect(params.get('sortBy')).toBe('name');
    expect(params.get('page')).toBe('1');
    expect(params.get('sortDir')).toBeTruthy();
  });

  test('clicking active Name header cycles sortDir asc → desc → asc', async ({ page }) => {
    await page.waitForSelector('table');
    // Default store + matSort: active column is Name, direction asc. Same-header cycle is
    // asc → desc → cleared; our handler maps cleared to asc (see RouteComponent.onSortChange).

    let requestPromise = page.waitForRequest(
      req => req.url().includes('/api/routes') && req.method() === 'GET'
    );
    await page.click('th:has-text("Name")');
    let req = await requestPromise;
    expect(new URL(req.url()).searchParams.get('sortDir')).toBe('desc');

    requestPromise = page.waitForRequest(
      req => req.url().includes('/api/routes') && req.method() === 'GET'
    );
    await page.click('th:has-text("Name")');
    req = await requestPromise;
    expect(new URL(req.url()).searchParams.get('sortDir')).toBe('asc');
  });

  test('shows error banner when routes API fails', async ({ page }) => {
    await page.route('**/api/routes**', (route) =>
      route.fulfill({ status: 500, body: '{"message":"Server error"}' })
    );
    await page.reload();
    await page.waitForURL('**/route');
    await expect(page.locator('.error-banner')).toBeVisible();
  });

  test('shows empty-state when routes list has no items', async ({ page }) => {
    await page.route('**/api/routes**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], totalCount: 0, page: 1, pageSize: 10 }),
      })
    );
    await page.reload();
    await page.waitForURL('**/route');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('text=No routes found')).toBeVisible();
  });
});
