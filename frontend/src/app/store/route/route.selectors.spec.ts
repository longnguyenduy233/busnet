import { describe, expect, it } from 'vitest';
import { Route } from '../../core/models/route.model';
import { routeAdapter, RouteState } from './route.reducer';
import {
  selectAllRoutes, selectRouteError, selectRouteLoading,
  selectRoutePage, selectRoutePageSize, selectRoutePagination,
  selectRouteSortBy, selectRouteSortDir, selectRouteTotal
} from './route.selectors';

// ── helpers ───────────────────────────────────────────────────────────────────

const defaultPagination = {
  total: 0, page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc' as const,
};

const makeRoute = (id: string): Route => ({
  id, name: `Route ${id}`, points: [{ latitude: 10, longitude: 106, order: 0 }],
});

const buildState = (partial: Partial<RouteState> = {}) => ({
  routes: routeAdapter.getInitialState({ loading: false, error: null, ...defaultPagination, ...partial })
});

const withRoutes = (...routes: Route[]) => ({
  routes: routeAdapter.setAll(
    routes,
    routeAdapter.getInitialState({ loading: false, error: null, ...defaultPagination })
  )
});

// ── entity selectors ──────────────────────────────────────────────────────────

describe('selectAllRoutes', () => {
  it('returns empty array when no routes', () => {
    expect(selectAllRoutes(buildState())).toEqual([]);
  });

  it('returns all routes', () => {
    expect(selectAllRoutes(withRoutes(makeRoute('1'), makeRoute('2')))).toHaveLength(2);
  });
});

describe('selectRouteLoading', () => {
  it('reflects loading flag', () => {
    expect(selectRouteLoading(buildState({ loading: true }))).toBe(true);
    expect(selectRouteLoading(buildState({ loading: false }))).toBe(false);
  });
});

describe('selectRouteError', () => {
  it('reflects error string', () => {
    expect(selectRouteError(buildState({ error: 'oops' }))).toBe('oops');
    expect(selectRouteError(buildState({ error: null }))).toBeNull();
  });
});

// ── pagination selectors ──────────────────────────────────────────────────────

describe('selectRouteTotal', () => {
  it('returns default 0', () => {
    expect(selectRouteTotal(buildState())).toBe(0);
  });

  it('returns stored total', () => {
    expect(selectRouteTotal(buildState({ total: 99 }))).toBe(99);
  });
});

describe('selectRoutePage', () => {
  it('returns default 1', () => {
    expect(selectRoutePage(buildState())).toBe(1);
  });

  it('returns stored page', () => {
    expect(selectRoutePage(buildState({ page: 4 }))).toBe(4);
  });
});

describe('selectRoutePageSize', () => {
  it('returns default 10', () => {
    expect(selectRoutePageSize(buildState())).toBe(10);
  });

  it('returns stored pageSize', () => {
    expect(selectRoutePageSize(buildState({ pageSize: 25 }))).toBe(25);
  });
});

describe('selectRouteSortBy', () => {
  it('returns default "name"', () => {
    expect(selectRouteSortBy(buildState())).toBe('name');
  });
});

describe('selectRouteSortDir', () => {
  it('returns default "asc"', () => {
    expect(selectRouteSortDir(buildState())).toBe('asc');
  });

  it('returns stored sortDir', () => {
    expect(selectRouteSortDir(buildState({ sortDir: 'desc' }))).toBe('desc');
  });
});

describe('selectRoutePagination', () => {
  it('returns all four pagination fields', () => {
    expect(selectRoutePagination(buildState({ page: 3, pageSize: 5, sortBy: 'name', sortDir: 'desc' }))).toEqual({
      page: 3, pageSize: 5, sortBy: 'name', sortDir: 'desc',
    });
  });

  it('returns defaults when untouched', () => {
    expect(selectRoutePagination(buildState())).toEqual({
      page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc',
    });
  });
});
