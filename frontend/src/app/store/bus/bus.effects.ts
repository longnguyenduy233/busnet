import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
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
import { selectBusPagination } from './bus.selectors';

@Injectable()
export class BusEffects {
  private actions$ = inject(Actions);
  private busService = inject(BusService);
  private store = inject(Store);

  loadBuses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBuses),
      switchMap(({ page, pageSize, sortBy, sortDir, status }) =>
        this.busService.getAll({ page, pageSize, sortBy, sortDir, status }).pipe(
          map((result) => loadBusesSuccess({
            buses: result.items,
            total: result.totalCount,
            page: result.page,
            pageSize: result.pageSize,
            sortBy,
            sortDir,
          })),
          catchError((err) => of(loadBusesFailure({ error: err.message })))
        )
      )
    )
  );

  /** User opted a bus onto the Tracking map roster — GET /buses/:id (no upfront fleet preload). */
  fetchBusForTrackingMap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchBusForTrackingMap),
      mergeMap(({ busId }) =>
        this.busService.getById(busId).pipe(
          map((bus) => fetchBusForTrackingMapSuccess({ bus })),
          catchError((err) =>
            of(
              fetchBusForTrackingMapFailure({
                busId,
                error: err?.message ?? 'Failed to load bus',
              })
            )
          )
        )
      )
    )
  );

  createBus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createBus),
      switchMap(({ dto }) =>
        this.busService.create(dto).pipe(
          withLatestFrom(this.store.select(selectBusPagination)),
          mergeMap(([bus, params]) => [
            createBusSuccess({ bus }),
            loadBuses(params),
          ]),
          catchError((err) => of(createBusFailure({ error: err.message })))
        )
      )
    )
  );

  updateBus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBus),
      switchMap(({ id, dto }) =>
        this.busService.update(id, dto).pipe(
          withLatestFrom(this.store.select(selectBusPagination)),
          mergeMap(([bus, params]) => [
            updateBusSuccess({ bus }),
            loadBuses(params),
          ]),
          catchError((err) => of(updateBusFailure({ error: err.message })))
        )
      )
    )
  );

  deleteBus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBus),
      switchMap(({ id }) =>
        this.busService.delete(id).pipe(
          withLatestFrom(this.store.select(selectBusPagination)),
          mergeMap(([, params]) => [
            deleteBusSuccess({ id }),
            loadBuses(params),
          ]),
          catchError((err) => of(deleteBusFailure({ error: err.message })))
        )
      )
    )
  );

  assignRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignRoute),
      switchMap(({ busId, routeId }) =>
        this.busService.assignRoute(busId, routeId).pipe(
          withLatestFrom(this.store.select(selectBusPagination)),
          mergeMap(([bus, params]) => [
            assignRouteSuccess({ bus }),
            loadBuses(params),
          ]),
          catchError((err) => of(assignRouteFailure({ error: err.message })))
        )
      )
    )
  );

  unassignRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unassignRoute),
      switchMap(({ busId }) =>
        this.busService.unassignRoute(busId).pipe(
          withLatestFrom(this.store.select(selectBusPagination)),
          mergeMap(([bus, params]) => [
            unassignRouteSuccess({ bus }),
            loadBuses(params),
          ]),
          catchError((err) => of(unassignRouteFailure({ error: err.message })))
        )
      )
    )
  );
}
