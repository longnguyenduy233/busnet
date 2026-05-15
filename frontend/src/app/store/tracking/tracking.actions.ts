import { createAction, props } from '@ngrx/store';
import { BusLocation } from '../../core/models/bus-location.model';

export const busLocationReceived = createAction(
  '[Tracking] Bus Location Received',
  props<{ location: BusLocation }>()
);
