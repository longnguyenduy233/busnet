import { createAction, props } from '@ngrx/store';
import { CreateRouteDto, Route, RouteQueryParams, UpdateRouteDto } from '../../core/models/route.model';

export const loadRoutes = createAction('[Route] Load Routes', props<RouteQueryParams>());
export const loadRoutesSuccess = createAction('[Route] Load Routes Success', props<{
  routes: Route[];
  total: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}>());
export const loadRoutesFailure = createAction('[Route] Load Routes Failure', props<{ error: string }>());

export const createRoute = createAction('[Route] Create Route', props<{ dto: CreateRouteDto }>());
export const createRouteSuccess = createAction('[Route] Create Route Success', props<{ route: Route }>());
export const createRouteFailure = createAction('[Route] Create Route Failure', props<{ error: string }>());

export const updateRoute = createAction('[Route] Update Route', props<{ id: string; dto: UpdateRouteDto }>());
export const updateRouteSuccess = createAction('[Route] Update Route Success', props<{ route: Route }>());
export const updateRouteFailure = createAction('[Route] Update Route Failure', props<{ error: string }>());

export const deleteRoute = createAction('[Route] Delete Route', props<{ id: string }>());
export const deleteRouteSuccess = createAction('[Route] Delete Route Success', props<{ id: string }>());
export const deleteRouteFailure = createAction('[Route] Delete Route Failure', props<{ error: string }>());
