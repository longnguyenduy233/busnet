import { createFeatureSelector, createSelector } from '@ngrx/store';
import { routeAdapter, RouteState } from './route.reducer';

export const selectRouteState = createFeatureSelector<RouteState>('routes');
const { selectAll } = routeAdapter.getSelectors();

export const selectAllRoutes    = createSelector(selectRouteState, selectAll);
export const selectRouteLoading = createSelector(selectRouteState, (s) => s.loading);
export const selectRouteError   = createSelector(selectRouteState, (s) => s.error);
export const selectRouteTotal   = createSelector(selectRouteState, (s) => s.total);
export const selectRoutePage    = createSelector(selectRouteState, (s) => s.page);
export const selectRoutePageSize = createSelector(selectRouteState, (s) => s.pageSize);
export const selectRouteSortBy  = createSelector(selectRouteState, (s) => s.sortBy);
export const selectRouteSortDir = createSelector(selectRouteState, (s) => s.sortDir);

export const selectRoutePagination = createSelector(selectRouteState, (s) => ({
  page: s.page,
  pageSize: s.pageSize,
  sortBy: s.sortBy,
  sortDir: s.sortDir,
}));
