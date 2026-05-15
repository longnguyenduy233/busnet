/**
 * POST /routes/by-ids — batch route geometries for simulator / tracking.
 */

import { FetchHttpError } from './auth-session';

export interface RoutePointDto {
  latitude: number;
  longitude: number;
  order: number;
}

export interface RouteDetail {
  id: string;
  name: string;
  points: RoutePointDto[];
}

/**
 * Builds a cyclic path: points sorted by `order`, then closes the loop unless
 * last already equals first (so the interpolator always has a segment to walk).
 */
export function sortedRouteWaypoints(route: RouteDetail): [number, number][] {
  const pts = [...route.points].sort((a, b) => a.order - b.order);
  const coords: [number, number][] = pts.map((p) => [p.latitude, p.longitude]);
  if (coords.length === 0) return [];
  if (coords.length === 1) return [coords[0], coords[0]];
  const first = coords[0];
  const last = coords[coords.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    coords.push(first);
  }
  return coords;
}

export async function fetchRoutesByIds(
  apiBaseUrl: string,
  token: string,
  routeIds: string[],
  fetchFn: typeof fetch
): Promise<Map<string, RouteDetail>> {
  const unique = Array.from(new Set(routeIds.filter((id) => id?.length > 0)));
  const out = new Map<string, RouteDetail>();
  if (unique.length === 0) return out;

  const res = await fetchFn(`${apiBaseUrl}/routes/by-ids`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ routeIds: unique }),
  });
  if (!res.ok) {
    throw new FetchHttpError(
      `fetchRoutesByIds failed: ${res.status} ${await res.text()}`,
      res.status
    );
  }
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error('routes/by-ids: expected route array JSON');
  }
  for (const r of data as RouteDetail[]) {
    if (r?.id && typeof r.id === 'string') {
      out.set(r.id, r);
    }
  }
  return out;
}
