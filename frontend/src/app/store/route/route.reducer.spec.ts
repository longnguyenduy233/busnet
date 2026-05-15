import { describe, expect, it } from 'vitest';
import { Route } from '../../core/models/route.model';
import {
  createRouteSuccess, deleteRouteSuccess,
  loadRoutes, loadRoutesFailure, loadRoutesSuccess,
  updateRouteSuccess
} from './route.actions';
import { routeAdapter, routeReducer, RouteState } from './route.reducer';

// ── helpers ───────────────────────────────────────────────────────────────────

const initialState: RouteState = routeAdapter.getInitialState({
  loading: false, error: null,
  total: 0, page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc' as const,
});

const defaultParams = { page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc' as const };

const makeRoute = (id = 'r-1', name = 'Route A'): Route => ({
  id, name, points: [{ latitude: 10, longitude: 106, order: 0 }],
});

const makeSuccess = (routes: Route[], overrides = {}) =>
  loadRoutesSuccess({ routes, total: routes.length, ...defaultParams, ...overrides });

// ── loadRoutes ────────────────────────────────────────────────────────────────

describe('routeReducer — loadRoutes', () => {
  it('sets loading=true and clears error', () => {
    const state = routeReducer({ ...initialState, error: 'old' }, loadRoutes(defaultParams));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores pagination params when loading', () => {
    const state = routeReducer(initialState, loadRoutes({ page: 2, pageSize: 5, sortBy: 'name', sortDir: 'desc' }));
    expect(state.page).toBe(2);
    expect(state.pageSize).toBe(5);
    expect(state.sortDir).toBe('desc');
  });
});

// ── loadRoutesSuccess ─────────────────────────────────────────────────────────

describe('routeReducer — loadRoutesSuccess', () => {
  it('stores routes, clears loading, and persists total + params', () => {
    const routes = [makeRoute(), makeRoute('r-2', 'Route B')];
    const state = routeReducer(
      { ...initialState, loading: true },
      loadRoutesSuccess({ routes, total: 20, page: 2, pageSize: 5, sortBy: 'name', sortDir: 'desc' })
    );
    expect(state.loading).toBe(false);
    expect(Object.keys(state.entities)).toHaveLength(2);
    expect(state.total).toBe(20);
    expect(state.page).toBe(2);
    expect(state.pageSize).toBe(5);
    expect(state.sortDir).toBe('desc');
  });

  it('replaces previous page with the new page', () => {
    const page1 = routeReducer(initialState, makeSuccess([makeRoute('r-1')]));
    const page2 = routeReducer(page1, makeSuccess([makeRoute('r-2')]));
    expect(Object.keys(page2.entities)).toEqual(['r-2']);
  });

  it('handles empty page', () => {
    const state = routeReducer({ ...initialState, loading: true }, makeSuccess([]));
    expect(state.loading).toBe(false);
    expect(state.total).toBe(0);
    expect(Object.keys(state.entities)).toHaveLength(0);
  });
});

// ── loadRoutesFailure ─────────────────────────────────────────────────────────

describe('routeReducer — loadRoutesFailure', () => {
  it('stores error and clears loading', () => {
    const state = routeReducer({ ...initialState, loading: true }, loadRoutesFailure({ error: 'fail' }));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('fail');
  });

  it('preserves pagination state on failure', () => {
    const loaded = routeReducer(initialState, loadRoutes({ page: 3, pageSize: 5, sortBy: 'name', sortDir: 'asc' }));
    const state = routeReducer(loaded, loadRoutesFailure({ error: 'timeout' }));
    expect(state.page).toBe(3);
  });
});

// ── mutation success actions are no-ops ───────────────────────────────────────

describe('routeReducer — mutation success actions are no-ops', () => {
  const route = makeRoute();

  it('createRouteSuccess does not change entity state', () => {
    const before = routeReducer(initialState, makeSuccess([route]));
    const after  = routeReducer(before, createRouteSuccess({ route: makeRoute('new') }));
    expect(after.ids).toEqual(before.ids);
  });

  it('updateRouteSuccess does not change entity state', () => {
    const before = routeReducer(initialState, makeSuccess([route]));
    const after  = routeReducer(before, updateRouteSuccess({ route: { ...route, name: 'Changed' } }));
    expect(after.entities['r-1']?.name).toBe('Route A');
  });

  it('deleteRouteSuccess does not change entity state', () => {
    const before = routeReducer(initialState, makeSuccess([route]));
    const after  = routeReducer(before, deleteRouteSuccess({ id: 'r-1' }));
    expect(after.entities['r-1']).toBeDefined();
  });
});

// ── immutability ──────────────────────────────────────────────────────────────

describe('routeReducer — immutability', () => {
  it('does not mutate previous state', () => {
    const prev = { ...initialState };
    routeReducer(prev, makeSuccess([makeRoute()]));
    expect(Object.keys(prev.entities)).toHaveLength(0);
  });
});
