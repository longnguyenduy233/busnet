/**
 * Paged GET /buses parsing and multi-page retrieval (shared by simulator CLI and tests).
 */

import { FetchHttpError } from './auth-session';

export interface Bus {
  id: string;
  name: string;
  /** From API camelCase when bus has an assigned route. */
  routeId?: string | null;
}

interface PagedBuses {
  items: Bus[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * Normalizes one JSON payload from GET /buses.
 * Legacy APIs return Bus[]; current API returns { items, totalCount, page, pageSize }.
 */
export function parseBusesPage(
  raw: unknown,
  pageSize: number
): { items: Bus[]; done: boolean } {
  if (Array.isArray(raw)) {
    return { items: raw as Bus[], done: true };
  }
  if (
    raw &&
    typeof raw === 'object' &&
    Array.isArray((raw as PagedBuses).items)
  ) {
    const body = raw as PagedBuses;
    const items = body.items;
    return { items, done: items.length < pageSize };
  }
  throw new Error(
    'Unexpected buses response shape (expected paged items or Bus[])'
  );
}

/**
 * Loads every bus across all pages (`pageSize` rows per request until a short page or legacy array).
 */
export async function fetchAllBuses(
  apiBaseUrl: string,
  token: string,
  pageSize: number,
  fetchFn: typeof fetch
): Promise<Bus[]> {
  const all: Bus[] = [];

  for (let page = 1; ; page++) {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      sortBy: 'name',
      sortDir: 'asc',
    });
    const res = await fetchFn(`${apiBaseUrl}/buses?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new FetchHttpError(`Failed to fetch buses: ${res.status}`, res.status);
    }
    const raw: unknown = await res.json();
    const { items, done } = parseBusesPage(raw, pageSize);
    all.push(...items);
    if (done) break;
  }

  return all;
}
