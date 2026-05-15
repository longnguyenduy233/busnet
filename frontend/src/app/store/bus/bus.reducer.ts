import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Bus, BusStatus } from '../../core/models/bus.model';
import {
  assignRouteSuccess,
  clearTrackingMapSelection,
  deleteBusSuccess,
  loadBuses, loadBusesFailure, loadBusesSuccess,
  fetchBusForTrackingMapSuccess,
  removeBusFromTrackingMap,
  unassignRouteSuccess,
  updateBusSuccess,
} from './bus.actions';

export interface BusState extends EntityState<Bus> {
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  /** Mirrors last `loadBuses` status query; undefined ⇒ no API filter (bus admin lists all statuses). */
  filterStatus?: BusStatus;
  /** Buses explicitly placed on the Tracking map (filled via GET-by-id when the user selects them). */
  mapBusesById: Record<string, Bus>;
}

export const busAdapter: EntityAdapter<Bus> = createEntityAdapter<Bus>();

const initialState: BusState = busAdapter.getInitialState({
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
  sortBy: 'name',
  sortDir: 'asc' as const,
  mapBusesById: {},
});

export const busReducer = createReducer<BusState>(
  initialState,
  on(loadBuses, (state, { page, pageSize, sortBy, sortDir, status }) =>
    ({ ...state, loading: true, error: null, page, pageSize, sortBy, sortDir, filterStatus: status })),
  on(loadBusesSuccess, (state, { buses, total, page, pageSize, sortBy, sortDir }) =>
    busAdapter.setAll(buses, { ...state, loading: false, total, page, pageSize, sortBy, sortDir })),
  on(loadBusesFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(fetchBusForTrackingMapSuccess, (state, { bus }) => ({
    ...state,
    mapBusesById: { ...state.mapBusesById, [bus.id]: bus },
  })),
  on(removeBusFromTrackingMap, (state, { busId }) => {
    if (!(busId in state.mapBusesById)) return state;
    const { [busId]: _removed, ...rest } = state.mapBusesById;
    return { ...state, mapBusesById: rest };
  }),
  on(clearTrackingMapSelection, (state) =>
    Object.keys(state.mapBusesById).length === 0
      ? state
      : { ...state, mapBusesById: {} }
  ),
  // Keep roster rows aligned with mutations when that bus is on the Tracking map.
  on(assignRouteSuccess, updateBusSuccess, unassignRouteSuccess, (state, { bus }) =>
    state.mapBusesById[bus.id] === undefined
      ? state
      : { ...state, mapBusesById: { ...state.mapBusesById, [bus.id]: bus } }
  ),
  on(deleteBusSuccess, (state, { id }) => {
    if (state.mapBusesById[id] === undefined) return state;
    const { [id]: _, ...rest } = state.mapBusesById;
    return { ...state, mapBusesById: rest };
  }),
);
