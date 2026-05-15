import { describe, expect, it } from 'vitest';
import { Bus } from '../../core/models/bus.model';
import {
  assignRouteSuccess,
  clearTrackingMapSelection,
  createBusSuccess, deleteBusSuccess,
  fetchBusForTrackingMapSuccess,
  loadBuses, loadBusesFailure, loadBusesSuccess,
  removeBusFromTrackingMap,
  unassignRouteSuccess, updateBusSuccess
} from './bus.actions';
import { busAdapter, busReducer, BusState } from './bus.reducer';

// ── helpers ───────────────────────────────────────────────────────────────────

const initialState: BusState = busAdapter.getInitialState({
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
  sortBy: 'name',
  sortDir: 'asc' as const,
  mapBusesById: {},
});

const defaultParams = { page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc' as const };

const makeSuccess = (buses: Bus[], overrides = {}) =>
  loadBusesSuccess({ buses, total: buses.length, ...defaultParams, ...overrides });

const makeBus = (overrides: Partial<Bus> = {}): Bus => ({
  id: 'bus-1',
  name: 'Bus A',
  licensePlate: 'A-001',
  capacity: 30,
  status: 'Active',
  routeId: null,
  ...overrides,
});

// ── loadBuses ─────────────────────────────────────────────────────────────────

describe('busReducer — loadBuses', () => {
  it('sets loading=true and clears error', () => {
    const state = busReducer({ ...initialState, error: 'old' }, loadBuses(defaultParams));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores pagination params when loading', () => {
    const params = { page: 3, pageSize: 25, sortBy: 'capacity', sortDir: 'desc' as const };
    const state = busReducer(initialState, loadBuses(params));
    expect(state.page).toBe(3);
    expect(state.pageSize).toBe(25);
    expect(state.sortBy).toBe('capacity');
    expect(state.sortDir).toBe('desc');
  });

  it('stores Active-only filter used by Tracking sidebar', () => {
    const state = busReducer(
      initialState,
      loadBuses({ ...defaultParams, status: 'Active' })
    );
    expect(state.filterStatus).toBe('Active');
  });

  it('clears status filter when bus admin loads without status', () => {
    const fromTracking = busReducer(
      initialState,
      loadBuses({ ...defaultParams, status: 'Active' })
    );
    const backToFleet = busReducer(fromTracking, loadBuses(defaultParams));
    expect(backToFleet.filterStatus).toBeUndefined();
  });
});

// ── loadBusesSuccess ──────────────────────────────────────────────────────────

describe('busReducer — loadBusesSuccess', () => {
  it('stores buses, clears loading, and persists total + params', () => {
    const buses = [makeBus(), makeBus({ id: 'bus-2', licensePlate: 'B-002' })];
    const state = busReducer(
      { ...initialState, loading: true },
      loadBusesSuccess({ buses, total: 50, page: 2, pageSize: 10, sortBy: 'status', sortDir: 'asc' })
    );
    expect(state.loading).toBe(false);
    expect(Object.keys(state.entities)).toHaveLength(2);
    expect(state.total).toBe(50);
    expect(state.page).toBe(2);
    expect(state.pageSize).toBe(10);
    expect(state.sortBy).toBe('status');
    expect(state.sortDir).toBe('asc');
  });

  it('replaces previous page of buses with the new page', () => {
    const page1State = busReducer(initialState, makeSuccess([makeBus({ id: 'a' }), makeBus({ id: 'b' })]));
    const page2State = busReducer(page1State, makeSuccess([makeBus({ id: 'c' })]));
    expect(Object.keys(page2State.entities)).toEqual(['c']);
  });

  it('handles empty page', () => {
    const state = busReducer({ ...initialState, loading: true }, makeSuccess([]));
    expect(state.loading).toBe(false);
    expect(Object.keys(state.entities)).toHaveLength(0);
    expect(state.total).toBe(0);
  });
});

// ── loadBusesFailure ──────────────────────────────────────────────────────────

describe('busReducer — loadBusesFailure', () => {
  it('stores error and clears loading', () => {
    const state = busReducer({ ...initialState, loading: true }, loadBusesFailure({ error: 'Server error' }));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Server error');
  });

  it('preserves existing pagination state on failure', () => {
    const withPage = busReducer(initialState, loadBuses({ page: 3, pageSize: 5, sortBy: 'capacity', sortDir: 'desc' }));
    const state = busReducer(withPage, loadBusesFailure({ error: 'timeout' }));
    expect(state.page).toBe(3);
    expect(state.sortBy).toBe('capacity');
  });
});

// ── mutation success actions are no-ops in the reducer ────────────────────────
// The reducer no longer handles these directly; effects dispatch loadBuses to
// refresh the current server page after any mutation.

describe('busReducer — mutation success actions are no-ops', () => {
  const bus = makeBus();

  it('createBusSuccess does not change entity state', () => {
    const before = busReducer(initialState, makeSuccess([bus]));
    const after  = busReducer(before, createBusSuccess({ bus: makeBus({ id: 'new-bus' }) }));
    expect(after.ids).toEqual(before.ids);
  });

  it('updateBusSuccess does not change entity state', () => {
    const before = busReducer(initialState, makeSuccess([bus]));
    const after  = busReducer(before, updateBusSuccess({ bus: { ...bus, name: 'Changed' } }));
    expect(after.entities['bus-1']?.name).toBe('Bus A');
  });

  it('deleteBusSuccess does not change entity state', () => {
    const before = busReducer(initialState, makeSuccess([bus]));
    const after  = busReducer(before, deleteBusSuccess({ id: 'bus-1' }));
    expect(after.entities['bus-1']).toBeDefined();
  });

  it('assignRouteSuccess does not change entity state', () => {
    const before = busReducer(initialState, makeSuccess([bus]));
    const after  = busReducer(before, assignRouteSuccess({ bus: { ...bus, routeId: 'r-1' } }));
    expect(after.entities['bus-1']?.routeId).toBeNull();
  });

  it('unassignRouteSuccess does not change entity state', () => {
    const withRoute = { ...bus, routeId: 'r-1' };
    const before = busReducer(initialState, makeSuccess([withRoute]));
    const after  = busReducer(before, unassignRouteSuccess({ bus: { ...withRoute, routeId: null } }));
    expect(after.entities['bus-1']?.routeId).toBe('r-1');
  });
});

// ── Tracking map roster (lazy per bus) ─────────────────────────────────────────

describe('busReducer — tracking map roster', () => {
  it('fetchBusForTrackingMapSuccess merges without clearing paged table entities', () => {
    const paged = [makeBus({ id: 'page' })];
    const fresh = makeBus({ id: 'm1', name: 'Map Bus' });
    const state = busReducer(
      busReducer(initialState, loadBusesSuccess({
        buses: paged,
        total: 99,
        ...defaultParams,
      })),
      fetchBusForTrackingMapSuccess({ bus: fresh })
    );
    expect(busAdapter.getSelectors().selectAll(state).map((b) => b.id)).toEqual(['page']);
    expect(state.mapBusesById['m1']?.name).toBe('Map Bus');
  });

  it('removeBusFromTrackingMap drops one map id', () => {
    const a = makeBus({ id: 'a' });
    const b = makeBus({ id: 'b' });
    const withMap = busReducer(
      busReducer(initialState, fetchBusForTrackingMapSuccess({ bus: a })),
      fetchBusForTrackingMapSuccess({ bus: b })
    );
    const after = busReducer(withMap, removeBusFromTrackingMap({ busId: 'a' }));
    expect(Object.keys(after.mapBusesById).sort()).toEqual(['b']);
  });

  it('assignRouteSuccess updates roster row when bus is on Tracking map', () => {
    const bus = makeBus({ id: 'x' });
    const rostered = busReducer(initialState, fetchBusForTrackingMapSuccess({ bus }));
    const after = busReducer(
      rostered,
      assignRouteSuccess({ bus: { ...bus, routeId: 'route-99' } })
    );
    expect(after.mapBusesById['x']?.routeId).toBe('route-99');
  });

  it('deleteBusSuccess removes roster entry when present', () => {
    const bus = makeBus({ id: 'x' });
    const rostered = busReducer(initialState, fetchBusForTrackingMapSuccess({ bus }));
    const after = busReducer(rostered, deleteBusSuccess({ id: 'x' }));
    expect(after.mapBusesById['x']).toBeUndefined();
  });

  it('clearTrackingMapSelection empties roster', () => {
    const rostered = busReducer(
      initialState,
      fetchBusForTrackingMapSuccess({ bus: makeBus({ id: 'x' }) })
    );
    const after = busReducer(rostered, clearTrackingMapSelection());
    expect(after.mapBusesById).toEqual({});
  });
});

// ── immutability ──────────────────────────────────────────────────────────────

describe('busReducer — immutability', () => {
  it('does not mutate previous state', () => {
    const prev = { ...initialState };
    busReducer(prev, makeSuccess([makeBus()]));
    expect(Object.keys(prev.entities)).toHaveLength(0);
  });
});
