/**
 * Parses route points from a simple CSV: two columns per row (latitude, longitude).
 * Accepts an optional header row when the first row is not two valid numbers.
 * Decimal separator must be `.` (not `,`).
 */

export type RouteCsvPoint = { latitude: number; longitude: number };

export type ParseRoutePointsCsvResult =
  | { ok: true; points: RouteCsvPoint[] }
  | { ok: false; error: string };

function splitCsvLine(line: string): string[] {
  return line.split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
}

function isValidCoord(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

export function parseRoutePointsFromCsv(raw: string): ParseRoutePointsCsvResult {
  let text = raw.trim();
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return { ok: false, error: 'CSV is empty.' };

  let startIndex = 0;
  const firstCells = splitCsvLine(lines[0]!);
  if (firstCells.length < 2)
    return { ok: false, error: 'Each row must have at least two columns (latitude, longitude).' };

  const a = Number(firstCells[0]);
  const b = Number(firstCells[1]);
  if (Number.isNaN(a) || Number.isNaN(b)) startIndex = 1;

  if (startIndex >= lines.length)
    return { ok: false, error: 'No data rows found after the header.' };

  const points: RouteCsvPoint[] = [];
  for (let i = startIndex; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]!);
    if (cells.length < 2)
      return { ok: false, error: `Row ${i + 1}: need two columns (latitude, longitude).` };
    const lat = Number(cells[0]);
    const lng = Number(cells[1]);
    if (Number.isNaN(lat) || Number.isNaN(lng))
      return { ok: false, error: `Row ${i + 1}: latitude and longitude must be numbers.` };
    if (!isValidCoord(lat, lng))
      return {
        ok: false,
        error: `Row ${i + 1}: invalid latitude (-90..90) or longitude (-180..180).`,
      };
    points.push({ latitude: lat, longitude: lng });
  }

  if (points.length === 0) return { ok: false, error: 'No route points parsed.' };

  return { ok: true, points };
}
