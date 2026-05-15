import { createReducer, on } from '@ngrx/store';
import { busLocationReceived } from './tracking.actions';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface BusTrackingEntry {
  currentPosition: GeoPoint;
  /** All points received per bus for this browser session (unbounded growth). */
  history: GeoPoint[];
}

export interface TrackingState {
  entities: { [busId: string]: BusTrackingEntry };
}

const initialState: TrackingState = { entities: {} };

export const trackingReducer = createReducer(
  initialState,
  on(busLocationReceived, (state, { location }) => {
    const existing = state.entities[location.busId];
    const point: GeoPoint = {
      latitude: location.latitude,
      longitude: location.longitude,
    };
    const prevHistory = existing?.history ?? [];
    // Keep complete trail for analysis / replay; map layer cost grows with long sessions.
    const history: GeoPoint[] = [...prevHistory, point];

    return {
      ...state,
      entities: {
        ...state.entities,
        [location.busId]: { currentPosition: point, history },
      },
    };
  }),
);
