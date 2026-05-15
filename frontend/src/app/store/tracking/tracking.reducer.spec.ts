import { describe, expect, it } from 'vitest';
import { busLocationReceived } from './tracking.actions';
import {
  GeoPoint,
  trackingReducer,
  TrackingState
} from './tracking.reducer';

const emptyState: TrackingState = { entities: {} };

const loc = (busId: string, lat: number, lng: number) =>
  busLocationReceived({ location: { busId, latitude: lat, longitude: lng, timestamp: '' } });

describe('trackingReducer', () => {
  // ── Initial state ──────────────────────────────────────────────────────────

  it('returns the initial state for an unknown action', () => {
    const state = trackingReducer(undefined, { type: '__UNKNOWN__' } as any);
    expect(state).toEqual(emptyState);
  });

  it('initial entities map is empty', () => {
    const state = trackingReducer(undefined, { type: '__UNKNOWN__' } as any);
    expect(state.entities).toEqual({});
  });

  // ── busLocationReceived — first update ─────────────────────────────────────

  it('adds a new entry for a bus seen for the first time', () => {
    const state = trackingReducer(emptyState, loc('bus-1', 10.77, 106.70));
    expect(state.entities['bus-1']).toBeDefined();
  });

  it('sets currentPosition from the first location update', () => {
    const state = trackingReducer(emptyState, loc('bus-1', 10.7769, 106.7009));
    expect(state.entities['bus-1'].currentPosition).toEqual<GeoPoint>({
      latitude: 10.7769,
      longitude: 106.7009
    });
  });

  it('starts history with the first point', () => {
    const state = trackingReducer(emptyState, loc('bus-1', 10.77, 106.70));
    expect(state.entities['bus-1'].history).toHaveLength(1);
    expect(state.entities['bus-1'].history[0]).toEqual({ latitude: 10.77, longitude: 106.70 });
  });

  // ── busLocationReceived — subsequent updates ───────────────────────────────

  it('updates currentPosition on subsequent location for the same bus', () => {
    let state = trackingReducer(emptyState, loc('bus-1', 10.77, 106.70));
    state = trackingReducer(state, loc('bus-1', 10.78, 106.71));
    expect(state.entities['bus-1'].currentPosition).toEqual({ latitude: 10.78, longitude: 106.71 });
  });

  it('appends each new point to history', () => {
    let state = trackingReducer(emptyState, loc('bus-1', 10.77, 106.70));
    state = trackingReducer(state, loc('bus-1', 10.78, 106.71));
    state = trackingReducer(state, loc('bus-1', 10.79, 106.72));
    expect(state.entities['bus-1'].history).toHaveLength(3);
    expect(state.entities['bus-1'].history[2]).toEqual({ latitude: 10.79, longitude: 106.72 });
  });

  it('tracks multiple buses independently', () => {
    let state = trackingReducer(emptyState, loc('bus-1', 10.77, 106.70));
    state = trackingReducer(state, loc('bus-2', 10.80, 106.75));
    expect(state.entities['bus-1'].currentPosition.latitude).toBe(10.77);
    expect(state.entities['bus-2'].currentPosition.latitude).toBe(10.80);
  });

  it('does not affect other bus entries when one bus is updated', () => {
    let state = trackingReducer(emptyState, loc('bus-1', 10.77, 106.70));
    state = trackingReducer(state, loc('bus-2', 10.80, 106.75));
    const before = state.entities['bus-1'];

    state = trackingReducer(state, loc('bus-2', 10.81, 106.76));

    expect(state.entities['bus-1']).toBe(before); // same reference — not mutated
  });

  // ── Full history (no FIFO cap) ────────────────────────────────────────────

  it('accumulates history beyond former 100-point cap', () => {
    let state = emptyState;
    const n = 150;
    for (let i = 0; i < n; i++) {
      state = trackingReducer(state, loc('bus-1', 10 + i * 0.001, 106));
    }
    expect(state.entities['bus-1'].history).toHaveLength(n);
    expect(state.entities['bus-1'].history[0].latitude).toBe(10);
    expect(state.entities['bus-1'].history[n - 1].latitude).toBeCloseTo(10 + (n - 1) * 0.001, 5);
  });

  it('preserves oldest point after many updates (no eviction)', () => {
    let state = emptyState;
    state = trackingReducer(state, loc('bus-1', 10.000, 106));
    for (let i = 1; i < 200; i++) {
      state = trackingReducer(state, loc('bus-1', 10 + i * 0.001, 106));
    }
    expect(state.entities['bus-1'].history[0]).toEqual({
      latitude: 10.0,
      longitude: 106,
    });
    expect(state.entities['bus-1'].history).toHaveLength(200);
  });

  // ── Immutability ───────────────────────────────────────────────────────────

  it('does not mutate the previous state object', () => {
    const before = emptyState;
    const after = trackingReducer(before, loc('bus-1', 10.77, 106.70));
    expect(after).not.toBe(before);
    expect(before.entities).toEqual({});
  });

  it('does not mutate the previous entities reference', () => {
    const state1 = trackingReducer(emptyState, loc('bus-1', 10.77, 106.70));
    const entitiesBefore = state1.entities;
    const state2 = trackingReducer(state1, loc('bus-1', 10.78, 106.71));
    expect(state2.entities).not.toBe(entitiesBefore);
  });

  it('does not mutate the history array of an existing entry', () => {
    const state1 = trackingReducer(emptyState, loc('bus-1', 10.77, 106.70));
    const historyBefore = state1.entities['bus-1'].history;
    const state2 = trackingReducer(state1, loc('bus-1', 10.78, 106.71));
    expect(state2.entities['bus-1'].history).not.toBe(historyBefore);
    expect(historyBefore).toHaveLength(1); // original array unmodified
  });
});
