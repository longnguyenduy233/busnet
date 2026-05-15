import { describe, expect, it, vi } from 'vitest';
import { fetchAllBuses, parseBusesPage } from './fetch-buses';

describe('parseBusesPage', () => {
  const pageSize = 500;

  it('returns legacy JSON array as one page', () => {
    const raw = [
      { id: 'a', name: 'A1' },
      { id: 'b', name: 'B1' },
    ];
    expect(parseBusesPage(raw, pageSize)).toEqual({
      items: raw,
      done: true,
    });
  });

  it('parses paged body and stops when last page is short', () => {
    const raw = {
      items: [{ id: '1', name: 'Bus 1' }],
      totalCount: 1,
      page: 1,
      pageSize: 500,
    };
    expect(parseBusesPage(raw, pageSize)).toEqual({
      items: raw.items,
      done: true,
    });
  });

  it('continues paging when items length fills the page', () => {
    const items = Array.from({ length: pageSize }, (_, i) => ({
      id: `id-${i}`,
      name: `Bus ${i}`,
    }));
    const raw = {
      items,
      totalCount: items.length + 1,
      page: 1,
      pageSize,
    };
    expect(parseBusesPage(raw, pageSize)).toEqual({
      items,
      done: false,
    });
  });

  it('throws on unexpected JSON', () => {
    expect(() => parseBusesPage({}, pageSize)).toThrow(/Unexpected buses/);
    expect(() =>
      parseBusesPage({ items: 'bad' }, pageSize)
    ).toThrow(/Unexpected buses/);
    expect(() => parseBusesPage(null, pageSize)).toThrow(/Unexpected buses/);
  });
});

describe('fetchAllBuses', () => {
  const api = 'http://localhost:5000/api';
  const token = 'tok';

  it('calls fetch with paging query params and merges multiple pages', async () => {
    const pageSize = 2;
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            items: [
              { id: 'a', name: 'A' },
              { id: 'b', name: 'B' },
            ],
            totalCount: 3,
            page: 1,
            pageSize,
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            items: [{ id: 'c', name: 'C' }],
            totalCount: 3,
            page: 2,
            pageSize,
          }),
          { status: 200 }
        )
      );

    const buses = await fetchAllBuses(api, token, pageSize, fetchFn);

    expect(buses.map((b) => b.id)).toEqual(['a', 'b', 'c']);
    expect(fetchFn).toHaveBeenCalledTimes(2);
    expect(fetchFn.mock.calls[0]?.[0]).toContain(`${api}/buses?`);
    expect(fetchFn.mock.calls[0]?.[0]).toContain('page=1');
    expect(fetchFn.mock.calls[0]?.[0]).toContain(`pageSize=${pageSize}`);
    expect(fetchFn.mock.calls[1]?.[0]).toContain('page=2');
    expect(fetchFn.mock.calls[0]?.[1]).toMatchObject({
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  it('stops after one legacy array response', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify([{ id: 'x', name: 'X' }]), { status: 200 })
    );

    const buses = await fetchAllBuses(api, token, 500, fetchFn);
    expect(buses).toEqual([{ id: 'x', name: 'X' }]);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('throws when response is not ok', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 503 }));

    await expect(fetchAllBuses(api, token, 10, fetchFn)).rejects.toMatchObject({
      name: 'FetchHttpError',
      status: 503,
    });
  });
});
