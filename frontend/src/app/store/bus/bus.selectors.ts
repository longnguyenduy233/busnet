import { createFeatureSelector, createSelector } from '@ngrx/store';
import { busAdapter, BusState } from './bus.reducer';

export const selectBusState = createFeatureSelector<BusState>('buses');
const { selectAll, selectEntities } = busAdapter.getSelectors();

export const selectAllBuses    = createSelector(selectBusState, selectAll);
export const selectBusEntities = createSelector(selectBusState, selectEntities);
export const selectBusLoading  = createSelector(selectBusState, (s) => s.loading);
export const selectBusError    = createSelector(selectBusState, (s) => s.error);
export const selectBusTotal    = createSelector(selectBusState, (s) => s.total);
export const selectBusPage     = createSelector(selectBusState, (s) => s.page);
export const selectBusPageSize = createSelector(selectBusState, (s) => s.pageSize);
export const selectBusSortBy   = createSelector(selectBusState, (s) => s.sortBy);
export const selectBusSortDir  = createSelector(selectBusState, (s) => s.sortDir);

export const selectBusPagination = createSelector(selectBusState, (s) => {
  const base = {
    page: s.page,
    pageSize: s.pageSize,
    sortBy: s.sortBy,
    sortDir: s.sortDir,
  };
  return s.filterStatus !== undefined ? { ...base, status: s.filterStatus } : base;
});

/** Buses the user opted onto the Tracking map (see {@link BusState.mapBusesById}). */
export const selectBusesForMap = createSelector(selectBusState, (s) =>
  [...Object.values(s.mapBusesById ?? {})].sort((a, b) => a.name.localeCompare(b.name))
);
