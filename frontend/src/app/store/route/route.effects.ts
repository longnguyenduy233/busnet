import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { RouteService } from '../../core/services/route.service';
import {
  createRoute, createRouteFailure, createRouteSuccess,
  deleteRoute, deleteRouteFailure, deleteRouteSuccess,
  loadRoutes, loadRoutesFailure, loadRoutesSuccess,
  updateRoute, updateRouteFailure, updateRouteSuccess
} from './route.actions';
import { selectRoutePagination } from './route.selectors';

@Injectable()
export class RouteEffects {
  private actions$ = inject(Actions);
  private routeService = inject(RouteService);
  private store = inject(Store);

  loadRoutes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRoutes),
      switchMap(({ page, pageSize, sortBy, sortDir }) =>
        this.routeService.getAll({ page, pageSize, sortBy, sortDir }).pipe(
          map((result) => loadRoutesSuccess({
            routes: result.items,
            total: result.totalCount,
            page: result.page,
            pageSize: result.pageSize,
            sortBy,
            sortDir,
          })),
          catchError((err) => of(loadRoutesFailure({ error: err.message })))
        )
      )
    )
  );

  createRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createRoute),
      switchMap(({ dto }) =>
        this.routeService.create(dto).pipe(
          withLatestFrom(this.store.select(selectRoutePagination)),
          mergeMap(([route, params]) => [
            createRouteSuccess({ route }),
            loadRoutes(params),
          ]),
          catchError((err) => of(createRouteFailure({ error: err.message })))
        )
      )
    )
  );

  updateRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRoute),
      switchMap(({ id, dto }) =>
        this.routeService.update(id, dto).pipe(
          withLatestFrom(this.store.select(selectRoutePagination)),
          mergeMap(([route, params]) => [
            updateRouteSuccess({ route }),
            loadRoutes(params),
          ]),
          catchError((err) => of(updateRouteFailure({ error: err.message })))
        )
      )
    )
  );

  deleteRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteRoute),
      switchMap(({ id }) =>
        this.routeService.delete(id).pipe(
          withLatestFrom(this.store.select(selectRoutePagination)),
          mergeMap(([, params]) => [
            deleteRouteSuccess({ id }),
            loadRoutes(params),
          ]),
          catchError((err) => of(deleteRouteFailure({ error: err.message })))
        )
      )
    )
  );
}
