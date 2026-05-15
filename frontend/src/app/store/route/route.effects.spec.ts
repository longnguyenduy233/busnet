import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReplaySubject, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { Route } from '../../core/models/route.model';
import { RouteService } from '../../core/services/route.service';
import {
  createRoute, createRouteFailure, createRouteSuccess,
  deleteRoute, deleteRouteFailure, deleteRouteSuccess,
  loadRoutes, loadRoutesFailure, loadRoutesSuccess,
  updateRoute, updateRouteFailure, updateRouteSuccess,
} from './route.actions';
import { RouteEffects } from './route.effects';
import { selectRoutePagination } from './route.selectors';

// ── helpers ───────────────────────────────────────────────────────────────────

const defaultParams = { page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc' as const };

const makeRoute = (id = 'r-1'): Route => ({
  id, name: 'Route A', points: [{ latitude: 10, longitude: 106, order: 0 }],
});

const makePagedResult = (routes: Route[]) => ({
  items: routes, totalCount: routes.length, page: 1, pageSize: 10,
});

// ── setup ─────────────────────────────────────────────────────────────────────

describe('RouteEffects', () => {
  let actions$: ReplaySubject<Action>;
  let effects: RouteEffects;
  let store: MockStore;
  let routeService: { [K in keyof RouteService]: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    actions$ = new ReplaySubject<Action>(1);

    routeService = {
      getAll:  vi.fn(),
      getByRouteIds: vi.fn(),
      create:  vi.fn(),
      update:  vi.fn(),
      delete:  vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        RouteEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [{ selector: selectRoutePagination, value: defaultParams }],
        }),
        { provide: RouteService, useValue: routeService },
      ],
    });

    effects = TestBed.inject(RouteEffects);
    store   = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
    vi.clearAllMocks();
  });

  // ── loadRoutes$ ─────────────────────────────────────────────────────────────

  describe('loadRoutes$', () => {
    it('calls service with query params and dispatches loadRoutesSuccess', () => {
      const routes = [makeRoute()];
      routeService.getAll.mockReturnValue(of(makePagedResult(routes)));

      const results: Action[] = [];
      effects.loadRoutes$.subscribe(a => results.push(a));
      actions$.next(loadRoutes(defaultParams));

      expect(routeService.getAll).toHaveBeenCalledWith(defaultParams);
      expect(results[0]).toEqual(loadRoutesSuccess({
        routes, total: 1, page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc',
      }));
    });

    it('passes custom sort params to the service', () => {
      const params = { page: 2, pageSize: 5, sortBy: 'name', sortDir: 'desc' as const };
      routeService.getAll.mockReturnValue(of(makePagedResult([])));

      effects.loadRoutes$.subscribe();
      actions$.next(loadRoutes(params));

      expect(routeService.getAll).toHaveBeenCalledWith(params);
    });

    it('dispatches loadRoutesFailure on error', () => {
      routeService.getAll.mockReturnValue(throwError(() => new Error('Network error')));

      const results: Action[] = [];
      effects.loadRoutes$.subscribe(a => results.push(a));
      actions$.next(loadRoutes(defaultParams));

      expect(results[0]).toEqual(loadRoutesFailure({ error: 'Network error' }));
    });
  });

  // ── createRoute$ ────────────────────────────────────────────────────────────

  describe('createRoute$', () => {
    it('dispatches createRouteSuccess then loadRoutes', () => {
      const route = makeRoute();
      routeService.create.mockReturnValue(of(route));

      const results: Action[] = [];
      effects.createRoute$.subscribe(a => results.push(a));
      actions$.next(createRoute({ dto: { name: 'Route A', points: [] } }));

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(createRouteSuccess({ route }));
      expect(results[1]).toEqual(loadRoutes(defaultParams));
    });

    it('dispatches createRouteFailure on error', () => {
      routeService.create.mockReturnValue(throwError(() => new Error('Conflict')));

      const results: Action[] = [];
      effects.createRoute$.subscribe(a => results.push(a));
      actions$.next(createRoute({ dto: { name: 'Route A', points: [] } }));

      expect(results[0]).toEqual(createRouteFailure({ error: 'Conflict' }));
    });
  });

  // ── updateRoute$ ────────────────────────────────────────────────────────────

  describe('updateRoute$', () => {
    it('dispatches updateRouteSuccess then loadRoutes', () => {
      const route = makeRoute();
      routeService.update.mockReturnValue(of(route));

      const results: Action[] = [];
      effects.updateRoute$.subscribe(a => results.push(a));
      actions$.next(updateRoute({ id: 'r-1', dto: { name: 'Route A', points: [] } }));

      expect(results[0]).toEqual(updateRouteSuccess({ route }));
      expect(results[1]).toEqual(loadRoutes(defaultParams));
    });

    it('dispatches updateRouteFailure on error', () => {
      routeService.update.mockReturnValue(throwError(() => new Error('Not Found')));

      const results: Action[] = [];
      effects.updateRoute$.subscribe(a => results.push(a));
      actions$.next(updateRoute({ id: 'r-1', dto: { name: 'Route A', points: [] } }));

      expect(results[0]).toEqual(updateRouteFailure({ error: 'Not Found' }));
    });
  });

  // ── deleteRoute$ ────────────────────────────────────────────────────────────

  describe('deleteRoute$', () => {
    it('dispatches deleteRouteSuccess then loadRoutes', () => {
      routeService.delete.mockReturnValue(of(void 0));

      const results: Action[] = [];
      effects.deleteRoute$.subscribe(a => results.push(a));
      actions$.next(deleteRoute({ id: 'r-1' }));

      expect(results[0]).toEqual(deleteRouteSuccess({ id: 'r-1' }));
      expect(results[1]).toEqual(loadRoutes(defaultParams));
    });

    it('uses pagination from store — reloads correct page after delete', () => {
      store.overrideSelector(selectRoutePagination, { page: 2, pageSize: 5, sortBy: 'name', sortDir: 'desc' });
      store.refreshState();
      routeService.delete.mockReturnValue(of(void 0));

      const results: Action[] = [];
      effects.deleteRoute$.subscribe(a => results.push(a));
      actions$.next(deleteRoute({ id: 'r-1' }));

      expect(results[1]).toEqual(loadRoutes({ page: 2, pageSize: 5, sortBy: 'name', sortDir: 'desc' }));
    });

    it('dispatches deleteRouteFailure on error', () => {
      routeService.delete.mockReturnValue(throwError(() => new Error('Not Found')));

      const results: Action[] = [];
      effects.deleteRoute$.subscribe(a => results.push(a));
      actions$.next(deleteRoute({ id: 'r-1' }));

      expect(results[0]).toEqual(deleteRouteFailure({ error: 'Not Found' }));
    });
  });
});
