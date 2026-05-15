import { createAction, props } from '@ngrx/store';
import { Bus, BusQueryParams, CreateBusDto, UpdateBusDto } from '../../core/models/bus.model';

export const loadBuses = createAction('[Bus] Load Buses', props<BusQueryParams>());
export const loadBusesSuccess = createAction('[Bus] Load Buses Success', props<{
  buses: Bus[];
  total: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}>());
export const loadBusesFailure = createAction('[Bus] Load Buses Failure', props<{ error: string }>());

/** GET /buses/:id when the user opts a bus onto the Tracking map roster. */
export const fetchBusForTrackingMap = createAction(
  '[Bus] Fetch Bus For Tracking Map',
  props<{ busId: string }>()
);
export const fetchBusForTrackingMapSuccess = createAction(
  '[Bus] Fetch Bus For Tracking Map Success',
  props<{ bus: Bus }>()
);
export const fetchBusForTrackingMapFailure = createAction(
  '[Bus] Fetch Bus For Tracking Map Failure',
  props<{ busId: string; error: string }>()
);

export const removeBusFromTrackingMap = createAction(
  '[Bus] Remove Bus From Tracking Map',
  props<{ busId: string }>()
);

/** Clear map roster when the user leaves Tracking (fresh session next visit). */
export const clearTrackingMapSelection = createAction('[Bus] Clear Tracking Map Selection');

export const createBus = createAction('[Bus] Create Bus', props<{ dto: CreateBusDto }>());
export const createBusSuccess = createAction('[Bus] Create Bus Success', props<{ bus: Bus }>());
export const createBusFailure = createAction('[Bus] Create Bus Failure', props<{ error: string }>());

export const updateBus = createAction('[Bus] Update Bus', props<{ id: string; dto: UpdateBusDto }>());
export const updateBusSuccess = createAction('[Bus] Update Bus Success', props<{ bus: Bus }>());
export const updateBusFailure = createAction('[Bus] Update Bus Failure', props<{ error: string }>());

export const deleteBus = createAction('[Bus] Delete Bus', props<{ id: string }>());
export const deleteBusSuccess = createAction('[Bus] Delete Bus Success', props<{ id: string }>());
export const deleteBusFailure = createAction('[Bus] Delete Bus Failure', props<{ error: string }>());

export const assignRoute = createAction('[Bus] Assign Route', props<{ busId: string; routeId: string }>());
export const assignRouteSuccess = createAction('[Bus] Assign Route Success', props<{ bus: Bus }>());
export const assignRouteFailure = createAction('[Bus] Assign Route Failure', props<{ error: string }>());

export const unassignRoute = createAction('[Bus] Unassign Route', props<{ busId: string }>());
export const unassignRouteSuccess = createAction('[Bus] Unassign Route Success', props<{ bus: Bus }>());
export const unassignRouteFailure = createAction('[Bus] Unassign Route Failure', props<{ error: string }>());
