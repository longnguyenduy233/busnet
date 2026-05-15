import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TrackingState } from './tracking.reducer';

export const selectTrackingState = createFeatureSelector<TrackingState>('tracking');

export const selectTrackingEntities = createSelector(
  selectTrackingState,
  (state) => state.entities
);

export const selectBusTrackingEntry = (busId: string) =>
  createSelector(selectTrackingEntities, (entities) => entities[busId]);
