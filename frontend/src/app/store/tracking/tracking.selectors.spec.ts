import { describe, expect, it } from 'vitest';
import { TrackingState } from './tracking.reducer';
import {
  selectBusTrackingEntry,
  selectTrackingEntities,
  selectTrackingState
} from './tracking.selectors';

const makeState = (entities: TrackingState['entities'] = {}): { tracking: TrackingState } => ({
  tracking: { entities }
});

const entry = (lat: number, lng: number, historyLen = 0) => ({
  currentPosition: { latitude: lat, longitude: lng },
  history: Array.from({ length: historyLen }, (_, i) => ({ latitude: lat + i * 0.001, longitude: lng }))
});

describe('tracking selectors', () => {
  // ── selectTrackingState ────────────────────────────────────────────────────

  it('selectTrackingState returns the tracking slice', () => {
    const state = makeState({ 'b1': entry(10.77, 106.70) });
    expect(selectTrackingState(state)).toEqual(state.tracking);
  });

  // ── selectTrackingEntities ─────────────────────────────────────────────────

  it('selectTrackingEntities returns empty object when no updates received', () => {
    expect(selectTrackingEntities(makeState())).toEqual({});
  });

  it('selectTrackingEntities returns all bus entries', () => {
    const entities = {
      'bus-1': entry(10.77, 106.70),
      'bus-2': entry(10.80, 106.75)
    };
    expect(selectTrackingEntities(makeState(entities))).toEqual(entities);
  });

  it('selectTrackingEntities is memoized — returns same reference for same state', () => {
    const state = makeState({ 'bus-1': entry(10.77, 106.70) });
    expect(selectTrackingEntities(state)).toBe(selectTrackingEntities(state));
  });

  // ── selectBusTrackingEntry ─────────────────────────────────────────────────

  it('selectBusTrackingEntry returns undefined for a bus with no data', () => {
    const state = makeState();
    expect(selectBusTrackingEntry('bus-unknown')(state)).toBeUndefined();
  });

  it('selectBusTrackingEntry returns the correct entry for a known bus', () => {
    const e = entry(10.7769, 106.7009, 3);
    const state = makeState({ 'bus-42': e });
    expect(selectBusTrackingEntry('bus-42')(state)).toEqual(e);
  });

  it('selectBusTrackingEntry does not return data for a different bus', () => {
    const state = makeState({ 'bus-1': entry(10.77, 106.70) });
    expect(selectBusTrackingEntry('bus-2')(state)).toBeUndefined();
  });

  it('selectBusTrackingEntry reflects updated currentPosition', () => {
    const state = makeState({
      'bus-1': { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [] }
    });
    const result = selectBusTrackingEntry('bus-1')(state);
    expect(result?.currentPosition).toEqual({ latitude: 10.78, longitude: 106.71 });
  });

  it('selectBusTrackingEntry reflects history length', () => {
    const state = makeState({ 'bus-1': entry(10.77, 106.70, 5) });
    expect(selectBusTrackingEntry('bus-1')(state)?.history).toHaveLength(5);
  });

  it('selectBusTrackingEntry for two different buses returns independent results', () => {
    const state = makeState({
      'bus-A': entry(10.77, 106.70),
      'bus-B': entry(10.80, 106.75)
    });
    expect(selectBusTrackingEntry('bus-A')(state)?.currentPosition.latitude).toBe(10.77);
    expect(selectBusTrackingEntry('bus-B')(state)?.currentPosition.latitude).toBe(10.80);
  });
});
