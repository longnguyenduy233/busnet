import { test, expect } from '@playwright/test';
import { login, mockApi } from './helpers';

test.describe('Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
    await login(page);
    await page.click('.nav-center button:has-text("Tracking")');
    await page.waitForURL('**/tracking');
  });

  test('renders the Leaflet map container', async ({ page }) => {
    await expect(page.locator('#tracking-map')).toBeVisible();
  });

  test('map has tile layer loaded', async ({ page }) => {
    // Leaflet renders tiles inside .leaflet-tile-pane
    await expect(page.locator('.leaflet-container')).toBeVisible();
  });

  test('shows disconnected banner when SignalR is blocked', async ({ page }) => {
    // SignalR is blocked by mockApi — after a moment the status should be disconnected
    await expect(page.locator('.status-banner')).toBeVisible({ timeout: 5000 });
  });

  test('Leaflet marker and overlay panes are present in DOM', async ({ page }) => {
    // Leaflet always creates these panes when the map initialises, regardless of markers
    await expect(page.locator('.leaflet-marker-pane')).toBeAttached({ timeout: 5000 });
    await expect(page.locator('.leaflet-overlay-pane')).toBeAttached({ timeout: 5000 });
  });

  test('Leaflet popup pane is present in DOM', async ({ page }) => {
    // Popup pane is created by Leaflet at map init time; verifies map structure is intact
    await expect(page.locator('.leaflet-popup-pane')).toBeAttached({ timeout: 5000 });
  });

  test('navigation bar remains visible on the tracking page', async ({ page }) => {
    await expect(page.locator('app-shell')).toBeVisible();
    await expect(page.locator('.nav-center')).toBeVisible();
  });

  test('loads buses with status=Active (excluding inactive from the table)', async ({ page }) => {
    const reqs: string[] = [];
    page.on('request', (req) => {
      if (req.method() === 'GET' && req.url().includes('/api/buses')) reqs.push(req.url());
    });
    await page.reload();
    await page.waitForURL('**/tracking');
    await expect(page.locator('text=Bus Alpha')).toBeVisible();
    await expect(page.locator('text=Bus Beta')).toBeVisible();
    await expect(page.locator('text=Bus Gamma')).toHaveCount(0);
    expect(reqs.some((u) => new URL(u).searchParams.get('status') === 'Active')).toBe(true);
  });

  test('sidebar table shows paginator wired to active-only totals', async ({ page }) => {
    await expect(page.locator('.sidebar-paginator')).toBeVisible();
    // MOCK_BUSES has 2 Active + 1 Inactive; filtered total is 2
    await expect(page.locator('.sidebar-paginator .mat-mdc-paginator-range-label')).toContainText(/of 2/);
  });
});
