import { Page } from '@playwright/test';

// ── Shared API mock data ───────────────────────────────────────────────────────

export const MOCK_TOKEN = 'mock-jwt-token';

export const MOCK_BUSES = [
  { id: 'bus-1', name: 'Bus Alpha', licensePlate: 'ABC-001', capacity: 40, status: 'Active',  routeId: null, routeName: null },
  { id: 'bus-2', name: 'Bus Beta',  licensePlate: 'ABC-002', capacity: 35, status: 'Active',  routeId: 'route-1', routeName: 'Route North' },
  { id: 'bus-3', name: 'Bus Gamma', licensePlate: 'ABC-003', capacity: 30, status: 'Inactive', routeId: null, routeName: null },
];

export const MOCK_ROUTES = [
  { id: 'route-1', name: 'Route North', points: [{ latitude: 10.77, longitude: 106.70 }, { latitude: 10.78, longitude: 106.71 }] },
];

// ── Mock all backend API calls ────────────────────────────────────────────────

export async function mockApi(page: Page): Promise<void> {
  // Auth
  await page.route('**/api/auth/login', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: MOCK_TOKEN,
        refreshToken: 'mock-refresh-token',
        userName: 'admin',
        displayName: 'Administrator'
      })
    })
  );

  await page.route('**/api/auth/refresh', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: MOCK_TOKEN,
        refreshToken: 'mock-refresh-token-next'
      })
    })
  );

  // Buses — GET returns PagedResult<Bus>; mirrors API status filter & paging (Tracking uses status=Active).
  await page.route('**/api/buses**', (route) => {
    if (route.request().method() === 'GET') {
      const url = new URL(route.request().url());
      let items = [...MOCK_BUSES];
      const statusFilter = url.searchParams.get('status');
      if (statusFilter === 'Active') {
        items = items.filter((b) => b.status === 'Active');
      } else if (statusFilter === 'Inactive') {
        items = items.filter((b) => b.status === 'Inactive');
      }

      const pageNum = parseInt(url.searchParams.get('page') || '1', 10);
      const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
      const start = (Math.max(1, pageNum) - 1) * Math.max(1, pageSize);
      const pageItems = items.slice(start, start + pageSize);

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: pageItems,
          totalCount: items.length,
          page: Math.max(1, pageNum),
          pageSize: Math.max(1, pageSize),
        }),
      });
    }
    return route.continue();
  });

  // Routes — GET returns PagedResult<Route> to match server-side pagination API
  await page.route('**/api/routes**', (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: MOCK_ROUTES,
          totalCount: MOCK_ROUTES.length,
          page: 1,
          pageSize: 10,
        }),
      });
    }
    return route.continue();
  });

  // Block SignalR WebSocket (so no connection errors in tests)
  await page.route('**/hubs/tracking**', (route) => route.abort());
}

/** Log in through the UI and wait for the home page. */
export async function login(page: Page): Promise<void> {
  await page.goto('/');
  await page.fill('input[formControlName="userName"]', 'admin');
  await page.fill('input[formControlName="password"]', 'Admin@123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/home');
}
