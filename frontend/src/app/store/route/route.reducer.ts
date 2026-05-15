import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Route } from '../../core/models/route.model';
import {
  loadRoutes, loadRoutesFailure, loadRoutesSuccess
} from './route.actions';

export interface RouteState extends EntityState<Route> {
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

export const routeAdapter: EntityAdapter<Route> = createEntityAdapter<Route>();

const initialState: RouteState = routeAdapter.getInitialState({
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
  sortBy: 'name',
  sortDir: 'asc' as const,
});

export const routeReducer = createReducer<RouteState>(
  initialState,
  on(loadRoutes, (state, { page, pageSize, sortBy, sortDir }) =>
    ({ ...state, loading: true, error: null, page, pageSize, sortBy, sortDir })),
  on(loadRoutesSuccess, (state, { routes, total, page, pageSize, sortBy, sortDir }) =>
    routeAdapter.setAll(routes, { ...state, loading: false, total, page, pageSize, sortBy, sortDir })),
  on(loadRoutesFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
