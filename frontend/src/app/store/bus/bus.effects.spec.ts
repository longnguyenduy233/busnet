import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReplaySubject, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { Bus, PagedResult } from '../../core/models/bus.model';
import { BusService } from '../../core/services/bus.service';
import {
  assignRoute, assignRouteFailure, assignRouteSuccess,
  createBus, createBusFailure, createBusSuccess,
  deleteBus, deleteBusFailure, deleteBusSuccess,
  fetchBusForTrackingMap, fetchBusForTrackingMapFailure, fetchBusForTrackingMapSuccess,
  loadBuses, loadBusesFailure, loadBusesSuccess,
  unassignRoute, unassignRouteFailure, unassignRouteSuccess,
  updateBus, updateBusFailure, updateBusSuccess,
} from './bus.actions';
import { BusEffects } from './bus.effects';
import { selectBusPagination } from './bus.selectors';

// ── helpers ───────────────────────────────────────────────────────────────────

const defaultParams = { page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc' as const };

const makeBus = (id = 'bus-1'): Bus => ({
  id, name: 'Bus A', licensePlate: 'A-001', capacity: 30, status: 'Active', routeId: null,
});

const makePagedResult = (buses: Bus[]): PagedResult<Bus> => ({
  items: buses,
  totalCount: buses.length,
  page: 1,
  pageSize: 10,
});

// ── setup ─────────────────────────────────────────────────────────────────────

describe('BusEffects', () => {
  let actions$: ReplaySubject<Action>;
  let effects: BusEffects;
  let store: MockStore;
  let busService: { [K in keyof BusService]: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    actions$ = new ReplaySubject<Action>(1);

    busService = {
      getAll:           vi.fn(),
      getById:          vi.fn(),
      create:           vi.fn(),
      update:           vi.fn(),
      delete:           vi.fn(),
      assignRoute:      vi.fn(),
      unassignRoute:    vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        BusEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [{ selector: selectBusPagination, value: defaultParams }],
        }),
        { provide: BusService, useValue: busService },
      ],
    });

    effects = TestBed.inject(BusEffects);
    store   = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
    vi.clearAllMocks();
  });

  // ── loadBuses$ ──────────────────────────────────────────────────────────────

  describe('loadBuses$', () => {
    it('calls service with query params and dispatches loadBusesSuccess', () => {
      const buses = [makeBus()];
      busService.getAll.mockReturnValue(of(makePagedResult(buses)));

      const results: Action[] = [];
      effects.loadBuses$.subscribe(a => results.push(a));
      actions$.next(loadBuses(defaultParams));

      expect(busService.getAll).toHaveBeenCalledWith(defaultParams);
      expect(results[0]).toEqual(loadBusesSuccess({
        buses,
        total: 1,
        page: 1,
        pageSize: 10,
        sortBy: 'name',
        sortDir: 'asc',
      }));
    });

    it('passes custom page and sort params to the service', () => {
      const params = { page: 3, pageSize: 5, sortBy: 'capacity', sortDir: 'desc' as const };
      busService.getAll.mockReturnValue(of(makePagedResult([])));

      effects.loadBuses$.subscribe();
      actions$.next(loadBuses(params));

      expect(busService.getAll).toHaveBeenCalledWith(params);
    });

    it('includes status when the Tracking sidebar requests active buses only', () => {
      const params = { ...defaultParams, status: 'Active' as const };
      busService.getAll.mockReturnValue(of(makePagedResult([])));

      effects.loadBuses$.subscribe();
      actions$.next(loadBuses(params));

      expect(busService.getAll).toHaveBeenCalledWith(params);
    });

    it('dispatches loadBusesFailure on service error', () => {
      busService.getAll.mockReturnValue(throwError(() => new Error('Network error')));

      const results: Action[] = [];
      effects.loadBuses$.subscribe(a => results.push(a));
      actions$.next(loadBuses(defaultParams));

      expect(results[0]).toEqual(loadBusesFailure({ error: 'Network error' }));
    });
  });

  // ── fetchBusForTrackingMap$ ─────────────────────────────────────────────────

  describe('fetchBusForTrackingMap$', () => {
    it('loads bus by id and dispatches success', () => {
      const bus = makeBus('x');
      busService.getById.mockReturnValue(of(bus));

      const results: Action[] = [];
      effects.fetchBusForTrackingMap$.subscribe((a) => results.push(a));
      actions$.next(fetchBusForTrackingMap({ busId: 'x' }));

      expect(busService.getById).toHaveBeenCalledWith('x');
      expect(results[0]).toEqual(fetchBusForTrackingMapSuccess({ bus }));
    });

    it('dispatches fetchBusForTrackingMapFailure on error', () => {
      busService.getById.mockReturnValue(throwError(() => new Error('404')));

      const results: Action[] = [];
      effects.fetchBusForTrackingMap$.subscribe((a) => results.push(a));
      actions$.next(fetchBusForTrackingMap({ busId: 'lost' }));

      expect(results[0]).toEqual(
        fetchBusForTrackingMapFailure({ busId: 'lost', error: '404' })
      );
    });
  });

  // ── createBus$ ──────────────────────────────────────────────────────────────

  describe('createBus$', () => {
    it('dispatches createBusSuccess and loadBuses', () => {
      const bus = makeBus();
      busService.create.mockReturnValue(of(bus));

      const results: Action[] = [];
      effects.createBus$.subscribe(a => results.push(a));
      actions$.next(createBus({ dto: { name: 'Bus A', licensePlate: 'A-001', capacity: 30, status: 'Active' } }));

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(createBusSuccess({ bus }));
      expect(results[1]).toEqual(loadBuses(defaultParams));
    });

    it('dispatches createBusFailure on error', () => {
      busService.create.mockReturnValue(throwError(() => new Error('Conflict')));

      const results: Action[] = [];
      effects.createBus$.subscribe(a => results.push(a));
      actions$.next(createBus({ dto: { name: 'Bus A', licensePlate: 'A-001', capacity: 30, status: 'Active' } }));

      expect(results[0]).toEqual(createBusFailure({ error: 'Conflict' }));
    });
  });

  // ── updateBus$ ──────────────────────────────────────────────────────────────

  describe('updateBus$', () => {
    it('dispatches updateBusSuccess and loadBuses', () => {
      const bus = makeBus();
      busService.update.mockReturnValue(of(bus));

      const results: Action[] = [];
      effects.updateBus$.subscribe(a => results.push(a));
      actions$.next(updateBus({ id: 'bus-1', dto: { name: 'Bus A', licensePlate: 'A-001', capacity: 30, status: 'Active' } }));

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(updateBusSuccess({ bus }));
      expect(results[1]).toEqual(loadBuses(defaultParams));
    });

    it('dispatches updateBusFailure on error', () => {
      busService.update.mockReturnValue(throwError(() => new Error('Not Found')));

      const results: Action[] = [];
      effects.updateBus$.subscribe(a => results.push(a));
      actions$.next(updateBus({ id: 'bus-1', dto: { name: 'Bus A', licensePlate: 'A-001', capacity: 30, status: 'Active' } }));

      expect(results[0]).toEqual(updateBusFailure({ error: 'Not Found' }));
    });
  });

  // ── deleteBus$ ──────────────────────────────────────────────────────────────

  describe('deleteBus$', () => {
    it('dispatches deleteBusSuccess and loadBuses', () => {
      busService.delete.mockReturnValue(of(void 0));

      const results: Action[] = [];
      effects.deleteBus$.subscribe(a => results.push(a));
      actions$.next(deleteBus({ id: 'bus-1' }));

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(deleteBusSuccess({ id: 'bus-1' }));
      expect(results[1]).toEqual(loadBuses(defaultParams));
    });

    it('dispatches deleteBusFailure on error', () => {
      busService.delete.mockReturnValue(throwError(() => new Error('Not Found')));

      const results: Action[] = [];
      effects.deleteBus$.subscribe(a => results.push(a));
      actions$.next(deleteBus({ id: 'bus-1' }));

      expect(results[0]).toEqual(deleteBusFailure({ error: 'Not Found' }));
    });

    it('uses pagination from store — reloads correct page after delete', () => {
      store.overrideSelector(selectBusPagination, { page: 3, pageSize: 5, sortBy: 'status', sortDir: 'desc' });
      store.refreshState();
      busService.delete.mockReturnValue(of(void 0));

      const results: Action[] = [];
      effects.deleteBus$.subscribe(a => results.push(a));
      actions$.next(deleteBus({ id: 'bus-1' }));

      expect(results).toHaveLength(2);
      expect(results[1]).toEqual(loadBuses({ page: 3, pageSize: 5, sortBy: 'status', sortDir: 'desc' }));
    });
  });

  // ── assignRoute$ ─────────────────────────────────────────────────────────────

  describe('assignRoute$', () => {
    it('dispatches assignRouteSuccess and loadBuses', () => {
      const bus = makeBus();
      busService.assignRoute.mockReturnValue(of(bus));

      const results: Action[] = [];
      effects.assignRoute$.subscribe(a => results.push(a));
      actions$.next(assignRoute({ busId: 'bus-1', routeId: 'route-1' }));

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(assignRouteSuccess({ bus }));
      expect(results[1]).toEqual(loadBuses(defaultParams));
    });

    it('dispatches assignRouteFailure on error', () => {
      busService.assignRoute.mockReturnValue(throwError(() => new Error('Bad Request')));

      const results: Action[] = [];
      effects.assignRoute$.subscribe(a => results.push(a));
      actions$.next(assignRoute({ busId: 'bus-1', routeId: 'route-1' }));

      expect(results[0]).toEqual(assignRouteFailure({ error: 'Bad Request' }));
    });
  });

  // ── unassignRoute$ ───────────────────────────────────────────────────────────

  describe('unassignRoute$', () => {
    it('dispatches unassignRouteSuccess and loadBuses', () => {
      const bus = makeBus();
      busService.unassignRoute.mockReturnValue(of(bus));

      const results: Action[] = [];
      effects.unassignRoute$.subscribe(a => results.push(a));
      actions$.next(unassignRoute({ busId: 'bus-1' }));

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(unassignRouteSuccess({ bus }));
      expect(results[1]).toEqual(loadBuses(defaultParams));
    });

    it('dispatches unassignRouteFailure on error', () => {
      busService.unassignRoute.mockReturnValue(throwError(() => new Error('Not Found')));

      const results: Action[] = [];
      effects.unassignRoute$.subscribe(a => results.push(a));
      actions$.next(unassignRoute({ busId: 'bus-1' }));

      expect(results[0]).toEqual(unassignRouteFailure({ error: 'Not Found' }));
    });
  });
});
