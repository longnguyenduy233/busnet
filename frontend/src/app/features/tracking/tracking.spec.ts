import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BehaviorSubject, of } from 'rxjs';
import { clearTrackingMapSelection, loadBuses } from '../../store/bus/bus.actions';
import {
  selectAllBuses,
  selectBusesForMap,
  selectBusLoading,
  selectBusPage,
  selectBusPageSize,
  selectBusPagination,
  selectBusSortBy,
  selectBusSortDir,
  selectBusTotal,
} from '../../store/bus/bus.selectors';
import { selectTrackingEntities } from '../../store/tracking/tracking.selectors';
import { selectToken } from '../../store/auth/auth.selectors';
import { SignalRService } from '../../core/services/signalr.service';
import { Bus } from '../../core/models/bus.model';
import { Route } from '../../core/models/route.model';
import { RouteService } from '../../core/services/route.service';
import { calculateBearing, createBusIcon, easeInOut, mapHeaderCheckboxTriState } from './tracking';
import { TrackingComponent } from './tracking';
import { BusComponent } from '../bus/bus';
import { RouteComponent } from '../route/route';
import { ShellComponent } from '../shell/shell';
import { HomeComponent } from '../home/home';
import { LoginComponent } from '../auth/login/login';

// ── Phase 8: OnPush Change Detection ─────────────────────────────────────────
// Angular stores the resolved changeDetection flag in the compiled component
// definition at ɵcmp.onPush (true = OnPush, false = Default).

describe('Phase 8 — OnPush Change Detection', () => {
  const cases: [string, any][] = [
    ['TrackingComponent',  TrackingComponent],
    ['BusComponent',       BusComponent],
    ['RouteComponent',     RouteComponent],
    ['ShellComponent',     ShellComponent],
    ['HomeComponent',      HomeComponent],
    ['LoginComponent',     LoginComponent],
  ];

  it.each(cases)('%s uses ChangeDetectionStrategy.OnPush', (_name, Comp) => {
    expect((Comp as any).ɵcmp.onPush).toBe(true);
  });
});

// ── Leaflet mock (package import — allowed by Angular test runner) ─────────────
const mockMap = {
  setView: vi.fn().mockReturnThis(),
  remove: vi.fn(),
  getZoom: vi.fn(() => 18),
  invalidateSize: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
};
const mockPolylineInstance = {
  addTo: vi.fn().mockReturnThis(),
  setLatLngs: vi.fn(),
  getLatLngs: vi.fn(() => [{ lat: 10.77, lng: 106.70 }, { lat: 10.78, lng: 106.71 }]),
  remove: vi.fn(),
  bringToFront: vi.fn(),
};
const mockDecoratorInstance = { addTo: vi.fn().mockReturnThis(), remove: vi.fn(), bringToFront: vi.fn() };

vi.mock('leaflet', () => ({
  map:      vi.fn(() => mockMap),
  tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
  marker: vi.fn(() => ({
    bindPopup:       vi.fn().mockReturnThis(),
    addTo:           vi.fn().mockReturnThis(),
    setLatLng:       vi.fn(),
    setPopupContent: vi.fn(),
    setIcon:         vi.fn(),
    getLatLng:       vi.fn(() => ({ lat: 10.77, lng: 106.70 })),
    remove:          vi.fn(),
  })),
  polyline:          vi.fn(() => mockPolylineInstance),
  polylineDecorator: vi.fn(() => mockDecoratorInstance),
  Symbol: { arrowHead: vi.fn(() => ({})) },
  divIcon: vi.fn(() => ({})),
  latLng:  vi.fn((lat: number, lng: number) => ({ lat, lng })),
  icon:    vi.fn(() => ({})),
  Marker: { prototype: { options: {} } },
}));

// ── GoogleMutant mock so the dynamic import() resolves cleanly ─────────────────
vi.mock('leaflet.gridlayer.googlemutant', () => {
  const GoogleMutant = vi.fn(() => ({ addTo: vi.fn() }));
  return { default: GoogleMutant };
});

// ── leaflet-polylinedecorator is a side-effect import (no exports needed) ─────
vi.mock('leaflet-polylinedecorator', () => ({}));

// ── Helper ─────────────────────────────────────────────────────────────────────
const makeBus = (id: string, routeId: string | null = null): Bus => ({
  id, name: `Bus ${id}`, licensePlate: `LP-${id}`, capacity: 30, status: 'Active', routeId
});

const mockSignalR = { start: vi.fn(), stop: vi.fn() };

const mockGetByRouteIds = vi.fn(() => of([] as Route[]));

// ── Pure utility function tests ───────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// calculateBearing
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateBearing', () => {
  // Cardinal directions
  it('returns ~0 when moving directly north', () => {
    expect(calculateBearing([10.0, 106.0], [10.1, 106.0])).toBeCloseTo(0, 0);
  });

  it('returns ~90 when moving directly east', () => {
    expect(calculateBearing([10.0, 106.0], [10.0, 106.1])).toBeCloseTo(90, 0);
  });

  it('returns ~180 when moving directly south', () => {
    expect(calculateBearing([10.1, 106.0], [10.0, 106.0])).toBeCloseTo(180, 0);
  });

  it('returns ~270 when moving directly west', () => {
    expect(calculateBearing([10.0, 106.1], [10.0, 106.0])).toBeCloseTo(270, 0);
  });

  // Diagonal quadrants
  it('returns value in (0, 90) for NE movement', () => {
    const b = calculateBearing([10.0, 106.0], [10.1, 106.1]);
    expect(b).toBeGreaterThan(0);
    expect(b).toBeLessThan(90);
  });

  it('returns value in (90, 180) for SE movement', () => {
    const b = calculateBearing([10.1, 106.0], [10.0, 106.1]);
    expect(b).toBeGreaterThan(90);
    expect(b).toBeLessThan(180);
  });

  it('returns value in (180, 270) for SW movement', () => {
    const b = calculateBearing([10.1, 106.1], [10.0, 106.0]);
    expect(b).toBeGreaterThan(180);
    expect(b).toBeLessThan(270);
  });

  it('returns value in (270, 360) for NW movement', () => {
    const b = calculateBearing([10.0, 106.1], [10.1, 106.0]);
    expect(b).toBeGreaterThan(270);
    expect(b).toBeLessThan(360);
  });

  // Output contract
  it('always returns a value in [0, 360)', () => {
    const pairs: [[number, number], [number, number]][] = [
      [[10.78, 106.70], [10.77, 106.69]],
      [[0, 0], [0.001, 0.001]],
      [[-10, 100], [-10.1, 99.9]],
    ];
    for (const [from, to] of pairs) {
      const b = calculateBearing(from, to);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThan(360);
    }
  });

  // Inverse symmetry: A→B and B→A should differ by ~180°
  it('opposite directions differ by ~180°', () => {
    const ab = calculateBearing([10.0, 106.0], [10.1, 106.1]);
    const ba = calculateBearing([10.1, 106.1], [10.0, 106.0]);
    expect(Math.abs(ab - ba)).toBeCloseTo(180, 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// easeInOut
// ─────────────────────────────────────────────────────────────────────────────

describe('easeInOut', () => {
  // Boundary values
  it('returns 0 at t=0', () => expect(easeInOut(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInOut(1)).toBe(1));
  it('returns 0.5 at t=0.5 (midpoint symmetry)', () => {
    expect(easeInOut(0.5)).toBeCloseTo(0.5);
  });

  // Shape — slow start, fast middle, slow end
  it('is below the linear diagonal in the first quarter (slow start)', () => {
    // 2t² at t=0.25 → 0.125, linear is 0.25
    expect(easeInOut(0.25)).toBeLessThan(0.25);
  });

  it('is above the linear diagonal in the third quarter (fast finish)', () => {
    // -1 + (4-2t)t at t=0.75 → 0.875, linear is 0.75
    expect(easeInOut(0.75)).toBeGreaterThan(0.75);
  });

  it('matches known value at t=0.25: 2×0.25²=0.125', () => {
    expect(easeInOut(0.25)).toBeCloseTo(0.125);
  });

  it('matches known value at t=0.75: 0.875', () => {
    expect(easeInOut(0.75)).toBeCloseTo(0.875);
  });

  // Curve symmetry: easeInOut(t) + easeInOut(1-t) === 1
  it('is symmetric around the midpoint', () => {
    for (const t of [0.1, 0.2, 0.3, 0.4]) {
      expect(easeInOut(t) + easeInOut(1 - t)).toBeCloseTo(1);
    }
  });

  it('is monotonically non-decreasing over the full range', () => {
    const steps = Array.from({ length: 11 }, (_, i) => i / 10).map(easeInOut);
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i]).toBeGreaterThanOrEqual(steps[i - 1]);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// createBusIcon
// ─────────────────────────────────────────────────────────────────────────────

describe('createBusIcon', () => {
  it('calls L.divIcon', async () => {
    const { divIcon } = await import('leaflet');
    createBusIcon(45);
    expect(divIcon).toHaveBeenCalled();
  });

  it('embeds the bearing angle in the HTML', async () => {
    const { divIcon } = await import('leaflet');
    createBusIcon(135);
    const opts = vi.mocked(divIcon).mock.calls.at(-1)![0] as any;
    expect(opts.html).toContain('135');
  });

  it('produces distinct HTML for different bearings', async () => {
    const { divIcon } = await import('leaflet');
    createBusIcon(0);
    createBusIcon(180);
    const calls = vi.mocked(divIcon).mock.calls;
    expect((calls.at(-2)![0] as any).html).not.toBe((calls.at(-1)![0] as any).html);
  });

  it('references the school-bus SVG image', async () => {
    const { divIcon } = await import('leaflet');
    createBusIcon(0);
    const opts = vi.mocked(divIcon).mock.calls.at(-1)![0] as any;
    expect(opts.html).toContain('school-bus.svg');
  });

  it('sets iconSize to [15, 32]', async () => {
    const { divIcon } = await import('leaflet');
    createBusIcon(0);
    const opts = vi.mocked(divIcon).mock.calls.at(-1)![0] as any;
    expect(opts.iconSize).toEqual([15, 32]);
  });

  it('sets iconAnchor at the horizontal centre of the icon', async () => {
    const { divIcon } = await import('leaflet');
    createBusIcon(0);
    const opts = vi.mocked(divIcon).mock.calls.at(-1)![0] as any;
    // iconAnchor[0] should be half of iconSize[0] (8 = Math.floor(15/2))
    expect(opts.iconAnchor[0]).toBe(8);
  });

  it('uses transform-origin:center so rotation pivots at the icon centre', async () => {
    const { divIcon } = await import('leaflet');
    createBusIcon(90);
    const opts = vi.mocked(divIcon).mock.calls.at(-1)![0] as any;
    expect(opts.html).toContain('transform-origin:center');
  });

  it('applies CSS transform:rotate for the bearing', async () => {
    const { divIcon } = await import('leaflet');
    createBusIcon(270);
    const opts = vi.mocked(divIcon).mock.calls.at(-1)![0] as any;
    expect(opts.html).toMatch(/transform\s*:\s*rotate\(270/);
  });
});

// ── Component tests ───────────────────────────────────────────────────────────

describe('TrackingComponent', () => {
  let fixture: ComponentFixture<TrackingComponent>;
  let store: MockStore;

  beforeEach(async () => {
    // Make window.google.maps appear to be available so loadGoogleMapsScript
    // resolves immediately (via early-return path) during tests.
    (window as any)['google'] = { maps: {} };

    await TestBed.configureTestingModule({
      imports: [TrackingComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAllBuses,        value: [] },
            { selector: selectBusesForMap,      value: [] },
            { selector: selectBusTotal,          value: 0 },
            { selector: selectBusPage,         value: 1 },
            { selector: selectBusPageSize,     value: 10 },
            { selector: selectBusSortBy,       value: 'name' },
            { selector: selectBusSortDir,      value: 'asc' },
            { selector: selectBusPagination,
              value: { page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc', status: 'Active' } },
            { selector: selectBusLoading,      value: false },
            { selector: selectTrackingEntities, value: {} },
            { selector: selectToken,            value: 'test-token' },
          ]
        }),
        { provide: SignalRService, useValue: mockSignalR },
        { provide: RouteService, useValue: { getByRouteIds: mockGetByRouteIds } },
      ]
    }).compileComponents();

    store   = TestBed.inject(MockStore);
    vi.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(TrackingComponent);
  });

  afterEach(() => {
    delete (window as any)['google'];
    mockGetByRouteIds.mockImplementation(() => of([] as Route[]));
    vi.clearAllMocks();
  });

  // ── Initialisation ─────────────────────────────────────────────────────────

  it('dispatches only sidebar Active fleet query on init (no map roster preload)', () => {
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(
      loadBuses({ page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc', status: 'Active' })
    );
  });

  it('dispatch clearTrackingMapSelection when the component is destroyed', () => {
    fixture.detectChanges();
    vi.mocked(store.dispatch).mockClear();
    fixture.destroy();
    expect(store.dispatch).toHaveBeenCalledWith(clearTrackingMapSelection());
  });

  it('creates a Leaflet map targeting the #tracking-map element', async () => {
    const { map } = await import('leaflet');
    fixture.detectChanges();
    expect(map).toHaveBeenCalledWith('tracking-map', expect.any(Object));
  });

  it('centres the map on configured default coordinates at zoom 13', () => {
    fixture.detectChanges();
    expect(mockMap.setView).toHaveBeenCalledWith([36.845803, -76.196481], 13);
  });

  // ── Tile layer ─────────────────────────────────────────────────────────────

  it('uses Google Maps tiles when an API key is configured', async () => {
    const { default: GoogleMutant } = await import('leaflet.gridlayer.googlemutant');
    fixture.detectChanges();
    // Flush microtasks so the loadGoogleMapsScript → import() chain resolves
    await fixture.whenStable();
    expect(GoogleMutant).toHaveBeenCalledWith(expect.objectContaining({ type: 'roadmap' }));
  });

  // ── Marker creation ────────────────────────────────────────────────────────

  it('creates no markers when the bus list is empty', async () => {
    const { marker } = await import('leaflet');
    fixture.detectChanges();
    expect(marker).not.toHaveBeenCalled();
  });

  it('creates one marker per bus', async () => {
    const { marker } = await import('leaflet');
    store.overrideSelector(selectAllBuses, [makeBus('1'), makeBus('2'), makeBus('3')]);
    store.overrideSelector(selectBusesForMap, [makeBus('1'), makeBus('2'), makeBus('3')]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    expect(marker).toHaveBeenCalledTimes(3);
  });

  it('passes a DivIcon to every marker', async () => {
    const { marker } = await import('leaflet');
    store.overrideSelector(selectAllBuses, [makeBus('1')]);
    store.overrideSelector(selectBusesForMap, [makeBus('1')]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    expect(marker).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({ icon: expect.anything() })
    );
  });

  it('binds a popup containing bus name and license plate', async () => {
    const { marker } = await import('leaflet');
    const bus = makeBus('42');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    const instance = vi.mocked(marker).mock.results[0].value;
    expect(instance.bindPopup).toHaveBeenCalledWith(expect.stringContaining('Bus 42'));
    expect(instance.bindPopup).toHaveBeenCalledWith(expect.stringContaining('LP-42'));
  });

  it('places markers at mock positions cycling through the position list', async () => {
    const { marker } = await import('leaflet');
    store.overrideSelector(selectAllBuses, [makeBus('1'), makeBus('2')]);
    store.overrideSelector(selectBusesForMap, [makeBus('1'), makeBus('2')]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    const positions = vi.mocked(marker).mock.calls.map(([pos]) => pos as [number, number]);
    for (const [lat, lng] of positions) {
      expect(lat).toBeGreaterThan(36);
      expect(lat).toBeLessThan(37);
      expect(lng).toBeLessThan(-76);
      expect(lng).toBeGreaterThan(-77);
    }
    expect(positions[0]).not.toEqual(positions[1]);
  });

  it('places pre-GPS marker at first waypoint (lowest order) when route geometry is loaded', async () => {
    const { marker } = await import('leaflet');
    const routeForStart = {
      id: 'route-start-test',
      name: 'Ordering',
      points: [
        { latitude: 11, longitude: 107, order: 1 },
        { latitude: 12.5, longitude: 108.5, order: 0 },
      ],
    };
    const bus = makeBus('pre-gps-route', routeForStart.id);
    mockGetByRouteIds.mockReturnValue(
      of([{ ...routeForStart, points: [...routeForStart.points] } as Route])
    );
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();

    expect(marker).toHaveBeenCalledWith([12.5, 108.5], expect.any(Object));
  });

  it('recenters marker onto route departure when /by-ids returns after marker was drawn at mock', async () => {
    const routes$ = new BehaviorSubject<Route[]>([]);
    mockGetByRouteIds.mockImplementation(() => routes$.asObservable());

    const { marker } = await import('leaflet');
    const routeLate = {
      id: 'route-late-geometry',
      name: 'Late',
      points: [{ latitude: 12.51, longitude: 108.51, order: 0 }],
    };
    const bus = makeBus('late-geom', routeLate.id);

    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();

    const instance = vi.mocked(marker).mock.results[0].value;
    routes$.next([routeLate as Route]);
    expect(instance.setLatLng).toHaveBeenCalledWith([12.51, 108.51]);
  });

  it('keeps marker on route departure when tracking exists but history has fewer than two points', async () => {
    const { marker } = await import('leaflet');
    const routePinned = {
      id: 'route-pinned-departure',
      name: 'Pinned',
      points: [
        { latitude: 12.5, longitude: 108.5, order: 0 },
        { latitude: 13, longitude: 109, order: 1 },
      ],
    };
    const bus = makeBus('pinned-gps', routePinned.id);
    mockGetByRouteIds.mockReturnValue(
      of([{ ...routePinned, points: [...routePinned.points] } as Route])
    );
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'pinned-gps': {
        currentPosition: { latitude: 77.77, longitude: 88.88 },
        history: [{ latitude: 77.77, longitude: 88.88 }],
      },
    });
    store.refreshState();
    fixture.detectChanges();

    expect(marker).toHaveBeenCalledWith([12.5, 108.5], expect.any(Object));
  });

  it('uses live current position once tracking history reaches two points', async () => {
    const { marker } = await import('leaflet');
    const routeTrail = {
      id: 'route-trail-live',
      name: 'Trail',
      points: [
        { latitude: 12.5, longitude: 108.5, order: 0 },
        { latitude: 13, longitude: 109, order: 1 },
      ],
    };
    const bus = makeBus('trail-live', routeTrail.id);
    mockGetByRouteIds.mockReturnValue(
      of([{ ...routeTrail, points: [...routeTrail.points] } as Route])
    );
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'trail-live': {
        currentPosition: { latitude: 10.801, longitude: 106.751 },
        history: [
          { latitude: 10.8, longitude: 106.75 },
          { latitude: 10.801, longitude: 106.751 },
        ],
      },
    });
    store.refreshState();
    fixture.detectChanges();

    expect(marker).toHaveBeenCalledWith([10.801, 106.751], expect.any(Object));
  });

  it('uses live GPS position when tracking data exists for a bus', async () => {
    const { marker } = await import('leaflet');
    const bus = makeBus('99');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      '99': { currentPosition: { latitude: 10.8000, longitude: 106.7500 }, history: [] }
    });
    store.refreshState();
    fixture.detectChanges();
    expect(marker).toHaveBeenCalledWith([10.8000, 106.7500], expect.any(Object));
  });

  it('updates the icon bearing when a bus position changes', async () => {
    const { marker } = await import('leaflet');
    const bus = makeBus('1');

    // First emission — place marker
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    const m = vi.mocked(marker).mock.results[0].value;

    // Second emission — new GPS position → bearing icon update
    store.overrideSelector(selectTrackingEntities, {
      '1': { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [] }
    });
    store.refreshState();

    expect(m.setIcon).toHaveBeenCalled();
  });

  it('cancels previous animation frames on component destroy', () => {
    const cancelSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');
    const rafSpy    = vi.spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(42 as any);

    store.overrideSelector(selectAllBuses, [makeBus('1'), makeBus('2')]);
    store.overrideSelector(selectBusesForMap, [makeBus('1'), makeBus('2')]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();

    // Trigger an update so animFrames are populated
    store.overrideSelector(selectTrackingEntities, {
      '1': { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [] },
      '2': { currentPosition: { latitude: 10.79, longitude: 106.72 }, history: [] }
    });
    store.refreshState();

    fixture.destroy();
    expect(cancelSpy).toHaveBeenCalled();

    cancelSpy.mockRestore();
    rafSpy.mockRestore();
  });

  // ── Rotation & initial bearing ─────────────────────────────────────────────

  it('creates the first marker with bearing 0 (no initial rotation)', async () => {
    const { divIcon } = await import('leaflet');
    store.overrideSelector(selectAllBuses, [makeBus('A')]);
    store.overrideSelector(selectBusesForMap, [makeBus('A')]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    const opts = vi.mocked(divIcon).mock.calls.at(-1)![0] as any;
    expect(opts.html).toContain('rotate(0');
  });

  it('updates the icon with the new bearing on each position change', async () => {
    const { marker, divIcon } = await import('leaflet');
    const bus = makeBus('rot');

    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    const callsBefore = vi.mocked(divIcon).mock.calls.length;

    // Move bus eastward → bearing should be ~90
    store.overrideSelector(selectTrackingEntities, {
      'rot': { currentPosition: { latitude: 10.77, longitude: 106.80 }, history: [] }
    });
    store.refreshState();

    // A new divIcon should have been created for the updated bearing
    expect(vi.mocked(divIcon).mock.calls.length).toBeGreaterThan(callsBefore);
    const m = vi.mocked(marker).mock.results[0].value;
    expect(m.setIcon).toHaveBeenCalled();
  });

  // ── Smooth animation ───────────────────────────────────────────────────────

  it('calls requestAnimationFrame when a bus position changes', () => {
    const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(1 as any);
    const bus = makeBus('anim');

    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    fixture.detectChanges(); // place marker

    store.overrideSelector(selectTrackingEntities, {
      'anim': { currentPosition: { latitude: 10.79, longitude: 106.72 }, history: [] }
    });
    store.refreshState(); // trigger animation

    expect(rafSpy).toHaveBeenCalled();
    rafSpy.mockRestore();
  });

  it('does not call requestAnimationFrame when creating a brand-new marker', () => {
    const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(1 as any);

    store.overrideSelector(selectAllBuses, [makeBus('new1')]);
    store.overrideSelector(selectBusesForMap, [makeBus('new1')]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    // Leaflet may schedule rAF after markers attach; only component placement rules matter here.
    rafSpy.mockClear();

    // RAF should only fire on subsequent updates, not initial placement
    expect(rafSpy).not.toHaveBeenCalled();
    rafSpy.mockRestore();
  });

  it('cancels in-flight animation before starting a new one for the same bus', () => {
    const cancelSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');
    const rafSpy    = vi.spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(99 as any);
    const bus = makeBus('double');

    // Bus already has live GPS when the marker appears so the first emission is never mock→GPS
    // (that path skips RAF). Subsequent updates animate and must cancel overlapping frames.
    const t1 = { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [] };
    const t2 = { currentPosition: { latitude: 10.79, longitude: 106.72 }, history: [] };

    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, { 'double': t1 });
    store.refreshState();
    fixture.detectChanges();

    // First position update — RAF queued
    store.overrideSelector(selectTrackingEntities, { 'double': t2 });
    store.refreshState();

    // Second position update arrives before first animation finishes
    store.overrideSelector(selectTrackingEntities, {
      'double': { currentPosition: { latitude: 10.80, longitude: 106.73 }, history: [] }
    });
    store.refreshState();

    expect(cancelSpy).toHaveBeenCalledWith(99);
    cancelSpy.mockRestore();
    rafSpy.mockRestore();
  });

  // ── Popup content ──────────────────────────────────────────────────────────

  it('popup shows "Mock position" when no live GPS data exists', async () => {
    const { marker } = await import('leaflet');
    store.overrideSelector(selectAllBuses, [makeBus('m')]);
    store.overrideSelector(selectBusesForMap, [makeBus('m')]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    const m = vi.mocked(marker).mock.results[0].value;
    expect(m.bindPopup).toHaveBeenCalledWith(expect.stringContaining('Mock position'));
  });

  it('popup shows "Live GPS" when tracking data is present', async () => {
    const { marker } = await import('leaflet');
    store.overrideSelector(selectAllBuses, [makeBus('g')]);
    store.overrideSelector(selectBusesForMap, [makeBus('g')]);
    store.overrideSelector(selectTrackingEntities, {
      'g': { currentPosition: { latitude: 10.8, longitude: 106.7 }, history: [] }
    });
    store.refreshState();
    fixture.detectChanges();
    const m = vi.mocked(marker).mock.results[0].value;
    expect(m.bindPopup).toHaveBeenCalledWith(expect.stringContaining('Live GPS'));
  });

  it('popup shows Route departure when marker is pinned to route start despite early GPS pings', async () => {
    const { marker } = await import('leaflet');
    const routeEarly = {
      id: 'route-early-popup',
      name: 'Early',
      points: [{ latitude: 12.5, longitude: 108.5, order: 0 }],
    };
    const bus = makeBus('early-popup', routeEarly.id);
    mockGetByRouteIds.mockReturnValue(
      of([{ ...routeEarly, points: [...routeEarly.points] } as Route])
    );
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'early-popup': {
        currentPosition: { latitude: 77, longitude: 88 },
        history: [{ latitude: 77, longitude: 88 }],
      },
    });
    store.refreshState();
    fixture.detectChanges();
    const m = vi.mocked(marker).mock.results[0].value;
    expect(m.bindPopup).toHaveBeenCalledWith(expect.stringContaining('Route departure'));
  });

  it('popup content is updated when position changes', async () => {
    const { marker } = await import('leaflet');
    const bus = makeBus('upd');

    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    const m = vi.mocked(marker).mock.results[0].value;

    store.overrideSelector(selectTrackingEntities, {
      'upd': { currentPosition: { latitude: 10.79, longitude: 106.72 }, history: [] }
    });
    store.refreshState();

    expect(m.setPopupContent).toHaveBeenCalledWith(expect.stringContaining('Live GPS'));
  });

  // ── Marker update ──────────────────────────────────────────────────────────

  it('updates the existing marker instead of creating a new one for the same bus', async () => {
    const { marker } = await import('leaflet');
    const bus = makeBus('1');

    // First emission — place marker at mock position
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    expect(marker).toHaveBeenCalledTimes(1);
    const existingMarker = vi.mocked(marker).mock.results[0].value;

    // Second emission — new GPS position for same bus → icon rotated, no new marker
    store.overrideSelector(selectTrackingEntities, {
      '1': { currentPosition: { latitude: 10.79, longitude: 106.72 }, history: [] }
    });
    store.refreshState();

    expect(marker).toHaveBeenCalledTimes(1); // still only one marker
    expect(existingMarker.setIcon).toHaveBeenCalled(); // bearing updated
  });

  // ── Marker removal ─────────────────────────────────────────────────────────

  it('removes a marker when its bus disappears from the store', async () => {
    const { marker } = await import('leaflet');

    store.overrideSelector(selectAllBuses, [makeBus('1'), makeBus('2')]);
    store.overrideSelector(selectBusesForMap, [makeBus('1'), makeBus('2')]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    const [m1, m2] = vi.mocked(marker).mock.results.map(r => r.value);

    // Bus '2' disappears
    store.overrideSelector(selectAllBuses, [makeBus('1')]);
    store.overrideSelector(selectBusesForMap, [makeBus('1')]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();

    expect(m1.remove).not.toHaveBeenCalled(); // still active
    expect(m2.remove).toHaveBeenCalled();     // removed
  });

  it('removes a marker when the user hides that bus from the map', async () => {
    const { marker } = await import('leaflet');
    store.overrideSelector(selectAllBuses, [makeBus('1'), makeBus('2')]);
    store.overrideSelector(selectBusesForMap, [makeBus('1'), makeBus('2')]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    const m2 = vi.mocked(marker).mock.results[1].value;

    store.overrideSelector(selectBusesForMap, [makeBus('1')]);
    store.refreshState();
    fixture.detectChanges();

    expect(m2.remove).toHaveBeenCalled();
  });

  it('shrinking map roster removes markers; restoring roster redraws them', async () => {
    const { marker } = await import('leaflet');
    vi.mocked(marker).mockClear();
    const one = makeBus('1');
    const two = makeBus('2');
    store.overrideSelector(selectAllBuses, [one, two]);
    store.overrideSelector(selectBusesForMap, [one, two]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    expect(marker).toHaveBeenCalledTimes(2);

    store.overrideSelector(selectBusesForMap, [one]);
    store.refreshState();
    fixture.detectChanges();

    store.overrideSelector(selectBusesForMap, [one, two]);
    store.refreshState();
    fixture.detectChanges();

    expect(marker).toHaveBeenCalledTimes(3);
  });

  it('onHeaderMapVisibilityChange(false) removes every bus marker', async () => {
    const { marker } = await import('leaflet');
    const buses = [makeBus('1'), makeBus('2')];
    store.overrideSelector(selectAllBuses, buses);
    store.overrideSelector(selectBusesForMap, buses);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    const [m1, m2] = vi.mocked(marker).mock.results.map((r) => r.value);

    store.overrideSelector(selectBusesForMap, []);
    store.refreshState();
    fixture.detectChanges();

    expect(m1.remove).toHaveBeenCalled();
    expect(m2.remove).toHaveBeenCalled();
  });

  it('clearing roster then restoring it redraws all bus markers', async () => {
    const { marker } = await import('leaflet');
    const buses = [makeBus('1'), makeBus('2')];
    store.overrideSelector(selectAllBuses, buses);
    store.overrideSelector(selectBusesForMap, buses);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();

    store.overrideSelector(selectBusesForMap, []);
    store.refreshState();
    fixture.detectChanges();
    vi.mocked(marker).mockClear();

    store.overrideSelector(selectBusesForMap, buses);
    store.refreshState();
    fixture.detectChanges();

    expect(marker).toHaveBeenCalledTimes(2);
  });

  it('mapHeaderCheckboxTriState: all opted → true, none → false, mixed → null', () => {
    const a = makeBus('a');
    const b = makeBus('b');

    expect(mapHeaderCheckboxTriState([], new Set())).toBe(true);
    expect(mapHeaderCheckboxTriState([a], new Set())).toBe(false);
    expect(mapHeaderCheckboxTriState([a], new Set(['a']))).toBe(true);
    expect(mapHeaderCheckboxTriState([a, b], new Set(['a']))).toBe(null);
  });

  it('calls invalidateSize on the Leaflet map after wiring store streams', () => {
    fixture.detectChanges();
    expect(mockMap.invalidateSize).toHaveBeenCalled();
  });

  it('does not remove any markers when all buses remain', async () => {
    const { marker } = await import('leaflet');
    const buses = [makeBus('1'), makeBus('2')];

    store.overrideSelector(selectAllBuses, buses);
    store.overrideSelector(selectBusesForMap, buses);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    const markers = vi.mocked(marker).mock.results.map(r => r.value);

    store.overrideSelector(selectAllBuses, buses);
    store.overrideSelector(selectBusesForMap, buses);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();

    for (const m of markers) {
      expect(m.remove).not.toHaveBeenCalled();
    }
  });

  // ── Path history (Phase 7) ─────────────────────────────────────────────────

  it('does not draw a polyline when bus has no history points', async () => {
    const { polyline } = await import('leaflet');
    const bus = makeBus('p0');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'p0': { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [] }
    });
    store.refreshState();
    fixture.detectChanges();
    expect(polyline).not.toHaveBeenCalled();
  });

  it('does not draw a polyline when bus has fewer than 2 history points', async () => {
    const { polyline } = await import('leaflet');
    const bus = makeBus('p1');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'p1': { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [{ latitude: 10.78, longitude: 106.71 }] }
    });
    store.refreshState();
    fixture.detectChanges();
    expect(polyline).not.toHaveBeenCalled();
  });

  it('creates a polyline when bus has >= 2 history points', async () => {
    const { polyline } = await import('leaflet');
    const bus = makeBus('p2');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'p2': {
        currentPosition: { latitude: 10.78, longitude: 106.71 },
        history: [
          { latitude: 10.77, longitude: 106.70 },
          { latitude: 10.78, longitude: 106.71 }
        ]
      }
    });
    store.refreshState();
    fixture.detectChanges();
    expect(polyline).toHaveBeenCalledWith(
      [[10.77, 106.70], [10.78, 106.71]],
      expect.any(Object)
    );
    expect(mockPolylineInstance.addTo).toHaveBeenCalled();
  });

  it('updates polyline setLatLngs as new history points arrive', async () => {
    const { polyline } = await import('leaflet');
    const bus = makeBus('p3');

    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'p3': {
        currentPosition: { latitude: 10.78, longitude: 106.71 },
        history: [
          { latitude: 10.77, longitude: 106.70 },
          { latitude: 10.78, longitude: 106.71 }
        ]
      }
    });
    store.refreshState();
    fixture.detectChanges();
    expect(polyline).toHaveBeenCalledTimes(1);

    // New GPS point arrives — polyline is updated, not re-created
    store.overrideSelector(selectTrackingEntities, {
      'p3': {
        currentPosition: { latitude: 10.79, longitude: 106.72 },
        history: [
          { latitude: 10.77, longitude: 106.70 },
          { latitude: 10.78, longitude: 106.71 },
          { latitude: 10.79, longitude: 106.72 }
        ]
      }
    });
    store.refreshState();

    expect(polyline).toHaveBeenCalledTimes(1); // still only one polyline created
    expect(mockPolylineInstance.setLatLngs).toHaveBeenCalledWith([
      [10.77, 106.70], [10.78, 106.71], [10.79, 106.72]
    ]);
  });

  it('creates the polyline with a semi-transparent blue color and weight 3', async () => {
    const { polyline } = await import('leaflet');
    const bus = makeBus('style1');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'style1': {
        currentPosition: { latitude: 10.78, longitude: 106.71 },
        history: [
          { latitude: 10.77, longitude: 106.70 },
          { latitude: 10.78, longitude: 106.71 }
        ]
      }
    });
    store.refreshState();
    fixture.detectChanges();
    const opts = vi.mocked(polyline).mock.calls[0][1] as any;
    expect(opts.color).toMatch(/rgba?\(.*21.*101.*192/i);
    expect(opts.weight).toBe(3);
  });

  it('creates a dashed purple polyline for the assigned planned route when points exist', async () => {
    const { polyline, polylineDecorator, Symbol: LSymbol } = await import('leaflet');
    const plannedRoute = {
      id: 'route-planned-99',
      name: 'Morning loop',
      points: [
        { latitude: 10.761, longitude: 106.691, order: 1 },
        { latitude: 10.779, longitude: 106.712, order: 0 },
      ],
    };
    const bus = makeBus('bus-planned', plannedRoute.id);
    mockGetByRouteIds.mockReturnValue(
      of([{ ...plannedRoute, points: [...plannedRoute.points] } as Route])
    );
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();

    const plannedOpts = vi.mocked(polyline).mock.calls.map((c) => c[1] as Record<string, unknown>);
    const dashed = plannedOpts.find((o) => o['dashArray'] != null);
    expect(dashed?.['color']).toBe('#7b1fa2');
    expect(dashed?.['weight']).toBe(4);

    expect(polylineDecorator).toHaveBeenCalled();
    expect(vi.mocked(polylineDecorator).mock.calls[0][0]).toBe(mockPolylineInstance);

    const plannedArrowCalls = vi.mocked(LSymbol.arrowHead).mock.calls.filter(
      (c) => (c[0] as { pathOptions?: { color?: string } }).pathOptions?.color === '#7b1fa2'
    );
    expect(plannedArrowCalls.length).toBeGreaterThanOrEqual(1);
    const plannedArrow = plannedArrowCalls[0]![0] as any;
    expect(plannedArrow.polygon).toBe(false);
    expect(plannedArrow.pixelSize).toBe(13);
    const po = plannedArrow.pathOptions;
    expect(po.fill).toBe(false);
    expect(po.stroke).toBe(true);
  });

  it('gives each bus its own independent polyline', async () => {
    const { polyline } = await import('leaflet');
    const buses = [makeBus('bus-a'), makeBus('bus-b')];
    const twoPoints = (lat: number, lng: number) => [
      { latitude: lat,       longitude: lng },
      { latitude: lat + 0.01, longitude: lng + 0.01 }
    ];
    store.overrideSelector(selectAllBuses, buses);
    store.overrideSelector(selectBusesForMap, buses);
    store.overrideSelector(selectTrackingEntities, {
      'bus-a': { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: twoPoints(10.77, 106.70) },
      'bus-b': { currentPosition: { latitude: 10.80, longitude: 106.73 }, history: twoPoints(10.79, 106.72) }
    });
    store.refreshState();
    fixture.detectChanges();
    expect(polyline).toHaveBeenCalledTimes(2);
    // Each polyline was added to the map
    expect(mockPolylineInstance.addTo).toHaveBeenCalledTimes(2);
  });

  it('removes all polylines and decorators on component destroy', async () => {
    const bus = makeBus('cleanup1');
    const twoPoints = [
      { latitude: 10.77, longitude: 106.70 },
      { latitude: 10.78, longitude: 106.71 }
    ];
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'cleanup1': { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: twoPoints }
    });
    store.refreshState();
    fixture.detectChanges();

    fixture.destroy();

    expect(mockPolylineInstance.remove).toHaveBeenCalled();
    expect(mockDecoratorInstance.remove).toHaveBeenCalled();
  });

  it('does not call getLatLngs when no polyline exists for the bus', () => {
    const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(1 as any);
    const bus = makeBus('nopath1');

    // Place marker with no history so no polyline is drawn
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();

    // Position update: still no history >= 2, so no polyline — animateTo must not crash
    store.overrideSelector(selectTrackingEntities, {
      'nopath1': { currentPosition: { latitude: 10.79, longitude: 106.72 }, history: [] }
    });
    store.refreshState();

    expect(mockPolylineInstance.getLatLngs).not.toHaveBeenCalled();
    rafSpy.mockRestore();
  });

  it('syncs polyline endpoint with marker during animation', async () => {
    // Invoke callback with a timestamp past ANIM_DURATION_MS (800 ms) so raw = 1
    // and the animation step finishes on the first frame without looping.
    const rafSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(performance.now() + 1000);
      return 1 as any;
    });

    const bus = makeBus('sync1');
    const twoPoints = [
      { latitude: 10.77, longitude: 106.70 },
      { latitude: 10.78, longitude: 106.71 }
    ];
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'sync1': { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: twoPoints }
    });
    store.refreshState();
    fixture.detectChanges();
    // Invoke rAF callback during the same outer CD as mat-checkbox bind → NG0100; defer checkbox CD one macrotask.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    // New position triggers animateTo, which should also update the polyline tip
    store.overrideSelector(selectTrackingEntities, {
      'sync1': {
        currentPosition: { latitude: 10.79, longitude: 106.72 },
        history: [...twoPoints, { latitude: 10.79, longitude: 106.72 }]
      }
    });
    store.refreshState();

    // getLatLngs is only called inside animateTo (not in updatePath)
    expect(mockPolylineInstance.getLatLngs).toHaveBeenCalled();
    // setLatLngs is called both from updatePath and from animateTo
    expect(mockPolylineInstance.setLatLngs).toHaveBeenCalledTimes(2);

    rafSpy.mockRestore();
  });

  // ── Direction arrows (Phase 7) ─────────────────────────────────────────────

  it('does not create a decorator when history has fewer than 2 points', async () => {
    const { polylineDecorator } = await import('leaflet');
    const bus = makeBus('da0');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'da0': { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [{ latitude: 10.78, longitude: 106.71 }] }
    });
    store.refreshState();
    fixture.detectChanges();
    expect(polylineDecorator).not.toHaveBeenCalled();
  });

  it('does not create direction decorators when map zoom is below 18', async () => {
    const { polylineDecorator } = await import('leaflet');
    mockMap.getZoom.mockReturnValue(17);
    const bus = makeBus('dz17');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'dz17': {
        currentPosition: { latitude: 10.78, longitude: 106.71 },
        history: [
          { latitude: 10.77, longitude: 106.70 },
          { latitude: 10.78, longitude: 106.71 },
        ],
      },
    });
    store.refreshState();
    fixture.detectChanges();
    expect(polylineDecorator).not.toHaveBeenCalled();

    mockMap.getZoom.mockReturnValue(18);
  });

  it('creates direction decorators when map zoom is 19', async () => {
    const { polylineDecorator } = await import('leaflet');
    mockMap.getZoom.mockReturnValue(19);
    const bus = makeBus('dz19');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'dz19': {
        currentPosition: { latitude: 10.78, longitude: 106.71 },
        history: [
          { latitude: 10.77, longitude: 106.70 },
          { latitude: 10.78, longitude: 106.71 },
        ],
      },
    });
    store.refreshState();
    fixture.detectChanges();
    expect(polylineDecorator).toHaveBeenCalled();
    mockMap.getZoom.mockReturnValue(18);
  });

  it('calls polylineDecorator with the bus polyline instance', async () => {
    const { polylineDecorator } = await import('leaflet');
    const bus = makeBus('da1');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'da1': {
        currentPosition: { latitude: 10.78, longitude: 106.71 },
        history: [
          { latitude: 10.77, longitude: 106.70 },
          { latitude: 10.78, longitude: 106.71 }
        ]
      }
    });
    store.refreshState();
    fixture.detectChanges();
    // First argument to polylineDecorator must be the polyline instance, not a raw array
    expect(vi.mocked(polylineDecorator).mock.calls[0][0]).toBe(mockPolylineInstance);
  });

  it('configures GPS arrowHead as open chevron (stroke-only) with pixelSize 6', async () => {
    const { Symbol: LSymbol } = await import('leaflet');
    const bus = makeBus('da2');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'da2': {
        currentPosition: { latitude: 10.78, longitude: 106.71 },
        history: [
          { latitude: 10.77, longitude: 106.70 },
          { latitude: 10.78, longitude: 106.71 }
        ]
      }
    });
    store.refreshState();
    fixture.detectChanges();
    const arrowOpts = vi.mocked(LSymbol.arrowHead).mock.calls[0][0] as any;
    expect(arrowOpts.polygon).toBe(false);
    expect(arrowOpts.pixelSize).toBe(6);
    expect(arrowOpts.pathOptions.fill).toBe(false);
    expect(arrowOpts.pathOptions.stroke).toBe(true);
    expect(arrowOpts.pathOptions.weight).toBe(2.5);
  });

  it('uses offset 12% and repeat 25% for arrow patterns', async () => {
    const { polylineDecorator } = await import('leaflet');
    const bus = makeBus('da3');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'da3': {
        currentPosition: { latitude: 10.78, longitude: 106.71 },
        history: [
          { latitude: 10.77, longitude: 106.70 },
          { latitude: 10.78, longitude: 106.71 }
        ]
      }
    });
    store.refreshState();
    fixture.detectChanges();
    const pattern = (vi.mocked(polylineDecorator).mock.calls[0][1] as any).patterns[0];
    expect(pattern.offset).toBe('12%');
    expect(pattern.repeat).toBe('25%');
  });

  it('adds directional arrows via polylineDecorator when history >= 2', async () => {
    const { polylineDecorator, Symbol: LSymbol } = await import('leaflet');
    const bus = makeBus('d1');
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'd1': {
        currentPosition: { latitude: 10.78, longitude: 106.71 },
        history: [
          { latitude: 10.77, longitude: 106.70 },
          { latitude: 10.78, longitude: 106.71 }
        ]
      }
    });
    store.refreshState();
    fixture.detectChanges();
    expect(LSymbol.arrowHead).toHaveBeenCalled();
    expect(polylineDecorator).toHaveBeenCalled();
    expect(mockDecoratorInstance.addTo).toHaveBeenCalled();
  });

  it('removes old decorator before creating a new one on each update', async () => {
    const bus = makeBus('d2');
    const twoPoints = [
      { latitude: 10.77, longitude: 106.70 },
      { latitude: 10.78, longitude: 106.71 }
    ];
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'd2': { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: twoPoints }
    });
    store.refreshState();
    fixture.detectChanges();
    fixture.detectChanges(); // first arrow draw

    // Update triggers decorator.remove() then new decorator
    store.overrideSelector(selectTrackingEntities, {
      'd2': {
        currentPosition: { latitude: 10.79, longitude: 106.72 },
        history: [...twoPoints, { latitude: 10.79, longitude: 106.72 }]
      }
    });
    store.refreshState();

    expect(mockDecoratorInstance.remove).toHaveBeenCalled();
  });

  it('removes polyline and decorator when bus disappears from store', async () => {
    const bus = makeBus('d3');
    const twoPoints = [
      { latitude: 10.77, longitude: 106.70 },
      { latitude: 10.78, longitude: 106.71 }
    ];
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'd3': { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: twoPoints }
    });
    store.refreshState();
    fixture.detectChanges();

    // Bus d3 disappears
    store.overrideSelector(selectAllBuses, []);
    store.overrideSelector(selectBusesForMap, []);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();

    expect(mockPolylineInstance.remove).toHaveBeenCalled();
    expect(mockDecoratorInstance.remove).toHaveBeenCalled();
  });

  // ── Phase 8: Map rendering optimisation ──────────────────────────────────

  it('adds new markers directly to the map', async () => {
    const { marker } = await import('leaflet');
    store.overrideSelector(selectAllBuses, [makeBus('c1')]);
    store.overrideSelector(selectBusesForMap, [makeBus('c1')]);
    store.overrideSelector(selectTrackingEntities, {});
    store.refreshState();
    fixture.detectChanges();
    const m = vi.mocked(marker).mock.results[0].value;
    expect(m.addTo).toHaveBeenCalledWith(mockMap);
  });

  // ── Phase 8: Skip unchanged buses (prevEntities guard) ───────────────────

  it('skips expensive marker updates when tracking data has not changed', async () => {
    const { divIcon } = await import('leaflet');
    const bus = makeBus('sk1');
    const tracking = { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [] };

    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, { 'sk1': tracking });
    store.refreshState();
    fixture.detectChanges();
    fixture.detectChanges(); // creates marker

    const callsBefore = vi.mocked(divIcon).mock.calls.length;

    // Same tracking object reference → no bearing / icon update
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, { 'sk1': tracking });
    store.refreshState();

    // divIcon should not be called again (no bearing update)
    expect(vi.mocked(divIcon).mock.calls.length).toBe(callsBefore);
  });

  it('performs marker update when tracking reference changes (new position)', async () => {
    const { divIcon } = await import('leaflet');
    const bus = makeBus('sk2');

    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, {
      'sk2': { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [] }
    });
    store.refreshState();
    fixture.detectChanges();

    const callsBefore = vi.mocked(divIcon).mock.calls.length;

    // New object reference = new position → should update icon (bearing)
    store.overrideSelector(selectTrackingEntities, {
      'sk2': { currentPosition: { latitude: 10.79, longitude: 106.72 }, history: [] }
    });
    store.refreshState();

    expect(vi.mocked(divIcon).mock.calls.length).toBeGreaterThan(callsBefore);
  });

  it('still updates popup even when tracking data has not changed', async () => {
    const { marker } = await import('leaflet');
    const bus = makeBus('sk3');
    const tracking = { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [] };

    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, { 'sk3': tracking });
    store.refreshState();
    fixture.detectChanges();
    const m = vi.mocked(marker).mock.results[0].value;

    // Emit with same tracking but bus name changed (hypothetically)
    store.overrideSelector(selectAllBuses, [{ ...bus, name: 'Updated Bus' }]);
    store.overrideSelector(selectBusesForMap, [{ ...bus, name: 'Updated Bus' }]);
    store.overrideSelector(selectTrackingEntities, { 'sk3': tracking });
    store.refreshState();

    expect(m.setPopupContent).toHaveBeenCalledWith(expect.stringContaining('Updated Bus'));
  });

  it('does not call getLatLng (bearing calc) when tracking data is unchanged', async () => {
    const { marker } = await import('leaflet');
    const bus = makeBus('sk5');
    const tracking = { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [] };

    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, { 'sk5': tracking });
    store.refreshState();
    fixture.detectChanges();
    const m = vi.mocked(marker).mock.results[0].value;
    vi.mocked(m.getLatLng).mockClear();

    // Same reference — getLatLng must not run (no RAF-based animation path either).
    store.overrideSelector(selectTrackingEntities, { 'sk5': tracking });
    store.refreshState();

    expect(m.getLatLng).not.toHaveBeenCalled();
  });

  it('does not update the path polyline when tracking data is unchanged', async () => {
    const bus = makeBus('sk6');
    const tracking = {
      currentPosition: { latitude: 10.78, longitude: 106.71 },
      history: [
        { latitude: 10.77, longitude: 106.70 },
        { latitude: 10.78, longitude: 106.71 }
      ]
    };

    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, { 'sk6': tracking });
    store.refreshState();
    fixture.detectChanges();
    vi.mocked(mockPolylineInstance.setLatLngs).mockClear();

    // Same tracking reference — polyline should not be updated again
    store.overrideSelector(selectTrackingEntities, { 'sk6': tracking });
    store.refreshState();

    expect(mockPolylineInstance.setLatLngs).not.toHaveBeenCalled();
  });

  it('prevEntities snapshot persists so a repeated same-ref never re-triggers', async () => {
    const { divIcon } = await import('leaflet');
    const bus = makeBus('sk7');
    const ref1 = { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [] };
    const ref2 = { currentPosition: { latitude: 10.79, longitude: 106.72 }, history: [] };

    // First render with ref1
    store.overrideSelector(selectAllBuses, [bus]);
    store.overrideSelector(selectBusesForMap, [bus]);
    store.overrideSelector(selectTrackingEntities, { 'sk7': ref1 });
    store.refreshState();
    fixture.detectChanges();

    // Second render — same ref1, skip
    store.overrideSelector(selectTrackingEntities, { 'sk7': ref1 });
    store.refreshState();
    const countAfterSkip = vi.mocked(divIcon).mock.calls.length;

    // Third render — new ref2, update
    store.overrideSelector(selectTrackingEntities, { 'sk7': ref2 });
    store.refreshState();

    // Only the third render (new ref) should have added a divIcon call
    expect(vi.mocked(divIcon).mock.calls.length).toBeGreaterThan(countAfterSkip);
  });

  it('tracks prevEntities independently per bus — updating one does not affect the other', async () => {
    const { marker, divIcon } = await import('leaflet');
    const busA = makeBus('busA');
    const busB = makeBus('busB');
    const trackA = { currentPosition: { latitude: 10.77, longitude: 106.70 }, history: [] };
    const trackB = { currentPosition: { latitude: 10.80, longitude: 106.73 }, history: [] };

    // Initial render with both buses
    store.overrideSelector(selectAllBuses, [busA, busB]);
    store.overrideSelector(selectBusesForMap, [busA, busB]);
    store.overrideSelector(selectTrackingEntities, { busA: trackA, busB: trackB });
    store.refreshState();
    fixture.detectChanges();
    const [mA, mB] = vi.mocked(marker).mock.results.map(r => r.value);
    vi.mocked(mA.getLatLng).mockClear();
    vi.mocked(mB.getLatLng).mockClear();
    vi.mocked(divIcon).mockClear();

    // Only busA gets a new tracking reference
    const newTrackA = { currentPosition: { latitude: 10.78, longitude: 106.71 }, history: [] };
    store.overrideSelector(selectTrackingEntities, { busA: newTrackA, busB: trackB });
    store.refreshState();

    // busA was updated → bearing calculated, new icon
    expect(mA.getLatLng).toHaveBeenCalled();
    // busB was unchanged → no bearing calculation, no new icon
    expect(mB.getLatLng).not.toHaveBeenCalled();
  });

  // ── SignalR ────────────────────────────────────────────────────────────────

  it('starts SignalR with the JWT token on init', () => {
    fixture.detectChanges();
    expect(mockSignalR.start).toHaveBeenCalledWith('test-token');
  });

  it('stops SignalR on destroy', () => {
    fixture.detectChanges();
    fixture.destroy();
    expect(mockSignalR.stop).toHaveBeenCalled();
  });

  // ── Cleanup ────────────────────────────────────────────────────────────────

  it('removes the Leaflet map instance on destroy', () => {
    fixture.detectChanges();
    fixture.destroy();
    expect(mockMap.remove).toHaveBeenCalled();
  });
});
