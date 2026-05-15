import { test, expect, type Request } from '@playwright/test';
import { login, mockApi, MOCK_BUSES } from './helpers';

/** List GET .../routes — not POST .../routes/by-ids (tracking). */
function isRoutesListGet(req: Request): boolean {
  if (req.method() !== 'GET') return false;
  const path = new URL(req.url()).pathname.replace(/\/$/, '');
  return path.endsWith('/routes');
}
test.describe('Bus Management', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await login(page);
    await page.click('.nav-center button:has-text("Bus")');
    await page.waitForURL('**/bus');
  });

  // ── basic rendering ──────────────────────────────────────────────────────────

  test('displays the bus list', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
    for (const bus of MOCK_BUSES) {
      await expect(page.locator(`text=${bus.name}`)).toBeVisible();
    }
  });

  test('shows license plates', async ({ page }) => {
    for (const bus of MOCK_BUSES) {
      await expect(page.locator(`text=${bus.licensePlate}`)).toBeVisible();
    }
  });

  test('does not GET /api/routes on bus page reload (routes load only for assign dialog)', async ({ page }) => {
    let routeListGetCount = 0;
    const onRequest = (req: Request) => {
      if (isRoutesListGet(req)) routeListGetCount++;
    };
    page.on('request', onRequest);
    await page.reload();
    await page.waitForURL('**/bus');
    await page.waitForSelector('table');
    await expect(page.locator(`text=${MOCK_BUSES[0].name}`)).toBeVisible();
    page.off('request', onRequest);
    expect(routeListGetCount).toBe(0);
  });

  test('GET /api/routes once when opening Assign route dialog', async ({ page }) => {
    let routeListGetCount = 0;
    let lastRoutesListUrl: string | null = null;
    const onRequest = (req: Request) => {
      if (isRoutesListGet(req)) {
        routeListGetCount++;
        lastRoutesListUrl = req.url();
      }
    };
    page.on('request', onRequest);
    await page.locator('button[matTooltip="Assign Route"]').first().click();
    await expect(
      page.getByRole('heading', { name: new RegExp(`Assign Route — ${MOCK_BUSES[0].name}`) })
    ).toBeVisible();
    page.off('request', onRequest);
    expect(routeListGetCount).toBe(1);
    const reqUrl = new URL(lastRoutesListUrl!);
    expect(reqUrl.searchParams.get('page')).toBe('1');
    expect(reqUrl.searchParams.get('pageSize')).toBe('100');
    expect(reqUrl.searchParams.get('sortBy')).toBe('name');
    expect(reqUrl.searchParams.get('sortDir')).toBe('asc');
  });

  test('shows assigned route name from API without loading routes on page init', async ({ page }) => {
    await expect(page.locator('.route-chip', { hasText: 'Route North' })).toBeVisible();
  });

  test('shows "New Bus" button', async ({ page }) => {
    await expect(page.locator('button', { hasText: 'New Bus' })).toBeVisible();
  });

  // ── pagination ───────────────────────────────────────────────────────────────

  test('paginator is visible', async ({ page }) => {
    await expect(page.locator('mat-paginator')).toBeVisible();
  });

  test('initial API request contains pagination params', async ({ page }) => {
    // Navigate fresh so we can capture the first loadBuses request
    const requestPromise = page.waitForRequest(
      req => req.url().includes('/api/buses') && req.method() === 'GET'
    );
    await page.reload();
    await page.waitForURL('**/bus');
    const req = await requestPromise;
    const params = new URL(req.url()).searchParams;
    expect(params.get('page')).toBe('1');
    expect(params.get('pageSize')).toBeTruthy();
    expect(params.get('sortBy')).toBeTruthy();
    expect(params.get('sortDir')).toBeTruthy();
    // Bus admin lists all statuses; Tracking uses status=Active only.
    expect(params.get('status')).toBeNull();
  });

  test('bus list includes inactive buses from the API', async ({ page }) => {
    await expect(page.locator('text=Bus Gamma')).toBeVisible();
    await expect(page.locator('text=Inactive').first()).toBeVisible();
  });

  // ── sorting ──────────────────────────────────────────────────────────────────

  test('clicking a sort header sends sortBy and sortDir to the API', async ({ page }) => {
    await page.waitForSelector('table');

    const requestPromise = page.waitForRequest(
      req => req.url().includes('/api/buses') && req.method() === 'GET'
    );
    await page.click('th:has-text("Capacity")');
    const req = await requestPromise;

    const params = new URL(req.url()).searchParams;
    expect(params.get('sortBy')).toBe('capacity');
    expect(params.get('page')).toBe('1');  // sort resets to page 1
  });

  test('clicking the same header twice reverses sort direction', async ({ page }) => {
    await page.waitForSelector('table');

    // Use license plate column — default active sort is "name", so Name cycles differently on first click.
    let requestPromise = page.waitForRequest(
      req => req.url().includes('/api/buses') && req.method() === 'GET'
    );
    await page.click('th:has-text("License Plate")');
    let req = await requestPromise;
    expect(new URL(req.url()).searchParams.get('sortDir')).toBe('asc');

    requestPromise = page.waitForRequest(
      req => req.url().includes('/api/buses') && req.method() === 'GET'
    );
    await page.click('th:has-text("License Plate")');
    req = await requestPromise;

    const params = new URL(req.url()).searchParams;
    expect(params.get('sortBy')).toBe('licensePlate');
    expect(params.get('sortDir')).toBe('desc');
  });

  // ── error & edge cases ───────────────────────────────────────────────────────

  test('shows error banner when API fails', async ({ page }) => {
    await page.route('**/api/buses**', (route) =>
      route.fulfill({ status: 500, body: '{"message":"Server error"}' })
    );
    await page.reload();
    await page.waitForURL('**/bus');
    await expect(page.locator('.error-banner')).toBeVisible();
  });

  test('does not crash when bus list is empty', async ({ page }) => {
    await page.route('**/api/buses**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], totalCount: 0, page: 1, pageSize: 10 }),
      })
    );
    await page.reload();
    await page.waitForURL('**/bus');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('text=No buses found')).toBeVisible();
  });
});
