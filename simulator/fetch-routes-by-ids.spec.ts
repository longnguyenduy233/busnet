import { describe, expect, it, vi } from 'vitest';
import {
  fetchRoutesByIds,
  sortedRouteWaypoints,
  type RouteDetail,
} from './fetch-routes-by-ids';

describe('sortedRouteWaypoints', () => {
  it('sorts by order and appends first when path is open', () => {
    const r: RouteDetail = {
      id: 'r1',
      name: 'Loop',
      points: [
        { latitude: 2, longitude: 20, order: 2 },
        { latitude: 0, longitude: 10, order: 0 },
        { latitude: 1, longitude: 15, order: 1 },
      ],
    };
    expect(sortedRouteWaypoints(r)).toEqual([
      [0, 10],
      [1, 15],
      [2, 20],
      [0, 10],
    ]);
  });

  it('does not duplicate when last equals first', () => {
    const r: RouteDetail = {
      id: 'closed',
      name: 'Closed',
      points: [
        { latitude: 0, longitude: 0, order: 0 },
        { latitude: 1, longitude: 1, order: 1 },
        { latitude: 0, longitude: 0, order: 2 },
      ],
    };
    expect(sortedRouteWaypoints(r)).toEqual([
      [0, 0],
      [1, 1],
      [0, 0],
    ]);
  });

  it('handles single-point route as degenerate segment', () => {
    const r: RouteDetail = {
      id: 'pt',
      name: 'Dot',
      points: [{ latitude: 5.5, longitude: 106.7, order: 0 }],
    };
    expect(sortedRouteWaypoints(r)).toEqual([
      [5.5, 106.7],
      [5.5, 106.7],
    ]);
  });

  it('returns [] for zero points', () => {
    const r: RouteDetail = {
      id: 'empty',
      name: 'E',
      points: [],
    };
    expect(sortedRouteWaypoints(r)).toEqual([]);
  });
});

describe('fetchRoutesByIds', () => {
  const api = 'http://localhost:5000/api';
  const token = 'tok';

  it('posts routeIds deduped and maps by id', async () => {
    const dup = new Array<string>(101).fill('a-id');
    dup[5] = 'b-id';

    const body: RouteDetail[] = [
      { id: 'a-id', name: 'A', points: [{ latitude: 1, longitude: 2, order: 0 }] },
      { id: 'b-id', name: 'B', points: [] },
    ];
    const fetchFn = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), { status: 200 })
    );

    const map = await fetchRoutesByIds(api, token, dup, fetchFn);

    expect(fetchFn).toHaveBeenCalledTimes(1);
    const call = fetchFn.mock.calls[0]!;
    expect(call![0]).toBe(`${api}/routes/by-ids`);
    expect(call![1]).toMatchObject({
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    expect(JSON.parse((call![1] as RequestInit).body as string)).toEqual({
      routeIds: ['a-id', 'b-id'],
    });
    expect(map.get('a-id')?.name).toBe('A');
    expect(map.get('b-id')?.name).toBe('B');
    expect(map.size).toBe(2);
  });

  it('returns empty map for empty ids (no HTTP)', async () => {
    const fetchFn = vi.fn();
    const map = await fetchRoutesByIds(api, token, [], fetchFn);
    expect(map.size).toBe(0);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('throws on non-OK', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(new Response('nope', { status: 401 }));

    await expect(fetchRoutesByIds(api, token, ['x'], fetchFn)).rejects.toMatchObject({
      name: 'FetchHttpError',
      status: 401,
    });
  });

  it('throws when body is not an array', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));

    await expect(
      fetchRoutesByIds(api, token, ['x'], fetchFn)
    ).rejects.toThrow(/expected route array/);
  });
});
