import { describe, expect, it } from 'vitest';
import { Bus } from '../../core/models/bus.model';
import { busAdapter, BusState } from './bus.reducer';
import {
  selectAllBuses,
  selectBusEntities,
  selectBusError,
  selectBusLoading,
  selectBusPage,
  selectBusPageSize,
  selectBusPagination,
  selectBusSortBy,
  selectBusSortDir,
  selectBusesForMap,
  selectBusTotal,
} from './bus.selectors';

// ── helpers ───────────────────────────────────────────────────────────────────

const defaultPagination = {
  total: 0,
  page: 1,
  pageSize: 10,
  sortBy: 'name',
  sortDir: 'asc' as const,
};

const mapEmpty = { mapBusesById: {} as Record<string, Bus> };

const makeBus = (id: string, routeId: string | null = null): Bus => ({
  id,
  name: `Bus ${id}`,
  licensePlate: `LP-${id}`,
  capacity: 30,
  status: 'Active',
  routeId,
});

const buildState = (partial: Partial<BusState> = {}) => ({
  buses: busAdapter.getInitialState({
    loading: false,
    error: null,
    ...defaultPagination,
    ...mapEmpty,
    ...partial,
  }),
});

const withBuses = (...buses: Bus[]) => ({
  buses: busAdapter.setAll(
    buses,
    busAdapter.getInitialState({
      loading: false,
      error: null,
      ...defaultPagination,
      ...mapEmpty,
    })
  ),
});

// ── entity selectors ──────────────────────────────────────────────────────────

describe('selectAllBuses', () => {
  it('returns empty array when no buses', () => {
    expect(selectAllBuses(buildState())).toEqual([]);
  });

  it('returns all buses', () => {
    expect(selectAllBuses(withBuses(makeBus('1'), makeBus('2')))).toHaveLength(2);
  });

  it('reflects routeId assignment', () => {
    const state = withBuses(makeBus('1', 'route-abc'), makeBus('2', null));
    const buses = selectAllBuses(state);
    expect(buses.find((b) => b.id === '1')?.routeId).toBe('route-abc');
    expect(buses.find((b) => b.id === '2')?.routeId).toBeNull();
  });
});

describe('selectBusesForMap', () => {
  it('is empty until buses are opted onto Tracking map roster', () => {
    const state = withBuses(makeBus('z'), makeBus('a'));
    expect(selectBusesForMap(state)).toEqual([]);
  });

  it('returns sorted roster from mapBusesById independently of sidebar page', () => {
    const b1 = makeBus('1');
    b1.name = 'Charlie';
    const b2 = makeBus('2');
    b2.name = 'Alpha';
    const inner = busAdapter.setAll(
      [makeBus('page')],
      busAdapter.getInitialState({
        loading: false,
        error: null,
        ...defaultPagination,
        ...mapEmpty,
        mapBusesById: { [b2.id]: b2, [b1.id]: b1 },
      })
    );
    const state = { buses: inner };
    const mapList = selectBusesForMap(state);
    expect(mapList.map((b) => b.name)).toEqual(['Alpha', 'Charlie']);
    expect(selectAllBuses(state).map((b) => b.id)).toEqual(['page']);
  });
});

describe('selectBusEntities', () => {
  it('returns a map keyed by id', () => {
    const entities = selectBusEntities(withBuses(makeBus('1'), makeBus('2')));
    expect(entities['1']?.licensePlate).toBe('LP-1');
    expect(entities['2']?.licensePlate).toBe('LP-2');
  });
});

describe('selectBusLoading', () => {
  it('returns loading flag', () => {
    expect(selectBusLoading(buildState({ loading: true }))).toBe(true);
    expect(selectBusLoading(buildState({ loading: false }))).toBe(false);
  });
});

describe('selectBusError', () => {
  it('returns error string', () => {
    expect(selectBusError(buildState({ error: 'fail' }))).toBe('fail');
    expect(selectBusError(buildState({ error: null }))).toBeNull();
  });
});

// ── pagination selectors ──────────────────────────────────────────────────────

describe('selectBusTotal', () => {
  it('returns default 0', () => {
    expect(selectBusTotal(buildState())).toBe(0);
  });

  it('returns stored total', () => {
    expect(selectBusTotal(buildState({ total: 42 }))).toBe(42);
  });
});

describe('selectBusPage', () => {
  it('returns default page 1', () => {
    expect(selectBusPage(buildState())).toBe(1);
  });

  it('returns stored page', () => {
    expect(selectBusPage(buildState({ page: 5 }))).toBe(5);
  });
});

describe('selectBusPageSize', () => {
  it('returns default pageSize 10', () => {
    expect(selectBusPageSize(buildState())).toBe(10);
  });

  it('returns stored pageSize', () => {
    expect(selectBusPageSize(buildState({ pageSize: 25 }))).toBe(25);
  });
});

describe('selectBusSortBy', () => {
  it('returns default sortBy "name"', () => {
    expect(selectBusSortBy(buildState())).toBe('name');
  });

  it('returns stored sortBy', () => {
    expect(selectBusSortBy(buildState({ sortBy: 'capacity' }))).toBe('capacity');
  });
});

describe('selectBusSortDir', () => {
  it('returns default sortDir "asc"', () => {
    expect(selectBusSortDir(buildState())).toBe('asc');
  });

  it('returns stored sortDir', () => {
    expect(selectBusSortDir(buildState({ sortDir: 'desc' }))).toBe('desc');
  });
});

describe('selectBusPagination', () => {
  it('returns all four pagination fields', () => {
    const state = buildState({ page: 2, pageSize: 5, sortBy: 'status', sortDir: 'desc' });
    expect(selectBusPagination(state)).toEqual({
      page: 2,
      pageSize: 5,
      sortBy: 'status',
      sortDir: 'desc',
    });
  });

  it('returns defaults when state is untouched', () => {
    expect(selectBusPagination(buildState())).toEqual({
      page: 1,
      pageSize: 10,
      sortBy: 'name',
      sortDir: 'asc',
    });
  });

  it('includes status when Tracking filters to active buses', () => {
    const state = buildState({
      filterStatus: 'Active',
      page: 2,
      pageSize: 5,
      sortBy: 'licensePlate',
      sortDir: 'desc',
    });
    expect(selectBusPagination(state)).toEqual({
      page: 2,
      pageSize: 5,
      sortBy: 'licensePlate',
      sortDir: 'desc',
      status: 'Active',
    });
  });
});
