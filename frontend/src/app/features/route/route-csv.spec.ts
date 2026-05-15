import { describe, expect, it } from 'vitest';
import { parseRoutePointsFromCsv } from './route-csv';

describe('parseRoutePointsFromCsv', () => {
  it('parses rows without header', () => {
    const csv = `10.7769,106.7009\n10.7851,106.6967`;
    const r = parseRoutePointsFromCsv(csv);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.points).toHaveLength(2);
    expect(r.points[0]).toEqual({ latitude: 10.7769, longitude: 106.7009 });
  });

  it('skips optional header row', () => {
    const csv = `latitude,longitude\n10,106`;
    const r = parseRoutePointsFromCsv(csv);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.points).toEqual([{ latitude: 10, longitude: 106 }]);
  });

  it('strips UTF-8 BOM', () => {
    const csv = `\uFEFF10,20`;
    const r = parseRoutePointsFromCsv(csv);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.points[0]).toEqual({ latitude: 10, longitude: 20 });
  });

  it('rejects out-of-range latitude', () => {
    const r = parseRoutePointsFromCsv(`91,0`);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toContain('invalid');
  });

  it('rejects empty file', () => {
    expect(parseRoutePointsFromCsv('')).toEqual({
      ok: false,
      error: 'CSV is empty.',
    });
  });
});
