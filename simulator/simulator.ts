/**
 * BusNet GPS Simulator
 *
 * Authenticates (access + refresh JWT), fetches all buses (paged GET /buses),
 * loads each assigned route via POST /routes/by-ids, then sends
 * `/tracking/update-location` every tick while moving along that route's points
 * (sorted by `order`). Buses without `routeId` are skipped.
 *
 * When the access JWT expires, the simulator calls `/auth/refresh`; if the refresh
 * JWT is expired too, it re-logs in with USERNAME/PASSWORD.
 *
 * Usage:
 *   npm install
 *   npx ts-node simulator.ts
 *   npm test
 *
 * Override defaults with environment variables:
 *   API_URL=http://localhost:5000/api
 *   USERNAME=admin
 *   PASSWORD=admin123
 *   INTERVAL_MS=1000
 *   STEP_PER_TICK=0.15   # segment progress each tick (0.001–1); higher = faster
 */

import type { Bus } from './fetch-buses';
import { fetchAllBuses } from './fetch-buses';
import { fetchRoutesByIds, sortedRouteWaypoints } from './fetch-routes-by-ids';
import {
  getFetchHttpStatus,
  loginTokenPair,
  recoverSessionAfterUnauthorized,
  type TokenPair,
} from './auth-session';

const API_URL = process.env['API_URL'] ?? 'http://localhost:5000/api';
const USERNAME = process.env['USERNAME'] ?? 'admin';
const PASSWORD = process.env['PASSWORD'] ?? 'admin123';
const INTERVAL = Number(process.env['INTERVAL_MS'] ?? 1000);

/** Faster default than legacy 0.05; clamp for sane motion (skip/jump capped at full edge/tick). */
const STEP_PER_TICK = (() => {
  const def = 0.15;
  const raw = process.env['STEP_PER_TICK'];
  if (raw === undefined || raw === '') return def;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return def;
  return Math.min(1, Math.max(0.001, n));
})();

interface BusState {
  bus: Bus;
  routePath: [number, number][];
  waypointIndex: number;
  stepProgress: number;
}

async function fetchBusesWithRecovery(session: TokenPair): Promise<Bus[]> {
  try {
    return await fetchAllBuses(API_URL, session.accessToken, 500, fetch);
  } catch (e) {
    if (getFetchHttpStatus(e) === 401) {
      await recoverSessionAfterUnauthorized(API_URL, session, USERNAME, PASSWORD, fetch);
      return await fetchAllBuses(API_URL, session.accessToken, 500, fetch);
    }
    throw e;
  }
}

async function fetchRoutesWithRecovery(
  session: TokenPair,
  routeIds: string[]
) {
  try {
    return await fetchRoutesByIds(API_URL, session.accessToken, routeIds, fetch);
  } catch (e) {
    if (getFetchHttpStatus(e) === 401) {
      await recoverSessionAfterUnauthorized(API_URL, session, USERNAME, PASSWORD, fetch);
      return await fetchRoutesByIds(API_URL, session.accessToken, routeIds, fetch);
    }
    throw e;
  }
}

async function postLocation(
  session: TokenPair,
  busId: string,
  latitude: number,
  longitude: number
): Promise<void> {
  const send = () =>
    fetch(`${API_URL}/tracking/update-location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({ busId, latitude, longitude }),
    });

  let res = await send();
  if (res.status === 401) {
    await recoverSessionAfterUnauthorized(API_URL, session, USERNAME, PASSWORD, fetch);
    res = await send();
  }

  if (!res.ok) {
    console.warn(`[warn] update-location failed for ${busId}: ${res.status}`);
  }
}

function interpolate(
  from: [number, number],
  to: [number, number],
  t: number
): [number, number] {
  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
  ];
}

async function main(): Promise<void> {
  console.log(`[simulator] Connecting to ${API_URL}`);

  let session: TokenPair;
  try {
    session = await loginTokenPair(API_URL, USERNAME, PASSWORD, fetch);
    console.log('[simulator] Authenticated (access + refresh tokens)');
  } catch (err) {
    console.error('[simulator] Authentication error:', err);
    process.exit(1);
  }

  let buses: Bus[];
  try {
    buses = await fetchBusesWithRecovery(session);
    console.log(`[simulator] Found ${buses.length} bus(es)`);
  } catch (err) {
    console.error('[simulator] Could not fetch buses:', err);
    process.exit(1);
  }

  const routedBuses = buses.filter((b) => b.routeId);
  const skippedNoRoute = buses.length - routedBuses.length;
  if (skippedNoRoute > 0) {
    console.log(
      `[simulator] Skipping ${skippedNoRoute} bus(es) without an assigned route`
    );
  }

  if (routedBuses.length === 0) {
    console.warn(
      '[simulator] No buses with RouteId — assign routes before running.'
    );
    process.exit(0);
  }

  let routeMap;
  try {
    routeMap = await fetchRoutesWithRecovery(
      session,
      routedBuses.map((b) => b.routeId!)
    );
    console.log(`[simulator] Loaded ${routeMap.size} route(s) via by-ids`);
  } catch (err) {
    console.error('[simulator] Could not fetch route geometry:', err);
    process.exit(1);
  }

  const busStates: BusState[] = [];
  for (const bus of routedBuses) {
    const detail = routeMap.get(bus.routeId!);
    if (!detail?.points?.length) {
      console.warn(
        `[warn] Bus "${bus.name}" (${bus.id}) has routeId but no usable points — skipping`
      );
      continue;
    }
    const routePath = sortedRouteWaypoints(detail);
    if (routePath.length < 2) {
      console.warn(
        `[warn] Bus "${bus.name}" route geometry too short — skipping`
      );
      continue;
    }
    busStates.push({
      bus,
      routePath,
      waypointIndex: 0,
      stepProgress: 0,
    });
  }

  if (busStates.length === 0) {
    console.warn(
      '[simulator] No runnable buses — check routes include at least two distinct points'
    );
    process.exit(0);
  }

  for (const state of busStates) {
    const [lat0, lng0] = state.routePath[0]!;
    await postLocation(session, state.bus.id, lat0, lng0);
    console.log(
      `[simulator] ${state.bus.name.padEnd(12)} seed   → (${lat0.toFixed(5)}, ${lng0.toFixed(5)})`
    );
  }

  console.log(
    `[simulator] Starting updates every ${INTERVAL}ms (STEP_PER_TICK=${STEP_PER_TICK}) …`
  );

  setInterval(async () => {
    const updates = busStates.map(async (state) => {
      const path = state.routePath;
      const from = path[state.waypointIndex];
      const next = path[(state.waypointIndex + 1) % path.length];
      const [lat, lng] = interpolate(from, next, state.stepProgress);

      state.stepProgress += STEP_PER_TICK;
      if (state.stepProgress >= 1) {
        state.stepProgress -= 1;
        state.waypointIndex = (state.waypointIndex + 1) % path.length;
      }

      await postLocation(session, state.bus.id, lat, lng);
      console.log(
        `[simulator] ${state.bus.name.padEnd(12)} → (${lat.toFixed(5)}, ${lng.toFixed(5)})`
      );
    });

    await Promise.all(updates);
  }, INTERVAL);
}

main().catch((err) => {
  console.error('[simulator] Fatal error:', err);
  process.exit(1);
});
